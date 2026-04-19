# 10xSupaMail upsell validation plan (no extra landing pages)

## Objective

Validate which **paid upsell** to build on top of the free **10xSupaMail** tool, without creating separate landing pages per idea.

Primary upsell candidates (from `resources/projects/10XEmail/idea_assessment.md`):

1. **Template versioning & hot reload** (score 5)
2. **Event-Triggered Email Orchestrator** (score 5)
3. **Email i18n/l10n** (score 4)
4. **Deliverability & diagnostics (“Email Guardrail”)** (score 4)

Guiding GTM learnings to apply (from `resources/learnings/Profitable AI Business in 48 Hours/summary.md`):
- Start outreach **as soon as the offer exists**
- Use a **LinkedIn post + “comment keyword” lead magnet**
- Use a lead-list tool / targeting + short outreach sequence
- Keep stack simple

## Constraints / assumptions

- **No separate landing page per idea.**
- Free tool stays the front door.
- Validation should identify: (a) which upsell gets demand, (b) what exact job/pain drives that demand, (c) who the buyer is, (d) what price/packaging is plausible.
- You’re open to: LinkedIn posts, outbound, and “site owner” outreach (subscribe → inspect emails → reach out).

## What “validation” means (acceptance criteria)

Within 7–14 days you should have:

- **Demand signal per idea** (relative ranking):
  - ≥ 10 qualified “interest” actions per idea (comments/DMs/replies/calls booked) *or*
  - clear “winner” by conversion rate even at lower absolute volume.
- **3–5 short calls** with the top idea’s ICP, capturing:
  - their current workaround
  - urgency + frequency
  - willingness to pay range
  - must-have features vs nice-to-have
- A simple “offer” that resonates enough to get:
  - booked calls, or
  - preorders, or
  - “yes, I’d pay if X exists” plus a request to be notified.

## Core strategy

Use 10xSupaMail as the **single CTA** (“Try the free tool”), but gate upsell validation through **idea-specific signals**:

- Each upsell gets:
  - 1 LinkedIn post “problem → free fix” with a **distinct comment keyword**
  - 1 follow-up DM script (manual or automation) that routes people into the matching upsell queue
  - 1 short “offer page” inside the free tool experience (not a separate external landing page): e.g. a modal / thank-you screen / email follow-up that asks a single question and offers a call.

This way:
- you keep **one public landing surface** (the free tool),
- but you still run **clean experiments**.

## Experiment design (2-week plan)

### Week 0 (1 day): Setup “routing” + measurement

**Where this runs:** 10xTasks repo (copy + artifact writing); actual tooling external.

- Create a simple tracking sheet (or Notion):
  - columns: idea, source (LI post A/B/C/D), action (comment/DM/reply/call), ICP fit, pain score, notes.
- Define four **comment keywords**:
  - Versioning: `version`
  - Orchestrator: `triggers`
  - i18n: `i18n`
  - Deliverability: `deliver`
- Draft:
  - 4 LinkedIn posts (one per idea) — similar structure, different pain story.
  - 4 DM follow-ups (one per idea).
  - 1 “book a call” link (or “reply with X”).

### Week 1 (days 1–7): LinkedIn demand capture

**Post format (based on 48h learnings):**
- 1-line hook (pain)
- 3–5 bullets: what breaks in production
- a “free” deliverable (template pack / checklist / diagnostic)
- CTA: “Comment `<keyword>` and I’ll send it”

**Four post angles:**

1) **Template versioning & hot reload**
- Hook: “Ever had Supabase emails revert to the default template after you customized them?”
- Free deliverable: “Supabase email template deployment checklist” + “safe folder/config patterns”
- Upsell angle: versioning + preview + rollback + ‘hot reload’ without redeploys.

2) **Event-triggered email orchestrator**
- Hook: “You can design emails; the hard part is sending the right one at the right time without cron spaghetti.”
- Free deliverable: “Top 10 Supabase event → email flows” (onboarding, trial end, failed payment, etc.)
- Upsell: rules builder + durable execution + testing.

3) **Email i18n/l10n**
- Hook: “International users = broken auth emails (wrong language, inconsistent branding, missing fallbacks).”
- Free deliverable: “Email localization checklist + fallback strategy”
- Upsell: locale routing + fallback chains + translation workflow.

