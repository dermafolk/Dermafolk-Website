import { redirect } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { createClient } from "@/lib/supabase-server";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }

  let user = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  let profile = null;
  try {
    const res = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = res.data;
  } catch {
    // Ignore profile fetch error
  }


  return (
    <SiteShell>
      <main className="section-pad wrap" style={{ minHeight: "70vh" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="kicker">My Account</div>
          <h1 style={{ marginBottom: "32px" }}>Welcome, {profile?.full_name || user.email}</h1>
          
          <div className="admin-card" style={{ marginBottom: "32px" }}>
            <h3 style={{ marginBottom: "16px" }}>Profile Details</h3>
            <p style={{ color: "var(--ink-soft)", marginBottom: "8px" }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ color: "var(--ink-soft)" }}>
              <strong>Name:</strong> {profile?.full_name || "Not provided"}
            </p>
          </div>

          <div className="admin-card" style={{ marginBottom: "32px" }}>
            <h3 style={{ marginBottom: "16px" }}>Order History</h3>
            <p style={{ color: "var(--ink-soft)" }}>You haven&apos;t placed any orders yet.</p>
          </div>

          <form action={logoutAction}>
            <Button type="submit" className="btn btn-outline">
              Sign Out
            </Button>
          </form>
        </div>
      </main>
    </SiteShell>
  );
}
