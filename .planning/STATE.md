---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Content Expansion
status: planning
last_updated: "2026-06-11T14:37:13.619Z"
last_activity: 2026-06-11
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State: Claude Architect Exam Trainer

## Project Reference

**Core value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.
**Tech stack:** React + Vite + TypeScript, localStorage persistence, static build.
**Mode:** mvp (vertical slices)
**Current focus:** Phase 04 — quiz-engine-modes

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-06-11 — Milestone v1.1 started

## Performance Metrics

- Phases complete: 0/4 (Phase 01 plans all done; phase-level complete after verifier)
- Plans complete: 10 (01-01, 01-02, 02-01, 02-02, 02-03, 03-01, 03-02, 04-01, 04-02, 04-03)
- Requirements delivered: 23/23 (APP-02, APP-03, APP-04, APP-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, FLASH-01, FLASH-02, FLASH-03, FLASH-04, FLASH-05, QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07)

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
- FlashcardsStudy uses single-component view-gated design (deck/session state); queue captured once at session start via buildDueQueue
- Dashboard mastery replaced with real SRS-derived deckStatsByDomain; stat-num shows due count (falls back to total)
- Flashcards route now leads with study loop (FlashcardsStudy); FlashcardsBrowse kept in repo as unused file
- Pure quiz engine (quiz.ts): scaledScore/isPass/gradeAttempt/selectQuestions/remainingSeconds/isExpired; rng+nowMs injected by caller; zero Math.random/Date.now inside module
- selectQuestions supports 4 modes: scenario (4-of-6 grouped), domain (filter), timed (fixed 10), free (clamp 5-15, default 10)
- QuizAttempt added to PersistedState as quizHistory: QuizAttempt[] (default [], schemaVersion stays 1); addAttempt prepends
- QuizAttempt.perDomain is flat pct map (Record<DomainId, number>); distinct from GradeResult.perDomain (UI converts shapes)
- QuizConfig interface exported from ModeSelect.tsx — QuizRunner imports it as single source of truth
- Math.random injected into selectQuestions exactly once in QuizRunner useMemo — engine stays pure (rng-injection-at-ui-boundary pattern)
- Timed countdown: useEffect interval sets nowMs=Date.now(); remainingSeconds/isExpired called with nowMs (now-injection-at-ui-boundary)
- finishedRef guard ensures onFinish fires exactly once whether via Next button or timer expiry
- QuizResults exports QuizResultView so both QuizFlow and HistoryScreen build it without coupling to the runner
- perDomain shape conversion done in QuizFlow (at finish) and HistoryScreen (stored flat map re-wrapped as {pct} objects)
- HistoryScreen rebuilds missed Question[] from getQuestions() by id; unknown ids skipped gracefully (no crash)
- Quiz route wired as QuizFlow (ModeSelect→QuizRunner→QuizResults); History route wired as HistoryScreen

### Phase boundaries

- Phase 2 (Content) unblocks both Phase 3 (Flashcards) and Phase 4 (Quiz) — they can proceed in either order once content exists
- Content authoring is its own phase, not folded into feature phases, so the dataset is a verifiable deliverable

### Todos

- (none yet)

### Blockers

- (none)

## Session Continuity

**Last action:** Completed plan 04-03 (QuizResults + QuizFlow + HistoryScreen; 190 tests pass; typecheck + build exit 0). All v1 phases complete.
**Stopped at:** Plan 04-03 complete — QuizResults + QuizFlow + HistoryScreen; full v1 roadmap complete
**Next step:** None — all 23 v1 requirements delivered

---
*Last updated: 2026-06-10 after plan 03-01 execution*
