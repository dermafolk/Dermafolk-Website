import { createClient } from "@supabase/supabase-js";

import {
  env,
  getSupabaseAnonKey,
  getSupabaseUrl,
  hasSupabaseEnv,
  hasSupabaseServiceEnv,
} from "@/lib/env";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseEnv()) return null;
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return null;

  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error("Browser Supabase init error:", err);
    return null;
  }
}

export function createServerSupabaseClient() {
  if (!hasSupabaseServiceEnv()) return null;
  const url = getSupabaseUrl();
  const secretKey = env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secretKey) return null;

  try {
    return createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (err) {
    console.error("Server Supabase init error:", err);
    return null;
  }
}

export function createAdminSupabaseClient() {
  return createServerSupabaseClient();
}

