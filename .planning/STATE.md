---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Content Expansion
status: executing
stopped_at: v1.1 roadmap complete; phases 5–6 not yet planned.
last_updated: "2026-06-11T15:17:44.319Z"
last_activity: 2026-06-11
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 14
  completed_plans: 12
  percent: 86
---

# Project State: Claude Architect Exam Trainer

## Project Reference

**Core value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.
**Tech stack:** React + Vite + TypeScript, localStorage persistence, static build.
**Mode:** mvp (vertical slices)
**Current focus:** Phase 05 — flashcard-bank-expansion

## Current Position

Phase: 05 (flashcard-bank-expansion) — EXECUTING
Plan: 3 of 4
Status: Ready to execute
Last activity: 2026-06-11

## Performance Metrics

- Phases complete: 4/6 (v1.0 phases 1–4 complete; v1.1 phases 5–6 not started)
- Plans complete: 10 (01-01, 01-02, 02-01, 02-02, 02-03, 03-01, 03-02, 04-01, 04-02, 04-03)
- Requirements delivered: 23/30 (all v1.0; v1.1 EXP-01..07 pending)

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

**Last action:** Completed 05-02-PLAN.md — authored 50 new flashcards (f51-f80 D1, f81-f100 D2) with taskRefs covering 1.1-1.7 and 2.1-2.5; d1 now 43, d2 now 29; d1/d2 count tests green.
**Stopped at:** None (plan complete).
**Next step:** Execute 05-03-PLAN.md (D3 + D4 flashcard expansion).

---
*Last updated: 2026-06-11 after 05-02 flashcard authoring*
