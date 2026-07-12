import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((value) => value?.trim() || undefined);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalText,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalText,
  ADMIN_EMAIL: optionalText,
  ADMIN_PASSWORD: optionalText,
  ADMIN_SESSION_SECRET: optionalText,
  SUPABASE_URL: optionalText,
  SUPABASE_ANON_KEY: optionalText,
  SUPABASE_SECRET_KEY: optionalText,
  CLOUDINARY_CLOUD_NAME: optionalText,
  CLOUDINARY_API_KEY: optionalText,
  CLOUDINARY_API_SECRET: optionalText,
});

export const env = envSchema.parse(process.env);

function isValidUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  if (trimmed.includes("your-supabase-url") || trimmed.toLowerCase().includes("i have this")) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

function isValidKey(key?: string | null): boolean {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (trimmed.length < 10) return false;
  if (trimmed.includes("your-supabase-anon-key") || trimmed.toLowerCase().includes("i have this")) return false;
  return true;
}

export function getSupabaseUrl(): string | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || null;
  return isValidUrl(url) ? url!.trim() : null;
}

export function getSupabaseAnonKey(): string | null {
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || null;
  return isValidKey(key) ? key!.trim() : null;
}

export function hasSupabaseEnv(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function hasSupabaseServiceEnv(): boolean {
  const url = getSupabaseUrl();
  const secretKey = env.SUPABASE_SECRET_KEY || null;
  return Boolean(url && isValidKey(secretKey));
}

export function hasAdminBootstrapEnv(): boolean {
  return Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && (env.ADMIN_SESSION_SECRET || env.SUPABASE_SECRET_KEY));
}

