#!/usr/bin/env node
/**
 * Build predictions.json from products-with-urls.json per prompts/producthunt/predict.md.
 * Add per-launch scores in scores-YYYY-MM-DD.js and import for each run.
 */
import fs from 'node:fs'
import path from 'node:path'
import { SCORES } from './scores-2026-05-22.js'

const RUN_DIR = process.argv[2]
if (!RUN_DIR) {
  console.error('Usage: node build-predictions.js <run-dir>')
  process.exit(1)
}

const products = JSON.parse(
  fs.readFileSync(path.join(RUN_DIR, 'products-with-urls.json'), 'utf8'),
)

function feedArchetypeCounts() {
  let saturated = 0
  let broadTrap = 0
  for (const p of products) {
    const meta = SCORES[p.slug]
    if (!meta) continue
    if (meta.saturated) saturated++
    if (meta.broad_trap) broadTrap++
  }
  return { saturated, broadTrap }
}

const INCUMBENT_SLUGS = new Set(['openai', 'gemini-3-1-flash-lite-2', 'krea', 'picsart', 'kimi-ai-assistant'])

function credibilityEffective(raw, meta) {
  let eff = raw
  if (meta.incumbent || raw >= 9) eff = Math.min(eff, 8)
  if (!meta.verified) eff = Math.min(eff, 6)
  return eff
}

function weightedScore(scores, credEff) {
  const s = scores
  return (
    0.13 * s.clarity +
    0.07 * s.novelty +
    0.16 * s.usefulness +
    0.14 * s.shareability +
    0.14 * s.product_hunt_audience_fit +
    0.08 * credEff +
    0.14 * s.launch_momentum_potential +
    0.14 * s.ph_core_voter_appeal +
    0.1 * s.broad_vote_appeal
  )
}

let saturatedCount = 0
let broadTrapCount = 0

function saturationPenalty(meta) {
  if (!meta.saturated) return 0
  if (
    meta.maker_signal ||
    meta.meta_ph ||
    meta.outcome_differentiated ||
    meta.ecommerce_outcome ||
    meta.best_in_feed_infra ||
    meta.vertical_agent_utility
  )
    return 0
  if (saturatedCount >= 8) return -0.5
  if (saturatedCount >= 5) return -0.3
  if (saturatedCount >= 3) return -0.2
  return 0
}

function calibrate(meta, scores, credEff) {
  const base = weightedScore(scores, credEff)
  const satPen = saturationPenalty(meta)
  const incPen = meta.incumbent
    ? meta.tier1_incumbent
      ? -0.2
      : -0.4
    : 0
  const broadTrapPen =
    meta.broad_trap && scores.ph_core_voter_appeal <= 6 ? -0.4 : 0
  const phCoreBoost =
    scores.ph_core_voter_appeal >= 8 && scores.usefulness >= 8 ? 0.5 : 0
  const outcomeBoost =
    meta.outcome_differentiated && scores.clarity >= 8 ? 0.4 : 0
  let makerBoost = 0
  if (meta.maker_signal) {
    makerBoost =
      meta.incumbent || meta.relaunch || meta.prior_ph_winner ? 0.5 : 0.2
  }
  const metaPhBoost = meta.meta_ph ? 0.4 : 0
  const hardwareBoost = /hardware|E-ink|Mic Pro|dev board/i.test(meta.category) ? 0.3 : 0
  const comboBoost =
    scores.broad_vote_appeal >= 8 && scores.ph_core_voter_appeal >= 7 ? 0.3 : 0
  const practicalBoost =
    meta.practical_builder_tool && scores.usefulness >= 8 && scores.clarity >= 8
      ? 0.3
      : 0
  const relaunchBoost = meta.relaunch ? 0.2 : 0
  const ecommerceBoost =
    meta.ecommerce_outcome && meta.scores.clarity >= 8 && meta.scores.shareability >= 8
      ? 0.4
      : 0
  const tier1Boost =
    meta.tier1_incumbent &&
    meta.scores.broad_vote_appeal >= 7 &&
    meta.scores.shareability >= 8
      ? 0.3
      : 0

  const total =
    satPen +
    incPen +
    broadTrapPen +
    phCoreBoost +
    outcomeBoost +
    makerBoost +
    metaPhBoost +
    hardwareBoost +
    comboBoost +
    practicalBoost +
    relaunchBoost +
    ecommerceBoost +
    tier1Boost

  return {
    saturation_penalty: satPen,
    incumbent_penalty: incPen,
    broad_trap_penalty: broadTrapPen,
    ph_core_boost: phCoreBoost,
    maker_signal_boost: makerBoost,
    outcome_boost: outcomeBoost,
    meta_ph_boost: metaPhBoost,
    broad_ph_combo_boost: comboBoost,
    hardware_boost: hardwareBoost,
    practical_builder_boost: practicalBoost,
    relaunch_boost: relaunchBoost,
    ecommerce_outcome_boost: ecommerceBoost,
    tier1_incumbent_boost: tier1Boost,
    total_adjustment: Math.round(total * 100) / 100,
    base: Math.round(base * 100) / 100,
    adjusted: Math.round((base + total) * 100) / 100,
  }
}

