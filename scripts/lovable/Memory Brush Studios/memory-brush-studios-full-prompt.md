# Memory Brush Studios

Build a production-minded MVP for: Memory Brush Studios

## Product Objective
Create a web app storefront where Airbnb hosts can quickly order affordable custom drawings of their properties. The app should help hosts improve decor and guest perception by commissioning personalized artwork from a submitted house photo, with a simple and trustworthy checkout-to-delivery flow.

## Target Users
- Airbnb hosts and short-term rental property owners
- Secondary (later): homeowners and other custom-art buyers

## Core Outcome
Users should be able to decide to purchase, upload a house photo, and place an order within 60 seconds on first use.

## MVP Scope (Must Have)
1. Landing/sales page with clear value proposition, sample artwork gallery, pricing, and trust-building sections.
2. Order form with photo upload, customer details, and order notes.
3. Stripe-based checkout flow for payment completion.
4. Instant confirmation page after payment with order ID and expected next steps.
5. Basic order status visibility and transactional email updates for confirmation and delivery.

## Out of Scope (Do Not Build Yet)
- User accounts/login/auth
- Marketplace/multi-seller architecture
- Advanced revision rounds/workflow
- Native iOS/Android app
- Additional categories (pets/other custom drawings)
- Referral/rewards/gamification systems

## Required User Flow
1. Landing/onboarding: User arrives on homepage, sees examples, process steps, and pricing.
2. First key action: User starts order, uploads property photo, enters details.
3. Main loop/retention action: User completes payment and checks basic status when needed.
4. Progress or result feedback: User gets instant confirmation and later receives delivered artwork link/file.

## Screens / Routes
- Home (`/`): hero, sample gallery, how-it-works, pricing, CTA.
- Order (`/order`): upload, customer form, summary, checkout trigger.
- Confirmation/Status (`/order/[id]`): order confirmation, current status, delivery section.
- States/modals: upload errors, payment failure/retry, empty gallery placeholders, loading states.

## UX and Visual Direction
- Vibe: warm, artistic, trustworthy, simple
- References: Etsy-style storefront + premium portfolio presentation
- Color/style constraints: warm neutral palette, subtle hand-drawn visual accents
- Typography: elegant serif headings + clean sans-serif body
- Interaction style: fast and frictionless purchase flow
- Accessibility: readable typography, strong contrast, keyboard support, large touch targets

## Data Model (Minimum)
- Customer: id, name, email, created_at
- Order: id, customer_id, status (`received|in_progress|delivered`), price_cents, currency, created_at, updated_at
- PhotoUpload: id, order_id, storage_path, public_url, uploaded_at
- ArtworkDelivery: id, order_id, final_storage_path, final_url, delivered_at
- Relationships:
  - Customer 1->many Orders
  - Order 1->1 PhotoUpload (MVP)
  - Order 0..1 ArtworkDelivery

## Functional Requirements
- Authentication: none in MVP (guest checkout only)
- Persistence: Supabase Postgres + Supabase Storage
- Payments: Stripe Checkout integration with order linkage
- Uploads: validated image upload (type/size checks), stored in Supabase Storage
- Notifications: transactional email for order confirmation and delivery/status updates
- Admin/internal placeholder: simple status update mechanism (can be mock/admin-only in MVP)

## Edge Cases and States
- Empty states when no sample gallery items exist
- Loading/skeleton states for upload, checkout creation, and status fetch
- Upload validation errors (wrong file type, oversized file)
- Payment failures/cancellations with clear retry path
- Missing/invalid order ID handling on status page
- Slow-network handling with resilient UI feedback

## Non-Functional Requirements
- Fast initial load and responsive performance
- Mobile-first design that works well on phones and tablets
- Clean, modular code structure
- Reusable UI components and typed data layer
- Secure handling of payment and file URLs

## Suggested Tech Stack
- Next.js + TypeScript + Tailwind CSS
- Supabase (DB + Storage)
- Stripe (payments)
- Transactional email provider (e.g., Resend or equivalent)

## Deliverables
Please generate:
1. Complete app structure and UI for the MVP
2. Seed/mock examples for gallery and statuses so flows are testable immediately
3. Integration-ready hooks for Stripe, Supabase, and email provider
4. README section covering setup, env vars, and local run instructions

## Acceptance Criteria
- New user can complete order end-to-end: browse -> upload -> pay -> see confirmation
- All MVP screens/routes are connected and functional
- Order, photo upload, and delivery entities persist correctly in Supabase
- Confirmation and status states are visible and understandable
- Empty/loading/error states are implemented and usable
- UX matches warm, artistic, trustworthy, premium-storefront direction

When uncertain, prioritize shipping a focused MVP over adding extra features.
