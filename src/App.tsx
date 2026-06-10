import { useState, useEffect } from 'react'
import { useStoredState } from './lib/useStoredState'
import { ThemePref } from './lib/storage'
import { AppShell } from './components/AppShell'
import { Dashboard } from './screens/Dashboard'
import { Settings } from './screens/Settings'
import { Placeholder } from './screens/Placeholder'

export type Route = 'home' | 'flashcards' | 'quiz' | 'history' | 'settings'

function useResolvedTheme(pref: ThemePref): 'light' | 'dark' {
  const [sys, setSys] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = (e: MediaQueryListEvent) => setSys(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return pref === 'system' ? sys : pref
}

export function App() {
  const { themePref, setThemePref, resetAll } = useStoredState()
  const [route, setRoute] = useState<Route>('home')
  const theme = useResolvedTheme(themePref)

  const onToggleTheme = () => {
    setThemePref(theme === 'dark' ? 'light' : 'dark')
  }

  const onReset = () => {
    resetAll()
    setRoute('home')
  }

  let screen: React.ReactNode = null
  if (route === 'home') {
    screen = <Dashboard onNav={setRoute} />
  } else if (route === 'flashcards') {
    screen = <Placeholder title="Flashcards" />
  } else if (route === 'quiz') {
    screen = <Placeholder title="Quiz" />
  } else if (route === 'history') {
    screen = <Placeholder title="History" />
  } else if (route === 'settings') {
    screen = (
      <Settings
        themePref={themePref}
        onThemePref={setThemePref}
        onReset={onReset}
      />
    )
  }

  return (
    <div className="app-root" data-theme={theme}>
      <AppShell
        route={route}
        onNav={setRoute}
        theme={theme}
        onToggleTheme={onToggleTheme}
      >
        {screen}
      </AppShell>
    </div>
  )
}
