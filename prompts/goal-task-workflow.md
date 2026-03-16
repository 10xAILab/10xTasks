# Goal-Task Workflow Prompt

Use this when a task is classified as a **goal** (e.g. items starting with "Goal:" in intake, or multi-step outcomes that need a plan and human approval before implementation).

## What is a goal task

A goal task is an outcome-oriented item that:
- has multiple steps or dependencies
- may need clarifications, input data, or context before execution
- benefits from an implementation plan and human review before work starts
- may require running implementation in a **separate directory** (another local project or repo)

Example: *"Goal: fetch ctonow github repo & update my bio, pic & profile links"*.

## Step 0: Create subtask structure

1. **Create a subfolder** under the relevant tasks folder (e.g. `tasks/todo/10xTasks/<goal-slug>/` or `tasks/todo/<repo_id>/<goal-slug>/`).
2. **Add subtask files** in that subfolder (e.g. `01-clarify-and-plan.md`, `02-implement.md`, …). Use `prompts/task-expansion.md` to break the goal into concrete subtasks with dependencies and acceptance criteria.
3. **Keep a parent task file** in the parent directory if useful (e.g. `tasks/todo/10xTasks/<goal-slug>.md` that points to the subfolder), or treat the subfolder as the task container with an `README.md` or `_goal.md` describing the overall goal.

## Step 1: Clarify, plan, and get approval (first subtask)

Before implementation, complete:

1. **Clarifications**
   - Ask the human for any missing context, access, or decisions (e.g. which repo, which profile links, what bio text).
   - If the goal involves external resources (repos, accounts), confirm URLs, identifiers, and any constraints.

2. **Data and memory**
   - If the human provides data (e.g. bio text, links, credentials), put it under **`data/`** in a sensible path (e.g. `data/<goal-slug>/brief.md`, `data/<goal-slug>/inputs.md`). Do **not** put secrets in repo-tracked files; use env or secure storage and document where they live.
   - If the goal requires **fetching a ChatGPT conversation**, follow **`prompts/chatgpt-convo-export.md`**: open the convo URL in the browser, ask the human to log in if needed, then give them the script at `scripts/chatgpt-export-convo.js` to run in the console; the human saves the downloaded .md into `data/<goal-slug>/`.
   - Update **`memory/`** if clarifications add reusable context (e.g. new repo in `memory/repos.json`, or a new memory file for this goal). See AGENTS.md and existing `memory/` layout.

3. **Implementation plan**
   - Write an **implementation plan** as a markdown file (e.g. `artifacts/<goal-slug>/implementation-plan.md` or inside the task subfolder). Include:
     - Ordered steps to achieve the goal
     - Where each step runs (this repo vs another dir/repo)
     - Dependencies and inputs (pointers to `data/` or memory)
     - Acceptance criteria for the goal
     - Any risks or assumptions

4. **Human review**
   - Present the plan (and any open questions) to the human.
   - **Do not start implementation** until the human approves the plan (or approves with changes; if so, update the plan and data/memory as agreed).

## Step 2: Implementation (later subtasks)

1. **After approval**
   - Move the “implement” subtask(s) to the right place (e.g. `tasks/wip/<goal-slug>/02-implement.md`) and execute per the plan.
   - If the plan says work runs in **another directory** (e.g. a different repo or local project), the human should open that dir in Cursor (or drag the relevant subtask there) and run the implementation there. Document in the plan: “Run in: `<path or repo_id>`”.

2. **Lifecycle**
   - Use `prompts/task-lifecycle.md` for each subtask (wip → completed or review).
   - When all subtasks are done, treat the goal as completed (move parent to `tasks/completed/` or mark the goal subfolder complete).

3. **Artifacts**
   - Save outputs under `artifacts/<goal-slug>/` (or `artifacts/task-<linear-id>/` if synced to Linear). Use `result.md`, `error.md`, or `review.md` as in `prompts/execution.md`.

## Summary

| Phase            | Actions |
|------------------|--------|
| **Structure**    | Create subfolder under todo/wip; add subtask files. |
| **Step 1**       | Clarify → put data in `data/`, update `memory/` → write implementation plan → get human approval. |
| **Step 2**       | After approval, run implementation (possibly in another dir); move subtasks through lifecycle; write artifacts. |

Do not skip human review of the implementation plan for goal-type tasks.
