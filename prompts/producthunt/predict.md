Get today's Product Hunt launches from the RSS feed, research each product without using traction signals, predict the final end-of-day Product Hunt leaderboard rank for every launch, and save an auditable prediction file.

Primary prediction target:
- final end-of-day Product Hunt leaderboard rank among launches from that same Product Hunt launch day

Later evaluation targets:
- final leaderboard rank
- final upvotes
- final comments

Use Product Hunt's own launch-day boundary consistently for prediction and evaluation runs.

Source of truth for launch discovery:
- RSS feed: https://www.producthunt.com/feed?category=undefined — **discovery only** (includes products not launching today).
- **Eligibility filter:** each RSS `product_hunt_url` must show **Launching Today** on the product page (sidebar label, e.g. `Launching Today` under Day Rank). Use `scripts/product-hunt/scrape-product.js`; only include entries where `launchingToday` is `true`.
- Predict and rank **only** launches that pass this filter for the target Product Hunt launch day.
- Do not filter to featured launches only.
- Treat RSS item order as a neutral chronological discovery feed, not as a popularity signal.
- First save the raw RSS response to the run folder. Filter eligibility once, then perform all research, scoring, and later evaluation against the frozen RSS snapshot plus the saved eligibility audit. Do not keep re-fetching the live RSS feed during the same prediction run.

Prediction run folder:

`data/producthunt/predictions/YYYY-MM-DD/`

Prediction run files:
- raw RSS snapshot: `data/producthunt/predictions/YYYY-MM-DD/rss.xml`
- launch eligibility audit: `data/producthunt/predictions/YYYY-MM-DD/launch-eligibility.json`
- parsed launches (launching today only): `data/producthunt/predictions/YYYY-MM-DD/products-with-urls.json`
- prediction output: `data/producthunt/predictions/YYYY-MM-DD/predictions.json`

Important constraint:
The prediction system must behave as if each launch has zero visible traction. Do NOT use current upvotes, current comments, current ranking, featured position, badges, leaderboard placement, trending labels, "top product" metadata, or any Product Hunt popularity signal that would leak the answer.

Allowed Product Hunt/RSS data:
- product name
- tagline
- description
- launch URL
- website URL
- maker/founder names if available in the RSS item
- topics/categories if available in the RSS item
- media/assets if useful
- RSS publication timestamp for inclusion/audit purposes
- **`launchingToday` / Launching Today label only** — used solely to decide whether an RSS entry belongs in today's launch set (not for scoring or ranking)

Disallowed Product Hunt data at prediction time:
- current upvote count
- current comment count
- current rank
- current leaderboard position
- featured position
- featured badges
- badges such as #1, #2, etc.
- trending labels
- "top product" metadata
- any sorting, filtering, or metadata derived from Product Hunt popularity

External research leakage rules:
Do not use outside sources that discuss the current launch's Product Hunt traction or campaign performance.

Exclude sources or snippets containing:
- "#1 on Product Hunt"
- "upvote us"
- launch campaign posts
- Product Hunt traction discussions
- ranking screenshots
- social posts discussing launch performance
- requests for Product Hunt votes/comments

External research should focus only on:
- the product
- positioning
- target customer
- founder/company signals
- usefulness
- novelty
- emotional/shareability potential
- non-Product-Hunt credibility signals that do not discuss launch traction

For each prediction run:
1. Determine the target Product Hunt launch date using Product Hunt's launch-day boundary.
2. Create the run folder:

`data/producthunt/predictions/YYYY-MM-DD/`

3. Fetch the Product Hunt RSS feed and save the exact raw response to:

`data/producthunt/predictions/YYYY-MM-DD/rss.xml`

4. Parse the frozen `rss.xml` and **filter to launches that are Launching Today** on their Product Hunt product page:

```sh
node scripts/product-hunt/parse-rss.js data/producthunt/predictions/YYYY-MM-DD
```

This writes `launch-eligibility.json` (every RSS entry with `launching_today` and `included_in_run`) and `products-with-urls.json` (included entries only, with resolved website URLs). To spot-check one product:

```sh
npm run product-hunt:scrape -- --launch-status "https://www.producthunt.com/products/<slug>"
```

Use `--include-all-feed` on `parse-rss.js` only for debugging; do not use it for production prediction runs.

5. Keep an `rss_item_snapshot` for each **included** launch.
6. Verify that no Product Hunt popularity fields (rank, upvotes, etc.) were fetched or used for scoring — eligibility checks may read the product page HTML but must ignore traction fields.
7. Visit each included product website.
8. Perform non-leaky public web research.
9. Extract useful public signals:
   - clarity of positioning
   - target customer
   - product category
   - novelty
   - emotional/shareability factor
   - landing page quality
   - strength of use case
   - obviousness of value proposition
   - broad vote appeal (instant “aha” for non-developers)
   - **PH core voter appeal** (makers/founders/indie hackers — the real electorate)
   - **maker signal**: known PH hunter, repeat launcher, YC/partner credibility, major OSS repo (stars/contributors only — not PH votes)
   - **archetype flags**: saturated, broad-trap, **`mac_demo_utility`** (Mac/menu-bar with broad + shareability ≥ 8), **`oss_stars_only_maker`** (repo stars without famous hunter), **`founder_operator_outcome`** (AI PM / team ops for founders), **`novelty_shareability_trap`** (game/hackathon hype, ph-core ≤ 6), incumbent extension, **tier1_incumbent** (Google/Apple/Meta/OpenAI), meta-PH, outcome-differentiated, **ecommerce_outcome** (seller/store GTM), practical-builder-tool (ship-today utility for makers)
   - founder/company signals from public web research
   - social proof outside Product Hunt only, if it does not mention Product Hunt traction
