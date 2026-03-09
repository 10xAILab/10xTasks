# YouTube Transcript Script

Fetch transcript segments for a YouTube video URL and output JSON.

## Usage

```bash
node scripts/youtube-transcript/get_transcript.js "https://youtu.be/tidINuXB7PA"
```

## Supported URL Formats

- `https://www.youtube.com/watch?v=<id>`
- `https://youtu.be/<id>`
- `https://www.youtube.com/live/<id>`

## Output

```json
{
  "videoId": "...",
  "transcript": [
    { "startTime": "...", "endTime": "...", "text": "..." }
  ]
}
```
