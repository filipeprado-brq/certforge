import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QuizRunner } from './QuizRunner'
import type { QuizConfig } from './ModeSelect'
import type { GradeResult, Answers } from '../lib/quiz'
import type { Question } from '../data/types'

// ─── Mock data ───────────────────────────────────────────────────────────────
// Use a minimal question set that works with selectQuestions

// We stub getQuestions to return a predictable set
vi.mock('../data/content', () => ({
  getQuestions: () => [
    {
      id: 'q1',
      domain: 'd1',
      stem: 'Question 1 stem',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      whyCorrect: 'Why A is correct explanation text',
      whyOthers: 'Why others are wrong explanation text',
    },
    {
      id: 'q2',
      domain: 'd1',
      stem: 'Question 2 stem',
      options: ['Option A2', 'Option B2', 'Option C2', 'Option D2'],
      correct: 1,
      whyCorrect: 'Why B2 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q3',
      domain: 'd2',
      stem: 'Question 3 stem',
      options: ['Option A3', 'Option B3', 'Option C3', 'Option D3'],
      correct: 2,
      whyCorrect: 'Why C3 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q4',
      domain: 'd2',
      stem: 'Question 4 stem',
      options: ['Option A4', 'Option B4', 'Option C4', 'Option D4'],
      correct: 3,
      whyCorrect: 'Why D4 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q5',
      domain: 'd3',
      stem: 'Question 5 stem',
      options: ['Option A5', 'Option B5', 'Option C5', 'Option D5'],
      correct: 0,
      whyCorrect: 'Why A5 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q6',
      domain: 'd3',
      scenario: 'Customer Support Resolution Agent',
      stem: 'Scenario question 6 stem',
      options: ['Option A6', 'Option B6', 'Option C6', 'Option D6'],
      correct: 1,
      whyCorrect: 'Why B6 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q7',
      domain: 'd4',
      scenario: 'Customer Support Resolution Agent',
      stem: 'Scenario question 7 stem',
      options: ['Option A7', 'Option B7', 'Option C7', 'Option D7'],
      correct: 2,
      whyCorrect: 'Why C7 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q8',
      domain: 'd4',
      scenario: 'Multi-Agent Research System',
      stem: 'Scenario question 8 stem',
      options: ['Option A8', 'Option B8', 'Option C8', 'Option D8'],
      correct: 3,
      whyCorrect: 'Why D8 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q9',
      domain: 'd5',
      scenario: 'Multi-Agent Research System',
      stem: 'Scenario question 9 stem',
      options: ['Option A9', 'Option B9', 'Option C9', 'Option D9'],
      correct: 0,
      whyCorrect: 'Why A9 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q10',
      domain: 'd5',
      scenario: 'Structured Data Extraction',
      stem: 'Scenario question 10 stem',
      options: ['Option A10', 'Option B10', 'Option C10', 'Option D10'],
      correct: 1,
      whyCorrect: 'Why B10 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q11',
      domain: 'd1',
      scenario: 'Structured Data Extraction',
      stem: 'Scenario question 11 stem',
      options: ['Option A11', 'Option B11', 'Option C11', 'Option D11'],
      correct: 2,
      whyCorrect: 'Why C11 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q12',
      domain: 'd2',
      scenario: 'Code Generation with Claude Code',
      stem: 'Scenario question 12 stem',
      options: ['Option A12', 'Option B12', 'Option C12', 'Option D12'],
      correct: 3,
      whyCorrect: 'Why D12 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q13',
      domain: 'd3',
      scenario: 'Code Generation with Claude Code',
      stem: 'Scenario question 13 stem',
      options: ['Option A13', 'Option B13', 'Option C13', 'Option D13'],
      correct: 0,
      whyCorrect: 'Why A13 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q14',
      domain: 'd4',
      scenario: 'Developer Productivity with Claude',
      stem: 'Scenario question 14 stem',
      options: ['Option A14', 'Option B14', 'Option C14', 'Option D14'],
      correct: 1,
      whyCorrect: 'Why B14 is correct',
      whyOthers: 'Why others are wrong',
    },
    {
      id: 'q15',
      domain: 'd5',
      scenario: 'Developer Productivity with Claude',
      stem: 'Scenario question 15 stem',
      options: ['Option A15', 'Option B15', 'Option C15', 'Option D15'],
      correct: 2,
      whyCorrect: 'Why C15 is correct',
      whyOthers: 'Why others are wrong',
    },
  ] as Question[],
}))

const noop = () => {}

const freeConfig: QuizConfig = {
  mode: 'free',
  domain: 'd1',
  n: 5,
}

const timedConfig: QuizConfig = {
  mode: 'timed',
  domain: 'd1',
  n: 10,
}

const scenarioConfig: QuizConfig = {
  mode: 'scenario',
  domain: 'd1',
  n: 10,
}

