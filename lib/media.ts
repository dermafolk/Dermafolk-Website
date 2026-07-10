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
