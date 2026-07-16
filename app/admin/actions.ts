"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { createServerSupabaseClient } from "@/lib/supabase";
import { uploadProductImage } from "@/lib/media";
import { deleteMemoryLead, updateMemoryLeadStatus, SETTINGS_ID } from "@/lib/data";
import {
  homepageSectionSchema,
  productInputSchema,
  settingsSchema,
} from "@/lib/validators";

export type AdminActionState = {
  ok: boolean;
  message: string;
};

function success(message: string): AdminActionState {
  return { ok: true, message };
}

function failure(message: string): AdminActionState {
  return { ok: false, message };
}

async function requireAdminSession() {
  const session = await getAdminSession();
  return Boolean(session);
}

export async function saveProductAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    return failure("Invalid product images.");
  }

  const parsed = productInputSchema.safeParse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    mrp: formData.get("mrp"),
    discountPercent: formData.get("discountPercent"),
    images,
    active: formData.get("active") ?? false,
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid product.");
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("products").upsert({
        id: parsed.data.id,
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        mrp: parsed.data.mrp,
        discount_percent: parsed.data.discountPercent,
        images: parsed.data.images,
        active: parsed.data.active,
        category: parsed.data.category ?? null,
      });

      if (error) {
        return failure(error.message);
      }
    } catch (err) {
      return failure(err instanceof Error ? err.message : "Database error");
    }
  }

  return success("Product saved.");
}

export async function saveHomepageSectionAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const parsed = homepageSectionSchema.safeParse({
    key: formData.get("key"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid section.");
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("homepage_sections").upsert({
        section_key: parsed.data.key,
        title: parsed.data.title,
        body: parsed.data.body,
      });

      if (error) {
        return failure(error.message);
      }
    } catch (err) {
      return failure(err instanceof Error ? err.message : "Database error");
    }
  }

  return success("Homepage section saved.");
}

export async function saveSettingsAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const parsed = settingsSchema.safeParse({
    shippingCharge: formData.get("shippingCharge"),
    codEnabled: formData.get("codEnabled") === "on" || formData.get("codEnabled") === "true",
    razorpayEnabled: formData.get("razorpayEnabled") === "on" || formData.get("razorpayEnabled") === "true",
    razorpayKeyId: formData.get("razorpayKeyId"),
    razorpayKeySecret: formData.get("razorpayKeySecret"),
    razorpayWebhookSecret: formData.get("razorpayWebhookSecret"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid settings.");
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, unknown> = {
        id: SETTINGS_ID,
        shipping_charge: parsed.data.shippingCharge,
        cod_enabled: parsed.data.codEnabled,
        razorpay_enabled: parsed.data.razorpayEnabled,
        razorpay_key_id: parsed.data.razorpayKeyId || null,
      };

      // Only touch the secret columns if a new value was actually entered -
      // an empty field means "keep whatever is already saved".
      if (parsed.data.razorpayKeySecret) {
        payload.razorpay_key_secret = parsed.data.razorpayKeySecret;
      }
      if (parsed.data.razorpayWebhookSecret) {
        payload.razorpay_webhook_secret = parsed.data.razorpayWebhookSecret;
      }

      const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });

      if (error) {
        return failure(error.message);
      }
    } catch (err) {
      return failure(err instanceof Error ? err.message : "Database error");
    }
  }

  return success("Settings saved.");
}

export async function deleteProductAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return failure("Product id is required.");
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return failure("Database connection unavailable.");
  }

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return failure(error.message);
    }
  } catch (err) {
    return failure(err instanceof Error ? err.message : "Database error");
  }

  return success("Product deleted.");
}

export async function markLeadHandledAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return failure("Lead id is required.");
  }

  const handledValue = String(formData.get("handled") ?? "");
  const handled = handledValue === "true" || handledValue === "on";

  updateMemoryLeadStatus(id, handled ? "handled" : "new");

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return success(handled ? "Lead marked handled." : "Lead marked unhandled.");
  }

  try {
    const { error } = await supabase
      .from("contact_leads")
      .update({ status: handled ? "handled" : "new" })
      .eq("id", id);

    if (error) {
      return failure(error.message);
    }
  } catch (err) {
    return failure(err instanceof Error ? err.message : "Database error");
  }

  return success(handled ? "Lead marked handled." : "Lead marked unhandled.");
}

export async function deleteLeadAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return failure("Lead id is required.");
  }

  deleteMemoryLead(id);

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("contact_leads")
        .delete()
        .eq("id", id);

      if (error) {
        return failure(error.message);
      }
    } catch (err) {
      return failure(err instanceof Error ? err.message : "Database error");
    }
  }

  return success("Lead/subscriber deleted successfully.");
}

export async function updateOrderStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdminSession())) {
    return failure("Admin session required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id) {
    return failure("Order id is required.");
  }

  const allowed = ["placed", "fulfilled", "cancelled"] as const;
  if (!allowed.includes(status as (typeof allowed)[number])) {
    return failure("Invalid order status.");
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return failure("Database connection unavailable.");
  }

  try {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);

    if (error) {
      return failure(error.message);
    }
  } catch (err) {
    return failure(err instanceof Error ? err.message : "Database error");
  }

  return success("Order status updated.");
}


export async function uploadImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  if (!(await requireAdminSession())) {
    return { error: "Admin session required." };
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return { error: "No file provided." };
  }

  try {
    const url = await uploadProductImage(file as File);
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }
}
