# Phase 5: Flashcard Bank Expansion - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning
**Source:** Orchestrator-defined, grounded in the official exam guide task statements (1.1–5.6)

<domain>
## Phase Boundary

Grow the flashcard deck from **50 → ≥150**, weight-proportional, and guarantee **≥1 flashcard per
exam-guide task statement (1.1–5.6)**. Content-only: edit the typed data layer (`src/data/flashcards.ts`,
`src/data/types.ts`, `src/data/content.test.ts`). NO app/UI/SRS code changes — new cards flow through
the existing study loop, Deck Overview, and Dashboard automatically. EXP-01 + EXP-03 only; questions
are Phase 6.

Preserve the 50 existing cards (f1–f50). New cards continue ids **f51+**, unique.
</domain>

<decisions>
## Implementation Decisions

### Per-domain targets (EXP-01) — ≥150 total, weight-proportional
Current → target (NEW to author):

| Domain | Weight | Current | Target (min) | NEW |
|--------|--------|---------|--------------|-----|
| D1 Agentic Architecture & Orchestration | 27% | 13 | **40** | +27 |
| D2 Tool Design & MCP Integration | 18% | 9 | **27** | +18 |
| D3 Claude Code Configuration & Workflows | 20% | 10 | **30** | +20 |
| D4 Prompt Engineering & Structured Output | 20% | 10 | **30** | +20 |
| D5 Context Management & Reliability | 15% | 8 | **23** | +15 |
| **Total** | 100% | 50 | **150** | **+100** |

### Task-statement coverage (EXP-03) — make it testable
- Add an OPTIONAL field to the `Flashcard` type: `taskRef?: string` (e.g. `'1.3'`, `'4.5'`).
- Every NEW card MUST set `taskRef` to the task statement it covers. Backfill existing f1–f50 with a
  best-fit `taskRef` where natural (not strictly required for old cards, but helps coverage).
- **Coverage invariant (content.test.ts):** the set of `taskRef` values across all flashcards must
  include **all 30** task statements: `['1.1'..'1.7','2.1'..'2.5','3.1'..'3.6','4.1'..'4.6','5.1'..'5.6']`.
  Add a `TASK_STATEMENTS` const (the 30 ids) and assert every one appears on ≥1 card.

### The 30 task statements to cover (author concept cards for each; many domains need several cards per statement to hit the per-domain target)

**Domain 1 — Agentic Architecture & Orchestration (target 40 cards across these 7):**
- 1.1 Agentic loop lifecycle — stop_reason ("tool_use" vs "end_turn"), append tool_result, loop until end_turn; anti-patterns (parsing NL for termination, arbitrary iteration caps).
- 1.2 Coordinator–subagent orchestration — hub-and-spoke, isolated subagent context, dynamic subagent selection, partition scope to avoid duplication, iterative refinement, route all comms through coordinator.
- 1.3 Subagent invocation/context passing — Task tool (allowedTools must include "Task"), explicit context in prompt (no auto-inheritance), AgentDefinition, fork_session, parallel via multiple Task calls in one turn, goal-not-procedure prompts.
- 1.4 Multi-step workflows enforcement/handoff — programmatic prerequisite gates vs prompt guidance, deterministic compliance for financial ops, structured escalation handoff summaries (customer id, root cause, recommended action).
- 1.5 Agent SDK hooks — PostToolUse for data normalization (Unix/ISO/numeric → uniform), tool-call interception to block policy violations (e.g. refund > $500) and redirect, hooks for deterministic guarantees vs prompt probabilistic.
- 1.6 Task decomposition strategies — fixed prompt chaining vs dynamic adaptive decomposition; per-file local pass + cross-file integration pass; adaptive investigation plans.
- 1.7 Session state/resumption/forking — `--resume <name>`, `fork_session` for divergent branches, inform agent of file changes on resume, new-session-with-summary vs resume-with-stale-results.

**Domain 2 — Tool Design & MCP Integration (target 27 across these 5):**
- 2.1 Tool interface design — descriptions are the primary selection mechanism; include input formats/examples/edges/boundaries; rename/split to remove overlap (analyze_content→extract_web_results); system-prompt keyword sensitivity.
- 2.2 Structured error responses — MCP isError; transient vs validation vs business vs permission; errorCategory + isRetryable + human-readable; access-failure vs valid-empty-result; local recovery before propagation.
- 2.3 Tool distribution + tool_choice — too many tools (18 vs 4-5) degrades selection; scoped per-role tools; scoped cross-role (verify_fact); tool_choice "auto"/"any"/forced {type:tool,name}.
- 2.4 MCP server integration — project .mcp.json vs user ~/.claude.json; ${ENV} expansion; tools discovered at connect time; MCP resources as content catalogs; enhance descriptions so MCP tools beat built-in Grep; prefer community servers (Jira) for standard integrations.
- 2.5 Built-in tools — Grep (content search), Glob (path patterns), Read/Write (full), Edit (unique-match) with Read+Write fallback; incremental codebase understanding (Grep entry points → Read imports).

