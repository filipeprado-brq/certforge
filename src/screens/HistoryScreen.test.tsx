// =============================================================================
// HistoryScreen component tests — TDD RED phase
// =============================================================================

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { STORAGE_KEY } from '../lib/storage'
import type { QuizAttempt } from '../lib/storage'
import { HistoryScreen } from './HistoryScreen'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seedHistory(attempts: QuizAttempt[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, themePref: 'system', srs: {}, quizHistory: attempts }),
  )
}

// A real question id from the content layer — q1 exists in questions.ts
const REAL_Q_ID = 'q1'

// Make an attempt with a real question id in missed
function makeAttempt(id: string, override?: Partial<QuizAttempt>): QuizAttempt {
  return {
    id,
    date: 'Jun 11, 2026',
    mode: 'Free Practice',
    modeKey: 'free',
    correct: 9,
    total: 10,
    perDomain: { d1: 90 },
    missed: [{ questionId: REAL_Q_ID, selected: 1 }],
    ...override,
  }
}

function makeTimedAttempt(id: string): QuizAttempt {
  return {
    id,
    date: 'Jun 11, 2026',
    mode: 'Timed Full Exam',
    modeKey: 'timed',
    correct: 7,
    total: 10,
    scaled: 730,
    pass: true,
    perDomain: { d1: 70 },
    missed: [],
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('HistoryScreen — empty state', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders EmptyState (no attempts yet) when history is empty', () => {
    render(<HistoryScreen />)
    expect(screen.getByText(/No attempts yet/i)).toBeInTheDocument()
  })

  it('does NOT render "Coming soon" text', () => {
    render(<HistoryScreen />)
    expect(screen.queryByText(/Coming soon/i)).not.toBeInTheDocument()
  })

  it('renders the Quiz history heading', () => {
    render(<HistoryScreen />)
    expect(screen.getByRole('heading', { name: /Quiz history/i })).toBeInTheDocument()
  })
})

describe('HistoryScreen — attempt list', () => {
  beforeEach(() => {
    localStorage.clear()
    seedHistory([makeAttempt('a1'), makeAttempt('a2')])
  })

  it('renders attempt rows when history has entries', () => {
    render(<HistoryScreen />)
    // Each attempt row is a button (from design)
    const rows = screen.getAllByRole('button', { name: /Jun 11, 2026/i })
    expect(rows.length).toBe(2)
  })

  it('renders attempt date in row', () => {
    render(<HistoryScreen />)
    expect(screen.getAllByText('Jun 11, 2026').length).toBeGreaterThanOrEqual(2)
  })

  it('renders mode name in row', () => {
    render(<HistoryScreen />)
    expect(screen.getAllByText('Free Practice').length).toBeGreaterThanOrEqual(2)
  })

  it('renders "Practice" label for non-timed attempt', () => {
    render(<HistoryScreen />)
    expect(screen.getAllByText('Practice').length).toBeGreaterThanOrEqual(1)
  })

  it('renders PassChip for timed attempt', () => {
    seedHistory([makeTimedAttempt('t1')])
    render(<HistoryScreen />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('renders scaled score for timed attempt', () => {
    seedHistory([makeTimedAttempt('t1')])
    render(<HistoryScreen />)
    expect(screen.getByText(/730 \/ 1000/i)).toBeInTheDocument()
  })
})

describe('HistoryScreen — opening an attempt (non-empty missed review)', () => {
  beforeEach(() => {
    localStorage.clear()
    // Seed an attempt with a real questionId that exists in content
    seedHistory([makeAttempt('a1', { missed: [{ questionId: REAL_Q_ID, selected: 1 }] })])
  })

  it('opens QuizResults review when attempt row is clicked', () => {
    render(<HistoryScreen />)
    const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
    fireEvent.click(row)
    // QuizResults in isHistory mode renders the date kicker and Back to history
    expect(screen.getByRole('button', { name: /Back to history/i })).toBeInTheDocument()
  })

  it('shows the missed question stem in the review (non-empty review)', () => {
    render(<HistoryScreen />)
    const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
    fireEvent.click(row)
    // q1 stem: 'A research team is building a system...' — look for review section
    expect(screen.getByText(/Review missed questions/i)).toBeInTheDocument()
  })

  it('renders Back to history button in the review', () => {
    render(<HistoryScreen />)
    const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
    fireEvent.click(row)
    expect(screen.getByRole('button', { name: /Back to history/i })).toBeInTheDocument()
  })

  it('going back from review returns to attempt list', () => {
    render(<HistoryScreen />)
    const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
    fireEvent.click(row)
    const backBtn = screen.getByRole('button', { name: /Back to history/i })
    fireEvent.click(backBtn)
    // Should be back at the list view
    expect(screen.getByRole('heading', { name: /Quiz history/i })).toBeInTheDocument()
  })
})

describe('HistoryScreen — unknown questionId gracefully skipped', () => {
  beforeEach(() => {
    localStorage.clear()
    // Seed an attempt with a questionId that does NOT exist in content
    seedHistory([
      makeAttempt('a1', {
        missed: [{ questionId: 'nonexistent-q-999', selected: 1 }],
      }),
    ])
  })

  it('renders without throwing when missed questionId is unknown', () => {
    expect(() => {
      render(<HistoryScreen />)
      const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
      fireEvent.click(row)
    }).not.toThrow()
  })

  it('does NOT render review section for unknown questionIds (empty missed)', () => {
    render(<HistoryScreen />)
    const row = screen.getByRole('button', { name: /Jun 11, 2026/i })
    fireEvent.click(row)
    // When no valid missed questions exist, no review section shown
    expect(screen.queryByText(/Review missed questions/i)).not.toBeInTheDocument()
  })
})
