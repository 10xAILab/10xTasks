Compare a saved Product Hunt prediction run against current Product Hunt product-page actuals, then save an auditable results file.

Default input:
- Use the previous Product Hunt launch day relative to today's date.
- Prediction folder:

`data/producthunt/predictions/YYYY-MM-DD/`

Optional input:
- If the user passes a date folder, use that folder instead.
- Accept either:
  - `data/producthunt/predictions/YYYY-MM-DD/`
  - `YYYY-MM-DD`

Required input files:
- `data/producthunt/predictions/YYYY-MM-DD/predictions.json`
- `data/producthunt/predictions/YYYY-MM-DD/rss.xml` if present

Output file:

`data/producthunt/predictions/YYYY-MM-DD/prediction_results.json`

Important rule:
- This is an evaluation run after predictions were saved, so Product Hunt popularity data is allowed.
- Do not change `predictions.json` or `rss.xml`.
- Do not re-rank predictions before comparison.

Actuals source:
- For every prediction in `predictions.json`, read `product_hunt_url`.
- Scrape each Product Hunt product URL with:

```sh
npm run product-hunt:scrape -- "<product_hunt_url>"
```

- The scraper returns (default mode; `launchingToday` is ignored during compare):

```json
{
  "url": "",
  "dayRank": "#10",
  "upvotes": 124,
  "launchingToday": false,
  "launchStatusLabel": null
}
```

- Parse `dayRank` into numeric `actual_rank`.
- Use `upvotes` as `actual_upvotes`.
- If scraping fails for a product, keep the product in the results with `actual_rank: null`, `actual_upvotes: null`, and an `actuals_error` string.

Comparison calculations:
- `signed_rank_error`: `actual_rank - predicted_rank`.
  - Positive means the product finished worse than predicted.
  - Negative means the product finished better than predicted.
- `absolute_rank_error`: absolute value of `signed_rank_error`.
- `predicted_top_3`: whether `predicted_rank <= 3`.
- `actual_top_3`: whether `actual_rank <= 3`.
- `top_3_hit`: whether both `predicted_top_3` and `actual_top_3` are true.
- `predicted_top_5`: whether `predicted_rank <= 5`.
- `actual_top_5`: whether `actual_rank <= 5`.
- `top_5_hit`: whether both `predicted_top_5` and `actual_top_5` are true.
- `actual_upvote_rank`: rank products by `actual_upvotes` descending among successfully scraped products.
- `upvote_rank_error`: `actual_upvote_rank - predicted_rank`.

Top-level metrics:
- `prediction_count`: total predictions in `predictions.json`.
- `scraped_count`: predictions with both `actual_rank` and `actual_upvotes`.
- `scrape_failed_count`: predictions with missing actuals.
- `rank_error_mean`: mean absolute rank error over scraped products.
- `rank_error_median`: median absolute rank error over scraped products.
- `rank_error_max`: max absolute rank error over scraped products.
- `signed_rank_error_mean`: mean signed rank error over scraped products.
- `top_3_hits`: count of predicted top 3 products that actually finished top 3.
- `top_3_precision`: `top_3_hits / count(predicted_top_3)`.
- `top_3_recall`: `top_3_hits / count(actual_top_3)`.
- `top_5_hits`: count of predicted top 5 products that actually finished top 5.
- `top_5_precision`: `top_5_hits / count(predicted_top_5)`.
- `top_5_recall`: `top_5_hits / count(actual_top_5)`.
- `upvote_rank_error_mean`: mean absolute upvote-rank error over scraped products.
- `upvote_rank_error_median`: median absolute upvote-rank error over scraped products.

Prediction results JSON shape:

```json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO timestamp",
  "prediction_file": "data/producthunt/predictions/YYYY-MM-DD/predictions.json",
  "rss_snapshot_file": "data/producthunt/predictions/YYYY-MM-DD/rss.xml",
  "actuals_source": "Product Hunt product pages scraped with scripts/product-hunt/scrape-product.js",
  "metrics": {
    "prediction_count": 0,
    "scraped_count": 0,
    "scrape_failed_count": 0,
    "rank_error_mean": 0,
    "rank_error_median": 0,
    "rank_error_max": 0,
    "signed_rank_error_mean": 0,
    "top_3_hits": 0,
    "top_3_precision": 0,
    "top_3_recall": 0,
    "top_5_hits": 0,
    "top_5_precision": 0,
    "top_5_recall": 0,
    "upvote_rank_error_mean": 0,
    "upvote_rank_error_median": 0
  },
  "results": [
    {
      "product_hunt_slug": "",
      "product_name": "",
      "prediction": {
        "predicted_rank": 0,
        "product_hunt_url": "",
        "website_url": "",
        "category": "",
        "scores": {
          "clarity": 0,
          "novelty": 0,
          "usefulness": 0,
          "shareability": 0,
          "product_hunt_audience_fit": 0,
          "credibility": 0,
          "launch_momentum_potential": 0
        },
        "predicted_success_score": 0,
        "confidence": "low | medium | high",
        "reasoning": "",
        "likely_ai_bias_or_risk": ""
      },
      "actuals": {
        "actual_rank": 0,
        "actual_day_rank_label": "#0",
        "actual_upvotes": 0,
        "actual_upvote_rank": 0,
        "scraped_at": "ISO timestamp",
        "actuals_error": null
      },
      "comparison": {
        "signed_rank_error": 0,
        "absolute_rank_error": 0,
        "upvote_rank_error": 0,
        "predicted_top_3": false,
        "actual_top_3": false,
        "top_3_hit": false,
        "predicted_top_5": false,
        "actual_top_5": false,
        "top_5_hit": false
      }
    }
  ],
  "notes": [
    "Rank and upvotes are scraped from Product Hunt product pages after prediction time.",
    "Scraped values can drift if the comparison is run before Product Hunt's launch day is fully settled."
  ]
}
```

Final response:
- Report the output path.
- Report the number of predictions, scrape failures, mean absolute rank error, top 3 precision/recall, and top 5 precision/recall.
- Mention any products whose actuals could not be scraped.
