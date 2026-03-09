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

## Usage

From the repository root:

- `npm run install-skills`
- `npm run transcript -- "<youtube-url>"`
