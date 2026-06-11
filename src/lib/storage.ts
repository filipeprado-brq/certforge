// =============================================================================
// Namespaced, versioned localStorage persistence layer
// Threat model: T-01-01 (tampering), T-01-02 (quota/denied) — see PLAN.md
// =============================================================================

import type { SrsCard } from './srs'
import type { DomainId } from '../data/domains'

export const STORAGE_KEY = 'cae-trainer:v1'
export const SCHEMA_VERSION = 1

export type ThemePref = 'system' | 'light' | 'dark'

/**
 * A single completed quiz attempt (QUIZ-07).
 * perDomain is a flat pct map (Record<DomainId, number>) — distinct from the
 * engine's GradeResult.perDomain which carries {correct,total,pct} per domain.
 * The UI layer converts shapes when building this record.
 */
export interface QuizAttempt {
  id: string
  date: string
  mode: string
  modeKey: 'scenario' | 'domain' | 'timed' | 'free'
  correct: number
  total: number
  scaled?: number
  pass?: boolean
  perDomain: Partial<Record<DomainId, number>>
  missed?: Array<{ questionId: string; selected: number | null }>
}

export interface PersistedState {
  schemaVersion: number
  themePref: ThemePref
  srs: Record<string, SrsCard>
  /** Persisted attempt history — see QuizAttempt. Added additively (schemaVersion stays 1); quizHistory defaults to [] via DEFAULT_STATE merge. */
  quizHistory: QuizAttempt[]
}

const DEFAULT_STATE: PersistedState = {
  schemaVersion: SCHEMA_VERSION,
  themePref: 'system',
  srs: {},
  quizHistory: [],
}

/**
 * Read the persisted state from localStorage.
 * Returns defaults if the key is absent, the value is not valid JSON,
 * or the schemaVersion is missing / mismatched — never throws.
 */
export function readState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.schemaVersion !== SCHEMA_VERSION
    ) {
      return { ...DEFAULT_STATE }
    }
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

/**
 * Overwrite the persisted state. Wraps localStorage.setItem in try/catch
 * so quota-exceeded or denied-storage degrades gracefully.
 */
export function writeState(next: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable — in-memory state is the source of truth via React
  }
}

/**
 * Read, shallow-merge the patch, write, and return the merged state.
 */
export function patchState(patch: Partial<PersistedState>): PersistedState {
  const current = readState()
  const next: PersistedState = { ...current, ...patch }
  writeState(next)
  return next
}

/**
 * Remove the cae-trainer:v1 key entirely from localStorage.
 * A subsequent readState() will return defaults.
 */
export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore errors — storage may be unavailable
  }
}
