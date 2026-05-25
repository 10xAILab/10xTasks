#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { scrapeProductHuntProduct } from './scrape-product.js'

const runDir = process.argv[2]
if (!runDir) {
  console.error('Usage: node compare-predictions.js <run-dir>')
  process.exit(1)
}

const predictionsPath = path.join(runDir, 'predictions.json')
const predictionsDoc = JSON.parse(fs.readFileSync(predictionsPath, 'utf8'))
const predictions = predictionsDoc.predictions
const date = predictionsDoc.date || path.basename(runDir)

function parseRank(dayRank) {
  if (!dayRank) return null
  const n = Number(String(dayRank).replace(/[^0-9]/g, ''))
  return Number.isFinite(n) ? n : null
}

function median(nums) {
  if (!nums.length) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function mean(nums) {
  if (!nums.length) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

const scraped = []
for (const p of predictions) {
  const scrapedAt = new Date().toISOString()
  try {
    const stats = await scrapeProductHuntProduct(p.product_hunt_url)
    const actualRank = parseRank(stats.dayRank)
    scraped.push({
      prediction: p,
      actual_rank: actualRank,
      actual_day_rank_label: stats.dayRank,
      actual_upvotes: stats.upvotes ?? null,
      scraped_at: scrapedAt,
      actuals_error:
        actualRank == null || stats.upvotes == null
          ? 'Missing dayRank or upvotes in scrape response'
          : null,
    })
    process.stderr.write('.')
  } catch (err) {
    scraped.push({
      prediction: p,
      actual_rank: null,
      actual_day_rank_label: null,
      actual_upvotes: null,
      scraped_at: scrapedAt,
      actuals_error: err.message,
    })
    process.stderr.write('x')
  }
}
process.stderr.write('\n')

const ok = scraped.filter((r) => r.actual_rank != null && r.actual_upvotes != null)
const byUpvotes = [...ok].sort((a, b) => b.actual_upvotes - a.actual_upvotes)
const upvoteRankMap = new Map(byUpvotes.map((r, i) => [r.prediction.product_hunt_slug, i + 1]))

const results = scraped.map((row) => {
  const p = row.prediction
  const predictedRank = p.predicted_rank
  const actualRank = row.actual_rank
  const actualUpvoteRank = upvoteRankMap.get(p.product_hunt_slug) ?? null

  const signedRankError =
    actualRank != null ? actualRank - predictedRank : null
  const absoluteRankError =
    signedRankError != null ? Math.abs(signedRankError) : null
  const upvoteRankError =
    actualUpvoteRank != null ? actualUpvoteRank - predictedRank : null

  const predictedTop3 = predictedRank <= 3
  const actualTop3 = actualRank != null && actualRank <= 3
  const predictedTop5 = predictedRank <= 5
  const actualTop5 = actualRank != null && actualRank <= 5

  return {
    product_hunt_slug: p.product_hunt_slug,
    product_name: p.product_name,
    prediction: {
      predicted_rank: predictedRank,
      product_hunt_url: p.product_hunt_url,
      website_url: p.website_url,
      category: p.category,
      scores: p.scores,
      predicted_success_score: p.predicted_success_score,
      confidence: p.confidence,
      reasoning: p.reasoning,
      likely_ai_bias_or_risk: p.likely_ai_bias_or_risk ?? '',
    },
    actuals: {
      actual_rank: actualRank,
      actual_day_rank_label: row.actual_day_rank_label,
      actual_upvotes: row.actual_upvotes,
      actual_upvote_rank: actualUpvoteRank,
      scraped_at: row.scraped_at,
      actuals_error: row.actuals_error,
    },
    comparison: {
      signed_rank_error: signedRankError,
      absolute_rank_error: absoluteRankError,
      upvote_rank_error: upvoteRankError,
      predicted_top_3: predictedTop3,
      actual_top_3: actualTop3,
      top_3_hit: predictedTop3 && actualTop3,
      predicted_top_5: predictedTop5,
      actual_top_5: actualTop5,
      top_5_hit: predictedTop5 && actualTop5,
    },
  }
})

const absErrors = results
  .map((r) => r.comparison.absolute_rank_error)
  .filter((n) => n != null)
const signedErrors = results
  .map((r) => r.comparison.signed_rank_error)
  .filter((n) => n != null)
const upvoteErrors = results
  .map((r) => r.comparison.upvote_rank_error)
  .filter((n) => n != null)
  .map(Math.abs)

const top3Hits = results.filter((r) => r.comparison.top_3_hit).length
const top5Hits = results.filter((r) => r.comparison.top_5_hit).length
const predictedTop3Count = results.filter((r) => r.comparison.predicted_top_3).length
const actualTop3Count = results.filter((r) => r.comparison.actual_top_3).length
const predictedTop5Count = results.filter((r) => r.comparison.predicted_top_5).length
const actualTop5Count = results.filter((r) => r.comparison.actual_top_5).length

const output = {
  date,
  generated_at: new Date().toISOString(),
  prediction_file: `data/producthunt/predictions/${date}/predictions.json`,
  rss_snapshot_file: `data/producthunt/predictions/${date}/rss.xml`,
  actuals_source:
    'Product Hunt product pages scraped with scripts/product-hunt/scrape-product.js',
  metrics: {
    prediction_count: predictions.length,
    scraped_count: ok.length,
    scrape_failed_count: predictions.length - ok.length,
    rank_error_mean: round(mean(absErrors)),
    rank_error_median: round(median(absErrors)),
    rank_error_max: absErrors.length ? Math.max(...absErrors) : 0,
    signed_rank_error_mean: round(mean(signedErrors)),
    top_3_hits: top3Hits,
    top_3_precision: predictedTop3Count ? round(top3Hits / predictedTop3Count) : 0,
    top_3_recall: actualTop3Count ? round(top3Hits / actualTop3Count) : 0,
    top_5_hits: top5Hits,
    top_5_precision: predictedTop5Count ? round(top5Hits / predictedTop5Count) : 0,
    top_5_recall: actualTop5Count ? round(top5Hits / actualTop5Count) : 0,
    upvote_rank_error_mean: round(mean(upvoteErrors)),
    upvote_rank_error_median: round(median(upvoteErrors)),
  },
  results,
  notes: [
    'Rank and upvotes are scraped from Product Hunt product pages after prediction time.',
    "Scraped values can drift if the comparison is run before Product Hunt's launch day is fully settled.",
  ],
}

function round(n) {
  return Math.round(n * 100) / 100
}

const outPath = path.join(runDir, 'prediction_results.json')
fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
console.log(JSON.stringify(output.metrics, null, 2))
console.log(`Wrote ${outPath}`)
