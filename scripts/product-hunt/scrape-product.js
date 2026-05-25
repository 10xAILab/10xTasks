#!/usr/bin/env node
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

const execFileAsync = promisify(execFile)

const PYTHON_FETCH = `
import sys
import urllib.request

url = sys.argv[1]
headers = {
  "User-Agent": ${JSON.stringify(BROWSER_HEADERS['User-Agent'])},
  "Accept": ${JSON.stringify(BROWSER_HEADERS.Accept)},
  "Accept-Language": ${JSON.stringify(BROWSER_HEADERS['Accept-Language'])},
}
request = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(request, timeout=30) as response:
  print(response.read().decode("utf-8", errors="replace"))
`

function normalizeHtml(html) {
  return html.replace(/\s+/g, ' ')
}

function cleanRank(rankText) {
  return rankText.replace(/<!--.*?-->/g, '').replace(/\s+/g, '')
}

function parseDayRank(html) {
  const normalized = normalizeHtml(html)
  const visibleRank = normalized.match(
    /<div[^>]*>(#(?:\s|<!--.*?-->)*[0-9]+)<\/div>\s*<div[^>]*>Day Rank<\/div>/,
  )
  if (visibleRank) return cleanRank(visibleRank[1])

  const embeddedRank = normalized.match(/"dailyRank"\s*:\s*"([0-9]+)"/)
  return embeddedRank ? `#${embeddedRank[1]}` : null
}

function parseUpvotes(html) {
  const normalized = normalizeHtml(html)
  const visiblePoints = normalized.match(
    /Upvote\s*<span>\s*•\s*([0-9,]+)\s+points\s*<\/span>/,
  )
  if (visiblePoints) return Number(visiblePoints[1].replace(/,/g, ''))

  const embeddedPoints = normalized.match(/"launchDayScore"\s*:\s*([0-9]+)/)
  return embeddedPoints ? Number(embeddedPoints[1]) : null
}

/** Product Hunt embeds launch eligibility on the product page (not traction). */
export function parseLaunchingToday(html) {
  const normalized = normalizeHtml(html)
  const embedded = normalized.match(/"launchingToday"\s*:\s*(true|false)/)
  if (embedded) return embedded[1] === 'true'

  return (
    />\s*Launching\s+Today\s*</i.test(normalized) ||
    /Launching\s+Today<\/div>/i.test(normalized)
  )
}

export function parseLaunchStatusLabel(html) {
  return parseLaunchingToday(html) ? 'Launching Today' : null
}

export function parseProductHuntProductStats(html) {
  return {
    dayRank: parseDayRank(html),
    upvotes: parseUpvotes(html),
  }
}

export function parseProductHuntProductPage(html) {
  const launchingToday = parseLaunchingToday(html)
  return {
    ...parseProductHuntProductStats(html),
    launchingToday,
    launchStatusLabel: launchingToday ? 'Launching Today' : null,
  }
}

export function fetchProductPage(url) {
  return execFileAsync('python3', ['-c', PYTHON_FETCH, url], {
    maxBuffer: 20 * 1024 * 1024,
    timeout: 35000,
  }).then(({ stdout }) => stdout)
}

export async function scrapeProductHuntProduct(url) {
  const html = await fetchProductPage(url)
  return {
    url,
    ...parseProductHuntProductPage(html),
  }
}

async function main() {
  const args = process.argv.slice(2)
  const launchStatusOnly = args.includes('--launch-status')
  const url = args.find((a) => a.startsWith('http'))

  if (!url) {
    console.error(
      'Usage: node scripts/product-hunt/scrape-product.js [--launch-status] <product-hunt-product-url>',
    )
    console.error(
      '  Default: dayRank, upvotes, launchingToday (for compare runs and eligibility checks).',
    )
    console.error(
      '  --launch-status: only url, launchingToday, launchStatusLabel (no rank/upvotes).',
    )
    process.exit(1)
  }

  const stats = await scrapeProductHuntProduct(url)
  const output = launchStatusOnly
    ? {
        url: stats.url,
        launchingToday: stats.launchingToday,
        launchStatusLabel: stats.launchStatusLabel,
      }
    : stats

  console.log(JSON.stringify(output, null, 2))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
