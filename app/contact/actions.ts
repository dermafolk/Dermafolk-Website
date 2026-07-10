"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { contactLeadSchema } from "@/lib/validators";

export type ContactFormState = {
  ok: boolean;
  message: string;
};

export async function submitContactLead(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactLeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form fields.",
    };
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("contact_leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      status: "new",
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  }

  return {
    ok: true,
    message: "Message sent. We will follow up soon.",
  };
}
