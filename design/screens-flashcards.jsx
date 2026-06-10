// Flashcards — deck overview + study session
const FC = (() => {
  const { useState, useEffect, useMemo, useCallback } = React;

  /* ================= DECK OVERVIEW ================= */
  function DeckOverview({ domains, fresh, onStart }) {
    const [filter, setFilter] = useState('all');
    const shown = filter === 'all' ? domains : domains.filter((d) => d.id === filter);
    const totalDue = domains.reduce((s, d) => s + d.cardsDue, 0);
    const sessionDomain = filter === 'all' ? null : filter;
    const sessionCount = window.FLASHCARDS.filter((c) => !sessionDomain || c.domain === sessionDomain).length;

    return (
      <div>
        <div className="page-head">
          <p className="t-mono page-kicker">Flashcards · Spaced repetition</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <h1 className="t-display page-title">Card decks</h1>
            <Btn variant="filled" arrow onClick={() => onStart(sessionDomain)} disabled={fresh && false}>
              Study {filter === 'all' ? (fresh ? `${sessionCount} new` : `${totalDue} due`) : domainById(filter).code}
            </Btn>
          </div>
          <p className="lead">Leitner scheduling — rate each card “Again” or “Good” and it resurfaces at the right moment.</p>
        </div>

        <div className="chip-row" style={{ marginBottom: 'var(--space-6)' }}>
          <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
          {domains.map((d) => (
            <button key={d.id} className={`filter-chip${filter === d.id ? ' active' : ''}`} onClick={() => setFilter(d.id)}>{d.code} · {d.short}</button>
          ))}
        </div>

        <div className="card card--flush">
          <div className="row-list">
            {shown.map((d) => (
              <div key={d.id} style={{ padding: 'var(--space-5) var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <DomainBadge domain={d} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>{d.name}</span>
                  <span className="spacer" style={{ flex: 1 }}></span>
                  <WeightChip domain={d} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                  <ProgressBar value={fresh ? 0 : (d.cardsLearned / d.cardsTotal) * 100} height={5}
                               color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`}
                               label={`${d.name} cards learned`} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                  <span className="t-mono-sm t-subtle">{fresh ? 0 : d.cardsLearned} / {d.cardsTotal} learned</span>
                  <span className="t-mono-sm" style={{ color: (fresh ? 0 : d.cardsDue) > 0 ? 'var(--fg)' : 'var(--fg-subtle)' }}>
                    {fresh ? 0 : d.cardsDue} due today
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {fresh && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <EmptyState
              title="No cards studied yet"
              body="Your decks are loaded with every exam concept. Start a session and the scheduler will take it from there."
              action={<Btn variant="outline" onClick={() => onStart(null)} arrow>Start first session</Btn>} />
          </div>
        )}
      </div>
    );
  }

  /* ================= STUDY SESSION ================= */
  function StudySession({ domain, onExit }) {
    const deck = useMemo(() => {
      const cards = window.FLASHCARDS.filter((c) => !domain || c.domain === domain);
      return cards;
    }, [domain]);

    const [queue, setQueue] = useState(() => deck.map((c) => c.id));
    const [doneCount, setDoneCount] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [againIds, setAgainIds] = useState([]);

    const total = deck.length;
    const current = queue.length ? deck.find((c) => c.id === queue[0]) : null;

    const rate = useCallback((rating) => {
      if (!current) return;
      setFlipped(false);
      // wait for flip-back before advancing
      setTimeout(() => {
        setQueue((q) => {
          const rest = q.slice(1);
          if (rating === 'again') {
            const at = Math.min(2, rest.length);
            return [...rest.slice(0, at), q[0], ...rest.slice(at)];
          }
          return rest;
        });
        if (rating === 'good') setDoneCount((n) => n + 1);
        else setAgainIds((ids) => ids.includes(current.id) ? ids : [...ids, current.id]);
      }, 230);
    }, [current]);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          if (e.target.tagName === 'BUTTON' && e.key === 'Enter') return;
          e.preventDefault(); setFlipped((f) => !f);
        }
        if (flipped && e.key === '1') rate('again');
        if (flipped && e.key === '2') rate('good');
        if (e.key === 'Escape') onExit();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [flipped, rate, onExit]);

    if (!current) {
      return (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-6)' }}>
            <p className="t-mono t-subtle" style={{ marginBottom: 'var(--space-4)' }}>Session complete</p>
            <div className="stat-num t-display" style={{ fontSize: 88 }}>{doneCount}</div>
            <p className="t-mono-sm t-subtle" style={{ marginTop: 8 }}>cards rated good</p>
            {againIds.length > 0 && (
              <p className="t-muted" style={{ fontSize: 14, fontWeight: 300, marginTop: 'var(--space-4)' }}>
                {againIds.length} card{againIds.length > 1 ? 's' : ''} marked “Again” will resurface sooner.
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Btn variant="outline" onClick={onExit}>Back to decks</Btn>
              <Btn variant="filled" onClick={() => { setQueue(deck.map((c) => c.id)); setDoneCount(0); setAgainIds([]); }} arrow>Study again</Btn>
            </div>
          </div>
        </div>
      );
    }

    const d = domainById(current.domain);
    const position = Math.min(doneCount + 1, total);

    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Session header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <button className="btn btn--ghost btn--sm" onClick={onExit}>← Exit</button>
          <span className="spacer" style={{ flex: 1 }}></span>
          <span className="t-mono t-subtle">{position} / {total}</span>
          <span className="t-mono-sm t-subtle" aria-label={`${queue.length} cards remaining`}>· {queue.length} due</span>
        </div>
        <ProgressBar value={(doneCount / total) * 100} label="Session progress" />

        {/* Card */}
        <div className="flashcard-stage" style={{ marginTop: 'var(--space-6)' }}>
          <div className={`flashcard${flipped ? ' flipped' : ''}`} style={{ minHeight: 400 }}>
            <button className="face face--front" onClick={() => setFlipped(true)}
                    aria-label="Show answer" style={{ cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <DomainBadge domain={d} />
                <span className="spacer" style={{ flex: 1 }}></span>
                <span className="t-mono-sm t-subtle">Prompt</span>
              </div>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 'var(--space-5) 0' }}>
                <h2 className="t-display" style={{ fontSize: 'clamp(26px, 3.4vw, 36px)', textAlign: 'center', maxWidth: '20ch', textWrap: 'pretty' }}>{current.front}</h2>
              </div>
              <div className="t-mono-sm t-subtle" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <IconFlip size={13} /> Tap or press space to flip
              </div>
            </button>
            <div className="face face--back" aria-hidden={!flipped}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <DomainBadge domain={d} />
                <span className="spacer" style={{ flex: 1 }}></span>
                <span className="t-mono-sm" style={{ opacity: 0.6 }}>Concept</span>
              </div>
              <div style={{ flex: 1, display: 'grid', alignItems: 'center', padding: 'var(--space-5) 0' }}>
                <div>
                  <p className="t-display" style={{ fontSize: 21, marginBottom: 'var(--space-4)' }}>{current.front}</p>
                  <p style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 300, opacity: 0.85, maxWidth: '58ch', margin: 0 }}>{current.back}</p>
                </div>
              </div>
              <div className="t-mono-sm" style={{ opacity: 0.5, textAlign: 'center' }}>How well did you recall it?</div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ marginTop: 'var(--space-5)', minHeight: 56 }}>
          {flipped ? (
            <div className="rating-row">
              <Btn variant="outline" onClick={() => rate('again')} aria-keyshortcuts="1">
                Again <span className="t-mono-sm t-subtle" style={{ textTransform: 'none' }}>· resurfaces soon</span>
              </Btn>
              <Btn variant="filled" onClick={() => rate('good')} aria-keyshortcuts="2">
                Good <span className="t-mono-sm" style={{ opacity: 0.6, textTransform: 'none' }}>· spaced out</span>
              </Btn>
            </div>
          ) : (
            <div className="t-mono-sm t-subtle" style={{ textAlign: 'center', paddingTop: 14 }}>Flip the card to rate your recall</div>
          )}
        </div>
      </div>
    );
  }

  return { DeckOverview, StudySession };
})();

window.DeckOverview = FC.DeckOverview;
window.StudySession = FC.StudySession;
