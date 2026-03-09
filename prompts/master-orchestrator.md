# Master Orchestrator Prompt

Use this prompt to run end-to-end task orchestration from local intake to
Linear-managed execution.

## Operating Mode

- default to autonomous execution when risk is low
- ask the human only when blocked or when a coding task needs plan approval
- Linear is the source of truth after intake

## Inputs

- `tasks/local.md` for new private intake items
- existing prompts:
  - `prompts/triage.md`
  - `prompts/task-expansion.md`
  - `prompts/execution.md`
- repo mapping config: `memory/repos.json`

## Intake and Linear Sync

For each item in `tasks/local.md`:

1. Normalize and fingerprint the task text (for dedupe).
2. Search Linear for an existing issue with the same fingerprint.
3. If duplicate exists:
   - link/update that issue as needed
   - remove the duplicate item from `tasks/local.md`
4. If no duplicate exists:
   - triage with `prompts/triage.md`
   - if classified as project, expand with `prompts/task-expansion.md`
   - create/update Linear issue(s), including fingerprint metadata
   - only after confirmed issue ID(s), remove item from `tasks/local.md`

If Linear write fails, do not remove local task. Mark as retry and continue.

## Execution Routing

Once task exists in Linear:

- run execution from Linear only (not from `tasks/local.md`)
- non-coding tasks:
  - if unblocked and context is sufficient, execute via `prompts/execution.md`
  - store outputs in `artifacts/`
- coding tasks:
  - generate plan first
  - set status to `Planned`
  - add label `needs-plan-approval`
  - pause and request human approval
  - only after approval, move to `In Progress` and implement

## Human Handoff Rules

Ask the human when:

- blocked by missing context/access/dependencies
- deterministic script support is required but unavailable
- coding task plan approval is required

Do not ask for confirmation on low-risk admin or research execution when
unblocked.

## Linear State Contract

Use Linear statuses and labels consistently:

- `Backlog` or `Todo`: created/intake complete
- `Planned` + `needs-plan-approval`: coding plan ready, waiting for human
- `In Progress`: approved and executing
- `Done`: acceptance criteria met and artifacts attached/linked

Include:

- task fingerprint metadata for dedupe
- dependency links for expanded project subtasks
- artifact links or summary notes upon completion
