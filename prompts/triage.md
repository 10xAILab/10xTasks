# Task Triage Prompt

Use this prompt to classify incoming tasks and decide where they run. Used before creating task files in `tasks/todo` (see `prompts/daily-run.md`). Do **not** create Linear issues from local intake.

## Goals

- classify task type
- decide placement: `tasks/todo/10xTasks` vs `tasks/todo/<repo_id>`
- detect projects that may need expansion
- identify blockers early

## Classification

Classify each item into one of:
- **single task** — one clear action, executable with minimal clarification.
- **goal** — outcome-oriented, multi-step; needs clarifications, data, an implementation plan, and **human approval** before implementation. Often prefixed with "Goal:" in intake. Use `prompts/goal-task-workflow.md`: split into subtasks in a subfolder, Step 1 = clarify + data/memory + plan + review, then implement (possibly in another dir).
- **project** — multiple milestones or unclear scope; expand into subtasks (see task-expansion). If it also needs plan + human approval before execution, treat as **goal** and use goal-task-workflow.
- **research** — gather information; output is findings/options.
- **coding** — implement in a codebase; may run in another repo.
- **admin** — repo/task maintenance, no code.

A task is likely a **project** when it has multiple milestones, unclear scope, or cross-team dependencies. A task is a **goal** when the outcome is clear but the path needs a written plan and human sign-off before implementation (and may require data in `data/`, updates to `memory/`, or execution in another directory).

## Placement

After classifying, decide placement using `memory/repos.json`:

- **`tasks/todo/10xTasks`** — Can be done in this repo (10xTasks) in this or a new Cursor chat. Examples: summaries, research, admin, small scripts that live here, triage, artifact writing.
- **`tasks/todo/<repo_id>`** — Will be done in another repo in a separate terminal/session where a Cursor agent runs; the human can drag the task file there. Use the `id` from `memory/repos.json` (e.g. `10XEcho`, `10XShip`, `ai-roast`, `ai-trip`, `ai-trip-viz`). Choose the repo that owns the code or context for the task.

## Blocker Detection

Mark blockers when any of the following are missing:
- required context
- required access
- dependencies from other tasks
- deterministic tooling needed for execution

When blocked:
1. Ask a concise clarification question.
2. Propose the minimum next action.
3. Suggest a script if deterministic automation is needed.
