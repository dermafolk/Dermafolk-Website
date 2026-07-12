// Seed script (ESM). Loads env from .env (manual parse, trims values),
// then idempotently upserts the initial storefront content.
//
// Run:  node scripts/seed.mjs
// (or:  node --env-file=.env scripts/seed.mjs)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const here = dirname(fileURLToPath(import.meta.url));

// --- Load .env manually (trim values; tolerate a space after '=') ---
function loadEnv(file) {
  let raw;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv(resolve(here, "..", ".env"));
// Also honor --env-file if Node already populated the env (does not clobber above).
if (process.loadEnvFile) {
  try {
    process.loadEnvFile(resolve(here, "..", ".env"));
  } catch {
    /* noop */
  }
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const product = {
  slug: "renewal-serum",
  name: "Dermafolk Renewal Face Wash",
  description:
    "A single fragrance-free face wash formulated at clinical concentrations built to brighten, hydrate and gently resurface.",
  price: 495,
  mrp: 799,
  discount_percent: 38,
  images: [
    { src: "/assets/product-image.webp", alt: "Dermafolk product bottle on a stone tray" },
    { src: "/assets/lady-using-product.webp", alt: "Woman applying Dermafolk face wash" },
    { src: "/assets/banner-image.webp", alt: "Dermafolk product bottle styled with plant shadows" },
  ],
  active: true,
  category: null,
};

const settings = {
  id: SETTINGS_ID,
  shipping_charge: 0,
  cod_enabled: true,
  razorpay_enabled: false,
};

const heroSection = {
  section_key: "hero",
  title: "Brighter, calmer skin in one honest step.",
  body: "Glutathione, niacinamide and mandelic acid in a single fragrance-free face wash.",
};

async function run() {
  // 1) Products (upsert by slug)
  const { error: productError } = await supabase
    .from("products")
    .upsert(product, { onConflict: "slug" });
  if (productError) {
    console.error("products upsert failed:", productError.message);
    process.exit(1);
  }

  // 2) Site settings (upsert by id)
  const { error: settingsError } = await supabase
    .from("site_settings")
    .upsert(settings, { onConflict: "id" });
  if (settingsError) {
    console.error("site_settings upsert failed:", settingsError.message);
    process.exit(1);
  }

  // 3) Homepage sections (upsert by section_key)
  const { error: sectionError } = await supabase
    .from("homepage_sections")
    .upsert(heroSection, { onConflict: "section_key" });
  if (sectionError) {
    console.error("homepage_sections upsert failed:", sectionError.message);
    process.exit(1);
  }

  // Re-query to report counts.
  const [{ count: productCount, error: pcErr }, { count: settingsCount, error: scErr }, { count: sectionCount, error: secErr }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("site_settings").select("*", { count: "exact", head: true }),
      supabase.from("homepage_sections").select("*", { count: "exact", head: true }),
    ]);

  if (pcErr) console.error("count products error:", pcErr.message);
  if (scErr) console.error("count site_settings error:", scErr.message);
  if (secErr) console.error("count homepage_sections error:", secErr.message);

  console.log("Seed complete.");
  console.log(`  products:         ${productCount ?? "?"}`);
  console.log(`  site_settings:    ${settingsCount ?? "?"}`);
  console.log(`  homepage_sections: ${sectionCount ?? "?"}`);
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