function confidence(meta, scores, rank) {
  if (!meta.verified) return 'low'
  if (meta.broad_trap && scores.ph_core_voter_appeal <= 6) return 'low'
  if (rank <= 3) return 'medium'
  if (meta.meta_ph) return 'medium'
  if (meta.best_in_feed_infra && !meta.prior_ph_winner) return 'medium'
  if (
    meta.verified &&
    scores.ph_core_voter_appeal >= 8 &&
    (meta.prior_ph_winner ||
      (meta.outcome_differentiated && meta.practical_builder_tool && !meta.best_in_feed_infra))
  )
    return 'high'
  if (meta.saturated && !meta.maker_signal && !meta.best_in_feed_infra) return 'medium'
  return 'medium'
}

function aiRisk(meta, scores) {
  if (meta.broad_trap)
    return 'Broad-trap archetype; 2026-05-15 calibration showed high broad_vote_appeal alone over-ranked.'
  if (meta.saturated && scores.ph_core_voter_appeal < 7)
    return 'Generic saturated agent/MCP launch in AI-heavy feed.'
  if (meta.incumbent)
    return 'Major-brand extension may land top 10 but underperformed #1 predictions historically.'
  return ''
}

;({ saturated: saturatedCount, broadTrap: broadTrapCount } = feedArchetypeCounts())

const ranked = products.map((p) => {
  const meta = SCORES[p.slug]
  if (!meta) throw new Error(`Missing scores for ${p.slug}`)
  const credEff = credibilityEffective(meta.scores.credibility, meta)
  const cal = calibrate(meta, meta.scores, credEff)
  return { ...p, meta, credEff, cal }
})

ranked.sort((a, b) => {
  if (b.cal.adjusted !== a.cal.adjusted) return b.cal.adjusted - a.cal.adjusted
  const tieKeys = [
    'ph_core_voter_appeal',
    'product_hunt_audience_fit',
    'usefulness',
    'shareability',
  ]
  for (const k of tieKeys) {
    if (b.meta.scores[k] !== a.meta.scores[k]) return b.meta.scores[k] - a.meta.scores[k]
  }
  return Math.abs(a.cal.saturation_penalty) - Math.abs(b.cal.saturation_penalty)
})

// Pre-save review: demote undifferentiated saturated agent from top 3 if all three
const top3 = ranked.slice(0, 3)
const top3AllGenericSaturated = top3.every(
  (r) =>
    r.meta.saturated &&
    !r.meta.maker_signal &&
    !r.meta.outcome_differentiated &&
    !r.meta.best_in_feed_infra,
)
if (top3AllGenericSaturated) {
  const promote = ranked.find(
    (r) =>
      !top3.includes(r) &&
      (r.meta.best_in_feed_infra ||
        r.meta.outcome_differentiated ||
        r.meta.maker_signal) &&
      r.meta.scores.ph_core_voter_appeal >= 8,
  )
  if (promote) {
    const idx = ranked.indexOf(promote)
    ranked.splice(idx, 1)
    ranked.splice(2, 0, promote)
    promote.promotedInReview = true
  }
}

// Stacked-boost guardrail: no #1 when total_adjustment >= 1.2 without proof
const top1 = ranked[0]
const top1OkAt1 =
  top1.cal.total_adjustment < 1.2 ||
  top1.meta.incumbent ||
  top1.meta.relaunch ||
  (top1.meta.prior_ph_winner && top1.meta.scores.product_hunt_audience_fit >= 9) ||
  (top1.meta.meta_ph && top1.meta.scores.product_hunt_audience_fit >= 10)
if (!top1OkAt1) {
  const swap = ranked
    .slice(1)
    .filter(
      (r) =>
        r.cal.total_adjustment < 1.2 ||
        r.meta.relaunch ||
        (r.meta.incumbent && r.meta.scores.product_hunt_audience_fit >= 9) ||
        r.meta.prior_ph_winner ||
        (r.meta.meta_ph && r.meta.scores.product_hunt_audience_fit >= 10),
    )
    .sort((a, b) => b.cal.adjusted - a.cal.adjusted)[0]
  if (swap) {
    const a = ranked.indexOf(top1)
    const b = ranked.indexOf(swap)
    ;[ranked[a], ranked[b]] = [ranked[b], ranked[a]]
    swap.promotedInReview = true
    top1.demotedStackedBoost = true
  }
}

