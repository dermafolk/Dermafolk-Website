"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase";

function MaterialIcon({ children }: { children: string }) {
  return <span className="msi">{children}</span>;
}

export function SiteHeader({
  onOpenAuth,
  session,
  onLogout,
}: {
  onOpenAuth: () => void;
  session: Session | null;
  onLogout: () => void;
}) {
  return (
    <header>
      <div className="nav">
        <a href="/" className="logo">DERMAFOLK</a>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="nav-cta">
          {session ? (
            <Button className="btn btn-primary" type="button" onClick={onLogout}>
              Sign Out
            </Button>
          ) : (
            <Button className="icon-btn" onClick={onOpenAuth} aria-label="Account / Login">
              <MaterialIcon>person</MaterialIcon>
            </Button>
          )}
          <Button asChild className="btn btn-primary">
            <a href="/shop#buy-panel">Buy Now</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="/" className="logo" style={{ marginBottom: "16px", display: "inline-block" }}>DERMAFOLK</a>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", maxWidth: "260px" }}>
              One renewal serum, formulated to replace the routine - made in small batches and refillable for life.
            </p>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a href="/shop">Renewal Serum</a></li>
              <li><a href="/#formula">Refill Bottle</a></li>
              <li><a href="/contact">Gift Set</a></li>
            </ul>
          </div>
          <div>
            <h5>Learn</h5>
            <ul>
              <li><a href="/#formula">The Formula</a></li>
              <li><a href="/#ritual">The Ritual</a></li>
              <li><a href="/#reviews">Reviews</a></li>
              <li><a href="/contact">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5>Stay Updated</h5>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", marginBottom: "18px" }}>Restock alerts and formula notes, once a month.</p>
            <div className="footer-form">
              <input type="email" placeholder="Email address" aria-label="Email address" />
              <button aria-label="Subscribe"><MaterialIcon>arrow_forward</MaterialIcon></button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>(c) 2026 Dermafolk Skincare. All rights reserved.</span>
          <span>Made with recyclable glass, always.</span>
        </div>
      </div>
    </footer>
  );
}

function AuthModal({
  open,
  onClose,
  session,
  onSessionChange,
}: {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  onSessionChange: (session: Session | null) => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<"login" | "signup" | "logout" | null>(null);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (session) {
      setTab("login");
    }
    setStatus(null);
  }, [open, session]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    setBusy("login");
    setStatus(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(null);

    if (error) {
      setStatus(error.message);
      return;
    }

    onSessionChange(data.session);
    onClose();
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    setBusy("signup");
    setStatus(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setBusy(null);

    if (error) {
      setStatus(error.message);
      return;
    }

    onSessionChange(data.session ?? null);
    setStatus(data.session ? "Account created." : "Check your email to confirm the account.");
    if (data.session) onClose();
  }

  async function handleLogout() {
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    setBusy("logout");
    setStatus(null);
    const { error } = await supabase.auth.signOut();
    setBusy(null);

    if (error) {
      setStatus(error.message);
      return;
    }

    onSessionChange(null);
    onClose();
  }

  return (
    <div
      className={`modal-overlay ${open ? "active" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
          <MaterialIcon>close</MaterialIcon>
        </button>
        {session ? (
          <div className="modal-panel active">
            <div className="field">
              <label>Signed in as</label>
              <input type="text" value={session.user.email ?? "Account"} readOnly />
            </div>
            <div className="field">
              <label>Status</label>
              <input type="text" value="Session connected to Supabase Auth." readOnly />
            </div>
            {status ? <p className="desc" style={{ marginBottom: "12px" }}>{status}</p> : null}
            <Button className="btn btn-primary modal-submit" type="button" onClick={handleLogout} disabled={busy === "logout"}>
              {busy === "logout" ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        ) : (
          <>
            <div className="modal-tabs">
              <button className={`modal-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")} type="button">Log In</button>
              <button className={`modal-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")} type="button">Sign Up</button>
            </div>
            <form className={`modal-panel ${tab === "login" ? "active" : ""}`} onSubmit={handleLogin}>
              <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" /></div>
              <div className="field"><label>Password</label><input name="password" type="password" placeholder="password" /></div>
              {status ? <p className="desc" style={{ marginBottom: "12px" }}>{status}</p> : null}
              <Button className="btn btn-primary modal-submit" type="submit" disabled={busy === "login"}>
                {busy === "login" ? "Logging in..." : "Log In"}
              </Button>
            </form>
            <form className={`modal-panel ${tab === "signup" ? "active" : ""}`} onSubmit={handleSignup}>
              <div className="field"><label>Full name</label><input name="fullName" type="text" placeholder="Your name" /></div>
              <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" /></div>
              <div className="field"><label>Password</label><input name="password" type="password" placeholder="Create a password" /></div>
              {status ? <p className="desc" style={{ marginBottom: "12px" }}>{status}</p> : null}
              <Button className="btn btn-primary modal-submit" type="submit" disabled={busy === "signup"}>
                {busy === "signup" ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    if (!supabase) {
      setAuthOpen(true);
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <>
      <SiteHeader
        onOpenAuth={() => setAuthOpen(true)}
        session={session}
        onLogout={handleLogout}
      />
      {children}
      <SiteFooter />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        session={session}
        onSessionChange={setSession}
      />
    </>
  );
}
