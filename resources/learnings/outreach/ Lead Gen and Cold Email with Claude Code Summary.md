# YouTube Summary: Claude Code for Cold Email / Lead Gen at Scale

**Original link:** https://www.youtube.com/watch?v=Vo9VUnzYqpw

**Brief description:** The video shows how a team that doesn’t code used Claude Code (and previously Cursor) to build a custom lead-generation and cold-email system that replaced Clay, processes millions of leads (e.g. 272k/sec), and runs for ~$2k/month. They cover their stack (GitHub, Railway, Convex), custom tools (Google Maps scraper, AI lead finder, ad library scrapers, executive summaries, lead DB), and how to get started with Claude Code for outreach.

---

## Chapters

### Intro: 5M leads, replacing Clay with a custom system (0:00 - 2:50)

They processed 5 million leads for cold email using a system built with Claude Code, are replacing Clay entirely, and don’t write code—their teammate James learned Claude Code three weeks ago and built the core. The system does ~272k leads/second (~1M in 5 seconds), cost ~$1,966/month to run, and they were previously Clay’s largest user (17.3M platform calls/week). The video explains how they did it and which tools they built.

### Why they built their own: outgrowing Clay and Cursor (2:50 - 5:20)

They outgrew existing tools. At peak, Fixer AI alone was 9M leads/month. Clay limits (50k rows per table, 12.5M per workspace, slow deletes) and pricing moves (e.g. per custom HTTP row) made them build in-house. They used Cursor first (~$3k/month solo, then ~$450/day for two people), then switched when “Ralph Loops” released Claude Code—$200/month per seat, cheaper and better. James built the core system in a week with no prior experience.

### Stack: GitHub, Railway workers, Postgres, Convex (5:20 - 8:40)

Code lives on GitHub; workers run on Railway (they deploy “workers” that process leads 24/7, ~50 at a time). Railway also hosts Postgres. The lead processor and other workers are shown; cost fluctuates (e.g. ~$2,012 when heavy). They’re migrating lead storage from Postgres to Convex for better real-time handling; Outfound.io will stay on a custom Postgres setup. Custom builds let them optimize for their own scale and fix errors quickly.

### Custom tools intro and Google Maps scraper (8:40 - 11:40)

They “vibe coded” tools with Cursor or Claude Code. One example: a custom Google Maps scraper for local leads, scraping zip code by zip code (32k+ zips) so every query returns. James built it in a few hours. After scraping, they run AI enrichment to find contacts (scraping public sources), then another AI layer to segment (e.g. multilocation medical, 20+ years in business) with confidence scores to narrow ICP before outreach. Cost is very low (e.g. ~$0.002 for three leads per company).

### AI lead finder and ad library scrapers (11:40 - 14:50)

When data from AR Arc (which replaced Apollo for them) has no match, an AI lead finder searches the internet for contacts, aims for three per company, and can use alternate emails or other jobs (e.g. consultants with multiple companies). It returns LinkedIn profiles and reasoning. They get ~95%+ validated contacts vs ~30% from Apollo/LinkedIn alone. They also built ad library scrapers (Google and LinkedIn) to find who’s running ads in the last 30–60 days and filter by ad volume—companies running ads are warmer leads.

### Executive summary system and Friday analytics (14:50 - 16:50)

An AI system analyzes all campaigns and produces daily reports (what to focus on, what to process). It samples clients, shows average rates, email-to-lead ratios, meetings generated, and will analyze copy (subject lines, hooks, body, social proof, ICP) to recommend what works per ICP. They’re building programmatic campaign creation from this. Another tool auto-cleans Instantly workspaces (Instantly bills per lead; Smart Lead and Email Bison don’t), deletes old leads, loads the right list, and sends a “Friday analytics” report.

### Lead database and vendor comparison (16:50 - 17:15)

