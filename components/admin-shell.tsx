"use client";

import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/homepage", label: "Homepage CMS" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

type AdminSession = {
  email: string;
  expiresAt: number;
};

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { ok: boolean; session: AdminSession | null }) => {
        if (mounted) setSession(data.ok ? data.session : null);
      })
      .catch(() => {
        if (mounted) setStatus("Could not check admin session.");
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const allowed = Boolean(session);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setBusy(true);
    setStatus(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;
    setBusy(false);

    if (!response.ok || !data?.ok) {
      setStatus(data?.message ?? "Admin sign in failed.");
      return;
    }

    const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
    const sessionData = (await sessionResponse.json().catch(() => null)) as {
      ok?: boolean;
      session?: AdminSession | null;
    } | null;
    setSession(sessionData?.ok ? sessionData.session ?? null : null);
    setPassword("");
  }

  async function handleLogout() {
    setBusy(true);
    setStatus(null);
    const response = await fetch("/api/admin/logout", { method: "POST" });
    setBusy(false);

    if (!response.ok) {
      setStatus("Could not sign out.");
      return;
    }

    setSession(null);
  }

  const router = useRouter();

  useEffect(() => {
    if (!checking && !allowed) {
      router.push("/login");
    }
  }, [checking, allowed, router]);

  if (!allowed) {
    return (
      <main className="admin-login-page">
        <section className="admin-card admin-login-card">
          <div className="admin-kicker">Redirecting to login</div>
          <p className="desc" style={{ marginTop: "12px" }}>Please wait...</p>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="logo">DERMAFOLK</div>
          <p>Admin dashboard</p>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="admin-nav-link">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" type="button" onClick={() => setOpen((value) => !value)}>
            Menu
          </button>
          <div>
            <div className="admin-kicker">Dermafolk control panel</div>
            <h1>Dashboard</h1>
          </div>
          {session ? (
            <Button className="btn btn-primary" type="button" onClick={handleLogout} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span>Sign Out</span>
            </Button>
          ) : null}
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
