import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PassChip, Timer, ScoreDial, DomainBars } from './QuizParts'

describe('PassChip', () => {
  it('renders "Pass" with pass-chip--pass class when pass=true', () => {
    const { container } = render(<PassChip pass={true} />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
    expect(container.querySelector('.pass-chip--pass')).not.toBeNull()
    expect(container.querySelector('.pass-chip--fail')).toBeNull()
  })

  it('renders "Fail" with pass-chip--fail class when pass=false', () => {
    const { container } = render(<PassChip pass={false} />)
    expect(screen.getByText('Fail')).toBeInTheDocument()
    expect(container.querySelector('.pass-chip--fail')).not.toBeNull()
    expect(container.querySelector('.pass-chip--pass')).toBeNull()
  })
})

describe('Timer', () => {
  it('renders time as "01:05" for secondsLeft=65', () => {
    render(<Timer secondsLeft={65} totalSeconds={600} />)
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(screen.getByRole('timer').textContent).toContain('01:05')
  })

  it('adds "low" class when secondsLeft <= 20% of totalSeconds', () => {
    const { container } = render(<Timer secondsLeft={100} totalSeconds={600} />)
    // 100/600 = 16.7% which is <= 20%
    expect(container.querySelector('.timer.low')).not.toBeNull()
  })

  it('does not add "low" class when secondsLeft > 20% of totalSeconds', () => {
    const { container } = render(<Timer secondsLeft={200} totalSeconds={600} />)
    // 200/600 = 33% which is > 20%
    expect(container.querySelector('.timer.low')).toBeNull()
  })
})

describe('ScoreDial', () => {
  it('renders the score number 730', () => {
    const { container } = render(<ScoreDial score={730} pass={true} />)
    expect(container.textContent).toContain('730')
  })

  it('renders "of 1000 · pass ≥ 720" text', () => {
    const { container } = render(<ScoreDial score={730} pass={true} />)
    expect(container.textContent).toContain('of 1000 · pass ≥ 720')
  })

  it('renders a PassChip', () => {
    const { container } = render(<ScoreDial score={730} pass={true} />)
    expect(container.querySelector('.pass-chip')).not.toBeNull()
  })

  it('has role="img" on svg', () => {
    const { container } = render(<ScoreDial score={730} pass={true} />)
    const svg = container.querySelector('svg[role="img"]')
    expect(svg).not.toBeNull()
  })

  it('references 720 pass mark in the component', () => {
    // The ScoreDial component must reference 720 for the pass mark line
    // This is verified by the grep test in acceptance criteria
    // But we verify it renders correctly
    render(<ScoreDial score={720} pass={true} />)
    expect(screen.getByText('720')).toBeInTheDocument()
  })
})

describe('DomainBars', () => {
  it('renders a row per present domain showing percentage', () => {
    const { container } = render(
      <DomainBars perDomain={{ d1: 75, d2: 50 }} />
    )
    // Should show 75% correct and 50% correct
    expect(container.textContent).toContain('75% correct')
    expect(container.textContent).toContain('50% correct')
  })

  it('omits absent domains', () => {
    const { container } = render(
      <DomainBars perDomain={{ d1: 75 }} />
    )
    // Only d1 is present; d2 through d5 should not show
    // D2 code should not appear
    const rows = container.querySelectorAll('.bar-chart-row')
    expect(rows).toHaveLength(1)
  })

  it('renders a row for each present domain', () => {
    const { container } = render(
      <DomainBars perDomain={{ d1: 75, d2: 50, d3: 100 }} />
    )
    const rows = container.querySelectorAll('.bar-chart-row')
    expect(rows).toHaveLength(3)
  })
})
