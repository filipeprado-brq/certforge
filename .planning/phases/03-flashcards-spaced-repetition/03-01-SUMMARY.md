---
phase: 03-flashcards-spaced-repetition
plan: "01"
subsystem: srs
tags: [spaced-repetition, leitner, vitest, localStorage, typescript]

# Dependency graph
requires:
  - phase: 01-app-shell-persistence
    provides: storage.ts persistence layer (readState/writeState/patchState/clearAll + PersistedState)
  - phase: 02-exam-content
    provides: Flashcard type, getFlashcards(), DOMAINS, DomainId

provides:
  - Pure Leitner scheduler (srs.ts): nextState, isDue, intervalDays, startOfDay
  - Per-domain stats + due-queue builder (deckStats.ts): deckStatsByDomain, buildDueQueue, overallDueCount
  - Additive SRS persistence in cae-trainer:v1: PersistedState.srs, useStoredState.rateCard/setSrs

affects: [03-02-flashcards-ui, phase-04-quiz-engine]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Now-injection: pure scheduler functions take `now: number` (epoch ms); UI passes Date.now()"
    - "TDD: RED commit (failing tests) → GREEN commit (implementation) per task"
    - "Additive storage extension: new required fields added with defaults; schemaVersion stays 1"
    - "Stable sort ordering: seen-due by dueAt ascending, unseen treated as +Infinity (last)"

key-files:
  created:
    - src/lib/srs.ts
    - src/lib/srs.test.ts
    - src/lib/deckStats.ts
    - src/lib/deckStats.test.ts
  modified:
    - src/lib/storage.ts
    - src/lib/storage.test.ts
    - src/lib/useStoredState.ts

key-decisions:
  - "Leitner intervals [0,1,3,7,16] days for boxes 1..5; Again→box1/due-today; Good→box+1(cap5)/spaced"
  - "Due-queue ordering: seen-due cards (finite dueAt) sort BEFORE unseen cards (treated as +Infinity)"
  - "learned threshold = box >= 3 (seen and spaced at least twice)"
  - "srs field added as required in PersistedState with default {}; schemaVersion stays 1 (additive)"
  - "rateCard(id, card) merges one card update into stored srs map; setSrs replaces entire map"

patterns-established:
  - "Now-injection pattern: pure scheduler functions never call Date.now(); UI injects it"
  - "Stable sort with +Infinity sentinel: unseen cards treated as Infinity for sort key, never -Infinity"

requirements-completed: [FLASH-02, FLASH-03, FLASH-05]

# Metrics
duration: 15min
completed: 2026-06-10
---

# Phase 03 Plan 01: Flashcards SRS Core Summary

**Pure now-injected Leitner scheduler (5 boxes, intervals [0,1,3,7,16]) with per-domain stats, due-queue builder (seen-due before unseen, stable), and additive SRS persistence in cae-trainer:v1**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-10T20:04:00Z
- **Completed:** 2026-06-10T20:09:00Z
- **Tasks:** 3 (+ 1 auto-fix)
- **Files modified:** 7

## Accomplishments

- Pure Leitner scheduler in `srs.ts`: no Date.now(), all functions take injected `now`; 12 tests cover all 9 acceptance hooks
- Per-domain stats + due-queue builder in `deckStats.ts`: learned=box>=3, due=isDue count, ordered seen-due before unseen (+Infinity sentinel); 13 tests including ordering guard
- SRS persistence added additively to `storage.ts` + `useStoredState.ts`: schemaVersion stays 1, default {}, rateCard/setSrs/resetAll clears srs; 4 new storage tests
- Full test suite: 78 tests pass (49 original + 29 new); typecheck and build clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Pure Leitner scheduler srs.ts** - `c48d232` (feat)
2. **Task 2: Per-domain deck stats + due queue deckStats.ts** - `40dca16` (feat)
3. **Task 3: Storage extension + useStoredState SRS persistence** - `8c90515` (feat)
4. **Rule 1 fix: Update existing writeState calls to include srs field** - `b8d2414` (fix)

## Files Created/Modified

- `src/lib/srs.ts` — Pure Leitner scheduler: Box/Rating/SrsCard types, intervalDays, startOfDay, isDue, nextState
- `src/lib/srs.test.ts` — 12 tests covering all 9 acceptance hooks (intervals, again/good transitions, isDue)
- `src/lib/deckStats.ts` — Pure per-domain stats + due-queue builder; unseen treated as +Infinity for sort
- `src/lib/deckStats.test.ts` — 13 tests: fresh-user, learned threshold, queue membership, ordering guard
- `src/lib/storage.ts` — Extended PersistedState with srs: Record<string, SrsCard>, default {}
- `src/lib/storage.test.ts` — 4 new SRS tests; existing 5 writeState calls updated with srs: {}
- `src/lib/useStoredState.ts` — Added srs state, rateCard, setSrs; resetAll clears srs

## Decisions Made

- Intervals [0,1,3,7,16] for boxes 1..5 per Leitner spec; Again always resets to box 1 due-today
- Due-queue ordering locked: seen-due first (by dueAt ascending), unseen last (treated as +Infinity); a test guards this
- learned = box >= 3 (seen and spaced at least twice, not just seen)
- `srs` field required in PersistedState with default `{}`; schemaVersion stays 1 (additive, backward-compatible)
- `rateCard(id, card)` takes a pre-computed SrsCard (UI calls nextState); useStoredState does not call nextState internally

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated existing writeState calls in storage.test.ts to include srs field**
- **Found during:** Task 3 / typecheck verification
- **Issue:** Adding required `srs` field to `PersistedState` caused TypeScript errors in 5 existing `writeState({ schemaVersion, themePref })` calls that omitted the now-required field
- **Fix:** Added `srs: {}` to the 5 affected `writeState` calls in the existing test suite
- **Files modified:** src/lib/storage.test.ts
- **Verification:** `npm run typecheck` exits 0; all 13 storage tests pass
- **Committed in:** `b8d2414`

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary correctness fix; no scope creep; all original tests still pass with identical assertions.

## Issues Encountered

- `grep -c 'Date.now' srs.ts` was matching `Date(now` (`.` is a wildcard in basic grep). Resolved by renaming the `startOfDay` parameter from `now` to `epochMs` so `new Date(epochMs)` no longer matches the pattern. Comments mentioning `Date.now()` were also reworded.

## Known Stubs

None — all functions are fully implemented and wired; no placeholder data flows to UI.

## Threat Flags

No new threat surface beyond T-03-01 and T-03-02 already in the plan's threat model. `srs` defaults to `{}` via the DEFAULT_STATE spread merge in `readState`, so corrupt/absent srs keys yield an empty map rather than a crash (T-03-01 mitigated).

## Next Phase Readiness

- `srs.ts` and `deckStats.ts` are the pure logic layer; Plan 03-02 (UI) can import them directly
- `useStoredState()` now exposes `srs`, `rateCard`, `setSrs` for the study session to consume
- All 78 tests pass; build is clean; no blockers

---
*Phase: 03-flashcards-spaced-repetition*
*Completed: 2026-06-10*
