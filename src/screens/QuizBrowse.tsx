import { useState } from 'react'
import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import { getQuestions, questionCountsByDomain } from '../data/content'
import type { Scenario } from '../data/types'
import { SCENARIOS } from '../data/scenarios'
import { DomainBadge, WeightChip } from '../components/DomainBadge'
import { EmptyState } from '../components/EmptyState'

const KEY_LABELS = ['A', 'B', 'C', 'D'] as const

export const QuizBrowse = () => {
  const [domainFilter, setDomainFilter] = useState<'all' | DomainId>('all')
  const [scenarioFilter, setScenarioFilter] = useState<'all' | Scenario>('all')

  const counts = questionCountsByDomain()

  const opts: { domain?: DomainId; scenario?: Scenario } = {}
  if (domainFilter !== 'all') opts.domain = domainFilter
  if (scenarioFilter !== 'all') opts.scenario = scenarioFilter
  const questions = getQuestions(Object.keys(opts).length ? opts : undefined)

  return (
    <div>
      <div className="page-head">
        <p className="t-mono page-kicker">Quiz · Browse</p>
        <h1 className="t-display page-title">Question bank</h1>
      </div>

      {/* Domain filter chips */}
      <div className="chip-row" style={{ marginBottom: 'var(--space-3)' }}>
        <button
          className={`filter-chip${domainFilter === 'all' ? ' active' : ''}`}
          onClick={() => setDomainFilter('all')}
        >
          All
        </button>
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            className={`filter-chip${domainFilter === d.id ? ' active' : ''}`}
            onClick={() => setDomainFilter(d.id)}
          >
            {d.code} · {d.short}
          </button>
        ))}
      </div>

      {/* Scenario filter chips */}
      <div className="chip-row" style={{ marginBottom: 'var(--space-6)' }}>
        <button
          className={`filter-chip${scenarioFilter === 'all' ? ' active' : ''}`}
          onClick={() => setScenarioFilter('all')}
        >
          All scenarios
        </button>
        {SCENARIOS.map((s) => (
          <button
            key={s}
            className={`filter-chip${scenarioFilter === s ? ' active' : ''}`}
            onClick={() => setScenarioFilter(s)}
          >
            {s}
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
                {counts[d.id]} questions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Question list */}
      {questions.length === 0 ? (
        <EmptyState
          title="No questions match"
          body="No questions match the current filter combination. Try adjusting the domain or scenario filter."
        />
      ) : (
        <>
          <p className="t-mono-sm t-subtle" style={{ marginBottom: 'var(--space-4)' }}>
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            {questions.map((q) => {
              const domain = DOMAINS.find((d) => d.id === q.domain)!
              return (
                <div key={q.id} className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  {/* Header: domain badge + scenario tag + source indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <DomainBadge domain={domain} />
                    {q.scenario && (
                      <span className="t-mono-sm t-subtle">{q.scenario}</span>
                    )}
                    {q.source === 'official-sample' && (
                      <span
                        className="t-mono-sm"
                        style={{
                          marginLeft: 'auto',
                          opacity: 0.55,
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Official sample
                      </span>
                    )}
                  </div>

                  {/* Stem */}
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17.5,
                      fontWeight: 450,
                      lineHeight: 1.4,
                      margin: 0,
                      textWrap: 'pretty',
                    }}
                  >
                    {q.stem}
                  </p>

                  {/* Options — correct one visually marked */}
                  <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correct
                      return (
                        <div
                          key={i}
                          className={`quiz-option${isCorrect ? ' correct' : ''}`}
                          role="listitem"
                        >
                          <span className="key" aria-hidden="true">
                            {KEY_LABELS[i]}
                          </span>
                          <span style={{ paddingTop: 3 }}>{opt}</span>
                          {isCorrect && (
                            <span
                              className="t-mono-sm"
                              style={{
                                marginLeft: 'auto',
                                color: 'var(--success-fg)',
                                flex: 'none',
                              }}
                              aria-label="Correct answer"
                            >
                              Correct
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="explanation">
                    <div className="why">
                      <span
                        className="t-mono-sm"
                        style={{ color: 'var(--success-fg)' }}
                      >
                        Why {KEY_LABELS[q.correct]} is correct
                      </span>
                      <p>{q.whyCorrect}</p>
                    </div>
                    <div className="why">
                      <span className="t-mono-sm t-subtle">
                        Why the others are wrong
                      </span>
                      <p>{q.whyOthers}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
