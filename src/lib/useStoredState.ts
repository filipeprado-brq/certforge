import { useState } from 'react'
import { ThemePref, readState, patchState, clearAll } from './storage'

const DEFAULTS = { themePref: 'system' as ThemePref }

/**
 * React binding over storage.ts.
 * Holds themePref in component state, initialised from the persisted value.
 * setThemePref persists via patchState and updates in-memory state.
 * resetAll clears the namespace and resets in-memory state to defaults.
 */
export function useStoredState(): {
  themePref: ThemePref
  setThemePref: (t: ThemePref) => void
  resetAll: () => void
} {
  const [themePref, setThemePrefState] = useState<ThemePref>(
    () => readState().themePref
  )

  function setThemePref(t: ThemePref): void {
    patchState({ themePref: t })
    setThemePrefState(t)
  }

  function resetAll(): void {
    clearAll()
    setThemePrefState(DEFAULTS.themePref)
  }

  return { themePref, setThemePref, resetAll }
}