4) **Deliverability/diagnostics**
- Hook: “Your auth emails look great but still land in spam / never arrive; debugging is fragmented.”
- Free deliverable: “Deliverability checklist for Supabase auth + SMTP”
- Upsell: tracing + retries + DNS/reputation guidance.

**Execution notes:**
- Post one per day (4 days), then repost/iterate the best 1–2 with tweaks.
- Reply to every comment quickly; DM within 1 hour if possible.

### Week 1 (days 3–7): Outbound to accelerate signal

Modeled after “Outbound” flow in the 48h summary.

**Lead targeting:**
- Titles: founder, head of eng, product engineer, growth, RevOps (for orchestrator)
- Keywords: Supabase, Lovable, Resend/Postmark/Sendgrid, “transactional email”
- Triggers: new product launch, hiring, “just shipped X”, “international users”, “email deliverability”

**Outreach copy principle:**
- 1 personalized sentence
- 1 pain sentence
- 1 offer sentence
- 1 CTA sentence (call or reply with keyword)

Run 2–3 micro-campaigns (50–150 leads each) focused on:
- Versioning/hot reload
- Deliverability/diagnostics
- Orchestrator

### Week 2 (days 8–14): Site-owner outreach (optional, but powerful)

This validates “diagnose your emails are rubbish → reach out” quickly.

**Workflow:**
- pick 50–100 Supabase-adjacent sites / SaaS
- subscribe / create account where possible
- collect their auth/transactional emails
- score them quickly:
  - branding quality
  - clarity of CTA
  - spammy patterns
  - missing localization
  - broken deliverability cues (SPF/DKIM hints if visible)
- send short email:
  - “I reviewed your auth emails; here are 2 fixes”
  - link to free tool
  - ask: “Do you want a ‘safe deploy + versioning’ setup / deliverability tracing?”

Use this to seed early “done-for-you” service calls.

## Decision rule (picking the winner)

Choose the upsell that wins on:
- strongest **ICP fit** (people you can reliably reach)
- highest **pain urgency**
- clearest **“I’d pay for that”** language
- most repeatable **lead source**

Likely winners to test first (based on idea assessment):
1) Template versioning & hot reload
2) Event-triggered orchestrator
3) Deliverability/diagnostics

## Packaging: product vs service (recommended path)

Follow the agency-to-product pattern from the 48h video:

### Phase 1 (validation): “Done-for-you” service offer (1–2 weeks)
Pick ONE of:
- **Versioning/hot reload setup**: “we make your email templates safe to change + rollback”
- **Deliverability guardrail audit + fixes**
- **Orchestrator MVP flow setup** (1–2 flows)

Goal: learn the real edge cases + price sensitivity.

### Phase 2 (product): self-serve + lightweight onboarding
Ship the smallest paid artifact:
- Versioning: version history + preview + rollback
- Deliverability: diagnostics report + tracing snippet
- Orchestrator: 3 canned flows + editor

## Deliverables to create (content)

- 4 LinkedIn posts (one per idea)
- 4 DM templates
- 1–2 lead magnets (PDF/checklist) that map to the winner
- 1 tracking sheet / dashboard
- 1 call script (5 questions)

## Risks / mitigation

- **Signal polluted by “people like content, not buyers”**
  - Require a second action (DM reply with detail / quick form question / book call).
- **Multiple ideas interest same person**
  - Ask 1 routing question: “Which hurts most: template deploys, triggers, localization, deliverability?”
- **Too slow without automation**
  - Keep it manual for week 1; add tools only after you see which lane wins.

## Open questions (for your approval)

1. Preferred channel mix for week 1: **LinkedIn only** vs **LinkedIn + outbound**?
2. Do you want the keyword CTAs to route to **DM** only, or also to a simple **email capture** after they try the free tool?
3. Which single upsell do you *want* to win (if signals tie): versioning, orchestrator, deliverability, i18n?

## Next steps

- Approve this plan (or request edits).
- Then we execute `02-implement`:
  - write the 4 posts + DMs
  - set up lead lists
  - start posting and messaging immediately.