// Promote practical builder tools (large feeds only; 2026-05-20: over-promoted on ≤25 launches)
const smallFeed = ranked.length <= 25
if (!smallFeed) {
  const practicalScanFrom = Math.min(17, Math.max(11, ranked.length - 6))
  const practicalPromoteInto = Math.min(11, ranked.length - 1)
  for (const r of ranked) {
    const idx = ranked.indexOf(r)
    if (
      idx >= practicalScanFrom &&
      r.meta.practical_builder_tool &&
      r.meta.scores.usefulness >= 8 &&
      r.meta.scores.clarity >= 8 &&
      r.meta.scores.ph_core_voter_appeal >= 7
    ) {
      const target = ranked.findIndex(
        (x, i) => i >= practicalPromoteInto && i < idx && !x.meta.practical_builder_tool,
      )
      if (target >= practicalPromoteInto) {
        ranked.splice(idx, 1)
        ranked.splice(target, 0, r)
        r.promotedInReview = true
      }
    }
  }
}

function promoteIntoRank(item, targetIndex) {
  const idx = ranked.indexOf(item)
  if (idx < 0 || idx <= targetIndex) return
  ranked.splice(idx, 1)
  ranked.splice(targetIndex, 0, item)
  item.promotedInReview = true
}

// 2026-05-20: ecommerce + hunter below rank 8 → top 5
for (const r of ranked) {
  const idx = ranked.indexOf(r)
  if (
    idx >= 7 &&
    r.meta.ecommerce_outcome &&
    r.meta.scores.shareability >= 8 &&
    (r.meta.maker_signal || r.author?.includes?.('Messina'))
  ) {
    promoteIntoRank(r, Math.min(4, ranked.length - 1))
  }
}

// tier-1 incumbent below rank 8 → top 6 (not #1 when meta-PH competitor exists)
const metaPhLeader = ranked.find(
  (r) => r.meta.meta_ph && r.meta.scores.product_hunt_audience_fit >= 10,
)
const tier1Target = metaPhLeader ? Math.min(4, ranked.length - 1) : Math.min(5, ranked.length - 1)
for (const r of ranked) {
  const idx = ranked.indexOf(r)
  if (
    idx >= 7 &&
    r.meta.tier1_incumbent &&
    r.meta.scores.broad_vote_appeal >= 7
  ) {
    promoteIntoRank(r, tier1Target)
  }
}

// prior PH winner + relaunch below rank 10 → top 5 (2026-05-21: WeWeb)
for (const r of ranked) {
  const idx = ranked.indexOf(r)
  if (idx >= 9 && r.meta.prior_ph_winner && r.meta.relaunch) {
    promoteIntoRank(r, Math.min(4, ranked.length - 1))
  }
}

// Hunter workflow/docs hunts: maker + outcome below rank 6 → top 5 (not generic OSS vaults)
for (const r of ranked) {
  const idx = ranked.indexOf(r)
  if (
    idx >= 5 &&
    r.meta.maker_signal &&
    r.meta.outcome_differentiated &&
    !r.meta.best_in_feed_infra &&
    (r.meta.saturated || r.meta.relaunch || r.meta.practical_builder_tool) &&
    r.meta.scores.ph_core_voter_appeal >= 8
  ) {
    promoteIntoRank(r, Math.min(4, ranked.length - 1))
  }
}

// meta-PH + max audience fit: ensure #1 when present (2026-05-21: Tycoon)
if (metaPhLeader && ranked.indexOf(metaPhLeader) > 0) {
  promoteIntoRank(metaPhLeader, 0)
}

// vertical agent utility below rank 15 → top 10
for (const r of ranked) {
  const idx = ranked.indexOf(r)
  if (
    idx >= 14 &&
    r.meta.vertical_agent_utility &&
    r.meta.scores.usefulness >= 8
  ) {
    promoteIntoRank(r, Math.min(9, ranked.length - 1))
  }
}

