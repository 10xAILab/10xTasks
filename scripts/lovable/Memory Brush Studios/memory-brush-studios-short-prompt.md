# Memory Brush Studios - Short Loveable Prompt

Build a production-minded MVP for **Memory Brush Studios**: an Etsy-style web storefront where Airbnb hosts upload a photo of their property, pay, and receive a custom house drawing.

## Goals
- Help hosts buy affordable custom artwork for Airbnb decor
- Let users complete order flow in under 60 seconds
- Validate demand with first paid orders and referrals

## MVP Features
1. Landing page with value proposition, sample drawings, pricing, and trust signals
2. Order page with guest checkout, customer info, and house photo upload
3. Stripe payment flow
4. Instant order confirmation page with order ID
5. Basic order status page + transactional emails (confirmation and delivery)

## Out of Scope (v1)
- Login/accounts
- Marketplace or multi-seller
- Advanced revisions workflow
- Native mobile apps
- Non-house categories (pets, other art types)
- Referral/reward systems

## Required UX
- Warm, artistic, trustworthy, simple
- Etsy-like storefront with premium portfolio polish
- Warm neutral colors, subtle hand-drawn accents
- Serif headlines + clean sans-serif body
- Mobile/tablet-first responsive design

## Tech + Data
- Stack: Next.js, TypeScript, Tailwind, Supabase, Stripe
- Persistence: Supabase Postgres + Storage
- Entities:
  - Customer (name, email)
  - Order (status, price, timestamps)
  - PhotoUpload (order-linked image)
  - ArtworkDelivery (final file URL + delivered date)
- Auth: none for MVP (guest checkout only)

## Edge Cases
- Empty/loading/error states on main screens
- File validation errors (type/size)
- Payment failure/cancel retry flow
- Invalid order ID handling

## Deliverables
1. Complete MVP UI and routes (`/`, `/order`, `/order/[id]`)
2. Testable seed/mock data
3. Integration-ready hooks for Stripe, Supabase, and email provider
4. Short README for setup and extension

## Acceptance Criteria
- User can browse -> upload -> pay -> see confirmation
- Orders and files persist correctly in Supabase
- Status and delivery flow is functional
- UX matches the brand direction

When uncertain, ship a focused MVP over extra features.
