"use client";

import { useEffect, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { HomepageSection } from "@/lib/types";
import { saveHomepageSectionAction } from "@/app/admin/actions";

export function HomepageCmsForm({ sections }: { sections: HomepageSection[] }) {
  const router = useRouter();
  const hero = sections.find((s) => s.key === "hero") ?? null;

  const [state, formAction, pending] = useActionState(saveHomepageSectionAction, {
    ok: false,
    message: "",
  });
  const [title, setTitle] = useState(hero?.title ?? "");
  const [body, setBody] = useState(hero?.body ?? "");

  // Keep fields in sync if a different hero arrives after refresh.
  useEffect(() => {
    setTitle(hero?.title ?? "");
    setBody(hero?.body ?? "");
  }, [hero?.title, hero?.body]);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <section className="admin-stack">
      <div className="admin-card">
        <h2>Homepage CMS</h2>
        <p>Edit the homepage hero copy. Saved content is stored in Supabase.</p>
      </div>

      <div className="admin-card">
        <h3>Hero section</h3>
        <form action={formAction} className="admin-stack">
          <input type="hidden" name="key" value="hero" />
          <div className="field">
            <label>Title</label>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hero headline"
              required
            />
          </div>
          <div className="field">
            <label>Body</label>
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Hero subtext"
              required
            />
          </div>

          {state.message ? (
            <p className="desc" style={{ color: state.ok ? "#1a7f37" : "#b3261e" }}>
              {state.message}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Save hero</span>
          </button>
        </form>
      </div>

      {sections
        .filter((s) => s.key !== "hero")
        .map((section) => (
          <div key={section.key} className="admin-card">
            <h3>{section.title}</h3>
            <p className="desc">{section.body}</p>
          </div>
        ))}
    </section>
  );
}
