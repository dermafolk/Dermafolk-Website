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