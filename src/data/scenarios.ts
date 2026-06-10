// =============================================================================
// The 6 official exam scenarios as a const tuple
// =============================================================================

export const SCENARIOS = [
  'Customer Support Resolution Agent',
  'Code Generation with Claude Code',
  'Multi-Agent Research System',
  'Developer Productivity with Claude',
  'Claude Code for Continuous Integration',
  'Structured Data Extraction',
] as const

export type ScenarioName = typeof SCENARIOS[number]
