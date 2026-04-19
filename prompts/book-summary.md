# Book Summary Prompt

Use this when summarizing a book from a title and/or a source link.

## Inputs

You may receive one of:

- a book title only
- an Amazon link
- another book reference link

## Prerequisites

1. Resolve the exact edition being summarized (title + author).
   - If book not found or accuracy confidence is low then ask for confirmation approval before continuing.
2. Include an **Amazon UK Kindle** link for that book and the displayed Kindle price in GBP and if it's available via Kindle unlimited.
   - If only a title is provided, find the best matching Amazon UK Kindle listing.
   - If no Kindle edition exists, state `Kindle edition not found on Amazon UK` and continue.
3. Base the summary on reliable source material (official synopsis, chapter outlines, trusted summaries/interviews). Do not fabricate chapter names or claims.

## Content Requirements

Include all of the following in this order:

1. **Book:** `<title>`
2. **Author:** `<name>` + one short sentence about the author.
3. **Amazon UK Kindle:** markdown link + price in GBP + if it's available via Kindle unlimited (or not found note).
4. **Brief description:** 2-3 sentences about the book.
5. **3 key insights:** exactly 3 bullet points.
6. **3 gates:** exactly 3 bullets, one sentence max each:
   - **Operator:** whether the book changes how you think (not just what you think).
   - **Challenger:** whether the book challenges existing beliefs.
   - **Fire alarm:** whether the book helps prevent costly mistakes.
7. **1 popular YouTube video:** one URL that discusses this book.
8. **3 real reviews:** with exactly:
   - rating (if available) & one short quote/snippet
9. **Chapter-by-chapter summary:** max one sentence per chapter.

## Where to save

Save the summary under `artifacts/<book title>/summary.md`.

## Output Format

Return only valid markdown in this structure:

```markdown
**Book:** <title>
**Author:** <author> — <one short sentence about author>
**Amazon UK Kindle:** [<book title>](<amazon-uk-kindle-link>) — <price or "Kindle unlimited" or "Not found on Amazon UK">

**Brief description:** <2-3 sentences>

## Key Insights
- <insight 1>
- <insight 2>
- <insight 3>

## 3 Gates
- **Operator:** <one sentence>
- **Challenger:** <one sentence>
- **Fire alarm:** <one sentence>

## Popular YouTube Video
- <url>

## Real Reviews
- (<rating if available>): "<short quote>"
- (<rating if available>): "<short quote>"
- (<rating if available>): "<short quote>"

## Chapters

### 1. <chapter title>
<one sentence summary>

### 2. <chapter title>
<one sentence summary>
```

## Quality Rules

- Do not invent data; if unavailable, say so explicitly.
- Keep chapter summaries concise (one sentence max each).
- Keep wording factual and neutral.
- Prefer Amazon UK product pages for the Kindle link and price.
