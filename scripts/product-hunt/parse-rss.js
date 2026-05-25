#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { scrapeProductHuntProduct } from './scrape-product.js'

const args = process.argv.slice(2)
const includeAllFeed = args.includes('--include-all-feed')
const RUN_DIR = args.find((a) => !a.startsWith('--'))

if (!RUN_DIR) {
  console.error('Usage: node parse-rss.js [--include-all-feed] <run-dir>')
  console.error(
    '  Default: keep only RSS entries whose product page shows Launching Today.',
  )
  process.exit(1)
}

const xml = fs.readFileSync(path.join(RUN_DIR, 'rss.xml'), 'utf8')
const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1])

function decodeHtml(s) {
  return s
    ?.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

function parseEntry(e) {
  const get = (tag) =>
    e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim()
  const link = e.match(
    /href="(https:\/\/www\.producthunt\.com\/products\/[^"]+)"/,
  )?.[1]
  const slug = link?.split('/').pop()
  const tagline = decodeHtml(
    e.match(/<p>\s*([^<]+)\s*<\/p>/)?.[1] ||
      e.match(/&lt;p&gt;\s*([^&]+?)\s*&lt;\/p&gt;/)?.[1],
  )
  const redirect = e.match(
    /href="(https:\/\/www\.producthunt\.com\/r\/p\/[^"]+)"/,
  )?.[1]
  return {
    title: get('title'),
    link,
    guid: get('id'),
    published: get('published'),
    updated: get('updated'),
    author: get('name'),
    tagline,
    redirect,
    slug,
    website_url: null,
  }
}

const rssProducts = entries.map(parseEntry)

async function resolveUrl(redirect) {
  try {
    const res = await fetch(redirect, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; 10xTasks/1.0)' },
    })
    return res.url
  } catch {
    return null
  }
}

const eligibility = []
for (let i = 0; i < rssProducts.length; i++) {
  const p = rssProducts[i]
  let launchingToday = null
  let launchStatusLabel = null
  let checkError = null

  if (!p.link) {
    checkError = 'Missing product_hunt_url in RSS entry'
  } else {
    try {
      const page = await scrapeProductHuntProduct(p.link)
      launchingToday = page.launchingToday
      launchStatusLabel = page.launchStatusLabel
    } catch (err) {
      checkError = err.message
    }
  }

  const included =
    includeAllFeed || (launchingToday === true && checkError == null)

  eligibility.push({
    slug: p.slug,
    title: p.title,
    link: p.link,
    guid: p.guid,
    published: p.published,
    updated: p.updated,
    launching_today: launchingToday,
    launch_status_label: launchStatusLabel,
    included_in_run: included,
    check_error: checkError,
  })

  console.error(
    `${i + 1}/${rssProducts.length} ${p.slug} launchingToday=${launchingToday}${included ? ' ✓' : ' ✗'}`,
  )
  await new Promise((r) => setTimeout(r, 200))
}

const products = rssProducts.filter((p) => {
  const row = eligibility.find((e) => e.slug === p.slug)
  return row?.included_in_run
})

for (let i = 0; i < products.length; i++) {
  const p = products[i]
  if (p.redirect) {
    p.website_url = await resolveUrl(p.redirect)
    console.error(
      `resolve ${i + 1}/${products.length} ${p.slug} -> ${p.website_url}`,
    )
  }
  await new Promise((r) => setTimeout(r, 150))
}

const now = new Date().toISOString()
fs.writeFileSync(
  path.join(RUN_DIR, 'launch-eligibility.json'),
  JSON.stringify(
    {
      checked_at: now,
      include_all_feed: includeAllFeed,
      rss_entry_count: rssProducts.length,
      launching_today_count: eligibility.filter((e) => e.launching_today).length,
      included_count: products.length,
      method:
        'Product Hunt product page via scripts/product-hunt/scrape-product.js (launchingToday / Launching Today label)',
      entries: eligibility,
    },
    null,
    2,
  ),
)

fs.writeFileSync(
  path.join(RUN_DIR, 'products-with-urls.json'),
  JSON.stringify(products, null, 2),
)

console.log(
  `Wrote ${products.length} products (${rssProducts.length} RSS entries, ${eligibility.filter((e) => e.launching_today).length} launching today)`,
)