**Domain 3 — Claude Code Configuration & Workflows (target 30 across these 6):**
- 3.1 CLAUDE.md hierarchy — user (~/.claude/CLAUDE.md) vs project (.claude/CLAUDE.md or root) vs directory; @import modular includes; .claude/rules/ topic files; /memory to verify loaded files.
- 3.2 Custom slash commands & skills — .claude/commands/ (project) vs ~/.claude/commands/ (personal); SKILL.md frontmatter context:fork, allowed-tools, argument-hint; skills (on-demand) vs CLAUDE.md (always-loaded).
- 3.3 Path-specific rules — .claude/rules/ YAML frontmatter `paths:` glob activation; glob rules beat directory CLAUDE.md for files spread across dirs (**/*.test.tsx).
- 3.4 Plan mode vs direct execution — plan mode for large/architectural/multi-file; direct for well-scoped single-file; Explore subagent for verbose discovery; combine plan-then-execute.
- 3.5 Iterative refinement — concrete I/O examples beat prose; test-driven iteration; interview pattern; single-message (interacting) vs sequential (independent) fixes.
- 3.6 CI/CD integration — `-p`/`--print` non-interactive; `--output-format json` + `--json-schema`; CLAUDE.md for CI project context; independent review instance vs same-session self-review.

**Domain 4 — Prompt Engineering & Structured Output (target 30 across these 6):**
- 4.1 Explicit criteria / precision / false positives — specific categorical criteria beat "be conservative"; false-positive categories erode trust; severity criteria with code examples.
- 4.2 Few-shot prompting — most effective for consistent format; demonstrate ambiguous-case handling; generalize to novel patterns; reduce extraction hallucination; 2-4 targeted examples.
- 4.3 Structured output via tool_use — tool_use + JSON schema = guaranteed schema-valid (no syntax errors, but semantic errors remain); tool_choice auto/any/forced; optional/nullable fields prevent fabrication; enum + "other"+detail.
- 4.4 Validation/retry/feedback loops — retry-with-error-feedback; retries useless when info absent vs format/structural errors; detected_pattern field; calculated_total vs stated_total / conflict_detected.
- 4.5 Batch processing — Message Batches API 50% cost / up to 24h / no latency SLA; non-blocking workloads only; no multi-turn tool calling in batch; custom_id correlation; submission cadence math.
- 4.6 Multi-instance/multi-pass review — self-review limitation (retains reasoning); independent instance catches more; per-file + cross-file passes; confidence self-report for routing.

**Domain 5 — Context Management & Reliability (target 23 across these 6):**
- 5.1 Conversation context preservation — progressive-summarization risk (numbers/dates lost); lost-in-the-middle; trim verbose tool output; "case facts" block; position-aware ordering.
- 5.2 Escalation & ambiguity resolution — triggers (customer asks human, policy gap, no progress); honor explicit human request immediately; sentiment/self-confidence are unreliable proxies; ask for identifiers on multiple matches.
- 5.3 Error propagation across multi-agent — structured error context (type, attempted, partial, alternatives); access-failure vs valid-empty; no generic statuses; no silent suppression / no whole-workflow termination; coverage annotations.
- 5.4 Large codebase exploration context — context degradation ("typical patterns"); scratchpad files; subagent delegation; crash-recovery manifests; /compact.
- 5.5 Human review & confidence calibration — aggregate accuracy hides per-type/field gaps; stratified sampling; field-level confidence calibrated on labeled sets; segment accuracy before automating.
- 5.6 Provenance & multi-source synthesis — claim-source mappings survive summarization; annotate conflicting stats with attribution; require publication dates (temporal vs contradiction); render content types appropriately.

### Authoring quality bar
- Front = a term or a sharp question; Back = a concise, correct explanation (≈1–3 sentences) grounded
  in the guide concept above. Match the voice of the existing f1–f50 (see design/data.jsx origins).
- Factually correct about Claude / MCP / Claude Code / Claude API per the guide. No duplicate concepts
  (vary angle if multiple cards share a task statement). Unique ids f51+.

### content.test.ts updates (folded into this phase; supports EXP-07 later)
- Update flashcard total to **≥150** and per-domain minimums (D1≥40, D2≥27, D3≥30, D4≥30, D5≥23).
- Add `TASK_STATEMENTS` (30 ids) + assert every id appears as a `taskRef` on ≥1 flashcard.
- Keep existing invariants: unique ids, no fetch in data modules, questions/official-sample untouched (Phase 6 owns questions).
</decisions>

<canonical_refs>
## Canonical References
- `src/data/flashcards.ts` (extend, ids f51+), `src/data/types.ts` (add `taskRef?: string` to `Flashcard`), `src/data/domains.ts` (DOMAINS), `src/data/content.ts` (selectors — unchanged), `src/data/content.test.ts` (update minimums + add taskRef coverage).
- `design/data.jsx` — voice/format reference for the seed cards.
- `.planning/phases/02-exam-content/02-CONTEXT.md` — prior content authoring conventions.
- This file's `<decisions>` — the 30 task statements are the authoritative coverage checklist.
</canonical_refs>

<specifics>
## Verifiable acceptance hooks
- `getFlashcards().length >= 150`; per-domain counts ≥ {d1:40,d2:27,d3:30,d4:30,d5:23}.
- The set of `taskRef` across flashcards ⊇ all 30 task statements (TASK_STATEMENTS).
- All flashcard ids unique; no `fetch(`/`import(`/`axios` in src/data/*.
- Questions bank + official-sample count unchanged (=== 12) — Phase 5 must not touch questions.ts.
- typecheck + build + `npm test` green.
</specifics>

<deferred>
## Deferred Ideas
- Question bank expansion, scenario pools, code-snippet questions, difficulty → Phase 6 (EXP-02/04/05/06/07 closeout).
</deferred>

---

*Phase: 05-flashcard-bank-expansion*
*Context gathered: 2026-06-11*
