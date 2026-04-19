# Scripts

Scripts are deterministic utilities used by AI agents.

Guidelines:
- keep scripts small
- make behavior predictable
- accept CLI input
- output JSON or text
- avoid dependencies when possible

Each script should include a README with purpose, usage, input, and output.

## Included Scripts

- `install-skills`: installs local skills globally by creating symlinks for
  supported AI tools.
- `youtube-transcript/get_transcript.js`: fetches transcript segments from a
  YouTube URL and prints JSON.
- `game-asset/generate-game-asset-gemini.js`: creates one variation image
  from a reference image using Gemini.
- `game-asset/generate-game-asset-openai.js`: creates one variation image
  from a reference image using OpenAI.
- `game-asset/generate-game-asset-openrouter.js`: creates one variation image
  from a reference image using OpenRouter (Flux Klein 4B by default).

## Usage

From the repository root:

- `npm run install-skills`
- `npm run transcript -- "<youtube-url>"`
- `npm run game-asset -- --input "<image-path>" --output-dir "<dir>"`
- `npm run game-asset:openai -- --input "<image-path>" --output-dir "<dir>"`
- `npm run game-asset:openrouter -- --input "<image-path>" --output-dir "<dir>"`
