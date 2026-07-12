"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        <Link href="/admin">Admin Dashboard</Link>
      </Button>
    );
  }

  if (role === "customer") {
    return (
      <Button asChild className="icon-btn" aria-label="My Account">
        <Link href="/account">
          <MaterialIcon>person</MaterialIcon>
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="icon-btn" aria-label="Log In">
      <Link href="/login">
        <MaterialIcon>person</MaterialIcon>
      </Link>
    </Button>
  );
}
