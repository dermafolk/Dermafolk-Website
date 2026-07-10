# DermaFolk Remaining Scope Plan

## Source

This plan is based on `docs/DermaFolk_Website_Project_Scope.docx` and the current project state.

## Confirmed Decisions

- Pages must be separated:
  - Home: `/`
  - Shop/Product: `/shop`
  - About: `/about`
  - Contact: `/contact`
- Supabase setup is required.
- Supabase authentication is required.
- Product media should support both Supabase Storage and Cloudinary.
- Real cart and checkout are required.
- Razorpay and COD payment support are required.
- Razorpay client setup is not complete yet, so Razorpay must be disabled by default in admin settings until setup and credentials are available.
- Order creation and admin order management are required.
- Contact lead capture and admin lead management are required.
- Admin dashboard is required.
- Homepage CMS is required.
- Shipping configuration is required.
- Server actions/API routes are required.
- Deployment/version-control work should start only after items 1-12 are finalized.
- Client/project account setup is required for Supabase, Cloudinary or equivalent media storage, Razorpay, GitHub, Vercel, and any additional third-party services.
- Credentials and ownership details must remain client-owned and documented through the agreed secure channel.

## Completed So Far

- Next.js React project scaffold.
- Tailwind CSS configuration.
- shadcn/ui setup started with a reusable `Button` component.
- Home page implemented at `/`.
- Shop/Product page implemented at `/shop`.
- Existing visual design and responsive CSS migrated from the static HTML pages.
- Product page UI behavior migrated to React:
  - gallery image switcher
  - quantity stepper
  - dynamic buy price
  - Add to Bag temporary UI state
  - product details accordion
  - login/signup modal UI
- Existing shared assets are available under `public/`.

## Partially Complete

- Website pages:
  - Home: complete as `/`.
  - Shop: complete as `/shop`.
  - About: currently a Home page section, not a dedicated `/about` page.
  - Contact: currently a footer/contact section, not a dedicated `/contact` page.
- Add to cart:
  - UI feedback exists.
  - No persisted cart or checkout flow exists yet.
- Authentication:
  - Login/signup modal UI exists.
  - No Supabase authentication is connected yet.
- Contact/newsletter:
  - Inputs exist visually.
  - No backend form submission or lead storage exists yet.

## Remaining Work

### 1. App Structure and Pages

- Create separate pages:
  - `app/about/page.tsx`
  - `app/contact/page.tsx`
- Keep existing Home sections if useful, but navigation should point to the dedicated pages.
- Update navigation/footer links.
- Add shared layout components if repetition grows:
  - header
  - footer
  - auth modal
  - product cards/forms

### 2. Supabase Setup

- Use `.env.example` only as the variable reference.
- Do not modify `.env` unless explicitly requested.
- Add Supabase client utilities:
  - browser client for auth/session-aware UI
  - server/admin client for protected server actions or route handlers
- Define database schema for:
  - products
  - homepage content/CMS sections
  - contact leads
  - orders
  - order items
  - shipping settings
  - payment method settings
  - admin users/roles

### 2A. Client Account and Credential Setup

- Confirm required third-party accounts are created and owned by the client:
  - Supabase
  - Cloudinary or equivalent media storage
  - Razorpay: pending client setup
  - GitHub
  - Vercel
  - any additional third-party services required during development
- Confirm credentials are shared and documented only through the agreed secure client channel.
- Do not store secrets in docs.
- Do not modify `.env` unless explicitly requested.
- `.env.example` currently documents Supabase and Cloudinary variables only; Razorpay and deployment-related variables may need to be added later after integration requirements are finalized.

### 3. Authentication

- Connect login/signup UI to Supabase Auth.
- Add logout/session state.
- Protect admin routes.
- Add admin role checks so normal customers cannot access admin dashboard.

### 4. Product Catalog

- Replace hardcoded product details with database-backed product data.
- Support the current single product while keeping schema ready for:
  - multiple products
  - categories
  - product images
  - pricing
  - inventory/status fields
