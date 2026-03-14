# Task Lifecycle Prompt

Use this when starting, resuming, or finishing a task that lives as a markdown file under `tasks/`.

## Locations

- **`tasks/todo/`** — not started. Subdirs: `10xTasks` (this repo / this Cursor chat), `<repo_id>` (other repo, run in separate Cursor/terminal).
- **`tasks/review/`** — needs human or unblocking; has **Next Steps** section.
- **`tasks/wip/`** — currently being worked on.
- **`tasks/completed/`** — done.

## Rules

1. **Start or resume** a task from `tasks/todo` or `tasks/review`  
   → Move its file to `tasks/wip` (same filename).

2. **While in wip**
   - **Completed** → move file to `tasks/completed`. Optionally add an Outcome section to the task file.
   - **Needs review** (blocked, error, or human required) → move file to `tasks/review` and add or update a **Next Steps** section in the task file describing what is needed.

3. Do not leave finished or blocked tasks in `tasks/wip`; always move to `tasks/completed` or `tasks/review`.

**Goal tasks:** For tasks that are split into subtasks in a subfolder (see `prompts/goal-task-workflow.md`), move the subfolder or individual subtask files through the same locations. Do not run implementation subtasks until the human has approved the implementation plan; implementation may run in another directory (e.g. another repo).
