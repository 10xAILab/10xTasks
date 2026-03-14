# Task Expansion Prompt

Use this prompt when a task is identified as a **project** or a **goal**.

## When to use which

- **Goal tasks** (e.g. "Goal: …" in intake): Use **`prompts/goal-task-workflow.md`**. Create a **subfolder** under the relevant tasks folder (e.g. `tasks/todo/10xTasks/<goal-slug>/`) and put **subtask files** there. The **first subtask** is always: clarifications, data in `data/` (if needed), `memory/` updates (if needed), **implementation plan** (md), and **human review**; do not implement until approved. Implementation may run in another directory (e.g. another repo). See goal-task-workflow for full steps.
- **Project tasks** (multi-step, no explicit "Goal:"): Expand as below; no mandatory plan-and-approval gate unless you also apply the goal workflow.

## Goals

- break projects (and goals) into smaller tasks
- identify dependencies and execution order
- for **goal** type: create subfolder + subtasks, with first subtask = plan + approval

## Expansion Process

1. Define outcome in one sentence.
2. Split work into milestones.
3. Convert milestones into concrete subtasks.
4. **For goal tasks:** create a subfolder (e.g. `tasks/todo/10xTasks/<slug>/`) and one file per subtask (e.g. `01-clarify-and-plan.md`, `02-implement.md`). First subtask must cover: ask clarifications, add data to `data/` and update `memory/` as needed, write implementation plan, get human approval.
5. Link dependencies (task A blocks task B).
6. Add acceptance criteria for each subtask.

## Quality Bar

Each subtask should:
- be independently actionable
- have a clear done state
- avoid hidden dependencies

If scope is still unclear after expansion, create a research subtask first.
