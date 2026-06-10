import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, it, expect } from 'vitest'
import { FlashcardsStudy } from './FlashcardsStudy'
import { STORAGE_KEY } from '../lib/storage'

beforeEach(() => {
  localStorage.clear()
})

describe('FlashcardsStudy — Deck Overview', () => {
  it('shows per-domain learned and due for a fresh user', () => {
    render(<FlashcardsStudy />)
    // Title must be present
    expect(screen.getByRole('heading', { name: /Card decks/i })).toBeInTheDocument()
    // Fresh user: learned = 0 for every domain, all cards due
    expect(screen.getAllByText(/0 \//)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/due today/)[0]).toBeInTheDocument()
  })
})

describe('FlashcardsStudy — Study Session flip', () => {
  it('reveals the back face when the front is clicked', async () => {
    render(<FlashcardsStudy />)

    // Start a session (all cards are due for fresh user)
    const startBtn = screen.getByRole('button', { name: /Study \d+ due/i })
    fireEvent.click(startBtn)

    // Front face is present, card is not flipped yet
    expect(document.querySelector('.flashcard')).not.toHaveClass('flipped')

    // Click the front face button (aria-label="Show answer")
    const frontFace = screen.getByRole('button', { name: /Show answer/i })
    fireEvent.click(frontFace)

    // Card should now have the flipped class
    expect(document.querySelector('.flashcard.flipped')).not.toBeNull()
  })
})

describe('FlashcardsStudy — Rating', () => {
  it('rating Good advances the queue counter and persists srs state with box 2', () => {
    render(<FlashcardsStudy />)

    // Start session
    const startBtn = screen.getByRole('button', { name: /Study \d+ due/i })
    fireEvent.click(startBtn)

    // Flip first card
    const frontFace = screen.getByRole('button', { name: /Show answer/i })
    fireEvent.click(frontFace)

    // Click Good
    const goodBtn = screen.getByRole('button', { name: /Good/i })
    fireEvent.click(goodBtn)

    // Queue counter should have advanced: pos was 0 (showing "1 / N"), now pos=1 (showing "2 / N")
    // After rating, pos increments — either "2 /" appears or (if total=1) session complete shows
    const sessionComplete = screen.queryByText(/Session complete/i)
    if (!sessionComplete) {
      // More cards in the queue: counter advanced
      const counter = screen.getAllByText(/\d+ \//)
      const counterText = counter.map(el => el.textContent).join(' ')
      expect(counterText).toMatch(/2\s*\//)
    }
    // In either case (1-card deck or multi-card), check localStorage persistence
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    const srsEntries = Object.values(stored.srs) as Array<{ rating: string; box: number }>
    expect(srsEntries.length).toBeGreaterThan(0)
    const ratedCard = srsEntries[0]
    expect(ratedCard.rating).toBe('good')
    expect(ratedCard.box).toBe(2)
  })
})
