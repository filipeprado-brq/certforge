import { useState } from 'react'
import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import { getFlashcards, flashcardCountsByDomain } from '../data/content'
import { DomainBadge, WeightChip } from '../components/DomainBadge'
import { EmptyState } from '../components/EmptyState'

export const FlashcardsBrowse = () => {
  const [filter, setFilter] = useState<'all' | DomainId>('all')

  const counts = flashcardCountsByDomain()
  const cards = getFlashcards(filter === 'all' ? undefined : { domain: filter })

  return (
    <div>
      <div className="page-head">
        <p className="t-mono page-kicker">Flashcards · Browse</p>
        <h1 className="t-display page-title">Card deck</h1>
      </div>

      {/* Domain filter chips */}
      <div className="chip-row" style={{ marginBottom: 'var(--space-6)' }}>
        <button
          className={`filter-chip${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            className={`filter-chip${filter === d.id ? ' active' : ''}`}
            onClick={() => setFilter(d.id)}
          >
            {d.code} · {d.short}
          </button>
        ))}
      </div>

      {/* Per-domain summary */}
      <div className="card card--flush" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="row-list">
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              style={{
                padding: 'var(--space-4) var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <DomainBadge domain={d} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
                {d.name}
              </span>
              <WeightChip domain={d} />
              <span className="t-mono-sm t-subtle" style={{ marginLeft: 'auto' }}>
                {counts[d.id]} cards
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card list */}
      {cards.length === 0 ? (
        <EmptyState
          title="No cards in this domain"
          body="No flashcards match the current filter. Try selecting a different domain."
        />
      ) : (
        <>
          <p className="t-mono-sm t-subtle" style={{ marginBottom: 'var(--space-4)' }}>
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {cards.map((card) => {
              const domain = DOMAINS.find((d) => d.id === card.domain)!
              return (
                <div key={card.id} className="card" style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  <div>
                    <DomainBadge domain={domain} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18,
                      fontWeight: 500,
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {card.front}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      fontWeight: 300,
                      margin: 0,
                      opacity: 0.85,
                    }}
                  >
                    {card.back}
                  </p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
