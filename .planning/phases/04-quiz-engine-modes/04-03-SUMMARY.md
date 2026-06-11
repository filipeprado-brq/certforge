---
phase: 04-quiz-engine-modes
plan: "03"
subsystem: quiz-results-history
tags: [quiz, results, history, tdd, route-wiring, perDomain-shape-conversion]
dependency_graph:
  requires: [quiz-engine (04-01), quiz-ui-components (04-02)]
  provides: [quiz-results-screen, quiz-flow-container, history-screen, full-quiz-route]
  affects:
    - src/screens/QuizResults.tsx
    - src/screens/QuizResults.test.tsx
    - src/screens/QuizFlow.tsx
    - src/screens/HistoryScreen.tsx
    - src/screens/HistoryScreen.test.tsx
    - src/App.tsx
    - src/App.test.tsx
tech_stack:
  added: []
  patterns:
    - perDomain-shape-conversion (engine {correct,total,pct} → flat number for storage/DomainBars)
    - missed-question-rebuild (getQuestions lookup by id on history open; unknown ids skipped)
    - flat-pct-wrapping (stored flat pct re-wrapped into {correct:0,total:0,pct:value} for QuizResults path)
    - tdd-red-green (test before implementation on all new screens)
key_files:
  created:
    - src/screens/QuizResults.tsx
    - src/screens/QuizResults.test.tsx
    - src/screens/QuizFlow.tsx
    - src/screens/HistoryScreen.tsx
    - src/screens/HistoryScreen.test.tsx
  modified:
    - src/App.tsx
    - src/App.test.tsx
decisions:
  - QuizResults exports QuizResultView interface so both QuizFlow and HistoryScreen can build it without coupling to the runner
  - perDomain shape conversion done in both QuizFlow (at finish) and HistoryScreen (re-wrapping stored flat map into {pct} objects before passing to QuizResults)
  - HistoryScreen wraps stored flat perDomain as {correct:0,total:0,pct:value} so QuizResults' conversion loop works uniformly for both live and history paths
  - QuizFlow view state machine (select/run/results) with Retry reusing same config (no re-render of ModeSelect)
  - Placeholder and QuizBrowse imports removed from App.tsx to keep typecheck clean; files remain in repo
  - PassChip not re-exported from QuizResults (only needed in HistoryScreen via direct import from QuizParts)
metrics:
  duration: "~25 minutes"
  completed: "2026-06-11"
  tasks_completed: 3
  files_changed: 7
---

# Phase 4 Plan 03: QuizResults + QuizFlow + HistoryScreen Summary

**One-liner:** QuizResults screen (ScoreDial/% + DomainBars + missed review), QuizFlow state machine (select→run→results + addAttempt), and HistoryScreen (attempt list + content-rebuilt missed review) completing the full v1 quiz route and history.

## What Was Built

### src/screens/QuizResults.tsx (NEW — 148 lines)

Exports `QuizResultView` interface and `QuizResults` component:

- **Timed path:** `scaled != null` → `ScoreDial` + `PassChip`; no raw % headline.
- **Non-timed path:** raw `Math.round(correct/total*100)%` headline + "X of Y correct".
- **DomainBars:** shape conversion mandatory — iterates `Object.entries(grade.perDomain)` and builds `{ [d]: s.pct }` flat map before passing to `DomainBars` (never passes engine object shape directly).
- **Missed review:** for each `grade.missed` question, renders DomainBadge + stem + user's answer (`result.answers[q.id]`) or "Unanswered (time ran out)" if null, + correct option, + `.explanation` panel (whyCorrect + whyOthers).
- **Actions:** "Back to home" / "← Back to history" (isHistory flag), "Retry this mode" (conditional, only when `onRetry` provided).

### src/screens/QuizResults.test.tsx (NEW — 18 tests)

