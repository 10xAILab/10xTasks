# Script Creation Guide

When an agent needs a new deterministic tool, create it under:

```text
scripts/<script-name>/
  README.md
  script.js
```

## Required Sections

Each script folder must document:
- purpose
- inputs
- outputs
- usage examples

## Implementation Guidelines

- keep logic simple and deterministic
- accept explicit CLI arguments
- return JSON/text that other agents can parse
- handle errors with clear messages and non-zero exits
