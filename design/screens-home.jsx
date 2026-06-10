// Home dashboard, History, Settings
const HM = (() => {
  const { useState } = React;

  /* ================= DASHBOARD ================= */
  function Dashboard({ domains, history, fresh, onNav, onStartStudy, onStartQuiz }) {
    const totalDue = fresh ? 0 : domains.reduce((s, d) => s + d.cardsDue, 0);
    const totalCards = domains.reduce((s, d) => s + d.cardsTotal, 0);
    const last = history[0];
    const readiness = fresh ? 0 : Math.round(domains.reduce((s, d) => s + d.mastery * d.weight, 0) / 100);

    return (
      <div>
        <div className="page-head">
          <p className="t-mono page-kicker">Home · Tuesday, Jun 10 2026</p>
          <h1 className="t-display page-title" style={{ maxWidth: '18ch' }}>
            {fresh ? 'Let’s get you exam-ready.' : <>You have <span style={{ whiteSpace: 'nowrap' }}>{totalDue} cards</span> due today.</>}
          </h1>
          <p className="lead">
            {fresh
              ? `All ${totalCards} flashcards and the full question bank are loaded. Start anywhere — the trainer keeps score.`
              : 'Clear the due queue, then sharpen your weakest domain.'}
          </p>
        </div>

        {/* Primary entries */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'var(--space-4)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconCards size={18} />
              <span className="t-mono t-subtle">Flashcards</span>
            </div>
            <div>
              <div className="stat-num t-display" style={{ fontSize: 72 }}>{fresh ? totalCards : totalDue}</div>
              <div className="t-mono-sm t-subtle" style={{ marginTop: 6 }}>{fresh ? 'cards ready to learn' : 'cards due today'}</div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <Btn variant="filled" arrow onClick={onStartStudy}>Study flashcards</Btn>
            </div>
          </div>

          <div className="card card--ink" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative', overflow: 'hidden' }}>
            <div className="iso-texture" style={{ opacity: 0.1, filter: 'invert(1)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
              <IconClock size={18} />
              <span className="t-mono" style={{ color: 'var(--brq-gray-400)' }}>Quiz</span>
            </div>
            <div style={{ position: 'relative' }}>
              {last && last.scaled != null ? (
                <>
                  <div className="stat-num t-display" style={{ fontSize: 72 }}>{last.scaled}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <span className="t-mono-sm" style={{ color: 'var(--brq-gray-400)' }}>last exam score</span>
                    <PassChip pass={last.pass} />
                  </div>
                </>
              ) : last ? (
                <>
                  <div className="stat-num t-display" style={{ fontSize: 72 }}>{Math.round((last.correct / last.total) * 100)}%</div>
                  <div className="t-mono-sm" style={{ color: 'var(--brq-gray-400)', marginTop: 6 }}>last quiz · {last.mode}</div>
                </>
              ) : (
                <>
                  <div className="stat-num t-display" style={{ fontSize: 72 }}>—</div>
                  <div className="t-mono-sm" style={{ color: 'var(--brq-gray-400)', marginTop: 6 }}>no attempts yet</div>
                </>
              )}
            </div>
            <div style={{ marginTop: 'auto', position: 'relative' }}>
              <button className="btn" style={{ background: 'var(--brq-white)', color: 'var(--brq-black)' }} onClick={onStartQuiz}>
                Take a quiz<span className="arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Domain mastery */}
        <div className="card card--flush" style={{ marginTop: 'var(--space-6)' }}>
          <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span className="t-mono t-subtle">Domain mastery</span>
            <span className="spacer" style={{ flex: 1 }}></span>
            {fresh
              ? <span className="t-mono-sm t-subtle">No data yet — your first session will populate this</span>
              : <span className="t-mono-sm">Weighted readiness · {readiness}%</span>}
          </div>
          <div className="row-list">
            {domains.map((d) => (
              <div key={d.id} style={{ padding: 'var(--space-4) var(--space-6)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-2) var(--space-5)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <DomainBadge domain={d} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16.5 }}>{d.name}</span>
                  <WeightChip domain={d} />
                </div>
                <span className="t-mono-sm" style={{ textAlign: 'right' }}>{fresh ? 0 : d.mastery}%</span>
                <div style={{ gridColumn: '1 / -1' }}>
                  <ProgressBar value={fresh ? 0 : d.mastery} height={5} label={`${d.name} mastery`}
                               color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= HISTORY ================= */
  function History({ history, onOpen, onStartQuiz }) {
    return (
      <div>
        <div className="page-head">
          <p className="t-mono page-kicker">History · Past attempts</p>
          <h1 className="t-display page-title">Quiz history</h1>
        </div>
        {history.length === 0 ? (
          <EmptyState
            title="No attempts yet"
            body="Your quiz results will appear here — including scaled exam scores, pass/fail, and per-domain breakdowns."
            action={<Btn variant="filled" arrow onClick={onStartQuiz}>Take your first quiz</Btn>} />
        ) : (
          <div className="card card--flush">
            <div className="row-list">
              {history.map((h) => (
                <button key={h.id} className="attempt-row" onClick={() => onOpen(h)}>
                  <span className="t-mono-sm t-subtle">{h.date}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16.5 }}>{h.mode}</span>
                  <span className="t-mono" style={{ textAlign: 'right' }}>
                    {h.scaled != null ? `${h.scaled} / 1000` : `${h.correct}/${h.total} · ${Math.round((h.correct / h.total) * 100)}%`}
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 76 }}>
                    {h.scaled != null ? <PassChip pass={h.pass} /> : <span className="t-mono-sm t-subtle">Practice</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ================= SETTINGS ================= */
  function Settings({ themePref, onThemePref, onReset }) {
    const [confirming, setConfirming] = useState(false);
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="page-head">
          <p className="t-mono page-kicker">Settings</p>
          <h1 className="t-display page-title">Settings</h1>
        </div>

        <div className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <span className="t-mono t-subtle">Appearance</span>
          <div className="chip-row" role="radiogroup" aria-label="Theme">
            {['system', 'light', 'dark'].map((t) => (
              <button key={t} role="radio" aria-checked={themePref === t}
                      className={`filter-chip${themePref === t ? ' active' : ''}`}
                      onClick={() => onThemePref(t)}>
                {t}
              </button>
            ))}
          </div>
          <p className="t-subtle" style={{ fontSize: 13.5, fontWeight: 300, margin: 0 }}>
            “System” follows your OS preference. Light is BRQ paper; dark is BRQ ink.
          </p>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-4)' }}>
          <span className="t-mono t-subtle">About the exam</span>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {window.DOMAINS.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <DomainBadge domain={d} />
                <span className="t-muted" style={{ fontSize: 14, fontWeight: 300 }}>{d.name}</span>
                <span className="spacer" style={{ flex: 1 }}></span>
                <span className="t-mono-sm t-subtle">{d.weight}%</span>
              </div>
            ))}
          </div>
          <p className="t-subtle hairline-top" style={{ fontSize: 13.5, fontWeight: 300, margin: 0, paddingTop: 'var(--space-4)' }}>
            Claude Certified Architect — Foundations. Scaled score 100–1000 · pass mark 720.
          </p>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span className="t-mono" style={{ color: 'var(--error-fg)' }}>Reset all progress</span>
            <p className="t-subtle" style={{ fontSize: 13.5, fontWeight: 300, margin: '6px 0 0' }}>
              Deletes card scheduling, mastery, and quiz history. This cannot be undone.
            </p>
          </div>
          <Btn variant="danger" size="sm" onClick={() => setConfirming(true)}>Reset…</Btn>
        </div>

        <ConfirmDialog
          open={confirming}
          danger
          title="Reset all progress?"
          body="All flashcard scheduling, domain mastery, and quiz history will be permanently deleted. The card decks and question bank remain."
          confirmLabel="Yes, reset everything"
          onConfirm={() => { setConfirming(false); onReset(); }}
          onCancel={() => setConfirming(false)} />
      </div>
    );
  }

  return { Dashboard, History, Settings };
})();

window.Dashboard = HM.Dashboard;
window.HistoryScreen = HM.History;
window.SettingsScreen = HM.Settings;
