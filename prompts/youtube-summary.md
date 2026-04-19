# YouTube Transcript Summary Prompt

Use this when summarizing a YouTube video from transcript output.

## Prerequisite

Run the transcript script first and use its output as the only source:

`npm run transcript -- "<youtube-url>"`

Save the raw transcript under `artifacts/<youtube-title-slug>/data/`.

## Chapter-based summary

Chapters are either (a) from the transcript or video metadata when available, or (b) inferred once from the transcript (e.g. logical groupings by topic or time). After that, do not change the chapter list.

Derive a concise `name` and a clear summary `description` for **each** chapter based **only** on its transcript.

- Do **not** change, remove, reorder, or insert chapters. Do **not** modify any existing values.
- Return the same number of chapters in the same order.

**Guidelines:**

- `name`: ≤ 50 characters, specific, informative, no emojis or links.
- `description`: 1–2 sentences summarizing the chapter’s content.
- If a chapter’s text is minimal or generic, infer from the best available clues without fabricating facts.

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
