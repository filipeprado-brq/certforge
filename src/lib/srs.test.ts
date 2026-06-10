import { describe, it, expect } from 'vitest'
import { intervalDays, startOfDay, nextState, isDue } from './srs'

// Fixed "now" for deterministic tests: 2026-06-10T12:00:00.000Z
const NOW = new Date('2026-06-10T12:00:00.000Z').getTime()

describe('intervalDays', () => {
  it('returns the Leitner ladder [0,1,3,7,16] for boxes 1..5', () => {
    expect(intervalDays(1)).toBe(0)
    expect(intervalDays(2)).toBe(1)
    expect(intervalDays(3)).toBe(3)
    expect(intervalDays(4)).toBe(7)
    expect(intervalDays(5)).toBe(16)
  })
})

describe('startOfDay', () => {
  it('is idempotent: startOfDay(startOfDay(t)) === startOfDay(t)', () => {
    const sod = startOfDay(NOW)
    expect(startOfDay(sod)).toBe(sod)
  })

  it('result is <= now', () => {
    expect(startOfDay(NOW)).toBeLessThanOrEqual(NOW)
  })

  it('result represents midnight (hours/min/sec/ms zeroed in local time)', () => {
    const sod = startOfDay(NOW)
    const d = new Date(sod)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('nextState (unseen → again)', () => {
  it('nextState(undefined, "again", now) → box 1, dueAt = startOfDay(now), lastRated = now, rating = "again"', () => {
    const result = nextState(undefined, 'again', NOW)
    expect(result.box).toBe(1)
    expect(result.dueAt).toBe(startOfDay(NOW))
    expect(result.lastRated).toBe(NOW)
    expect(result.rating).toBe('again')
  })
})

describe('nextState (unseen → good)', () => {
  it('nextState(undefined, "good", now) → box 2, dueAt = startOfDay(now) + 1 day (not due today)', () => {
    const result = nextState(undefined, 'good', NOW)
    expect(result.box).toBe(2)
    expect(result.dueAt).toBe(startOfDay(NOW) + 1 * 86_400_000)
    expect(result.rating).toBe('good')
    // Not due at the same "now" (dueAt is in the future)
    expect(result.dueAt).toBeGreaterThan(NOW)
  })
})

describe('nextState (box 2 → good)', () => {
  it('nextState({ box: 2 }, "good", now) → box 3, dueAt = startOfDay(now) + 3 days', () => {
    const prev = { box: 2 as const, dueAt: NOW - 1, lastRated: NOW - 86_400_000, rating: 'good' as const }
    const result = nextState(prev, 'good', NOW)
    expect(result.box).toBe(3)
    expect(result.dueAt).toBe(startOfDay(NOW) + 3 * 86_400_000)
  })
})

describe('nextState (box 5 → good, capped)', () => {
  it('nextState({ box: 5 }, "good", now) → stays box 5, dueAt = startOfDay(now) + 16 days', () => {
    const prev = { box: 5 as const, dueAt: NOW - 1, lastRated: NOW - 86_400_000, rating: 'good' as const }
    const result = nextState(prev, 'good', NOW)
    expect(result.box).toBe(5)
    expect(result.dueAt).toBe(startOfDay(NOW) + 16 * 86_400_000)
  })
})

describe('nextState (box 4 → again, reset)', () => {
  it('nextState({ box: 4 }, "again", now) → box 1, dueAt = startOfDay(now) (due today)', () => {
    const prev = { box: 4 as const, dueAt: NOW - 1, lastRated: NOW - 86_400_000, rating: 'good' as const }
    const result = nextState(prev, 'again', NOW)
    expect(result.box).toBe(1)
    expect(result.dueAt).toBe(startOfDay(NOW))
    expect(result.rating).toBe('again')
  })
})

describe('isDue', () => {
  it('isDue(undefined, now) === true (unseen card is always due)', () => {
    expect(isDue(undefined, NOW)).toBe(true)
  })

  it('isDue({ dueAt: startOfDay(now) }, now) === true (due at start of today)', () => {
    const card = { box: 1 as const, dueAt: startOfDay(NOW), lastRated: NOW - 86_400_000, rating: 'again' as const }
    expect(isDue(card, NOW)).toBe(true)
  })

  it('isDue({ dueAt: now + 86400000 }, now) === false (due tomorrow)', () => {
    const card = { box: 2 as const, dueAt: NOW + 86_400_000, lastRated: NOW - 1, rating: 'good' as const }
    expect(isDue(card, NOW)).toBe(false)
  })
})
