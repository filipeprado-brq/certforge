---
phase: 06-question-bank-expansion
plan: "01"
subsystem: testing
tags: [typescript, vitest, tdd, content, questions]

# Dependency graph
requires:
  - phase: 05-flashcard-bank-expansion
    provides: "Flashcard bank expanded to >=150 cards; content.test.ts Phase 5 gates green"
provides:
  - "hasSnippet?: boolean optional field on Question interface in types.ts (EXP-05)"
  - "Phase 6 RED-gate test suite in content.test.ts: >=120 total, per-domain minimums {d1:32,d2:22,d3:24,d4:24,d5:18}, per-scenario >=8, snippet >=15"
affects: [06-02, 06-03, 06-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD RED-gate pattern: raise acceptance bar in tests first, drive GREEN via authoring plans"
    - "SCENARIOS const imported into test suite for forEach-driven per-scenario gate"

key-files:
  created: []
  modified:
    - src/data/types.ts
    - src/data/content.test.ts

key-decisions:
  - "hasSnippet?: boolean is OPTIONAL so all 40 existing questions remain valid without any edits"
  - "RED gate is intentional: 12 new question tests fail against current 40-question bank; authoring plans 06-02/03/04 drive them GREEN"
  - "Multi-Agent Research System scenario already has >=8 tagged questions (passes RED); 5 other scenarios need authoring"

patterns-established:
  - "Phase 6 RED-gate shape mirrors Phase 5 (05-01): write acceptance tests first, author content in subsequent plans"

requirements-completed: [EXP-05, EXP-07]

# Metrics
duration: 2min
completed: 2026-06-11
---

# Phase 6 Plan 01: Question Bank Expansion — TDD Gate Setup Summary

**Optional `hasSnippet?: boolean` added to Question type; content.test.ts raised to Phase 6 acceptance bar (>=120 total, {d1:32,d2:22,d3:24,d4:24,d5:18} per-domain, 6 scenarios >=8 each, >=15 snippets) — all 12 new question gates RED against current 40-question bank**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-11T16:29:32Z
- **Completed:** 2026-06-11T16:30:50Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Extended `Question` interface with `hasSnippet?: boolean` (optional, no breaking changes to existing 40 questions)
- Raised question bank acceptance bar in content.test.ts: total >=120, per-domain {d1:32, d2:22, d3:24, d4:24, d5:18}
- Added 6-scenario gate (EXP-04): iterates `SCENARIOS` const, each scenario requires >=8 tagged questions
- Added snippet gate (EXP-05): at least 15 questions with `hasSnippet === true`
- All Phase 5 flashcard gates (>=150, per-domain FC_MIN, 30 TASK_STATEMENTS coverage) remain green
- All invariants (official-sample===12, 4-option shape, unique ids, no-fetch CONT-06) preserved and green
- Suite is RED on exactly the 12 new question gates — ready for authoring plans 06-02/03/04

## Task Commits

Each task was committed atomically:

1. **Task 1: Add optional hasSnippet field to the Question type** - `dd7ab97` (feat)
2. **Task 2: Raise question count/coverage/snippet gates in content.test.ts (RED)** - `57fb72e` (test)

**Plan metadata:** (pending final commit)

_Note: TDD tasks have separate test (RED) and feat (GREEN) commits; GREEN comes in 06-02/03/04._

## Files Created/Modified
- `src/data/types.ts` - Added `hasSnippet?: boolean` after `source?: Source` in Question interface
- `src/data/content.test.ts` - Updated Q_MIN, raised question total gate, updated per-domain test titles, imported SCENARIOS, added scenario coverage (EXP-04) describe block, added snippet coverage (EXP-05) describe block

## Decisions Made
- `hasSnippet?: boolean` is optional so existing questions need no edits — new field set only by new snippet questions in 06-02/03/04
- Placed scenario/snippet describe blocks after `getQuestions filtering` and before `getFlashcards filtering` for logical grouping
- Multi-Agent Research System already satisfies >=8 (8 current questions pass gate); that scenario test passes RED intentionally

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - typecheck passes, tests run cleanly with exactly 12 RED failures and 189 GREEN passes.

## Test Status After This Plan

| Gate | Tests | Status |
|------|-------|--------|
| New question total >=120 | 1 | RED (expected) |
| New per-domain question mins | 5 | RED (expected) |
| New scenario coverage >=8 | 5 of 6 | RED (expected; Multi-Agent already passes) |
| New snippet coverage >=15 | 1 | RED (expected) |
| Phase 5 flashcard gates | all | GREEN |
| All invariant tests | all | GREEN |
| All other tests (storage, srs, quiz, ui) | all | GREEN |

**Total: 12 RED (new question gates, intentional), 189 GREEN**

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 06-02, 06-03, 06-04 will author new questions (q29–q114) to drive these RED gates GREEN
- The `hasSnippet: true` field is ready for use in new questions authored in 06-02/03/04
- All Phase 5 work remains stable and unaffected

---
*Phase: 06-question-bank-expansion*
*Completed: 2026-06-11*

## Self-Check: PASSED

- src/data/types.ts: FOUND
- src/data/content.test.ts: FOUND
- .planning/phases/06-question-bank-expansion/06-01-SUMMARY.md: FOUND
- Commit dd7ab97 (feat: hasSnippet field): FOUND
- Commit 57fb72e (test: RED gate): FOUND
