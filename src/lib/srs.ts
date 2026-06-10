// =============================================================================
// Pure Leitner scheduler — callers inject `now` (epoch ms); no wall-clock reads
// FLASH-02 (Again resurfaces soon), FLASH-03 (Good spaces out), FLASH-05 (stats)
// =============================================================================

export type Box = 1 | 2 | 3 | 4 | 5
export type Rating = 'again' | 'good'

export interface SrsCard {
  box: Box
  /** Epoch ms: card is due when now >= dueAt */
  dueAt: number
  /** Epoch ms of the rating that produced this state */
  lastRated: number
  rating: Rating
}

const DAY_MS = 86_400_000

/** Leitner interval ladder (days per box) */
const INTERVALS: Record<Box, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 16,
}

/** Returns the number of days before a card in `box` comes due again. */
export function intervalDays(box: Box): number {
  return INTERVALS[box]
}

/**
 * Returns the epoch ms for the start of the local calendar day containing `now`
 * (i.e. midnight local time). This function is pure — it reads nothing global.
 */
export function startOfDay(epochMs: number): number {
  const d = new Date(epochMs)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * Returns true when the card is due to be reviewed.
 * An unseen card (undefined) is always due.
 * A seen card is due when the current time has reached or passed dueAt.
 */
export function isDue(card: SrsCard | undefined, now: number): boolean {
  if (!card) return true
  return now >= card.dueAt
}

/**
 * Computes the new SrsCard state after rating a card.
 *
 * - Again → box 1, due today (startOfDay(now)).
 * - Good  → box + 1 (capped at 5), due startOfDay(now) + interval(newBox) days.
 *
 * The caller passes `now` (epoch ms); this function never reads the wall clock.
 */
export function nextState(
  prev: SrsCard | undefined,
  rating: Rating,
  now: number,
): SrsCard {
  let newBox: Box

  if (rating === 'again') {
    newBox = 1
  } else {
    // rating === 'good'
    // Unseen prev counts as box 1, so Good → box 2
    newBox = Math.min(5, (prev?.box ?? 1) + 1) as Box
  }

  const dueAt = startOfDay(now) + intervalDays(newBox) * DAY_MS

  return { box: newBox, dueAt, lastRated: now, rating }
}
