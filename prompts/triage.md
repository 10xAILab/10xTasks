# Task Triage Prompt

Use this prompt to classify incoming tasks before creating/updating Linear.

## Goals

- classify task type
- detect projects that require expansion
- identify blockers early

## Classification

Classify each item into one of:
- single task
- project
- research
- coding
- admin

A task is likely a project when it has multiple milestones, unclear scope, or
cross-team dependencies.

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
