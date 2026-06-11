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
]
