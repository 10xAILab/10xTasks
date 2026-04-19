# Supa Tools — Supabase RLS Builder (summary)

**URL:** https://www.supa-tools.com/supabase-rls-builder  

**What it is:** A **beta** “Supabase RLS Builder” positioned as an **AI-powered** assistant that turns your database needs into **Row Level Security policies**, **SQL functions**, and related **security rules**—marketed as “bulletproof” RLS as you scale.

**How it works (from public copy / app strings):**

1. You work from a **schema** (describe or import your tables/columns as the product expects).
2. The tool runs a **“security engine”** that **generates RLS policies, functions, and more** tailored to that schema.
3. Output is meant to be **applied in Supabase** (policies + helpers), reducing hand-written policy work.

**Positioning vs Auth Emails:** Supa Tools bundles this with the **Auth Email Designer** under one umbrella: developer utilities to make Supabase projects easier (templates + security).

**Practical takeaways:**

- Use it when you want **starting policies** and **boilerplate security SQL** from a described schema rather than writing policies from scratch.
- Treat as **beta**: verify policies against your threat model, test with Supabase’s RLS evaluation and real JWT claims, and review generated SQL before production.
- Same install/access pattern as the rest of the site (SPA); expect iteration as the product is labeled beta.

**Limitation of this summary:** Page content is mostly **client-rendered**; details above are from site metadata and embedded UI strings in the shipped JavaScript bundle, not a live session in the builder.
