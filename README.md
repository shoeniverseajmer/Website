# SoleLux Commerce

A premium luxury shoe e-commerce platform with a cinematic customer storefront, modern admin/operator dashboard, Express API, and Supabase PostgreSQL/Auth/Storage integration.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router DOM
- State and data: Zustand, TanStack Query, Axios
- Forms: React Hook Form, Zod
- UI polish: Framer Motion, Lucide React, Recharts, react-hot-toast
- Backend: Node.js, Express.js, TypeScript
- Database/Auth/Storage: Supabase PostgreSQL, Supabase Auth, Supabase Storage

## Features

- Customer auth, catalogue, search, filters, product details, cart, wishlist, checkout, delivery/pickup options, order history
- Admin auth gate, analytics, product CRUD structure, multiple image URL/storage support, categories, stock, order status updates, store settings
- Payment structure for COD, Razorpay, and UPI
- Mock data fallback so the app runs before Supabase is configured
- Premium UI inspired by Nike, Adidas, AJIO luxury fashion, Zara, and Apple-level minimalism
- Lazy-loaded routes, reusable motion components, animated cart drawer, product gallery zoom, responsive checkout, and SaaS-style admin UI

## Frontend Architecture

```text
src/
 ├── components/
 │   ├── ui/          # Button, Drawer, Modal, Skeleton, EmptyState, page transitions
 │   ├── shop/        # ProductCard, ProductGrid, ProductGallery, filters, cart drawer
 │   └── admin/       # Dashboard cards and admin tables
 ├── pages/           # Lazy-loaded route screens
 ├── layouts/         # Storefront shell and admin shell
 ├── routes/          # React Router and protected route guards
 ├── store/           # Zustand auth/cart/wishlist state
 ├── hooks/           # TanStack Query hooks
 ├── services/        # Axios API services and Supabase-ready abstractions
 ├── lib/             # Supabase client and mock catalogue data
 ├── types/           # Shared TypeScript domain types
 ├── utils/           # Formatting and slug helpers
 └── styles/          # Tailwind global layer
```

## Component System

- `Button`: animated Framer Motion button variants for primary, secondary, ghost, danger, and muted-gold CTA states.
- `Drawer`: reusable animated right-side drawer used by the cart and mobile filters.
- `Modal`: reusable zoom/detail modal used by product gallery.
- `Skeleton`, `EmptyState`, `SectionHeading`, `PageTransition`: shared polish primitives.
- `ProductGallery`: thumbnail gallery, smooth image transitions, hover zoom, and modal image zoom.
- `ProductCard` and `ProductGrid`: responsive premium cards, loading skeletons, wishlist, sale/bestseller badges.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Add Supabase values to `.env`.

4. In Supabase SQL editor, run:

```bash
supabase/schema.sql
supabase/seed.sql
```

5. Create a Supabase Storage bucket named `product-images`.

6. Start development:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5001`.

## Demo Login

Without Supabase configuration, the frontend uses demo auth:

- Customer: `customer@solelux.test` / `password`
- Admin: `admin@solelux.test` / `password`

## Project Structure

```text
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── routes/
 ├── store/
 ├── hooks/
 ├── services/
 ├── lib/
 ├── types/
 ├── utils/
 ├── context/
 ├── assets/
 └── styles/

server/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── services/
 ├── config/
 ├── utils/
 ├── validations/
 └── index.ts

supabase/
 ├── schema.sql
 └── seed.sql
```

## Production Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.
- Add Razorpay order creation and webhook verification before accepting live online payments.
- Add admin RLS policies or keep admin writes behind the Express API service-role key.
- Move product image uploads through a signed upload flow or backend endpoint before production.
- Add real coupon validation, shipping-rate rules, and tax/invoice logic before launch.
- Replace demo/mock auth fallback with mandatory Supabase Auth in production.

## Pending Backend Integrations

- Razorpay: create server-side order endpoint, verify payment signature, and add webhook handling.
- UPI: connect a payment provider or intent flow and record transaction references.
- Supabase Storage: add signed upload flow for multiple product images.
- Admin policies: enforce operator/admin permissions with database policies or service-role-only API writes.
- Inventory: decrement variant stock inside a database transaction when orders are paid/confirmed.

## Deployment

1. Build the frontend:

```bash
npm run build
```

2. Deploy `dist/` to Vercel, Netlify, or a static host.

3. Deploy `server/` to Render, Railway, Fly.io, or a Node-capable host.

4. Set environment variables from `.env.example` in both frontend and backend environments.

5. In production, set `VITE_API_URL` to the deployed API URL and `CLIENT_URL` to the deployed storefront URL.

6. Run `supabase/schema.sql` and `supabase/seed.sql`, then create the `product-images` bucket in Supabase Storage.
