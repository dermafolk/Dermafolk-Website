"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import { submitContactLead, type ContactFormState } from "./actions";

const initialState: ContactFormState = {
  ok: false,
  message: "",
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(submitContactLead, initialState);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} className="modal-card" style={{ maxWidth: "none" }} action={formAction}>
      <div className="field"><label>Name</label><input name="name" type="text" placeholder="Your name" /></div>
      <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" /></div>
      <div className="field"><label>Subject</label><input name="subject" type="text" placeholder="How can we help?" /></div>
      <div className="field"><label>Message</label><textarea name="message" rows={5} placeholder="Write your message..." /></div>
      {state.message ? (
        <p className="desc" style={{ marginBottom: "12px", color: state.ok ? "var(--ink)" : "var(--accent)" }}>
          {state.message}
        </p>
      ) : null}
      <Button className="btn btn-primary modal-submit" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
