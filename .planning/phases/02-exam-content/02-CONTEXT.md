# Phase 2: Exam Content - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning
**Source:** Orchestrator-captured from the official exam guide PDF + the design handoff

<domain>
## Phase Boundary

Author and embed the study **content** for the app: a typed, structured dataset of flashcards and
exam-style multiple-choice questions, drawn from the official "Claude Certified Architect –
Foundations" exam guide, plus a minimal in-app way to **browse** it. Phase 1 already shipped the
shell, theming, persistence, routing, and the BRQ design system. The SRS study loop (Phase 3) and
the full quiz engine (Phase 4) are OUT of scope here — this phase only delivers the data + browse
views that those phases will consume.

In scope: TS types for domains/scenarios/flashcards/questions; the embedded dataset; a typed loader
(no network fetch); flashcard + question **browse/list** screens that replace the Flashcards/Quiz
placeholders enough to satisfy "browsable"; per-domain counts that visibly track exam weights.

Out of scope: SRS scheduling, card flip/study session, quiz runner/timer/scoring/results, history.
</domain>

<decisions>
## Implementation Decisions

### Content model (CONT-06)
- Store content as **typed TypeScript** under `src/data/` (e.g. `flashcards.ts`, `questions.ts`,
  `scenarios.ts`), exporting typed arrays. Reuse the existing `src/data/domains.ts` from Phase 1.
- Define shared types in `src/data/types.ts`:
  - `Domain` already exists (id `d1`..`d5`, code, short, name, weight).
  - `Flashcard { id; domain: DomainId; front: string; back: string }`
  - `Scenario` = one of the 6 official scenario names (string-union or const array).
  - `Question { id; domain: DomainId; scenario?: Scenario; stem: string; options: [string,string,string,string]; correct: 0|1|2|3; whyCorrect: string; whyOthers: string; source?: 'official-sample' | 'original' }`
- A typed loader/index module exposes selectors used by browse views and (later) Phases 3/4:
  `getFlashcards({domain?})`, `getQuestions({domain?, scenario?})`, and per-domain counts.
- Content is embedded in the build (imported modules) — **no fetch/XHR**.

### Seed + expand (CONT-01, CONT-02)
- **Reuse** the design handoff's authored content as the seed: `design/data.jsx` has 15 flashcards
  and 14 original exam-style questions (with `whyCorrect`/`whyOthers`). Port them verbatim into the
  typed dataset (fix domain tags as needed).
- **Expand** so per-domain counts track the exam weights (see targets below). New cards/questions
  must be grounded in the guide's task statements for each domain and follow the established
  voice/format.

