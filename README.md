# 10xTasks

10xTasks is an AI-assisted task system integrated with Linear via MCP.

## How Tasks Work

Local tasks are written in `tasks/local.md`.
This file is ignored by git.

Example/public tasks are provided in `tasks/example.md`.

AI agents read tasks, triage them, and create/update tasks in Linear via MCP.

After intake, Linear becomes the source of truth for execution.

## Scripts

Scripts in `scripts/` provide deterministic utilities used by AI agents.

## Artifacts

Outputs from AI work are written to `artifacts/`.

## Usage

This repo runs as a two-loop workflow: intake/orchestration, then execution.

### 1) Capture Local Tasks

- Add private tasks to `tasks/local.md`.
- Keep each item concise and actionable when possible.

### 2) Run Daily Orchestration (in Cursor)

- In Cursor chat, ask the agent to run `prompts/daily-run.md`.
- The agent uses `prompts/master-orchestrator.md` to:
  - triage and expand projects
  - dedupe using task fingerprint metadata
  - create/update Linear issues via MCP
- Local items are removed from `tasks/local.md` only after Linear issue IDs are
  confirmed.

### 3) Work From Linear

- Once synced, tasks should be managed from Linear only.
- Non-coding tasks can execute automatically when unblocked.
- Outputs are written to `artifacts/` and linked/summarized in Linear.

### 4) Coding Task Approval Gate

- Coding tasks always stop at plan stage first.
- Agent sets Linear status to `Planned` with label `needs-plan-approval`.
- You review plan details and approve in Cursor chat.
- Only then does implementation start (`In Progress`).

### 5) Repo Mapping

- Repo mapping in `memory/repos.json`.

### 6) Human Takeover Points

You are required only when:

- a task is blocked by missing context/access/dependencies
- a coding plan needs approval
- critical risk is detected during execution

### 7) Suggested Cursor Test Flow

1. Add 2-3 sample items to `tasks/local.md` (include one coding task).
2. Ask agent to run daily orchestration.
3. Verify:
   - Linear issues were created/updated
   - processed tasks were removed from `tasks/local.md`
4. Ask agent to continue execution for ready tasks.
5. Confirm coding task stops at `needs-plan-approval`.
6. Approve plan, then verify implementation starts.
