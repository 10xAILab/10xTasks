#!/usr/bin/env node
/**
 * Bucket transcript JSON into N time windows for chapter-style summaries.
 * Usage: node bucket_transcript.js <transcript.json> [numBuckets]
 */
import fs from 'fs'

function decodeHtml(s) {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
}

const file = process.argv[2]
const numBuckets = Math.max(3, Math.min(20, Number(process.argv[3]) || 10))
if (!file) {
  console.error('Usage: node bucket_transcript.js <transcript.json> [numBuckets]')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const rows = data.transcript || []
if (!rows.length) process.exit(1)

const starts = rows.map((r) => Number(r.startTime))
const ends = rows.map((r) => Number(r.endTime))
const firstMs = Math.min(...starts)
const lastMs = Math.max(...ends)
const span = Math.max(lastMs - firstMs, 1)
const bucketMs = span / numBuckets

const buckets = Array.from({ length: numBuckets }, (_, i) => ({
  index: i,
  startMs: firstMs + Math.floor(i * bucketMs),
  endMs: firstMs + Math.floor((i + 1) * bucketMs),
  texts: [],
}))

for (const row of rows) {
  const mid = (Number(row.startTime) + Number(row.endTime)) / 2
  let i = Math.floor((mid - firstMs) / bucketMs)
  if (i >= numBuckets) i = numBuckets - 1
  if (i < 0) i = 0
  buckets[i].texts.push(decodeHtml(row.text))
}

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

for (const b of buckets) {
  const text = b.texts.join(' ').replace(/\s+/g, ' ').trim()
  console.log('---')
  console.log(`CHAPTER ${b.index + 1} | ${fmt(b.startMs)} - ${fmt(b.endMs)}`)
  console.log(text.slice(0, 12000))
  if (text.length > 12000) console.log('\n[...truncated...]')
}
