import { DOMAINS } from '../data/domains'
import { Btn } from '../components/Btn'
import { DomainBadge, WeightChip } from '../components/DomainBadge'
import { ProgressBar } from '../components/ProgressBar'
import { IconCards, IconClock } from '../components/icons'
import { EmptyState } from '../components/EmptyState'
import type { Route } from '../components/AppShell'

interface DashboardProps {
  onNav: (r: Route) => void
}

export const Dashboard = ({ onNav }: DashboardProps) => {
  const totalCards = DOMAINS.reduce((s) => s + 0, 0) // placeholder — Phase 2 wires content

  return (
    <div>
      <div className="page-head">
        <p className="t-mono page-kicker">Home</p>
        <h1 className="t-display page-title" style={{ maxWidth: '18ch' }}>
          Let&rsquo;s get you exam-ready.
        </h1>
        <p className="lead">
          {`All ${totalCards || DOMAINS.length * 0} flashcards and the full question bank are loaded. Start anywhere — the trainer keeps score.`}
        </p>
      </div>

      {/* Primary entry cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Flashcards card */}
        <div
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconCards size={18} />
            <span className="t-mono t-subtle">Flashcards</span>
          </div>
          <div>
            <div className="stat-num t-display" style={{ fontSize: 72 }}>
              —
            </div>
            <div className="t-mono-sm t-subtle" style={{ marginTop: 6 }}>
              cards ready to learn
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Btn variant="filled" arrow onClick={() => onNav('flashcards')}>
              Study flashcards
            </Btn>
          </div>
        </div>

        {/* Quiz card */}
        <div
          className="card card--ink"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="iso-texture" style={{ opacity: 0.1, filter: 'invert(1)' }}></div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              position: 'relative',
            }}
          >
            <IconClock size={18} />
            <span className="t-mono" style={{ color: 'var(--brq-gray-400)' }}>
              Quiz
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="stat-num t-display" style={{ fontSize: 72 }}>
              —
            </div>
            <div
              className="t-mono-sm"
              style={{ color: 'var(--brq-gray-400)', marginTop: 6 }}
            >
              no attempts yet
            </div>
          </div>
          <div style={{ marginTop: 'auto', position: 'relative' }}>
            <button
              className="btn"
              style={{ background: 'var(--brq-white)', color: 'var(--brq-black)' }}
              onClick={() => onNav('quiz')}
            >
              Take a quiz
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Domain mastery overview */}
      <div className="card card--flush" style={{ marginTop: 'var(--space-6)' }}>
        <div
          style={{
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <span className="t-mono t-subtle">Domain mastery</span>
          <span className="spacer" style={{ flex: 1 }}></span>
          <span className="t-mono-sm t-subtle">
            No data yet — your first session will populate this
          </span>
        </div>
        <div className="row-list">
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              style={{
                padding: 'var(--space-4) var(--space-6)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 'var(--space-2) var(--space-5)',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                <DomainBadge domain={d} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16.5 }}>
                  {d.name}
                </span>
                <WeightChip domain={d} />
              </div>
              <span className="t-mono-sm" style={{ textAlign: 'right' }}>
                0%
              </span>
              <div style={{ gridColumn: '1 / -1' }}>
                <ProgressBar
                  value={0}
                  height={5}
                  label={`${d.name} mastery`}
                  color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New-user empty state */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <EmptyState
          title="Start your prep"
          body="No study history yet. Begin with a flashcard session or take a practice quiz to see your per-domain progress build here."
          action={
            <Btn variant="filled" arrow onClick={() => onNav('flashcards')}>
              Study flashcards
            </Btn>
          }
        />
      </div>
    </div>
  )
}
