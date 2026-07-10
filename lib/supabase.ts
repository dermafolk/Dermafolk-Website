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

  return createClient(url, anonKey);
}

export function createServerSupabaseClient() {
  if (!hasSupabaseServiceEnv()) return null;
  return createClient(env.SUPABASE_URL as string, env.SUPABASE_SECRET_KEY as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createAdminSupabaseClient() {
  return createServerSupabaseClient();
}
