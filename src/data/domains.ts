// =============================================================================
// Exam domain metadata — 5 domains, weights sum to 100
// =============================================================================

export type DomainId = 'd1' | 'd2' | 'd3' | 'd4' | 'd5'

export interface Domain {
  id: DomainId      // 'd1'..'d5' — maps to CSS var(--d1)..var(--d5)
  code: string      // 'D1'..'D5'
  short: string     // short label, e.g. 'Agentic'
  name: string      // full name
  weight: number    // exam weight percentage: 27, 18, 20, 20, 15 (= 100)
}

export const DOMAINS: Domain[] = [
  {
    id: 'd1',
    code: 'D1',
    short: 'Agentic',
    name: 'Agentic Architecture & Orchestration',
    weight: 27,
  },
  {
    id: 'd2',
    code: 'D2',
    short: 'Tools/MCP',
    name: 'Tool Design & MCP Integration',
    weight: 18,
  },
  {
    id: 'd3',
    code: 'D3',
    short: 'Claude Code',
    name: 'Claude Code Configuration & Workflows',
    weight: 20,
  },
  {
    id: 'd4',
    code: 'D4',
    short: 'Prompting',
    name: 'Prompt Engineering & Structured Output',
    weight: 20,
  },
  {
    id: 'd5',
    code: 'D5',
    short: 'Context',
    name: 'Context Management & Reliability',
    weight: 15,
  },
]
