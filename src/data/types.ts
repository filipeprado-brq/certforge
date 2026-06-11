// =============================================================================
// Shared content types for the exam trainer
// =============================================================================

import type { DomainId } from './domains'

export type Scenario =
  | 'Customer Support Resolution Agent'
  | 'Code Generation with Claude Code'
  | 'Multi-Agent Research System'
  | 'Developer Productivity with Claude'
  | 'Claude Code for Continuous Integration'
  | 'Structured Data Extraction'

export type Source = 'official-sample' | 'original'

export interface Flashcard {
  id: string
  domain: DomainId
  front: string
  back: string
  taskRef?: string        // exam task statement, e.g. '1.3' | '4.5'
}

export interface Question {
  id: string
  domain: DomainId
  scenario?: Scenario
  stem: string
  options: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  whyCorrect: string
  whyOthers: string
  source?: Source
}
