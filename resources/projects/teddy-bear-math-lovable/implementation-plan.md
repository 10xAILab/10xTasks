# Implementation plan: Teddy Bear Math → Lovable vibe code plan

**Goal:** From the ChatGPT conversation about the Teddy Bear Math game, produce a vibe code plan and a Lovable prompt in markdown; then wait for further instructions.

## Prerequisites

- **ChatGPT conversation** about the Teddy Bear Math game (to be provided by human and stored in `data/teddy-bear-math-lovable/`).

## Ordered steps

1. **Receive and store the ChatGPT conversation**
   - Human provides the convo (paste or export).
   - Agent saves it under `data/teddy-bear-math-lovable/` (e.g. `chatgpt-convo.md` or `chatgpt-convo.txt`).

2. **Review the conversation**
   - Read the full convo and extract: game concept, rules, UI/UX intent, target audience, any technical or “vibe” preferences.
   - Summarize the game spec and design intent in a few bullets or short section.

3. **Generate the vibe code plan**
   - Write a **vibe code plan** (structure, screens, components, data flow, and high-level implementation approach) suitable for building the game in Lovable or a similar low-code/GenAI builder.
   - Save as `artifacts/teddy-bear-math-lovable/vibe-code-plan.md`.

4. **Generate the Lovable prompt**
   - Write a single, clear **prompt to give to Lovable** that describes the Teddy Bear Math game and how it should behave, so Lovable can generate the app.
   - Save as `artifacts/teddy-bear-math-lovable/lovable-prompt.md`.

5. **Pause for further instructions**
   - Do not start implementation in Lovable or other tools until the human gives next tasks (e.g. “create in Lovable”, “tweak the prompt”, etc.).

## Where it runs

- All steps in this repo (10xTasks). No separate repo or directory required for this goal.

## Acceptance criteria

- [ ] ChatGPT convo stored in `data/teddy-bear-math-lovable/`
- [ ] `vibe-code-plan.md` and `lovable-prompt.md` written under `artifacts/teddy-bear-math-lovable/`
- [ ] Human has approved this plan (or approved with changes)
- [ ] After delivery, wait for human’s next instructions

---

**Status:** Done. Conversation stored; vibe code plan and Lovable prompt written. Awaiting human’s next instructions (e.g. build in Lovable, tweak prompt).
