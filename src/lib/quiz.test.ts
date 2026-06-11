import { describe, it, expect } from 'vitest'
import {
  scaledScore,
  isPass,
  PASS_MARK,
  gradeAttempt,
  remainingSeconds,
  isExpired,
  selectQuestions,
  FREE_MIN,
  FREE_MAX,
} from './quiz'
import type { Question } from '../data/types'
import { getQuestions } from '../data/content'

// ─── Inline Question fixtures ────────────────────────────────────────────────

function makeQ(
  id: string,
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'd5',
  correct: 0 | 1 | 2 | 3,
  scenario?: string,
): Question {
  return {
    id,
    domain,
    stem: '',
    options: ['A', 'B', 'C', 'D'],
    correct,
    whyCorrect: '',
    whyOthers: '',
    scenario: scenario as Question['scenario'],
  }
}

// Fixed reference epoch for timer tests
const S = 1_000_000_000_000 // arbitrary fixed ms

// ─── scaledScore ─────────────────────────────────────────────────────────────

describe('scaledScore', () => {
  it('scaledScore(10,10) === 1000 (perfect score)', () => {
    expect(scaledScore(10, 10)).toBe(1000)
  })

  it('scaledScore(7,10) === 730 (pass)', () => {
    expect(scaledScore(7, 10)).toBe(730)
  })

  it('scaledScore(6,10) === 640 (fail)', () => {
    expect(scaledScore(6, 10)).toBe(640)
  })

  it('scaledScore(0,10) === 100 (minimum)', () => {
    expect(scaledScore(0, 10)).toBe(100)
  })

  it('scaledScore(0,0) === 100 (guard: total=0 → ratio treated as 0)', () => {
    expect(scaledScore(0, 0)).toBe(100)
  })
})

// ─── isPass ──────────────────────────────────────────────────────────────────

describe('isPass', () => {
  it('PASS_MARK is 720', () => {
    expect(PASS_MARK).toBe(720)
  })

  it('isPass(720) === true (exactly at pass mark)', () => {
    expect(isPass(720)).toBe(true)
  })

  it('isPass(719) === false (one below pass mark)', () => {
    expect(isPass(719)).toBe(false)
  })

  it('isPass(1000) === true (perfect score passes)', () => {
    expect(isPass(1000)).toBe(true)
  })

  it('isPass(100) === false (minimum score fails)', () => {
    expect(isPass(100)).toBe(false)
  })
})

// ─── gradeAttempt ────────────────────────────────────────────────────────────

describe('gradeAttempt', () => {
  it('total equals questions.length', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd1', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: 1 })
    expect(result.total).toBe(2)
  })

  it('counts correct answers', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd1', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: 1 })
    expect(result.correct).toBe(2)
  })

  it('unanswered (null) counts as wrong — not correct', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd1', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: null })
    expect(result.correct).toBe(1)
    expect(result.missed).toHaveLength(1)
    expect(result.missed[0].id).toBe('q2')
  })

  it('missing answer (key absent) counts as wrong', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd1', 1)]
    const result = gradeAttempt(qs, { q1: 0 })
    expect(result.correct).toBe(1)
    expect(result.missed).toHaveLength(1)
    expect(result.missed[0].id).toBe('q2')
  })

  it('wrong answer counts as wrong and appears in missed', () => {
    const qs = [makeQ('q1', 'd1', 0)]
    const result = gradeAttempt(qs, { q1: 3 })
    expect(result.correct).toBe(0)
    expect(result.missed).toHaveLength(1)
  })

  it('perDomain only includes domains present in questions', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd2', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: 1 })
    expect(Object.keys(result.perDomain)).toContain('d1')
    expect(Object.keys(result.perDomain)).toContain('d2')
    expect(Object.keys(result.perDomain)).not.toContain('d3')
  })

  it('perDomain[d].pct = Math.round(correct/total*100)', () => {
    // 2 d1 questions, 1 correct → 50%
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd1', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: null })
    expect(result.perDomain.d1).toEqual({ correct: 1, total: 2, pct: 50 })
  })

  it('example from spec: 2 d1 questions, q1 correct q2 unanswered → d1={1,2,50}, missed=[q2]', () => {
    const q1 = makeQ('q1', 'd1', 0)
    const q2 = makeQ('q2', 'd1', 1)
    const result = gradeAttempt([q1, q2], { q1: 0, q2: null })
    expect(result.correct).toBe(1)
    expect(result.total).toBe(2)
    expect(result.perDomain.d1).toEqual({ correct: 1, total: 2, pct: 50 })
    expect(result.missed).toEqual([q2])
  })

  it('missed preserves question order (not insertion order of answers)', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd2', 1), makeQ('q3', 'd3', 2)]
    const result = gradeAttempt(qs, { q1: 3, q2: 1, q3: 0 })
    expect(result.missed.map(q => q.id)).toEqual(['q1', 'q3'])
  })

  it('100% correct → missed is empty', () => {
    const qs = [makeQ('q1', 'd1', 0), makeQ('q2', 'd2', 1)]
    const result = gradeAttempt(qs, { q1: 0, q2: 1 })
    expect(result.missed).toHaveLength(0)
  })
})

// ─── remainingSeconds ────────────────────────────────────────────────────────

describe('remainingSeconds', () => {
  it('remainingSeconds(S, 600, S+60000) === 540', () => {
    expect(remainingSeconds(S, 600, S + 60_000)).toBe(540)
  })

  it('remainingSeconds(S, 600, S) === 600 (no time elapsed)', () => {
    expect(remainingSeconds(S, 600, S)).toBe(600)
  })

  it('never returns negative: remainingSeconds(S, 600, S+700000) === 0', () => {
    expect(remainingSeconds(S, 600, S + 700_000)).toBe(0)
  })

  it('remainingSeconds at exactly expiry = 0', () => {
    expect(remainingSeconds(S, 600, S + 600_000)).toBe(0)
  })
})

