// =============================================================================
// QuizRunner — per-question runner with non-timed reveal vs timed defer
// + countdown/auto-submit in timed mode
// QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05
// =============================================================================

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { DOMAINS } from '../data/domains'
import { getQuestions } from '../data/content'
import {
  selectQuestions,
  gradeAttempt,
  remainingSeconds,
  isExpired,
} from '../lib/quiz'
import type { Answers, GradeResult } from '../lib/quiz'
import type { Question } from '../data/types'
import { QUIZ_MODES } from '../data/quizModes'
import type { QuizConfig } from './ModeSelect'
import { Btn } from '../components/Btn'
import { DomainBadge } from '../components/DomainBadge'
import { ProgressBar } from '../components/ProgressBar'
import { Timer } from '../components/QuizParts'
import { IconCheck, IconX } from '../components/icons'

const KEY_LABELS = ['A', 'B', 'C', 'D'] as const

interface QuizRunnerProps {
  config: QuizConfig
  onFinish: (
    grade: GradeResult,
    questions: Question[],
    answers: Answers,
  ) => void
  onExit: () => void
}

export function QuizRunner({ config, onFinish, onExit }: QuizRunnerProps) {
  // ─── Question selection (once; rng injected here — engine stays pure) ───
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pool = useMemo(() => getQuestions(), [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(
    () =>
      selectQuestions(
        config.mode,
        { domain: config.domain, n: config.n },
        pool,
        Math.random,
      ),
    [],
  )

  // ─── Quiz state ───────────────────────────────────────────────────────────
  const timed = config.mode === 'timed'
  const [idx, setIdx] = useState(0)

  // answers keyed by questionId; initialised to null for each question
  const [answers, setAnswers] = useState<Answers>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null])),
  )
  const [revealed, setRevealed] = useState(false)

  const q = questions[idx]
  const selected = q ? answers[q.id] : null
  const last = idx === questions.length - 1

  // ─── Timed countdown (real clock — impurity lives here in UI only) ─────────
  const DURATION = 600 // 10 minutes
  const startedAt = useMemo(() => Date.now(), [])
  const [nowMs, setNowMs] = useState(() => Date.now())
  const finishedRef = useRef(false)

  useEffect(() => {
    if (!timed) return
    const iv = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [timed])

  const secLeft = timed ? remainingSeconds(startedAt, DURATION, nowMs) : 0

  // ─── Finish handler ────────────────────────────────────────────────────────
  const answersRef = useRef(answers)
  answersRef.current = answers

  const finish = useCallback(
    (finalAnswers: Answers) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const grade = gradeAttempt(questions, finalAnswers)
      onFinish(grade, questions, finalAnswers)
    },
    [questions, onFinish],
  )

  // Auto-submit on expiry (single fire via ref guard)
  useEffect(() => {
    if (timed && isExpired(startedAt, DURATION, nowMs)) {
      finish(answersRef.current)
    }
  }, [timed, startedAt, nowMs, finish])

  // ─── Select handler ────────────────────────────────────────────────────────
  const select = (i: number) => {
    if (!q) return
    if (!timed && revealed) return // locked after reveal in non-timed mode
    const next = { ...answers, [q.id]: i }
    setAnswers(next)
    if (!timed) setRevealed(true)
    // timed: record answer but do NOT reveal
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  const goNext = () => {
    if (last) {
      finish(answers)
      return
    }
    setIdx(idx + 1)
    setRevealed(false)
  }

  // ─── Derived display state ─────────────────────────────────────────────────
  const showState = !timed && revealed
  const modeName =
    QUIZ_MODES.find((m) => m.key === config.mode)?.name ?? config.mode

  if (!q) return null

  const domainObj = DOMAINS.find((d) => d.id === q.domain)!

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <button className="btn btn--ghost btn--sm" onClick={onExit}>
          ← Exit
        </button>
        <span className="t-mono t-subtle">{modeName}</span>
        <span className="spacer" style={{ flex: 1 }}></span>
        <span className="t-mono">
          Q {idx + 1} / {questions.length}
        </span>
        {timed && <Timer secondsLeft={secLeft} totalSeconds={DURATION} />}
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={(idx / questions.length) * 100}
        label="Quiz progress"
      />

      {/* Scenario banner (scenario mode only) */}
      {config.mode === 'scenario' && q.scenario && (
        <div
          className="scenario-banner"
          style={{ marginTop: 'var(--space-5)' }}
        >
          <span
            className="t-mono-sm"
            style={{ opacity: 0.55, flex: 'none' }}
          >
            Scenario
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
            }}
          >
            {q.scenario}
          </span>
        </div>
      )}

      {/* Question */}
      <div style={{ margin: 'var(--space-6) 0' }}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <DomainBadge domain={domainObj} />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 450,
            fontSize: 'clamp(19px, 2.3vw, 23px)',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            margin: 0,
            maxWidth: '62ch',
          }}
        >
          {q.stem}
        </h2>
      </div>

      {/* Answer options */}
      <div
        style={{ display: 'grid', gap: 'var(--space-3)' }}
        role="radiogroup"
        aria-label="Answer options"
      >
        {q.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (showState) {
            if (i === q.correct) cls += ' correct'
            else if (i === selected) cls += ' incorrect'
            else cls += ' dimmed'
          } else if (i === selected) {
            cls += ' selected'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => select(i)}
              disabled={showState}
              role="radio"
              aria-checked={i === selected}
            >
              <span className="key" aria-hidden="true">
                {KEY_LABELS[i]}
              </span>
              <span style={{ paddingTop: 3 }}>{opt}</span>
              {showState && i === q.correct && (
                <span className="opt-state">
                  <IconCheck
                    strokeWidth={2}
                    style={{ color: 'var(--success-fg)' }}
                  />
                  <span className="state-label state-label--correct">
                    Correct
                  </span>
                </span>
              )}
              {showState && i === selected && i !== q.correct && (
                <span className="opt-state">
                  <IconX
                    strokeWidth={2}
                    style={{ color: 'var(--error-fg)' }}
                  />
                  <span className="state-label state-label--incorrect">
                    Your answer
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation (non-timed, after reveal) */}
      {showState && (
        <div className="explanation" style={{ marginTop: 'var(--space-5)' }}>
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
            <span className="t-mono-sm t-subtle">Why the others are wrong</span>
            <p>{q.whyOthers}</p>
          </div>
        </div>
      )}

      {/* Next / Finish button */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-3)',
        }}
      >
        <Btn
          variant="filled"
          arrow
          disabled={selected == null || (!timed && !revealed)}
          onClick={goNext}
        >
          {last
            ? timed
              ? 'Finish exam'
              : 'See results'
            : 'Next'}
        </Btn>
      </div>
    </div>
  )
}
