---
phase: 06-question-bank-expansion
plan: "03"
subsystem: question-bank
tags: [questions, domain-3, domain-4, snippets, scenarios, claude-code, structured-output]
dependency_graph:
  requires: [06-02]
  provides: [d3-questions-q68-q84, d4-questions-q85-q101, scenario-code-gen-pool-9, scenario-ci-pool-9, scenario-devprod-pool-9]
  affects: [src/data/questions.ts]
tech_stack:
  added: []
  patterns: [exam-style-questions, hasSnippet-flag, scenario-tagging, path-glob-rules, structured-output-schema]
key_files:
  created: []
  modified:
    - src/data/questions.ts
decisions:
  - "D3 questions ground in task statements 3.1-3.6: hooks, .claude/rules/ globs, SKILL.md context:fork, plan mode, subagents, CI headless, least-privilege"
  - "D4 questions ground in task statements 4.1-4.6: JSON Schema nullable/enum/other+detail, CLI --output-format json --json-schema, Message Batches custom_id, structured errors, prefilling, attention dilution"
  - "Buffer strategy: tagged 4 Code Gen, 3 CI(D3)+2 CI(D4)=5 total, 4 DevProd — each pool reaches exactly 9 (buffer target)"
  - "hasSnippet covers: .claude/rules/ YAML paths glob, SKILL.md context:fork allowed-tools argument-hint, PreToolUse hook config JSON, CLI --output-format json --json-schema, JSON Schema nullable/enum, other+detail nullable, Message Batches custom_id"
  - "no-fetch caveat honored: zero occurrences of fetch( import( axios XHR in questions.ts"
metrics:
  duration: "~30 minutes"
  completed: "2026-06-11"
  tasks_completed: 2
  files_changed: 1
---

# Phase 6 Plan 03: D3 + D4 Question Authoring Summary

**One-liner:** 34 exam-style questions (q68–q101) for D3 (hooks/rules/skills/CI) and D4 (structured output/JSON Schema/Batches/CLI) with scenario tags bringing Code Gen, CI, and DevProd pools each to 9.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author 17 D3 questions q68-q84 | 8cdf7f4 | src/data/questions.ts |
| 2 | Author 17 D4 questions q85-q101 | 8cdf7f4 | src/data/questions.ts |

Both tasks were implemented atomically in a single edit and committed together.

## What Was Built

### Domain 3 Questions (q68–q84)

17 new questions grounded in D3 task statements 3.1–3.6:

| ID | Topic | Scenario | hasSnippet |
|----|-------|----------|------------|
| q68 | `.claude/rules/` YAML frontmatter paths glob | Code Generation | true |
| q69 | Subdirectory CLAUDE.md scoping | Code Generation | — |
| q70 | SKILL.md `context: fork`, `allowed-tools`, `argument-hint` | Code Generation | true |
| q71 | PreToolUse hook vs CLAUDE.md rule (deterministic enforcement) | Code Generation | — |
| q72 | PreToolUse hook blocking out-of-repo file reads in CI | CI | true |
| q73 | `--output-format json` for CI machine-readable output | CI | — |
| q74 | `--allowedTools` least-privilege in headless CI | CI | — |
| q75 | `.claude/rules/` TypeScript glob for per-file conventions | DevProd | — |
| q76 | CLAUDE.md for persistent project context | DevProd | — |
| q77 | PostToolUse hook for automatic test execution | DevProd | — |
| q78 | CLAUDE.md `@import` modular composition for 2000-token bloat | DevProd | — |
| q79 | PreToolUse hook restricting write paths | — | — |
| q80 | Plan mode: deferred execution, human review before modification | — | — |
| q81 | Recursive subagent (Task tool) delegation risks and mitigation | — | — |
| q82 | Defense-in-depth: `--allowedTools` + PreToolUse for read-only review | — | — |
| q83 | Skills vs slash commands: agent-callable vs user-triggered | — | — |
| q84 | PostToolUse hook for CI compliance audit logging | — | — |

### Domain 4 Questions (q85–q101)

17 new questions grounded in D4 task statements 4.1–4.6:

