# AI Skill Recommendations for YouTube-Led Marketing

Original source reviewed: `data/marketing_skill/YouTube Marketing Strategy (2026-04-23).md`

## What the strategy requires

The strategy emphasizes:
- filtering signal from hype in YouTube content
- extracting repeatable tactics into a playbook
- executing one acquisition channel at a time
- running parent-focused distribution for a kids math game
- shipping daily content and comments with high consistency

So the highest-value skills are execution skills that compress research -> decisions -> daily actions.

## Recommended AI skills to build

### 1) `youtube-signal-graph-builder` (Priority: P0)
- **Purpose:** Build a trusted channel/expert graph from seed videos.
- **Input:** 10-20 YouTube URLs + product context.
- **Output:** ranked signal nodes, repeated experts, repeated tools, repeated case studies, and a watch shortlist.
- **Why:** Removes hype quickly and improves source quality for all downstream work.

### 2) `operator-filter-scorer` (Priority: P0)
- **Purpose:** Score videos/transcripts by operator quality.
- **Scoring dimensions:** numbers shown, timeline clarity, specific actions, replicability, evidence density.
- **Output:** keep/discard verdict + confidence + short rationale.
- **Why:** Enforces the “can I replicate this tomorrow?” rule.

### 3) `tactic-compression-playbook` (Priority: P0)
- **Purpose:** Convert summaries into structured tactics.
- **Schema:** channel, tactic, input->output, effort, time-to-signal, risk, prerequisites.
- **Output:** acquisition/conversion/retention playbook with de-duplicated patterns.
- **Why:** Turns passive consumption into a decision engine.

### 4) `one-channel-sprint-planner` (Priority: P1)
- **Purpose:** Generate 3-7 day execution plans for a single channel.
- **Input:** chosen channel (e.g. Reddit, YouTube Shorts), time budget, product angle.
- **Output:** daily actions, volume targets, stop/continue criteria, expected signals.
- **Why:** Prevents breadth drift and enforces depth.

### 5) `parent-pain-miner` (Priority: P1)
- **Purpose:** Mine recurring parent pain points from Reddit/FB/YouTube comments.
- **Output:** clustered pain themes, language snippets, objections, intent level.
- **Why:** Improves message-market fit for a kids math product.

### 6) `empathetic-comment-reply-writer` (Priority: P1)
- **Purpose:** Generate non-spammy, empathetic parent replies with soft CTA variants.
- **Output:** 5-10 safe reply options per pain cluster, with tone controls.
- **Guardrails:** no hard sell, no fake claims, no manipulative urgency.
- **Why:** Supports daily high-volume outreach while maintaining quality.

### 7) `proof-video-script-batcher` (Priority: P1)
- **Purpose:** Batch short-form scripts around transformation proof (before -> after).
- **Output:** 20 scripts with hook, story beat, proof moment, CTA.
- **Why:** Feeds a consistent “Proof Engine” content pipeline.

### 8) `micro-creator-outreach-copilot` (Priority: P2)
- **Purpose:** Find and prioritize small creators (1k-20k) for affiliate-style distribution.
- **Output:** target list, personalization lines, outreach scripts, follow-up cadence.
- **Why:** “Borrow audience” channel with low upfront cost.

### 9) `channel-experiment-analyst` (Priority: P2)
- **Purpose:** Analyze experiment logs and recommend next actions.
- **Input:** comments posted, views, watch time, CTR, trial starts, conversions.
- **Output:** double-down / modify / stop decisions by channel + tactic.
- **Why:** Closes the loop from execution to optimization.

## Suggested build order (fastest ROI)

Week 1:
1. `youtube-signal-graph-builder`
2. `operator-filter-scorer`
3. `tactic-compression-playbook`

Week 2:
4. `one-channel-sprint-planner`
5. `parent-pain-miner`
6. `empathetic-comment-reply-writer`

Week 3:
7. `proof-video-script-batcher`
8. `channel-experiment-analyst`
9. `micro-creator-outreach-copilot`

## Minimal common data contract (shared across skills)

Use one small JSON schema across all skills:
- `audience`: parents of kids with math anxiety / homework resistance
- `channel`: reddit | youtube_shorts | tiktok | facebook_groups | creators
- `tactic_name`
- `input`
- `expected_output`
- `effort_level` (low/medium/high)
- `time_to_signal_days`
- `evidence_quality` (0-5)
- `decision` (test/scale/drop)

This keeps outputs composable so one skill can feed another.

