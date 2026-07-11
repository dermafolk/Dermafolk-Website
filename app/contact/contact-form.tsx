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
    <form ref={formRef} className="contact-form" action={formAction}>
      <div className="contact-form-row">
        <div className="contact-underline-field">
          <label>First Name</label>
          <input name="firstName" type="text" placeholder="John" autoComplete="given-name" />
        </div>
        <div className="contact-underline-field">
          <label>Last Name</label>
          <input name="lastName" type="text" placeholder="Doe" autoComplete="family-name" />
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-underline-field">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="contact-underline-field">
          <label>Phone Number</label>
          <input name="phone" type="tel" placeholder="+91 00000 00000" autoComplete="tel" />
        </div>
      </div>

      <div className="contact-underline-field">
        <label>Your Message</label>
        <textarea name="message" rows={6} placeholder="Write your message..." />
      </div>

      {state.message ? (
        <p
          className="contact-foot-note"
          style={{ color: state.ok ? "var(--forest)" : "var(--accent)" }}
        >
          {state.message}
        </p>
      ) : null}

      <Button className="contact-submit" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>

      <p className="contact-foot-note">Your message will be sent securely to our team.</p>
    </form>
  );
}