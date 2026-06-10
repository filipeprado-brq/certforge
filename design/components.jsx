// Shared components — Claude Architect Exam Trainer (BRQ DS)
const { useState, useEffect, useRef } = React;

/* ---------- Icons (16px line icons, currentColor) ---------- */
const Icon = ({ d, size = 16, strokeWidth = 1.6, style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor"
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    {d}
  </svg>
);
const IconCheck = (p) => <Icon {...p} d={<path d="M2.5 8.5l3.5 3.5 7-8" />} />;
const IconX = (p) => <Icon {...p} d={<path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />} />;
const IconClock = (p) => <Icon {...p} d={<g><circle cx="8" cy="8" r="6" /><path d="M8 4.5V8l2.5 1.5" /></g>} />;
const IconCards = (p) => <Icon {...p} d={<g><rect x="4.5" y="2.5" width="9" height="11" rx="2" /><path d="M2.5 5v7a2 2 0 0 0 2 2h6" /></g>} />;
const IconArrowR = (p) => <Icon {...p} d={<path d="M2.5 8h11M9.5 4l4 4-4 4" />} />;
const IconFlip = (p) => <Icon {...p} d={<g><path d="M13.5 6.5a6 6 0 0 0-11-2" /><path d="M2.5 1.5v3h3" /><path d="M2.5 9.5a6 6 0 0 0 11 2" /><path d="M13.5 14.5v-3h-3" /></g>} />;
const IconSun = (p) => <Icon {...p} d={<g><circle cx="8" cy="8" r="3" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" /></g>} />;
const IconMoon = (p) => <Icon {...p} d={<path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" />} />;

/* ---------- Domain helpers ---------- */
const domainById = (id) => window.DOMAINS.find((d) => d.id === id);

const DomainBadge = ({ domain, full = false, style }) => {
  const d = typeof domain === 'string' ? domainById(domain) : domain;
  const cls = d.id === 'd5' ? 'domain-badge domain-badge--d5' : 'domain-badge';
  const bg = d.id === 'd5' ? undefined : `var(--${d.id})`;
  return (
    <span className={cls} style={{ background: bg, ...style }}>
      {d.code}<span aria-hidden="true">·</span>{full ? d.name : d.short}
    </span>
  );
};

const WeightChip = ({ domain }) => {
  const d = typeof domain === 'string' ? domainById(domain) : domain;
  return <span className="weight-chip">{d.weight}% of exam</span>;
};

/* ---------- Progress ---------- */
const ProgressBar = ({ value, color, height = 4, label }) => (
  <div className="progress" style={{ height }} role="progressbar" aria-valuenow={Math.round(value)}
       aria-valuemin="0" aria-valuemax="100" aria-label={label || 'progress'}>
    <span style={{ width: `${value}%`, background: color || 'var(--fill)' }}></span>
  </div>
);

/* ---------- Buttons ---------- */
const Btn = ({ variant = 'filled', size, children, arrow, ...rest }) => (
  <button className={`btn btn--${variant}${size ? ` btn--${size}` : ''}`} {...rest}>
    {children}{arrow ? <span className="arrow" aria-hidden="true">→</span> : null}
  </button>
);

/* ---------- Pass / fail chip ---------- */
const PassChip = ({ pass }) => (
  <span className={`pass-chip pass-chip--${pass ? 'pass' : 'fail'}`}>
    {pass ? <IconCheck size={12} strokeWidth={2} /> : <IconX size={12} strokeWidth={2} />}
    {pass ? 'Pass' : 'Fail'}
  </span>
);

/* ---------- Timer ---------- */
const Timer = ({ secondsLeft, totalSeconds }) => {
  const low = secondsLeft <= totalSeconds * 0.2;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return (
    <span className={`timer${low ? ' low' : ''}`} role="timer"
          aria-label={`${m} minutes ${s} seconds remaining`}>
      <span className="dot" aria-hidden="true"></span>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
};

/* ---------- Score dial (scaled 100–1000, pass mark 720) ---------- */
const ScoreDial = ({ score, pass }) => {
  // 240° arc from 150° to 390°
  const pct = (score - 100) / 900;
  const R = 84, CX = 100, CY = 100;
  const a0 = 150, a1 = 390;
  const angle = (deg) => [(CX + R * Math.cos((deg * Math.PI) / 180)), (CY + R * Math.sin((deg * Math.PI) / 180))];
  const arc = (from, to) => {
    const [x0, y0] = angle(from); const [x1, y1] = angle(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  const scoreDeg = a0 + pct * (a1 - a0);
  const passDeg = a0 + ((720 - 100) / 900) * (a1 - a0);
  const [tx0, ty0] = [(CX + (R - 9) * Math.cos((passDeg * Math.PI) / 180)), (CY + (R - 9) * Math.sin((passDeg * Math.PI) / 180))];
  const [tx1, ty1] = [(CX + (R + 9) * Math.cos((passDeg * Math.PI) / 180)), (CY + (R + 9) * Math.sin((passDeg * Math.PI) / 180))];
  return (
    <div style={{ position: 'relative', width: 200, margin: '0 auto' }}>
      <svg viewBox="0 0 200 172" width="200" role="img"
           aria-label={`Scaled score ${score} of 1000. Pass mark 720. Result: ${pass ? 'pass' : 'fail'}.`}>
        <path d={arc(a0, a1)} stroke="var(--hairline)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={arc(a0, Math.max(a0 + 0.5, scoreDeg))} stroke={pass ? 'var(--sem-success)' : 'var(--sem-error)'}
              strokeWidth="8" fill="none" strokeLinecap="round" />
        <line x1={tx0} y1={ty0} x2={tx1} y2={ty1} stroke="var(--fg)" strokeWidth="2" />
      </svg>
      <div style={{ position: 'absolute', inset: '38px 0 auto 0', textAlign: 'center' }}>
        <div className="stat-num" style={{ fontSize: 56 }}>{score}</div>
        <div className="t-mono-sm t-subtle" style={{ marginTop: 6 }}>of 1000 · pass ≥ 720</div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><PassChip pass={pass} /></div>
      </div>
    </div>
  );
};

/* ---------- Per-domain bar chart ---------- */
const DomainBars = ({ perDomain }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
    {window.DOMAINS.filter((d) => perDomain[d.id] != null).map((d) => (
      <div key={d.id} className="bar-chart-row">
        <span className="t-mono-sm t-subtle">{d.code}</span>
        <ProgressBar value={perDomain[d.id]} height={6} label={`${d.name} score`}
                     color={d.id === 'd5' ? 'var(--d5)' : `var(--${d.id})`} />
        <span className="t-mono-sm" style={{ textAlign: 'right' }}>{perDomain[d.id]}% correct</span>
      </div>
    ))}
  </div>
);

/* ---------- Empty state ---------- */
const EmptyState = ({ title, body, action }) => (
  <div className="empty-state">
    <div className="glyph" aria-hidden="true">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 4l14 8v16l-14 8-14-8V12z" /><path d="M8 12l14 8 14-8M22 20v16" />
      </svg>
    </div>
    <h3 className="t-display" style={{ fontSize: 24, margin: 0 }}>{title}</h3>
    <p className="t-muted" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.5, maxWidth: '44ch', margin: '10px auto 0' }}>{body}</p>
    {action ? <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'center' }}>{action}</div> : null}
  </div>
);

/* ---------- Confirm dialog ---------- */
const ConfirmDialog = ({ open, title, body, confirmLabel, danger, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="dialog-scrim" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={title}>
        <h3 className="t-display" style={{ fontSize: 26, margin: 0 }}>{title}</h3>
        <p className="t-muted" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.55, margin: '12px 0 0' }}>{body}</p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
          <Btn variant="ghost" size="sm" onClick={onCancel}>Cancel</Btn>
          <Btn variant={danger ? 'danger-filled' : 'filled'} size="sm" onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
};

/* ---------- App shell ---------- */
const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
];

