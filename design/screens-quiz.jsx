// Quiz — mode select, runner, results
const QZ = (() => {
  const { useState, useEffect, useMemo, useRef, useCallback } = React;

  const EXAM_SCENARIOS = [
    'Multi-Agent Research System',
    'Customer Support Resolution Agent',
    'Structured Data Extraction',
    'Claude Code for Continuous Integration',
  ];
  const TIMED_IDS = ['q1', 'q2', 'q4', 'q7', 'q8', 'q9', 'q10', 'q11', 'q13', 'q14'];
  const TIMED_SECONDS = 5 * 60;

  function buildQuestions(config) {
    const all = window.QUESTIONS;
    if (config.mode === 'scenario') {
      return EXAM_SCENARIOS.flatMap((s) => all.filter((q) => q.scenario === s));
    }
    if (config.mode === 'domain') {
      return all.filter((q) => q.domain === config.domain);
    }
    if (config.mode === 'timed') {
      return TIMED_IDS.map((id) => all.find((q) => q.id === id));
    }
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, config.count);
  }

  function computeResult(config, questions, answers) {
    let correct = 0;
    const byDomain = {};
    questions.forEach((q, i) => {
      const ok = answers[i] === q.correct;
      if (ok) correct += 1;
      byDomain[q.domain] = byDomain[q.domain] || { ok: 0, n: 0 };
      byDomain[q.domain].n += 1;
      if (ok) byDomain[q.domain].ok += 1;
    });
    const perDomain = {};
    Object.keys(byDomain).forEach((d) => { perDomain[d] = Math.round((byDomain[d].ok / byDomain[d].n) * 100); });
    const total = questions.length;
    const result = {
      modeKey: config.mode,
      mode: window.QUIZ_MODES.find((m) => m.key === config.mode).name + (config.mode === 'domain' ? ` · ${domainById(config.domain).code}` : ''),
      date: 'Jun 10, 2026',
      questions, answers, correct, total, perDomain,
    };
    if (config.mode === 'timed') {
      result.scaled = Math.round((100 + (correct / total) * 900) / 1);
      result.pass = result.scaled >= 720;
    }
    return result;
  }

  /* ================= MODE SELECT ================= */
  function ModeSelect({ onStart }) {
    const [mode, setMode] = useState(null);
    const [domain, setDomain] = useState('d1');
    const [count, setCount] = useState(10);

    const config = { mode, domain, count };
    const ready = mode != null;

    return (
      <div>
        <div className="page-head">
          <p className="t-mono page-kicker">Quiz · Exam-style questions</p>
          <h1 className="t-display page-title">Choose a mode</h1>
          <p className="lead">Every question follows the exam format: one correct answer, three distractors, and a full explanation.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'var(--space-4)' }}>
          {window.QUIZ_MODES.map((m) => {
            const active = mode === m.key;
            return (
              <button key={m.key} onClick={() => setMode(m.key)}
                      className="card" aria-pressed={active}
                      style={{
                        textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit',
                        display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
                        borderColor: active ? 'var(--fg)' : undefined,
                        boxShadow: active ? '0 0 0 1px var(--fg)' : undefined,
                        transition: 'box-shadow var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out)',
                      }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className="t-mono-sm" style={{
                    width: 22, height: 22, borderRadius: 999, flex: 'none', display: 'grid', placeItems: 'center',
                    border: '1.5px solid var(--hairline-strong)',
                    background: active ? 'var(--fill)' : 'transparent', color: active ? 'var(--fill-fg)' : 'transparent',
                  }} aria-hidden="true"><IconCheck size={11} strokeWidth={2.4} /></span>
                  <h3 className="t-display" style={{ fontSize: 23, margin: 0 }}>{m.name}</h3>
                </div>
                <p className="t-muted" style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.55, margin: 0 }}>{m.desc}</p>
                <span className="t-mono-sm t-subtle" style={{ marginTop: 'auto' }}>{m.meta}</span>
              </button>
            );
          })}
        </div>

        {/* Mode config */}
        <div style={{ marginTop: 'var(--space-5)', minHeight: 96 }}>
          {mode === 'domain' && (
            <div className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <span className="t-mono t-subtle">Pick a domain</span>
              <div className="chip-row">
                {window.DOMAINS.map((d) => (
                  <button key={d.id} className={`filter-chip${domain === d.id ? ' active' : ''}`} onClick={() => setDomain(d.id)}>
                    {d.code} · {d.short} · {d.weight}%
                  </button>
                ))}
              </div>
            </div>
          )}
          {mode === 'free' && (
            <div className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <span className="t-mono t-subtle">Number of questions</span>
              <div className="chip-row">
                {[5, 10, 14].map((n) => (
                  <button key={n} className={`filter-chip${count === n ? ' active' : ''}`} onClick={() => setCount(n)}>{n} questions</button>
                ))}
              </div>
            </div>
          )}
          {mode === 'timed' && (
            <div className="card" style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><IconClock /> <span className="t-mono">5 minutes</span></span>
              <span className="t-mono t-subtle">10 questions</span>
              <span className="t-mono t-subtle">Scaled score 100–1000</span>
              <span className="t-mono t-subtle">Pass ≥ 720</span>
              <span className="t-mono-sm t-subtle" style={{ width: '100%' }}>No feedback during the exam — explanations are revealed in your results.</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="filled" size="lg" arrow disabled={!ready}
               onClick={() => onStart(config)}>
            {mode === 'timed' ? 'Start exam' : 'Start quiz'}
          </Btn>
        </div>
      </div>
    );
  }

  /* ================= RUNNER ================= */
  function QuizRunner({ config, timerSpeed, onFinish, onExit }) {
    const questions = useMemo(() => buildQuestions(config), []);
    const timed = config.mode === 'timed';
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState(() => questions.map(() => null));
    const [revealed, setRevealed] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(TIMED_SECONDS);
    const finishedRef = useRef(false);

    const q = questions[idx];
    const selected = answers[idx];
    const last = idx === questions.length - 1;

    const finish = useCallback((finalAnswers) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinish(computeResult(config, questions, finalAnswers));
    }, [onFinish, questions]);

    // Countdown
    useEffect(() => {
      if (!timed) return;
      const iv = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) { clearInterval(iv); return 0; }
          return s - 1;
        });
      }, Math.max(16, 1000 / (timerSpeed || 1)));
      return () => clearInterval(iv);
    }, [timed, timerSpeed]);

    const answersRef = useRef(answers);
    answersRef.current = answers;
    useEffect(() => {
      if (timed && secondsLeft === 0) finish(answersRef.current);
    }, [secondsLeft, timed, finish]);

    const select = (i) => {
      if (!timed && revealed) return;
      const next = [...answers];
      next[idx] = i;
      setAnswers(next);
      if (!timed) setRevealed(true);
    };

    const goNext = () => {
      if (last) { finish(answers); return; }
      setIdx(idx + 1);
      setRevealed(false);
    };

    // Keyboard: A–D select, Enter advance
    useEffect(() => {
      const onKey = (e) => {
        const k = e.key.toLowerCase();
        const map = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
        if (map[k] != null && (timed || !revealed)) select(map[k]);
        if (e.key === 'Enter' && selected != null && (timed || revealed) && e.target.tagName !== 'BUTTON') goNext();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });

    const showState = !timed && revealed;
    const keyLabel = ['A', 'B', 'C', 'D'];

    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Runner header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button className="btn btn--ghost btn--sm" onClick={onExit}>← Exit</button>
          <span className="t-mono t-subtle">{window.QUIZ_MODES.find((m) => m.key === config.mode).name}</span>
          <span className="spacer" style={{ flex: 1 }}></span>
          <span className="t-mono">Q {idx + 1} / {questions.length}</span>
          {timed && <Timer secondsLeft={secondsLeft} totalSeconds={TIMED_SECONDS} />}
        </div>
        <ProgressBar value={(idx / questions.length) * 100} label="Quiz progress" />

        {/* Scenario banner */}
        {config.mode === 'scenario' && q.scenario && (
          <div className="scenario-banner" style={{ marginTop: 'var(--space-5)' }}>
            <span className="t-mono-sm" style={{ opacity: 0.55, flex: 'none' }}>Scenario</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{q.scenario}</span>
          </div>
        )}

        {/* Question */}
        <div style={{ margin: 'var(--space-6) 0' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <DomainBadge domain={q.domain} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 450, fontSize: 'clamp(19px, 2.3vw, 23px)', lineHeight: 1.35, letterSpacing: '-0.01em', margin: 0, maxWidth: '62ch', textWrap: 'pretty' }}>
            {q.stem}
          </h2>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gap: 'var(--space-3)' }} role="radiogroup" aria-label="Answer options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (showState) {
              if (i === q.correct) cls += ' correct';
              else if (i === selected) cls += ' incorrect';
              else cls += ' dimmed';
            } else if (i === selected) cls += ' selected';
            return (
              <button key={i} className={cls} onClick={() => select(i)} disabled={showState}
                      role="radio" aria-checked={i === selected}>
                <span className="key" aria-hidden="true">{keyLabel[i]}</span>
                <span style={{ paddingTop: 3 }}>{opt}</span>
                {showState && i === q.correct && (
                  <span className="opt-state"><IconCheck strokeWidth={2} style={{ color: 'var(--success-fg)' }} /><span className="state-label state-label--correct">Correct</span></span>
                )}
                {showState && i === selected && i !== q.correct && (
                  <span className="opt-state"><IconX strokeWidth={2} style={{ color: 'var(--error-fg)' }} /><span className="state-label state-label--incorrect">Your answer</span></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showState && (
          <div className="explanation" style={{ marginTop: 'var(--space-5)' }}>
            <div className="why">
              <span className="t-mono-sm" style={{ color: 'var(--success-fg)' }}>Why {keyLabel[q.correct]} is correct</span>
              <p>{q.whyCorrect}</p>
            </div>
            <div className="why">
              <span className="t-mono-sm t-subtle">Why the others are wrong</span>
              <p>{q.whyOthers}</p>
            </div>
          </div>
        )}

        {/* Next */}
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Btn variant="filled" arrow disabled={selected == null || (!timed && !revealed)}
               onClick={goNext}>
            {last ? (timed ? 'Finish exam' : 'See results') : 'Next'}
          </Btn>
        </div>
      </div>
    );
  }

  /* ================= RESULTS ================= */
  function Results({ result, onRetry, onHome, isHistory }) {
    const pct = Math.round((result.correct / result.total) * 100);
    const missed = result.questions
      ? result.questions.map((q, i) => ({ q, i })).filter(({ q, i }) => result.answers[i] !== q.correct)
      : null;
    const keyLabel = ['A', 'B', 'C', 'D'];

    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="page-head" style={{ textAlign: 'center' }}>
          <p className="t-mono page-kicker">{isHistory ? `${result.date} · ${result.mode}` : 'Results · ' + result.mode}</p>
          {result.scaled != null ? (
            <ScoreDial score={result.scaled} pass={result.pass} />
          ) : (
            <div>
              <div className="stat-num t-display" style={{ fontSize: 96 }}>{pct}%</div>
              <p className="t-mono-sm t-subtle" style={{ marginTop: 8 }}>{result.correct} of {result.total} correct</p>
            </div>
          )}
        </div>

        <div className="card" style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <span className="t-mono t-subtle">Per-domain breakdown</span>
          <DomainBars perDomain={result.perDomain} />
        </div>

        {/* Review missed */}
        {missed && missed.length > 0 && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <p className="t-mono t-subtle" style={{ marginBottom: 'var(--space-4)' }}>Review missed questions · {missed.length}</p>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {missed.map(({ q, i }) => (
                <div key={q.id} className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <DomainBadge domain={q.domain} />
                    {q.scenario && <span className="t-mono-sm t-subtle">{q.scenario}</span>}
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 17.5, lineHeight: 1.4, margin: 0, textWrap: 'pretty' }}>{q.stem}</p>
                  <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    {result.answers[i] != null ? (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                        <span className="state-label state-label--incorrect" style={{ flex: 'none' }}>✕ Yours · {keyLabel[result.answers[i]]}</span>
                        <span className="t-muted" style={{ fontSize: 14, fontWeight: 300 }}>{q.options[result.answers[i]]}</span>
                      </div>
                    ) : (
                      <span className="state-label state-label--incorrect">✕ Unanswered (time ran out)</span>
                    )}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span className="state-label state-label--correct" style={{ flex: 'none' }}>✓ Correct · {keyLabel[q.correct]}</span>
                      <span className="t-muted" style={{ fontSize: 14, fontWeight: 300 }}>{q.options[q.correct]}</span>
                    </div>
                  </div>
                  <div className="explanation" style={{ animation: 'none' }}>
                    <div className="why">
                      <span className="t-mono-sm" style={{ color: 'var(--success-fg)' }}>Why {keyLabel[q.correct]} is correct</span>
                      <p>{q.whyCorrect}</p>
                    </div>
                    <div className="why">
                      <span className="t-mono-sm t-subtle">Why the others are wrong</span>
                      <p>{q.whyOthers}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {missed === null && (
          <p className="t-mono-sm t-subtle" style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
            Question-level review is available for attempts taken in this session.
          </p>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-7)', flexWrap: 'wrap' }}>
          <Btn variant="outline" onClick={onHome}>{isHistory ? '← Back to history' : 'Back to home'}</Btn>
          {onRetry && <Btn variant="filled" arrow onClick={onRetry}>Retry this mode</Btn>}
        </div>
      </div>
    );
  }

  return { ModeSelect, QuizRunner, Results };
})();

window.ModeSelect = QZ.ModeSelect;
window.QuizRunner = QZ.QuizRunner;
window.QuizResults = QZ.Results;
