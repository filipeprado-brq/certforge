---
phase: 05-flashcard-bank-expansion
plan: "03"
subsystem: data
tags: [flashcards, domain-expansion, d3, d4, taskRef]
dependency_graph:
  requires: [05-02]
  provides: [d3-30-cards, d4-30-cards]
  affects: [src/data/flashcards.ts]
tech_stack:
  added: []
  patterns: [taskRef-tagged-cards, per-domain-expansion]
key_files:
  created: []
  modified:
    - src/data/flashcards.ts
decisions:
  - "Authored D3 f101-f120 and D4 f121-f140 in a single atomic edit; both task sets share one file"
  - "Pre-existing task-statement coverage test failure (5.1-5.6 missing taskRefs on D5 seed cards) confirmed pre-existing before this plan; deferred to 05-04"
metrics:
  duration: "~3 minutes"
  completed_date: "2026-06-11"
  tasks_completed: 2
  files_changed: 1
---

# Phase 05 Plan 03: Domain 3 + Domain 4 Flashcard Expansion Summary

**One-liner:** 40 new taskRef-tagged flashcards expanding D3 to 30+ and D4 to 30+ cards, covering all 3.1-3.6 and 4.1-4.6 exam guide task statements.

## What Was Built

Appended 40 new flashcards to `src/data/flashcards.ts`:

- **f101-f120** (Domain 3 — Claude Code Configuration & Workflows): 20 cards with taskRefs spanning all six D3 statements.
- **f121-f140** (Domain 4 — Prompt Engineering & Structured Output): 20 cards with taskRefs spanning all six D4 statements.

### D3 Distribution (f101-f120)

| taskRef | Count | Topic |
|---------|-------|-------|
| 3.1 | 4 | CLAUDE.md hierarchy: user-global vs project, directory-level, @import, /memory |
| 3.2 | 4 | Custom slash commands & skills: project vs personal, context:fork, allowed-tools, on-demand vs always-loaded |
| 3.3 | 3 | Path-specific rules: paths: glob frontmatter, glob rules vs directory CLAUDE.md, organizing rules files |
| 3.4 | 3 | Plan mode vs direct execution: when to plan, Explore subagent, plan-then-execute |
| 3.5 | 3 | Iterative refinement: concrete I/O examples, test-driven iteration, single-message vs sequential |
| 3.6 | 3 | CI/CD integration: -p/--print, --output-format json + --json-schema, independent review instance |

### D4 Distribution (f121-f140)

| taskRef | Count | Topic |
|---------|-------|-------|
| 4.1 | 4 | Explicit criteria: vague vs categorical, false-positive categories, severity + code examples, categorical vs gradient |
| 4.2 | 4 | Few-shot prompting: format consistency, ambiguous-case handling, extraction hallucination, optimal count |
| 4.3 | 4 | Structured output via tool_use: syntax vs semantics, tool_choice modes, nullable fields, enum+"other" |
| 4.4 | 3 | Validation/retry feedback: retry-with-error, when retries are useless, detected_pattern field |
| 4.5 | 3 | Batch processing: cost/latency trade-off, no multi-turn tool calling, custom_id correlation |
| 4.6 | 2 | Multi-instance review: self-review limitation, independent instance + per-file/cross-file passes |

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1+2 | Author D3 f101-f120 + D4 f121-f140 | f3bd5d5 | src/data/flashcards.ts |

## Verification Results

- D3 id count (f101-f120): 20 PASS
- D4 id count (f121-f140): 20 PASS
- All taskRefs 3.1-3.6 present: PASS
- All taskRefs 4.1-4.6 present: PASS
- No fetch/import()/axios: PASS
- TypeScript typecheck: PASS
- `flashcard count d3 >= 30` test: PASS
- `flashcard count d4 >= 30` test: PASS
- `all flashcard ids are unique` test: PASS
- f1-f100 preserved unchanged: PASS

## Deviations from Plan

### Pre-existing Issue (out of scope, deferred)

**Task-statement coverage test `every task statement 1.1-5.6 appears as a taskRef` was failing before this plan.** Confirmed via `git stash` + test run. Root cause: D5 seed cards (f14-f15, f45-f50) have no `taskRef` values, so statements 5.1-5.6 are missing from the coverage set. This plan covers D3 and D4 only. The D5 taskRefs will be added in plan 05-04 when D5 cards are authored.

## Known Stubs

None. All 40 cards have fully authored front and back text grounded in the 05-CONTEXT.md guide concepts.

## Threat Flags

None. This plan adds only static data (flashcard content) — no network endpoints, auth paths, or schema changes at trust boundaries.

## Self-Check: PASSED

- f3bd5d5 exists: CONFIRMED via git log
- src/data/flashcards.ts modified: CONFIRMED (312 insertions)
- D3 count >=30: CONFIRMED (10 existing + 20 new = 30)
- D4 count >=30: CONFIRMED (10 existing + 20 new = 30)
- All 3.1-3.6 taskRefs present: CONFIRMED
- All 4.1-4.6 taskRefs present: CONFIRMED
- f1-f100 untouched: CONFIRMED
- questions.ts untouched: CONFIRMED
