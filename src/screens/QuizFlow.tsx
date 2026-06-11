// =============================================================================
// QuizFlow — stateful container: ModeSelect → QuizRunner → QuizResults
// Records one QuizAttempt per finish via addAttempt.
// QUIZ-06, QUIZ-07
// =============================================================================

import { useState } from 'react'
import { useStoredState } from '../lib/useStoredState'
import { scaledScore, isPass } from '../lib/quiz'
import type { Answers, GradeResult } from '../lib/quiz'
import type { Question } from '../data/types'
import type { DomainId } from '../data/domains'
import { DOMAINS } from '../data/domains'
import { QUIZ_MODES } from '../data/quizModes'
import { ModeSelect } from './ModeSelect'
import type { QuizConfig } from './ModeSelect'
import { QuizRunner } from './QuizRunner'
import { QuizResults } from './QuizResults'
import type { QuizResultView } from './QuizResults'

type View = 'select' | 'run' | 'results'

export function QuizFlow() {
  const { addAttempt } = useStoredState()

  const [view, setView] = useState<View>('select')
  const [config, setConfig] = useState<QuizConfig | null>(null)
  const [lastResult, setLastResult] = useState<QuizResultView | null>(null)

  // ─── onStart from ModeSelect ────────────────────────────────────────────────
  const onStart = (cfg: QuizConfig) => {
    setConfig(cfg)
    setView('run')
  }

  // ─── onFinish from QuizRunner ───────────────────────────────────────────────
  const onFinish = (
    grade: GradeResult,
    questions: Question[],
    answers: Answers,
  ) => {
    if (!config) return

    // SHAPE CONVERSION: engine's perDomain[d] = {correct,total,pct}
    // → flat Record<DomainId, number> for storage + DomainBars
    const flatPerDomain: Partial<Record<DomainId, number>> = {}
    for (const [d, s] of Object.entries(grade.perDomain)) {
      if (s) flatPerDomain[d as DomainId] = s.pct
    }

    // Timed scoring: only for timed mode
    const isTimed = config.mode === 'timed'
    const scaled = isTimed ? scaledScore(grade.correct, grade.total) : undefined
    const pass = isTimed && scaled != null ? isPass(scaled) : undefined

    // Build modeName: domain mode appends domain code
    const modeInfo = QUIZ_MODES.find((m) => m.key === config.mode)
    let modeName = modeInfo?.name ?? config.mode
    if (config.mode === 'domain') {
      const domainInfo = DOMAINS.find((d) => d.id === config.domain)
      if (domainInfo) modeName += ` · ${domainInfo.code}`
    }

    // Build QuizResultView
    const resultView: QuizResultView = {
      modeKey: config.mode,
      modeName,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      questions,
      answers,
      grade,
      scaled,
      pass,
    }

    // Build QuizAttempt for storage (id/date generated here in UI layer — engine stays pure)
    const attempt = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      date: resultView.date,
      mode: modeName,
      modeKey: config.mode,
      correct: grade.correct,
      total: grade.total,
      ...(scaled != null ? { scaled } : {}),
      ...(pass != null ? { pass } : {}),
      perDomain: flatPerDomain as Record<DomainId, number>,
      missed: grade.missed.map((q) => ({
        questionId: q.id,
        selected: answers[q.id] ?? null,
      })),
    }

    // Record attempt (exactly once per finish)
    addAttempt(attempt)

    setLastResult(resultView)
    setView('results')
  }

  // ─── Retry handler ──────────────────────────────────────────────────────────
  const onRetry = () => {
    setView('run') // same config — restart runner
  }

  // ─── Home handler ───────────────────────────────────────────────────────────
  const onHome = () => {
    setView('select')
    setLastResult(null)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (view === 'select' || !config) {
    return <ModeSelect onStart={onStart} />
  }

  if (view === 'run') {
    return (
      <QuizRunner
        config={config}
        onFinish={onFinish}
        onExit={onHome}
      />
    )
  }

  if (view === 'results' && lastResult) {
    return (
      <QuizResults
        result={lastResult}
        onRetry={onRetry}
        onHome={onHome}
      />
    )
  }

  // Fallback (should not reach here)
  return <ModeSelect onStart={onStart} />
}
