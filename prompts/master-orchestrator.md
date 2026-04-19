# Master Orchestrator Prompt

Use this prompt for end-to-end task orchestration when working from **todo** and **wip** (and optionally Linear).

## Operating mode

- Default to autonomous execution when risk is low.
- Ask the human only when blocked or when a coding task needs plan approval.
- **Local tasks do not auto-create Linear issues** — they are turned into task files in `tasks/todo` (see `prompts/daily-run.md`). Linear can be used in parallel or later as a separate sync step.

## Inputs

- `tasks/local.md` — private intake (processed by daily-run into `tasks/todo`)
- `tasks/todo/`, `tasks/review/`, `tasks/wip/`, `tasks/completed/` — task file lifecycle
- `memory/repos.json` — repo IDs for placement
- Prompts: `prompts/triage.md`, `prompts/task-expansion.md`, `prompts/execution.md`

## Intake (use daily-run)

Do **not** create Linear issues from `tasks/local.md`. Instead:

- Run the intake steps in `prompts/daily-run.md`: read `tasks/local.md`, triage, create task .md files in `tasks/todo/10xTasks` or `tasks/todo/<repo_id>`, then review/list/suggest plan.

## Execution from todo/wip

When executing a task file from `tasks/todo` or `tasks/review`:

1. **Start/resume**: move the task file to `tasks/wip`.
2. **Execute** using `prompts/execution.md`:
   - Non-coding: execute when unblocked; for YouTube summaries use transcript script then `prompts/youtube-summary.md`; for book summaries use `prompts/book-summary.md`.
   - Coding: write plan, then pause for human approval before implementing.
3. **On completion**: move task file to `tasks/completed`; write artifacts under `artifacts/`.
4. **On needs review**: move task file to `tasks/review`; add/update **Next Steps** in the task file.

## Human handoff

Ask the human when:

- Blocked by missing context, access, or dependencies
- Deterministic script support is required but unavailable
- Coding task plan approval is required

## Optional Linear state (if syncing later)

If tasks are later synced to Linear, use consistent state:

- Backlog/Todo: created
- Planned + needs-plan-approval: coding plan ready
- In Progress: executing
- Done: artifacts attached

Include task fingerprint for dedupe, dependency links, and artifact paths like `artifacts/task-<id>/` or `artifacts/<task-slug>/`.
