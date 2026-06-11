# Phase 4: Quiz Engine & Modes - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning
**Source:** Orchestrator-defined quiz contract grounded in the exam guide + design handoff + existing code

<domain>
## Phase Boundary

The final v1 phase: a working **quiz engine** with four modes, per-question correctness +
explanation, scored results, and a persisted attempt history. Reuse the typed content layer
(`src/data/content.ts` selectors `getQuestions`, scenarios), the persistence layer
(`src/lib/storage.ts`, `useStoredState`), and the BRQ quiz components from the design
(`ScoreDial`, `DomainBars`, `PassChip`, `Timer`, quiz-option states, explanation panel, scenario
banner, attempt-row) — most CSS classes are already ported in `src/styles/app.css`.

In scope: a pure, testable scoring/grading/selection engine; the runner UI (answer → reveal →
next); the four modes; the results summary; persisted history + a history view. This completes the
roadmap (after this, all 23 v1 requirements are delivered).

Out of scope: editing content (v2 CMS), accounts/sync (v2), changing the flashcard SRS.

**Route change:** the Quiz route currently shows the Phase-2 `QuizBrowse` catalog. Phase 4 replaces
it with the real flow **ModeSelect → QuizRunner → QuizResults**. (Browsing questions is subsumed by
Domain Practice.) The History route (currently a placeholder) becomes the attempt-history view.
</domain>

<decisions>
## Implementation Decisions

### Pure quiz engine (testable, no Math.random / Date.now inside pure logic) — `src/lib/quiz.ts`
- **Scaled score (timed exam only):** `scaledScore(correct, total) = Math.round(100 + (correct/total) * 900)` → range 100–1000. `isPass(scaled) = scaled >= 720` (≈69% raw). Pure, unit-tested (e.g. 10/10→1000 pass, 7/10→730 pass, 6/10→640 fail, 0/0 guard→100).
- **Grading:** `gradeAttempt(questions, answers)` → `{ correct, total, perDomain: Record<DomainId,{correct,total,pct}>, missed: Question[] }`. `answers` maps questionId→selectedIndex (or null/unanswered = wrong). Pure.
- **Question selection:** `selectQuestions(mode, opts, pool, rng)` — takes an injected `rng: () => number` (or a pre-shuffled list) so selection is deterministic in tests. Never call `Math.random()` inside the pure module; the UI passes `Math.random` in. Rules per mode below.
- **Timer:** pure `remainingSeconds(startedAtMs, durationSec, nowMs)` and `isExpired(...)`; the UI ticks with a real interval and passes `Date.now()` in. No `Date.now()` inside pure logic.

### The four modes (QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05)
| Mode | key | Selection | Feedback timing | Scoring |
|------|-----|-----------|-----------------|---------|
| Scenario Simulation | `scenario` | Draw **4 of the 6** scenarios at random; include questions tagged to those scenarios, **grouped by scenario** (show a ScenarioBanner per group) | after each answer | raw correct/total + % |
| Domain Practice | `domain` | All questions for the **one chosen domain** | after each answer | raw correct/total + %, perDomain |
| Timed Full Exam | `timed` | **10 questions** drawn across domains (random; weight-proportional if practical) | **none until results** (exam conditions) | **scaled 100–1000 + pass/fail @720** |
| Free / Random | `free` | User picks **N (5–15)** random questions across all domains | after each answer | raw correct/total + % |
- Reuse the design's `QUIZ_MODES` copy (data.jsx) for mode names/descriptions/meta.
- Timed exam: a countdown **Timer** in the header (default **10 minutes / 600s** for 10 questions); on expiry, auto-submit and score what was answered (unanswered = wrong). The design's timer-speed tweak was a demo-only device — the real app uses a real clock.

### Per-question UX (QUIZ-01)
- Question stem (+ ScenarioBanner when in scenario mode), 4 options (A–D), single-select.
- Non-timed modes: on select → lock the question, mark **correct (verde)** / **chosen-wrong (error red)**, reveal the **explanation panel** (whyCorrect + whyOthers), show **Next**. Reuse `.quiz-option`/`.quiz-option.correct/.incorrect`, `.explanation`, `.state-label` classes already in app.css.
- Timed mode: on select → record answer, advance immediately, **no reveal** (feedback deferred to results).
- Progress indicator (e.g. "Q 4 / 10"); in timed mode also the Timer.

### Results summary (QUIZ-06)
- Big score: timed → **ScoreDial** (240° gauge, 720 pass-mark line) + **PassChip**; other modes → raw correct/total + %.
- **Per-domain breakdown** via `DomainBars` (% correct per domain present in the attempt).
- **Review of missed questions**: each shows stem, the user's answer, the correct answer, and the explanation.
- Actions: **Retry** (same mode/config) and **Back to Home**.
- Reuse design `ScoreDial`, `DomainBars`, `PassChip` (port from design/components.jsx).

