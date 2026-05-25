# Daily Run Prompt

Use this prompt for the daily operating loop.

## Objective

Process new local tasks into `tasks/todo` (as markdown files). Do **not** auto-create Linear tasks from local intake. Unless explicitly told not to execute, then run todo tasks sequentially (one at a time) using the task lifecycle and execution rules.

## Inputs

- `tasks/local.md` — new private intake items
- `memory/repos.json` — repo IDs and paths for placement
- `prompts/triage.md` — classify and decide placement

## Steps

### 1. Intake: local → todo

For each item in `tasks/local.md`:

1. **Triage** using `prompts/triage.md` (type: single task, **goal**, project, research, coding, admin).
2. **Decide placement**:
   - **`tasks/todo/10xTasks`** — can be done in this repo in this or a new Cursor chat (e.g. summaries, research, admin, small scripts in 10xTasks).
   - **`tasks/todo/<repo_id>`** — will be done in a separate terminal where a Cursor agent runs for that repo; task can be dragged there and run manually. Use `repo_id` from `memory/repos.json` (e.g. `10XEcho`, `10XShip`, `ai-roast`).
3. **Create task file(s)** in the chosen directory:
   - **Single task / project / research / coding / admin:** One task file per item (e.g. `summarise-youtube-xyz.md`). Content: task title, description, source, triage notes (type, placement).
   - **Goal task:** Use `prompts/goal-task-workflow.md`. Create a **subfolder** (e.g. `tasks/todo/10xTasks/<goal-slug>/`) and add **subtask files** (e.g. `01-clarify-and-plan.md`, `02-implement.md`). Step 1: clarifications, data in `data/` if needed, `memory/` updates if needed, implementation plan (md), **human review**; implement only after approval, possibly in another dir. Optionally keep a parent task file pointing at the subfolder.
4. **Remove or mark processed** the item in `tasks/local.md` (e.g. move to a “Processed” section or delete) only after the task file(s) are created.

Do not create Linear issues from these items.

### 2. Review and list

- **Review** tasks in `tasks/todo` (all subdirs) and `tasks/review`.
- **List** tasks in `tasks/todo` and `tasks/review` (by directory and file).
- **Suggest and apply the default plan**:
  - Unless explicitly instructed not to execute tasks, immediately start executing tasks from `tasks/todo` sequentially (one task at a time), following Steps 3 and 4.
  - Continue until all executable todo tasks are processed or a stop condition is reached.
  - If explicitly instructed not to execute, provide only the review/list plus concise kickoff instructions.

### 3. Task lifecycle (when working on a task)

See `prompts/task-lifecycle.md` for full rules.

When a **todo** or **review** task is **started or resumed**:

- **Move** the task file to `tasks/wip` (same filename or keep a consistent name). For **goal** tasks, move the whole subfolder to `tasks/wip/<goal-slug>/` or move individual subtask files as you work on them.

For default daily runs (when execution is not explicitly disabled):

- Pick the next task from `tasks/todo` and process it end-to-end before starting another task.
- Do not run tasks in parallel.

While in **wip**:

- **Completed** → move the task file to `tasks/completed`. Optionally add a short “Outcome” section to the task file.
- **Needs review** (blocked, error, or requires human) → move the task file to `tasks/review` and **add or update** a **Next Steps** section in the task file describing what’s needed.


**Goal tasks:** Do not run implementation subtasks until the human has approved the implementation plan (see `prompts/goal-task-workflow.md`). Implementation may need to run in a separate directory (another repo or local project); document that in the plan and have the human open that dir for execution.

### 4. Execution (when running tasks)

- For **YouTube summary** tasks, run **one video at a time** and follow `prompts/youtube-summary.md` end-to-end for that task only:
  1. Run `npm run transcript -- "<youtube-url>"` and save the raw transcript under `artifacts/<task-slug>/data/` (e.g. `transcript.json`).
  2. **Re-read** that task’s saved transcript before writing the summary. Do not reuse another video’s transcript, a prior summary, or a generic template.
  3. Write `artifacts/<task-slug>/result.md` from that transcript only (chapter-based: `### <name> (<start> - <end>)` + description per chapter, same order; output only valid markdown).
  4. **Re-check** `result.md` against the same transcript: topic, title, brief, chapter count/order, time ranges, and claims must match what was actually said. If anything is generic, wrong, or misaligned, revise before moving the task out of `tasks/wip`.
  5. If transcript fetch fails or the summary cannot be aligned after revision, save notes under `artifacts/<task-slug>/` and move the task to `tasks/review` with **Next Steps** instead of marking it completed.
- For **book summary** tasks, use `prompts/book-summary.md`. If only a title is provided, first find the matching Amazon UK Kindle listing, include the Kindle link + GBP price, then produce the required summary sections.
- Save execution outputs under `artifacts/` (e.g. `artifacts/<task-slug>/result.md`, `error.md`, `review.md`, `data/`).
- Use scripts in `scripts/` for deterministic operations.

### 5. Optional Linear sync

Linear is **not** created from local intake in this flow. If you later sync selected tasks to Linear (e.g. via a separate prompt or manual step), use the same artifact paths and update Linear with links to artifacts.

## Stop conditions

Stop and ask the human when:

- Blocked by missing context, access, or dependencies
- Coding plan approval is required
- A critical execution risk is detected