### The 12 official sample questions (CONT-04) — MUST be included
- Add the guide's 12 sample questions verbatim to the question bank, each tagged
  `source: 'official-sample'` with the domain + scenario below. These are provided by Anthropic as
  practice material; include them as-is (1 correct + 3 distractors + explanation built from the
  guide's "Correct Answer" rationale). Full text is in `<specifics>` below.

### Per-domain volume targets (CONT-05) — must visibly track weights
Weights: D1 27%, D2 18%, D3 20%, D4 20%, D5 15%. Author to these **minimums** (proportional, rounded):

| Domain | Weight | Flashcards (min) | Questions (min) |
|--------|--------|------------------|-----------------|
| D1 Agentic Architecture & Orchestration | 27% | 13 | 11 |
| D2 Tool Design & MCP Integration | 18% | 9 | 7 |
| D3 Claude Code Configuration & Workflows | 20% | 10 | 8 |
| D4 Prompt Engineering & Structured Output | 20% | 10 | 8 |
| D5 Context Management & Reliability | 15% | 8 | 6 |
| **Total (min)** | 100% | **50** | **40** |

The browse UI must surface these counts per domain so the weighting is **visible** (e.g. a count +
"% of exam" chip per domain). A small unit test should assert each domain's count ≥ its target and
that questions tagged `official-sample` number exactly 12.

### Browse views (CONT-01, CONT-02 — "browsable in the app")
- Replace the Phase-1 placeholder bodies for the **Flashcards** and **Quiz** routes with simple
  **browse lists** (read-only) built from existing BRQ components (`DomainBadge`, `.card`,
  `.filter-chip`, `ProgressBar`/count chips). Reference layouts: `design/screens-flashcards.jsx`
  (DeckOverview) and `design/screens-quiz.jsx` (question list/cards) — but only the browse/listing
  parts, NOT the study-session or quiz-runner interactions.
- Flashcards browse: domain filter chips (All + 5), per-domain counts, list of cards showing
  front/back + DomainBadge. Quiz/questions browse: domain + scenario filter, list of questions
  showing stem, options, the correct answer marked, explanation, and domain/scenario tags.
- These views are read-only catalogs; the interactive study (flip/rate) and quiz (answer/score)
  flows arrive in Phases 3 & 4 and will reuse this same data layer.

### Authoring quality bar (grounded in the exam's own answer patterns)
Distractors should be plausible-but-wrong in the way the guide models. Recurring correct-answer
themes to favor when writing originals: deterministic enforcement (hooks/prerequisites) > prompt;
better tool descriptions > added complexity; explicit criteria + few-shot > self-reported
confidence; least-privilege tool access; structured errors > generic; right API for the latency
need (sync vs Batch); attention dilution in large contexts (split passes); context discipline
(trim tool output, compaction, claim-source provenance).
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract & existing code
- `.planning/phases/01-app-shell-persistence/01-UI-SPEC.md` — BRQ design contract (covers the whole
  app; browse views reuse it; no new UI-SPEC needed for Phase 2).
- `src/data/domains.ts` — existing typed DOMAINS (reuse, don't duplicate).
- `src/styles/app.css` — existing BRQ component classes (`.card`, `.domain-badge`, `.filter-chip`, `.chip-row`).

### Content source material
- `design/data.jsx` — 15 seed flashcards + 14 seed questions + the 6 scenario names + QUIZ_MODES (port the cards/questions; ignore the seeded HISTORY).
- `<specifics>` in this file — the 12 official sample questions (verbatim source for CONT-04).
- `design/screens-flashcards.jsx`, `design/screens-quiz.jsx` — browse/list layout reference.
</canonical_refs>

<specifics>
## The 12 official sample questions (from the exam guide — source of truth for CONT-04)

Tag each `source: 'official-sample'`. `correct` is 0-indexed against the option order shown.

**SQ1 — domain d1 · scenario "Customer Support Resolution Agent"**
Stem: In 12% of cases the agent skips `get_customer` and calls `lookup_order` using only the customer's stated name, sometimes causing misidentified accounts and incorrect refunds. What change most effectively addresses this reliability issue?
Options: A) Add a programmatic prerequisite that blocks `lookup_order` and `process_refund` until `get_customer` has returned a verified customer ID. B) Enhance the system prompt to state that verification via `get_customer` is mandatory before any order operations. C) Add few-shot examples showing the agent always calling `get_customer` first. D) Implement a routing classifier that enables only the subset of tools appropriate for each request type.
correct: A (0)
whyCorrect: Critical business sequencing needs deterministic, programmatic enforcement — guarantees prompts can't provide.
whyOthers: B and C rely on probabilistic LLM compliance (insufficient when errors have financial consequences); D addresses tool availability, not tool ordering — the actual problem.

**SQ2 — domain d2 · scenario "Customer Support Resolution Agent"**
Stem: The agent often calls `get_customer` for order questions (e.g. "check my order #12345") instead of `lookup_order`. Both tools have minimal descriptions and accept similar identifiers. Most effective first step to improve tool-selection reliability?
Options: A) Add 5–8 few-shot examples routing order queries to `lookup_order`. B) Expand each tool's description with input formats, example queries, edge cases, and when to use it vs similar tools. C) Implement a routing layer that pre-selects the tool from detected keywords. D) Consolidate both into one `lookup_entity` tool.
correct: B (1)
whyCorrect: Tool descriptions are the primary mechanism for selection; minimal descriptions are the root cause — a low-effort, high-leverage fix.
whyOthers: A adds token overhead without fixing the root cause; C over-engineers and bypasses NLU; D is a heavier architectural change than a "first step" warrants.

