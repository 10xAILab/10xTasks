# Game Asset Scripts

Create one variation image from a reference image.

## Scripts

- `generate-game-asset-gemini.js` (Gemini, `GEMINI_API_KEY_CHICO`)
- `generate-game-asset-openai.js` (OpenAI, `OPENAI_API_KEY`)
- `generate-game-asset-openrouter.js` (OpenRouter, `OPENROUTER_API_KEY_TEDDYBEAR_MATH`, default model `black-forest-labs/flux.2-klein-4b`)

## Usage

From repository root:

- `npm run game-asset -- --input "<path-to-image>" --output-dir "<output-directory>" --variation "<variation-text>"`
- `npm run game-asset:openai -- --input "<path-to-image>" --output-dir "<output-directory>" --variation "<variation-text>"`
- `npm run game-asset:openrouter -- --input "<path-to-image>" --output-dir "<output-directory>" --variation "<variation-text>"`

Required prompt input:

- Provide either `--variation "<text>"` or `--prompt "<custom instruction>"`

## Output

- Writes `<output-directory>/variation-1.png` (Gemini and OpenAI)
- OpenRouter writes `<output-directory>/variation-<iso-timestamp>.png` (filename-safe UTC time)
- Prints JSON with `ok`, `provider`, `model`, `input`, and `output`
