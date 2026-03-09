# Daily Run Prompt

Use this prompt for the daily operating loop.

## Objective

Process new local tasks into Linear using Linear MCP, then execute ready Linear tasks for the day.

## Steps

1. Run `prompts/master-orchestrator.md`.
2. Confirm all successfully created Linear issues were removed from
   `tasks/local.md`.
3. Pull ready Linear tasks for execution.
4. Execute unblocked non-coding tasks.
5. For coding tasks:
   - write implementation plan
   - set `Planned` + `needs-plan-approval`
   - stop for human approval
6. Save execution outputs to `artifacts/`.
7. Update Linear status, labels, dependencies, and notes.

## Stop Conditions

Stop and ask the human only when:

- blocked by missing context/access/dependencies
- coding plan approval is required
- a critical execution risk is detected
