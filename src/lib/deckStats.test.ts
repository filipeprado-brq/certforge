import { describe, it, expect } from 'vitest'
import { deckStatsByDomain, buildDueQueue, overallDueCount } from './deckStats'
import { nextState, startOfDay } from './srs'
import { getFlashcards } from '../data/content'
import type { SrsCard } from './srs'
import type { Flashcard } from '../data/types'
import type { DomainId } from '../data/domains'

// Fixed "now" for deterministic tests: 2026-06-10T12:00:00.000Z
const NOW = new Date('2026-06-10T12:00:00.000Z').getTime()

// Small fixture cards spanning two domains
const CARDS: Flashcard[] = [
  { id: 'f1', domain: 'd1', front: 'Q1', back: 'A1' },
  { id: 'f2', domain: 'd1', front: 'Q2', back: 'A2' },
  { id: 'f3', domain: 'd2', front: 'Q3', back: 'A3' },
  { id: 'f4', domain: 'd2', front: 'Q4', back: 'A4' },
  { id: 'f5', domain: 'd3', front: 'Q5', back: 'A5' },
]

describe('deckStatsByDomain — fresh user (empty srs map)', () => {
  it('returns learned=0 and due=total for every domain when srs is empty', () => {
    const allCards = getFlashcards()
    const stats = deckStatsByDomain(allCards, {}, NOW)
    const domainIds: DomainId[] = ['d1', 'd2', 'd3', 'd4', 'd5']
    for (const id of domainIds) {
      expect(stats[id].learned).toBe(0)
      expect(stats[id].due).toBe(stats[id].total)
      expect(stats[id].total).toBeGreaterThan(0)
    }
  })

  it('correctly counts totals per domain using fixture cards', () => {
    const stats = deckStatsByDomain(CARDS, {}, NOW)
    expect(stats['d1'].total).toBe(2)
    expect(stats['d2'].total).toBe(2)
    expect(stats['d3'].total).toBe(1)
  })
})

describe('deckStatsByDomain — learned threshold (box >= 3)', () => {
  it('a card with box 3 counts as learned', () => {
    const srs: Record<string, SrsCard> = {
      f1: { box: 3, dueAt: NOW + 86_400_000 * 3, lastRated: NOW - 1, rating: 'good' },
    }
    const stats = deckStatsByDomain(CARDS, srs, NOW)
    expect(stats['d1'].learned).toBe(1)
  })

  it('a card with box 2 does NOT count as learned', () => {
    const srs: Record<string, SrsCard> = {
      f1: { box: 2, dueAt: NOW + 86_400_000, lastRated: NOW - 1, rating: 'good' },
    }
    const stats = deckStatsByDomain(CARDS, srs, NOW)
    expect(stats['d1'].learned).toBe(0)
  })

  it('a card with box 4 counts as learned', () => {
    const srs: Record<string, SrsCard> = {
      f2: { box: 4, dueAt: NOW + 86_400_000 * 7, lastRated: NOW - 1, rating: 'good' },
    }
    const stats = deckStatsByDomain(CARDS, srs, NOW)
    expect(stats['d1'].learned).toBe(1)
  })
})

describe('deckStatsByDomain — due count', () => {
  it('a card with dueAt = now + 1 day is NOT due', () => {
    const srs: Record<string, SrsCard> = {
      f1: { box: 2, dueAt: NOW + 86_400_000, lastRated: NOW - 86_400_000, rating: 'good' },
    }
    const stats = deckStatsByDomain(CARDS, srs, NOW)
    // f1 is not due, f2 is unseen (due). So d1.due = 1.
    expect(stats['d1'].due).toBe(1)
  })
})

describe('buildDueQueue', () => {
  it('rated "good" card (dueAt in the future) is NOT in the queue for same now', () => {
    const ratedGood = nextState(undefined, 'good', NOW)
    const srs: Record<string, SrsCard> = { f1: ratedGood }
    const queue = buildDueQueue(CARDS, srs, NOW)
    expect(queue).not.toContain('f1')
  })

  it('rated "again" card (dueAt = startOfDay(now)) IS in the queue for same now', () => {
    const ratedAgain = nextState(undefined, 'again', NOW)
    const srs: Record<string, SrsCard> = { f1: ratedAgain }
    const queue = buildDueQueue(CARDS, srs, NOW)
    expect(queue).toContain('f1')
  })

  it('unseen cards (no srs entry) are in the queue', () => {
    const queue = buildDueQueue(CARDS, {}, NOW)
    expect(queue).toContain('f1')
    expect(queue).toContain('f2')
    expect(queue).toContain('f3')
  })

  it('filters by domain when domain is provided', () => {
    const queue = buildDueQueue(CARDS, {}, NOW, 'd1')
    expect(queue).toContain('f1')
    expect(queue).toContain('f2')
    expect(queue).not.toContain('f3')
    expect(queue).not.toContain('f4')
  })

  it('ORDERING GUARD: seen-due card (finite dueAt) sorts BEFORE unseen card, even if unseen appears first in input', () => {
    // seenDue appears AFTER unseenCard in CARDS array but should sort first in queue
    const seenDueCards: Flashcard[] = [
      { id: 'unseen', domain: 'd1', front: 'Unseen', back: 'Unseen' }, // no srs entry
      { id: 'seen-due', domain: 'd1', front: 'SeenDue', back: 'SeenDue' }, // srs entry, due today
    ]
    const srs: Record<string, SrsCard> = {
      'seen-due': {
        box: 1,
        dueAt: startOfDay(NOW), // due today
        lastRated: NOW - 86_400_000,
        rating: 'again',
      },
    }
    const queue = buildDueQueue(seenDueCards, srs, NOW)
    // Both cards are due, but seen-due card must come before unseen card
    expect(queue[0]).toBe('seen-due')
    expect(queue[1]).toBe('unseen')
    // Assert ordering: seen-due card appears before unseen
    const seenDueIdx = queue.indexOf('seen-due')
    const unseenIdx = queue.indexOf('unseen')
    expect(seenDueIdx).toBeLessThan(unseenIdx)
  })
})

describe('overallDueCount', () => {
  it('returns total count of due cards across all domains', () => {
    // All cards unseen → all due
    const count = overallDueCount(CARDS, {}, NOW)
    expect(count).toBe(CARDS.length)
  })

  it('returns count filtered by domain', () => {
    const count = overallDueCount(CARDS, {}, NOW, 'd1')
    expect(count).toBe(2) // f1 and f2 are in d1
  })
})
