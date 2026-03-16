# ChatGPT conversation export (fetch and store)

Use this when a task or goal requires **fetching and storing a ChatGPT conversation** as markdown (e.g. for review, vibe coding, or downstream prompts). The human runs the export in their browser; the agent opens the link and guides them.

## When to use

- The task or goal says to “get the ChatGPT convo”, “export the conversation”, or “fetch and store the ChatGPT chat”.
- The conversation is the input for a next step (e.g. review → vibe code plan, or save into `data/` for later use).

## Workflow

### 1. Open the ChatGPT link in the browser

- Use **Browser MCP**: `browser_navigate` with the conversation URL (e.g. `https://chatgpt.com/g/...` or `https://chatgpt.com/c/...`).
- If the page redirects to **login**, tell the human: **“Please log in to ChatGPT in this tab.”** Do not proceed until they confirm they are logged in and the conversation is visible.

### 2. Give the human the export script

- The export is done **by the human** in the browser’s Developer Console (e.g. **Cmd+Option+J** → Console tab).
- Provide the script they should **copy, paste, and run** in the console.

**Script location:** `scripts/chatgpt-export-convo.js`

Tell the human to:

1. Open DevTools (e.g. Cmd+Option+J) and go to the **Console** tab.
2. Copy the **entire contents** of `scripts/chatgpt-export-convo.js` from this repo.
3. Paste into the console and press Enter.
4. A Markdown file will **download** (title and date in the filename). Save that file into the **data folder** for the task, e.g.:
   - `data/<goal-slug>/<filename>.md` (for goal tasks), or  
   - `data/<task-slug>/<filename>.md` (for single tasks).

If the human prefers to use an existing tool instead:

- For **PDF** or other formats, point them to: **https://github.com/rashidazarang/chatgpt-chat-exporter**. They can use that project’s export and then convert or copy content into the repo as needed.

### 3. Confirm the file is stored

- Once the human has saved the downloaded file into `data/<slug>/`, confirm the path (e.g. `data/teddy-bear-math-lovable/Conversation Title (2026-03-14).md`).
- Then continue with the rest of the task (e.g. review convo, write plan, generate Lovable prompt).

## Summary

| Step | Who | Action |
|------|-----|--------|
| 1 | Agent | Open ChatGPT convo URL in browser (Browser MCP). |
| 2 | Agent | If login page: ask human to log in and confirm convo is visible. |
| 3 | Agent | Tell human: open Console, copy-paste `scripts/chatgpt-export-convo.js`, run; or use https://github.com/rashidazarang/chatgpt-chat-exporter for PDF. |
| 4 | Human | Run script (or exporter); save downloaded .md into `data/<slug>/`. |
| 5 | Agent | Confirm file path and proceed with the task. |

## Notes

- The script in `scripts/chatgpt-export-convo.js` exports the **current** conversation visible in the tab (title + date + messages as markdown). If the page structure changes, the script may need updates; the GitHub exporter is an alternative.
- Do **not** put secrets or API keys in the script or in repo-tracked data; keep conversation content in `data/` as normal task input.
