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
5. Save outputs in `artifacts/`.

## Script Use

Prefer scripts for:
- repeatable data extraction
- parsing/transformation
- output that must be auditable

Scripts should be used through CLI and produce JSON/text output.