| ID | Topic | Scenario | hasSnippet |
|----|-------|----------|------------|
| q85 | CLI `--output-format json --json-schema` for CI structured output | CI | true |
| q86 | JSON Schema enum for CI merge-gate classification | CI | — |
| q87 | JSON Schema `nullable` + `enum` including null for optional survey field | — | true |
| q88 | `other_detail` nullable vs always-required string pattern | — | true |
| q89 | Typed float vs string confidence score for downstream logic | — | — |
| q90 | Structured output vs regex-based text parsing (coupling) | — | — |
| q91 | Attention dilution in long prompts; recency effect fix | — | — |
| q92 | JSON Schema enum for constrained categorical output | — | — |
| q93 | Message Batches API for overnight 50K document batch | — | — |
| q94 | `custom_id` in Message Batches for async result correlation | — | true |
| q95 | `isError`/`errorCategory`/`isRetryable` structured error handling | — | — |
| q96 | Standardized tool result envelope for heterogeneous errors | — | — |
| q97 | Evaluation harness: JSON Schema + few-shot for 5-dimension rubric | — | — |
| q98 | Assistant turn prefilling for format control | — | — |
| q99 | Few-shot vs prose for 15-field contract extraction | — | — |
| q100 | Streaming API for real-time customer support perceived latency | — | — |
| q101 | Temperature=0 determinism vs correctness; category description fix | — | — |

## Acceptance Criteria Verification

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| D3 question count | >=25 | 25 | PASS |
| D4 question count | >=25 | 25 | PASS |
| IDs q68-q84 present | 17 | 17 | PASS |
| IDs q85-q101 present | 17 | 17 | PASS |
| Code Generation scenario | >=9 | 9 | PASS |
| Claude Code for CI scenario | >=9 | 9 | PASS |
| Developer Productivity scenario | >=9 | 9 | PASS |
| hasSnippet running total | >=12 | 14 | PASS |
| No fetch( / import( / axios / XHR | 0 | 0 | PASS |
| npm run typecheck | exit 0 | exit 0 | PASS |
| d3 >=24 test gate | green | green | PASS |
| d4 >=24 test gate | green | green | PASS |

## Snippet Topics Covered

| Topic | Question | Type |
|-------|----------|------|
| `.claude/rules/` YAML `paths:` glob frontmatter | q68 | D3 |
| SKILL.md frontmatter (`context: fork`, `allowed-tools`, `argument-hint`) | q70 | D3 |
| PreToolUse hook config JSON (blocking out-of-repo reads) | q72 | D3 |
| CLI `claude -p --output-format json --json-schema` | q85 | D4 |
| JSON Schema nullable/enum (survey satisfaction field) | q87 | D4 |
| JSON Schema "other"+detail nullable pattern | q88 | D4 |
| Message Batches `custom_id` correlation field | q94 | D4 |

## Deviations from Plan

None — plan executed exactly as written. All 34 questions authored, all scenario tags applied, all hasSnippet questions created, no-fetch caveat honored, typecheck green.

## Known Stubs

None. All questions are complete with stem, 4 options, correct index, whyCorrect, and whyOthers.

## Pre-existing Test Failures (not introduced by this plan)

The following test gates remain failing and are expected to be closed by plans 06-04 and 06-05:
- `d5 >= 18`: D5 questions are authored in 06-04 (q102–q114)
- `getQuestions() >= 120`: Reached after 06-04 adds D5 questions (113 + 13 = 126)
- `"Structured Data Extraction" >= 8`: Tagged in 06-04 (maps to d4/d5)
- `hasSnippet >= 15`: Currently 14; 06-04/06-05 will add 1+ more to close this gate

## Self-Check: PASSED

- `src/data/questions.ts` exists and contains q68–q101: CONFIRMED
- Commit 8cdf7f4 exists: CONFIRMED
- d3=25, d4=25: CONFIRMED via grep
- Code Gen=9, CI=9, DevProd=9: CONFIRMED via grep
- hasSnippet=14: CONFIRMED via grep
- No fetch(/import(/axios/XHR: CONFIRMED via grep (empty result)
- typecheck: exit 0 CONFIRMED
