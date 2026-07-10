"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { createServerSupabaseClient } from "@/lib/supabase";
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
    const { error } = await supabase.from("homepage_sections").upsert({
      section_key: parsed.data.key,
      title: parsed.data.title,
      body: parsed.data.body,
    });

    if (error) {
      return failure(error.message);
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
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid settings.");
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("site_settings").upsert({
      shipping_charge: parsed.data.shippingCharge,
      cod_enabled: parsed.data.codEnabled,
      razorpay_enabled: parsed.data.razorpayEnabled,
    });

    if (error) {
      return failure(error.message);
    }
  }

  return success("Settings saved.");
}