### History (QUIZ-07) — persist + view
- Extend `PersistedState` additively with `quizHistory: QuizAttempt[]` (default `[]`, schemaVersion stays 1).
  `QuizAttempt = { id: string; date: string /*ISO or display*/; mode: string; modeKey: 'scenario'|'domain'|'timed'|'free'; correct: number; total: number; scaled?: number; pass?: boolean; perDomain: Record<DomainId, number /*pct*/>; missed?: Array<{questionId; selected: number|null}> }`.
- On finishing any quiz, prepend the attempt to `quizHistory` via patchState/useStoredState. Generating `id`/`date` happens in the UI layer (impure) — keep the engine pure.
- History route renders an attempt list (date, mode, score/scaled, **PassChip** for timed) using the design `attempt-row`/`HistoryScreen` layout; opening an attempt shows its QuizResults (review). Replace the History placeholder.
- Reset-all (Phase 1) already clears the namespace → clears history too; verify.

### Wiring & scope
- Quiz route: ModeSelect → (config: domain picker for domain mode; N-picker for free; duration/score note for timed) → QuizRunner → QuizResults. History route: HistoryScreen → attempt detail.
- **TEST-BREAKAGE TRAP (same as Phases 2 & 3):** the existing `src/App.test.tsx` has a Quiz-nav test asserting the Phase-2 `QuizBrowse` catalog, and a History test asserting the placeholder ("Coming soon"). Both MUST be updated: Quiz nav → asserts the ModeSelect screen; History nav → asserts the history view (no "Coming soon"). Keep the other tests intact.
- Reuse existing BRQ components/CSS; no new UI-SPEC. NO new content authoring (use the 40 questions from Phase 2). Engine stays pure/injected.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code (reuse — do not duplicate)
- `src/lib/storage.ts` — `PersistedState` (currently {schemaVersion, themePref, srs}); extend additively with `quizHistory`. `readState` merges DEFAULT_STATE so default `[]` is always present.
- `src/lib/useStoredState.ts` — persistence hook + resetAll.
- `src/data/content.ts` — `getQuestions({domain?, scenario?})`, scenario list; `src/data/domains.ts` — DOMAINS (weights). `src/data/scenarios.ts` — the 6 scenarios.
- `src/screens/QuizBrowse.tsx` — Phase-2 catalog (its quiz-option/explanation rendering is a useful reference for the runner; the route will switch away from it).
- `src/components/*` (DomainBadge, Btn, ProgressBar, EmptyState, ConfirmDialog, icons) + `src/styles/app.css` (`.quiz-option(.correct/.incorrect/.selected)`, `.explanation`, `.scenario-banner`, `.timer`, `.pass-chip`, `.bar-chart-row`, `.attempt-row`, `.stat-num`).
- `src/App.tsx`, `src/App.test.tsx` (update Quiz + History nav assertions).

### Design contract & layout/component reference (PORT to TSX)
- `.planning/phases/01-app-shell-persistence/01-UI-SPEC.md` — BRQ contract (covers all quiz screens; no new UI-SPEC).
- `design/components.jsx` — `ScoreDial` (240° gauge + 720 mark, lines 77–108), `DomainBars` (111–122), `PassChip` (55–60), `Timer` (62–74) — port these to TSX.
- `design/screens-quiz.jsx` — ModeSelect, QuizRunner, QuizResults reference layouts.
- `design/screens-home.jsx` — HistoryScreen + attempt-row reference.
- `design/data.jsx` — `QUIZ_MODES` copy (names/descriptions/meta) and the seeded `HISTORY` shape (for the QuizAttempt model — do NOT import the seeded data; fresh user starts with empty history).
</canonical_refs>

<specifics>
## Verifiable acceptance hooks (for plan/test design)

- `scaledScore(10,10)===1000`, `scaledScore(7,10)===730` (pass), `scaledScore(6,10)===640` (fail), `scaledScore(0,10)===100`; `isPass(720)===true`, `isPass(719)===false`.
- `gradeAttempt`: unanswered/null selection counts as wrong; `perDomain[d].pct` = round(correct/total*100); `missed` lists exactly the wrong/unanswered questions.
- `selectQuestions('scenario', …, pool, rng)` returns questions from exactly 4 distinct scenarios, grouped; `('domain', {domain:'d2'}, …)` returns only d2 questions; `('timed', …)` returns 10; `('free', {n:7}, …)` returns 7. Deterministic given a fixed `rng`.
- `remainingSeconds(start, 600, start+60_000)===540`; `isExpired(start,600,start+600_000)===true`.
- A finished attempt is prepended to `quizHistory` and round-trips through `cae-trainer:v1`; reset-all clears it.
- Timed-mode runner does not reveal correctness until results; non-timed reveals after each answer (component tests).
</specifics>

<deferred>
## Deferred Ideas
- Weighted/blueprint exam composition beyond simple random; question difficulty tiers → future.
- Content editing/import, accounts/sync → v2.
- Spaced-repetition changes → none (Phase 3 owns flashcards).
</deferred>

---

*Phase: 04-quiz-engine-modes*
*Context gathered: 2026-06-11 (orchestrator-defined quiz contract)*
