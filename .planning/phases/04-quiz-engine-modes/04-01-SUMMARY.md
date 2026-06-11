---
phase: 04-quiz-engine-modes
plan: "01"
subsystem: quiz-engine
tags: [quiz, engine, tdd, persistence, pure-functions]
dependency_graph:
  requires: []
  provides: [quiz-engine, quiz-history-persistence]
  affects: [src/lib/quiz.ts, src/lib/storage.ts, src/lib/useStoredState.ts]
tech_stack:
  added: []
  patterns: [now-injection, rng-injection, additive-persistence, tdd-red-green]
key_files:
  created:
    - src/lib/quiz.ts
    - src/lib/quiz.test.ts
  modified:
    - src/lib/storage.ts
    - src/lib/storage.test.ts
    - src/lib/useStoredState.ts
decisions:
  - Pure quiz engine with injected rng and nowMs — mirrors srs.ts now-injection pattern; no Math.random/Date.now inside quiz.ts
  - scaledScore uses Math.round(100 + ratio*900) with total=0 guard; PASS_MARK=720
  - gradeAttempt: unanswered/null answers treated as wrong (not skipped); missed list in question order
  - selectQuestions 'free' mode clamps n to FREE_MIN(5)..FREE_MAX(15), default 10; 'timed' fixed at 10 ignoring opts.n
  - selectQuestions 'scenario' mode: Fisher-Yates shuffle of scenario list, take 4, group questions by scenario
  - quizHistory added additively to PersistedState (schemaVersion stays 1); DEFAULT_STATE spread ensures [] on first read
  - addAttempt prepends to quizHistory (most-recent-first); resetAll also clears quizHistory
  - QuizAttempt.perDomain is a flat pct map (Record<DomainId, number>) distinct from GradeResult.perDomain — UI converts shapes
metrics:
  duration: "~35 minutes"
  completed: "2026-06-11"
  tasks_completed: 3
  files_changed: 5
---

# Phase 4 Plan 01: Pure Quiz Engine + quizHistory Persistence Summary

**One-liner:** Pure TDD quiz engine with injected rng/nowMs (scaledScore, gradeAttempt, selectQuestions, timer) plus additive quizHistory persistence in localStorage.

## What Was Built

### src/lib/quiz.ts (NEW — 194 lines)

Pure quiz engine with all randomness and clock reads injected by callers:

- `scaledScore(correct, total)` — maps raw ratio to 100–1000 band: `Math.round(100 + ratio*900)`, guards `total=0` as ratio=0.
- `isPass(scaled)` — gates at `PASS_MARK=720`.
- `gradeAttempt(questions, answers)` — counts correct, builds `perDomain {correct,total,pct}`, collects `missed[]` in question order; unanswered/null = wrong.
- `remainingSeconds(startedAtMs, durationSec, nowMs)` — clamped to zero.
- `isExpired(startedAtMs, durationSec, nowMs)` — delegates to `remainingSeconds`.
- `selectQuestions(mode, opts, pool, rng)` — four modes: scenario (4-of-6, grouped), domain (filter), timed (fixed 10), free (clamp 5–15, default 10).
- `shuffle<T>(arr, rng)` — Fisher-Yates, pure, no mutation.
- Purity gate verified: `grep -E 'Math\.random|Date\.now' quiz.ts` = 0 matches.

### src/lib/quiz.test.ts (NEW — 330 lines)

Unit tests covering every acceptance hook from 04-CONTEXT `<specifics>`:

- `scaledScore(7,10)===730`, `scaledScore(0,0)===100`, `isPass(720)===true`, `isPass(719)===false`
- `gradeAttempt`: null/missing answers = wrong, perDomain pct, missed order, empty missed on 100%
- `remainingSeconds(S,600,S+60000)===540`, clamp to 0 on overtime
- `isExpired(S,600,S+600000)===true`, `isExpired(S,600,S+599000)===false`
- `selectQuestions`: 4 distinct scenarios grouped; all d2 for domain mode; exactly 10 for timed; free clamps (100→15, 1→5, undefined→10, 7→7); determinism via seeded rng

### src/lib/storage.ts (MODIFIED)