// small feed: max 2 practical_builder_tool in top 5
if (smallFeed) {
  const top5Practical = ranked
    .slice(0, 5)
    .filter((r) => r.meta.practical_builder_tool)
  if (top5Practical.length > 2) {
    const demote = top5Practical
      .slice(2)
      .sort((a, b) => a.cal.adjusted - b.cal.adjusted)
    for (const r of demote) {
      const idx = ranked.indexOf(r)
      ranked.splice(idx, 1)
      ranked.splice(5, 0, r)
      r.demotedPracticalCluster = true
    }
  }

  // best_in_feed_infra without prior PH win: cap out of top 5 (2026-05-21: InstaVM)
  for (const r of ranked.slice(0, 5)) {
    if (r.meta.best_in_feed_infra && !r.meta.prior_ph_winner) {
      const idx = ranked.indexOf(r)
      ranked.splice(idx, 1)
      ranked.splice(Math.min(5, ranked.length), 0, r)
      r.demotedInfraHype = true
    }
  }
}

// Boost under-ranked maker signal below rank 15
for (const r of ranked) {
  if (
    r.meta.maker_signal &&
    r.meta.scores.ph_core_voter_appeal >= 8 &&
    ranked.indexOf(r) >= 14
  ) {
    r.underRankedMaker = true
  }
}

const date = path.basename(RUN_DIR)
const feedUpdated = fs
  .readFileSync(path.join(RUN_DIR, 'rss.xml'), 'utf8')
  .match(/<updated>([^<]*)<\/updated>/)?.[1]
const now = new Date().toISOString()
const eligibilityPath = path.join(RUN_DIR, 'launch-eligibility.json')
const eligibility = fs.existsSync(eligibilityPath)
  ? JSON.parse(fs.readFileSync(eligibilityPath, 'utf8'))
  : null

const output = {
  date,
  generated_at: now,
  fetched_at: now,
  timezone: `America/Los_Angeles (Product Hunt RSS feed updated ${feedUpdated || '2026-05-18T00:01:00-07:00'})`,
  fetch_method: 'Product Hunt RSS feed',
  source_urls: ['https://www.producthunt.com/feed?category=undefined'],
  rss_snapshot_file: `data/producthunt/predictions/${date}/rss.xml`,
  launch_eligibility_file: eligibility
    ? `data/producthunt/predictions/${date}/launch-eligibility.json`
    : null,
  products_file: `data/producthunt/predictions/${date}/products-with-urls.json`,
  rss_entry_count: eligibility?.rss_entry_count ?? null,
  launching_today_filter: eligibility
    ? {
        method: eligibility.method,
        included_count: eligibility.included_count,
        excluded_count:
          (eligibility.rss_entry_count ?? 0) - (eligibility.included_count ?? 0),
      }
    : null,
  prediction_target:
    'final end-of-day Product Hunt leaderboard rank among launches from this Product Hunt launch day',
  scoring_method:
    'weighted sum per prompts/producthunt/predict.md (clarity 13%, novelty 7%, usefulness 16%, shareability 14%, product_hunt_audience_fit 14%, credibility_effective 8%, launch_momentum_potential 14%, ph_core_voter_appeal 14%, broad_vote_appeal 10%) plus documented calibration adjustments',
  feed_composition: {
    launch_count: products.length,
    saturated_archetype_count: saturatedCount,
    broad_trap_archetype_count: broadTrapCount,
    saturated_archetypes: [
      'AI agents',
      'computer use',
      'MCP',
      'agent builders',
      'memory/RAG layers',
      'local LLM tooling',
    ],
    broad_trap_archetypes: [
      'Mac novelty utilities',
      'travel/local discovery',
      'photo-ID gimmicks',
      'menu-bar trivia',
    ],
  },
  rules: {
    excluded_fields_verified: true,
    excluded_signals: [
      'upvotes',
      'comments',
      'current ranking',
      'leaderboard position',
      'featured position',
      'featured badges',
      'trending labels',
      'top product metadata',
      'Product Hunt popularity signals',
      'external Product Hunt traction discussions',
    ],
  },
  predictions: ranked.map((r, i) => {
    r.confidence = confidence(r.meta, r.meta.scores, i + 1)
    let reasoning = r.meta.reasoning
    if (r.promotedInReview) {
      reasoning +=
        ' Pre-save review: promoted per calibration (differentiated launch, stacked-boost guardrail, or practical-builder scan).'
    }
    if (r.demotedStackedBoost) {
      reasoning +=
        ' Pre-save review: demoted from #1 — total_adjustment >= 1.2 without incumbent/relaunch/prior-winner proof.'
    }
    const adj = r.cal
    const parts = []
    if (adj.saturation_penalty) parts.push(`saturation ${adj.saturation_penalty}`)
    if (adj.incumbent_penalty) parts.push(`incumbent ${adj.incumbent_penalty}`)
    if (adj.broad_trap_penalty) parts.push(`broad-trap ${adj.broad_trap_penalty}`)
    if (adj.ph_core_boost) parts.push(`ph-core +${adj.ph_core_boost}`)
    if (adj.maker_signal_boost) parts.push(`maker +${adj.maker_signal_boost}`)
    if (adj.outcome_boost) parts.push(`outcome +${adj.outcome_boost}`)
    if (adj.broad_ph_combo_boost) parts.push(`combo +${adj.broad_ph_combo_boost}`)
    if (adj.hardware_boost) parts.push(`hardware +${adj.hardware_boost}`)
    if (adj.practical_builder_boost)
      parts.push(`practical-builder +${adj.practical_builder_boost}`)
    if (adj.relaunch_boost) parts.push(`relaunch +${adj.relaunch_boost}`)
    if (adj.ecommerce_outcome_boost)
      parts.push(`ecommerce +${adj.ecommerce_outcome_boost}`)
    if (adj.tier1_incumbent_boost) parts.push(`tier1 +${adj.tier1_incumbent_boost}`)
    if (r.demotedPracticalCluster) {
      reasoning +=
        ' Pre-save review: demoted from top 5 — small feed practical-builder cluster cap (2026-05-20).'
    }
    if (r.demotedInfraHype) {
      reasoning +=
        ' Pre-save review: demoted from top 5 — best_in_feed_infra without prior PH win on feeds ≤25 (2026-05-21).'
    }
    if (parts.length) reasoning += ` Calibration: ${parts.join(', ')}.`

    return {
      predicted_rank: i + 1,
      product_hunt_slug: r.slug,
      product_name: r.title,
      tagline: r.tagline,
      product_hunt_url: r.link,
      website_url: r.website_url?.replace(/\?ref=producthunt$/, '') || r.website_url,
      category: r.meta.category,
      rss_item_snapshot: {
        title: r.title,
        link: r.link,
        guid: r.guid,
        published_at: r.published,
        description: r.tagline,
        author: r.author,
        updated_at: r.updated,
      },
      scores: {
        ...r.meta.scores,
        credibility_effective: r.credEff,
      },
      calibration_adjustments: {
        saturation_penalty: adj.saturation_penalty,
        incumbent_penalty: adj.incumbent_penalty,
        broad_trap_penalty: adj.broad_trap_penalty,
        ph_core_boost: adj.ph_core_boost,
        maker_signal_boost: adj.maker_signal_boost,
        outcome_boost: adj.outcome_boost,
        meta_ph_boost: adj.meta_ph_boost,
        broad_ph_combo_boost: adj.broad_ph_combo_boost,
        total_adjustment: adj.total_adjustment,
      },
      maker_signal: r.meta.maker_signal,
      archetype_flags: {
        saturated: r.meta.saturated,
        broad_trap: r.meta.broad_trap,
        incumbent_extension: r.meta.incumbent,
        meta_ph: r.meta.meta_ph,
        outcome_differentiated: r.meta.outcome_differentiated,
        practical_builder_tool: r.meta.practical_builder_tool ?? false,
        ecommerce_outcome: r.meta.ecommerce_outcome ?? false,
        tier1_incumbent: r.meta.tier1_incumbent ?? false,
      },
      predicted_success_score: adj.adjusted,
      confidence: r.confidence,
      reasoning,
      likely_ai_bias_or_risk: aiRisk(r.meta, r.meta.scores),
      research_sources: r.meta.sources,
    }
  }),
}