10. Score each product from 1 to 10 on:
   - clarity
   - novelty
   - usefulness
   - shareability
   - audience fit for Product Hunt
   - credibility
   - launch momentum potential
   - **ph_core_voter_appeal** — will makers, founders, and indie hackers on Product Hunt upvote this? (dev tools, launch meta, open-source with traction, fundraising/sales workflows, infra they will use today)
   - **broad_vote_appeal** — can a *non-builder* grasp the value in ~10 seconds? (travel, pet Mac utilities, rock ID, etc.). **Do not treat this as the main ranking driver** — see calibration notes
11. Compute `predicted_success_score` with the **weighted formula** in [Scoring and ranking](#scoring-and-ranking) (not an unweighted average).
12. Classify **archetype flags** and **maker_signal** for each launch; apply **calibration adjustments** and **stacked-boost guardrails** from feed composition (same section).
13. Rank all launches by adjusted `predicted_success_score`.
14. Run the **pre-save ranking review** checklist (same section), including the **practical builder tool** scan (rank 18+).
15. Add a short explanation for each ranking, including calibration effects when non-zero.
16. Save the prediction output to:

`data/producthunt/predictions/YYYY-MM-DD/predictions.json`

### Build script

After research, encode scores in `scripts/product-hunt/scores-YYYY-MM-DD.js` (or import in `build-predictions.js`) keyed by `product_hunt_slug` for **included** launches only. Ensure `products-with-urls.json` exists from step 4. Then:

```sh
node scripts/product-hunt/build-predictions.js data/producthunt/predictions/YYYY-MM-DD
```

The script applies the weighted formula, calibration adjustments, pre-save ranking review, and writes `predictions.json`. Do not keep alternate builder scripts.

## Scoring and ranking

### Weighted `predicted_success_score`

Do **not** use an unweighted average of the score dimensions. Use:

```
predicted_success_score =
  0.13 * clarity +
  0.07 * novelty +
  0.16 * usefulness +
  0.14 * shareability +
  0.14 * product_hunt_audience_fit +
  0.08 * credibility_effective +
  0.14 * launch_momentum_potential +
  0.14 * ph_core_voter_appeal +
  0.10 * broad_vote_appeal
```

Round `predicted_success_score` to two decimal places.

**`credibility_effective`** (still store raw `credibility` in JSON):
- Start from the 1–10 `credibility` score.
- If the launch is a **major-brand platform/API extension** (e.g. Notion, Instagram, Resend-scale incumbents shipping an incremental surface), cap `credibility_effective` at **8**. Incumbent credibility does not reliably translate to #1 on launch day.
- If the product could not be verified beyond RSS/landing page, cap `credibility_effective` at **6**.

**`ph_core_voter_appeal`** (required — primary audience signal):
- Score how likely **Product Hunt’s core electorate** (makers, founders, indie hackers, dev-tool buyers) is to upvote.
- High (8–10): dev tools they’ll try today, open-source with visible momentum, meta-PH / launch tooling, startup outcomes (fundraising, meetings, email, sales), differentiated agent infra, known-maker launches.
- Mid (5–7): vertical B2B with clear ROI, creative prosumer tools, credible incumbents shipping useful surfaces.
- Low (1–4): generic “another agent/MCP/memory layer” with no hook, consumer-only apps with no maker angle, thin clones.

**`broad_vote_appeal`** (required — secondary):
- Score instant grasp for **non-builders**. Useful for tie-breaks and outcome categories, **not** for ranking Mac novelty / travel / ID apps to #1.
- High (8–10): obvious before/after, strong demo, hardware with story, fundraising/sleep/meeting outcomes **when** positioning is verified.
- Low (1–4): infra opaque to everyone; also note **“broad-trap”** categories below — these often score high on paper but rarely win PH.

### Category saturation and feed composition

Before final ranking, classify the frozen RSS set:
- Count launches in **saturated archetypes** among **included** launches only (post–Launching Today filter), not raw RSS size.
- Count launches in **broad-trap archetypes**: Mac pet/novelty utilities, travel/local discovery, photo-ID/gimmick apps, menu-bar trivia — high `broad_vote_appeal` but historically weak PH day ranks. **Exception:** Mac/menu-bar utilities with `broad_vote_appeal` ≥ 8 **and** `shareability` ≥ 8 (strong demo GIF/notch story) are **`mac_demo_utility`** — do not treat like travel/rock-ID traps (2026-05-22: iPromise #22 pred → **#5** actual).
- Also flag **ecommerce_outcome**: seller/store revenue, Shopify/Amazon GTM, agent-for-commerce — often wins with moderate `ph_core_voter_appeal` when demo is visceral (2026-05-20: StoreClaw #1).
- Flag **novelty_shareability_trap**: game/novelty launches with high shareability (hackathon placement, trailer) but `ph_core_voter_appeal` ≤ 6 — cap expected rank **≥15** (2026-05-22: Training Data microgames #11 → #28).
- Record counts in `feed_composition` on the prediction file (see JSON shape).

**Saturation penalty** (subtract after weighted sum; record in `calibration_adjustments`):

| Condition | Adjustment |
|-----------|------------|
| Generic saturated archetype (no differentiation — see exceptions) and feed has **≥8** such launches | **−0.5** |
| Generic saturated archetype and feed has **5–7** | **−0.3** |
| Generic saturated archetype and feed has **3–4** | **−0.2** |
| Major-brand platform/API extension (credibility raw ≥9), **non–tier-1** | **−0.4** |
| **Tier-1 incumbent** (Google, Apple, Meta, Microsoft, OpenAI shipping a named model/surface) | **−0.2** only |
| **Broad-trap** archetype (Mac novelty, travel/discovery, rock/gem ID, etc.) with `ph_core_voter_appeal` ≤ 6 | **−0.4** |
| **`mac_demo_utility`** (not broad-trap): Mac/menu-bar with `broad_vote_appeal` ≥ 8 and `shareability` ≥ 8 | **−0.1** only (not −0.4) |
| **`novelty_shareability_trap`** (game/hackathon hype, `ph_core_voter_appeal` ≤ 6) | **−0.3** |

**Do not apply saturation penalty** when any of:
- **Maker signal**: launch by widely known PH hunter, YC partner, or repeat successful launcher. **OSS GitHub stars alone are not full maker signal** — use **`oss_stars_only_maker`** (boost capped at **+0.2**, expected rank cap **top 12**; 2026-05-22: whosthere 2.2k★ #4 pred → #21).
- **Meta-PH**: product about launches, fundraising prediction, hunter tooling, or PH ecosystem.
- **Outcome differentiation**: meetings → actions, sleep hardware, fundraising workflow, email for startups — even if AI-shaped.
- **Ecommerce / seller outcome**: store profit, DTC, marketplace GTM, agent-for-commerce with verified before/after (2026-05-20: StoreClaw).
- **Best-in-feed infra**: scraping/agent-debug/MCP that is clearly the most differentiated of its cluster (e.g. wins on usefulness + `ph_core_voter_appeal` ≥ 8).
- **Vertical agent utility with clear JTBD** (e.g. permission-aware recordings, agent activity VCS) when usefulness ≥ 8 and not generic “memory/MCP layer” positioning.

**Relative boost** (add to score; stack with penalties):

| Condition | Adjustment |
|-----------|------------|
| `ph_core_voter_appeal` ≥ 8 and usefulness ≥ 8 | **+0.5** |
| Verified **outcome** launch (meetings, sleep, fundraising, sales meetings) with clarity ≥ 8 | **+0.4** |
| **Maker signal** (known hunter, repeat PH winner team) | **+0.5** |
| **`oss_stars_only_maker`** (repo momentum only — no famous hunter) | **+0.2** |
| **Founder-operator outcome** (AI PM / “runs your team”, founder ops, Telegram bot with clear before/after) with `broad_vote_appeal` ≥ 7 | **+0.3** |
| **Ben Lang / Garry Tan inference API** with published benchmarks + ship-today API (not generic dataset feed) | **+0.3** |
| Meta-PH or launch-ecosystem tool | **+0.4** |
| Hardware or visceral physical product story (non-trap) | **+0.3** |
| `broad_vote_appeal` ≥ 8 **and** `ph_core_voter_appeal` ≥ 7 (both — not broad alone) | **+0.3** |
| **Practical builder tool**: ship-today utility for makers (OSS agent hub, outbound/lead gen, QA/test automation, multi-model dev workspace) with usefulness ≥ 8 and clarity ≥ 8 | **+0.3** |
| **Ecommerce / seller outcome** with clarity ≥ 8 and shareability ≥ 8 | **+0.4** |
| **Relaunch / major version** in name or tagline (`3.0`, `2.0`, `v4`, “by {known brand}”) with verified product | **+0.2** |
| **Tier-1 incumbent** with `broad_vote_appeal` ≥ 7 and shareability ≥ 8 | **+0.3** (stacks with **−0.2** incumbent penalty, not −0.4) |

**Stacked-boost guardrails** (apply when summing boosts; record caps in reasoning):
- If **maker + outcome + ph-core** boosts would sum to **>1.0** before other boosts, cap **maker_signal_boost** at **+0.2** unless the launch is an **incumbent** with `product_hunt_audience_fit` ≥ 9 **or** a verified **repeat PH winner / relaunch** (e.g. `SocLeads 3.0`, `imgproxy v4`) — hunter fame alone is not enough (2026-05-19: Chert #1 pred → #7 with +1.4 stacked).
- **Exception — meta-PH narrative:** do **not** cap or demote #1 for stacked boosts when **`meta_ph`** is true **and** `product_hunt_audience_fit` ≥ **10** (e.g. PH CEO launch, launch-ecosystem story). Hunter + outcome stacks are insufficient for generic agents, but **meta-PH + max audience fit** can win #1 (2026-05-21: Tycoon demoted #1→#2 pred, actual **#1**).
- Do **not** place **agent-commerce / shopping-MCP / exotic data-feed infra** (e.g. CLI Market–style) in the **top 10** on `best_in_feed_infra` alone — cap expected rank ~15 unless maker signal **and** prior PH win evidence (2026-05-19: CLI Market #7 → #29).
- On feeds **≤25**, cap **`best_in_feed_infra`** launches (HN hype, agent VM/sandbox APIs) at **top 12** unless **prior PH winner** on the same product line (2026-05-21: InstaVM #5 pred → #17 actual).
- When **included launch_count ≤ 25** (typical after Launching Today filter), allow **at most two** `practical_builder_tool` launches in predicted **top 5** — extra builder slots over-concentrate and collapsed on 2026-05-20 (Tophat #4→#17, Skilled #9→#22) and 2026-05-21 (Basedash #3→#18, InstaVM #5→#17, CatchAll #4→#12).
- **Garry Tan / Ben Lang hunter split (feeds ≤25):** promote **workflow/docs/outcome** hunts (Mintlify-style, `outcome_differentiated` or clear docs JTBD) to **top 5**; promote **benchmarked inference API** hunts (General Compute–style: OpenAI-compatible, published tok/s, $ credit on signup) to **top 5** — do not lump with dataset-only feeds (2026-05-22: General Compute #6 pred → **#3** actual). Cap **dataset/API infra** hunts (CatchAll-style, `best_in_feed_infra` without prior PH win or benchmarks) at **top 10** (2026-05-21: Mintlify #6→#2, CatchAll #4→#12).
- **OSS stars-only** launches: never in predicted **top 5** on feeds ≤25 regardless of star count (2026-05-22: whosthere #4→#21).
- **Rohan Chaubey / Shopify OSS** mobile-dev utilities: practical-builder boost OK for top **12**, not top **5**, unless prior PH win on same product line — **sales/fundraising outcome** hunts (WarmIntro-style) may reach **top 5** (2026-05-21: WarmIntro #9→#5).

Final sort key: adjusted `predicted_success_score` descending.

**Tie-breakers** (in order): `ph_core_voter_appeal`, `product_hunt_audience_fit`, `usefulness`, `shareability`, then lower total penalty magnitude.

### Pre-save ranking review

Before writing `predictions.json`, verify:
1. **Top 5 is mixed**, not a monoculture: include at least **two** launches with `ph_core_voter_appeal` ≥ 8 **and** at least **one** outcome-differentiated launch (meetings, sleep, fundraising, sales, hardware) **or** meta-PH tool — do not fill top 5 with only generic agents or only Mac/travel gimmicks.
2. **No broad-trap #1**: do not rank a broad-trap archetype at **#1** unless `ph_core_voter_appeal` ≥ 8 and maker signal is verified (famous hunter or prior PH win — not OSS stars alone). **`mac_demo_utility`** may reach **top 5** when `broad_vote_appeal` ≥ 8 and `shareability` ≥ 8 — do not bury below rank 15 (2026-05-22: iPromise #22→#5).
3. No product with `ph_core_voter_appeal` ≤ 4 **and** a saturation penalty is in the **top 5**.
4. If the weighted top 3 are **all** undifferentiated saturated agents (no maker signal, no outcome hook), **demote** the lowest-`ph_core_voter_appeal` one and promote the best differentiated agent/infra or outcome launch in the feed (document in reasoning). **Do not** auto-promote Mac/travel/ID utilities into top 3 — that over-corrected on 2026-05-15.
5. Check for **under-ranked maker-signal** launches: any launch with **famous-hunter** maker signal + `ph_core_voter_appeal` ≥ 8 below rank 15 should be reviewed and likely moved up. **Do not** promote **`oss_stars_only_maker`** into top 5.
5b. **Promote founder-operator outcomes**: AI PM / team-ops / “runs your company” launches with `outcome_differentiated`, `broad_vote_appeal` ≥ 7, clarity ≥ 8, ranked **below 8** → review for **top 5** (2026-05-22: Cleo #10→**#2**).
5c. **Promote Ben Lang / Garry Tan benchmarked inference API** ranked **below 6** → review for **top 5** when benchmarks and ship-today signup are verified (2026-05-22: General Compute #6→**#3**).
6. **No boost-stacked #1**: do not rank #1 when `total_adjustment` ≥ **1.2** unless `product_hunt_audience_fit` ≥ 9 **and** (**incumbent**, verified **relaunch/major-version**, **`meta_ph` with audience fit ≥ 10**, or **prior PH winner**). Hunter + outcome stacks alone are not sufficient. **Do not** swap a **meta-PH** launch out of #1 for a **tier-1 incumbent** on feeds ≤25 when both are present (2026-05-21: Tycoon actual #1, Google Antigravity #1 pred → #4).
7. **Promote practical builder tools**: any launch with usefulness ≥ 8, clarity ≥ 8, `ph_core_voter_appeal` ≥ 7, and a ship-today JTBD ranked **below 18** should be reviewed for **top 12** — but respect the **≤2 in top 5** cap when launch_count ≤ 25 (2026-05-19: PollyReach #29→#1 on a 50-launch feed; 2026-05-20: Tophat/Skilled over-promoted in top 10; 2026-05-21: three builder slots in pred top 5 all missed).
8. **Promote ecommerce + hunter outcomes**: any launch with **ecommerce_outcome**, shareability ≥ 8, and (maker signal or Chris Messina–tier hunter) ranked **below 8** should be reviewed for **top 5** (2026-05-20: StoreClaw #6 pred → #1 actual).
9. **Promote tier-1 incumbents**: Google/Apple/Meta/OpenAI model or API surfaces with `broad_vote_appeal` ≥ 7 ranked **below 8** should be reviewed for **top 6** — on feeds ≤25, slot **#3–#5**, not #1, when a **meta-PH** or **PH CEO** launch is in the feed (2026-05-20: Gemini Omni #10→#4; 2026-05-21: Google Antigravity #1→#4).
10. **Scan vertical agent utilities**: permission-aware media/recording or agent-activity VCS with usefulness ≥ 8 ranked **below 15** → review for **top 10** (2026-05-20: Supercut #19→#7, Re_gent #16→#6).
11. **Promote prior-PH-winner relaunches**: `prior_ph_winner` + **relaunch** (`3.0`, `2.0`, `vN` in name/tagline) ranked **below 10** → review for **top 5** (2026-05-21: WeWeb 3.0 #13→#3).
12. **Promote Garry Tan workflow/docs hunts**: maker signal + **`outcome_differentiated`** (docs, fundraising, sales paths) ranked **below 6** → review for **top 5**; do **not** apply the same promotion to **dataset/API infra** hunts without prior PH win (2026-05-21: Mintlify #6→#2).
13. `confidence: high` only per [Confidence calibration](#confidence-calibration) — never for broad-trap-only launches, unverified pages, predicted ranks 1–3 based only on hunter + calibration boosts, or **`best_in_feed_infra` without prior PH win** (2026-05-21: InstaVM/CatchAll **high** missed by 8–12 ranks).
14. **Demote OSS-stars-only from top 5**: any launch in predicted top 5 whose only maker proof is GitHub stars → move to **rank 8+** (2026-05-22: whosthere).
15. **Demote novelty_shareability_trap from top 12**: game/hackathon launches with `ph_core_voter_appeal` ≤ 6 in top 12 → **rank 15+** (2026-05-22: Training Data #11→#28).
16. **Demote B2B infra without hunter from top 5**: established B2B SaaS extensions (notifications, auth, Databricks connectors) without famous hunter ranked in top 5 → **rank 8+** (2026-05-22: SuprSend #3→#10).
17. **Scan under-ranked growth/consumer sleepers**: social autopilot, creator book tools, or consumer social with clarity ≥ 7 ranked **below 15** → review for **top 10** (2026-05-22: Auto Posts #20→#6, Prosed #19→#8, moop #24→#7).

### Confidence calibration

| Level | Use when |
|-------|----------|
| **high** | Verified positioning **and** (`ph_core_voter_appeal` ≥ 8 with **famous-hunter** maker signal or differentiated infra **or** outcome category with clarity ≥ 8). Never for broad-trap-only launches, **`oss_stars_only_maker`**, or outcome-PM without hunter (2026-05-22: Nugget). **Never** for predicted ranks **1–3** when rank is driven mainly by stacked maker+outcome boosts (use **medium**). **Never** for **`best_in_feed_infra`** or Garry Tan **dataset/API infra** in predicted top 5 without **prior PH win** on the product line. |
| **medium** | Default for AI-heavy feeds, saturated archetypes without maker signal, incumbents, crowded categories, **all predicted top-3**, and **meta-PH** launches even when likely #1 |
| **low** | Unverified product, thin research, conflicting signals, or broad-trap with `ph_core_voter_appeal` ≤ 6 |

Do not assign **high** confidence from high `broad_vote_appeal` alone. On 2026-05-15, **high** confidence averaged ~22 ranks off. On 2026-05-19, **high** at predicted #1 (Chert) missed by 6 ranks. On 2026-05-21, **high** on InstaVM, CatchAll, Mintlify, WarmIntro averaged **~7 ranks off** in top 10. On 2026-05-22, **high** on Nugget AI (pred #5 → actual #9) — use **medium** for outcome-PM tools without famous hunter even when `ph_core_voter_appeal` ≥ 8.

### Calibration from evaluation runs

Use these empirical results when scoring and ranking. Product Hunt’s electorate is **maker-heavy**; “general public” appeal alone is insufficient.

#### 2026-05-14 (`prediction_results.json`, 50 launches)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **18.7** |
| Top-3 / top-5 precision | **0% / 20%** (1 hit) |
| Mean upvote-rank error | **11.2** |

**Actual top 5 (day rank):** Spellar 3.0 (#1), Naptick AI (#2), Tendem (#3), Causo (#5), Raindrop Workshop (#6).

**Failure modes:**
- **Over-ranked**: undifferentiated dev platforms and MCP/computer-use stacks (Notion #1 → actual #7; Open Computer Use #2 → #18); high raw credibility on incumbents.
- **Under-ranked**: outcome launches with moderate scores (Spellar #40 → #1; Naptick #29 → #2; Causo #22 → #5).
- **Lesson**: Rank **outcome differentiation** (meetings, sleep, fundraising) and **usefulness** above novelty and raw incumbent credibility. Tendem (#5 pred → #3 actual) was the best top-5 call — differentiated agent *with* a clear hook.

#### 2026-05-15 (`prediction_results.json`, 50 launches; post–broad-appeal calibration)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **22.7** (worse) |
| Top-3 / top-5 precision | **0% / 0%** |
| Predicted top-5 avg `broad_vote_appeal` | **8.8** |
| Actual top-5 avg `broad_vote_appeal` | **4.8** |

**Actual top 5 (upvotes / day rank):** OpenHuman (#1), HasData (#2), PHBench (#3), Lensmor (#4), Agentic Website Builder (#5).

**Failure modes (over-correction):**
- **Over-ranked**: broad-trap and high-`broad_vote_appeal` prosumer picks (Cats Lock #1 → #18; Crystal #3 → #74; Lychee #14 → #82).
- **Under-ranked**: agent/infra with **maker signal** or meta-PH (OpenHuman #47 → #1; HasData #46 → #2; PHBench #17 → #3).
- **Lesson**: Do **not** blanket-penalize agents/MCP in AI-heavy feeds — PH voters often *are* builders. Penalize only **generic** saturated launches. Boost **maker signal**, meta-PH, and differentiated infra instead of Mac/travel/novelty utilities.

#### 2026-05-19 (`prediction_results.json`, 50 launches; post–maker-stack calibration)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **15.64** (best so far) |
| Top-3 / top-5 precision | **33% / 60%** (1 / 3 hits) |
| Mean signed rank error | **−12.88** (systematic **under-ranking** of winners) |
| Mean upvote-rank error | **14.08** |
| Predicted top-10 avg `ph_core_voter_appeal` | **8.6** |
| Actual top-10 avg `ph_core_voter_appeal` | **7.4** |

**Actual top 5 (day rank / upvotes):** PollyReach (#1, 509↑), Vivago Video Agent (#1, 499↑), LobeHub (#1, 482↑), SocLeads 3.0 (#2, 467↑), Drizz (#2, 396↑). **Note:** multiple products share the same scraped day rank; use upvote rank as a secondary check when ties appear.

**Hits:** Composer 2.5 (#3 pred → #3), Shadow (#2 → #4), CtrlOps (#4 → #5).

**Failure modes (over-ranked):**
- **Boost-stacked hunter launches**: Chert (#1 → #7) and Insights by Omnia (#5 → #10) — Garry Tan / Ben Lang + maker + outcome + ph-core boosts over-credited hunter fame for #1–5.
- **Exotic infra**: CLI Market (#7 → #29) — `best_in_feed_infra` did not translate; agent-commerce APIs are not PH top-10 material without proven launch precedent.
- **Research-lab novelty in top 10**: Starchild-1, Trainer, pixserp landed ~#14–20 actual despite top-10 predictions.

**Failure modes (under-ranked):**
- **Practical builder tools** with moderate scores: PollyReach (#29 → #1), LobeHub (#17 → #1), SocLeads 3.0 (#32 → #2), Drizz (#20 → #2), Mantle Chat (#34 → #4), ReactVision Studio (#30 → #3).
- **Hunter without stack cap still wins**: Vivago (#22 → #1, Chris Messina) — creative/video agents with hunter help but not max boosts.
- **Incumbent model ship works**: Cursor Composer 2.5 (#3 → #3) — `product_hunt_audience_fit` 10 beat narrative #1 pick.

**Lessons:**
1. **Hunter ≠ #1** — treat maker_signal_boost as **+0.2** by default; use **+0.5** only with usefulness ≥ 8, clarity ≥ 8, **and** (incumbent, relaunch, or prior PH-winning team).
2. **Ship-today utilities** (outbound, OSS agent hub, QA automation, lead gen) beat pitch-deck “outcome” positioning for day rank — add **practical builder tool** boost; scan rank 18–40 for promotions.
3. **Cap stacked calibration** — never #1 on maker+outcome+ph-core alone (see stacked-boost guardrails).
4. **Actual winners had lower ph_core (7.4 avg)** than predicted top 10 (8.6) — do not require ph_core ≥ 9 for all top-5 slots; reserve 9–10 for incumbents and obvious electorate fits.
5. **Relaunch / vN** products (SocLeads 3.0, imgproxy v4) can finish top 3 — apply **relaunch boost**, not staleness penalties on RSS `published_at`.

#### 2026-05-20 (`prediction_results.json`, 23 Launching Today launches; post–eligibility filter)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **5.87** (best so far) |
| Top-3 / top-5 precision | **67% / 60%** (2 / 3 hits) |
| Mean signed rank error | **−0.04** (balanced; not systematic under-rank) |
| Mean upvote-rank error | **5.83** |
| RSS entries / included | 50 / **23** Launching Today |

**Actual top 5 (day rank / upvotes):** StoreClaw (#1, 591↑), mailX (#2, 471↑), Emdash (#3, 345↑), Gemini Omni (#4, 331↑), Runtime (#5, 254↑).

**Hits:** Emdash (#1 pred → #3), mailX (#3 → #2), Runtime (#2 → #5).

**Failure modes (over-ranked):**
- **Practical-builder cluster in top 10 on a small feed**: Tophat (#4 → #17), Skilled (#9 → #22), Multi-Claude (#7 → #19), Invenio (#8 → #23) — ph-core + practical-builder boosts did not convert when only 23 launches compete.
- **Garry Tan / YC agent infra still over-weighted for #1–2**: Runtime (#2 → #5) and Emdash (#1 → #3) were directionally right but not #1–2; stacked hunter + builder narrative is not enough alone on a filtered day.

**Failure modes (under-ranked):**
- **Ecommerce / seller outcome + known hunter**: StoreClaw (#6 → #1, Chris Messina) — `ph_core_voter_appeal` was only 7; shareability and GTM outcome mattered more than dev-tool centrism.
- **Tier-1 incumbent**: Gemini Omni (#10 → #4) — saturation **−0.5** + incumbent **−0.4** net **−0.6** was too punitive; Google multimodal + broad demo still top 5.
- **Vertical agent utilities**: Supercut (#19 → #7), Re_gent (#16 → #6) — saturated labels with clear JTBD beat generic agent penalties.

**Lessons:**
1. **Launching Today filter is mandatory** — comparing only same-day launches cut MAE from ~16–23 (50-launch feeds) to **~5.9**.
2. **Ecommerce GTM outcomes can win #1** without max `ph_core_voter_appeal` — add **ecommerce_outcome** boost; do not bury Chris Messina–tier hunts below rank 5.
3. **Tier-1 incumbents (Google Gemini-class)** belong in **top 6** when broad appeal is strong — use **−0.2** incumbent penalty, not **−0.4**, and add tier-1 incumbent boost.
4. **Small feeds (≤25 included)**: cap **two** `practical_builder_tool` slots in top 5; Rohan + Shopify OSS utilities are top-12 at best (Tophat #17 actual).
5. **Do not saturate-penalize** vertical agent tools with obvious JTBD (recordings, agent VCS) when usefulness ≥ 8.
6. **Signed error near zero** — less blanket promotion from rank 18+ needed than on 2026-05-19; prioritize **missing archetypes** (ecommerce, tier-1 incumbent) over more builder promotions.

#### 2026-05-21 (`prediction_results.json`, 20 Launching Today launches)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **13.95** (median **5**; inflated by Tether **#187** scrape outlier) |
| Top-3 / top-5 precision | **33% / 40%** (1 / 2 hits) |
| Mean signed rank error | **+8.35** (systematic **under-ranking** of winners again) |
| Mean upvote-rank error | **5.5** |
| RSS entries / included | 50 / **20** Launching Today |

**Actual top 5 (day rank / upvotes):** Tycoon AI (#1, 444↑), Mintlify Workflows (#2, 304↑), WeWeb 3.0 (#3, 272↑), Google Antigravity 2.0 (#4, 265↑), WarmIntro (#5, 213↑).

**Hits:** Tycoon (#2 pred → #1), Google Antigravity (#1 → #4, top-5 only).

**Failure modes (over-ranked):**
- **Practical-builder cluster in predicted top 5**: Basedash Skills (#3 → #18), CatchAll (#4 → #12), InstaVM (#5 → #17) — three of five pred top-5 slots were builder/infra; only two landed in actual top 5.
- **Stacked-boost demotion hurt the winner**: Tycoon demoted from #1 for `total_adjustment` ≥ 1.2; **meta-PH + PH CEO** narrative still won the day.
- **Tier-1 at #1 on small feed**: Google Antigravity #1 pred → #4 actual when a stronger meta-PH story was in the feed.

**Failure modes (under-ranked):**
- **Meta-PH / PH ecosystem**: Tycoon (#2 pred → #1) — should not lose #1 to tier-1 incumbent swap.
- **Garry Tan workflow hunt**: Mintlify (#6 → #2) — docs/self-updating KB beat Garry Tan data infra (CatchAll #4 → #12).
- **Prior PH winner relaunch**: WeWeb 3.0 (#13 → #3) — `3.0` + established no-code brand undervalued.
- **Rohan sales-outcome hunt**: WarmIntro (#9 → #5) — founder GTM utility, not “Shopify OSS only top-12.”
- **Mid-pack sleepers**: Slideshot (#8 → #6), Vivaldi (#14 → #7), Mixpanel Headless (#12 → #8) — closer than headline misses suggest (median error **5**).

**Lessons:**
1. **Meta-PH can be #1** on small feeds — do not demote `meta_ph` + `product_hunt_audience_fit` ≥ 10 for stacked boosts; use **medium** confidence, not demotion (Tycoon).
2. **Tier-1 incumbent** belongs **#3–#5**, not #1, when meta-PH or PH CEO launches compete (Google #1→#4).
3. **Garry Tan is not monolithic** — workflow/docs/outcome → top 5; dataset/API `best_in_feed_infra` → top 10 max on feeds ≤25.
4. **`best_in_feed_infra` + HN proof ≠ top 5** on 20-launch days (InstaVM #5→#17); keep **≤2** practical-builder slots in top 5 and prefer **relaunch + prior PH winner** (WeWeb) over infra hype.
5. **Signed error +8.35** — promote **prior_ph_winner relaunches** and **outcome_differentiated** Garry hunts from rank 10+ before adding more infra to top 5.
6. **`high` confidence** on hunter + infra in top 5 was overconfident — default those to **medium**.

#### 2026-05-22 (`prediction_results.json`, 24 Launching Today launches)

| Metric | Value |
|--------|-------|
| Mean absolute rank error | **7.46** |
| Median absolute rank error | **6.5** |
| Top-3 / top-5 precision | **33% / 40%** (1 / 2 hits) |
| Mean signed rank error | **+0.71** (slight over-rank; large bilateral misses) |
| Mean upvote-rank error | **6.83** |
| RSS entries / included | 50 / **24** Launching Today |

**Actual top 5 (day rank / upvotes):** TestSprite 3.0 (#1, 442↑), Cleo (#2, 365↑), General Compute (#3, 312↑), WordPress 7.0 (#4, 251↑), iPromise (#5, 222↑).

**Hits:** TestSprite (#1 pred → #1), WordPress (#2 → #4, top-5 only).

**Failure modes (over-ranked):**
- **OSS stars as maker signal**: whosthere (#4 → #21) — 2.2k GitHub stars + TUI demo did not convert; never top 5 on stars alone.
- **B2B infra in top 5 without hunter**: SuprSend (#3 → #10), DCP (#9 → #15), AGG Identify (#14 → #26).
- **Practical-builder / design CLI cluster**: buildpipe (#7 → #11), Shuffle Design CLI (#8 → #17) — second-tier builder slots over-weighted vs founder outcomes.
- **Novelty/shareability trap**: Training Data microgames (#11 → #28) — Vibe Jam placement is not a day-rank predictor.

**Failure modes (under-ranked):**
- **Founder-operator AI PM**: Cleo (#10 → **#2**) — “AI runs your team” + Telegram ship story beat generic infra in top 5.
- **Ben Lang benchmarked inference**: General Compute (#6 → **#3**) — demotion for `best_in_feed_infra` was too aggressive; differentiated API + benchmarks belongs top 5.
- **Mac demo utility**: iPromise (#22 → **#5**) — broad-trap penalty and low `ph_core` buried a strong notch demo; `mac_demo_utility` can finish top 5.
- **Growth/consumer sleepers**: Auto Posts (#20 → #6), Prosed (#19 → #8), moop (#24 → #7) — do not auto-bury below rank 20 without thin-page proof.

**Lessons:**
1. **Chris Messina + prior PH #1 + `3.0` relaunch** remains the strongest small-feed #1 pattern (TestSprite exact hit) — keep at #1 when all three verify.
2. **OSS stars ≠ hunter** — `oss_stars_only_maker` cap **top 12**, **+0.2** boost only, never top 5 on feeds ≤25.
3. **Ben Lang inference API** with benchmarks is **not** CatchAll-style dataset infra — promote to **top 5**, not only “cap at top 10.”
4. **Broad-trap nuance**: apply **`mac_demo_utility`** (light penalty, top-5 possible) when broad + shareability ≥ 8; keep full **−0.4** for travel/ID/solar traps.
5. **Founder-operator outcome** (Cleo-class) beats B2B notification infra for top 3 — add **founder_operator_outcome** boost and pre-save promotion from rank 10+.
6. **Do not fill top 5 with practical-builder + OSS + B2B** when the feed also has **prior-PH relaunch**, **platform major release**, and **founder-operator** candidates — max two builder slots still applies, but slot **founder-operator** and **benchmarked inference** ahead of SuprSend/whosthere-style picks.
7. **Nugget-style outcome PM** without hunter: **medium** confidence, top-8 at best (pred #5 → #9).

#### Combined rules (apply every run)

1. **Filter to Launching Today first** — score and rank only included launches; never compare across stale RSS entries (2026-05-20: 23/50 included, MAE **5.87**).
2. **`ph_core_voter_appeal` > `broad_vote_appeal`** for ranking — but **ecommerce outcomes** and **tier-1 incumbents** can win on shareability + broad appeal with ph-core 7 (2026-05-20).
3. **Outcome beats novelty** for winners: meetings, sleep, fundraising, sales, **seller/store GTM** (2026-05-14, 2026-05-20) — **ship-today builder utilities** help on large feeds (2026-05-19) but **over-fill top 5 on small feeds** (2026-05-20).
4. **Maker signal + differentiated infra** can win #1–3 (2026-05-15) — **cap hunter boosts**; Chris Messina + ecommerce beat Garry Tan infra for #1 on 2026-05-20.
5. **Broad-trap skepticism**: travel/discovery, photo-ID toys, solar hobbyist apps — cap expected rank; rarely top 3. **Mac demo utilities** (`mac_demo_utility`) with broad + shareability ≥ 8 can reach **top 5** (2026-05-22: iPromise). **Novelty/game hackathon** launches cap **≥15**.
6. **Incumbent extensions**: tier-1 (Google, Apple, Meta, OpenAI) → top **6** with **−0.2** penalty + boost when broad appeal is strong; other incumbents top 10 (Cursor #3 on 2026-05-19).
7. **Confidence** — **medium** for most predicted top 3; **high** only with proven archetype fit, not hunter stacks alone.
8. **Practical builder scan**: promote from rank 18+ on **large** feeds; on **≤25** included launches, max **two** in top 5 and prefer **meta-PH**, **prior-PH-winner relaunch**, **Garry workflow/docs outcome**, or **tier-1 incumbent (#3–#5)** over infra/HN slots (2026-05-21).
9. **best_in_feed_infra** alone is insufficient for top 10 — on feeds ≤25 cap at **top 12**; verify install-or-try-today JTBD.
10. **Saturation counts use included launches only** after Launching Today filter.
11. **Meta-PH + audience fit 10** can rank **#1** despite high `total_adjustment`; do not swap for tier-1 incumbent on small feeds (2026-05-21: Tycoon).
12. **Garry Tan split**: workflow/docs/outcome hunts → top 5; dataset/API infra hunts → top 10 unless prior PH win (2026-05-21: Mintlify vs CatchAll).
13. **Prior PH winner + relaunch** (`3.0`, `2.0`, `vN`) → review for top 5 when ranked below 10 (2026-05-21: WeWeb; 2026-05-22: TestSprite #1 hit).
14. **OSS stars-only** → cap top 12, never top 5 on feeds ≤25 (2026-05-22: whosthere).
15. **Ben Lang / benchmarked inference API** → top 5 when verified; distinct from dataset-only `best_in_feed_infra` cap (2026-05-22: General Compute).
16. **Founder-operator outcome** (AI PM / team ops) → top 5 review when broad ≥ 7 (2026-05-22: Cleo).
17. **Chris Messina + prior PH #1 + relaunch** → default #1 candidate on small feeds when present (2026-05-22: TestSprite).

Prediction JSON shape:

```json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO timestamp",
  "fetched_at": "ISO timestamp",
  "timezone": "Product Hunt launch-day timezone/boundary used",
  "fetch_method": "Product Hunt RSS feed",
  "source_urls": [
    "https://www.producthunt.com/feed?category=undefined"
  ],
  "rss_snapshot_file": "data/producthunt/predictions/YYYY-MM-DD/rss.xml",
  "launch_eligibility_file": "data/producthunt/predictions/YYYY-MM-DD/launch-eligibility.json",
  "products_file": "data/producthunt/predictions/YYYY-MM-DD/products-with-urls.json",
  "prediction_target": "final end-of-day Product Hunt leaderboard rank among launches from this Product Hunt launch day",
  "scoring_method": "weighted sum per prompts/producthunt/predict.md (clarity 13%, novelty 7%, usefulness 16%, shareability 14%, product_hunt_audience_fit 14%, credibility_effective 8%, launch_momentum_potential 14%, ph_core_voter_appeal 14%, broad_vote_appeal 10%) plus documented calibration adjustments",
  "feed_composition": {
    "launch_count": 0,
    "saturated_archetype_count": 0,
    "broad_trap_archetype_count": 0,
    "saturated_archetypes": ["AI agents", "computer use", "MCP", "agent builders", "memory/RAG layers", "local LLM tooling"],
    "broad_trap_archetypes": ["Mac novelty utilities", "travel/local discovery", "photo-ID gimmicks", "menu-bar trivia"]
  },
  "rules": {
    "excluded_fields_verified": true,
    "excluded_signals": [
      "upvotes",
      "comments",
      "current ranking",
      "leaderboard position",
      "featured position",
      "featured badges",
      "trending labels",
      "top product metadata",
      "Product Hunt popularity signals",
      "external Product Hunt traction discussions"
    ]
  },
  "predictions": [
    {
      "predicted_rank": 1,
      "product_hunt_slug": "",
      "product_name": "",
      "tagline": "",
      "product_hunt_url": "",
      "website_url": "",
      "category": "",
      "rss_item_snapshot": {
        "title": "",
        "link": "",
        "guid": "",
        "published_at": "",
        "description": ""
      },
      "scores": {
        "clarity": 0,
        "novelty": 0,
        "usefulness": 0,
        "shareability": 0,
        "product_hunt_audience_fit": 0,
        "credibility": 0,
        "credibility_effective": 0,
        "launch_momentum_potential": 0,
        "ph_core_voter_appeal": 0,
        "broad_vote_appeal": 0
      },
      "calibration_adjustments": {
        "saturation_penalty": 0,
        "incumbent_penalty": 0,
        "broad_trap_penalty": 0,
        "ph_core_boost": 0,
        "maker_signal_boost": 0,
        "outcome_boost": 0,
        "meta_ph_boost": 0,
        "broad_ph_combo_boost": 0,
        "total_adjustment": 0
      },
      "maker_signal": false,
      "archetype_flags": {
        "saturated": false,
        "broad_trap": false,
        "incumbent_extension": false,
        "meta_ph": false,
        "outcome_differentiated": false,
        "practical_builder_tool": false,
        "ecommerce_outcome": false,
        "tier1_incumbent": false,
        "mac_demo_utility": false,
        "oss_stars_only_maker": false,
        "founder_operator_outcome": false,
        "novelty_shareability_trap": false
      },
      "predicted_success_score": 0,
      "confidence": "low | medium | high",
      "reasoning": "",
      "likely_ai_bias_or_risk": "",
      "research_sources": []
    }
  ]
}
```