They maintain a private lead DB (~50M leads), cataloging every lead pulled per client (where not restricted). So they often don’t buy new data—only fetch new entrants. They analyze which data vendor has the best validity per ICP (e.g. Lead Magic for cyber, Wiza for e-commerce) to optimize the waterfall per client/industry. Lists are managed automatically: when a client is low, the system deletes old leads from Instantly and uploads new ones to avoid storage charges.

### How to get started and CTA (17:15 - 17:28)

Two paths: (1) Build your own—start with Claude Code, pick your biggest pain point, solve one piece at a time; ask Claude Code things like “get the Lead Magic API and walk me through setup”; ask good questions and be willing to learn; you don’t need to understand the code, just what you want. Use these as internal tools and add auth/security. (2) Or book a free intro call (first link in description) to use their system. They cite results for RB2B, Fixer AI, and Directive Consulting.

---

## Tools mentioned (with links)

| Tool | Purpose | Link |
|------|---------|------|
| **Claude Code** | AI coding environment they use to build the system ($200/mo per seat) | https://claude.com/code (or Anthropic’s Claude Code product) |
| **Cursor** | Previous AI coding editor (~$3k/mo solo, ~$450/day for 2); they switched to Claude Code | https://cursor.com |
| **GitHub** | Version control and cloud storage for code | https://github.com |
| **Railway** | Deploy workers and host Postgres; runs lead processors and other jobs | https://railway.app |
| **Convex** | Real-time backend; they’re migrating lead data from Postgres to Convex | https://convex.dev |
| **Clay** | Lead enrichment/outreach platform they’re replacing (row/workspace limits) | https://clay.com |
| **AR Arc** | Contact/data vendor; replaced Apollo for them | Search “AR Arc” or similar—likely https://arc.net or a data provider |
| **Apollo** | Contact data; largely replaced by AR Arc in their stack | https://apollo.io |
| **Instantly** | Cold email sending; they auto-clean workspaces to control lead storage billing | https://instantly.ai |
| **Smart Lead** | Alternative to Instantly (they like it; different billing model) | https://smartlead.ai |
| **Email Bison** | Alternative to Instantly; they’re considering moving more there | https://emailbison.com |
| **Lead Magic** | Data vendor; they compare vendor quality per ICP (e.g. cyber security) | https://leadmagic.io |
| **Wiza** | Data vendor; e.g. better for e-commerce in their tests | https://wiza.co |
| **Google Maps** | Source for local business leads (scraped zip by zip) | https://google.com/maps |
| **LinkedIn (Ad Library)** | Source for “who’s running ads” lead lists | https://linkedin.com |
| **Postgres** | Database on Railway; some data moving to Convex | — |

*Note: “Ralph Loops” is mentioned as the source of the Claude Code release; may refer to a launch or integration.*

---

## How to get started using Claude Code for outreach (e.g. for papayo.ai)

- **Get Claude Code** — Sign up for Claude Code (~$200/month per seat) and use it as your main “no-code” dev environment for automation.
- **Pick one pain point** — Don’t rebuild everything. Choose the single biggest bottleneck (e.g. lead list building, enrichment, sending, reporting) and solve that first.
- **Describe the outcome, not the code** — Tell Claude what you want (e.g. “Find contacts when our data vendor has no match” or “Clean our Instantly workspace weekly”) and iterate in small steps.
- **Use it for internal tools only at first** — Treat what you build as private ops tools; add basic auth/security before exposing anything.
- **Ask for API and setup help** — e.g. “Get the [Lead Magic / Instantly / etc.] API and walk me through how to set this up”; Claude can guide step-by-step.
- **Accept front-end time for back-end leverage** — Tools aren’t perfect; invest time upfront so automations save time later.
- **Consider your stack** — Code in GitHub, workers on Railway (or similar), and a DB (Postgres or Convex) is a proven pattern from the video for high-volume lead processing.
- **Optional: use their service** — If you want the benefit without building, book their intro call (first link in the video description) and use their cold email machine.
