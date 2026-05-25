# YouTube Transcript Summary Prompt

Use this when summarizing a YouTube video from transcript output.

## Scope

- Process **one video per task**. Use only that task’s transcript and artifact paths.
- Do not batch summaries across videos or copy wording from another `result.md`.

## Prerequisite

Run the transcript script first and use its output as the only source:

`npm run transcript -- "<youtube-url>"`

Save the raw transcript under `artifacts/<task-slug>/data/` (e.g. `transcript.json`).

## Workflow

1. **Transcript** — Run the script if needed; confirm the saved file matches this task’s URL/video id.
2. **Re-read** — Read the full saved transcript for this task before drafting. Treat it as the sole source of facts, topics, and time ranges.
3. **Summarize** — Write `artifacts/<task-slug>/result.md` using the chapter rules below. Paraphrase; do not paste transcript lines as chapter titles or descriptions.
4. **Re-check** — Before finishing, compare `result.md` to the same transcript:
   - Title and brief describe this video, not a generic “AI workflow” or another topic.
   - Each chapter’s time range matches transcript segment times (convert `startTime` / `endTime` ms to `MM:SS` or `HH:MM:SS`; do not invent ranges).
   - Chapter count, order, names, and descriptions reflect what is said in those segments only.
   - No claims, products, or outcomes absent from the transcript.
5. If alignment fails after a careful revision pass, do not ship a placeholder summary. Record the blocker in `artifacts/<task-slug>/` and move the task to `tasks/review` with **Next Steps**.

## Chapter-based summary

Chapters are either (a) from the transcript or video metadata when available, or (b) inferred once from the transcript (e.g. logical groupings by topic or time). After that, do not change the chapter list.

Derive a concise `name` and a clear summary `description` for **each** chapter based **only** on its transcript.

- Do **not** change, remove, reorder, or insert chapters. Do **not** modify any existing values.
- Return the same number of chapters in the same order.

**Guidelines:**

- `name`: ≤ 50 characters, specific, informative, no emojis or links.
- `description`: 1–2 sentences summarizing the chapter’s content.
- If a chapter’s text is minimal or generic, infer from the best available clues without fabricating facts.
- Do **not** use boilerplate chapter titles or descriptions (e.g. “planning and design iteration”, “agent execution”, “structured workflow”) unless the transcript actually discusses those topics in that segment.

**Output:**

Return **only** valid markdown for the summary. Structure:

1. **Original link:** The YouTube URL for the video.
1. **Title:** The YouTube video title.
2. **Brief description:** One or two sentences summarizing the video (max 2 sentences), before any chapters.
3. **Chapters:** Every chapter in this form:

```markdown
### <chapter name> (<start time> - <end time>)
<description>
```

Use the same time format as in the transcript (e.g. convert ms to `MM:SS` or keep as provided).
