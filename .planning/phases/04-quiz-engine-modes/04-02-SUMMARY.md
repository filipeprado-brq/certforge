---
phase: 04-quiz-engine-modes
plan: "02"
subsystem: quiz-ui
tags: [quiz, ui, components, tdd, mode-select, runner, presentational]
dependency_graph:
  requires: [quiz-engine (04-01)]
  provides: [quiz-ui-components, mode-select-screen, quiz-runner-screen]
  affects:
    - src/components/QuizParts.tsx
    - src/data/quizModes.ts
    - src/screens/ModeSelect.tsx
    - src/screens/QuizRunner.tsx
    - src/screens/QuizRunner.test.tsx
    - src/components/QuizParts.test.tsx
tech_stack:
  added: []
  patterns:
    - rng-injection-at-ui-boundary (Math.random passed into selectQuestions from UI)
    - now-injection-at-ui-boundary (Date.now() fed into remainingSeconds/isExpired via nowMs state)
    - single-fire-ref-guard (finishedRef prevents double-finish on auto-submit)
    - presentational-component-port (design/components.jsx → TSX)
key_files:
  created:
    - src/components/QuizParts.tsx
    - src/components/QuizParts.test.tsx
    - src/data/quizModes.ts
    - src/screens/ModeSelect.tsx
    - src/screens/QuizRunner.tsx
    - src/screens/QuizRunner.test.tsx
  modified: []
decisions:
  - QuizConfig interface exported from ModeSelect.tsx — QuizRunner imports it from there (single source of truth)
  - Answers keyed by questionId (not array index) — aligns with gradeAttempt interface from quiz.ts
  - Math.random injected into selectQuestions exactly once in QuizRunner useMemo — engine stays pure
  - Timed countdown uses useEffect interval setting nowMs=Date.now() state; pure remainingSeconds/isExpired compute display
  - finishedRef guard ensures onFinish fires exactly once whether via Next button or timer expiry
  - QUIZ_MODES timed meta changed from design's '5 min' to '10 min · 10 questions · scored 100–1000' (real 600s)
  - DomainBars receives Partial<Record<DomainId, number>> (flat pct map) matching QuizAttempt.perDomain shape
metrics:
  duration: "~40 minutes"
  completed: "2026-06-11"
  tasks_completed: 3
  files_changed: 6
---

# Phase 4 Plan 02: Quiz UI Components — ModeSelect + QuizRunner Summary

**One-liner:** Ported BRQ quiz presentational components (ScoreDial/DomainBars/PassChip/Timer) to TSX and built ModeSelect (4 mode cards + per-mode config) and QuizRunner (non-timed reveal + timed defer/countdown/auto-submit) on top of the Plan 04-01 pure engine.

## What Was Built

### src/components/QuizParts.tsx (NEW — 152 lines)

Four presentational components ported verbatim from design/components.jsx:

- `PassChip({ pass })` — renders Pass/Fail with correct icon (IconCheck/IconX) and CSS class `pass-chip--pass/fail`.
- `Timer({ secondsLeft, totalSeconds })` — `MM:SS` countdown, adds class `low` when `secondsLeft <= totalSeconds * 0.2`, has `role="timer"`.
- `ScoreDial({ score, pass })` — 240° SVG arc, 720 pass-mark tick line (`passDeg = a0 + ((720-100)/900)*(a1-a0)`), score number, "of 1000 · pass ≥ 720", PassChip; `role="img"` on svg.
- `DomainBars({ perDomain })` — filters DOMAINS to those present in perDomain, renders `.bar-chart-row` per domain with ProgressBar and `N% correct`.

### src/components/QuizParts.test.tsx (NEW — 13 tests)

TDD RED then GREEN:
- PassChip: Pass/Fail text and correct CSS class
- Timer: `01:05` formatting; low class at/below 20% threshold; no-low above 20%
- ScoreDial: score number, "of 1000 · pass ≥ 720", PassChip present, `role="img"` on svg
- DomainBars: `N% correct` per row; absent domains omitted; correct row count

### src/data/quizModes.ts (NEW)

`QuizModeMeta` interface and `QUIZ_MODES` array of 4 modes:
- `scenario`, `domain`, `timed`, `free` with name/desc/meta strings.
- Timed meta corrected from design's demo "5 min" to `'10 min · 10 questions · scored 100–1000'`.

### src/screens/ModeSelect.tsx (NEW — 219 lines)

Exports `QuizConfig` interface (`{ mode, domain, n }`) and `ModeSelect` component:
- Page head: "Quiz · Exam-style questions" kicker, "Choose a mode" title.
- Grid of 4 mode cards (QUIZ_MODES), `aria-pressed` when active, animated border on selection.
- Per-mode config: domain → DOMAINS chip-row; free → [5,10,15] chip-row; timed → static info card (10min/10q/scaled/pass≥720/no-feedback note).
- Start button disabled until mode chosen; label "Start exam" (timed) vs "Start quiz" (other).

### src/screens/QuizRunner.tsx (NEW — 228 lines)

Exports `QuizRunner({ config, onFinish, onExit })`:

**Question selection:** `useMemo(() => selectQuestions(config.mode, {domain,n}, pool, Math.random), [])` — Math.random injected at UI boundary, engine stays pure.

