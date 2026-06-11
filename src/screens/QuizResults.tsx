// =============================================================================
// QuizResults — results summary screen: score, domain breakdown, missed review
// QUIZ-06
// =============================================================================

import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import type { Question } from '../data/types'
import type { Answers, GradeResult } from '../lib/quiz'
import { ScoreDial, DomainBars, PassChip } from '../components/QuizParts'
import { DomainBadge } from '../components/DomainBadge'
import { Btn } from '../components/Btn'

const KEY_LABELS = ['A', 'B', 'C', 'D'] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizResultView {
  modeKey: 'scenario' | 'domain' | 'timed' | 'free'
  modeName: string
  date: string
  questions: Question[]
  answers: Answers
  grade: GradeResult
  scaled?: number
  pass?: boolean
}

interface QuizResultsProps {
  result: QuizResultView
  onRetry?: () => void
  onHome: () => void
  isHistory?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuizResults({ result, onRetry, onHome, isHistory = false }: QuizResultsProps) {
  const { grade, scaled, pass, modeName, date } = result
  const pct = grade.total > 0 ? Math.round((grade.correct / grade.total) * 100) : 0

  // SHAPE CONVERSION (mandatory): engine's perDomain[d] = {correct,total,pct}
  // → flat Record<DomainId, number> for DomainBars (which expects plain numbers)
  const domainPct: Partial<Record<DomainId, number>> = {}
  for (const [d, s] of Object.entries(grade.perDomain)) {
    if (s) domainPct[d as DomainId] = s.pct
  }

  const missedQuestions = grade.missed ?? []
  const kicker = isHistory
    ? `${date} · ${modeName}`
    : `Results · ${modeName}`

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Page head */}
      <div className="page-head" style={{ textAlign: 'center' }}>
        <p className="t-mono page-kicker">{kicker}</p>

        {/* Timed: ScoreDial + PassChip | Non-timed: raw % */}
        {scaled != null ? (
          <ScoreDial score={scaled} pass={pass ?? false} />
        ) : (
          <div>
            <div className="stat-num t-display" style={{ fontSize: 96 }}>
              {pct}%
            </div>
            <p className="t-mono-sm t-subtle" style={{ marginTop: 8 }}>
              {grade.correct} of {grade.total} correct
            </p>
          </div>
        )}
      </div>

      {/* Per-domain breakdown */}
      <div className="card" style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <span className="t-mono t-subtle">Per-domain breakdown</span>
        <DomainBars perDomain={domainPct} />
      </div>

      {/* Review missed questions */}
      {missedQuestions.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <p
            className="t-mono t-subtle"
            style={{ marginBottom: 'var(--space-4)' }}
          >
            Review missed questions · {missedQuestions.length}
          </p>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {missedQuestions.map((q) => {
              const selected = result.answers[q.id]
              const domainObj = DOMAINS.find((d) => d.id === q.domain)
              return (
                <div
                  key={q.id}
                  className="card"
                  style={{ display: 'grid', gap: 'var(--space-4)' }}
                >
                  {/* Domain badge + scenario */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-3)',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {domainObj && <DomainBadge domain={domainObj} />}
                    {q.scenario && (
                      <span className="t-mono-sm t-subtle">{q.scenario}</span>
                    )}
                  </div>

                  {/* Stem */}
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17.5,
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {q.stem}
                  </p>

                  {/* Your answer + correct answer */}
                  <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    {selected != null ? (
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'baseline',
                        }}
                      >
                        <span
                          className="state-label state-label--incorrect"
                          style={{ flex: 'none' }}
                        >
                          ✕ Yours · {KEY_LABELS[selected]}
                        </span>
                        <span
                          className="t-muted"
                          style={{ fontSize: 14, fontWeight: 300 }}
                        >
                          {q.options[selected]}
                        </span>
                      </div>
                    ) : (
                      <span className="state-label state-label--incorrect">
                        ✕ Unanswered (time ran out)
                      </span>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'baseline',
                      }}
                    >
                      <span
                        className="state-label state-label--correct"
                        style={{ flex: 'none' }}
                      >
                        ✓ Correct · {KEY_LABELS[q.correct]}
                      </span>
                      <span
                        className="t-muted"
                        style={{ fontSize: 14, fontWeight: 300 }}
                      >
                        {q.options[q.correct]}
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="explanation" style={{ animation: 'none' }}>
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
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          marginTop: 'var(--space-7)',
          flexWrap: 'wrap',
        }}
      >
        <Btn variant="outline" onClick={onHome}>
          {isHistory ? '← Back to history' : 'Back to home'}
        </Btn>
        {onRetry && (
          <Btn variant="filled" arrow onClick={onRetry}>
            Retry this mode
          </Btn>
        )}
      </div>
    </div>
  )
}
