import { describe, it, expect, beforeEach } from 'vitest'
import {
  readState,
  writeState,
  patchState,
  clearAll,
  STORAGE_KEY,
  SCHEMA_VERSION,
} from './storage'

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
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'dark' })
    const state = readState()
    expect(state.themePref).toBe('dark')
  })

  it('round-trips the light theme', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light' })
    expect(readState().themePref).toBe('light')
  })
})

describe('patchState', () => {
  it('merges patch over existing state and persists', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light' })
    const result = patchState({ themePref: 'dark' })
    expect(result.themePref).toBe('dark')
    expect(readState().themePref).toBe('dark')
  })

  it('preserves unpatched fields', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'light' })
    const result = patchState({ themePref: 'dark' })
    expect(result.schemaVersion).toBe(SCHEMA_VERSION)
  })
})

describe('clearAll', () => {
  it('removes the cae-trainer:v1 key; subsequent readState returns defaults', () => {
    writeState({ schemaVersion: SCHEMA_VERSION, themePref: 'dark' })
    clearAll()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    const state = readState()
    expect(state.themePref).toBe('system')
  })
})
