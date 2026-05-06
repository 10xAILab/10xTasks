# Memory Brush Studios - Product Spec (MVP)

## Overview
Memory Brush Studios is a web storefront for ordering custom house drawings.  
Initial target customers are Airbnb hosts who want affordable, personalized wall art for their properties.

## Problem
Airbnb hosts want unique decor that reflects their actual property, but commissioned artwork is often expensive or hard to order quickly.

## Solution
Provide a simple order flow where customers:
1. View examples and pricing
2. Upload a house photo
3. Pay online
4. Receive confirmation and final artwork delivery

## Target Users
- Primary: Airbnb hosts and short-term rental property owners
- Secondary (later): homeowners and other custom-art buyers

## MVP Goals
- Validate demand with first paid orders
- Enable complete order flow in under 60 seconds
- Deliver a trustworthy purchase experience on mobile, tablet, and desktop

## Success Metrics (First 30 Days)
- First paid orders completed end-to-end
- Payment completion rate from initiated checkouts
- Time from payment to delivered artwork
- Percentage of customers who refer or reorder later

## Scope
### In Scope (MVP)
- Landing page with gallery, pricing, and trust signals
- Guest checkout (no login)
- House photo upload during order
- Stripe payment integration
- Instant confirmation page with order ID
- Basic order status view
- Transactional emails for confirmation and delivery

### Out of Scope (MVP)
- User accounts/authentication
- Marketplace/multi-seller features
- Advanced revisions workflow
- Native iOS/Android app
- Additional drawing categories (pets/other custom themes)
- Rewards/referrals/gamification

## User Flow
1. User lands on homepage and reviews samples/pricing.
2. User starts order and uploads house photo.
3. User enters customer details and completes Stripe checkout.
4. User sees instant confirmation and receives email confirmation.
5. User checks status page as needed and receives delivered artwork link/file.

## Functional Requirements
- **Platform:** Web app, mobile/tablet responsive
- **Auth:** None (guest checkout only)
- **Data persistence:** Supabase Postgres
- **File storage:** Supabase Storage
- **Payments:** Stripe Checkout
- **Notifications:** Transactional email provider (e.g., Resend)
- **Order statuses:** `received`, `in_progress`, `delivered`

## Data Model
- **Customer**
  - id
  - name
  - email
  - created_at
- **Order**
  - id
  - customer_id
  - status
  - price_cents
  - currency
  - created_at
  - updated_at
- **PhotoUpload**
  - id
  - order_id
  - storage_path
  - public_url
  - uploaded_at
- **ArtworkDelivery**
  - id
  - order_id
  - final_storage_path
  - final_url
  - delivered_at

## UX and Brand Direction
- Tone: warm, artistic, trustworthy, simple
- Feel: Etsy-like storefront with premium portfolio quality
- Style: warm neutrals, subtle hand-drawn accents
- Typography: serif display headings + clean sans-serif body

## Non-Functional Requirements
- Fast initial page load
- Responsive layout for phone/tablet/desktop
- Clear empty/loading/error states
- File type/size validation on upload
- Reliable payment and order state handling

## Edge Cases
- Invalid file type or oversized upload
- Payment failure or canceled checkout
- Missing or invalid order ID on status route
- No gallery content available (empty state)
- Slow network responses (loading feedback)

## Suggested Technical Stack
- Next.js
- TypeScript
- Tailwind CSS
- Supabase (DB + Storage)
- Stripe
- Transactional email provider

## Acceptance Criteria
- User can complete: browse -> upload -> pay -> confirmation
- Orders and uploaded files persist correctly
- Status page reflects current order state
- Delivery record can be attached to an order
- Email confirmations are sent for order and delivery
- UI matches defined brand direction and works on mobile/tablet