- Add product image/media storage support for both Supabase Storage and Cloudinary.

### 5. Cart and Checkout

- Implement real cart state:
  - add item
  - update quantity
  - remove item
  - calculate subtotal/shipping/total
- Persist cart through local storage, Supabase, or a session-based approach.
- Build checkout form for customer details:
  - name
  - email
  - phone
  - address
- Validate checkout input.

### 6. Payments

- Add configurable payment methods:
  - Razorpay
  - COD
- Default payment settings:
  - Razorpay: disabled by default because client setup is pending.
  - COD: can be enabled by default unless later business rules say otherwise.
- Add Razorpay environment variable requirements to `.env.example` when payment implementation begins.
- Implement Razorpay order creation using server-side APIs.
- Verify Razorpay payment callback/signature on the server.
- Store payment status with the order.
- Respect admin payment method enable/disable settings.

### 7. Orders

- Create order records from checkout.
- Store customer details:
  - name
  - email
  - phone
  - address
- Store order items, totals, payment method, payment status, and order status.
- Add order confirmation UI.
- Add admin order management views.

### 8. Contact Leads

- Connect contact form to backend storage.
- Store submitted leads in Supabase.
- Add admin lead management:
  - list leads
  - view details
  - mark handled/unhandled

### 9. Admin Dashboard

- Build admin UI using the reference recorded in `docs/project-implementation-notes.md`:
  - `https://github.com/shriramsetu/ram-setu/tree/main/src/pages/admin`
- Required admin modules:
  - Product Management CRUD
  - Homepage CMS for hero banners, featured sections, and content
  - Contact lead management
  - Order management with customer details
  - Shipping charge configuration
  - Enable/disable Razorpay and COD
  - Razorpay disabled by default until client setup is complete
- Keep the admin architecture ready for multiple products.

### 10. Homepage CMS

- Move hero/banner/featured/homepage content from hardcoded React data into editable CMS records.
- Add admin forms to update:
  - hero content
  - section text
  - featured product areas
  - banners/images

### 11. Shipping Configuration

- Add database-backed shipping settings.
- Use configured shipping charge during checkout.
- Expose shipping configuration in admin.

### 12. API and Server Actions

- Add server-side APIs or server actions for:
  - auth/session checks
  - product CRUD
  - CMS updates
  - lead submission
  - order creation
  - Razorpay order creation and verification
  - payment method settings
  - shipping settings

### 13. Deployment and Version Control

- Start this phase only after items 1-12 are finalized.
- Confirm GitHub repository setup.
- Prepare Vercel deployment.
- Add required environment variables in Vercel.
- Confirm production build with `npm run build`.
- Test deployed Home, Shop, checkout, auth, and admin flows.

## Recommended Implementation Order

1. Create shared layout components and clean route structure.
2. Create separate `/about` and `/contact` pages.
3. Confirm client-owned account setup for Supabase, Cloudinary/media storage, Razorpay, GitHub, and Vercel.
4. Add Supabase client utilities and database schema.
5. Implement authentication and admin route protection.
6. Move product data into Supabase and connect `/shop`.
7. Implement media support for both Supabase Storage and Cloudinary.
8. Implement cart and checkout without payment first.
9. Implement orders and admin order view.
10. Add Razorpay and COD configuration.
11. Add contact form backend and admin lead management.
12. Build full admin dashboard modules, homepage CMS, shipping configuration, APIs/server actions, and final local QA.
13. Start GitHub/Vercel deployment only after phases 1-12 are finalized.

## Current Risk Notes

- The frontend currently looks functional, but key e-commerce behavior is still only UI.
- `.env` exists and should not be modified without explicit approval.
- `.env.example` does not yet list Razorpay variables; add them only when payment implementation starts and client setup is complete.
- Razorpay must remain disabled in admin defaults until client setup and credentials are ready.
- Admin dashboard visual direction is defined, but implementation has not started.
- The current product page is hardcoded, so it must be connected to database data before it can scale to multiple products.
