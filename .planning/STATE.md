---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Plan 02-03 complete — FlashcardsBrowse + QuizBrowse wired into routing, placeholders replaced
last_updated: "2026-06-10T23:10:28.665Z"
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 7
  completed_plans: 6
  percent: 86
---

# Project State: Claude Architect Exam Trainer

## Project Reference

**Core value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.
**Tech stack:** React + Vite + TypeScript, localStorage persistence, static build.
**Mode:** mvp (vertical slices)
**Current focus:** Phase 03 — flashcards-spaced-repetition

## Current Position

Phase: 03 (flashcards-spaced-repetition) — EXECUTING
Plan: 1 of 2
**Phase:** 2 of 4 — Exam Content
**Plan:** 02-03 complete; all Phase 2 plans done
**Status:** Executing Phase 03
**Progress:** [█████████░] 86%

## Performance Metrics

- Phases complete: 0/4 (Phase 01 plans all done; phase-level complete after verifier)
- Plans complete: 6 (01-01, 01-02, 02-01, 02-02, 02-03, 03-01)
- Requirements delivered: 13/23 (APP-02, APP-03, APP-04, APP-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, FLASH-02, FLASH-03, FLASH-05)

## Accumulated Context

### Decisions

- Static offline web app, no backend — localStorage suffices for v1
- React + Vite + TypeScript for clean state handling across SRS + quiz modes
- Content authored from official guide and embedded (typed/structured) — no cold start
- Leitner/SRS for flashcard scheduling
- Card/question volume tracks domain weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
- The guide's 12 sample questions ship verbatim in the bank, tagged by scenario/domain
- tsconfig.json uses project references (tsconfig.app.json + tsconfig.node.json) with composite:true for tsc -b build mode
- vite.config.ts uses /// <reference types="vitest" /> to support vitest test block under tsc -b
- BRQ design CSS ported verbatim — only font and asset URLs updated to /brq/* (Vite public root)
- cae-trainer:v1 localStorage namespace with schemaVersion validation + try/catch (T-01-01/T-01-02 mitigations)
- App exports named function App() for direct import in tests without default-export gymnastics
- useResolvedTheme tracks matchMedia prefers-color-scheme with change listener for live system theme updates
- Dashboard renders fresh/new-user state only (—/0% placeholders); Phase 2 wires real content counts
- Typed content layer embedded as TS modules — no fetch/XHR (CONT-06) — types in src/data/types.ts, selectors in src/data/content.ts
- @types/node added as devDependency to support node:fs/url/path in content.test.ts (CONT-06 grep gate)
- content.test.ts uses fileURLToPath with process.cwd() fallback for jsdom URL compatibility
- Card/question volume now meets per-domain minimums tracking exam weights: D1 13fc/11q, D2 9fc/7q, D3 10fc/8q, D4 10fc/8q, D5 8fc/6q (50 total flashcards, 40 total questions)
- FlashcardsBrowse and QuizBrowse are read-only catalogs built from the typed content layer; SRS/quiz-engine interaction deferred to Phases 3/4
- TDD applied to App routing task: RED commit (failing tests) then GREEN commit (App.tsx wired)
- Leitner intervals [0,1,3,7,16] for boxes 1..5; Again→box1 due-today; Good→box+1(cap5) spaced out (FLASH-02)
- Due-queue ordering locked: seen-due first (by dueAt ascending), unseen treated as +Infinity (last); test-guarded
- learned = box >= 3 (spaced at least twice); srs field added additively to PersistedState with default {}; schemaVersion stays 1 (FLASH-03)
- Now-injection pattern: scheduler functions (srs.ts, deckStats.ts) take `now: number`; no Date.now() inside pure logic

### Phase boundaries

- Phase 2 (Content) unblocks both Phase 3 (Flashcards) and Phase 4 (Quiz) — they can proceed in either order once content exists
- Content authoring is its own phase, not folded into feature phases, so the dataset is a verifiable deliverable

### Todos

- (none yet)

### Blockers

- (none)

## Session Continuity

**Last action:** Completed plan 03-01 (pure Leitner scheduler srs.ts + per-domain stats deckStats.ts + SRS persistence in storage.ts/useStoredState.ts; 78 tests pass; typecheck + build exit 0).
**Stopped at:** Plan 03-01 complete — SRS core implemented; 03-02 (UI study loop) is next
**Next step:** Phase 03 Plan 02 — Study session UI (DeckOverview + StudySession screens)

---
*Last updated: 2026-06-10 after plan 03-01 execution*