- Added `QuizAttempt` interface (id, date, mode, modeKey, correct, total, scaled, pass, perDomain, missed).
- Extended `PersistedState` with `quizHistory: QuizAttempt[]`.
- Added `quizHistory: []` to `DEFAULT_STATE` — backward compatible (old state without quizHistory reads as [] via spread).
- `schemaVersion` stays 1 (additive change).

### src/lib/storage.test.ts (MODIFIED)

- Fixed existing `writeState({...})` calls to include `quizHistory: []` (same 03-01 trap as srs field).
- Added 6 new tests: fresh read=[], schemaVersion=1, round-trip, prepend order, clearAll clears, backward compat with old stored state missing quizHistory.

### src/lib/useStoredState.ts (MODIFIED)

- Added `quizHistory` in-memory state (initialised from `readState().quizHistory`).
- Added `addAttempt(attempt)`: prepends attempt, persists via patchState, updates in-memory state.
- `resetAll()` now also resets `quizHistory` state to `[]`.
- Exported `quizHistory` and `addAttempt` from hook return type and object.

## Task Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 RED | Failing tests for scaledScore/isPass/gradeAttempt/timer | 8d0a2a5 |
| Task 1 GREEN | Implement pure quiz scoring/grading/timer | 5d58516 |
| Task 2 RED | Failing tests for selectQuestions (all modes + free clamp) | 064e829 |
| Task 2 GREEN | selectQuestions implemented in same feat commit (Task 1 GREEN) | — |
| Task 3 | Additive quizHistory persistence (storage + useStoredState) | f67cdd8 |

**Note on Task 2 TDD gate:** `selectQuestions` was implemented in the Task 1 GREEN commit (included as a natural part of the full engine). The Task 2 RED tests (064e829) were written and committed before verifying they passed — they do pass immediately because the code already exists. This is a minor TDD gate deviation: RED and GREEN were not strictly separated for selectQuestions. The tests are comprehensive and all pass.

## Acceptance Criteria Verification

| Criterion | Result |
|-----------|--------|
| `scaledScore(7,10)===730`, `isPass(720)===true` | PASS |
| `gradeAttempt` unanswered=wrong, perDomain pct, missed | PASS |
| `selectQuestions('scenario')` → 4 distinct scenarios, grouped | PASS |
| `selectQuestions('domain',{domain:'d2'})` → only d2 | PASS |
| `selectQuestions('timed')` → 10 | PASS |
| `selectQuestions('free',{n:7})` → 7; n:100→15; n:1→5; n:undef→10 | PASS |
| `remainingSeconds(S,600,S+60000)===540` | PASS |
| `isExpired(S,600,S+600000)===true` | PASS |
| `grep -E 'Math\.random\|Date\.now' quiz.ts` = 0 | PASS |
| `grep -c 'quizHistory' storage.ts` >= 3 | PASS (3) |
| `grep -c 'QuizAttempt' storage.ts` >= 2 | PASS (3) |
| `grep -c 'addAttempt' useStoredState.ts` >= 2 | PASS (4) |
| `SCHEMA_VERSION = 1` unchanged | PASS |
| `npm test` (130 tests) | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |

## Deviations from Plan

### Minor — TDD Gate Overlap (Task 1 GREEN includes selectQuestions)

**Found during:** Task 2 RED phase
**Issue:** `selectQuestions` was included in the Task 1 GREEN implementation commit (`5d58516`) since it was a natural part of the full engine module. When Task 2 RED tests were written, they passed immediately rather than failing first.
**Impact:** None to production quality — all tests pass, code is correct and pure.
**Resolution:** Committed RED tests anyway (064e829) to document the test-first intent; GREEN was already satisfied.

## Known Stubs

None — all engine functions return real computed values from real data.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries beyond what is declared in the plan's threat model. T-04-01 mitigation is in place (DEFAULT_STATE spread yields `[]` for corrupt/absent history).

## Self-Check: PASSED

- src/lib/quiz.ts: FOUND
- src/lib/quiz.test.ts: FOUND
- src/lib/storage.ts: FOUND (quizHistory)
- src/lib/useStoredState.ts: FOUND (addAttempt)
- Commits 8d0a2a5, 5d58516, 064e829, f67cdd8: all present in git log
- 130 tests passing, typecheck exit 0, build exit 0
