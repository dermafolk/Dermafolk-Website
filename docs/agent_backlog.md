# DermaFolk Agent Backlog

Lead Orchestrator state file. Mark `[X]` only after the implementation is locally verified.

## Rules

- Follow `docs/remaining-scope-plan.md`.
- Follow `docs/project-implementation-notes.md`.
- Do not edit `.env`.
- Use `.env.example` only as an environment variable reference.
- Keep Razorpay disabled by default because client setup is pending.
- Defer GitHub/Vercel deployment work until all implementation scope is complete.

## Checklist

- [X] 01. Add shared site shell components for header/footer/auth modal and update existing Home/Shop pages to use them.
  - Owner: Frontend Agent
  - Verification: `npm run build`
- [X] 02. Add dedicated `/about` page and route navigation to it.
  - Owner: Frontend Agent
  - Verification: `/about` renders and `npm run build`
- [X] 03. Add dedicated `/contact` page with a real contact form UI.
  - Owner: Frontend Agent
  - Verification: `/contact` renders and `npm run build`
- [X] 04. Add Supabase dependency, typed env helpers, browser/server/admin clients, and database schema SQL.
  - Owner: Backend/Supabase Agent
  - Verification: `npm run build`
- [X] 05. Add data access layer for products, CMS content, leads, orders, settings, and fallback seed data.
  - Owner: Backend/Supabase Agent
  - Verification: `npm run build`
- [X] 06. Connect Supabase Auth to login/signup UI and expose logout/session-aware account controls.
  - Owner: Auth/Admin Agent
  - Verification: `npm run build`
- [X] 07. Add admin route protection and admin role checks.
  - Owner: Auth/Admin Agent
  - Verification: unauthenticated/admin routes fail closed in code path and `npm run build`
- [X] 08. Replace hardcoded `/shop` product data with data-layer product loading while preserving visual design.
  - Owner: Product/Catalog Agent
  - Verification: `/shop` renders fallback product and `npm run build`
- [X] 09. Add media abstraction for Supabase Storage and Cloudinary image URLs.
  - Owner: CMS/Media Agent
  - Verification: product/gallery images resolve and `npm run build`
- [X] 10. Add real cart state with add/update/remove, totals, and persistence.
  - Owner: Commerce Agent
  - Verification: cart actions update UI and `npm run build`
- [X] 11. Add `/cart`, `/checkout`, and `/order-confirmation` flows.
  - Owner: Commerce Agent
  - Verification: routes render and `npm run build`
- [X] 12. Add COD order creation server action storing customer/order data when Supabase is configured.
  - Owner: Commerce Agent
  - Verification: checkout form calls server action and `npm run build`
- [X] 13. Add payment settings with COD enabled and Razorpay disabled by default.
  - Owner: Commerce/Admin Agent
  - Verification: admin settings show defaults and `npm run build`
- [X] 14. Add contact lead submission server action.
  - Owner: Backend/Supabase Agent
  - Verification: contact form calls server action and `npm run build`
- [X] 15. Build admin dashboard shell matching the referenced admin style.
  - Owner: Auth/Admin Agent
  - Verification: `/admin` renders and `npm run build`
- [X] 16. Add admin Product CRUD UI.
  - Owner: Auth/Admin Agent
  - Verification: product management route renders and `npm run build`
- [X] 17. Add admin Homepage CMS UI.
  - Owner: CMS/Media Agent
  - Verification: CMS route renders and `npm run build`
- [X] 18. Add admin Contact Leads UI.
  - Owner: Auth/Admin Agent
  - Verification: leads route renders and `npm run build`
- [X] 19. Add admin Orders UI.
  - Owner: Commerce/Admin Agent
  - Verification: orders route renders and `npm run build`
- [X] 20. Add admin Shipping and Payment Settings UI.
  - Owner: Commerce/Admin Agent
  - Verification: settings route renders, Razorpay disabled by default, and `npm run build`
- [X] 21. Add server actions/API validation for product CRUD, CMS, leads, orders, and settings.
  - Owner: Backend/Supabase Agent
  - Verification: `npm run build`
- [X] 22. Run final QA: production build and smoke checks for `/`, `/shop`, `/about`, `/contact`, `/cart`, `/checkout`, `/admin`.
  - Owner: QA Agent
  - Verification: all checks pass
- [X] 23. Confirm deployment/GitHub/Vercel phase is intentionally deferred.
  - Owner: Lead Orchestrator
  - Verification: docs note present
