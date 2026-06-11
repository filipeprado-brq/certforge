// =============================================================================
// Invariant tests for the content data layer (TDD)
// RED: These tests are written before the implementation exists.
// GREEN: They should all pass after content.ts + data files are authored.
// =============================================================================

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { getFlashcards, getQuestions, flashcardCountsByDomain, questionCountsByDomain } from './content'

// Per-domain minimum targets (from 05-CONTEXT.md — must track exam weights)
const FC_MIN = { d1: 40, d2: 27, d3: 30, d4: 30, d5: 23 }
const Q_MIN  = { d1: 11, d2: 7,  d3: 8,  d4: 8,  d5: 6 }

// ---------------------------------------------------------------------------
// Count invariants — per-domain minimums
// ---------------------------------------------------------------------------
describe('per-domain minimum counts', () => {
  it('flashcard count d1 >= 40', () => {
    expect(flashcardCountsByDomain()['d1']).toBeGreaterThanOrEqual(FC_MIN.d1)
  })
  it('flashcard count d2 >= 27', () => {
    expect(flashcardCountsByDomain()['d2']).toBeGreaterThanOrEqual(FC_MIN.d2)
  })
  it('flashcard count d3 >= 30', () => {
    expect(flashcardCountsByDomain()['d3']).toBeGreaterThanOrEqual(FC_MIN.d3)
  })
  it('flashcard count d4 >= 30', () => {
    expect(flashcardCountsByDomain()['d4']).toBeGreaterThanOrEqual(FC_MIN.d4)
  })
  it('flashcard count d5 >= 23', () => {
    expect(flashcardCountsByDomain()['d5']).toBeGreaterThanOrEqual(FC_MIN.d5)
  })

  it('question count d1 >= 11', () => {
    expect(questionCountsByDomain()['d1']).toBeGreaterThanOrEqual(Q_MIN.d1)
  })
  it('question count d2 >= 7', () => {
    expect(questionCountsByDomain()['d2']).toBeGreaterThanOrEqual(Q_MIN.d2)
  })
  it('question count d3 >= 8', () => {
    expect(questionCountsByDomain()['d3']).toBeGreaterThanOrEqual(Q_MIN.d3)
  })
  it('question count d4 >= 8', () => {
    expect(questionCountsByDomain()['d4']).toBeGreaterThanOrEqual(Q_MIN.d4)
  })
  it('question count d5 >= 6', () => {
    expect(questionCountsByDomain()['d5']).toBeGreaterThanOrEqual(Q_MIN.d5)
  })
})

// ---------------------------------------------------------------------------
// Count invariants — totals
// ---------------------------------------------------------------------------
describe('content totals', () => {
  it('getFlashcards() returns at least 150 flashcards', () => {
    expect(getFlashcards().length).toBeGreaterThanOrEqual(150)
  })

  it('getQuestions() returns at least 40 questions', () => {
    expect(getQuestions().length).toBeGreaterThanOrEqual(40)
  })

  it('official-sample questions number exactly 12', () => {
    const officialSample = getQuestions().filter(q => q.source === 'official-sample')
    expect(officialSample.length).toBe(12)
  })
})

