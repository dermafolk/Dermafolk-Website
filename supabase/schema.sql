-- DermaFolk database schema reference

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price integer not null,
  mrp integer not null,
  discount_percent integer not null default 0,
  images jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text not null,
  body text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  subtotal integer not null,
  shipping integer not null default 0,
  total integer not null,
  payment_method text not null,
  payment_status text not null default 'pending',
  order_status text not null default 'placed',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid,
  name text not null,
  qty integer not null,
  price integer not null
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  shipping_charge integer not null default 0,
  cod_enabled boolean not null default true,
  razorpay_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key,
  role text not null default 'customer',
  full_name text,
  created_at timestamptz not null default now()
);
