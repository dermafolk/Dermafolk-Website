"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import type { ContactLead } from "@/lib/types";
import { markLeadHandledAction, deleteLeadAction } from "@/app/admin/actions";

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

  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteLeadAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    if (state.ok || deleteState.ok) {
      router.refresh();
    }
  }, [state, deleteState, router]);

  const handled = lead.status === "handled";
  const isSubscriber = lead.subject === "Newsletter Subscription" || lead.name === "Newsletter Subscriber";

  return (
    <div className="admin-card">
      <div className="admin-grid-two">
        <div>
          <div className="admin-kicker">Name</div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p style={{ fontWeight: 600 }}>{lead.name}</p>
            {isSubscriber && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                📧 Newsletter Subscriber
              </span>
            )}
          </div>
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

      <div className="flex items-center gap-3 flex-wrap mt-4">
        <form action={formAction}>
          <input type="hidden" name="id" value={lead.id} />
          <input type="hidden" name="handled" value={handled ? "false" : "true"} />
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={pending || deletePending}
            style={{ padding: "8px 14px" }}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{handled ? "Mark unhandled" : "Mark handled"}</span>
          </button>
        </form>

        <form
          action={deleteFormAction}
          onSubmit={(e) => {
            if (!window.confirm("Are you sure you want to delete this lead/subscriber?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={lead.id} />
          <button
            type="submit"
            className="btn btn-outline inline-flex items-center gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40"
            disabled={pending || deletePending}
            style={{ padding: "8px 14px" }}
          >
            {deletePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span>Delete</span>
          </button>
        </form>
      </div>

      {(state.message || deleteState.message) ? (
        <p className="desc" style={{ color: (state.ok || deleteState.ok) ? "#1a7f37" : "#b3261e", marginTop: 12 }}>
          {state.message || deleteState.message}
        </p>
      ) : null}
    </div>
  );
}
