// =============================================================================
// Quiz presentational components — ported from design/components.jsx
// ScoreDial, DomainBars, PassChip, Timer
// =============================================================================

import { DOMAINS } from '../data/domains'
import type { DomainId } from '../data/domains'
import { ProgressBar } from './ProgressBar'
import { IconCheck, IconX } from './icons'

// ─── PassChip ─────────────────────────────────────────────────────────────────

export function PassChip({ pass }: { pass: boolean }) {
  return (
    <span className={`pass-chip pass-chip--${pass ? 'pass' : 'fail'}`}>
      {pass ? (
        <IconCheck size={12} strokeWidth={2} />
      ) : (
        <IconX size={12} strokeWidth={2} />
      )}
      {pass ? 'Pass' : 'Fail'}
    </span>
  )
}

// ─── Timer ────────────────────────────────────────────────────────────────────

export function Timer({
  secondsLeft,
  totalSeconds,
}: {
  secondsLeft: number
  totalSeconds: number
}) {
  const low = secondsLeft <= totalSeconds * 0.2
  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60
  return (
    <span
      className={`timer${low ? ' low' : ''}`}
      role="timer"
      aria-label={`${m} minutes ${s} seconds remaining`}
    >
      <span className="dot" aria-hidden="true"></span>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

// ─── ScoreDial ────────────────────────────────────────────────────────────────
// 240° arc from 150° to 390°. Pass mark line at 720.

export function ScoreDial({ score, pass }: { score: number; pass: boolean }) {
  const pct = (score - 100) / 900
  const R = 84
  const CX = 100
  const CY = 100
  const a0 = 150
  const a1 = 390

  const angle = (deg: number): [number, number] => [
    CX + R * Math.cos((deg * Math.PI) / 180),
    CY + R * Math.sin((deg * Math.PI) / 180),
  ]

  const arc = (from: number, to: number): string => {
    const [x0, y0] = angle(from)
    const [x1, y1] = angle(to)
    const large = to - from > 180 ? 1 : 0
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`
  }

  const scoreDeg = a0 + pct * (a1 - a0)
  // Pass mark at 720: (720-100)/900 of the arc
  const passDeg = a0 + ((720 - 100) / 900) * (a1 - a0)
  const [tx0, ty0] = [
    CX + (R - 9) * Math.cos((passDeg * Math.PI) / 180),
    CY + (R - 9) * Math.sin((passDeg * Math.PI) / 180),
  ]
  const [tx1, ty1] = [
    CX + (R + 9) * Math.cos((passDeg * Math.PI) / 180),
    CY + (R + 9) * Math.sin((passDeg * Math.PI) / 180),
  ]

  return (
    <div style={{ position: 'relative', width: 200, margin: '0 auto' }}>
      <svg
        viewBox="0 0 200 172"
        width="200"
        role="img"
        aria-label={`Scaled score ${score} of 1000. Pass mark 720. Result: ${pass ? 'pass' : 'fail'}.`}
      >
        <path
          d={arc(a0, a1)}
          stroke="var(--hairline)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={arc(a0, Math.max(a0 + 0.5, scoreDeg))}
          stroke={pass ? 'var(--sem-success)' : 'var(--sem-error)'}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1={tx0}
          y1={ty0}
          x2={tx1}
          y2={ty1}
          stroke="var(--fg)"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: '38px 0 auto 0',
          textAlign: 'center',
        }}
      >
        <div className="stat-num" style={{ fontSize: 56 }}>
          {score}
        </div>
        <div className="t-mono-sm t-subtle" style={{ marginTop: 6 }}>
          of 1000 · pass ≥ 720
        </div>
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <PassChip pass={pass} />
        </div>
      </div>
    </div>
  )
}

// ─── DomainBars ───────────────────────────────────────────────────────────────

export function DomainBars({
  perDomain,
}: {
  perDomain: Partial<Record<DomainId, number>>
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {DOMAINS.filter((d) => perDomain[d.id] != null).map((d) => (
        <div key={d.id} className="bar-chart-row">
          <span className="t-mono-sm t-subtle">{d.code}</span>
          <ProgressBar
            value={perDomain[d.id]!}
            height={6}
            label={`${d.name} score`}
            color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`}
          />
          <span className="t-mono-sm" style={{ textAlign: 'right' }}>
            {perDomain[d.id]}% correct
          </span>
        </div>
      ))}
    </div>
  )
}
