# Phase 6: Question Bank Expansion - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning
**Source:** Orchestrator-defined, grounded in the exam guide task statements (1.1–5.6) + 6 scenarios

<domain>
## Phase Boundary

Final v1.1 phase. Grow the question bank **40 → ≥120**, weight-proportional; give **every one of the 6
official scenarios a strong pool (≥8 scenario-tagged questions)**; add **≥15 code/config-snippet
questions**; make new questions harder/tradeoff-style with plausible distractors; and **close the test
suite green** (EXP-07). Content-only: edit `src/data/questions.ts`, `src/data/types.ts` (one optional
field), `src/data/content.test.ts`. NO app/UI/SRS changes; questions flow through the existing
QuizBrowse / QuizRunner / ModeSelect automatically. EXP-02/04/05/06/07.

Preserve all 40 existing questions (q1–q28 originals + sq1–sq12 official). New originals continue
**q29+**. The 12 official samples (sq1–sq12, `source:'official-sample'`) stay byte-unchanged.
Flashcards (Phase 5) must stay untouched and their tests green.
</domain>

<decisions>
## Implementation Decisions

### Per-domain targets (EXP-02) — ≥120 total, weight-proportional, with buffer
Current → target (NEW to author). Buffered slightly above the test minimum so one dropped item can't fail a gate.

| Domain | Weight | Current | Test min | Author NEW | Lands | Id range |
|--------|--------|---------|----------|------------|-------|----------|
| D1 | 27% | 11 | **≥32** | +23 | 34 | q29–q51 |
| D2 | 18% | 7 | **≥22** | +16 | 23 | q52–q67 |
| D3 | 20% | 8 | **≥24** | +17 | 25 | q68–q84 |
| D4 | 20% | 8 | **≥24** | +17 | 25 | q85–q101 |
| D5 | 15% | 6 | **≥18** | +13 | 19 | q102–q114 |
| **Total** | 100% | 40 | **≥120** | **+86** | **126** | — |

Ids contiguous q29–q114, unique, no collision with q1–q28 or sq1–sq12.

### Scenario coverage (EXP-04) — each of the 6 scenarios ≥8 scenario-tagged questions
Current tagged counts → new scenario-tagged questions needed (these are PART of the 86 new, tagged with both `scenario` and `domain`):

| Scenario | Now | Need (≥8) |
|----------|-----|-----------|
| Multi-Agent Research System | 8 | ✓ (already) — add 0–2 more if natural |
| Customer Support Resolution Agent | 6 | +2 |
| Code Generation with Claude Code | 5 | +3 |
| Claude Code for Continuous Integration | 4 | +4 |
| Structured Data Extraction | 4 | +4 |
| Developer Productivity with Claude | 2 | +6 |

Minimum +19 scenario-tagged across these. Map each scenario's questions to the domains it naturally
exercises (e.g. Customer Support → d1/d2/d5; Multi-Agent → d1/d2/d5; Code Gen & CI → d3/d4; Dev
Productivity → d2/d3; Structured Data → d4/d5). The rest of the 86 can be domain-only practice questions.

### Code/config-snippet questions (EXP-05) — ≥15
- Add an OPTIONAL field to the `Question` type: `hasSnippet?: boolean`. Set `hasSnippet: true` on
  questions whose **stem embeds a code/config snippet** (inline, inside the `stem` string — keep it
  readable; no UI change needed). Author **≥15** such questions.
- Snippet topics to cover (spread mostly across D2/D3/D4, some D1):
  `.mcp.json` with `${ENV}` expansion · project vs user MCP scope · `tool_choice` `"auto"/"any"/{type:"tool",name}` ·
  a `PreToolUse`/`PostToolUse` hook config · `CLAUDE.md` snippet (+ `@import`) · `.claude/rules/` YAML `paths:` glob frontmatter ·
  SKILL.md frontmatter (`context: fork`, `allowed-tools`, `argument-hint`) · CLI `claude -p --output-format json --json-schema` ·
  a JSON Schema with nullable/enum/"other"+detail · `isError` / structured error (`errorCategory`,`isRetryable`) ·
  agentic loop `stop_reason` ("tool_use" vs "end_turn") · `AgentDefinition`/`allowedTools` incl. "Task" · Message Batches `custom_id`.

### Authoring quality bar (EXP-06)
- Each question: exactly **1 correct + 3 plausible distractors** (`options` 4-tuple, `correct` 0..3),
  substantive **`whyCorrect`** AND **`whyOthers`** grounded in the guide concept. Distractors must be
  *plausible-but-wrong* — the kind a half-prepared candidate would pick — not obviously absurd.
- Favor tradeoff/judgment framing like the 12 official samples and the exam's correct-answer themes
  (deterministic enforcement > prompt; better tool descriptions > complexity; explicit criteria + few-shot >
  self-reported confidence; least-privilege; structured errors; right API for latency; attention dilution;
  context discipline/provenance). Ground questions in specific task statements (1.1–5.6).
- No duplicate questions; vary stems/angles. Factually correct about Claude / MCP / Claude Code / API.

### content.test.ts closeout (EXP-07)
- Raise question total to **≥120** and per-domain minimums (d1≥32, d2≥22, d3≥24, d4≥24, d5≥18).
- Add a **scenario-coverage** assertion: for each of the 6 `SCENARIOS`, count of questions with that
  `scenario` is **≥8**.
- Add a **snippet-count** assertion: questions with `hasSnippet === true` number **≥15**.
- Preserve ALL existing invariants: `official-sample === 12`; every question has 4 options + correct in
  0..3 + non-empty whyCorrect/whyOthers; unique ids; no `fetch(`/`import(`/`axios` in src/data/*.
- Phase-5 flashcard gates (≥150, per-domain, 30 TASK_STATEMENTS coverage) must remain green.
- typecheck + build + full `npm test` green.
</decisions>

<canonical_refs>
## Canonical References
- `src/data/questions.ts` (extend, ids q29+; preserve q1–q28 + sq1–sq12), `src/data/types.ts` (add `hasSnippet?: boolean` to `Question`), `src/data/scenarios.ts` (the 6 SCENARIOS), `src/data/domains.ts`, `src/data/content.ts` (selectors — unchanged), `src/data/content.test.ts` (closeout).
- `.planning/phases/02-exam-content/02-CONTEXT.md` — the 12 official samples (do not alter) + prior authoring conventions; `design/data.jsx` — voice/format reference.
- This file's `<decisions>` — authoritative distribution (per-domain, per-scenario, snippet topics).
</canonical_refs>

<specifics>
## Verifiable acceptance hooks
- `getQuestions().length >= 120`; per-domain ≥ {d1:32,d2:22,d3:24,d4:24,d5:18}.
- For each of the 6 SCENARIOS: `getQuestions({scenario}).length >= 8`.
- Questions with `hasSnippet === true` ≥ 15.
- `source:'official-sample'` === 12 (unchanged); every question 4 options + correct 0..3 + non-empty whyCorrect/whyOthers; ids unique; no fetch in src/data/*.
- Flashcards unchanged (≥150, 30 task statements) — Phase 6 must not touch flashcards.ts.
- typecheck + build + `npm test` green.
</specifics>

<deferred>
## Deferred Ideas
- Difficulty tiers / weighted exam blueprint composition → future. Content editing / import → v2.
</deferred>

---

*Phase: 06-question-bank-expansion*
*Context gathered: 2026-06-11*