// ─── isExpired ───────────────────────────────────────────────────────────────

describe('isExpired', () => {
  it('isExpired(S, 600, S+600000) === true (exactly expired)', () => {
    expect(isExpired(S, 600, S + 600_000)).toBe(true)
  })

  it('isExpired(S, 600, S+599000) === false (one second remaining)', () => {
    expect(isExpired(S, 600, S + 599_000)).toBe(false)
  })

  it('isExpired(S, 600, S+700000) === true (well past expiry)', () => {
    expect(isExpired(S, 600, S + 700_000)).toBe(true)
  })

  it('isExpired(S, 600, S) === false (no time elapsed)', () => {
    expect(isExpired(S, 600, S)).toBe(false)
  })
})

// ─── selectQuestions ──────────────────────────────────────────────────────────

/**
 * Deterministic rng helper: linear sequence cycling through fixed values.
 * Returns values from [0,1) deterministically so test outcomes are stable.
 */
function makeSeqRng(seq: number[]): () => number {
  let i = 0
  return () => seq[i++ % seq.length]
}

const SEQ_RNG = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85, 0.05, 0.55])

describe('selectQuestions — constants', () => {
  it('FREE_MIN === 5', () => {
    expect(FREE_MIN).toBe(5)
  })

  it('FREE_MAX === 15', () => {
    expect(FREE_MAX).toBe(15)
  })
})

describe('selectQuestions — scenario mode', () => {
  const pool = getQuestions()

  it('returns questions from exactly 4 distinct scenarios', () => {
    const result = selectQuestions('scenario', {}, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5]))
    const scenarios = new Set(result.map(q => q.scenario))
    expect(scenarios.size).toBe(4)
  })

  it('questions are grouped by scenario (all of scenario A then all of B, etc.)', () => {
    const result = selectQuestions('scenario', {}, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5]))
    // Check grouping: no scenario appears, disappears, then re-appears
    let lastScenario: string | undefined = undefined
    const seenScenarios = new Set<string>()
    for (const q of result) {
      if (q.scenario !== lastScenario) {
        expect(seenScenarios.has(q.scenario!)).toBe(false) // scenario should not repeat
        if (lastScenario !== undefined) {
          seenScenarios.add(lastScenario)
        }
        lastScenario = q.scenario
      }
    }
  })

  it('is deterministic: same rng sequence → same result', () => {
    const rng1 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5])
    const rng2 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5])
    const result1 = selectQuestions('scenario', {}, pool, rng1)
    const result2 = selectQuestions('scenario', {}, pool, rng2)
    expect(result1.map(q => q.id)).toEqual(result2.map(q => q.id))
  })
})

describe('selectQuestions — domain mode', () => {
  const pool = getQuestions()

  it("returns only d2 questions when opts={domain:'d2'}", () => {
    const result = selectQuestions('domain', { domain: 'd2' }, pool, SEQ_RNG)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(q => q.domain === 'd2')).toBe(true)
  })

  it('returns all pool questions for the chosen domain (no filtering beyond domain)', () => {
    const expected = pool.filter(q => q.domain === 'd2')
    const result = selectQuestions('domain', { domain: 'd2' }, pool, SEQ_RNG)
    expect(result.length).toBe(expected.length)
  })
})

describe('selectQuestions — timed mode', () => {
  const pool = getQuestions()

  it('returns exactly 10 questions', () => {
    const result = selectQuestions('timed', {}, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85]))
    expect(result.length).toBe(10)
  })

  it('ignores opts.n — always returns 10 even if n is provided', () => {
    const result = selectQuestions('timed', { n: 5 }, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85]))
    expect(result.length).toBe(10)
  })

  it('is deterministic: same rng → same 10 questions', () => {
    const rng1 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85])
    const rng2 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85])
    const result1 = selectQuestions('timed', {}, pool, rng1)
    const result2 = selectQuestions('timed', {}, pool, rng2)
    expect(result1.map(q => q.id)).toEqual(result2.map(q => q.id))
  })
})

describe('selectQuestions — free mode', () => {
  const pool = getQuestions() // 40 questions

  it('free with n:7 returns exactly 7 questions', () => {
    const result = selectQuestions('free', { n: 7 }, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3]))
    expect(result.length).toBe(7)
  })

  it('free with n:100 (>FREE_MAX=15) clamps to 15', () => {
    const result = selectQuestions('free', { n: 100 }, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85, 0.05, 0.55, 0.25, 0.75, 0.35]))
    expect(result.length).toBe(Math.min(FREE_MAX, pool.length))
    expect(result.length).toBe(15)
  })

  it('free with n:1 (<FREE_MIN=5) clamps to 5', () => {
    const result = selectQuestions('free', { n: 1 }, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9]))
    expect(result.length).toBe(Math.min(FREE_MIN, pool.length))
    expect(result.length).toBe(5)
  })

  it('free with n:undefined defaults to 10', () => {
    const result = selectQuestions('free', {}, pool, makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85]))
    expect(result.length).toBe(10)
  })

  it('is deterministic: same rng → same questions', () => {
    const rng1 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85])
    const rng2 = makeSeqRng([0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.6, 0.15, 0.85])
    const result1 = selectQuestions('free', { n: 10 }, pool, rng1)
    const result2 = selectQuestions('free', { n: 10 }, pool, rng2)
    expect(result1.map(q => q.id)).toEqual(result2.map(q => q.id))
  })
})
