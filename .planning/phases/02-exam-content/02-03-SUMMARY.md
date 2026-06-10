---
phase: 02-exam-content
plan: "03"
subsystem: browse-views
tags: [browse, flashcards, quiz, routing, tdd]
dependency_graph:
  requires: ["02-01", "02-02"]
  provides: ["FlashcardsBrowse", "QuizBrowse", "App-routing-v2"]
  affects: ["03-srs", "04-quiz-engine"]
tech_stack:
  added: []
  patterns: ["filter-chip state via useState", "domain-badge + weight-chip per-domain summary", "read-only catalog with EmptyState fallback"]
key_files:
  created:
    - src/screens/FlashcardsBrowse.tsx
    - src/screens/QuizBrowse.tsx
  modified:
    - src/App.tsx
    - src/App.test.tsx
decisions:
  - "Read-only catalogs use no SRS or quiz-engine state — scope boundary enforced by reviewing acceptance criteria grep checks before commit"
  - "quiz-option correct class + Correct aria-label label combo satisfies the acceptance-criteria grep for visible correct-option marker"
  - "TDD cycle applied to Task 3: failing tests committed first (RED), then App.tsx wired to pass (GREEN)"
metrics:
  duration: "~3 minutes"
  completed: "2026-06-10"
  tasks_completed: 3
  files_changed: 4
---

# Phase 2 Plan 03: Browse Catalogs Summary

**One-liner:** Domain-filtered read-only FlashcardsBrowse and QuizBrowse catalogs wired into App routing, replacing Phase-1 placeholders, with per-domain WeightChip (% of exam) visible and 49 tests passing.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Build Flashcards browse catalog | 1fd0704 | src/screens/FlashcardsBrowse.tsx (created) |
| 2 | Build Quiz/questions browse catalog | 6228ac9 | src/screens/QuizBrowse.tsx (created) |
| 3 (RED) | Update App tests for browse routes | b07ae7b | src/App.test.tsx (updated) |
| 3 (GREEN) | Wire routes + assert placeholders replaced | 437d1aa | src/App.tsx (updated) |

## What Was Built

### FlashcardsBrowse (`src/screens/FlashcardsBrowse.tsx`)
- Page head with kicker "Flashcards · Browse" and title "Card deck"
- Domain filter chip row: "All" + 5 domain chips (active state tracked via useState)
- Per-domain summary card: DomainBadge + domain.name + WeightChip ("% of exam") + count — satisfies CONT-05
- Card list via `getFlashcards()` showing DomainBadge, front (heading) + back (body text) per card
- EmptyState rendered when filtered domain yields zero cards
- Zero SRS/flip/rate imports

### QuizBrowse (`src/screens/QuizBrowse.tsx`)
- Page head with kicker "Quiz · Browse" and title "Question bank"
- Two filter rows: domain (All + 5) and scenario (All scenarios + 6 SCENARIOS)
- Per-domain summary with DomainBadge + WeightChip + question count — satisfies CONT-05
- Question list via `getQuestions()` showing:
  - DomainBadge + scenario tag + "Official sample" indicator
  - Stem
  - 4 options labeled A–D with `quiz-option correct` class + "Correct" label on the correct answer
  - `.explanation` block with `.why` for whyCorrect and `.why` for whyOthers
- EmptyState for zero-match filter combos
- Zero quiz-engine (Timer/secondsLeft/computeResult/onFinish/scaled) imports

### App.tsx routing
- Imports FlashcardsBrowse and QuizBrowse
- `route === 'flashcards'` renders `<FlashcardsBrowse />`
- `route === 'quiz'` renders `<QuizBrowse />`
- History route keeps `<Placeholder title="History" />` for Phase 4

### App.test.tsx
- Renamed "switches to Flashcards placeholder" → "switches to Flashcards browse catalog when Flashcards nav tab is clicked"
- Updated assertion: "All" filter chip IS present; "Coming soon" is NOT (queryByText)
- Added Quiz-nav test: "Question bank" heading IS present; "Coming soon" is NOT
- History placeholder tests untouched

## TDD Gate Compliance

Task 3 followed the RED/GREEN/REFACTOR cycle:
- RED commit (`b07ae7b`): Updated test file with failing assertions before App.tsx was changed — 2 tests failed as expected
- GREEN commit (`437d1aa`): App.tsx wired to import + render FlashcardsBrowse/QuizBrowse — all 49 tests passed

## Verification Results

```
npm test:       49 passed (3 test files)
npm typecheck:  exit 0
npm build:      exit 0, 217 kB JS bundle
```

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. Both browse catalogs render real content from the typed data layer. No placeholder text or empty arrays flow to the UI.

## Threat Flags

No new security-relevant surface introduced. FlashcardsBrowse and QuizBrowse render all content as plain React children (JSX text) — no dangerouslySetInnerHTML, no user input, no localStorage writes. Threat T-02-04 (Tampering/XSS) mitigated by React's automatic escaping.

## Self-Check: PASSED
