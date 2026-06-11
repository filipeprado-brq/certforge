---
phase: 06-question-bank-expansion
plan: "02"
subsystem: data/questions
tags: [questions, domain-d1, domain-d2, scenarios, snippets]
dependency_graph:
  requires: ["06-01"]
  provides: ["q29-q67 authored"]
  affects: ["src/data/questions.ts", "content.test.ts d1/d2 gates"]
tech_stack:
  added: []
  patterns: ["exam-style 1-correct+3-plausible questions", "hasSnippet inline code/config", "@import CLAUDE.md modular patterns"]
key_files:
  created: []
  modified:
    - src/data/questions.ts
decisions:
  - "39 new questions appended (q29-q51 D1, q52-q67 D2); total bank reaches 79"
  - "hasSnippet:true applied to 7 questions covering stop_reason, AgentDefinition/Task, CLAUDE.md @import, .mcp.json/${ENV}, tool_choice"
  - "Customer Support scenario buffered to 9 (+3 new); Developer Productivity at 5 (+3 new); Multi-Agent +1"
  - "All snippets respect no-fetch caveat: no fetch(, import(, axios, XHR"
metrics:
  duration: "~25 min"
  completed: "2026-06-11"
  tasks_completed: 2
  files_modified: 1
---

# Phase 6 Plan 02: D1+D2 Question Bank Expansion Summary

**One-liner:** 39 exam-style questions (q29-q67) authored for D1 (agentic architecture) and D2 (tool design/MCP), with 7 inline code/config snippet questions, 3 Customer Support and 3 Developer Productivity scenario tags, pushing d1=34 and d2=23.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author 23 new Domain 1 questions (q29-q51) | ef242c2 | src/data/questions.ts |
| 2 | Author 16 new Domain 2 questions (q52-q67) | ef242c2 | src/data/questions.ts |

Both tasks were committed together since the acceptance criteria for Task 2 depend on the combined file state.

## What Was Built

**Domain 1 questions (q29-q51, 23 total):**
- q29: Agent vs deterministic workflow selection (fixed steps = workflow)
- q30: Parallelization for independent subtasks
- q31: HITL approval gate for escalation emails (CS scenario)
- q32: Router catch-all for out-of-distribution inputs
- q33: Prompt chaining vs multi-agent for fixed-sequence pipelines
- q34: stop_reason "tool_use" agentic loop (hasSnippet)
- q35: Structured error results from timed-out tool calls
- q36: Least-privilege credit tool split with approval token (CS scenario)
- q37: AgentDefinition/allowedTools/"Task" for recursive subagent spawning (hasSnippet)
- q38: Orchestrator conflict resolution from divergent workers (Multi-Agent scenario)
- q39: Deterministic enforcement over prompt for delete guardrail
- q40: Max-step budget + coherence checkpoint for agentic loops
- q41: Least-privilege tool access for a news-summarizer subagent
- q42: Dependency-aware parallel worker dispatch
- q43: CLAUDE.md @import directives for modular project memory (CS scenario, hasSnippet)
- q44: When recursive delegation is appropriate
- q45: Pipeline stage output validation gates
- q46: Risk-tiered human approval for agentic pipelines
- q47: Why context isolation matters across subagents
- q48: Evaluator-optimizer oscillation caused by vague rubrics
- q49: Single large-context agent vs orchestrator-worker tradeoff
- q50: Named-artifact chain of custody for compliance pipelines
- q51: HITL placement matched to risk profile (delete vs read)

**Domain 2 questions (q52-q67, 16 total):**
- q52: Tool description precision as highest-leverage fix for selection errors
- q53: .mcp.json ${ENV} variable expansion (hasSnippet)
- q54: tool_choice {type:"tool",name:"..."} forced invocation (hasSnippet)
- q55: MCP tools (callable actions) vs MCP resources (read-only data)
- q56: Disambiguating specific vs general tool via description update
- q57: Project-scoped .mcp.json for team-wide MCP config (DevProd scenario)
- q58: Minimum-viable tool response design (strip unused columns)
- q59: CLAUDE.md @import modular composition (DevProd scenario, hasSnippet)
- q60: tool_choice "any" for guaranteed-but-flexible tool invocation
- q61: isError/errorCategory category-specific recovery logic
- q62: Few-shot vs zero-shot for schema compliance tasks
- q63: System-prompt citation constraint for provenance (DevProd scenario)
- q64: User-level vs project-level MCP scope causing missing tools
- q65: Stripping debug metadata from tool results
- q66: tool_choice "auto" allowing text-only response (hasSnippet)
- q67: XML provenance tagging for cross-file attribution accuracy

## Acceptance Criteria Results

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| q29-q51 range present | both exist | both exist | PASS |
| q29-q51 unique count | 23 | 23 | PASS |
| q52-q67 range present | both exist | both exist | PASS |
| q52-q67 unique count | 16 | 16 | PASS |
| domain d1 count | >=34 | 34 | PASS |
| domain d2 count | >=23 | 23 | PASS |
| Customer Support scenario | >=9 | 9 | PASS |
| Developer Productivity scenario | >=5 | 5 | PASS |
| hasSnippet: true count | >=6 | 7 | PASS |
| no-fetch caveat (fetch/import/axios/XHR) | none | none | PASS |
| npm run typecheck | exit 0 | exit 0 | PASS |
| d1 >= 32 test gate | GREEN | GREEN | PASS |
| d2 >= 22 test gate | GREEN | GREEN | PASS |

**Remaining RED gates (expected — to be closed in later plans):**
- d3/d4/d5 per-domain minimums (q68+ not yet authored)
- Total questions >= 120 (79 of 120 done)
- Scenario coverage for Code Gen, CI, Structured Data, DevProd >= 8 (pending later plans)
- hasSnippet >= 15 (7 of 15 done)

## Deviations from Plan

None. Plan executed exactly as written. Tasks 1 and 2 were committed in a single atomic commit since their acceptance criteria interlock (Task 2 checks total d1 count which includes Task 1 work).

## Known Stubs

None. All 39 questions are fully authored with non-empty stem, 4 options, correct index, whyCorrect, and whyOthers.

## Threat Flags

None. This plan only modifies static data (questions.ts) — no new network endpoints, auth paths, or schema changes.

## Self-Check: PASSED

- `src/data/questions.ts` exists and has 39 new questions
- Commit ef242c2 exists in git log
- d1 count = 34, d2 count = 23 (both above minimums)
- hasSnippet = 7 (above >=6 target for this plan)
- Customer Support = 9, Developer Productivity = 5
- No forbidden substrings in snippets
