# Claude Co-Work for Sales: Learnings

Source reviewed: `data/Claude Co-Work for sales`

## Core ideas

- Claude Co-Work becomes significantly more useful when paired with purpose-built sales connectors (CRM, email, calendar, call transcripts, enrichment/scraping).
- The highest leverage pattern is to convert repeatable manual sales workflows into reusable slash-invoked skills.
- Sub-agents are critical for large prospect/account sets because they preserve quality and speed through parallelization.

## Practical workflow insights

- **Prospecting:** Start from a specific trigger (for example, LinkedIn post engagers), then qualify against ICP, enrich contacts, and export directly to outreach-ready formats.
- **CRM mining:** Use AI to revive stale or underworked pipeline records by combining account research, communication history, and prioritization logic.
- **Call prep:** Build one standardized pre-call brief format that merges CRM context, past emails, prior call notes/transcripts, and recent company signals.
- **Scheduled automation:** Time-based runs (morning prep, daily reviews) create consistency and reduce manual context switching for reps.
- **Analytics:** Win/loss and rep scorecard analysis become more actionable when transcript + CRM + email data are combined into one output.

## Implementation takeaways

- Do the process manually once with Claude, fix mistakes in-flight, then package that exact sequence into a skill document.
- Be explicit in prompts when you want sub-agents for bulk tasks; this often is not enabled automatically.
- Store connector IDs, required inputs, and output format rules inside the skill to make execution reproducible across the team.
- Keep outputs in consumable formats for downstream use (CSV for outreach flows, HTML/Doc for briefing/review).

## Risks and quality controls

- Connector quality is the bottleneck: weak enrichment/scraping inputs lead to weak recommendations.
- Skills drift if processes or tool APIs change; periodic validation and updates are required.
- Automated recommendations should include confidence checks and human review before outreach or pipeline updates.

## Suggested next experiments

1. Build one internal "prospect miner" skill tied to your CRM stages and ICP rubric.
2. Build one "call prep brief" skill and schedule it for next-day meetings.
3. Add a weekly win/loss synthesis job that summarizes patterns by segment, rep, and deal stage.
