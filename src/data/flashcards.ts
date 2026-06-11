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

  // ---------------------------------------------------------------------------
  // D1 — Agentic Architecture & Orchestration (NEW: f51–f80, taskRef 1.1–1.7)
  // ---------------------------------------------------------------------------

  // 1.1 Agentic loop lifecycle
  {
    id: 'f51',
    domain: 'd1',
    taskRef: '1.1',
    front: 'What stop_reason signals that the model wants to call a tool?',
    back: 'When the API returns `stop_reason: "tool_use"`, the model has emitted one or more tool-call blocks. The loop must execute those tools, append the results as `tool_result` content blocks, and call the API again.',
  },
  {
    id: 'f52',
    domain: 'd1',
    taskRef: '1.1',
    front: 'What stop_reason signals the agentic loop should terminate?',
    back: '`stop_reason: "end_turn"` means the model has finished reasoning and does not need another tool call. The loop exits, and the final assistant message is the result.',
  },
  {
    id: 'f53',
    domain: 'd1',
    taskRef: '1.1',
    front: 'How do you correctly feed tool results back into the agentic loop?',
    back: 'After executing a tool, append a `tool_result` content block to the messages array using the matching `tool_use_id`. Then send the updated messages to the API. Never discard intermediate tool exchanges — the full history is required for coherent multi-step reasoning.',
  },
  {
    id: 'f54',
    domain: 'd1',
    taskRef: '1.1',
    front: 'Anti-pattern: parsing natural language to detect loop termination',
    back: 'Scanning the assistant response text for phrases like "done" or "task complete" is brittle. Always use the structured `stop_reason` field; natural-language termination detection produces false exits and missed completions.',
  },
  {
    id: 'f55',
    domain: 'd1',
    taskRef: '1.1',
    front: 'Anti-pattern: arbitrary iteration caps in agentic loops',
    back: 'Hard-capping iterations at an arbitrary number (e.g. 10) without a semantic stop condition causes premature termination. Set iteration limits as a safety backstop only; the primary exit should be `stop_reason: "end_turn"` or an explicit success check.',
  },

  // 1.2 Coordinator–subagent orchestration
  {
    id: 'f56',
    domain: 'd1',
    taskRef: '1.2',
    front: 'Hub-and-spoke orchestration pattern',
    back: 'A central coordinator (hub) receives the user request, decomposes it, dispatches subtasks to specialist subagents (spokes), and synthesizes their outputs. All communication flows through the hub — subagents never talk to each other directly.',
  },
  {
    id: 'f57',
    domain: 'd1',
    taskRef: '1.2',
    front: 'Why is subagent context isolated from the coordinator?',
    back: 'Each subagent starts with a clean context window containing only the brief the coordinator provided. This protects the coordinator from intermediate noise, enables longer total trajectories, and allows subagents to be replaced or rerun without polluting shared state.',
  },
  {
    id: 'f58',
    domain: 'd1',
    taskRef: '1.2',
    front: 'Dynamic subagent selection',
    back: 'The coordinator chooses which subagent to invoke based on the current task state, not a fixed sequence. This allows adaptive orchestration — routing to a researcher, then a summarizer, then a validator — based on intermediate results.',
  },
  {
    id: 'f59',
    domain: 'd1',
    taskRef: '1.2',
    front: 'Partition scope to avoid duplicate subagent work',
    back: 'Assign disjoint scopes to parallel subagents (e.g. file ranges, data shards) so they never process the same input. Overlapping scope wastes compute and risks conflicting outputs that are hard to reconcile.',
  },
  {
    id: 'f60',
    domain: 'd1',
    taskRef: '1.2',
    front: 'Iterative refinement in multi-agent loops',
    back: 'After a subagent produces a draft, the coordinator can route it to an evaluator subagent, then back to the generator with critique. This evaluator–optimizer cycle is a structured form of multi-agent iterative refinement.',
  },

  // 1.3 Subagent invocation / context passing
  {
    id: 'f61',
    domain: 'd1',
    taskRef: '1.3',
    front: 'Prerequisite for using the Task tool in Claude Code',
    back: 'The Task tool (which spawns a subagent) is only available when `"Task"` is listed in `allowedTools` for the session. Omitting it from the allowed list silently prevents subagent spawning.',
  },
  {
    id: 'f62',
    domain: 'd1',
    taskRef: '1.3',
    front: 'Does a subagent automatically inherit the coordinator\'s context?',
    back: 'No. Subagents start with an empty context window. The coordinator must explicitly include all relevant information — task description, constraints, prior findings — in the prompt passed to the Task tool.',
  },
  {
    id: 'f63',
    domain: 'd1',
    taskRef: '1.3',
    front: 'AgentDefinition in the Claude API',
    back: 'An `AgentDefinition` object specifies a subagent\'s system prompt, tools, and model when invoking the Task tool programmatically. It lets the coordinator configure the subagent\'s capabilities precisely for its subtask.',
  },
  {
    id: 'f64',
    domain: 'd1',
    taskRef: '1.3',
    front: 'How do multiple parallel Task calls work in one turn?',
    back: 'The coordinator can emit multiple `tool_use` blocks for the Task tool in a single assistant turn. Claude Code executes them concurrently and returns all results in the next user turn, enabling fan-out parallelism without sequential round trips.',
  },
  {
    id: 'f65',
    domain: 'd1',
    taskRef: '1.3',
    front: 'Goal-not-procedure prompts for subagents',
    back: 'Describe what the subagent should achieve, not exactly how to do it. Procedure-heavy prompts prevent subagents from adapting to unexpected intermediate results; goal-oriented prompts let them apply the right steps for the actual situation.',
  },

  // 1.4 Multi-step workflow enforcement / handoff
  {
    id: 'f66',
    domain: 'd1',
    taskRef: '1.4',
    front: 'Programmatic prerequisite gates vs. prompt guidance',
    back: 'Prompt guidance ("check that step A is done before step B") is probabilistic — the model may skip it. Programmatic gates verify completion state in code before allowing the next step, providing deterministic workflow enforcement.',
  },
  {
    id: 'f67',
    domain: 'd1',
    taskRef: '1.4',
    front: 'Why is programmatic enforcement required for financial operations?',
    back: 'Financial workflows (refunds, transfers, billing) cannot rely on the model following prompt instructions. Code-level guards enforce amount limits, authorization checks, and audit logging independently of model behavior, meeting compliance requirements.',
  },
  {
    id: 'f68',
    domain: 'd1',
    taskRef: '1.4',
    front: 'Structured escalation handoff summary',
    back: 'When escalating to a human or downstream agent, include a structured summary with: customer id, root cause, what was attempted, and recommended next action. Unstructured free-text handoffs force recipients to re-investigate from scratch.',
  },
  {
    id: 'f69',
    domain: 'd1',
    taskRef: '1.4',
    front: 'Handoff vs. autonomous continuation decision',
    back: 'An agent should escalate (hand off) when it reaches a policy boundary, lacks authority for the next action, or detects that continuing would increase risk. The escalation decision should be deterministic, not left to model discretion.',
  },

  // 1.5 Agent SDK hooks
  {
    id: 'f70',
    domain: 'd1',
    taskRef: '1.5',
    front: 'PostToolUse hook for data normalization',
    back: 'A PostToolUse hook fires after every tool call and can rewrite the tool result before it enters the model\'s context. Use it to normalize heterogeneous data — converting Unix timestamps, ISO dates, and integer millis to a single uniform format.',
  },
  {
    id: 'f71',
    domain: 'd1',
    taskRef: '1.5',
    front: 'PreToolUse hook for policy enforcement',
    back: 'A PreToolUse hook intercepts a tool call before execution. Return a deny response to block it and redirect the model — e.g. blocking a refund tool call when the amount exceeds $500 and substituting a "requires manager approval" result.',
  },
  {
    id: 'f72',
    domain: 'd1',
    taskRef: '1.5',
    front: 'Hooks vs. prompt instructions for compliance',
    back: 'Hooks provide deterministic guarantees: a blocked tool call cannot proceed regardless of what the model intended. Prompt-based compliance instructions are probabilistic — the model may misapply or ignore them under distribution shift.',
  },
  {
    id: 'f73',
    domain: 'd1',
    taskRef: '1.5',
    front: 'Stop hook',
    back: 'A Stop hook fires when the agent loop is about to terminate. Use it to run cleanup, persist state, emit audit records, or perform post-completion validation — actions that must happen regardless of how the session ended.',
  },

  // 1.6 Task decomposition strategies
  {
    id: 'f74',
    domain: 'd1',
    taskRef: '1.6',
    front: 'Fixed prompt chaining vs. dynamic adaptive decomposition',
    back: 'Fixed chaining uses a predetermined sequence of LLM calls (plan → draft → review). Dynamic decomposition lets the agent generate its own subtask list based on the actual input. Use dynamic when the task structure is not knowable in advance.',
  },
  {
    id: 'f75',
    domain: 'd1',
    taskRef: '1.6',
    front: 'Per-file local pass + cross-file integration pass',
    back: 'A two-phase decomposition for codebase tasks: first process each file independently (local pass), then reconcile cross-file concerns like imports, types, and API contracts (integration pass). This partitions work without losing global coherence.',
  },
  {
    id: 'f76',
    domain: 'd1',
    taskRef: '1.6',
    front: 'Adaptive investigation plan',
    back: 'An initial plan that evolves based on findings at each step — rather than executing a fixed checklist. An agent starts with a hypothesis, tests it, and updates the remaining plan. Useful for debugging, security audits, and open-ended research.',
  },
  {
    id: 'f77',
    domain: 'd1',
    taskRef: '1.6',
    front: 'Granularity choice in task decomposition',
    back: 'Tasks decomposed too coarsely leave too much ambiguity per step; too finely, the coordination overhead and context fragmentation outweigh the benefits. Aim for subtasks whose outputs can be verified independently and combined cleanly.',
  },

  // 1.7 Session state / resumption / forking
  {
    id: 'f78',
    domain: 'd1',
    taskRef: '1.7',
    front: 'How do you resume a named Claude Code session?',
    back: 'Run `claude --resume <name>` to reopen a previous session by its saved name. The session history is restored, allowing the agent to continue where it left off without re-establishing context from scratch.',
  },
  {
    id: 'f79',
    domain: 'd1',
    taskRef: '1.7',
    front: 'fork_session for divergent branches',
    back: '`fork_session` creates an independent copy of the current session state. Use it to explore two alternative approaches from the same checkpoint without contaminating the original session — like a git branch for agent trajectories.',
  },
  {
    id: 'f80',
    domain: 'd1',
    taskRef: '1.7',
    front: 'New-session-with-summary vs. resume-with-stale-results',
    back: 'After a long pause or significant external change (files edited, dependencies updated), starting a fresh session with a handoff summary is safer than resuming, because resumed context may contain stale tool results or outdated assumptions.',
  },

  // ---------------------------------------------------------------------------
  // D2 — Tool Design & MCP Integration (NEW: f81–f100, taskRef 2.1–2.5)
  // ---------------------------------------------------------------------------

  // 2.1 Tool interface design
  {
    id: 'f81',
    domain: 'd2',
    taskRef: '2.1',
    front: 'Why are tool descriptions the primary selection mechanism?',
    back: 'Claude chooses which tool to call based primarily on the tool\'s description, not its name or parameter list. A precise description that states when and why to use the tool is more important than any other part of the tool definition.',
  },
  {
    id: 'f82',
    domain: 'd2',
    taskRef: '2.1',
    front: 'What must a good tool description include?',
    back: 'A complete tool description states: what the tool does, when to use it, expected input formats with examples, valid ranges and edge cases, and what the return value represents. Omitting edges or examples is the leading cause of wrong tool calls.',
  },
  {
    id: 'f83',
    domain: 'd2',
    taskRef: '2.1',
    front: 'Renaming/splitting tools to remove selection overlap',
    back: 'When two tools have overlapping use cases, Claude will pick inconsistently. Rename to be unambiguous (e.g. rename `analyze_content` to `extract_web_results`) or split into purpose-specific tools. Descriptions alone cannot fix fundamental name ambiguity.',
  },
  {
    id: 'f84',
    domain: 'd2',
    taskRef: '2.1',
    front: 'System-prompt keyword sensitivity in tool selection',
    back: 'Claude is sensitive to keywords in the system prompt when selecting tools. Mentioning a tool\'s domain in the system prompt (e.g. "use the Jira integration for issue tracking") biases selection toward that tool for relevant requests.',
  },

  // 2.2 Structured error responses
  {
    id: 'f85',
    domain: 'd2',
    taskRef: '2.2',
    front: 'MCP isError flag',
    back: 'MCP tool responses include an `isError` boolean. Set it to `true` when the tool failed so Claude knows the content is an error description, not a valid result. Without this flag, Claude may try to act on error text as if it were data.',
  },
  {
    id: 'f86',
    domain: 'd2',
    taskRef: '2.2',
    front: 'Four error categories for tool responses',
    back: 'Classify tool errors as: transient (retry may succeed), validation (bad input), business (policy violation), or permission (access denied). The category drives recovery strategy — retry, fix input, escalate, or request authorization.',
  },
  {
    id: 'f87',
    domain: 'd2',
    taskRef: '2.2',
    front: 'errorCategory + isRetryable + human-readable pattern',
    back: 'Structure tool error responses with at least three fields: `errorCategory` (from the taxonomy), `isRetryable` (boolean), and a human-readable `message`. This gives the orchestrator enough information to decide recovery strategy without guessing.',
  },
  {
    id: 'f88',
    domain: 'd2',
    taskRef: '2.2',
    front: 'Access-failure vs. valid-empty-result distinction',
    back: 'A tool that returns no results because the query matched nothing is a valid response. A tool that returns no results because of a permission or connectivity error is a failure. Conflating them causes the model to silently accept failures as empty datasets.',
  },

  // 2.3 Tool distribution + tool_choice
  {
    id: 'f89',
    domain: 'd2',
    taskRef: '2.3',
    front: 'How does providing too many tools degrade performance?',
    back: 'With 18 tools in scope, Claude must choose from a large decision space every turn — increasing selection errors, latency, and token cost. Narrowing to 4-5 task-relevant tools significantly improves selection accuracy and response quality.',
  },
  {
    id: 'f90',
    domain: 'd2',
    taskRef: '2.3',
    front: 'Scoped per-role toolsets',
    back: 'Assign each agent role only the tools it needs: a researcher gets search and read tools; a writer gets draft and edit tools. Scoping removes irrelevant options from the selection space and reduces the blast radius of misuse.',
  },
  {
    id: 'f91',
    domain: 'd2',
    taskRef: '2.3',
    front: 'tool_choice "auto" vs "any" vs forced',
    back: '`tool_choice: "auto"` lets Claude decide whether to call a tool. `"any"` forces a tool call but lets Claude choose which one. `{type: "tool", name: "X"}` forces a specific tool call. Use forced choice when the workflow requires a specific tool to run unconditionally.',
  },
  {
    id: 'f92',
    domain: 'd2',
    taskRef: '2.3',
    front: 'Scoped cross-role shared tool',
    back: 'Some tools (e.g. `verify_fact`) are useful across multiple agent roles but should not be in every role\'s default toolset. Provide them as explicit arguments at the coordinator level, injecting only when a subtask requires fact-checking.',
  },

  // 2.4 MCP server integration
  {
    id: 'f93',
    domain: 'd2',
    taskRef: '2.4',
    front: 'project .mcp.json vs. user ~/.claude.json for MCP servers',
    back: 'Project-level MCP servers are declared in `.mcp.json` at the repo root — version-controlled and shared with the team. User-level servers in `~/.claude.json` are personal and not committed. Project config takes precedence for repo-specific integrations.',
  },
  {
    id: 'f94',
    domain: 'd2',
    taskRef: '2.4',
    front: '${ENV} expansion in MCP configuration',
    back: 'MCP config files support `${ENV_VAR_NAME}` substitution for secrets and environment-specific values (API keys, URLs). This keeps credentials out of version control while allowing the config file itself to be committed.',
  },
  {
    id: 'f95',
    domain: 'd2',
    taskRef: '2.4',
    front: 'When are MCP tools discovered?',
    back: 'MCP tools are enumerated at connection time when Claude Code starts or when the MCP server connects. Tools added to a running server are not visible until reconnect. Dynamic tool sets require server restart or an explicit reconnect.',
  },
  {
    id: 'f96',
    domain: 'd2',
    taskRef: '2.4',
    front: 'Enhancing MCP tool descriptions to beat built-in tools',
    back: 'When a built-in tool (e.g. Grep) overlaps with an MCP tool (e.g. a Jira search server), Claude may default to the built-in. Write the MCP tool description to explicitly state what makes it superior for the target use case, making it win selection for that domain.',
  },

  // 2.5 Built-in tools
  {
    id: 'f97',
    domain: 'd2',
    taskRef: '2.5',
    front: 'Grep vs. Glob built-in tool distinction',
    back: 'Grep searches file contents for a text pattern; Glob matches file paths against a pattern. Use Grep to find where a function is called; use Glob to find all TypeScript test files. Conflating them causes empty results or scanning entire codebases unnecessarily.',
  },
  {
    id: 'f98',
    domain: 'd2',
    taskRef: '2.5',
    front: 'Read/Write (full) vs. Edit (unique-match)',
    back: 'The Edit tool requires its target string to be unique in the file — it fails on ambiguous matches. For safe targeted edits, use Read first to confirm uniqueness, then Edit. When uniqueness cannot be guaranteed, use Read + Write (full replacement) as the fallback.',
  },
  {
    id: 'f99',
    domain: 'd2',
    taskRef: '2.5',
    front: 'Incremental codebase understanding strategy',
    back: 'Start with Grep to find entry points (e.g. export statements or call sites), then Read the matched files to understand their imports, then follow the dependency chain. This targeted approach avoids loading the entire codebase into context.',
  },
  {
    id: 'f100',
    domain: 'd2',
    taskRef: '2.5',
    front: 'When to use the Write tool vs. Edit tool',
    back: 'Use Edit for in-place changes to existing files when the target string is unique. Use Write (full file replacement) when creating new files, doing a complete rewrite, or when Edit would fail due to ambiguous match. Always Read the file first before overwriting.',
  },

  // ---------------------------------------------------------------------------
  // D3 — Claude Code Configuration & Workflows (NEW: f101–f120, taskRef 3.1–3.6)
  // ---------------------------------------------------------------------------

  // 3.1 CLAUDE.md hierarchy
  {
    id: 'f101',
    domain: 'd3',
    taskRef: '3.1',
    front: 'User-global vs. project-level CLAUDE.md',
    back: '`~/.claude/CLAUDE.md` applies to every Claude Code session for that user. A project-level `CLAUDE.md` at the repo root (or in `.claude/CLAUDE.md`) applies only within that project. Project-level instructions supplement, not replace, the user-global file.',
  },
  {
    id: 'f102',
    domain: 'd3',
    taskRef: '3.1',
    front: 'Directory-level CLAUDE.md files',
    back: 'Placing a `CLAUDE.md` inside a subdirectory makes its instructions active only when working within that directory. This allows frontend, backend, and docs directories to each carry distinct conventions without polluting the root-level file.',
  },
  {
    id: 'f103',
    domain: 'd3',
    taskRef: '3.1',
    front: '@import directive in CLAUDE.md',
    back: 'Use `@import path/to/file.md` inside a CLAUDE.md to pull in a separate Markdown file at load time. This lets you split large instruction sets into topic files (e.g. `@import .claude/rules/testing.md`) and keep each file focused and maintainable.',
  },
  {
    id: 'f104',
    domain: 'd3',
    taskRef: '3.1',
    front: '/memory command in Claude Code',
    back: 'The `/memory` slash command lists all CLAUDE.md files currently loaded in the session, in loading order. Use it to verify that the correct hierarchy of global, project, and directory-level files were actually picked up before debugging unexpected behavior.',
  },

  // 3.2 Custom slash commands & skills
  {
    id: 'f105',
    domain: 'd3',
    taskRef: '3.2',
    front: 'Project vs. personal slash commands',
    back: 'Commands in `.claude/commands/` are project-scoped and committed to version control — all contributors share them. Commands in `~/.claude/commands/` are personal and available in every project for that user only. Invoke either with `/command-name`.',
  },
  {
    id: 'f106',
    domain: 'd3',
    taskRef: '3.2',
    front: 'SKILL.md context:fork frontmatter field',
    back: 'Setting `context: fork` in a SKILL.md frontmatter causes Claude Code to run that skill in a forked session — an isolated context copy. Changes, tool calls, and state produced by the skill do not leak back into the parent session unless explicitly returned.',
  },
  {
    id: 'f107',
    domain: 'd3',
    taskRef: '3.2',
    front: 'allowed-tools and argument-hint in SKILL.md',
    back: '`allowed-tools` in SKILL.md frontmatter restricts which tools the skill may call, preventing over-broad access. `argument-hint` provides a usage hint shown in the slash-command autocomplete, guiding the user on expected arguments.',
  },
  {
    id: 'f108',
    domain: 'd3',
    taskRef: '3.2',
    front: 'Skills (on-demand) vs. CLAUDE.md (always-loaded)',
    back: 'CLAUDE.md content is loaded into every session unconditionally, consuming context window space. Skills are loaded only when the user explicitly invokes them via `/skill-name`. For infrequently-used instructions, a skill is more context-efficient than a CLAUDE.md entry.',
  },

  // 3.3 Path-specific rules
  {
    id: 'f109',
    domain: 'd3',
    taskRef: '3.3',
    front: 'paths: glob frontmatter in .claude/rules/ files',
    back: 'Rules files under `.claude/rules/` carry YAML frontmatter with a `paths:` key containing glob patterns (e.g. `["src/**/*.ts"]`). Claude Code activates that rules file automatically when the current working file matches any listed glob.',
  },
  {
    id: 'f110',
    domain: 'd3',
    taskRef: '3.3',
    front: 'Why glob rules beat directory-level CLAUDE.md for scattered files',
    back: 'A directory CLAUDE.md only applies to files in that directory. A glob rule with `**/*.test.tsx` applies to every test file anywhere in the repo. Use glob rules when a convention (e.g. test-file style) cuts across multiple directories.',
  },
  {
    id: 'f111',
    domain: 'd3',
    taskRef: '3.3',
    front: 'Organizing multiple rules files in .claude/rules/',
    back: 'Each file in `.claude/rules/` should cover a single topic (e.g. `api-conventions.md`, `testing-style.md`). Combined with glob activation, this gives fine-grained, composable rule sets — only the relevant topic files load for any given file.',
  },

  // 3.4 Plan mode vs direct execution
  {
    id: 'f112',
    domain: 'd3',
    taskRef: '3.4',
    front: 'When to use plan mode instead of direct execution',
    back: 'Use plan mode for large-scale, architectural, or multi-file changes where the right approach is not yet clear. Plan mode lets Claude explore, read, and reason without touching files — reducing costly mistakes on high-impact operations.',
  },
  {
    id: 'f113',
    domain: 'd3',
    taskRef: '3.4',
    front: 'Explore subagent in Claude Code',
    back: 'The Explore subagent performs verbose discovery of a codebase — reading files, following imports, mapping structure — without producing any edits. Use it before delegating a complex refactor to ensure the acting agent starts with accurate context.',
  },
  {
    id: 'f114',
    domain: 'd3',
    taskRef: '3.4',
    front: 'Combine plan-then-execute for large tasks',
    back: 'Run plan mode first to produce a step-by-step approach and surface unknowns. Once the plan is reviewed and approved, switch to direct execution. This two-phase pattern avoids mid-refactor surprises and makes large changes auditable.',
  },

  // 3.5 Iterative refinement
  {
    id: 'f115',
    domain: 'd3',
    taskRef: '3.5',
    front: 'Concrete I/O examples beat prose instructions',
    back: 'Showing an input-output pair ("given X, produce Y") is more precise than describing the transformation in words. Examples resolve ambiguity that prose leaves open, and Claude can generalize from them to novel cases more reliably than from rules alone.',
  },
  {
    id: 'f116',
    domain: 'd3',
    taskRef: '3.5',
    front: 'Test-driven iteration in Claude Code',
    back: 'Write a failing test first, then ask Claude to make it pass. Each cycle, the test acts as a precise, unambiguous success criterion — preventing scope creep, confirming regressions, and giving Claude a mechanical verification step rather than a subjective one.',
  },
  {
    id: 'f117',
    domain: 'd3',
    taskRef: '3.5',
    front: 'Single-message vs. sequential fixes in iterative refinement',
    back: 'Single-message (interacting) mode sends all feedback in one turn — best when fixes are interdependent or must be consistent. Sequential mode addresses each issue independently in separate turns — better when issues are orthogonal and you want to verify each fix before proceeding.',
  },

  // 3.6 CI/CD integration
  {
    id: 'f118',
    domain: 'd3',
    taskRef: '3.6',
    front: '-p / --print flag for CI non-interactive use',
    back: 'Passing `-p` (short for `--print`) runs Claude Code in headless mode: it processes the prompt and exits without waiting for interactive input. This is the standard entry point for integrating Claude Code into CI pipelines and shell scripts.',
  },
  {
    id: 'f119',
    domain: 'd3',
    taskRef: '3.6',
    front: '--output-format json with --json-schema in CI',
    back: '`--output-format json` makes Claude Code emit a JSON object instead of prose. Pair it with `--json-schema path/to/schema.json` to validate the output against a schema before downstream steps consume it, turning Claude\'s response into a typed data contract.',
  },
  {
    id: 'f120',
    domain: 'd3',
    taskRef: '3.6',
    front: 'Independent review instance for CI self-review',
    back: 'A Claude instance reviewing its own output in the same session retains its original reasoning and misses the same errors. Spawn a separate, independent Claude instance with only the artifact under review — its fresh context catches issues the author\'s session normalized.',
  },

  // ---------------------------------------------------------------------------
  // D4 — Prompt Engineering & Structured Output (NEW: f121–f140, taskRef 4.1–4.6)
  // ---------------------------------------------------------------------------

  // 4.1 Explicit criteria / precision / false positives
  {
    id: 'f121',
    domain: 'd4',
    taskRef: '4.1',
    front: 'Why "be conservative" is a bad classification criterion',
    back: '"Be conservative" gives the model no actionable boundary — each response may interpret it differently. Replace vague caution with specific categorical rules: "flag if the message contains a threat, slur, or solicitation; do not flag venting or sarcasm."',
  },
  {
    id: 'f122',
    domain: 'd4',
    taskRef: '4.1',
    front: 'False-positive categories erode trust',
    back: 'Classify false-positive patterns explicitly (e.g. "sarcasm that sounds threatening", "medical terms that superficially match prohibited keywords") and instruct Claude to skip flagging them. Uncontrolled false positives cause downstream teams to distrust and bypass the classifier.',
  },
  {
    id: 'f123',
    domain: 'd4',
    taskRef: '4.1',
    front: 'Severity criteria with code examples',
    back: 'When classifying severity, pair each level with a representative code or text example inline: "CRITICAL: SQL injection pattern — e.g. `\' OR 1=1--`". Anchoring to examples prevents severity calibration drift across model versions and reviewers.',
  },
  {
    id: 'f124',
    domain: 'd4',
    taskRef: '4.1',
    front: 'Categorical criteria vs. gradient criteria',
    back: 'Categorical criteria ("flag if X or Y or Z") produce consistent results because the model makes a binary decision per category. Gradient criteria ("flag if it seems harmful") are subjective, produce inconsistent thresholds, and are hard to validate with labeled test sets.',
  },

  // 4.2 Few-shot prompting
  {
    id: 'f125',
    domain: 'd4',
    taskRef: '4.2',
    front: 'Why few-shot is most effective for consistent format',
    back: 'Few-shot examples directly demonstrate the expected structure, field names, and phrasing — the model pattern-matches rather than inferring from rules. For output consistency, 2-4 representative examples outperform detailed prose format descriptions.',
  },
  {
    id: 'f126',
    domain: 'd4',
    taskRef: '4.2',
    front: 'Demonstrating ambiguous-case handling in few-shot examples',
    back: 'Include at least one example that covers a difficult or edge case — inputs that could legitimately go multiple ways. Showing how to handle the hard case is more valuable than multiple examples of the easy case, because it calibrates the model\'s uncertainty boundary.',
  },
  {
    id: 'f127',
    domain: 'd4',
    taskRef: '4.2',
    front: 'Reducing extraction hallucination with few-shot',
    back: 'When extracting structured fields from documents, few-shot examples that include the source passage alongside the extracted value teach the model to ground its output. If the field is absent, show a null or "not found" example to suppress fabrication.',
  },
  {
    id: 'f128',
    domain: 'd4',
    taskRef: '4.2',
    front: 'Optimal few-shot count: 2-4 targeted examples',
    back: 'Provide 2-4 examples covering distinct patterns, not 10+ repetitions of the same case. More examples beyond 4-5 yield diminishing returns on format fidelity and consume context window space that could hold more of the actual input.',
  },

  // 4.3 Structured output via tool_use
  {
    id: 'f129',
    domain: 'd4',
    taskRef: '4.3',
    front: 'tool_use + JSON schema guarantees syntax, not semantics',
    back: 'Forcing output through a tool_use call with a JSON schema ensures the response is schema-valid JSON with no syntax errors. It does not guarantee semantically correct values — Claude may still produce wrong field values that are structurally valid.',
  },
  {
    id: 'f130',
    domain: 'd4',
    taskRef: '4.3',
    front: 'tool_choice: auto vs. any vs. forced',
    back: '`tool_choice: "auto"` lets the model call a tool or respond in text. `"any"` forces a tool call but allows the model to choose which one. `{type: "tool", name: "X"}` forces a specific tool call unconditionally — use this to guarantee structured output every time.',
  },
  {
    id: 'f131',
    domain: 'd4',
    taskRef: '4.3',
    front: 'Optional/nullable fields to prevent fabrication',
    back: 'Mark schema fields that may not always be present as optional (or allow null). When the model is forced to fill every field, it fabricates values for absent data. Nullable fields give Claude a legitimate "not present" path, reducing hallucination.',
  },
  {
    id: 'f132',
    domain: 'd4',
    taskRef: '4.3',
    front: 'enum + "other" + detail pattern for classification fields',
    back: 'For category fields, define an enum of known values plus an `"other"` option with a companion `detail` string field. This prevents forcing the model into a wrong category while still capturing structured intent — the `detail` field explains the uncategorized case.',
  },

  // 4.4 Validation / retry / feedback loops
  {
    id: 'f133',
    domain: 'd4',
    taskRef: '4.4',
    front: 'retry-with-error-feedback pattern',
    back: 'When Claude returns a structurally invalid response, feed back the exact validation error in the next user turn: "Your output was invalid because: [error]. Please correct and retry." Contextual error feedback is far more effective than a bare retry with the original prompt.',
  },
  {
    id: 'f134',
    domain: 'd4',
    taskRef: '4.4',
    front: 'When retries are useless vs. useful',
    back: 'Retries are useful for format/structural errors (wrong JSON shape, missing required field) where the model had the information but encoded it incorrectly. Retries are useless when the required information is simply absent from the context — the model will hallucinate or repeat the same gap.',
  },
  {
    id: 'f135',
    domain: 'd4',
    taskRef: '4.4',
    front: 'detected_pattern field for validation context',
    back: 'Ask Claude to include a `detected_pattern` field explaining what pattern it identified before making a judgment. This externalizes reasoning for validation — you can check whether the pattern matches the input, catching cases where the conclusion is correct but for the wrong reason.',
  },

  // 4.5 Batch processing
  {
    id: 'f136',
    domain: 'd4',
    taskRef: '4.5',
    front: 'Message Batches API cost and latency trade-off',
    back: 'The Message Batches API processes requests asynchronously at approximately 50% cost savings with up to 24-hour turnaround time. It provides no latency SLA — use it only for workloads that can tolerate delayed results, such as overnight classification or bulk data enrichment.',
  },
  {
    id: 'f137',
    domain: 'd4',
    taskRef: '4.5',
    front: 'Batch API does not support multi-turn tool calling',
    back: 'Each request in a batch is a single, stateless API call. Multi-turn exchanges (agentic loops with tool_use/tool_result cycles) are not supported in the Batches API. All context the model needs must be included in the single request.',
  },
  {
    id: 'f138',
    domain: 'd4',
    taskRef: '4.5',
    front: 'custom_id for batch request correlation',
    back: 'Each request in a batch submission must include a `custom_id` string. When results are returned asynchronously, this id is the only way to map each result back to its source request. Use stable, deterministic ids (e.g. record primary keys) — not sequential integers that may shift on retry.',
  },

  // 4.6 Multi-instance / multi-pass review
  {
    id: 'f139',
    domain: 'd4',
    taskRef: '4.6',
    front: 'Self-review limitation: same reasoning, same blind spots',
    back: 'A Claude instance reviewing its own output retains its original reasoning context and tends to validate what it already produced. It will catch surface formatting errors but miss logical flaws and assumptions it made silently the first time.',
  },
  {
    id: 'f140',
    domain: 'd4',
    taskRef: '4.6',
    front: 'Independent instance for multi-pass review',
    back: 'Spawn a fresh Claude instance with only the artifact under review (no generation history). Its clean context catches errors the author normalized. For codebases: run a per-file pass (local correctness) and a separate cross-file pass (API contracts, imports, type consistency).',
  },

  // ---------------------------------------------------------------------------
  // D5 — Context Management & Reliability (NEW: f141–f155, taskRef 5.1–5.6)
  // ---------------------------------------------------------------------------

  // 5.1 Conversation context preservation
  {
    id: 'f141',
    domain: 'd5',
    taskRef: '5.1',
    front: 'Progressive summarization risk: what data is lost?',
    back: 'When compacting a long conversation by summarizing earlier turns, precise values — numbers, dates, identifiers, exact quotes — are the first casualties. Preserve them verbatim in a dedicated "case facts" block rather than trusting a prose summary to carry them.',
  },
  {
    id: 'f142',
    domain: 'd5',
    taskRef: '5.1',
    front: 'Lost-in-the-middle effect',
    back: 'In long contexts, the model attends less reliably to information placed in the middle of the input than at the beginning or end. Mitigate by placing the most critical facts and instructions at the top or bottom of the context, and compacting verbose middle sections.',
  },
  {
    id: 'f143',
    domain: 'd5',
    taskRef: '5.1',
    front: 'Trimming verbose tool output for context preservation',
    back: 'Raw tool responses (logs, API payloads, search results) can be orders of magnitude larger than the signal they contain. Trim or summarize them server-side or via a PostToolUse hook before they enter the context window, preserving space for more relevant turns.',
  },
  {
    id: 'f144',
    domain: 'd5',
    taskRef: '5.1',
    front: 'Persistent "case facts" block in system prompt',
    back: 'For long-running sessions, maintain a structured "case facts" section in the system prompt that is updated with confirmed key details (customer id, issue type, SLA deadline). This block is never summarized away and ensures critical data survives compaction.',
  },
  {
    id: 'f145',
    domain: 'd5',
    taskRef: '5.1',
    front: 'Position-aware ordering for context reliability',
    back: 'Order context elements by recency and importance, placing the most recent and critical information last (nearest to the assistant turn). Older or lower-priority background can precede it. This exploits the model\'s stronger attention at context boundaries.',
  },

  // 5.2 Escalation & ambiguity resolution
  {
    id: 'f146',
    domain: 'd5',
    taskRef: '5.2',
    front: 'Three triggers for escalation to a human agent',
    back: 'Escalate when: (1) the customer explicitly asks to speak with a human, (2) the situation falls outside policy scope (no defined resolution path), or (3) the conversation has made no progress after multiple attempts. All three are deterministic conditions, not sentiment judgments.',
  },
  {
    id: 'f147',
    domain: 'd5',
    taskRef: '5.2',
    front: 'Honoring explicit human escalation requests immediately',
    back: 'When a customer says they want a human agent, transfer immediately — do not first attempt one more automated resolution. Delaying the transfer erodes trust and violates the principle that explicit human preferences override agent optimization.',
  },
  {
    id: 'f148',
    domain: 'd5',
    taskRef: '5.2',
    front: 'Sentiment and self-confidence as unreliable escalation proxies',
    back: 'Triggering escalation on detected frustration or the model\'s own low confidence produces inconsistent thresholds — sentiment classifiers drift and self-confidence is not calibrated. Use explicit, structural triggers (request type, policy gap, iteration count) instead.',
  },

  // 5.3 Error propagation across multi-agent
  {
    id: 'f149',
    domain: 'd5',
    taskRef: '5.3',
    front: 'Structured error context fields for multi-agent propagation',
    back: 'When a subagent fails, its error response must carry: failure type (validation/permission/transient), what was attempted, any partial results produced, and alternative approaches. This lets the coordinator make an informed recovery decision rather than restarting blindly.',
  },
  {
    id: 'f150',
    domain: 'd5',
    taskRef: '5.3',
    front: 'No silent suppression, no whole-workflow termination',
    back: 'Two failure anti-patterns: (1) swallowing an error and returning empty results as if the query succeeded — the coordinator cannot detect the gap; (2) aborting the entire workflow on a single subagent failure. Instead, propagate structured errors and let the coordinator decide scope of recovery.',
  },
  {
    id: 'f151',
    domain: 'd5',
    taskRef: '5.3',
    front: 'Coverage annotations in multi-agent error handling',
    back: 'When a subagent returns partial results due to an error, annotate the coverage explicitly: "processed records 1-500; records 501-1000 failed with [error]". Without coverage annotations the coordinator cannot know how much of the task scope is missing.',
  },

  // 5.4 Large codebase exploration context
  {
    id: 'f152',
    domain: 'd5',
    taskRef: '5.4',
    front: 'Context degradation in large codebase sessions',
    back: 'As a session accumulates tool results from exploring a large codebase, early precise findings are replaced by vague recollections ("the pattern used in most files"). Combat this with scratchpad files that record exact findings and subagent delegation to isolate sub-problem context windows.',
  },
  {
    id: 'f153',
    domain: 'd5',
    taskRef: '5.4',
    front: 'Scratchpad files and /compact for large codebase context',
    back: 'Write intermediate findings to scratchpad files on disk so they persist beyond context compaction. Use `/compact` to summarize completed exploration phases. On crash or restart, a manifest file records which files were analyzed and what was found, enabling recovery without re-scanning.',
  },

  // 5.5 Human review & confidence calibration
  {
    id: 'f154',
    domain: 'd5',
    taskRef: '5.5',
    front: 'Why aggregate accuracy hides per-type gaps',
    back: 'A model scoring 92% overall may score 60% on rare but high-value record types. Aggregate metrics mask these per-type disparities. Use stratified sampling — evaluate a representative slice of each record type — before deciding whether to automate a workflow.',
  },
  {
    id: 'f155',
    domain: 'd5',
    taskRef: '5.5',
    front: 'Field-level confidence calibration on labeled sets',
    back: 'Calibrate field-level confidence scores against a labeled validation set for each field type. A model may be reliable on date extraction but unreliable on inferred categories. Use per-field calibration to route uncertain extractions to human review rather than silently accepting all outputs.',
  },

  // 5.6 Provenance & multi-source synthesis
  {
    id: 'f156',
    domain: 'd5',
    taskRef: '5.6',
    front: 'Claim-source mappings must survive summarization',
    back: 'When synthesizing multiple documents, every factual claim must carry its source attribution through summarization steps. A summary that drops citations cannot be validated later — require each synthesis step to output claim-source pairs, not just conclusions.',
  },
  {
    id: 'f157',
    domain: 'd5',
    taskRef: '5.6',
    front: 'Annotating conflicting statistics with attribution',
    back: 'When two sources report different values for the same metric, do not silently choose one. Annotate with both: "Source A reports 42%; Source B reports 67%." This preserves the conflict for human review and prevents fabricating a false consensus.',
  },
]
