// =============================================================================
// QuizResults component tests — TDD RED phase
// =============================================================================

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuizResults } from './QuizResults'
import type { QuizResultView } from './QuizResults'
import type { Question } from '../data/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeQuestion(id: string, correct: 0 | 1 | 2 | 3 = 0): Question {
  return {
    id,
    domain: 'd1',
    stem: `Stem of question ${id}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct,
    whyCorrect: `Why ${id} is correct`,
    whyOthers: `Why others are wrong for ${id}`,
  }
}

function makeTimedResult(override?: Partial<QuizResultView>): QuizResultView {
  const q = makeQuestion('q1', 0)
  return {
    modeKey: 'timed',
    modeName: 'Timed Full Exam',
    date: 'Jun 11, 2026',
    questions: [q],
    answers: { q1: 0 },
    grade: {
      correct: 1,
      total: 1,
      perDomain: { d1: { correct: 1, total: 1, pct: 100 } },
      missed: [],
    },
    scaled: 1000,
    pass: true,
    ...override,
  }
}

function makeNonTimedResult(override?: Partial<QuizResultView>): QuizResultView {
  const q = makeQuestion('q1', 0)
  return {
    modeKey: 'free',
    modeName: 'Free Practice',
    date: 'Jun 11, 2026',
    questions: [q],
    answers: { q1: 0 },
    grade: {
      correct: 7,
      total: 10,
      perDomain: { d1: { correct: 7, total: 10, pct: 70 } },
      missed: [],
    },
    ...override,
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('QuizResults — timed mode', () => {
  it('renders the ScoreDial (scaled score) for a timed result', () => {
    render(
      <QuizResults
        result={makeTimedResult({ scaled: 730, pass: true })}
        onHome={() => {}}
      />,
    )
    // ScoreDial renders the score number and pass info
    expect(screen.getByText('730')).toBeInTheDocument()
  })

  it('renders PassChip with Pass text for passing timed result', () => {
    render(
      <QuizResults
        result={makeTimedResult({ scaled: 730, pass: true })}
        onHome={() => {}}
      />,
    )
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('renders PassChip with Fail text for failing timed result', () => {
    render(
      <QuizResults
        result={makeTimedResult({ scaled: 640, pass: false })}
        onHome={() => {}}
      />,
    )
    expect(screen.getByText('Fail')).toBeInTheDocument()
  })

  it('does NOT render a raw percentage headline for timed result', () => {
    render(
      <QuizResults
        result={makeTimedResult({ scaled: 730, pass: true })}
        onHome={() => {}}
      />,
    )
    // Should not show "70%" as the primary headline
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })
})

describe('QuizResults — non-timed mode', () => {
  it('renders the raw percentage headline for non-timed result', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} />,
    )
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('renders X of Y correct for non-timed result', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} />,
    )
    expect(screen.getByText(/7 of 10 correct/i)).toBeInTheDocument()
  })

  it('does NOT render ScoreDial for non-timed result', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} />,
    )
    // ScoreDial has aria-label with "Scaled score"
    expect(
      screen.queryByRole('img', { name: /Scaled score/i }),
    ).not.toBeInTheDocument()
  })
})

describe('QuizResults — DomainBars', () => {
  it('renders domain breakdown section', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} />,
    )
    expect(screen.getByText(/Per-domain breakdown/i)).toBeInTheDocument()
  })

  it('renders a domain bar row for domains present in perDomain', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} />,
    )
    // DomainBars renders "N% correct" per row
    expect(screen.getByText(/70% correct/i)).toBeInTheDocument()
  })
})

describe('QuizResults — missed review', () => {
  it('renders review section when there are missed questions', () => {
    const missed = makeQuestion('mq1', 0)
    const result = makeNonTimedResult({
      grade: {
        correct: 0,
        total: 1,
        perDomain: {},
        missed: [missed],
      },
      answers: { mq1: 1 }, // user chose option B, correct is A
    })
    render(<QuizResults result={result} onHome={() => {}} />)
    // Missed question's stem should appear
    expect(screen.getByText('Stem of question mq1')).toBeInTheDocument()
  })

  it('renders the user answer and correct answer in missed review', () => {
    const missed = makeQuestion('mq1', 0)
    const result = makeNonTimedResult({
      grade: {
        correct: 0,
        total: 1,
        perDomain: {},
        missed: [missed],
      },
      answers: { mq1: 1 }, // user chose B (index 1), correct is A (index 0)
    })
    render(<QuizResults result={result} onHome={() => {}} />)
    // User answer label should show
    expect(screen.getByText(/Yours · B/i)).toBeInTheDocument()
    // Correct answer label should show
    expect(screen.getByText(/Correct · A/i)).toBeInTheDocument()
  })

  it('renders "Unanswered" when user answer is null', () => {
    const missed = makeQuestion('mq1', 0)
    const result = makeNonTimedResult({
      grade: {
        correct: 0,
        total: 1,
        perDomain: {},
        missed: [missed],
      },
      answers: { mq1: null },
    })
    render(<QuizResults result={result} onHome={() => {}} />)
    expect(screen.getByText(/Unanswered/i)).toBeInTheDocument()
  })

  it('renders explanation (whyCorrect + whyOthers) in missed review', () => {
    const missed = makeQuestion('mq1', 0)
    const result = makeNonTimedResult({
      grade: {
        correct: 0,
        total: 1,
        perDomain: {},
        missed: [missed],
      },
      answers: { mq1: 1 },
    })
    render(<QuizResults result={result} onHome={() => {}} />)
    expect(screen.getByText('Why mq1 is correct')).toBeInTheDocument()
    expect(screen.getByText('Why others are wrong for mq1')).toBeInTheDocument()
  })

  it('does NOT render missed review section when no questions missed', () => {
    render(<QuizResults result={makeNonTimedResult()} onHome={() => {}} />)
    expect(screen.queryByText(/Review missed questions/i)).not.toBeInTheDocument()
  })
})

describe('QuizResults — actions', () => {
  it('renders Back to home button', () => {
    render(<QuizResults result={makeNonTimedResult()} onHome={() => {}} />)
    expect(screen.getByRole('button', { name: /Back to home/i })).toBeInTheDocument()
  })

  it('renders Retry button when onRetry is provided', () => {
    render(
      <QuizResults
        result={makeNonTimedResult()}
        onHome={() => {}}
        onRetry={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument()
  })

  it('does NOT render Retry button when onRetry is not provided', () => {
    render(<QuizResults result={makeNonTimedResult()} onHome={() => {}} />)
    expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument()
  })

  it('renders Back to history when isHistory is true', () => {
    render(
      <QuizResults result={makeNonTimedResult()} onHome={() => {}} isHistory />,
    )
    expect(screen.getByRole('button', { name: /Back to history/i })).toBeInTheDocument()
  })
})
