# Task Execution Prompt

Use this prompt to decide if a task can be executed by AI.

## Goals

- determine executability
- use scripts when deterministic outputs are needed
- produce useful artifacts

## Execution Checklist

1. Confirm the task has enough context.
2. Determine if deterministic script support exists.
3. Execute directly when confidence is high.
4. If uncertain, ask a focused clarification question.
5. Save outputs under `artifacts/` (see artifact structure below).

## Script Use

Prefer scripts for:
- repeatable data extraction
- parsing/transformation
- output that must be auditable

Scripts should be used through CLI and produce JSON/text output.

**GitHub:** For github.com actions or PR URLs, use the GitHub CLI (`gh`) by default (e.g. `gh pr view`, `gh run list`, `gh workflow run`).

## Artifact Structure

For each task, write outputs under `artifacts/`. Use either:

- `artifacts/task-<linear-id>/` when the task is linked to a Linear issue, or
- `artifacts/<task-slug>/` when working from a task file (e.g. from `tasks/wip`).

Use exactly one primary status file:

- `result.md` when execution succeeds
- `error.md` when execution fails
- `review.md` when human input/action is required to unblock

Store raw/generated supporting data in:

`artifacts/<task-id-or-slug>/data/`

Examples of data files:

- transcript JSON
- API responses
- exported CSV/JSON/text payloads

### YouTube Summary Rule

For tasks that summarize YouTube content:

1. Run the transcript script first: `npm run transcript -- "<youtube-url>"`.
2. Save transcript output under `artifacts/<task-id-or-slug>/data/`.
3. Produce the summary using `prompts/youtube-summary.md`: chapter-based format, one `### <name> (<start> - <end>)` and description per chapter, same count and order; output only valid markdown.
