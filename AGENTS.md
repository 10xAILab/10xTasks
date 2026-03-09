# AGENTS

## Overview

This repository is used by AI agents to manage tasks in Linear.
Linear is the source of truth for task state.
Agents should interact with Linear through MCP tools.

The repository contains:
- task inputs
- prompts
- deterministic scripts
- memory/context
- generated artifacts

## Task Workflow

1. Read tasks from `tasks/local.md` and `tasks/example.md`.
2. Triage tasks into actionable types (single task, project, research, coding, admin).
3. Create or update Linear tasks via MCP.
4. Expand projects into subtasks with clear ownership and dependencies.
5. Execute tasks when possible.
6. Use scripts in `scripts/` for deterministic operations.
7. If blocked, ask for clarification and/or propose a new script.

## Task Inputs

- `tasks/local.md` is for private local tasks and is gitignored.
- `tasks/example.md` is public and documents the expected format.

Do not copy private task content into public files.

## Scripts

Scripts are deterministic utilities. Keep them small and predictable.

Script expectations:
- accept CLI arguments
- output JSON or plain text
- avoid unnecessary dependencies
- fail with clear error messages

## Artifacts

Write AI outputs to `artifacts/`:
- summaries
- research notes
- plans

Artifacts should be timestamped when practical and easy to read.
