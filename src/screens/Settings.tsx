import { useState } from 'react'
import { ThemePref } from '../lib/storage'
import { DOMAINS } from '../data/domains'
import { Btn } from '../components/Btn'
import { DomainBadge } from '../components/DomainBadge'
import { ConfirmDialog } from '../components/ConfirmDialog'

interface SettingsProps {
  themePref: ThemePref
  onThemePref: (t: ThemePref) => void
  onReset: () => void
}

export const Settings = ({ themePref, onThemePref, onReset }: SettingsProps) => {
  const [confirming, setConfirming] = useState(false)

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <p className="t-mono page-kicker">Settings</p>
        <h1 className="t-display page-title">Settings</h1>
      </div>

      {/* Appearance */}
      <div className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <span className="t-mono t-subtle">Appearance</span>
        <div className="chip-row" role="radiogroup" aria-label="Theme">
          {(['system', 'light', 'dark'] as ThemePref[]).map((t) => (
            <button
              key={t}
              role="radio"
              aria-checked={themePref === t}
              className={`filter-chip${themePref === t ? ' active' : ''}`}
              onClick={() => onThemePref(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="t-subtle" style={{ fontSize: 13.5, fontWeight: 300, margin: 0 }}>
          &ldquo;System&rdquo; follows your OS preference. Light is BRQ paper; dark is BRQ ink.
        </p>
      </div>

      {/* About the exam */}
      <div
        className="card"
        style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-4)' }}
      >
        <span className="t-mono t-subtle">About the exam</span>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
            >
              <DomainBadge domain={d} />
              <span className="t-muted" style={{ fontSize: 14, fontWeight: 300 }}>
                {d.name}
              </span>
              <span className="spacer" style={{ flex: 1 }}></span>
              <span className="t-mono-sm t-subtle">{d.weight}%</span>
            </div>
          ))}
        </div>
        <p
          className="t-subtle hairline-top"
          style={{ fontSize: 13.5, fontWeight: 300, margin: 0, paddingTop: 'var(--space-4)' }}
        >
          Claude Certified Architect — Foundations. Scaled score 100–1000 · pass mark 720.
        </p>
      </div>

      {/* Reset all progress */}
      <div
        className="card"
        style={{
          marginTop: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <span className="t-mono" style={{ color: 'var(--error-fg)' }}>
            Reset all progress
          </span>
          <p className="t-subtle" style={{ fontSize: 13.5, fontWeight: 300, margin: '6px 0 0' }}>
            Deletes card scheduling, mastery, and quiz history. This cannot be undone.
          </p>
        </div>
        <Btn variant="danger" size="sm" onClick={() => setConfirming(true)}>
          Reset&hellip;
        </Btn>
      </div>

      <ConfirmDialog
        open={confirming}
        danger
        title="Reset all progress?"
        body="This clears your SRS schedule, quiz history, and scores on this device. This cannot be undone."
        confirmLabel="Yes, reset everything"
        onConfirm={() => {
          setConfirming(false)
          onReset()
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
