Build a production-minded MVP for: 10xImage

## Product Objective
Build a utility-first web app that helps users generate consistent AI images and game assets with less manual prompting and file wrangling. The app should support reference-image-based workflows, reusable mini-prompts, and multi-model provider selection so users can produce cohesive assets quickly across poses, expressions, props, and variants.

## Target Users
- Indie builders/app makers creating visual assets for products and games
- Creators who need style consistency across many generated images
- First-time users should be able to try the tool without signup; signup is required to save generated assets/projects

## Core Outcome
Users should be able to run a generation task (single or bulk) and produce usable asset outputs within 60 seconds of entering the workbench.

## MVP Scope (Must Have)
1. One-page workbench UI (ChatGPT/Claude-like simplicity) with sidebar and central generation workspace.
2. Project-based workflow with default project creation and "last active project" resume behavior.
3. Reference-image-driven generation flow:
   - start from uploaded reference image OR prompt-generated first style anchor
   - generate follow-up variations based on that style.
4. Prompt workflow system:
   - reusable mini-prompt templates
   - prompt editing before run
   - select task mode (single generate / bulk generate).
5. Provider execution + outputs:
   - support OpenRouter + Gemini
   - generate image results, preview outputs, remove background, export PNG/WebP
   - basic asset organization inside project.

## Out of Scope (Do Not Build Yet)
- Full general AI chat-wrapper platform
- Autopilot/scheduled automation
- OpenAI and other providers beyond OpenRouter + Gemini
- Full backend migration to Supabase/PostgreSQL
- Advanced social/community features

## Required User Flow
1. Landing/onboarding:
   - user enters app and can try generation without signup
   - user can continue with Google login to save assets/projects.
2. First key action:
   - choose/create project (auto-name allowed)
   - upload reference image or generate first anchor prompt/image
   - select provider/model + mini-prompt and run generation.
3. Main loop:
   - iterate on reference + mini-prompt combinations
   - run single or bulk generation for additional assets.
4. Feedback:
   - show generation status and result gallery
   - allow background removal + PNG/WebP export
   - keep outputs tied to project history.

## Screens / Routes
- Workbench (primary): sidebar (projects, templates, assets), central generation panel, result grid.
- Settings: provider/API key config, account/profile settings.
- Auth modal/flow: Google login; anonymous trial to signed-in upgrade path.
- Dialog states: new project, save asset, export options, error/retry prompts.

## UX and Visual Direction
- Vibe: modern, intuitive, non-cluttered
- References: ChatGPT, Claude design language, Rosebud.ai utility feel
- Color/style constraints: propose a minimal neutral palette with one accent color; keep high contrast and clean spacing
- Interaction style: fast task-driven workflow, minimal clicks, clear step-by-step progression
- Accessibility: readable typography, strong contrast, keyboard-friendly, clear feedback states

## Data Model (Minimum)
- User: id, google_auth_id, email, display_name, avatar_url, created_at
- Project: id, user_id, name, is_archived, created_at, updated_at
- ProviderConfig: id, user_id, provider_name, default_model, encrypted_key_ref/local_key_ref, created_at
- PromptTemplate: id, project_id, name, content, tags, template_type, updated_at
- ReferenceImage: id, project_id, source_type(upload/generated), file_path/url, notes, created_at
- Asset: id, project_id, reference_image_id(optional), prompt_template_id(optional), provider, model, format, output_path, background_removed(bool), created_at
- Relationships:
  - user has many projects and provider configs
  - project has many prompt templates, reference images, assets
  - asset links to generation context (provider/model/prompt/reference image)

## Functional Requirements
- Authentication:
  - anonymous trial mode allowed
  - Google login required for persistence.
- Persistence:
  - local storage first (projects, templates, generation metadata)
  - architecture should be migration-friendly to Supabase/PostgreSQL later.
- Generation behavior:
  - task mode selection (single or bulk)
  - provider/model selection (OpenRouter, Gemini)
  - reference image + prompt template composition.
- Asset handling:
  - preview, save, organize by project
  - export PNG/WebP
  - optional background removal utility.
- Profile/settings:
  - edit project names
  - manage provider configuration
  - optional profile photo upload fallback if Google avatar unavailable.

## Edge Cases and States
- Empty states:
  - no project yet
  - no reference image yet
  - no templates yet
  - no generated assets yet.
- Loading states:
  - generation in progress
  - background removal in progress
  - export processing.
- Error handling:
  - provider/API failures with actionable retry messages
  - invalid/missing provider config
  - unsupported file upload format.
- Validation:
  - prompt required for generation
  - provider/model required
  - bulk count limits.
- Offline/slow-network behavior:
  - show pending/failed statuses clearly
  - preserve unsaved local draft inputs when possible.

## Non-Functional Requirements
- Fast initial load and responsive UI
- Mobile-tolerant but desktop-optimized workbench
- Clean modular architecture with reusable components
- Service abstraction layer for future providers
- Storage abstraction to enable future DB migration

## Deliverables
Please generate:
1. Complete MVP app structure and UI for the workbench-based flow
2. Mock data and seed templates so flows are testable immediately
3. Provider service adapters for OpenRouter and Gemini with clear extension points
4. A short README explaining setup, local storage model, and migration path to Supabase/PostgreSQL

## Acceptance Criteria
- A new user can generate at least one asset end-to-end from the workbench
- Single and bulk generation flows both work
- Reference-image-based iteration works for follow-up variants
- PNG/WebP export works and outputs are attached to project history
- Anonymous users can try generation; signed-in users can save/manage assets
- Last active project auto-loads on return
- Empty/loading/error states are implemented and clear
- UX matches the modern, simple, and uncluttered direction

When uncertain, prioritize shipping a focused MVP over adding extra features.
