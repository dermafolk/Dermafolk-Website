import { type ContactLead, type HomepageSection, type Order, type Product, type Settings } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "renewal-serum",
    slug: "renewal-serum",
    name: "Dermafolk Renewal Serum",
    description:
      "A single fragrance-free serum formulated at clinical concentrations built to brighten, hydrate and gently resurface.",
    price: 495,
    mrp: 799,
    discountPercent: 38,
    images: [
      { src: "/product-image.webp", alt: "Dermafolk product bottle on a stone tray with a folded towel and aloe vera" },
      { src: "/lady-using-product.webp", alt: "Woman applying Dermafolk serum during her morning routine" },
      { src: "/banner-image.webp", alt: "Dermafolk product bottle styled with plant shadows and aloe vera" },
    ],
    active: true,
  },
];

export const fallbackSections: HomepageSection[] = [
  {
    key: "hero",
    title: "Brighter, calmer skin in one honest step.",
    body: "Glutathione, niacinamide and mandelic acid in a single fragrance-free serum.",
  },
];

export const fallbackLeads: ContactLead[] = [];
export const fallbackOrders: Order[] = [];

export const fallbackSettings: Settings = {
  shippingCharge: 0,
  codEnabled: true,
  razorpayEnabled: false,
};

export async function getProducts(): Promise<Product[]> {
  return fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  return fallbackSections;
}

export async function getSiteSettings(): Promise<Settings> {
  return fallbackSettings;
}
