"use server";

import { redirect } from "next/navigation";
import { validateAdminCredentials, setAdminSessionCookie, clearAdminSessionCookie, getAdminSession } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase-server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // 1. Check if the user is an admin
  if (validateAdminCredentials(email, password)) {
    const success = await setAdminSessionCookie(email);
    if (success) {
      redirect("/admin");
    } else {
      return { error: "Could not set admin session" };
    }
  }

  // 2. If not admin, attempt customer login via Supabase
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Database not configured yet. Please set valid Supabase URL and keys in your .env file." };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Authentication error" };
  }

  // Redirect to customer dashboard
  redirect("/account");
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Database not configured yet. Please set valid Supabase URL and keys in your .env file." };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Insert profile manually if needed, or if triggers aren't set up
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            role: "customer",
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error("Could not create profile record:", profileError);
      }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Registration error" };
  }

  // Redirect to customer dashboard
  redirect("/account");
}

export async function logoutAction() {
  // Clear admin session
  await clearAdminSessionCookie();

  // Clear customer session
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore signOut errors during logout
  }

  redirect("/login");
}

export async function getAuthRoleAction(): Promise<"admin" | "customer" | null> {
  try {
    const admin = await getAdminSession();
    if (admin) return "admin";

    const supabase = await createClient();
    if (!supabase) return null;

    const { data } = await supabase.auth.getUser();
    if (data?.user) return "customer";

    return null;
  } catch {
    return null;
  }
}

