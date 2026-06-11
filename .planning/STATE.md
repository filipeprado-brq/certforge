---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Content Expansion
status: complete
stopped_at: None — Phase 6 complete; all plans 06-01 through 06-04 delivered.
last_updated: "2026-06-11T17:50:00.000Z"
last_activity: 2026-06-11
progress:
  total_phases: 6
  completed_phases: 6
  total_plans: 18
  completed_plans: 18
  percent: 100
---

# Project State: Claude Architect Exam Trainer

## Project Reference

**Core value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.
**Tech stack:** React + Vite + TypeScript, localStorage persistence, static build.
**Mode:** mvp (vertical slices)
**Current focus:** Phase 06 — question-bank-expansion

## Current Position

Phase: 06 (question-bank-expansion) — COMPLETE
All phases complete. v1.1 milestone delivered.
Plan: 4 of 4 (DONE)
Status: Complete
Last activity: 2026-06-11

## Performance Metrics

- Phases complete: 6/6 (all phases 1–6 complete; v1.1 milestone delivered)
- Plans complete: 18 (01-01, 01-02, 02-01, 02-02, 02-03, 03-01, 03-02, 04-01, 04-02, 04-03, 05-01, 05-02, 05-03, 05-04, 06-01, 06-02, 06-03, 06-04)
- Requirements delivered: 32/32 (all v1.0 + EXP-01/02/03/04/05/06/07 all delivered; Phase 6 complete)

## Accumulated Context

### v1.1 milestone plan

- v1.1 is CONTENT-ONLY authoring on the existing typed data layer (`src/data/flashcards.ts`, `questions.ts`, `content.ts`, `content.test.ts`) — no new app features
- Phase 5 (Flashcard Bank Expansion): EXP-01, EXP-03 — grow deck ~50→≥150, weight-proportional (D1≥40, D2≥27, D3≥30, D4≥30, D5≥23), ≥1 card per task statement 1.1–5.6
- Phase 6 (Question Bank Expansion): EXP-02, EXP-04, EXP-05, EXP-06, EXP-07 — grow bank ~40→≥120, preserve the 12 official samples, ≥8 scenario-tagged questions per scenario, ≥15 code/config-snippet questions, harder tradeoff distractors with grounded explanations
- EXP-07 (test/invariants) is cross-cutting; assigned to Phase 6 as the closeout (full green typecheck + build + tests over the whole expanded dataset). Phase 5 still updates its own flashcard minimums/per-domain assertions to stay green as it lands
- Distractor authoring guide (from PROJECT.md context): deterministic enforcement > prompt; better tool descriptions > complexity; explicit criteria + few-shot > self-reported confidence; least-privilege tool access; structured errors > generic; right API for the latency need; attention dilution in large contexts
- Invariants to preserve in content.test.ts: official-sample === 12, exactly-4-option shape per question, unique ids, no network fetch

### v1.0 decisions (carried forward)

- Static offline web app, no backend — localStorage suffices for v1
- React + Vite + TypeScript for clean state handling across SRS + quiz modes
- Content authored from official guide and embedded (typed/structured) — no cold start
- Leitner/SRS for flashcard scheduling
- Card/question volume tracks domain weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
- The guide's 12 sample questions ship verbatim in the bank, tagged by scenario/domain
- Typed content layer embedded as TS modules — no fetch/XHR (CONT-06) — types in src/data/types.ts, selectors in src/data/content.ts
- content.test.ts uses fileURLToPath with process.cwd() fallback for jsdom URL compatibility; @types/node devDependency supports node:fs/url/path in the CONT-06 grep gate
- v1.0 baseline volume: D1 13fc/11q, D2 9fc/7q, D3 10fc/8q, D4 10fc/8q, D5 8fc/6q (50 flashcards, 40 questions)
- Leitner intervals [0,1,3,7,16] for boxes 1..5; Again→box1 due-today; Good→box+1(cap5); learned = box >= 3
- Now-injection pattern for pure logic (srs.ts, deckStats.ts, quiz.ts take `now`/`nowMs`; rng injected at UI boundary) — content expansion must not break this
- selectQuestions modes: scenario (4-of-6 grouped), domain (filter), timed (fixed 10), free (clamp 5-15, default 10) — larger banks make these selections richer with no engine change

### Phase boundaries

- Phase 5 unblocks Phase 6 (dataset grows in two slices; Phase 6 closes out the full content test suite)
- Content authoring kept as its own phases (not folded into feature work) so each dataset is a verifiable deliverable

### Todos

- (none yet)

### Blockers

- (none)

## Session Continuity

**Last action:** Completed 06-04-PLAN.md — authored 13 D5 questions q102-q114 grounded in task statements 5.1-5.6; Structured Data Extraction scenario reached 9 (buffer); total bank 126 questions; hasSnippet 17; all 6 EXP gates closed GREEN; 201/201 tests pass; typecheck + build green. Phase 6 + v1.1 milestone complete.
**Stopped at:** None — all phases complete.
**Next step:** v1.1 milestone delivered; no pending plans.

### Decisions

- D5 cards authored: 17 (f141-f157, 2 more than planned 15, to cover the missed 5.6 statement)
- No backfill of f1-f50 required — 1.1-4.6 were already covered by f51-f140
- Total deck: 157 flashcards; D5: 25 cards
- hasSnippet?: boolean is OPTIONAL on Question so existing 40 questions remain valid without edits (06-01)
- Phase 6 RED-gate test suite mirrors Phase 5 pattern: 12 question tests fail first, authoring plans 06-02/03/04 drive GREEN (06-01)
- D5 questions grounded in task statements 5.1-5.6: evaluation, observability, cost/quality tradeoffs, safety/red-teaming, metric-driven iteration, production reliability
- 5 of 13 D5 questions tagged 'Structured Data Extraction' to reach the 9-question buffer (+1 above >=8 gate)
- All snippet content uses JSON/JSON Schema formats — no fetch(/import(/axios/XHR patterns used
- Benchmark update scenario (q113) illustrates that score drops after realistic eval set expansion are healthy signals, not regressions

---
*Last updated: 2026-06-11 after 06-04 Phase 6 closeout — v1.1 milestone complete*
