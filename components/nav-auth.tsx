"use client";

import { useEffect, useState } from "react";
import { getAuthRoleAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

function MaterialIcon({ children }: { children: string }) {
  return <span className="msi">{children}</span>;
}

export function NavAuth() {
  const [role, setRole] = useState<"admin" | "customer" | null>(null);

  useEffect(() => {
    getAuthRoleAction().then((r) => setRole(r));
  }, []);

  if (role === "admin") {
    return (
      <Button asChild className="btn btn-outline" style={{ padding: '8px 16px', border: '1px solid var(--line)', background: 'transparent' }}>
        <a href="/admin">Admin Dashboard</a>
      </Button>
    );
  }

  if (role === "customer") {
    return (
      <Button asChild className="icon-btn" aria-label="My Account">
        <a href="/account">
          <MaterialIcon>person</MaterialIcon>
        </a>
      </Button>
    );
  }

  return (
    <Button asChild className="icon-btn" aria-label="Log In">
      <a href="/login">
        <MaterialIcon>person</MaterialIcon>
      </a>
    </Button>
  );
}
