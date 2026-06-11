import { describe, it, expect } from 'vitest'
import {
  scaledScore,
  isPass,
  PASS_MARK,
  gradeAttempt,
  remainingSeconds,
  isExpired,
} from './quiz'
import type { Question } from '../data/types'

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
