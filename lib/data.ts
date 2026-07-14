import { type ContactLead, type HomepageSection, type Order, type Product, type Settings } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase";

// Fixed row id for the single site_settings record (see scripts/seed.mjs).
// Exported (rather than defined in lib/razorpay.ts) so this file - which is
// imported by client components for fallbackProducts - never pulls in the
// `server-only`-guarded Razorpay credential helpers.
export const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export const fallbackProducts: Product[] = [
  {
    id: "renewal-serum",
    slug: "renewal-serum",
    name: "Dermafolk Renewal Face Wash",
    description:
      "A single fragrance-free face wash formulated at clinical concentrations built to brighten, hydrate and gently resurface.",
    price: 499,
    mrp: 799,
    discountPercent: 38,
    images: [
      { src: "/assets/product-image.webp", alt: "Dermafolk product bottle on a stone tray with a folded towel and aloe vera" },
      { src: "/assets/lady-using-product.webp", alt: "Woman applying Dermafolk face wash during her morning routine" },
      { src: "/assets/banner-image.webp", alt: "Dermafolk product bottle styled with plant shadows and aloe vera" },
    ],
    active: true,
  },
];

export const fallbackSections: HomepageSection[] = [
  {
    key: "hero",
    title: "Brighter, calmer skin in one honest step.",
    body: "Glutathione, niacinamide and mandelic acid in a single fragrance-free face wash.",
  },
];

const globalForData = globalThis as unknown as {
  __dermafolkLeads?: ContactLead[];
};

export function getFallbackLeads(): ContactLead[] {
  if (!globalForData.__dermafolkLeads) {
    globalForData.__dermafolkLeads = [
      {
        id: "seed-sub-1",
        name: "Newsletter Subscriber",
        email: "priya.sharma@example.com",
        subject: "Newsletter Subscription",
        message: "Subscribed to Dermafolk restock alerts and formula notes.",
        status: "new",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return globalForData.__dermafolkLeads;
}

export function addMemoryLead(lead: ContactLead) {
  const list = getFallbackLeads();
  list.unshift(lead);
}

export function deleteMemoryLead(id: string) {
  const list = getFallbackLeads();
  const index = list.findIndex((l) => l.id === id);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

export function updateMemoryLeadStatus(id: string, status: "new" | "handled") {
  const list = getFallbackLeads();
  const item = list.find((l) => l.id === id);
  if (item) {
    item.status = status;
  }
}

export const fallbackLeads: ContactLead[] = [];
export const fallbackOrders: Order[] = [];

export const fallbackSettings: Settings = {
  shippingCharge: 0,
  codEnabled: true,
  razorpayEnabled: false,
  razorpayKeyId: "",
  razorpayKeySecretConfigured: false,
};

function mapProductRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    mrp: row.mrp,
    discountPercent: row.discount_percent,
    images: row.images ?? [],
    active: row.active,
    category: row.category ?? undefined,
  };
}

function mapSectionRow(row: any): HomepageSection {
  return {
    key: row.section_key,
    title: row.title,
    body: row.body,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackProducts;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return fallbackProducts;
    return data.map(mapProductRow);
  } catch {
    return fallbackProducts;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackProducts;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return fallbackProducts;
    return data.map(mapProductRow);
  } catch {
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return fallbackProducts.find((product) => product.slug === slug) ?? null;
    }
    return mapProductRow(data);
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackSections;

  try {
    const { data, error } = await supabase.from("homepage_sections").select("*");

    if (error || !data || data.length === 0) return fallbackSections;
    return data.map(mapSectionRow);
  } catch {
    return fallbackSections;
  }
}

export async function getContactLeads(): Promise<ContactLead[]> {
  const localLeads = getFallbackLeads();
  const supabase = createServerSupabaseClient();
  if (!supabase) return localLeads;

  try {
    const { data, error } = await supabase
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return localLeads;
    const dbLeads: ContactLead[] = data.map((row: any): ContactLead => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? undefined,
      subject: row.subject ?? undefined,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    }));

    const seen = new Set(dbLeads.map((l) => l.id));
    for (const lead of localLeads) {
      if (!seen.has(lead.id)) {
        dbLeads.unshift(lead);
        seen.add(lead.id);
      }
    }
    return dbLeads;
  } catch {
    return localLeads;
  }
}

export async function getOrders(): Promise<Order[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackOrders;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !data) return fallbackOrders;
    return data.map((row: any): Order => ({
      id: row.id,
      customerName: row.customer_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      items: (row.order_items ?? []).map((o: {
        product_id: string;
        name: string;
        qty: number;
        price: number;
      }) => ({
        productId: o.product_id,
        name: o.name,
        qty: o.qty,
        price: o.price,
      })),
      subtotal: row.subtotal,
      shipping: row.shipping,
      total: row.total,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      createdAt: row.created_at,
    }));
  } catch {
    return fallbackOrders;
  }
}

export async function getSiteSettings(): Promise<Settings> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackSettings;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    if (error || !data) return fallbackSettings;

    return {
      shippingCharge: data.shipping_charge,
      codEnabled: data.cod_enabled,
      razorpayEnabled: data.razorpay_enabled,
      razorpayKeyId: data.razorpay_key_id ?? "",
      razorpayKeySecretConfigured: Boolean(data.razorpay_key_secret),
    };
  } catch {
    return fallbackSettings;
  }
}
