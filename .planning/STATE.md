# Project State: Claude Architect Exam Trainer

## Project Reference

**Core value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.
**Tech stack:** React + Vite + TypeScript, localStorage persistence, static build.
**Mode:** mvp (vertical slices)
**Current focus:** Phase 1 — App Shell & Persistence

## Current Position

**Phase:** 1 of 4 — App Shell & Persistence
**Plan:** None yet
**Status:** Not started (roadmap created, awaiting planning)
**Progress:** [----] 0/4 phases complete

## Performance Metrics

- Phases complete: 0/4
- Plans complete: 0
- Requirements delivered: 0/23

## Accumulated Context

### Decisions
- Static offline web app, no backend — localStorage suffices for v1
- React + Vite + TypeScript for clean state handling across SRS + quiz modes
- Content authored from official guide and embedded (typed/structured) — no cold start
- Leitner/SRS for flashcard scheduling
- Card/question volume tracks domain weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
- The guide's 12 sample questions ship verbatim in the bank, tagged by scenario/domain

### Phase boundaries
- Phase 2 (Content) unblocks both Phase 3 (Flashcards) and Phase 4 (Quiz) — they can proceed in either order once content exists
- Content authoring is its own phase, not folded into feature phases, so the dataset is a verifiable deliverable

### Todos
- (none yet)

### Blockers
- (none)

## Session Continuity

**Last action:** Roadmap and requirements traceability created.
**Next step:** Plan Phase 1 with `/gsd-plan-phase 1`.

---
*Last updated: 2026-06-10 after roadmap creation*