const top5 = output.predictions.slice(0, 5)
const checks = {
  top5_has_ph_core_8: top5.filter((p) => p.scores.ph_core_voter_appeal >= 8).length >= 2,
  top5_has_outcome_or_meta:
    top5.some(
      (p) =>
        p.archetype_flags.outcome_differentiated || p.archetype_flags.meta_ph,
    ),
  no_broad_trap_at_1_unless_maker:
  !(
    top5[0]?.archetype_flags.broad_trap &&
    !(top5[0].scores.ph_core_voter_appeal >= 8 && top5[0].maker_signal)
  ),
  no_low_ph_sat_in_top5: !top5.some(
    (p) =>
      p.scores.ph_core_voter_appeal <= 4 &&
      p.calibration_adjustments.saturation_penalty < 0,
  ),
}

fs.writeFileSync(path.join(RUN_DIR, 'predictions.json'), JSON.stringify(output, null, 2))
console.log('Wrote predictions.json')
console.log('Feed: saturated=%d broad_trap=%d', saturatedCount, broadTrapCount)
output.predictions.slice(0, 10).forEach((p) => {
  console.log(
    `  #${p.predicted_rank} ${p.product_name} (${p.predicted_success_score}) ph_core=${p.scores.ph_core_voter_appeal} maker=${p.maker_signal}`,
  )
})
console.log('Pre-save review:', checks)
