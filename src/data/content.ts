// =============================================================================
// Typed content loader/selectors — embedded, no network fetch
// =============================================================================

import { FLASHCARDS } from './flashcards'
import { QUESTIONS } from './questions'
import { DOMAINS } from './domains'
import type { DomainId } from './domains'
import type { Flashcard, Question, Scenario } from './types'

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export function getFlashcards(opts?: { domain?: DomainId }): Flashcard[] {
  if (opts?.domain) {
    return FLASHCARDS.filter(f => f.domain === opts.domain)
  }
  return FLASHCARDS
}

export function getQuestions(opts?: { domain?: DomainId; scenario?: Scenario }): Question[] {
  let result = QUESTIONS
  if (opts?.domain) {
    result = result.filter(q => q.domain === opts.domain)
  }
  if (opts?.scenario) {
    result = result.filter(q => q.scenario === opts.scenario)
  }
  return result
}

// ---------------------------------------------------------------------------
// Per-domain count maps
// ---------------------------------------------------------------------------

export function flashcardCountsByDomain(): Record<DomainId, number> {
  const counts = Object.fromEntries(DOMAINS.map(d => [d.id, 0])) as Record<DomainId, number>
  FLASHCARDS.forEach(f => {
    counts[f.domain] = (counts[f.domain] ?? 0) + 1
  })
  return counts
}

export function questionCountsByDomain(): Record<DomainId, number> {
  const counts = Object.fromEntries(DOMAINS.map(d => [d.id, 0])) as Record<DomainId, number>
  QUESTIONS.forEach(q => {
    counts[q.domain] = (counts[q.domain] ?? 0) + 1
  })
  return counts
}
