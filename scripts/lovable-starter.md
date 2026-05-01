# Loveable Starter Script

Use this script to turn a rough app idea into a high-quality one-shot prompt for Loveable.
It is inspired by the Teddy Bear Math discovery flow (iterative, conversational, specific), but is fully generic and reusable for any project.

## Goal

Produce a final prompt that:
- clearly defines product scope and outcomes
- includes UX, data, and technical constraints
- specifies MVP vs post-MVP
- is detailed enough to maximize first-pass Loveable output quality

## How to Run This Script

1. Open a chat with your planning assistant (ChatGPT/Cursor/Claude).
2. Paste this entire script.
3. Work phase-by-phase; do not skip unanswered questions.
4. Iterate until confidence is high.
5. Copy the final generated prompt into Loveable.

---

## Phase 1: Discovery Interview

Ask these in order. If an answer is vague, ask one follow-up.

### 1) Product Intent
- What are we building (one sentence)?
- Who is it for?
- What painful problem does it solve?
- What does success look like 30 days after launch?

### 2) Core User Flow
- What is the main action users should complete in under 60 seconds?
- What are the top 3 screens/pages needed for MVP?
- What should happen immediately after onboarding?
- What should users do daily/weekly to get value?

### 3) Feature Scope
- Which 3 features are must-have for MVP?
- Which features are nice-to-have but can wait?
- What should explicitly NOT be included in v1?

### 4) Differentiation and Vibe
- Which existing products should this feel like (2-3 references)?
- What should the tone feel like (e.g., playful, premium, calm, fast)?
- Any branding constraints (colors, typography, visual motif)?
- Should this feel more utility, game, social, or content-driven?

### 5) Engagement and Retention
- Should there be streaks, rewards, progress tracking, or reminders?
- What is the key habit loop (trigger -> action -> reward)?
- What is the cadence of fresh content/challenges (if any)?

### 6) Data and Entities
- What are the core entities (e.g., user, task, session, reward)?
- Which fields are required for each entity?
- What relationships exist between entities?
- What data must be editable by users?

### 7) Technical Expectations
- Web app, mobile web, or PWA?
- Authentication needed? (email, magic link, social)
- Should data persist to backend/database?
- Any integrations required (Stripe, email, analytics, AI APIs)?
- Any required stack constraints or avoided technologies?

### 8) Safety, Legal, and Content
- Any age-related constraints or moderation needs?
- Any privacy or compliance requirements?
- Any prohibited content or behavior rules?

### 9) Launch and Operations
- What is the smallest useful launch version?
- What metrics matter most at launch?
- What should be configurable by non-technical users later?

---

## Phase 2: Extraction Summary (Assistant Output)

After discovery, generate this exact summary structure before writing the Loveable prompt:

1. **Product one-liner**
2. **Target users**
3. **Main user journey**
4. **MVP feature list (max 5)**
5. **Out-of-scope list**
6. **UX/brand direction**
7. **Data model draft**
8. **Technical requirements**
9. **Risks/unknowns**
10. **Assumptions made**

If any of the above is missing, ask targeted clarifying questions.

---

## Phase 3: Prompt Quality Gates

Before generating the final Loveable prompt, verify:
- scope is realistic for an MVP build
- must-have vs nice-to-have is clear
- every major feature has user-facing behavior defined
- entities and persistence expectations are explicit
- edge cases are listed (empty states, errors, no data, loading)
- onboarding + first-run experience is defined
- acceptance criteria are concrete

If any gate fails, iterate once more.

---

## Phase 4: Final Loveable Prompt Template

Use the following template and fill it with the extracted details.

```md
Build a production-minded MVP for: [PROJECT_NAME]

## Product Objective
[Clear paragraph: what this app does, for whom, and why it matters.]

## Target Users
- [Primary user type]
- [Secondary user type if applicable]

## Core Outcome
Users should be able to [main action] within [time constraint] on first use.

## MVP Scope (Must Have)
1. [Feature with behavior details]
2. [Feature with behavior details]
3. [Feature with behavior details]
4. [Optional]
5. [Optional]

## Out of Scope (Do Not Build Yet)
- [Deferred feature 1]
- [Deferred feature 2]
- [Deferred feature 3]

## Required User Flow
1. Landing/onboarding: [details]
2. First key action: [details]
3. Main loop/retention action: [details]
4. Progress or result feedback: [details]

## Screens / Routes
- [Screen 1]: [purpose + key UI blocks]
- [Screen 2]: [purpose + key UI blocks]
- [Screen 3]: [purpose + key UI blocks]
- [Any modal/dialog states]

## UX and Visual Direction
- Vibe: [e.g., playful, calm, premium]
- References: [app/product references]
- Color/style constraints: [details]
- Interaction style: [e.g., quick, soft animations]
- Accessibility: readable typography, clear contrast, large touch targets

## Data Model (Minimum)
- [Entity A]: [required fields]
- [Entity B]: [required fields]
- [Entity C]: [required fields]
- Relationships: [how entities connect]

## Functional Requirements
- Authentication: [required or none]
- Persistence: [local storage / database]
- Search/filter/sort behavior: [if needed]
- Notifications/reminders: [if needed]
- Settings/profile behavior: [if needed]

## Edge Cases and States
- Empty states for each main screen
- Loading and skeleton states
- Error handling with clear user messages
- Validation for forms and user input
- Offline/slow-network behavior (graceful fallback)

## Non-Functional Requirements
- Fast initial load and responsive UI
- Mobile-first layout
- Clean, modular code structure
- Reusable components

## Deliverables
Please generate:
1. Complete app structure and UI for the MVP
2. Seed/mock data so flows are testable immediately
3. Clear placeholder hooks for integrations not yet wired
4. Short README section explaining how to run and extend

## Acceptance Criteria
- A new user can complete [core action] end-to-end
- All MVP screens are connected and functional
- Main data entities can be created/read/updated as needed
- Empty/loading/error states are present and usable
- UX matches the defined brand/vibe direction

When uncertain, prioritize shipping a focused MVP over adding extra features.
```

## Final Assistant Behavior (When Using This Script)

If you are the assistant running this script:
- guide the user step-by-step, not all questions at once
- maintain a running "extracted facts" list
- highlight contradictions early
- propose defaults when user is unsure
- only generate the final Loveable prompt after quality gates pass
