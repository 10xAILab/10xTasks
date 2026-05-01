# 10xImage MVP Product Spec

## Product One-Liner
10xImage is a utility-first web workbench for generating consistent AI images and game assets using reference images, reusable mini-prompts, and multi-provider model workflows.

## Problem
Current asset generation is manual and fragmented:
- repeated prompting across tools
- hand-editing JSON and mini-prompts
- hard-to-manage variations and references
- disconnected output steps like background removal and format export

10xImage should centralize this into one focused workflow app.

## Target Users
- Primary: indie builders/app makers creating game/app visual assets
- Secondary: creators who need style consistency across many generated images
- Access model: try without signup, then prompt signup to save project/assets

## Core Outcome
In under 60 seconds, a user should be able to start a generation task and produce useful image assets in a repeatable workflow.

## MVP Scope
- One-page workbench UX with left sidebar and central generation canvas
- Project-based organization with last-active-project resume
- Reference-image-led workflow:
  - upload style reference or generate initial anchor image
  - generate variants from that foundation (poses, expressions, props, outfits)
- Prompt tooling:
  - reusable mini-prompt templates
  - editable prompt composition
  - single and bulk generation modes
- Provider support in MVP:
  - OpenRouter
  - Gemini
- Output utilities:
  - preview and organize generated assets
  - background removal
  - export PNG/WebP

## Explicit Non-Goals (V1)
- Not a full AI chat-wrapper platform
- No autopilot or scheduled runs
- No broad provider matrix beyond OpenRouter + Gemini
- No full backend database migration in MVP

## UX Direction
- References: ChatGPT, Claude UI clarity, Rosebud.ai utility context
- Product feel: modern, intuitive, non-cluttered
- Positioning: utility-first, task-driven, minimal context switching

## Data Model (MVP Draft)
- `User`: Google identity, profile info, optional uploaded avatar fallback
- `Project`: name (default generated), timestamps, archived state
- `ProviderConfig`: provider/model defaults and key references
- `PromptTemplate`: mini-prompt content, tags, type, version/update metadata
- `ReferenceImage`: source info and style-role metadata
- `Asset`: output metadata, provider/model lineage, optional prompt/reference links

## Key Relationships
- one user -> many projects
- one project -> many prompt templates
- one project -> many reference images
- one project -> many assets
- one user -> many provider configs

## Editability Rules
- Editable by user:
  - project name
  - provider config
  - prompts/templates
  - profile photo fallback
- Not editable in MVP:
  - Google identity core fields

## Technical Expectations
- Platform: web app
- Authentication: Google login (with anonymous try-before-signup path)
- Persistence: local storage first
- Future readiness: architecture should migrate cleanly to Supabase/PostgreSQL
- No strict stack constraints given for MVP

## Launch Definition
Smallest useful launch: 10xImage lets the creator generate and iterate reference-based game/image assets in one place without the current manual script-heavy flow.

## MVP Success Metrics
- Number of generated AI images/assets
- Number of users trying the app (including anonymous trial to signup conversion insight)

## Suggested 30-Day Targets
- At least 300 generated assets via 10xImage
- At least 10 external users try 10xImage, with 3 weekly return users

## Risks and Unknowns
- Scope creep from trying to match every existing script edge case
- Anonymous-to-auth project/asset ownership transfer complexity
- Output consistency variation across providers/models
- Background removal quality differences by asset type

## Follow-Up Backlog
- Autopilot and scheduled generation
- Progress/notification system
- Additional provider integrations (OpenAI and others)
- Privacy policy and expanded content/compliance controls