const AppShell = ({ route, onNav, theme, onToggleTheme, children, hideNav }) => (
  <div className="viewport-clamp">
    <div className="shell">
      <header className="app-header">
        <img className="logo" src={theme === 'dark' ? 'brq/assets/brq-logo-white.png' : 'brq/assets/brq-logo-black.png'} alt="brq" />
        <span className="header-title">Claude Architect · Exam Trainer</span>
        <span className="spacer"></span>
        {!hideNav && (
          <nav className="nav-tabs" aria-label="Main">
            {NAV.map((n) => (
              <button key={n.key} className={`nav-tab${route === n.key ? ' active' : ''}`}
                      aria-current={route === n.key ? 'page' : undefined}
                      onClick={() => onNav(n.key)}>{n.label}</button>
            ))}
          </nav>
        )}
        <button className="icon-btn" onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </header>
      <main>{children}</main>
      <footer className="app-footer">
        <span>© BRQ 2026 · Building what matters</span>
        <span>Claude Certified Architect · Foundations</span>
      </footer>
    </div>
    {!hideNav && (
      <nav className="bottom-nav" aria-label="Main">
        {NAV.map((n) => (
          <button key={n.key} className={`nav-tab${route === n.key ? ' active' : ''}`}
                  aria-current={route === n.key ? 'page' : undefined}
                  onClick={() => onNav(n.key)}>{n.label}</button>
        ))}
      </nav>
    )}
  </div>
);

Object.assign(window, {
  Icon, IconCheck, IconX, IconClock, IconCards, IconArrowR, IconFlip, IconSun, IconMoon,
  domainById, DomainBadge, WeightChip, ProgressBar, Btn, PassChip, Timer, ScoreDial,
  DomainBars, EmptyState, ConfirmDialog, AppShell,
});
