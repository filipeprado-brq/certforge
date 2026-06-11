import { useState } from 'react'
import { ThemePref, readState, patchState, clearAll } from './storage'
import type { QuizAttempt } from './storage'
import type { SrsCard } from './srs'

const DEFAULTS = { themePref: 'system' as ThemePref }

/**
 * React binding over storage.ts.
 * Holds themePref + srs + quizHistory in component state, initialised from persisted values.
 * setThemePref/rateCard/setSrs/addAttempt persist via patchState and update in-memory state.
 * resetAll clears the namespace and resets all in-memory state to defaults.
 */
export function useStoredState(): {
  themePref: ThemePref
  setThemePref: (t: ThemePref) => void
  srs: Record<string, SrsCard>
  rateCard: (id: string, card: SrsCard) => void
  setSrs: (next: Record<string, SrsCard>) => void
  quizHistory: QuizAttempt[]
  addAttempt: (attempt: QuizAttempt) => void
  resetAll: () => void
} {
  const [themePref, setThemePrefState] = useState<ThemePref>(
    () => readState().themePref
  )

  const [srs, setSrsState] = useState<Record<string, SrsCard>>(
    () => readState().srs
  )

  const [quizHistory, setQuizHistoryState] = useState<QuizAttempt[]>(
    () => readState().quizHistory
  )

  function setThemePref(t: ThemePref): void {
    patchState({ themePref: t })
    setThemePrefState(t)
  }

  /**
   * Persists one card's new SRS state and updates the in-memory map.
   * The UI computes `card` via srs.nextState(prev, rating, Date.now()).
   */
  function rateCard(id: string, card: SrsCard): void {
    const next = { ...readState().srs, [id]: card }
    patchState({ srs: next })
    setSrsState(next)
  }

  /**
   * Replaces the entire SRS map in storage and in-memory state.
   */
  function setSrs(next: Record<string, SrsCard>): void {
    patchState({ srs: next })
    setSrsState(next)
  }

  /**
   * Prepends a completed quiz attempt to quizHistory, persists it, and
   * updates in-memory state. Generating id/date happens in the UI layer
   * (impure) — the engine and this function stay pure/deterministic.
   */
  function addAttempt(attempt: QuizAttempt): void {
    const next = [attempt, ...readState().quizHistory]
    patchState({ quizHistory: next })
    setQuizHistoryState(next)
  }

  function resetAll(): void {
    clearAll()
    setThemePrefState(DEFAULTS.themePref)
    setSrsState({})
    setQuizHistoryState([])
  }

  return { themePref, setThemePref, srs, rateCard, setSrs, quizHistory, addAttempt, resetAll }
}