**State:** `answers: Answers` (Record<questionId, number|null>), `revealed: boolean`, `idx`, `nowMs` (timed only).

**Non-timed UX:** select → lock → set `revealed=true` → mark `.correct`/`.incorrect`/`.dimmed` → reveal `.explanation` (whyCorrect + whyOthers) → Next button active.

**Timed UX:** select → record answer only (no reveal, no class changes) → Next advances; Timer shown in header; real countdown via `setInterval(() => setNowMs(Date.now()), 1000)` → `remainingSeconds(startedAt, 600, nowMs)` → `isExpired` → auto-finish via `finishedRef` guard.

**Scenario mode:** `.scenario-banner` rendered when `config.mode === 'scenario' && q.scenario`.

**Finish:** `gradeAttempt(questions, answers)` → `onFinish(grade, questions, answers)`.

### src/screens/QuizRunner.test.tsx (NEW — 13 tests)

TDD RED (tests written before implementation) then GREEN:
- Free mode: question renders; progress "Q 1 / N"; no explanation before answer; explanation appears after; `.correct` class on option; lock after reveal; dimmed options
- Timed mode: Timer component rendered; no `.explanation` after answer; no `.correct` class; no `.incorrect` class
- Scenario mode: `.scenario-banner` rendered
- Finish: `onFinish` called with grade/questions/answers after navigating through all 5 questions

## Task Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 | PassChip/Timer/ScoreDial/DomainBars + QuizParts tests + quizModes.ts | 464b21c |
| Task 2 | ModeSelect screen (4 modes + per-mode config) | c08a64b |
| Task 3 | QuizRunner (reveal/timed/scenario/countdown) + QuizRunner tests | 4b0805a |

## Acceptance Criteria Verification

| Criterion | Result |
|-----------|--------|
| `grep -c 'export function ScoreDial' QuizParts.tsx` === 1 | PASS (1) |
| `grep -c 'export function DomainBars' QuizParts.tsx` === 1 | PASS (1) |
| `grep -c 'export function PassChip' QuizParts.tsx` === 1 | PASS (1) |
| `grep -c 'export function Timer' QuizParts.tsx` === 1 | PASS (1) |
| `grep -c '720' QuizParts.tsx` >= 1 | PASS (5) |
| `grep -c "key: 'timed'" quizModes.ts` === 1 | PASS (1) |
| `grep -c '10 min' quizModes.ts` === 1 | PASS (2) |
| `grep -c 'export function ModeSelect' ModeSelect.tsx` === 1 | PASS (1) |
| `grep -c 'export interface QuizConfig' ModeSelect.tsx` === 1 | PASS (1) |
| `grep -c 'QUIZ_MODES' ModeSelect.tsx` >= 1 | PASS (2) |
| `grep -cE "mode === 'domain'\|mode === 'free'\|mode === 'timed'" ModeSelect.tsx` >= 3 | PASS (4) |
| `grep -c 'onStart(' ModeSelect.tsx` >= 1 | PASS (2) |
| `grep -c 'export function QuizRunner' QuizRunner.tsx` === 1 | PASS (1) |
| `grep -c 'selectQuestions' QuizRunner.tsx` >= 1 | PASS (2) |
| `grep -c 'gradeAttempt' QuizRunner.tsx` >= 1 | PASS (2) |
| `grep -c 'remainingSeconds' QuizRunner.tsx` >= 1 | PASS (2) |
| `grep -c 'Math.random' QuizRunner.tsx` === 1 | PASS (1) |
| `grep -c '600' QuizRunner.tsx` >= 1 | PASS (1) |
| `grep -E 'Math\.random\|Date\.now' quiz.ts` = 0 (engine purity) | PASS (0) |
| Component test: non-timed answer reveals explanation | PASS |
| Component test: timed answer renders NO explanation | PASS |
| Scenario mode renders .scenario-banner | PASS |
| `npm test` (156 tests, full suite) | PASS |
| `npm run typecheck` exits 0 | PASS |
| `npm run build` exits 0 | PASS |

## Deviations from Plan

None — plan executed exactly as written. The only noteworthy point: the test for `scenario-banner` in the test suite uses a mock question pool that includes scenario-tagged questions, ensuring the banner renders on the first question for scenario mode.

## Known Stubs

None — all components render real data from real sources. ModeSelect calls `onStart` with the user's actual selections; QuizRunner uses `getQuestions()` pool and real `selectQuestions`; Timer shows a live countdown.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. T-04-03 mitigation is in place: answers are keyed by questionId and options are bounded to rendered indices 0–3 (no eval/innerHTML). T-04-04 mitigation in place: single 1s interval cleared on unmount/expiry via `finishedRef` guard.

## Self-Check: PASSED

- src/components/QuizParts.tsx: FOUND
- src/components/QuizParts.test.tsx: FOUND
- src/data/quizModes.ts: FOUND
- src/screens/ModeSelect.tsx: FOUND
- src/screens/QuizRunner.tsx: FOUND
- src/screens/QuizRunner.test.tsx: FOUND
- Commits 464b21c, c08a64b, 4b0805a: all present in git log
- 156 tests passing, typecheck exit 0, build exit 0
