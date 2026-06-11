---
phase: 05-flashcard-bank-expansion
plan: "01"
subsystem: data-types-and-tests
tags: [tdd, flashcards, types, content-test, red-gate]
dependency_graph:
  requires: []
  provides: [Flashcard.taskRef, content-test-flashcard-gates]
  affects: [src/data/types.ts, src/data/content.test.ts]
tech_stack:
  added: []
  patterns: [TDD RED gate, optional type extension]
key_files:
  created: []
  modified:
    - src/data/types.ts
    - src/data/content.test.ts
decisions:
  - "taskRef is optional so existing f1-f50 remain valid without edits"
  - "FC_MIN raised to {d1:40,d2:27,d3:30,d4:30,d5:23} to match domain weight targets"
  - "TASK_STATEMENTS const defined as 30-id tuple for compile-time completeness checks"
  - "Suite left in RED state intentionally — authoring plans 05-02/03/04 drive it GREEN"
metrics:
  duration: "84s"
  completed_date: "2026-06-11"
  tasks_completed: 2
  files_modified: 2
---

# Phase 05 Plan 01: Flashcard Type Extension + TDD RED Gate Summary

Optional `taskRef?: string` field added to the `Flashcard` interface; `content.test.ts` updated with raised per-domain minimums (d1≥40, d2≥27, d3≥30, d4≥30, d5≥23), total ≥150 assertion, and a 30-id TASK_STATEMENTS coverage gate — suite is intentionally RED against the current 50-card deck.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add optional taskRef to Flashcard type | 9bbb69e | src/data/types.ts |
| 2 | Raise flashcard minimums + TASK_STATEMENTS coverage gate (RED) | 46f4cd2 | src/data/content.test.ts |

## Decisions Made

- **taskRef is OPTIONAL:** Existing f1–f50 remain valid without edits; new cards authored in 05-02/03/04 will set taskRef to meet coverage gate.
- **FC_MIN raised to phase-5 targets:** {d1:40, d2:27, d3:30, d4:30, d5:23} from the 05-CONTEXT.md domain-weight table.
- **Q_MIN untouched:** Question minimums are Phase 6 scope; left exactly as written.
- **TASK_STATEMENTS as const tuple:** 30 ids ['1.1'..'5.6'] defined as a const array inside the describe block; a length===30 assertion and a per-flashcard valid-value assertion guard against typos.
- **Suite left RED intentionally:** The RED state proves the gates are real acceptance criteria before authoring begins — this is the TDD gate for Phase 5.

## Deviations from Plan

None — plan executed exactly as written.

The `grep -c "official-sample"` acceptance criterion in the plan expected 1, but the string appears twice (in the test name string and in the filter expression). Both occurrences are within the same untouched test block, confirming the question invariant is preserved. This is a pre-existing artifact of how the test was written, not a deviation.

## Verification Results

- `grep -c "taskRef?: string" src/data/types.ts` → 1
- `grep -c "back: string" src/data/types.ts` → 1
- `grep -c "interface Question" src/data/types.ts` → 1
- `npm run typecheck` → exit 0
- `grep -c "d1: 40" src/data/content.test.ts` → 1
- `grep -c "d5: 23" src/data/content.test.ts` → 1
- `grep -c "toBeGreaterThanOrEqual(150)" src/data/content.test.ts` → 1
- `grep -c "TASK_STATEMENTS" src/data/content.test.ts` → 5 (≥ 3 required)
- `grep -c "'5.6'" src/data/content.test.ts` → 1
- `npm test` → 7 tests FAIL (new flashcard count/coverage gates RED as expected), 186 pass

## Known Stubs

None — this plan only modifies type declarations and test files; no data stubs introduced.

## Threat Flags

None — type extension and test file changes introduce no new security surface.

## Self-Check: PASSED

- [x] src/data/types.ts modified and committed (9bbb69e)
- [x] src/data/content.test.ts modified and committed (46f4cd2)
- [x] typecheck passes
- [x] Suite is RED on the new flashcard gates (7 failures as expected)
- [x] Question/official-sample invariants untouched
- [x] questions.ts untouched
