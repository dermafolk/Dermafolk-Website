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

export function hasSupabaseEnv() {
  return Boolean(
    (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL) &&
      (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY),
  );
}

export function hasSupabaseServiceEnv() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SECRET_KEY);
}

export function hasAdminBootstrapEnv() {
  return Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && (env.ADMIN_SESSION_SECRET || env.SUPABASE_SECRET_KEY));
}

export function getSupabaseUrl() {
  return env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || null;
}

export function getSupabaseAnonKey() {
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || null;
}
