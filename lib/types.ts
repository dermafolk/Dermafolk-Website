export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  images: { src: string; alt: string }[];
  active: boolean;
  category?: string;
};

export type HomepageSection = {
  key: string;
  title: string;
  body: string;
};

export type ContactLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "handled";
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "draft" | "placed" | "fulfilled" | "cancelled";
  createdAt: string;
};

export type Settings = {
  shippingCharge: number;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  // Razorpay key_id is not a secret (Razorpay's own Checkout.js needs it in the browser).
  razorpayKeyId: string;
  // The key_secret itself is never included here - only whether one is saved server-side.
  razorpayKeySecretConfigured: boolean;
};
