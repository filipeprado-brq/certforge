// =============================================================================
// HistoryScreen — attempt list + open-to-review (replaces placeholder)
// QUIZ-07
// =============================================================================

import { useState } from 'react'
import { useStoredState } from '../lib/useStoredState'
import type { QuizAttempt } from '../lib/storage'
import type { DomainId } from '../data/domains'
import { getQuestions } from '../data/content'
import { EmptyState } from '../components/EmptyState'
import { PassChip } from '../components/QuizParts'
import { Btn } from '../components/Btn'
import { QuizResults } from './QuizResults'
import type { QuizResultView } from './QuizResults'

export function HistoryScreen() {
  const { quizHistory } = useStoredState()
  const [open, setOpen] = useState<QuizAttempt | null>(null)

  // ─── Build QuizResultView from stored attempt ─────────────────────────────
  function buildResultView(attempt: QuizAttempt): QuizResultView {
    // REBUILD missed questions from content — questionId lookup, skip unknowns
    const allQuestions = getQuestions()
    const rebuiltMissed = (attempt.missed ?? [])
      .map((m) => allQuestions.find((q) => q.id === m.questionId))
      .filter((q): q is NonNullable<typeof q> => q != null)

    // REBUILD answers map: { questionId: selected } for each stored missed entry
    const answers: Record<string, number | null> = {}
    for (const m of attempt.missed ?? []) {
      answers[m.questionId] = m.selected
    }

    // Minimal grade for the view — perDomain detail is not stored;
    // pass open.perDomain (already flat pct map) to DomainBars directly
    const grade = {
      correct: attempt.correct,
      total: attempt.total,
      missed: rebuiltMissed,
      // perDomain: use empty object here; DomainBars receives open.perDomain directly
      perDomain: {} as Record<string, never>,
    }

    return {
      modeKey: attempt.modeKey,
      modeName: attempt.mode,
      date: attempt.date,
      questions: rebuiltMissed,
      answers,
      grade,
      scaled: attempt.scaled,
      pass: attempt.pass,
    }
  }

  // ─── Open-attempt view ────────────────────────────────────────────────────
  if (open) {
    const view = buildResultView(open)

    // Since QuizResults will convert grade.perDomain[d].pct, and our stored map is
    // already flat numbers, we need to wrap them in the object shape QuizResults expects.
    // Alternative: pass a version that already has the flat pct map ready by wrapping
    // each value as {correct:0, total:0, pct: value}.
    const wrappedPerDomain: Partial<Record<DomainId, { correct: number; total: number; pct: number }>> = {}
    for (const [d, pct] of Object.entries(open.perDomain)) {
      wrappedPerDomain[d as DomainId] = { correct: 0, total: 0, pct: pct as number }
    }
    const finalView: QuizResultView = {
      ...view,
      grade: {
        ...view.grade,
        perDomain: wrappedPerDomain,
      },
    }

    return (
      <QuizResults
        result={finalView}
        onHome={() => setOpen(null)}
        isHistory
      />
    )
  }

  // ─── Attempt list ─────────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-head">
        <p className="t-mono page-kicker">History · Past attempts</p>
        <h1 className="t-display page-title">Quiz history</h1>
      </div>

      {quizHistory.length === 0 ? (
        <EmptyState
          title="No attempts yet"
          body="Your quiz results will appear here — including scaled exam scores, pass/fail, and per-domain breakdowns."
          action={
            <Btn variant="filled" arrow onClick={() => {}}>
              Take your first quiz
            </Btn>
          }
        />
      ) : (
        <div className="card card--flush">
          <div className="row-list">
            {quizHistory.map((h) => {
              const pct =
                h.total > 0 ? Math.round((h.correct / h.total) * 100) : 0
              const scoreLabel =
                h.scaled != null
                  ? `${h.scaled} / 1000`
                  : `${h.correct}/${h.total} · ${pct}%`
              return (
                <button
                  key={h.id}
                  className="attempt-row"
                  aria-label={`${h.date} ${h.mode} ${scoreLabel}`}
                  onClick={() => setOpen(h)}
                >
                  <span className="t-mono-sm t-subtle">{h.date}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16.5,
                    }}
                  >
                    {h.mode}
                  </span>
                  <span className="t-mono" style={{ textAlign: 'right' }}>
                    {scoreLabel}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      minWidth: 76,
                    }}
                  >
                    {h.scaled != null ? (
                      <PassChip pass={h.pass ?? false} />
                    ) : (
                      <span className="t-mono-sm t-subtle">Practice</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
