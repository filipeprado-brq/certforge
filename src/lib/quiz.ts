// =============================================================================
// Pure quiz engine — callers inject rng and nowMs; no wall-clock or rng reads inside
// QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-07
// =============================================================================

import type { DomainId } from '../data/domains'
import type { Question, Scenario } from '../data/types'

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Maps raw correct/total to the 100–1000 scaled band.
 * scaledScore(7,10) === 730; scaledScore(0,0) === 100 (guard).
 * Pure — no side effects, no wall-clock or randomness reads.
 */
export function scaledScore(correct: number, total: number): number {
  const ratio = total === 0 ? 0 : correct / total
  return Math.round(100 + ratio * 900)
}

/** Pass mark for timed exam mode. */
export const PASS_MARK = 720

/** Returns true when scaled score meets or exceeds the pass mark. */
export function isPass(scaled: number): boolean {
  return scaled >= PASS_MARK
}

// ─── Grading ─────────────────────────────────────────────────────────────────

/** Map of questionId → selected option index (null/missing = unanswered = wrong). */
export type Answers = Record<string, number | null>

/** Per-domain score breakdown. */
export interface DomainScore {
  correct: number
  total: number
  pct: number
}

/** Result returned by gradeAttempt. */
export interface GradeResult {
  correct: number
  total: number
  perDomain: Partial<Record<DomainId, DomainScore>>
  missed: Question[]
}

/**
 * Grades a quiz attempt.
 * - Unanswered (null) or missing answers count as wrong.
 * - Returns per-domain stats and the list of missed questions in question order.
 * Pure — no side effects, no wall-clock reads.
 */
export function gradeAttempt(questions: Question[], answers: Answers): GradeResult {
  let correct = 0
  const perDomain: Partial<Record<DomainId, DomainScore>> = {}
  const missed: Question[] = []

  for (const q of questions) {
    const selected = answers[q.id] ?? null
    const ok = selected === q.correct

    // Accumulate per-domain counts
    if (!perDomain[q.domain]) {
      perDomain[q.domain] = { correct: 0, total: 0, pct: 0 }
    }
    const ds = perDomain[q.domain]!
    ds.total += 1
    if (ok) {
      ds.correct += 1
      correct += 1
    } else {
      missed.push(q)
    }
  }

  // Compute pct for each domain
  for (const d of Object.keys(perDomain) as DomainId[]) {
    const ds = perDomain[d]!
    ds.pct = Math.round((ds.correct / ds.total) * 100)
  }

  return { correct, total: questions.length, perDomain, missed }
}

// ─── Timer ───────────────────────────────────────────────────────────────────

/**
 * Returns remaining seconds in the quiz, clamped to zero.
 * Callers pass nowMs (e.g. the result of calling Date dot now) — this function never reads the wall clock.
 */
export function remainingSeconds(
  startedAtMs: number,
  durationSec: number,
  nowMs: number,
): number {
  return Math.max(0, durationSec - Math.floor((nowMs - startedAtMs) / 1000))
}

/**
 * Returns true when the quiz duration has elapsed.
 * Pure — caller injects nowMs.
 */
export function isExpired(
  startedAtMs: number,
  durationSec: number,
  nowMs: number,
): boolean {
  return remainingSeconds(startedAtMs, durationSec, nowMs) <= 0
}

// ─── Question Selection ───────────────────────────────────────────────────────

/** Quiz modes. */
export type QuizMode = 'scenario' | 'domain' | 'timed' | 'free'

/** Options for selectQuestions. */
export interface SelectOpts {
  domain?: DomainId
  n?: number
  scenarios?: Scenario[]
}

/** Minimum questions for free mode. */
export const FREE_MIN = 5

/** Maximum questions for free mode. */
export const FREE_MAX = 15

/**
 * Fisher-Yates shuffle using an injected rng.
 * Returns a new array; never mutates the input.
 * Pure — no side effects, no global random reads.
 */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Selects questions for a given mode deterministically given an injected rng.
 *
 * - 'scenario': draws 4 distinct scenarios from the pool, returns questions
 *   grouped by scenario (all of A, then all of B, ...).
 * - 'domain': returns all pool questions for opts.domain.
 * - 'timed': shuffles pool, takes exactly 10 (ignores opts.n).
 * - 'free': clamps n to FREE_MIN–FREE_MAX (default 10), shuffles, slices.
 *
 * The rng must be a function returning [0,1) — e.g. a seeded or global random impl.
 * Never calls the global random function internally.
 */
export function selectQuestions(
  mode: QuizMode,
  opts: SelectOpts,
  pool: Question[],
  rng: () => number,
): Question[] {
  switch (mode) {
    case 'scenario': {
      // Collect distinct scenario values present in pool
      const allScenarios = Array.from(
        new Set(pool.map(q => q.scenario).filter(Boolean) as Scenario[]),
      )
      // Shuffle and pick 4
      const chosen = shuffle(allScenarios, rng).slice(0, 4)
      // Group: for each chosen scenario in order, append its questions
      const result: Question[] = []
      for (const s of chosen) {
        result.push(...pool.filter(q => q.scenario === s))
      }
      return result
    }

    case 'domain': {
      return pool.filter(q => q.domain === opts.domain)
    }

    case 'timed': {
      // Fixed at 10 — ignores opts.n
      return shuffle(pool, rng).slice(0, 10)
    }

    case 'free': {
      // Clamp n to FREE_MIN..FREE_MAX (default 10), then cap by pool size
      const n = Math.max(FREE_MIN, Math.min(FREE_MAX, opts.n ?? 10))
      return shuffle(pool, rng).slice(0, n)
    }
  }
}
