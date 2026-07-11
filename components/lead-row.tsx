"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { ContactLead } from "@/lib/types";
import { markLeadHandledAction } from "@/app/admin/actions";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function LeadRow({ lead }: { lead: ContactLead }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(markLeadHandledAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  const handled = lead.status === "handled";

  return (
    <div className="admin-card">
      <div className="admin-grid-two">
        <div>
          <div className="admin-kicker">Name</div>
          <p style={{ fontWeight: 600, marginTop: 4 }}>{lead.name}</p>
          <div className="admin-kicker" style={{ marginTop: 12 }}>Email</div>
          <p className="desc" style={{ marginTop: 4 }}>{lead.email}</p>
          {lead.phone ? (
            <>
              <div className="admin-kicker" style={{ marginTop: 12 }}>Phone</div>
              <p className="desc" style={{ marginTop: 4 }}>{lead.phone}</p>
            </>
          ) : null}
          {lead.subject ? (
            <>
              <div className="admin-kicker" style={{ marginTop: 12 }}>Subject</div>
              <p className="desc" style={{ marginTop: 4 }}>{lead.subject}</p>
            </>
          ) : null}
        </div>
        <div>
          <div className="admin-kicker">Received</div>
          <p className="desc" style={{ marginTop: 4 }}>{formatDate(lead.createdAt)}</p>
          <div className="admin-kicker" style={{ marginTop: 12 }}>Status</div>
          <p className="desc" style={{ marginTop: 4 }}>
            {handled ? "Handled" : "New"}
          </p>
        </div>
      </div>

      <div className="admin-kicker" style={{ marginTop: 16 }}>Message</div>
      <p className="desc" style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{lead.message}</p>

      <form action={formAction} style={{ marginTop: 16 }}>
        <input type="hidden" name="id" value={lead.id} />
        <input type="hidden" name="handled" value={handled ? "false" : "true"} />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending}
          style={{ padding: "8px 14px" }}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>{handled ? "Mark unhandled" : "Mark handled"}</span>
        </button>
      </form>

      {state.message ? (
        <p className="desc" style={{ color: state.ok ? "#1a7f37" : "#b3261e", marginTop: 12 }}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
