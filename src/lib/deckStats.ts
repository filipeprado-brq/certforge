// =============================================================================
// Pure per-domain stats + due-queue builder
// All functions take injected `now` (epoch ms) — no wall-clock reads
// FLASH-04 (due queue), FLASH-05 (per-domain learned/due counts)
// =============================================================================

import { DOMAINS, type DomainId } from '../data/domains'
import type { Flashcard } from '../data/types'
import { isDue, type SrsCard } from './srs'

export interface DomainStat {
  total: number
  learned: number
  due: number
}

type SrsMap = Record<string, SrsCard>

/**
 * Computes per-domain {total, learned, due} stats from the full card list,
 * current SRS map, and injected now.
 *
 * - learned: card.box >= 3 (seen and spaced at least twice)
 * - due: isDue(srs[card.id], now) — unseen cards count as due
 */
export function deckStatsByDomain(
  cards: Flashcard[],
  srs: SrsMap,
  now: number,
): Record<DomainId, DomainStat> {
  // Seed each domain with zeros
  const stats = {} as Record<DomainId, DomainStat>
  for (const domain of DOMAINS) {
    stats[domain.id] = { total: 0, learned: 0, due: 0 }
  }

  for (const card of cards) {
    const stat = stats[card.domain]
    if (!stat) continue // guard against unknown domain ids
    stat.total++
    const srsCard = srs[card.id]
    if ((srsCard?.box ?? 0) >= 3) stat.learned++
    if (isDue(srsCard, now)) stat.due++
  }

  return stats
}

/**
 * Builds the ordered list of card IDs that are currently due.
 *
 * Ordering (locked per 03-CONTEXT decision):
 *   - SEEN-due cards sort first, ordered by dueAt ascending (due-soonest first).
 *   - UNSEEN cards sort last (treated as dueAt = +Infinity); stable within each group.
 *
 * @param domain — optional domain filter; omit to include all domains.
 */
export function buildDueQueue(
  cards: Flashcard[],
  srs: SrsMap,
  now: number,
  domain?: DomainId,
): string[] {
  const filtered = domain ? cards.filter(c => c.domain === domain) : cards
  const due = filtered.filter(c => isDue(srs[c.id], now))

  // Stable sort: seen-due (finite dueAt) before unseen (treated as +Infinity).
  // Array.prototype.sort is stable in modern JS (ES2019+).
  due.sort((a, b) => {
    const aDueAt = srs[a.id]?.dueAt ?? Infinity
    const bDueAt = srs[b.id]?.dueAt ?? Infinity
    return aDueAt - bDueAt
  })

  return due.map(c => c.id)
}

/**
 * Returns the total count of due cards (optionally filtered by domain).
 * Convenience wrapper around buildDueQueue.
 */
export function overallDueCount(
  cards: Flashcard[],
  srs: SrsMap,
  now: number,
  domain?: DomainId,
): number {
  return buildDueQueue(cards, srs, now, domain).length
}