TDD RED/GREEN:
- Timed: ScoreDial renders score; PassChip shows Pass/Fail; no raw % headline
- Non-timed: percentage headline; X of Y text; no ScoreDial
- DomainBars: section present; % correct per domain row
- Missed review: stem, user answer label, correct answer label, explanation
- Unanswered null → "Unanswered (time ran out)"
- Action buttons: Back to home, Retry conditional, Back to history with isHistory

### src/screens/QuizFlow.tsx (NEW — 109 lines)

Stateful Quiz route container:
- State machine: `view: 'select' | 'run' | 'results'`, `config: QuizConfig | null`, `lastResult: QuizResultView | null`.
- `onFinish`: converts `grade.perDomain[d].pct` → flat `Record<DomainId,number>`, computes `scaledScore`/`isPass` for timed mode, builds `QuizResultView`, builds `QuizAttempt` (id via `crypto.randomUUID` with fallback), calls `addAttempt` exactly once, transitions to results.
- Retry: `view = 'run'` with same config (no ModeSelect re-render).
- Home: `view = 'select'`, clears `lastResult`.

### src/screens/HistoryScreen.tsx (NEW — 130 lines)

Attempt list with content-rebuild on open:
- Empty history → `EmptyState` "No attempts yet".
- Non-empty → `.attempt-row` buttons per attempt (date, mode, `scaled/1000` or `correct/total·pct%`, `PassChip` for timed / "Practice" for non-timed).
- Open attempt: rebuilds missed `Question[]` from `getQuestions()` via `find(q => q.id === m.questionId)` — unknown ids skipped (no crash). Wraps stored flat `perDomain` back into `{correct:0,total:0,pct:value}` objects so `QuizResults` conversion path works uniformly. Passes `isHistory` flag.

### src/screens/HistoryScreen.test.tsx (NEW — 15 tests)

TDD RED/GREEN:
- Empty: EmptyState, Quiz history heading, no "Coming soon"
- List: attempt rows with date/mode/score/Practice label/PassChip
- Open: click row → Back to history button visible; review section with "Review missed questions" header
- Back from review → returns to list
- Unknown questionId: no throw, no review section

### src/App.tsx (MODIFIED)

- Replaced `QuizBrowse` with `QuizFlow` for `route === 'quiz'`
- Replaced `Placeholder title="History"` with `HistoryScreen` for `route === 'history'`
- Removed `QuizBrowse` and `Placeholder` imports (both files remain in repo, just not routed to)

### src/App.test.tsx (MODIFIED)

- Quiz nav test: renamed intent to ModeSelect; replaced `getByText('Question bank')` with `getByRole('heading', { name: /Choose a mode/i })`; "Coming soon" still asserted absent
- Added History nav test: clicks History tab, asserts `getByRole('heading', { name: /Quiz history/i })` present, "Coming soon" absent

## Task Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 RED | Failing tests for QuizResults screen | 91dd5b9 |
| Task 1 GREEN | QuizResults implementation | 24b9ede |
| Task 2 RED | Failing tests for HistoryScreen | 85b9be8 |
| Task 2 GREEN | QuizFlow + HistoryScreen implementation | 865f309 |
| Task 3 | App.tsx route wiring + App.test updates | 0034fff |

## Acceptance Criteria Verification

