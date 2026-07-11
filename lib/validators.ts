import { z } from "zod";

export const productImageSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().min(1),
});

export const productInputSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.coerce.number().int().nonnegative(),
  mrp: z.coerce.number().int().nonnegative(),
  discountPercent: z.coerce.number().int().min(0).max(100),
  images: z.array(productImageSchema).min(1),
  active: z.coerce.boolean(),
  category: z.string().trim().optional(),
});

export const homepageSectionSchema = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

export const contactLeadSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  message: z.string().trim().min(10),
});

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  qty: z.coerce.number().int().positive(),
  price: z.coerce.number().int().nonnegative(),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  address: z.string().trim().min(10),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.coerce.number().int().nonnegative(),
  shipping: z.coerce.number().int().nonnegative(),
  total: z.coerce.number().int().nonnegative(),
  paymentMethod: z.enum(["cod", "razorpay"]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  orderStatus: z.enum(["draft", "placed", "fulfilled", "cancelled"]),
});

export const settingsSchema = z.object({
  shippingCharge: z.coerce.number().int().nonnegative(),
  codEnabled: z.coerce.boolean(),
  razorpayEnabled: z.coerce.boolean(),
});