**SQ3 — domain d5 · scenario "Customer Support Resolution Agent"**
Stem: The agent hits 55% first-contact resolution (target 80%). It escalates straightforward cases yet tries to autonomously handle complex policy-exception cases. Most effective way to improve escalation calibration?
Options: A) Add explicit escalation criteria to the system prompt with few-shot examples of when to escalate vs resolve. B) Have the agent self-report a 1–10 confidence score and auto-route below a threshold. C) Train a separate classifier on historical tickets to predict escalation. D) Use sentiment analysis to escalate on negative sentiment.
correct: A (0)
whyCorrect: The root cause is unclear decision boundaries — explicit criteria + few-shot is the proportionate first fix.
whyOthers: B — LLM self-reported confidence is poorly calibrated (already wrongly confident on hard cases); C — over-engineered before prompt optimization; D — sentiment doesn't correlate with case complexity.

**SQ4 — domain d3 · scenario "Code Generation with Claude Code"**
Stem: You want a custom `/review` slash command available to every developer who clones/pulls the repo. Where do you create it?
Options: A) `.claude/commands/` in the project repo. B) `~/.claude/commands/` in each developer's home dir. C) The root `CLAUDE.md`. D) A `.claude/config.json` with a `commands` array.
correct: A (0)
whyCorrect: Project-scoped commands live in `.claude/commands/` — version-controlled and shared on clone/pull.
whyOthers: B is personal (not shared); C is for instructions/context, not command definitions; D describes a mechanism that doesn't exist.

**SQ5 — domain d3 · scenario "Code Generation with Claude Code"**
Stem: You must restructure a monolith into microservices — dozens of files, decisions about service boundaries and module dependencies. Which approach?
Options: A) Enter plan mode to explore the codebase, understand dependencies, and design before changing. B) Start direct execution and let implementation reveal boundaries. C) Direct execution with comprehensive upfront instructions. D) Begin in direct execution and switch to plan mode only if complexity emerges.
correct: A (0)
whyCorrect: Plan mode is designed for large-scale, multi-approach, architectural, multi-file work — exactly this.
whyOthers: B risks costly late rework; C assumes the structure is already known; D ignores that the complexity is already stated, not emergent.

**SQ6 — domain d3 · scenario "Code Generation with Claude Code"**
Stem: Distinct areas have different conventions; test files (e.g. `Button.test.tsx`) are spread throughout, and you want all tests to follow the same conventions regardless of location. Most maintainable way for Claude to auto-apply the right conventions?
Options: A) `.claude/rules/` files with YAML frontmatter glob patterns scoping conventions by file path. B) Consolidate everything in root `CLAUDE.md` under headers, relying on inference. C) Skills in `.claude/skills/` per code type. D) A separate `CLAUDE.md` in each subdirectory.
correct: A (0)
whyCorrect: `.claude/rules/` with glob patterns (e.g. `**/*.test.tsx`) auto-applies by path regardless of directory — ideal for spread-out test files.
whyOthers: B relies on inference (unreliable); C needs manual/iffy invocation (not deterministic "automatic"); D is directory-bound, so it can't cover files spread across many dirs.

**SQ7 — domain d1 · scenario "Multi-Agent Research System"**
Stem: For "impact of AI on creative industries", every subagent succeeds but the report covers only visual arts (missing music, writing, film). The coordinator decomposed into "AI in digital art", "AI in graphic design", "AI in photography". Most likely root cause?
Options: A) The synthesis agent lacks gap-identification instructions. B) The coordinator's task decomposition is too narrow, so subagent assignments don't cover all relevant domains. C) The web search agent's queries aren't comprehensive enough. D) The document analysis agent over-filters non-visual sources.
correct: B (1)
whyCorrect: The logs show the decomposition itself omitted whole sectors; subagents executed their (too-narrow) assignments correctly.
whyOthers: A, C, D blame downstream agents that worked correctly within the scope they were given.

