import { describe, it, expect, beforeEach } from 'vitest'
import {
  readState,
  writeState,
  patchState,
  clearAll,
  STORAGE_KEY,
  SCHEMA_VERSION,
} from './storage'
import type { QuizAttempt } from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('readState', () => {
  it('returns defaults when localStorage is empty (first-run safe)', () => {
    const state = readState()
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.themePref).toBe('system')
  })

  it('returns defaults instead of throwing when the stored value is corrupt/non-JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json {{{{')
    const state = readState()
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.themePref).toBe('system')
  })

  it('returns defaults when stored object is missing schemaVersion', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ themePref: 'dark' }))
    const state = readState()
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.themePref).toBe('system')
  })

  it('returns defaults when stored schemaVersion is mismatched', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 999, themePref: 'dark' }))
    const state = readState()
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.themePref).toBe('system')
  })
})

describe('writeState + readState round-trip', () => {
  it('persists and reads back the themePref value', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'dark', srs: {}, quizHistory: [] })
    const state = readState()
    expect(state.themePref).toBe('dark')
  })

  it('round-trips the light theme', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light', srs: {}, quizHistory: [] })
    expect(readState().themePref).toBe('light')
  })
})

describe('patchState', () => {
  it('merges patch over existing state and persists', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light', srs: {}, quizHistory: [] })
    const result = patchState({ themePref: 'dark' })
    expect(result.themePref).toBe('dark')
    expect(readState().themePref).toBe('dark')
  })

  it('preserves unpatched fields', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light', srs: {}, quizHistory: [] })
    const result = patchState({ themePref: 'dark' })
    expect(result.schemaVersion).toBe(SCHEMA_VERSION)
  })
})

describe('clearAll', () => {
  it('removes the cae-trainer:v1 key; subsequent readState returns defaults', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'dark', srs: {}, quizHistory: [] })
    clearAll()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    const state = readState()
    expect(state.themePref).toBe('system')
  })
})

// ─── SRS persistence tests (03-01 addition) ─────────────────────────────────

describe('srs persistence', () => {
  it('freshly-read state has srs deeply equal to {} (default applied by readState)', () => {
    const state = readState()
    expect(state.srs).toEqual({})
  })

  it('patchState with srs round-trips through cae-trainer:v1', () => {
    patchState({ srs: { f1: { box: 2, dueAt: 123, lastRated: 100, rating: 'good' } } })
    const state = readState()
    expect(state.srs.f1.box).toBe(2)
    expect(state.srs.f1.dueAt).toBe(123)
    expect(state.srs.f1.lastRated).toBe(100)
    expect(state.srs.f1.rating).toBe('good')
  })

  it('schemaVersion remains 1 after writing srs', () => {
    patchState({ srs: { f1: { box: 3, dueAt: 999, lastRated: 500, rating: 'good' } } })
    expect(readState().schemaVersion).toBe(1)
  })

  it('clearAll then readState().srs deeply equals {} — reset clears SRS', () => {
    patchState({ srs: { f1: { box: 4, dueAt: 777, lastRated: 400, rating: 'good' } } })
    clearAll()
    expect(readState().srs).toEqual({})
  })
})

// ─── quizHistory persistence tests (04-01 addition) ─────────────────────────

const SAMPLE_ATTEMPT: QuizAttempt = {
  id: 'attempt-1',
  date: '2026-06-11T09:00:00.000Z',
  mode: 'Timed Full Exam',
  modeKey: 'timed',
  correct: 7,
  total: 10,
  scaled: 730,
  pass: true,
  perDomain: { d1: 80, d2: 70 },
  missed: [{ questionId: 'q3', selected: 2 }],
}

describe('quizHistory persistence', () => {
  it('freshly-read state has quizHistory deeply equal to [] (default applied by readState)', () => {
    const state = readState()
    expect(state.quizHistory).toEqual([])
  })

  it('schemaVersion stays 1 after adding quizHistory', () => {
    patchState({ quizHistory: [SAMPLE_ATTEMPT] })
    expect(readState().schemaVersion).toBe(1)
  })

  it('patchState with quizHistory round-trips through cae-trainer:v1', () => {
    patchState({ quizHistory: [SAMPLE_ATTEMPT] })
    const state = readState()
    expect(state.quizHistory).toHaveLength(1)
    expect(state.quizHistory[0].id).toBe('attempt-1')
    expect(state.quizHistory[0].scaled).toBe(730)
    expect(state.quizHistory[0].pass).toBe(true)
  })

  it('prepending adds to front: most recent attempt appears first', () => {
    const older: QuizAttempt = { ...SAMPLE_ATTEMPT, id: 'attempt-old', date: '2026-06-10T08:00:00.000Z' }
    const newer: QuizAttempt = { ...SAMPLE_ATTEMPT, id: 'attempt-new', date: '2026-06-11T10:00:00.000Z' }
    patchState({ quizHistory: [older] })
    const next = [newer, ...readState().quizHistory]
    patchState({ quizHistory: next })
    const state = readState()
    expect(state.quizHistory[0].id).toBe('attempt-new')
    expect(state.quizHistory[1].id).toBe('attempt-old')
  })

  it('clearAll then readState().quizHistory deeply equals [] — reset clears history', () => {
    patchState({ quizHistory: [SAMPLE_ATTEMPT] })
    clearAll()
    expect(readState().quizHistory).toEqual([])
  })

  it('old state without quizHistory reads as [] (backward compatibility via DEFAULT_STATE spread)', () => {
    // Simulate an old stored state that lacks quizHistory
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: SCHEMA_VERSION, themePref: 'dark', srs: {} }),
    )
    const state = readState()
    expect(state.quizHistory).toEqual([])
  })
})