// ---------------------------------------------------------------------------
// ID uniqueness invariants
// ---------------------------------------------------------------------------
describe('id uniqueness', () => {
  it('all flashcard ids are unique', () => {
    const ids = getFlashcards().map(f => f.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('all question ids are unique', () => {
    const ids = getQuestions().map(q => q.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})

// ---------------------------------------------------------------------------
// Shape invariants — every question
// ---------------------------------------------------------------------------
describe('question shape invariants', () => {
  it('every question has exactly 4 options', () => {
    getQuestions().forEach(q => {
      expect(q.options.length).toBe(4)
    })
  })

  it('every question correct index is integer 0..3', () => {
    getQuestions().forEach(q => {
      expect([0, 1, 2, 3]).toContain(q.correct)
    })
  })

  it('every question has non-empty whyCorrect', () => {
    getQuestions().forEach(q => {
      expect(q.whyCorrect.trim()).not.toBe('')
    })
  })

  it('every question has non-empty whyOthers', () => {
    getQuestions().forEach(q => {
      expect(q.whyOthers.trim()).not.toBe('')
    })
  })
})

// ---------------------------------------------------------------------------
// Shape invariants — every flashcard
// ---------------------------------------------------------------------------
describe('flashcard shape invariants', () => {
  it('every flashcard has non-empty front', () => {
    getFlashcards().forEach(f => {
      expect(f.front.trim()).not.toBe('')
    })
  })

  it('every flashcard has non-empty back', () => {
    getFlashcards().forEach(f => {
      expect(f.back.trim()).not.toBe('')
    })
  })

  it('every flashcard domain is one of d1..d5', () => {
    const validDomains = new Set(['d1', 'd2', 'd3', 'd4', 'd5'])
    getFlashcards().forEach(f => {
      expect(validDomains.has(f.domain)).toBe(true)
    })
  })
})

// ---------------------------------------------------------------------------
// Selector filtering
// ---------------------------------------------------------------------------
describe('getQuestions filtering', () => {
  it('getQuestions({domain: "d3"}) returns only d3 questions', () => {
    const d3 = getQuestions({ domain: 'd3' })
    expect(d3.length).toBeGreaterThan(0)
    d3.forEach(q => expect(q.domain).toBe('d3'))
  })

  it('getQuestions({scenario: "Multi-Agent Research System"}) returns only that scenario', () => {
    const mas = getQuestions({ scenario: 'Multi-Agent Research System' })
    expect(mas.length).toBeGreaterThan(0)
    mas.forEach(q => expect(q.scenario).toBe('Multi-Agent Research System'))
  })
})

describe('getFlashcards filtering', () => {
  it('getFlashcards({domain: "d1"}) returns only d1 flashcards', () => {
    const d1 = getFlashcards({ domain: 'd1' })
    expect(d1.length).toBeGreaterThan(0)
    d1.forEach(f => expect(f.domain).toBe('d1'))
  })
})

// ---------------------------------------------------------------------------
// Count maps
// ---------------------------------------------------------------------------
describe('count maps', () => {
  it('flashcardCountsByDomain() sums to total flashcard count', () => {
    const counts = flashcardCountsByDomain()
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    expect(total).toBe(getFlashcards().length)
  })

  it('questionCountsByDomain() sums to total question count', () => {
    const counts = questionCountsByDomain()
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    expect(total).toBe(getQuestions().length)
  })

  it('flashcardCountsByDomain() covers all 5 domains', () => {
    const counts = flashcardCountsByDomain()
    expect(Object.keys(counts).sort()).toEqual(['d1', 'd2', 'd3', 'd4', 'd5'])
  })

  it('questionCountsByDomain() covers all 5 domains', () => {
    const counts = questionCountsByDomain()
    expect(Object.keys(counts).sort()).toEqual(['d1', 'd2', 'd3', 'd4', 'd5'])
  })
})

// ---------------------------------------------------------------------------
// Task-statement coverage (EXP-03)
// ---------------------------------------------------------------------------
describe('task-statement coverage (EXP-03)', () => {
  const TASK_STATEMENTS = ['1.1','1.2','1.3','1.4','1.5','1.6','1.7','2.1','2.2','2.3','2.4','2.5','3.1','3.2','3.3','3.4','3.5','3.6','4.1','4.2','4.3','4.4','4.5','4.6','5.1','5.2','5.3','5.4','5.5','5.6'] as const
  const present = new Set(getFlashcards().map(f => f.taskRef).filter(Boolean))

  it('TASK_STATEMENTS covers all 30 task statement ids', () => {
    expect(TASK_STATEMENTS.length).toBe(30)
  })

  it('every task statement 1.1-5.6 appears as a taskRef on >=1 flashcard', () => {
    TASK_STATEMENTS.forEach(ts => expect(present.has(ts)).toBe(true))
  })

  it('every taskRef value is a valid task statement', () => {
    getFlashcards().forEach(f => {
      if (f.taskRef) expect(TASK_STATEMENTS).toContain(f.taskRef)
    })
  })
})

// ---------------------------------------------------------------------------
// No fetch/XHR/axios/dynamic-import in data modules (CONT-06)
// ---------------------------------------------------------------------------
describe('no network/dynamic-import primitives in data modules', () => {
  // Use fileURLToPath to get the real filesystem path from import.meta.url.
  // In vitest with jsdom the URL may be http-based; fall back to process.cwd()
  // resolution if the URL scheme is not 'file:'.
  function resolveDataFile(name: string): string {
    try {
      const u = new URL(import.meta.url)
      if (u.protocol === 'file:') {
        const dir = dirname(fileURLToPath(import.meta.url))
        return join(dir, name)
      }
    } catch {
      // swallow — fall through to cwd approach
    }
    return join(process.cwd(), 'src', 'data', name)
  }

  const dataFileNames = ['flashcards.ts', 'questions.ts', 'content.ts']
  const forbidden = ['fetch(', 'XHR', 'axios', 'import(']

  dataFileNames.forEach(name => {
    it(`${name} contains no network/dynamic-import primitives`, () => {
      const filePath = resolveDataFile(name)
      const src = readFileSync(filePath, 'utf-8')
      forbidden.forEach(pattern => {
        expect(src).not.toContain(pattern)
      })
    })
  })
})
