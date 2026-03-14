# AGENTS

## Overview

This repository is used by AI agents to manage tasks. Local tasks are **not** auto-created in Linear; they are turned into markdown task files in `tasks/todo` first. Linear can be used in parallel or later via a separate sync step. Agents may interact with Linear through MCP when syncing or working from Linear.

The repository contains:
- task inputs and task lifecycle dirs (`tasks/todo`, `tasks/wip`, `tasks/review`, `tasks/completed`)
- prompts
- deterministic scripts
- memory/context (`memory/repos.json` for repo IDs)
- generated artifacts

## Task Workflow

1. **Intake**: Read `tasks/local.md`. Do **not** create Linear issues. Use `prompts/daily-run.md` to triage and create task .md files in:
   - `tasks/todo/10xTasks` — doable in this repo in this or a new Cursor chat
   - `tasks/todo/<repo_id>` — to be run in another repo (see `memory/repos.json`); human can drag task to that Cursor/terminal
2. **Review and plan**: Review and list tasks in `tasks/todo` and `tasks/review`; suggest a task plan (e.g. kick off `tasks/todo/10xTasks` here; concise instructions for repo tasks).
3. **Lifecycle**: When starting/resuming a task, move it to `tasks/wip`. When done → `tasks/completed`; when blocked/error/human needed → `tasks/review` with **Next Steps** (see `prompts/task-lifecycle.md`).
4. Expand projects into subtasks when needed (`prompts/task-expansion.md`).
5. Execute tasks when possible; use scripts in `scripts/` for deterministic operations.
6. If blocked, ask for clarification and/or propose a new script.

## Task Inputs and Dirs

- `tasks/local.md` — private intake (gitignored). Processed into `tasks/todo` by daily-run.
- `tasks/example.md` — public format reference.
- `tasks/todo/10xTasks` — todo tasks run in this repo.
- `tasks/todo/<repo_id>` — todo tasks run in another repo (manual run / drag to agent).
- `tasks/wip` — tasks currently being worked on.
- `tasks/review` — tasks needing human or unblocking (have Next Steps).
- `tasks/completed` — finished tasks.

Do not copy private task content into public files.

## Scripts

Scripts are deterministic utilities. Keep them small and predictable.

**GitHub:** For github.com actions or PR URLs, use the GitHub CLI (`gh`) by default (e.g. `gh pr view`, `gh run list`, `gh workflow run`).

When a task asks to summarize a YouTube video, always use the transcript
script (`npm run transcript -- "<youtube-url>"`) then produce the summary with `prompts/youtube-summary.md` (chapter-based format).
Do not use ad-hoc transcript fetching when this script is available.

Script expectations:
- accept CLI arguments
- output JSON or plain text
- avoid unnecessary dependencies
- fail with clear error messages

## Artifacts

Write AI outputs to `artifacts/`:
- by task slug or Linear id: `artifacts/<task-slug>/` or `artifacts/task-<linear-id>/`
- summaries, research notes, plans
- Artifacts should be timestamped when practical and easy to read.
