import React from 'react'
import { IconSun, IconMoon } from './icons'

export type Route = 'home' | 'flashcards' | 'quiz' | 'history' | 'settings'

const NAV: { key: Route; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
]

interface AppShellProps {
  route: Route
  onNav: (r: Route) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  children: React.ReactNode
}

export const AppShell = ({
  route,
  onNav,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) => (
  <div className="viewport-clamp">
    <div className="shell">
      <header className="app-header">
        <img
          className="logo"
          src={
            theme === 'dark'
              ? '/brq/assets/brq-logo-white.png'
              : '/brq/assets/brq-logo-black.png'
          }
          alt="brq"
        />
        <span className="header-title">Claude Architect · Exam Trainer</span>
        <span className="spacer"></span>
        <nav className="nav-tabs" aria-label="Main">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-tab${route === n.key ? ' active' : ''}`}
              aria-current={route === n.key ? 'page' : undefined}
              onClick={() => onNav(n.key)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </header>
      <main>{children}</main>
      <footer className="app-footer">
        <span>© BRQ 2026 · Building what matters</span>
        <span>Claude Certified Architect · Foundations</span>
      </footer>
    </div>
    <nav className="bottom-nav" aria-label="Main">
      {NAV.map((n) => (
        <button
          key={n.key}
          className={`nav-tab${route === n.key ? ' active' : ''}`}
          aria-current={route === n.key ? 'page' : undefined}
          onClick={() => onNav(n.key)}
        >
          {n.label}
        </button>
      ))}
    </nav>
  </div>
)
