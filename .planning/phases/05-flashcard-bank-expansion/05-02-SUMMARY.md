---
phase: 05-flashcard-bank-expansion
plan: "02"
subsystem: content-data
tags: [flashcards, d1, d2, agentic, mcp, task-statements, content-authoring]
dependency_graph:
  requires: [05-01]
  provides: [d1-flashcard-expansion, d2-flashcard-expansion]
  affects: [src/data/flashcards.ts]
tech_stack:
  added: []
  patterns: [taskRef-tagging, contiguous-id-sequence]
key_files:
  modified:
    - src/data/flashcards.ts
decisions:
  - "30 D1 cards (f51-f80) distributed across 7 task statements at suggested spreads: 5 for 1.1, 5 for 1.2, 5 for 1.3, 4 for 1.4, 4 for 1.5, 4 for 1.6, 3 for 1.7"
  - "20 D2 cards (f81-f100) distributed across 5 task statements: 4 per statement (2.1-2.5)"
  - "Each card authored with goal-oriented front (term or sharp question) and 1-3 sentence back grounded in 05-CONTEXT.md guide concepts"
  - "All cards omit existing f1-f50 concepts; no duplicate concepts within each statement group"
metrics:
  duration_minutes: 15
  completed_date: "2026-06-11"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 1
---

# Phase 05 Plan 02: D1 + D2 Flashcard Expansion Summary

## One-liner

Authored 50 new flashcards (f51-f80 for D1, f81-f100 for D2) with taskRef tags covering all 7 D1 statements (1.1-1.7) and all 5 D2 statements (2.1-2.5), driving d1 to 43 cards and d2 to 29 cards.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author 30 NEW Domain 1 flashcards (f51-f80) | a3b3411 | src/data/flashcards.ts |
| 2 | Author 20 NEW Domain 2 flashcards (f81-f100) | a3b3411 | src/data/flashcards.ts |

Both tasks were authored and committed atomically in a single edit since they are contiguous entries in the same file.

## What Was Built

**Domain 1 cards (f51-f80, taskRef 1.1-1.7):**
- 1.1 (5 cards): stop_reason "tool_use" vs "end_turn", appending tool_result, loop-until-end_turn pattern, anti-pattern for NL termination detection, anti-pattern for arbitrary iteration caps
- 1.2 (5 cards): hub-and-spoke, subagent context isolation rationale, dynamic subagent selection, scope partitioning, iterative refinement via evaluator–optimizer cycle
- 1.3 (5 cards): Task tool allowedTools prerequisite, no auto-inheritance of context, AgentDefinition shape, parallel Task calls in one turn, goal-not-procedure prompts
- 1.4 (4 cards): programmatic gates vs. prompt guidance, deterministic financial compliance, structured escalation handoff summary, handoff vs. autonomous continuation decision
- 1.5 (4 cards): PostToolUse normalization, PreToolUse policy enforcement/blocking, hooks vs. prompt compliance comparison, Stop hook use case
- 1.6 (4 cards): fixed chaining vs. dynamic decomposition, per-file local + cross-file integration pass, adaptive investigation plans, granularity tradeoffs
- 1.7 (3 cards): `--resume <name>` usage, fork_session semantics, new-session-with-summary vs. resume-with-stale-results

**Domain 2 cards (f81-f100, taskRef 2.1-2.5):**
- 2.1 (4 cards): descriptions as primary selection mechanism, complete description requirements, rename/split to remove overlap, system-prompt keyword sensitivity
- 2.2 (4 cards): MCP isError flag, four error categories (transient/validation/business/permission), errorCategory+isRetryable+message pattern, access-failure vs. valid-empty distinction
- 2.3 (4 cards): degradation from too many tools, scoped per-role toolsets, tool_choice auto/any/forced, cross-role shared tool injection pattern
- 2.4 (4 cards): project .mcp.json vs. user ~/.claude.json, ${ENV} expansion for secrets, tools discovered at connect time, enhancing MCP descriptions to beat built-ins
- 2.5 (4 cards): Grep (content) vs. Glob (path patterns), Read/Write vs. Edit (unique-match), incremental codebase understanding strategy, Write vs. Edit decision criteria

## Verification Results

```
# f51-f80 count
grep -c "id: 'f5[1-9]'\|id: 'f6[0-9]'\|id: 'f7[0-9]'\|id: 'f80'" src/data/flashcards.ts
→ 30 ✓

# f81-f100 count
grep -c "id: 'f8[1-9]'\|id: 'f9[0-9]'\|id: 'f100'" src/data/flashcards.ts
→ 20 ✓

# D1 taskRef coverage
for t in 1.1 1.2 1.3 1.4 1.5 1.6 1.7 → all ok ✓

# D2 taskRef coverage
for t in 2.1 2.2 2.3 2.4 2.5 → all ok ✓

# No network primitives → 0 ✓

# typecheck → exit 0 ✓

# vitest "flashcard count d1" → PASS (1/1) ✓
# vitest "flashcard count d2" → PASS (1/1) ✓
# vitest "all flashcard ids are unique" → PASS (1/1) ✓
```

## Deviations from Plan

None — plan executed exactly as written. Tasks 1 and 2 were committed together in a single atomic commit because both are appended entries in the same file and the first task's acceptance criteria could only be verified alongside the second task's ids (the file modification was one contiguous block).

## Known Stubs

None. All 50 new cards have non-empty fronts and backs grounded in 05-CONTEXT.md guide concepts.

## Threat Flags

None. This plan is content-only (data authoring). No new network endpoints, auth paths, file access patterns, or schema changes were introduced.

## Self-Check: PASSED

- src/data/flashcards.ts modified and contains f51-f100 ✓
- Commit a3b3411 exists in git log ✓
- d1 count 43 >= 40 minimum ✓
- d2 count 29 >= 27 minimum ✓
- All 12 task statement refs (1.1-1.7, 2.1-2.5) present ✓
- Typecheck green ✓
- Id uniqueness test green ✓
