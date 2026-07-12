"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";

export function AuthPage({ initialTab = "login" }: { initialTab?: "login" | "signup" }) {
  const [tab, setTab] = useState(initialTab);
  
  const [loginState, loginFormAction, isLoginPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  const [signupState, signupFormAction, isSignupPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await signupAction(formData);
    },
    null
  );

  return (
    <SiteShell>
      <main style={{
        position: 'relative', 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url(/assets/banner-image.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20, 16, 12, 0.7)', backdropFilter: 'blur(6px)' }} />
        
        <div className="auth-modal" style={{ position: 'relative', zIndex: 10, background: 'var(--bg)', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
          <Link href="/" style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--ink-soft)', padding: '8px', borderRadius: '50%', background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} aria-label="Close">
            <X className="h-4 w-4" />
          </Link>
          
          <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '8px', paddingLeft: '32px', paddingRight: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
              Welcome to Dermafolk
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>
              {tab === 'login' ? "Sign in to access your account" : "Create an account to get started"}
            </p>
          </div>

          <div className="auth-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--line)', margin: '0 32px' }}>
            <button 
              type="button"
              onClick={() => setTab('login')}
              style={{
                flex: 1, padding: '12px 0', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                background: 'none', border: 'none', 
                borderBottom: `2px solid ${tab === 'login' ? 'var(--ink)' : 'transparent'}`,
                color: tab === 'login' ? 'var(--ink)' : 'var(--ink-soft)',
                transition: 'all 0.2s'
              }}
            >
              Log In
            </button>
            <button 
              type="button"
              onClick={() => setTab('signup')}
              style={{
                flex: 1, padding: '12px 0', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                background: 'none', border: 'none', 
                borderBottom: `2px solid ${tab === 'signup' ? 'var(--ink)' : 'transparent'}`,
                color: tab === 'signup' ? 'var(--ink)' : 'var(--ink-soft)',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-content" style={{ padding: '24px 32px 32px 32px' }}>
            {tab === 'login' && (
              <form action={loginFormAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Email Address</label>
                  <input name="email" type="email" placeholder="you@example.com" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg)', marginTop: '4px', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Password</label>
                  <input name="password" type="password" placeholder="••••••••" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg)', marginTop: '4px', fontSize: '15px' }} />
                </div>
                <Button className="btn btn-primary" type="submit" disabled={isLoginPending} style={{ width: '100%', marginTop: '8px', background: 'var(--ink)', color: 'white', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                  {isLoginPending && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />}
                  <span>{isLoginPending ? "Signing in..." : "Log In"}</span>
                </Button>
                {loginState?.error && <p className="desc" style={{ marginTop: "8px", color: "var(--destructive)", textAlign: 'center' }}>{loginState.error}</p>}
              </form>
            )}

            {tab === 'signup' && (
              <form action={signupFormAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Full Name</label>
                  <input name="fullName" type="text" placeholder="Jane Doe" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg)', marginTop: '4px', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Email Address</label>
                  <input name="email" type="email" placeholder="you@example.com" required style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg)', marginTop: '4px', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Password</label>
                  <input name="password" type="password" placeholder="••••••••" required minLength={6} style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg)', marginTop: '4px', fontSize: '15px' }} />
                </div>
                <Button className="btn btn-primary" type="submit" disabled={isSignupPending} style={{ width: '100%', marginTop: '8px', background: 'var(--ink)', color: 'white', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                  {isSignupPending && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />}
                  <span>{isSignupPending ? "Creating account..." : "Sign Up"}</span>
                </Button>
                {signupState?.error && <p className="desc" style={{ marginTop: "8px", color: "var(--destructive)", textAlign: 'center' }}>{signupState.error}</p>}
              </form>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
