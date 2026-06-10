// =============================================================================
// Flashcard deck — seed (f1–f15) + expanded deck to per-domain weight minimums
// =============================================================================

import type { Flashcard } from './types'

export const FLASHCARDS: Flashcard[] = [
  // ---------------------------------------------------------------------------
  // D1 — Agentic Architecture & Orchestration (seed: 4, target: ≥13)
  // ---------------------------------------------------------------------------
  {
    id: 'f1',
    domain: 'd1',
    front: 'Orchestrator–worker pattern',
    back: 'A lead agent decomposes a task and delegates subtasks to specialized worker agents, then synthesizes their results. Use when subtasks are parallelizable and benefit from isolated context windows.',
  },
  {
    id: 'f2',
    domain: 'd1',
    front: 'When should you choose a workflow over an agent?',
    back: 'When the task decomposes into a fixed, predictable sequence of steps. Workflows (prompt chaining, routing, parallelization) are cheaper, faster, and more testable; reserve autonomous agents for open-ended tasks where the path can\'t be known in advance.',
  },
  {
    id: 'f3',
    domain: 'd1',
    front: 'Subagent context isolation',
    back: 'Each subagent gets its own context window. The orchestrator passes only the task brief and receives only the distilled result — protecting the main context from intermediate noise and enabling longer overall trajectories.',
  },
  {
    id: 'f4',
    domain: 'd1',
    front: 'Stop conditions for autonomous loops',
    back: 'Every agent loop needs explicit termination criteria: max iterations, budget caps, success checks, or human approval gates. Unbounded loops are the most common cause of runaway cost and drift.',
  },
  // --- new D1 flashcards (f16–f24) ---
  {
    id: 'f16',
    domain: 'd1',
    front: 'Evaluator–optimizer pattern',
    back: 'One model (or pass) generates a candidate output; a separate evaluator critiques it against explicit rubrics; a third (or the same) optimizer refines based on the critique. Separate generation from evaluation to avoid self-reinforcing blind spots.',
  },
  {
    id: 'f17',
    domain: 'd1',
    front: 'Human-in-the-loop (HITL) gates',
    back: 'Pause points where an agent suspends, surfaces its plan or result to a human, and only proceeds after explicit approval. Essential for irreversible actions (payments, deployments, deletions) where an autonomous mistake has high cost.',
  },
  {
    id: 'f18',
    domain: 'd1',
    front: 'Prompt chaining',
    back: 'A workflow pattern where the output of one LLM call becomes the input of the next. Steps are fixed at design time; each step can validate the previous result before passing it on — making complex pipelines predictable and testable.',
  },
  {
    id: 'f19',
    domain: 'd1',
    front: 'Routing workflow',
    back: 'A classifier step determines which downstream specialist or branch handles the request. Use when request types are known and distinct, and each type needs a different prompt, toolset, or model tier.',
  },
  {
    id: 'f20',
    domain: 'd1',
    front: 'Parallelization workflow',
    back: 'Multiple independent LLM calls run concurrently (fan-out), and their results are aggregated (fan-in). Useful for subtasks with no data dependency — cuts wall-clock time proportional to the number of parallel branches.',
  },
  {
    id: 'f21',
    domain: 'd1',
    front: 'Task handoff between agents',
    back: 'When an orchestrator transfers a subtask to a specialist worker, it packages the exact context the worker needs (no more, no less). The worker returns a distilled result, not raw intermediate state — keeping the orchestrator\'s context lean.',
  },
  {
    id: 'f22',
    domain: 'd1',
    front: 'Budget caps as stop conditions',
    back: 'Setting a maximum token, API-call, or cost budget before an agent loop starts ensures runaway iteration is bounded. Budget exhaustion should produce a partial result with a clear "budget exceeded" status rather than silent truncation.',
  },
  {
    id: 'f23',
    domain: 'd1',
    front: 'When autonomous agents are appropriate',
    back: 'Choose autonomous agents when (1) the sequence of steps cannot be predetermined, (2) the task requires adaptive decision-making mid-flight, or (3) open-ended research or exploration is needed. Otherwise, prefer deterministic workflows.',
  },
  {
    id: 'f24',
    domain: 'd1',
    front: 'Agent memory types',
    back: 'In-context memory (current conversation window), external memory (retrieved from a database or vector store), and procedural memory (skills/tools available). Managing what lives where is key to long-horizon agent trajectories.',
  },

  // ---------------------------------------------------------------------------
  // D2 — Tool Design & MCP Integration (seed: 3, target: ≥9)
  // ---------------------------------------------------------------------------
  {
    id: 'f5',
    domain: 'd2',
    front: 'Model Context Protocol (MCP)',
    back: 'An open standard for connecting AI applications to external tools and data sources. Servers expose tools, resources, and prompts; clients (like Claude) discover and invoke them over a standard transport.',
  },
  {
    id: 'f6',
    domain: 'd2',
    front: 'What makes a good tool description?',
    back: 'Written for the model, not the developer: state what the tool does, when to use it, parameter semantics, and what it returns — including edge cases. Ambiguous descriptions are the top cause of wrong tool calls.',
  },
  {
    id: 'f7',
    domain: 'd2',
    front: 'Tool result size discipline',
    back: 'Return the minimum the model needs — paginate, filter, and summarize server-side. Dumping raw payloads into context wastes tokens and buries the signal the model must act on.',
  },
  // --- new D2 flashcards (f25–f30) ---
  {
    id: 'f25',
    domain: 'd2',
    front: 'MCP resources vs. tools',
    back: 'Resources are read-only data exposed by the server (files, records, feeds) that the client can embed in context. Tools are callable functions that may have side effects. Distinguish them: resources inform, tools act.',
  },
  {
    id: 'f26',
    domain: 'd2',
    front: 'MCP prompts',
    back: 'Reusable, parameterized prompt templates exposed by an MCP server. Clients retrieve and render them, letting server authors provide well-tested system-prompt fragments without baking them into each client.',
  },
  {
    id: 'f27',
    domain: 'd2',
    front: 'Structured error shapes in tool responses',
    back: 'When a tool fails, return a structured error object: error type, human-readable message, partial results if available, and suggested recovery steps. Generic "error occurred" responses force the model to guess recovery strategy.',
  },
  {
    id: 'f28',
    domain: 'd2',
    front: 'Least-privilege tool access',
    back: 'Give each agent or subagent only the tools it needs for its specific subtask — not the full toolset. Over-provisioning broadens the blast radius of prompt injection and increases cognitive load (more tools = more selection decisions).',
  },
  {
    id: 'f29',
    domain: 'd2',
    front: 'Pagination in tool responses',
    back: 'Tools that return large result sets should paginate: return a page of results plus a cursor. The model requests further pages on demand, keeping each tool result small and context-window-friendly.',
  },
  {
    id: 'f30',
    domain: 'd2',
    front: 'Tool schema parameter descriptions',
    back: 'Every parameter in a tool\'s JSON schema should include a description stating its purpose, expected format, valid range, and how it relates to other parameters. Missing parameter descriptions cause wrong arguments as often as missing tool descriptions.',
  },

  // ---------------------------------------------------------------------------
  // D3 — Claude Code Configuration & Workflows (seed: 3, target: ≥10)
  // ---------------------------------------------------------------------------
  {
    id: 'f8',
    domain: 'd3',
    front: 'CLAUDE.md',
    back: 'A project-level memory file Claude Code reads at session start. Use it for build commands, conventions, architecture notes, and persistent instructions — anything you\'d otherwise repeat every session.',
  },
  {
    id: 'f9',
    domain: 'd3',
    front: 'Claude Code hooks',
    back: 'User-defined shell commands that fire on lifecycle events (e.g. PreToolUse, PostToolUse, Stop). Use them to enforce policy deterministically — lint, block dangerous commands, format on save — instead of hoping the model complies.',
  },
  {
    id: 'f10',
    domain: 'd3',
    front: 'Headless mode (claude -p)',
    back: 'Runs Claude Code non-interactively for scripting and CI: pass a prompt, get output, exit. Combine with --output-format json and restricted tool permissions for safe pipeline use.',
  },
  // --- new D3 flashcards (f31–f37) ---
  {
    id: 'f31',
    domain: 'd3',
    front: 'Slash commands in Claude Code',
    back: 'Custom commands defined in `.claude/commands/` (project-scoped) or `~/.claude/commands/` (personal). Each command is a Markdown file invoked via `/command-name`; project commands are version-controlled and shared with all repo contributors.',
  },
  {
    id: 'f32',
    domain: 'd3',
    front: 'Claude Code rules globs',
    back: 'Rules files in `.claude/rules/` carry YAML frontmatter with a `globs` field (e.g. `**/*.test.tsx`). When a file matching the glob is in scope, Claude Code auto-applies those rules — regardless of where the file lives in the repo.',
  },
  {
    id: 'f33',
    domain: 'd3',
    front: 'Plan mode in Claude Code',
    back: 'An exploration mode (activated via the UI or `/plan`) where Claude reads and reasons about the codebase without making changes. Use it before large-scale refactors, architectural changes, or any task where the optimal approach isn\'t yet clear.',
  },
  {
    id: 'f34',
    domain: 'd3',
    front: 'Tool permission scoping in Claude Code',
    back: 'Each Claude Code session can restrict which tools are allowed. In CI/headless contexts, restrict to read-only or minimal write tools. Permissions are declared per-invocation, not globally, so pipelines can grant only what each step needs.',
  },
  {
    id: 'f35',
    domain: 'd3',
    front: 'PreToolUse hooks for policy enforcement',
    back: 'A PreToolUse hook fires before every tool execution. Return a non-zero exit code (or a deny JSON) to block the call entirely — giving deterministic, model-independent enforcement of commands that must never run (e.g. `rm -rf`, `git push --force`).',
  },
  {
    id: 'f36',
    domain: 'd3',
    front: 'CLAUDE.md hierarchy',
    back: 'CLAUDE.md files are loaded hierarchically: repo root, then project subdirectory (if present), then user-global (~/.claude/CLAUDE.md). More-specific files supplement (not replace) ancestor instructions.',
  },
  {
    id: 'f37',
    domain: 'd3',
    front: 'Output format flag (--output-format json)',
    back: 'In headless mode, --output-format json makes Claude Code emit a structured JSON object instead of prose, making it machine-parseable for downstream pipeline steps. Pair with -p for fully scripted operation.',
  },

  // ---------------------------------------------------------------------------
  // D4 — Prompt Engineering & Structured Output (seed: 3, target: ≥10)
  // ---------------------------------------------------------------------------
  {
    id: 'f11',
    domain: 'd4',
    front: 'Prefilling the assistant response',
    back: 'Starting the assistant turn with fixed text (e.g. "{") to constrain format. A lightweight way to force JSON-only output or skip preambles without extra instructions.',
  },
  {
    id: 'f12',
    domain: 'd4',
    front: 'XML tags in prompts',
    back: 'Claude is trained to attend to XML-style tags. Use them to delimit instructions, documents, and examples (<instructions>, <doc>, <example>) so content can\'t bleed into directives.',
  },
  {
    id: 'f13',
    domain: 'd4',
    front: 'Few-shot examples vs instructions',
    back: 'Examples beat descriptions for format fidelity. 3–5 diverse, edge-case-covering examples typically outperform long prose rules — and are easier to maintain.',
  },
  // --- new D4 flashcards (f38–f44) ---
  {
    id: 'f38',
    domain: 'd4',
    front: 'Prompt injection defense',
    back: 'Wrap untrusted user/document content in labeled XML tags (<user_input>, <document>) and explicitly instruct Claude that content inside those tags is data to process, not instructions to follow. This structural separation is the primary defense.',
  },
  {
    id: 'f39',
    domain: 'd4',
    front: 'Output schemas for structured extraction',
    back: 'Define a JSON schema (or TypeScript interface) in the prompt alongside few-shot examples. The schema sets the contract; the examples demonstrate edge cases. Together they produce reliably parseable output without post-hoc regex hacks.',
  },
  {
    id: 'f40',
    domain: 'd4',
    front: 'Message Batches API',
    back: 'An asynchronous Claude API for processing many prompts at once at ~50% cost savings with up to 24-hour turnaround. Best for overnight jobs, bulk classification, or any workload where latency is not required in real time.',
  },
  {
    id: 'f41',
    domain: 'd4',
    front: 'System prompt vs. user turn for instructions',
    back: 'System prompts set role, capabilities, constraints, and output contract — established by the operator. User turns carry per-request inputs. Putting policy in the system prompt means it persists across turns and is harder to override via user messages.',
  },
  {
    id: 'f42',
    domain: 'd4',
    front: 'Temperature and top-p for structured tasks',
    back: 'For deterministic structured output (extraction, classification), use temperature 0. For creative generation, raise temperature. Top-p (nucleus sampling) further controls diversity. Neither substitutes for a good prompt schema + examples.',
  },
  {
    id: 'f43',
    domain: 'd4',
    front: 'Chain-of-thought prompting',
    back: 'Instructing Claude to reason step-by-step before answering (via "think step by step" or a scratchpad tag) improves accuracy on multi-step problems. The reasoning is part of the output and can be trimmed from the final user-visible response.',
  },
  {
    id: 'f44',
    domain: 'd4',
    front: 'Role framing in system prompts',
    back: 'Assigning a specific role ("You are a senior code reviewer…") shapes Claude\'s register, depth, and defaults. Role framing is most effective when combined with explicit task instructions — a role alone is not a substitute for a clear task description.',
  },

  // ---------------------------------------------------------------------------
  // D5 — Context Management & Reliability (seed: 2, target: ≥8)
  // ---------------------------------------------------------------------------
  {
    id: 'f14',
    domain: 'd5',
    front: 'Context compaction',
    back: 'Summarizing or pruning earlier turns to stay within the context window on long trajectories. Compact at natural boundaries (completed subtasks) and preserve decisions, constraints, and open questions.',
  },
  {
    id: 'f15',
    domain: 'd5',
    front: 'Grounded answers & citations',
    back: 'To reduce hallucination, require the model to quote or cite retrieved sources, allow "I don\'t know", and verify high-stakes claims with a second pass or external check.',
  },
  // --- new D5 flashcards (f45–f50) ---
  {
    id: 'f45',
    domain: 'd5',
    front: 'Structured error context for multi-agent recovery',
    back: 'When a subagent fails, it should return a rich error object: failure type, what was attempted, any partial results, and suggested recovery paths. The coordinator can then decide intelligently — retry, fallback, or continue with partial data.',
  },
  {
    id: 'f46',
    domain: 'd5',
    front: 'Retry strategies for transient failures',
    back: 'For transient tool errors (network timeouts, rate limits), implement exponential backoff with jitter at the orchestration layer, not silently inside the model turn. Surface the retry count and delay in structured error context so the orchestrator can cap retries.',
  },
  {
    id: 'f47',
    domain: 'd5',
    front: 'Context window budget allocation',
    back: 'Allocate the context window deliberately: reserve space for system prompt + instructions, document/tool results, conversation history, and output. When documents are large, trim or summarize them before insertion rather than filling the window and hoping for the best.',
  },
  {
    id: 'f48',
    domain: 'd5',
    front: 'Attention dilution in large contexts',
    back: 'As context grows, model attention spreads across more tokens and detail near the middle of long inputs can be missed. Mitigation: split large tasks into focused passes, compact completed work, and put the most critical instructions at the beginning or end.',
  },
  {
    id: 'f49',
    domain: 'd5',
    front: 'Provenance and claim sourcing',
    back: 'Requiring Claude to attribute every factual claim to a specific source passage ("per §3.2 of [doc]") prevents hallucination by construction — the model can only assert what it can point to. Pair with an explicit "say so if not covered" escape hatch.',
  },
  {
    id: 'f50',
    domain: 'd5',
    front: 'Batch vs. sync API selection',
    back: 'Use the Batches API for workloads that tolerate up to 24-hour latency (bulk processing, overnight reports) — saves ~50% cost. Use real-time (sync) for any user-facing or blocking workflow where latency matters. Mixing them for the same workload type adds unnecessary complexity.',
  },
]
