"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteProductAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      style={{ display: "inline-flex" }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="btn btn-outline"
        style={{ padding: "8px 12px", color: "#b3261e", borderColor: "#b3261e" }}
        disabled={pending}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        <span>Delete</span>
      </button>
    </form>
  );
}
