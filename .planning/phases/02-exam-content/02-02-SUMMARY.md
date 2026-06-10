---
phase: 02-exam-content
plan: "02"
subsystem: content-data-layer
tags: [content, tdd, flashcards, questions, domain-minimums, exam-weights]
dependency_graph:
  requires:
    - src/data/types.ts (Flashcard/Question interfaces from 02-01)
    - src/data/content.ts (selectors: flashcardCountsByDomain, questionCountsByDomain from 02-01)
    - src/data/flashcards.ts (seed deck f1-f15 from 02-01)
    - src/data/questions.ts (seed q1-q14 + sq1-sq12 from 02-01)
  provides:
    - Expanded flashcard deck with 50 total cards meeting per-domain minimums
    - Expanded question bank with 40 total questions meeting per-domain minimums
    - Strengthened per-domain minimum + uniqueness tests in content.test.ts
  affects:
    - 02-03 (browse views — consumes expanded loader with per-domain counts)
    - Phase 3 (SRS — larger pool of flashcards to schedule)
    - Phase 4 (Quiz engine — larger pool of questions for realistic exam simulation)
tech_stack:
  added: []
  patterns:
    - TDD RED/GREEN cycle — per-domain min assertions added before content, then content authored
    - Exam-grounded original questions: 1 correct + 3 plausible distractors + whyCorrect/whyOthers
    - Domain weight tracking: card/question counts proportional to D1 27% / D2 18% / D3 20% / D4 20% / D5 15%
key_files:
  created: []
  modified:
    - src/data/flashcards.ts (f16-f50 appended; 15 -> 50 total)
    - src/data/questions.ts (q15-q28 appended; 26 -> 40 total)
    - src/data/content.test.ts (per-domain minimums + id uniqueness tests)
decisions:
  - "Flashcards ordered: all seed cards first (f1-f15) then new per-domain blocks — preserves backward compatibility for any existing references"
  - "Questions ordered: all seed q1-q14 first, then sq1-sq12, then new q15-q28 — new originals come after official-sample block for clear traceability"
  - "New flashcard topics grounded in exam task statements: evaluator-optimizer, HITL, prompt chaining, routing, parallelization, MCP resources/prompts, structured errors, least-privilege, rules globs, plan mode, hooks, injection defense, output schemas, Batches API, attention dilution, context compaction"
  - "New question correct-answer themes follow authoring quality bar: deterministic enforcement > prompt, better tool descriptions > complexity, explicit criteria + few-shot, least-privilege, structured errors, right API for latency, attention dilution, context compaction"
metrics:
  duration: "~6 minutes"
  completed: "2026-06-10"
  tasks_completed: 2
  files_changed: 3
---

# Phase 02 Plan 02: Expand Deck + Bank to Per-Domain Weight-Tracking Minimums Summary

**One-liner:** Expanded the content dataset from 15 flashcards / 26 questions to 50 flashcards / 40 questions by authoring 35 new domain-grounded flashcards and 14 new original exam-style questions, all verified by strengthened TDD per-domain minimum assertions.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 RED | Tighten content tests to per-domain minimums + id uniqueness | c1b0e33 | Done |
| 2 GREEN | Author original cards + questions to meet minimums | 9eadf8e | Done |

## What Was Built

**Task 1 — Per-domain minimum assertions + uniqueness tests (RED):**
- Replaced fixed `flashcards === 15` / `questions === 26` assertions with per-domain minimum assertions
- Added `FC_MIN = { d1:13, d2:9, d3:10, d4:10, d5:8 }` and `Q_MIN = { d1:11, d2:7, d3:8, d4:8, d5:6 }` constants
- Added `getFlashcards().length >= 50` and `getQuestions().length >= 40` total minimum assertions
- Added id uniqueness tests for both flashcards and questions
- Kept official-sample === 12 assertion intact
- Confirmed RED: 12 tests failing (seed below all domain minimums)

**Task 2 — Expanded deck + bank (GREEN):**

Flashcards added (f16–f50, 35 new cards):
- D1 (f16–f24, +9): evaluator–optimizer with explicit rubrics; HITL gates for irreversible actions; prompt chaining; routing workflow; parallelization fan-out/fan-in; task handoff context discipline; budget caps as stop conditions; when agents are appropriate; agent memory types
- D2 (f25–f30, +6): MCP resources vs tools; MCP prompts as reusable templates; structured error shapes; least-privilege tool access; pagination in tool responses; parameter descriptions in tool schemas
- D3 (f31–f37, +7): slash commands (project vs personal scope); rules globs for path-scoped conventions; plan mode; tool permission scoping; PreToolUse hooks for deterministic policy; CLAUDE.md hierarchy; --output-format json flag
- D4 (f38–f44, +7): prompt injection defense via XML structural separation; output schemas + few-shot for extraction; Message Batches API use cases; system prompt vs user turn for instructions; temperature/top-p for structured tasks; chain-of-thought prompting; role framing
- D5 (f45–f50, +6): structured error context for multi-agent recovery; retry strategies with exponential backoff; context window budget allocation; attention dilution and mitigation; provenance and claim sourcing; batch vs sync API selection

Questions added (q15–q28, 14 new original questions):
- D1 (q15–q20, +6): evaluator–optimizer rubric quality; parallel subagent timeout with partial synthesis; HITL for account deletion; context isolation semantics; loop stop condition with partial results; routing with few-shot + clarify branch
- D2 (q21–q22, +2): structured error shapes enable intelligent recovery; least-privilege tool assignment
- D3 (q23, +1): PostToolUse hooks for deterministic eslint auto-fix
- D4 (q24–q26, +3): focused extraction passes vs single-pass attention dilution; few-shot classification improvement; XML structural defense for code injection
- D5 (q27–q28, +2): attention dilution in 500-page document passes; context compaction to preserve architectural decisions in long sessions

## Deviations from Plan

None — plan executed exactly as written. The TDD RED/GREEN cycle proceeded cleanly: test file updated to per-domain minimums (RED, 12 failures), then content authored to meet all minimums (GREEN, 48 passing tests).

## TDD Gate Compliance

- RED gate: commit `c1b0e33` — `test(02-02): require per-domain weight-tracking minimums (TDD red)`
- GREEN gate: commit `9eadf8e` — `feat(02-02): expand deck + bank to per-domain weight-tracking minimums (TDD green)`
- REFACTOR: Not needed — implementation was clean on first pass

## Known Stubs

None — all 50 flashcards and 40 questions have real, grounded content. No placeholders.

## Threat Flags

No new security surface beyond the plan's threat model (T-02-03 accepted: static authored content, shape tests guard malformed entries).

## Self-Check: PASSED

- [x] `grep -c "id: 'f"` in flashcards.ts returns 50
- [x] `grep -cE "id: '(q|sq)"` in questions.ts returns 40
- [x] `grep -c "source: 'official-sample'"` in questions.ts returns 12
- [x] `npm test` — 48/48 tests pass (GREEN)
- [x] `npm run typecheck` — exits 0
- [x] `npm run build` — exits 0
- [x] Commits verified: c1b0e33 (RED), 9eadf8e (GREEN)
- [x] Per-domain counts: FC d1=13, d2=9, d3=10, d4=10, d5=8 (all at minimums); Q d1=11, d2=7, d3=8, d4=8, d5=6 (all at minimums)