describe('QuizRunner — non-timed (free) mode', () => {
  it('renders the first question stem', () => {
    render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    // First question should be visible
    expect(screen.getByText(/Question \d+ stem|Scenario question \d+ stem/)).toBeInTheDocument()
  })

  it('shows progress as "Q 1 / N"', () => {
    render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    expect(screen.getByText(/Q 1 \/ \d+/)).toBeInTheDocument()
  })

  it('does NOT show explanation before answering', () => {
    const { container } = render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    expect(container.querySelector('.explanation')).toBeNull()
  })

  it('reveals explanation after selecting an answer', () => {
    const { container } = render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    // Click option A (index 0)
    const options = container.querySelectorAll('.quiz-option')
    fireEvent.click(options[0])

    // Explanation panel should appear
    expect(container.querySelector('.explanation')).not.toBeNull()
  })

  it('marks the correct option with class "correct" after answering', () => {
    const { container } = render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    const options = container.querySelectorAll('.quiz-option')
    // Click any option to trigger reveal
    fireEvent.click(options[0])

    // Some option should have class "correct"
    expect(container.querySelector('.quiz-option.correct')).not.toBeNull()
  })

  it('shows whyCorrect explanation text after answering', () => {
    render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    const options = screen.getAllByRole('radio')
    fireEvent.click(options[0])

    // whyCorrect text should appear (we mock q1 to have 'Why A is correct explanation text')
    // The explanation panel with .why divs should be visible
    expect(document.querySelector('.explanation .why')).not.toBeNull()
  })

  it('locks further selection after answering (second click is ignored)', () => {
    const { container } = render(
      <QuizRunner config={freeConfig} onFinish={noop} onExit={noop} />
    )
    const options = container.querySelectorAll('.quiz-option')
    // First click
    fireEvent.click(options[0])
    // Attempt second click on different option
    fireEvent.click(options[1])

    // Should still be same state — option 0 should be .selected or .correct/incorrect
    // and option 1 should be .dimmed not .incorrect
    expect(container.querySelector('.quiz-option.dimmed')).not.toBeNull()
  })
})

describe('QuizRunner — timed mode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders a Timer component in timed mode', () => {
    const { container } = render(
      <QuizRunner config={timedConfig} onFinish={noop} onExit={noop} />
    )
    expect(container.querySelector('[role="timer"]')).not.toBeNull()
  })

  it('does NOT render explanation after selecting an answer in timed mode', () => {
    const { container } = render(
      <QuizRunner config={timedConfig} onFinish={noop} onExit={noop} />
    )
    const options = container.querySelectorAll('.quiz-option')
    // Click an option
    fireEvent.click(options[0])

    // Explanation should NOT appear in timed mode
    expect(container.querySelector('.explanation')).toBeNull()
  })

  it('does NOT apply .correct class to options in timed mode', () => {
    const { container } = render(
      <QuizRunner config={timedConfig} onFinish={noop} onExit={noop} />
    )
    const options = container.querySelectorAll('.quiz-option')
    fireEvent.click(options[0])

    // No option should have class "correct" in timed mode
    expect(container.querySelector('.quiz-option.correct')).toBeNull()
  })

  it('does NOT apply .incorrect class to options in timed mode', () => {
    const { container } = render(
      <QuizRunner config={timedConfig} onFinish={noop} onExit={noop} />
    )
    const options = container.querySelectorAll('.quiz-option')
    fireEvent.click(options[1]) // click wrong answer

    expect(container.querySelector('.quiz-option.incorrect')).toBeNull()
  })
})

describe('QuizRunner — scenario mode', () => {
  it('renders a .scenario-banner for scenario questions', () => {
    const { container } = render(
      <QuizRunner config={scenarioConfig} onFinish={noop} onExit={noop} />
    )
    // At least one scenario banner should appear since we have scenario questions
    expect(container.querySelector('.scenario-banner')).not.toBeNull()
  })
})

describe('QuizRunner — finish callback', () => {
  it('calls onFinish with grade, questions, and answers after last question', () => {
    const onFinish = vi.fn()
    // Use n=5 free mode
    render(
      <QuizRunner config={freeConfig} onFinish={onFinish} onExit={noop} />
    )
    // We need to navigate through all questions — answer + next for each
    // The test just verifies onFinish is called with the right shape
    // Since we're using freeConfig n=5 questions, we'll click through
    for (let i = 0; i < 4; i++) {
      const options = document.querySelectorAll('.quiz-option')
      fireEvent.click(options[0])
      const nextBtn = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextBtn)
    }
    // On last question, answer and click "See results"
    const options = document.querySelectorAll('.quiz-option')
    fireEvent.click(options[0])
    const finishBtn = screen.getByRole('button', { name: /see results/i })
    fireEvent.click(finishBtn)

    expect(onFinish).toHaveBeenCalledOnce()
    const [grade, questions, answers] = onFinish.mock.calls[0] as [GradeResult, Question[], Answers]
    expect(grade).toHaveProperty('correct')
    expect(grade).toHaveProperty('total')
    expect(grade).toHaveProperty('perDomain')
    expect(questions).toHaveLength(5)
    expect(typeof answers).toBe('object')
  })
})
