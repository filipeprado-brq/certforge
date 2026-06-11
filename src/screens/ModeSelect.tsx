// =============================================================================
// ModeSelect — mode picker + per-mode config + onStart(QuizConfig)
// QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05
// =============================================================================

import { useState } from 'react'
import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import type { QuizMode } from '../lib/quiz'
import { QUIZ_MODES } from '../data/quizModes'
import { Btn } from '../components/Btn'
import { IconCheck, IconClock } from '../components/icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizConfig {
  mode: QuizMode
  domain: DomainId
  n: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ModeSelect({ onStart }: { onStart: (config: QuizConfig) => void }) {
  const [mode, setMode] = useState<QuizMode | null>(null)
  const [domain, setDomain] = useState<DomainId>('d1')
  const [n, setN] = useState<number>(10)

  const ready = mode != null

  return (
    <div>
      <div className="page-head">
        <p className="t-mono page-kicker">Quiz · Exam-style questions</p>
        <h1 className="t-display page-title">Choose a mode</h1>
        <p className="lead">
          Every question follows the exam format: one correct answer, three
          distractors, and a full explanation.
        </p>
      </div>

      {/* Mode cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {QUIZ_MODES.map((m) => {
          const active = mode === m.key
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className="card"
              aria-pressed={active}
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                font: 'inherit',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                borderColor: active ? 'var(--fg)' : undefined,
                boxShadow: active ? '0 0 0 1px var(--fg)' : undefined,
                transition:
                  'box-shadow var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <span
                  className="t-mono-sm"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    flex: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    border: '1.5px solid var(--hairline-strong)',
                    background: active ? 'var(--fill)' : 'transparent',
                    color: active ? 'var(--fill-fg)' : 'transparent',
                  }}
                  aria-hidden="true"
                >
                  <IconCheck size={11} strokeWidth={2.4} />
                </span>
                <h3
                  className="t-display"
                  style={{ fontSize: 23, margin: 0 }}
                >
                  {m.name}
                </h3>
              </div>
              <p
                className="t-muted"
                style={{
                  fontSize: 14.5,
                  fontWeight: 300,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {m.desc}
              </p>
              <span
                className="t-mono-sm t-subtle"
                style={{ marginTop: 'auto' }}
              >
                {m.meta}
              </span>
            </button>
          )
        })}
      </div>

      {/* Per-mode config */}
      <div style={{ marginTop: 'var(--space-5)', minHeight: 96 }}>
        {mode === 'domain' && (
          <div
            className="card"
            style={{ display: 'grid', gap: 'var(--space-4)' }}
          >
            <span className="t-mono t-subtle">Pick a domain</span>
            <div className="chip-row">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  className={`filter-chip${domain === d.id ? ' active' : ''}`}
                  onClick={() => setDomain(d.id)}
                >
                  {d.code} · {d.short} · {d.weight}%
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === 'free' && (
          <div
            className="card"
            style={{ display: 'grid', gap: 'var(--space-4)' }}
          >
            <span className="t-mono t-subtle">Number of questions</span>
            <div className="chip-row">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  className={`filter-chip${n === num ? ' active' : ''}`}
                  onClick={() => setN(num)}
                >
                  {num} questions
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === 'timed' && (
          <div
            className="card"
            style={{
              display: 'flex',
              gap: 'var(--space-6)',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <IconClock />
              <span className="t-mono">10 minutes</span>
            </span>
            <span className="t-mono t-subtle">10 questions</span>
            <span className="t-mono t-subtle">Scaled score 100–1000</span>
            <span className="t-mono t-subtle">Pass ≥ 720</span>
            <span
              className="t-mono-sm t-subtle"
              style={{ width: '100%' }}
            >
              No feedback during the exam — explanations are revealed in your
              results.
            </span>
          </div>
        )}
      </div>

      {/* Start button */}
      <div
        style={{
          marginTop: 'var(--space-5)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Btn
          variant="filled"
          size="lg"
          arrow
          disabled={!ready}
          onClick={() => {
            if (!mode) return
            onStart({ mode, domain, n })
          }}
        >
          {mode === 'timed' ? 'Start exam' : 'Start quiz'}
        </Btn>
      </div>
    </div>
  )
}
