import { useState, useEffect, useRef } from 'react'
import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import { getFlashcards } from '../data/content'
import { buildDueQueue, deckStatsByDomain, overallDueCount } from '../lib/deckStats'
import { nextState } from '../lib/srs'
import { useStoredState } from '../lib/useStoredState'
import { DomainBadge, WeightChip } from '../components/DomainBadge'
import { ProgressBar } from '../components/ProgressBar'
import { Btn } from '../components/Btn'
import { EmptyState } from '../components/EmptyState'
import { IconFlip } from '../components/icons'

export const FlashcardsStudy = () => {
  const { srs, rateCard } = useStoredState()
  const [filter, setFilter] = useState<'all' | DomainId>('all')
  const [view, setView] = useState<'deck' | 'session'>('deck')
  const [queue, setQueue] = useState<string[]>([])
  const [sessionTotal, setSessionTotal] = useState(0)
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [doneCount, setDoneCount] = useState(0)

  const allCards = getFlashcards()
  const now = Date.now()

  const sessionDomain = filter === 'all' ? undefined : filter
  const stats = deckStatsByDomain(allCards, srs, now)
  const dueCount = overallDueCount(allCards, srs, now, sessionDomain)

  // When entering session view, build the queue once
  const sessionDomainRef = useRef(sessionDomain)
  const srsRef = useRef(srs)

  function startSession() {
    const q = buildDueQueue(allCards, srs, Date.now(), sessionDomain)
    setQueue(q)
    setSessionTotal(q.length)
    setPos(0)
    setFlipped(false)
    setDoneCount(0)
    sessionDomainRef.current = sessionDomain
    srsRef.current = srs
    setView('session')
  }

  function exitSession() {
    setView('deck')
    setPos(0)
    setFlipped(false)
  }

  function handleRate(rating: 'again' | 'good') {
    const cardId = queue[pos]
    if (!cardId) return
    const updated = nextState(srs[cardId], rating, Date.now())
    rateCard(cardId, updated)
    if (rating === 'good') setDoneCount(c => c + 1)
    setFlipped(false)
    setPos(p => p + 1)
  }

  function handleStudyAgain() {
    const newQueue = buildDueQueue(allCards, srs, Date.now(), sessionDomainRef.current)
    if (newQueue.length === 0) {
      setView('deck')
      return
    }
    setQueue(newQueue)
    setSessionTotal(newQueue.length)
    setPos(0)
    setFlipped(false)
    setDoneCount(0)
  }

  // Keyboard handler for study session
  useEffect(() => {
    if (view !== 'session') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || (e.key === 'Enter' && (e.target as HTMLElement)?.tagName !== 'BUTTON')) {
        e.preventDefault()
        setFlipped(f => !f)
      }
      if (e.key === '1') handleRate('again')
      if (e.key === '2') handleRate('good')
      if (e.key === 'Escape') exitSession()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, flipped, pos, queue])

  // ============================================================
  // DECK OVERVIEW
  // ============================================================
  if (view === 'deck') {
    const shownDomains = filter === 'all' ? DOMAINS : DOMAINS.filter(d => d.id === filter)

    return (
      <div>
        <div className="page-head">
          <p className="t-mono page-kicker">Flashcards · Spaced repetition</p>
          <h1 className="t-display page-title">Card decks</h1>
          <p className="lead">
            Leitner scheduling — rate each card &ldquo;Again&rdquo; or &ldquo;Good&rdquo; and it resurfaces at the right moment.
          </p>
        </div>

        {/* Domain filter chips */}
        <div className="chip-row" style={{ marginBottom: 'var(--space-6)' }}>
          <button
            className={`filter-chip${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {DOMAINS.map(d => (
            <button
              key={d.id}
              className={`filter-chip${filter === d.id ? ' active' : ''}`}
              onClick={() => setFilter(d.id)}
            >
              {d.code} · {d.short}
            </button>
          ))}
        </div>

        {/* Per-domain stats */}
        <div className="card card--flush" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="row-list">
            {shownDomains.map(d => {
              const s = stats[d.id] ?? { total: 0, learned: 0, due: 0 }
              const pct = s.total ? (s.learned / s.total) * 100 : 0
              return (
                <div
                  key={d.id}
                  style={{ padding: 'var(--space-5) var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <DomainBadge domain={d} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>{d.name}</span>
                    <span className="spacer" style={{ flex: 1 }}></span>
                    <WeightChip domain={d} />
                  </div>
                  <ProgressBar
                    value={pct}
                    height={5}
                    color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`}
                    label={`${d.name} cards learned`}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <span className="t-mono-sm t-subtle">{s.learned} / {s.total} learned</span>
                    <span
                      className="t-mono-sm"
                      style={{ color: s.due > 0 ? 'var(--fg)' : 'var(--fg-subtle)' }}
                    >
                      {s.due} due today
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Start CTA or empty state */}
        {dueCount === 0 ? (
          <EmptyState
            title="All caught up"
            body="No cards are due right now — come back later or pick another domain."
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="filled" arrow onClick={startSession}>
              Study {dueCount} due
            </Btn>
          </div>
        )}
      </div>
    )
  }

  // ============================================================
  // STUDY SESSION
  // ============================================================
  const currentCard = allCards.find(c => c.id === queue[pos])
  const currentDomain = currentCard ? DOMAINS.find(d => d.id === currentCard.domain) : undefined

  // Done state
  if (pos >= sessionTotal) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-6)' }}>
          <p className="t-mono t-subtle" style={{ marginBottom: 'var(--space-4)' }}>Session complete</p>
          <div className="stat-num t-display" style={{ fontSize: 88 }}>{doneCount}</div>
          <p className="t-mono-sm t-subtle" style={{ marginTop: 8 }}>cards rated good</p>
          <p className="t-muted" style={{ fontSize: 14, fontWeight: 300, marginTop: 'var(--space-4)' }}>
            {sessionTotal} cards reviewed in this session.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
            <Btn variant="outline" onClick={exitSession}>Back to decks</Btn>
            <Btn variant="filled" arrow onClick={handleStudyAgain}>Study again</Btn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Session header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn--ghost btn--sm" onClick={exitSession}>← Exit</button>
        <span className="spacer" style={{ flex: 1 }}></span>
        <span className="t-mono t-subtle">{pos + 1} / {sessionTotal}</span>
        <span className="t-mono-sm t-subtle" aria-label={`${sessionTotal - pos} cards remaining`}>
          · {sessionTotal - pos} due
        </span>
      </div>
      <ProgressBar
        value={sessionTotal ? (pos / sessionTotal) * 100 : 0}
        label="Session progress"
      />

      {/* Card stage */}
      <div className="flashcard-stage" style={{ marginTop: 'var(--space-6)' }}>
        <div className={`flashcard${flipped ? ' flipped' : ''}`} style={{ minHeight: 400 }}>
          {/* Front face */}
          <button
            className="face face--front"
            onClick={() => setFlipped(true)}
            aria-label="Show answer"
            style={{ cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
          >
            {currentDomain && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <DomainBadge domain={currentDomain} />
                <span className="spacer" style={{ flex: 1 }}></span>
                <span className="t-mono-sm t-subtle">Prompt</span>
              </div>
            )}
            <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 'var(--space-5) 0' }}>
              <h2
                className="t-display"
                style={{ fontSize: 'clamp(26px, 3.4vw, 36px)', textAlign: 'center', maxWidth: '20ch' }}
              >
                {currentCard?.front}
              </h2>
            </div>
            <div className="t-mono-sm t-subtle" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <IconFlip size={13} /> Tap or press space to flip
            </div>
          </button>

          {/* Back face */}
          <div className="face face--back" aria-hidden={!flipped}>
            {currentDomain && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <DomainBadge domain={currentDomain} />
                <span className="spacer" style={{ flex: 1 }}></span>
                <span className="t-mono-sm" style={{ opacity: 0.6 }}>Concept</span>
              </div>
            )}
            <div style={{ flex: 1, display: 'grid', alignItems: 'center', padding: 'var(--space-5) 0' }}>
              <div>
                <p className="t-display" style={{ fontSize: 21, marginBottom: 'var(--space-4)' }}>{currentCard?.front}</p>
                <p style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 300, opacity: 0.85, maxWidth: '58ch', margin: 0 }}>{currentCard?.back}</p>
              </div>
            </div>
            <div className="t-mono-sm" style={{ opacity: 0.5, textAlign: 'center' }}>How well did you recall it?</div>
          </div>
        </div>
      </div>

      {/* Rating row */}
      <div style={{ marginTop: 'var(--space-5)', minHeight: 56 }}>
        {flipped ? (
          <div className="rating-row">
            <Btn variant="outline" onClick={() => handleRate('again')} aria-keyshortcuts="1">
              Again <span className="t-mono-sm t-subtle" style={{ textTransform: 'none' }}>· resurfaces soon</span>
            </Btn>
            <Btn variant="filled" onClick={() => handleRate('good')} aria-keyshortcuts="2">
              Good <span className="t-mono-sm" style={{ opacity: 0.6, textTransform: 'none' }}>· spaced out</span>
            </Btn>
          </div>
        ) : (
          <div className="t-mono-sm t-subtle" style={{ textAlign: 'center', paddingTop: 14 }}>Flip the card to rate your recall</div>
        )}
      </div>
    </div>
  )
}
