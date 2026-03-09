# Coding Plan Gate Prompt

Use this prompt for any Linear task classified as coding.

## Goal

Require plan approval before implementation.

## Process

1. Read the Linear issue and acceptance criteria.
2. Resolve repository path using `memory/repos.json`.
3. Propose execution setup:
   - repo path
   - branch name: `<linear-key>/<slug>`
   - worktree path: `../worktrees/<linear-key>-<slug>`
4. Draft implementation plan:
   - scope
   - files likely to change
   - test strategy
   - rollout/risk notes
5. Update Linear:
   - status: `Planned`
   - label: `needs-plan-approval`
   - comment with the plan and setup details
6. Pause and request explicit human approval.

## After Approval

- move Linear issue to `In Progress`
- create worktree/branch per plan
- implement changes
- run tests and attach outcome
- move to `Done` when acceptance criteria pass
