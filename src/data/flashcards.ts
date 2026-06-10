// =============================================================================
// Seed flashcards — 15 cards ported verbatim from design/data.jsx
// =============================================================================

import type { Flashcard } from './types'

export const FLASHCARDS: Flashcard[] = [
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
    back: 'When the task decomposes into a fixed, predictable sequence of steps. Workflows (prompt chaining, routing, parallelization) are cheaper, faster, and more testable; reserve autonomous agents for open-ended tasks where the path can’t be known in advance.',
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
  {
    id: 'f8',
    domain: 'd3',
    front: 'CLAUDE.md',
    back: 'A project-level memory file Claude Code reads at session start. Use it for build commands, conventions, architecture notes, and persistent instructions — anything you’d otherwise repeat every session.',
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
    back: 'Claude is trained to attend to XML-style tags. Use them to delimit instructions, documents, and examples (<instructions>, <doc>, <example>) so content can’t bleed into directives.',
  },
  {
    id: 'f13',
    domain: 'd4',
    front: 'Few-shot examples vs instructions',
    back: 'Examples beat descriptions for format fidelity. 3–5 diverse, edge-case-covering examples typically outperform long prose rules — and are easier to maintain.',
  },
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
    back: 'To reduce hallucination, require the model to quote or cite retrieved sources, allow “I don’t know”, and verify high-stakes claims with a second pass or external check.',
  },
]
