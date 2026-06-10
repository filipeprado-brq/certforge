---
phase: 03-flashcards-spaced-repetition
plan: "02"
subsystem: flashcards-ui
tags: [spaced-repetition, leitner, react, testing-library, vitest, localStorage, typescript]

# Dependency graph
requires:
  - phase: 03-01
    provides: srs.ts (nextState/isDue/intervalDays), deckStats.ts (deckStatsByDomain/buildDueQueue/overallDueCount), useStoredState (srs/rateCard/setSrs)
  - phase: 01-app-shell-persistence
    provides: storage layer, AppShell, BRQ components (DomainBadge, ProgressBar, Btn, EmptyState)
  - phase: 02-exam-content
    provides: getFlashcards(), DOMAINS, Flashcard type

provides:
  - Deck Overview (per-domain learned/due stats, domain filter, Start CTA)
  - Study Session (flip reveal, Again/Good rate→persist→advance, session progress, done state)
  - Real per-domain SRS progress on Dashboard (replacing static 0% placeholder)
  - Flashcards route wired to study loop

affects: [phase-04-quiz-engine]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "View-gated single screen: Deck Overview and Study Session share one component, gated by local `view` state"
    - "Queue captured at session start: buildDueQueue called once on enter; rating removes from THIS session even though new dueAt is future"
    - "Now-injection at UI boundary: Date.now() called in component, passed to pure modules"
    - "TDD GREEN-on-first-write: tests written in Task 2 passed immediately because component was implemented first in Task 1"

key-files:
  created:
    - src/screens/FlashcardsStudy.tsx
    - src/screens/FlashcardsStudy.test.tsx
  modified:
    - src/App.tsx
    - src/screens/Dashboard.tsx
    - src/App.test.tsx

key-decisions:
  - "FlashcardsStudy is a single component with deck/session view state — not a router change"
  - "Queue built once at session start and stored in local state; pos index advances through it"
  - "Done state triggers when pos >= sessionTotal; Study again rebuilds queue from current srs"
  - "Dashboard stat-num shows due count (falls back to total when nothing due); label changes accordingly"
  - "App test updated from 'All' chip assertion to 'Card decks' heading to match new Deck Overview"

# Metrics
duration: 20min
completed: 2026-06-10
---

# Phase 03 Plan 02: Flashcards Study Loop UI Summary

**Deck Overview + Study Session study loop consuming the Plan-01 Leitner scheduler: flip reveal via .flashcard.flipped, Again/Good → nextState → rateCard → advance, per-domain learned/due stats, real Dashboard mastery**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-06-10
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- `FlashcardsStudy.tsx` (292 lines): Deck Overview (per-domain stats via deckStatsByDomain, domain filter chips, Start CTA respecting due+domain+empty-state) + Study Session (due queue via buildDueQueue in locked seen-due-first order, .flashcard.flipped CSS flip reveal, Again/Good → nextState → rateCard → pos advance, session progress bar + remaining count, done state with doneCount + Back/Study again)
- `FlashcardsStudy.test.tsx`: 3 tests — Deck Overview renders "Card decks" + learned/due labels for fresh user; flip reveals back face (.flashcard.flipped); Good rating persists `{rating: 'good', box: 2}` to localStorage
- `App.tsx`: flashcards route renders `<FlashcardsStudy />` (replaced FlashcardsBrowse as lead view); Quiz + History routes unchanged
- `Dashboard.tsx`: real SRS-derived per-domain mastery via deckStatsByDomain; flashcard stat-num shows totalDue (or totalCards when 0 due); per-domain ProgressBar values and percent text computed from learned/total; `{d.due} due` indicator per row; no static `value={0}` or placeholder
- `App.test.tsx`: Flashcards-nav test updated to assert `heading: /Card decks/i` + "Coming soon" absent
- Full suite: 81 tests pass (78 prior + 3 new); typecheck clean; build emits dist/index.html

## Task Commits

1. **Task 1: FlashcardsStudy.tsx** - `11580b3` (feat)
2. **Task 2: App wiring + Dashboard + tests** - `1465717` (feat)

## Files Created/Modified

- `src/screens/FlashcardsStudy.tsx` — Deck Overview + Study Session (flip, rate, persist, advance, done state); 292 lines
- `src/screens/FlashcardsStudy.test.tsx` — 3 component tests: Deck Overview, flip reveal, Good rating persistence
- `src/App.tsx` — flashcards route → FlashcardsStudy; QuizBrowse + Placeholder History unchanged
- `src/screens/Dashboard.tsx` — real SRS-derived domain mastery (deckStatsByDomain + useStoredState); stat-num shows due count
- `src/App.test.tsx` — updated Flashcards-nav test to "Card decks" heading

## Decisions Made

- Single-component view-gated design (deck/session state) avoids router changes and keeps the study loop self-contained
- Queue captured once on `startSession()` so `pos` advances through a stable snapshot; re-entering "Study again" rebuilds from current srs
- `doneCount` tracks Good-rated cards per session; done state shows the number rated Good
- Dashboard falls back to total card count when `totalDue === 0` (fresh user who has never studied) to avoid showing "0 cards due"

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria verified with grep checks; all 81 tests pass; typecheck and build clean.

## Known Stubs

None — all data flows are live (deckStatsByDomain over real srs state, rateCard persists to localStorage). No placeholder values or hardcoded stats.

## Threat Flags

No new threat surface beyond T-03-03 and T-03-04 already in the plan's threat model.
- T-03-03 (Tampering): Rating buttons pass typed `'again' | 'good'` literals to `nextState`; the UI never writes box/dueAt directly — mitigated as planned.
- T-03-04 (Info Disclosure): All flashcard text is static embedded content rendered as JSX children (React auto-escapes); no dangerouslySetInnerHTML — accepted as planned.

## Self-Check: PASSED

Files verified:
- FOUND: src/screens/FlashcardsStudy.tsx
- FOUND: src/screens/FlashcardsStudy.test.tsx
- FOUND: src/App.tsx (modified)
- FOUND: src/screens/Dashboard.tsx (modified)
- FOUND: src/App.test.tsx (modified)

Commits verified:
- FOUND: 11580b3 feat(03-02): build FlashcardsStudy.tsx — Deck Overview + Study Session study loop
- FOUND: 1465717 feat(03-02): wire flashcards route + real SRS Dashboard + component tests
