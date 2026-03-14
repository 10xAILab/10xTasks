#!/usr/bin/env node
import { fetchTranscript } from 'youtube-transcript-plus'

function getVideoId(url) {
  try {
    const cleanedUrl = url.split('?')[0].split('#')[0]
    const u = new URL(cleanedUrl)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0]
    if (u.hostname.includes('youtube.com')) {
      const originalUrl = new URL(url)
      const queryId = originalUrl.searchParams.get('v')
      if (queryId) return queryId

      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] === 'live' || parts[0] === 'shorts') return parts[1] || null
      if (parts[0] === 'embed') return parts[1] || null
    }
  } catch {}
  return null
}

function normalizeOutput(videoId, rows) {
  return {
    videoId,
    transcript: rows
      .map((row) => {
        const startMs = Math.round(Number(row.offset || 0) * 1000)
        const durationMs = Math.round(Number(row.duration || 0) * 1000)
        return {
          startTime: String(startMs),
          endTime: String(startMs + durationMs),
          text: (row.text || '').trim(),
        }
      })
      .filter((row) => row.text.length > 0),
  }
}

export async function getVideoTranscriptViaYoutubeUsingPlus(videoIdOrUrl) {
  const videoId =
    videoIdOrUrl.startsWith('http://') || videoIdOrUrl.startsWith('https://')
      ? getVideoId(videoIdOrUrl)
      : videoIdOrUrl

  if (!videoId) throw new Error('Invalid YouTube URL or video ID')

  try {
    const transcriptRows = await fetchTranscript(videoId, { lang: 'en' })
    const output = normalizeOutput(videoId, transcriptRows)
    if (!output.transcript.length) throw new Error('No transcript segments found')
    return output
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error getting transcript: ${message}`)
  }
}

async function main() {
  const urlOrId = process.argv[2]
  if (!urlOrId) {
    console.error('Usage: npm run transcript -- <youtube-url>')
    process.exit(1)
  }
  const transcript = await getVideoTranscriptViaYoutubeUsingPlus(urlOrId)
  console.log(JSON.stringify(transcript, null, 2))
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
