# Product Hunt Scripts

Utilities for Product Hunt product pages.

## Prediction workflow

1. Save RSS to `data/producthunt/predictions/YYYY-MM-DD/rss.xml`
2. Filter to **Launching Today** and resolve website URLs:

```sh
node scripts/product-hunt/parse-rss.js data/producthunt/predictions/YYYY-MM-DD
```

Writes `launch-eligibility.json` and `products-with-urls.json`. Debug with `--include-all-feed` to skip the filter.

3. Score launches and build predictions:

```sh
node scripts/product-hunt/build-predictions.js data/producthunt/predictions/YYYY-MM-DD
```

See `prompts/producthunt/predict.md` for the full workflow.

## Scrape Product

Fetch a Product Hunt product page with browser-like headers.

**Default** (compare / evaluation runs — rank and upvotes allowed):

```sh
npm run product-hunt:scrape -- "https://www.producthunt.com/products/claudy"
```

```json
{
  "url": "https://www.producthunt.com/products/claudy",
  "dayRank": "#9",
  "upvotes": 144,
  "launchingToday": true,
  "launchStatusLabel": "Launching Today"
}
```

**Launch eligibility only** (prediction intake — no rank/upvotes in output):

```sh
npm run product-hunt:scrape -- --launch-status "https://www.producthunt.com/products/claudy"
```

```json
{
  "url": "https://www.producthunt.com/products/claudy",
  "launchingToday": true,
  "launchStatusLabel": "Launching Today"
}
```