**SQ8 — domain d5 · scenario "Multi-Agent Research System"**
Stem: The web-search subagent times out. How should failure flow back to the coordinator for best recovery?
Options: A) Return structured error context: failure type, attempted query, partial results, alternative approaches. B) Auto-retry with backoff inside the subagent, then return a generic "search unavailable" after retries. C) Catch the timeout and return an empty result set marked successful. D) Propagate the exception to a top-level handler that terminates the whole workflow.
correct: A (0)
whyCorrect: Structured error context lets the coordinator decide intelligently (retry, alternative, or proceed with partial results).
whyOthers: B hides context behind a generic status; C masks failure as success (no recovery, incomplete output); D needlessly kills the whole workflow.

**SQ9 — domain d2 · scenario "Multi-Agent Research System"**
Stem: The synthesis agent often needs to verify claims; today it round-trips through the coordinator to the web-search agent (+40% latency). 85% are simple fact-checks, 15% need deep investigation. Best approach to cut overhead while keeping reliability?
Options: A) Give the synthesis agent a scoped `verify_fact` tool for simple lookups; complex verifications still delegate via the coordinator. B) Batch all verification needs to the coordinator at the end of the pass. C) Give the synthesis agent full access to all web-search tools. D) Have the web-search agent pre-cache extra context speculatively.
correct: A (0)
whyCorrect: Least-privilege — give the synthesis agent exactly what the 85% case needs, keep coordination for complex cases.
whyOthers: B creates blocking dependencies (later steps may need earlier verified facts); C over-provisions and violates separation of concerns; D relies on unreliable speculative caching.

**SQ10 — domain d3 · scenario "Claude Code for Continuous Integration"**
Stem: A CI job runs `claude "Analyze this pull request for security issues"` but hangs waiting for interactive input. Correct way to run Claude Code in an automated pipeline?
Options: A) Add the `-p` flag: `claude -p "..."`. B) Set `CLAUDE_HEADLESS=true`. C) Redirect stdin from `/dev/null`. D) Add a `--batch` flag.
correct: A (0)
whyCorrect: `-p`/`--print` is the documented non-interactive mode: process prompt, print to stdout, exit.
whyOthers: B and D reference non-existent features; C is a Unix workaround that doesn't address Claude Code's command syntax.

**SQ11 — domain d4 · scenario "Claude Code for Continuous Integration"**
Stem: Two workflows use real-time Claude: (1) a blocking pre-merge check developers wait on, and (2) an overnight technical-debt report. A manager proposes switching both to the Message Batches API for 50% savings. How to evaluate?
Options: A) Use batch only for the overnight debt reports; keep real-time for pre-merge checks. B) Switch both to batch with status polling. C) Keep real-time for both to avoid batch ordering issues. D) Switch both to batch with a timeout fallback to real-time.
correct: A (0)
whyCorrect: Batch saves 50% but has up to 24h turnaround / no latency SLA — unfit for blocking pre-merge checks, ideal for overnight jobs.
whyOthers: B — "often faster" isn't acceptable for blocking work; C — batch results correlate via `custom_id` (the ordering concern is a misconception); D — needless complexity vs matching each API to its use case.

**SQ12 — domain d4 · scenario "Claude Code for Continuous Integration"**
Stem: A 14-file PR review in a single pass is inconsistent: detailed for some files, superficial for others, misses obvious bugs, and gives contradictory feedback (flagging a pattern in one file, approving identical code elsewhere). How to restructure?
Options: A) Split into focused passes: analyze each file individually for local issues, then a separate integration pass for cross-file data flow. B) Require developers to split large PRs into 3–4 file submissions. C) Switch to a higher-tier model with a larger context window. D) Run three independent passes and only flag issues appearing in ≥2 runs.
correct: A (0)
whyCorrect: Addresses the root cause — attention dilution. Per-file passes ensure consistent depth; a separate integration pass catches cross-file issues.
whyOthers: B shifts burden to developers; C — larger context doesn't fix attention quality; D suppresses real bugs caught only intermittently.
</specifics>

<deferred>
## Deferred Ideas

- SRS scheduling / study-session interactions → Phase 3.
- Quiz runner, timer, scoring (100–1000, pass 720), results, history → Phase 4.
- In-app content editor / import-export (JSON/CSV) → v2 (CMS-01/02), out of scope.
</deferred>

---

*Phase: 02-exam-content*
*Context gathered: 2026-06-10 (orchestrator-captured from exam guide + design handoff)*
