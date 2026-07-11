import { env } from "@/lib/env";

export function resolveMediaUrl(source: string) {
  if (!source) return "";
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }
  if (source.startsWith("/")) {
    return source;
  }
  if (source.startsWith("cloudinary:")) {
    const path = source.replace("cloudinary:", "").replace(/^\/+/, "");
    if (!env.CLOUDINARY_CLOUD_NAME) return path;
    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${path}`;
  }
  if (source.startsWith("supabase:")) {
    return source.replace("supabase:", "");
  }
  return source;
}

// NOTE: `uploadProductImage` is only ever invoked from the server action
// `uploadImageAction` (server context). We import the Supabase server client
// lazily so that this module stays safe to import from client components that
// use `resolveMediaUrl` (e.g. product-page / cart-view) — a static top-level
// import would otherwise pull the server Supabase client into the client graph.
export async function uploadProductImage(file: File): Promise<string> {
  const { createServerSupabaseClient } = await import("@/lib/supabase");
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    console.warn("[media] Supabase client unavailable; cannot upload image.");
    throw new Error("Storage is not configured (Supabase client unavailable).");
  }

  const bucket = "product-images";
  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
  });
  // Ignore "already exists" / duplicate bucket errors.
  if (createError && !/already exist/i.test(createError.message)) {
    console.warn(`[media] createBucket warning: ${createError.message}`);
  }

  const safeName = (file.name || "image.png").replace(/[^\w.\-]+/g, "_");
  const path = `${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type || "image/png",
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
