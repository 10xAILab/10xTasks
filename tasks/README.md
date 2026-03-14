# Tasks

- **`local.md`** — Private intake (gitignored). Add new items here; daily-run turns them into task files in `tasks/todo`.
- **`example.md`** — Public format reference for task items.

## Lifecycle dirs

- **`todo/`** — Not started. Subdirs:
  - **`10xTasks`** — Run in this repo (this or a new Cursor chat).
  - **`<repo_id>`** — Run in another repo; see `memory/repos.json`. Open that repo in Cursor and run/drag the task there.
- **`wip/`** — Currently being worked on. Move here when you start or resume a task.
- **`review/`** — Needs human or unblocking. Add/update a **Next Steps** section in the task file.
- **`completed/`** — Done. Move here from `wip` when the task is finished.

See `prompts/task-lifecycle.md` and `prompts/daily-run.md` for full rules.
