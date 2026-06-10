// =============================================================================
// Invariant tests for the content data layer (TDD)
// RED: These tests are written before the implementation exists.
// GREEN: They should all pass after content.ts + data files are authored.
// =============================================================================

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { getFlashcards, getQuestions, flashcardCountsByDomain, questionCountsByDomain } from './content'

// ---------------------------------------------------------------------------
// Count invariants
// ---------------------------------------------------------------------------
describe('content counts', () => {
  it('getFlashcards() returns exactly 15 seed flashcards', () => {
    expect(getFlashcards().length).toBe(15)
  })

  it('getQuestions() returns exactly 26 questions (14 seed + 12 official)', () => {
    expect(getQuestions().length).toBe(26)
  })

  it('official-sample questions number exactly 12', () => {
    const officialSample = getQuestions().filter(q => q.source === 'official-sample')
    expect(officialSample.length).toBe(12)
  })

  it('original questions number exactly 14', () => {
    const original = getQuestions().filter(q => q.source === 'original')
    expect(original.length).toBe(14)
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
// No fetch/XHR/axios/dynamic-import in data modules (CONT-06)
// ---------------------------------------------------------------------------
describe('no network/dynamic-import primitives in data modules', () => {
  const dataFiles = [
    new URL('./flashcards.ts', import.meta.url).pathname,
    new URL('./questions.ts', import.meta.url).pathname,
    new URL('./content.ts', import.meta.url).pathname,
  ]

  const forbidden = ['fetch(', 'XHR', 'axios', 'import(']

  dataFiles.forEach(filePath => {
    it(`${filePath.split('/').pop()} contains no network/dynamic-import primitives`, () => {
      const src = readFileSync(filePath, 'utf-8')
      forbidden.forEach(pattern => {
        expect(src).not.toContain(pattern)
      })
    })
  })
})
