# Export ChatGPT conversation — instructions

**Task:** Export the conversation to markdown and save it in this repo.

**Conversation URL:**  
https://chatgpt.com/g/g-p-688bd9e885e0819191f94c089ccb5782-10x/c/694a1e45-1e34-8328-a23b-66a07fd16da9

## Steps

1. **Use the Cursor Browser tab** the agent opened (or open the URL in your browser and log in if needed). Ensure the conversation is fully loaded and visible.
2. **Open DevTools** in that tab (e.g. **Cmd+Option+J** on Mac, **Ctrl+Shift+J** on Windows/Linux) and switch to the **Console** tab.
3. **Copy the full contents** of `scripts/chatgpt-export-convo.js` from this repo.
4. **Paste** into the Console and press **Enter**.
5. A **.md file will download** (filename will include the conversation title and date).
6. **Move or save** that file into:
   ```
   data/export-chatgpt-convo-694a1e45/
   ```
   You can keep the downloaded filename or rename it (e.g. `10x-convo.md`).

## When you’re done

- Move the task file from `tasks/review/` to `tasks/completed/` (or tell the agent the export is done so it can update the lifecycle).

## Alternative (PDF or other formats)

If you prefer another format:  
https://github.com/rashidazarang/chatgpt-chat-exporter  
You can export from there and then copy or convert the content into `data/export-chatgpt-convo-694a1e45/` as needed.