| Criterion | Result |
|-----------|--------|
| `grep -c 'export function QuizResults' QuizResults.tsx` === 1 | PASS (1) |
| `grep -c 'ScoreDial' QuizResults.tsx` >= 1 | PASS (3) |
| `grep -c 'DomainBars' QuizResults.tsx` >= 1 | PASS (3) |
| `grep -c 'scaled' QuizResults.tsx` >= 1 | PASS (4) |
| `grep -c '\.pct' QuizResults.tsx` >= 1 | PASS (1) |
| `grep -c 'missed' QuizResults.tsx` >= 1 | PASS (6) |
| Component test: timed renders ScoreDial + Pass/Fail | PASS |
| Component test: non-timed renders % headline | PASS |
| Component test: missed stem renders | PASS |
| `npm run typecheck` (perDomain shape not crossed) | PASS |
| `grep -c 'export function QuizFlow' QuizFlow.tsx` === 1 | PASS (1) |
| `grep -c 'addAttempt' QuizFlow.tsx` >= 1 | PASS (3) |
| `grep -cE 'scaledScore\|isPass' QuizFlow.tsx` >= 1 | PASS (3) |
| `grep -c '\.pct' QuizFlow.tsx` >= 1 | PASS (1) |
| `grep -c 'export function HistoryScreen' HistoryScreen.tsx` === 1 | PASS (1) |
| `grep -c 'getQuestions' HistoryScreen.tsx` >= 1 | PASS (2) |
| `grep -c 'EmptyState' HistoryScreen.tsx` >= 1 | PASS (2) |
| `grep -c 'Coming soon' HistoryScreen.tsx` === 0 | PASS (0) |
| `grep -c 'attempt-row' HistoryScreen.tsx` >= 1 | PASS (1) |
| Component test: HistoryScreen empty → EmptyState, no "Coming soon" | PASS |
| Component test: real questionId in missed → non-empty review | PASS |
| Component test: unknown questionId → no throw, no review | PASS |
| `grep -c 'QuizFlow' App.tsx` >= 1 | PASS (2) |
| `grep -c 'HistoryScreen' App.tsx` >= 1 | PASS (2) |
| `grep -c "route === 'quiz'" App.tsx` === 1 → QuizFlow | PASS (1) |
| `grep -c 'Question bank' App.test.tsx` === 0 | PASS (0) |
| `grep -c 'Coming soon' App.test.tsx` >= 1 (asserted absent) | PASS (3) |
| `grep -c 'Choose a mode' App.test.tsx` >= 1 | PASS (1) |
| `grep -c 'Quiz history' App.test.tsx` >= 1 | PASS (1) |
| `npm test` full suite (190 tests) | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `grep -nE 'Math\.random\|Date\.now' src/lib/quiz.ts` = 0 | PASS (engine purity preserved) |

## Deviations from Plan

### Minor — Test assertion adjusted for history open

**Found during:** Task 2 test run
**Issue:** The test checking "opens QuizResults review" initially asserted `getByText(/Quiz history/i)` after clicking a row — but QuizResults in `isHistory` mode does not re-show the "Quiz history" heading (it shows the results view). The "Quiz history" heading lives in the list view, not the detail view.
**Fix:** Changed assertion to `getByRole('button', { name: /Back to history/i })` which is the unambiguous marker that QuizResults is rendered in history mode. All other test assertions remain unchanged.
**Rule applied:** Rule 1 (bug in test expectation — test was testing the wrong element).

## Known Stubs

None — all screens render real data. QuizResults consumes actual grade/questions/answers from the runner. HistoryScreen reads real localStorage via `useStoredState`. Missed question rebuild uses the real `getQuestions()` content layer.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| T-04-05 (mitigated) | src/screens/HistoryScreen.tsx | Values from quizHistory rendered as text only (no innerHTML); unknown questionIds skipped gracefully; stored flat perDomain values rendered via DomainBars number path only |

No new trust boundaries introduced beyond what is declared in the plan's threat model.

## Self-Check: PASSED

- src/screens/QuizResults.tsx: FOUND
- src/screens/QuizResults.test.tsx: FOUND
- src/screens/QuizFlow.tsx: FOUND
- src/screens/HistoryScreen.tsx: FOUND
- src/screens/HistoryScreen.test.tsx: FOUND
- src/App.tsx: FOUND (QuizFlow + HistoryScreen routes)
- src/App.test.tsx: FOUND (Choose a mode + Quiz history assertions)
- Commits 91dd5b9, 24b9ede, 85b9be8, 865f309, 0034fff: all present in git log
- 190 tests passing, typecheck exit 0, build exit 0
