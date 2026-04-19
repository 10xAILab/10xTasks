# Game Asset Variation Prompt

Use this prompt when creating one variation image from an existing reference image.

## Goal

Generate exactly one variation image while preserving the style inferred from the reference image.

## Required inputs before running

1. Reference image path (local file)
2. Output directory path

If output directory is missing, ask for it before proceeding.

## Defaults

- Output count: one image (`variation-1.png`)
- Style: inferred from the provided image (no default pixel-art assumption)
- API key source (Gemini): `GEMINI_API_KEY_CHICO`
- API key source (OpenAI): `OPENAI_API_KEY`
- API key source (OpenRouter): `OPENROUTER_API_KEY_TEDDYBEAR_MATH` (default model `black-forest-labs/flux.2-klein-4b`)

## Command

From repository root:

`npm run game-asset -- --input "<reference-image-path>" --output-dir "<output-directory>" --variation "<variation-text>"`

OpenAI alternative:

`npm run game-asset:openai -- --input "<reference-image-path>" --output-dir "<output-directory>" --variation "<variation-text>"`

OpenRouter alternative:

`npm run game-asset:openrouter -- --input "<reference-image-path>" --output-dir "<output-directory>" --variation "<variation-text>"`

Optional:

- `--prompt "<custom variation instruction>"`
- `--model "<provider-model>"` (e.g. override OpenRouter model)
- Provide either `--variation "<text>"` or `--prompt "<text>"`

## Expected result

- Saves one image to `<output-directory>/variation-1.png`
- Prints JSON with `ok`, `model`, `input`, and `output`
