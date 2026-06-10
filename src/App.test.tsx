import { render, screen, fireEvent, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { App } from './App'
import { STORAGE_KEY } from './lib/storage'

// Mock matchMedia — system theme "light" by default
function mockMatchMedia(darkMatches: boolean) {
  const listeners: ((e: MediaQueryListEvent) => void)[] = []
  const mq = {
    matches: darkMatches,
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn)
    },
    removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(fn)
      if (idx !== -1) listeners.splice(idx, 1)
    },
    dispatchChange: (matches: boolean) => {
      listeners.forEach((fn) => fn({ matches } as MediaQueryListEvent))
    },
  }
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue(mq),
  })
  return mq
}

beforeEach(() => {
  localStorage.clear()
  mockMatchMedia(false) // default: light system theme
})

describe('App — initial render', () => {
  it('shows the Home dashboard with Study flashcards CTA on first load', () => {
    render(<App />)
    // Multiple "Study flashcards" buttons exist (entry card + empty state action)
    const ctaBtns = screen.getAllByText('Study flashcards')
    expect(ctaBtns.length).toBeGreaterThanOrEqual(1)
    expect(ctaBtns[0]).toBeInTheDocument()
  })
})

describe('App — navigation', () => {
  it('switches to Flashcards study loop when Flashcards nav tab is clicked', () => {
    render(<App />)
    // Find the desktop nav tab (first one is in nav-tabs, second in bottom-nav)
    const flashcardsBtns = screen.getAllByRole('button', { name: 'Flashcards' })
    fireEvent.click(flashcardsBtns[0])
    // Flashcards tab should now have aria-current="page"
    const activeButtons = screen.getAllByRole('button', { name: 'Flashcards' })
    expect(activeButtons[0]).toHaveAttribute('aria-current', 'page')
    // Content should show the Deck Overview title "Card decks", NOT the placeholder
    expect(screen.getByRole('heading', { name: /Card decks/i })).toBeInTheDocument()
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()
  })

  it('switches to Quiz browse catalog when Quiz nav tab is clicked', () => {
    render(<App />)
    const quizBtns = screen.getAllByRole('button', { name: 'Quiz' })
    fireEvent.click(quizBtns[0])
    // Quiz tab should now have aria-current="page"
    const activeButtons = screen.getAllByRole('button', { name: 'Quiz' })
    expect(activeButtons[0]).toHaveAttribute('aria-current', 'page')
    // Content should show the question bank, NOT the placeholder
    expect(screen.getByText('Question bank')).toBeInTheDocument()
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()
  })
})

describe('App — theme toggle', () => {
  it('starts with data-theme="light" when matchMedia reports light system preference', () => {
    render(<App />)
    const root = document.querySelector('.app-root')
    expect(root).toHaveAttribute('data-theme', 'light')
  })

  it('toggles data-theme to "dark" when the theme toggle button is clicked', () => {
    render(<App />)
    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(toggleBtn)
    const root = document.querySelector('.app-root')
    expect(root).toHaveAttribute('data-theme', 'dark')
  })
})

describe('App — theme persistence', () => {
  it('persists theme preference to cae-trainer:v1 when changed', () => {
    render(<App />)
    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(toggleBtn)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.themePref).toBe('dark')
  })

  it('restores persisted theme on remount (simulates page refresh)', () => {
    // Write dark theme to storage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, themePref: 'dark' })
    )
    render(<App />)
    const root = document.querySelector('.app-root')
    expect(root).toHaveAttribute('data-theme', 'dark')
  })
})

describe('App — reset', () => {
  it('clears cae-trainer:v1 from localStorage after reset and returns to Home', async () => {
    // Set some stored pref first
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, themePref: 'dark' })
    )
    render(<App />)

    // Navigate to Settings
    const settingsBtns = screen.getAllByRole('button', { name: 'Settings' })
    fireEvent.click(settingsBtns[0])

    // Click the Reset button to open the dialog
    const resetBtn = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetBtn)

    // Confirm reset
    const confirmBtn = screen.getByRole('button', { name: 'Yes, reset everything' })
    await act(async () => {
      fireEvent.click(confirmBtn)
    })

    // Storage key should be cleared
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    // App should be back on Home (Study flashcards should be visible)
    const homeBtns = screen.getAllByText('Study flashcards')
    expect(homeBtns.length).toBeGreaterThanOrEqual(1)
  })
})
