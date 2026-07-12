"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { contactLeadSchema } from "@/lib/validators";
import { addMemoryLead } from "@/lib/data";
import type { ContactLead } from "@/lib/types";

export type ContactFormState = {
  ok: boolean;
  message: string;
};

export async function submitContactLead(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactLeadSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form fields.",
    };
  }

  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();
  const newLead: ContactLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: fullName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? undefined,
    message: parsed.data.message,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  addMemoryLead(newLead);

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("contact_leads").insert({
        name: fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        status: "new",
      });

      if (error) {
        return {
          ok: false,
          message: error.message,
        };
      }
    } catch (err) {
      console.error("Contact lead submission database error:", err);
      // Gracefully continue so user receives confirmation message when db is offline
    }
  }

  return {
    ok: true,
    message: "Message sent. We will follow up soon.",
  };
}

export async function subscribeNewsletterAction(emailInput: string): Promise<{ ok: boolean; message: string }> {
  const email = emailInput.trim();
  if (!email || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const newLead: ContactLead = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: "Newsletter Subscriber",
    email,
    subject: "Newsletter Subscription",
    message: "Subscribed to Dermafolk restock alerts and formula notes.",
    status: "new",
    createdAt: new Date().toISOString(),
  };

  addMemoryLead(newLead);

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("contact_leads").insert({
        name: newLead.name,
        email: newLead.email,
        subject: newLead.subject,
        message: newLead.message,
        status: newLead.status,
      });
    } catch (err) {
      console.error("Newsletter submission database error:", err);
    }
  }

  return { ok: true, message: "Thank you for subscribing!" };
}