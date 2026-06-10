// App — routing, theme, tweaks
const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "timerSpeed": "1\u00d7",
  "preview": "Responsive",
  "newUser": false
}/*EDITMODE-END*/;

const SPEED = { '1\u00d7': 1, '10\u00d7': 10, '60\u00d7': 60 };

function useResolvedTheme(pref) {
  const [sys, setSys] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = (e) => setSys(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return pref === 'system' ? sys : pref;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState('home');
  const [themePref, setThemePref] = useState('system');
  const theme = useResolvedTheme(themePref);

  // Sub-states
  const [studyDomain, setStudyDomain] = useState(null);
  const [studying, setStudying] = useState(false);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [historyDetail, setHistoryDetail] = useState(null);

  // Progress (staged)
  const [resetFlag, setResetFlag] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState([]);
  const fresh = t.newUser || resetFlag;
  const history = useMemo(
    () => [...sessionAttempts, ...(fresh ? [] : window.HISTORY)],
    [sessionAttempts, fresh]
  );

  const nav = (r) => {
    setRoute(r);
    setStudying(false); setQuizConfig(null); setQuizResult(null); setHistoryDetail(null);
    window.scrollTo(0, 0);
  };

  useEffect(() => { window.scrollTo(0, 0); }, [studying, quizConfig, quizResult, historyDetail]);

  const toggleTheme = () => setThemePref(theme === 'dark' ? 'light' : 'dark');

  const startStudy = (domain) => { setStudyDomain(domain || null); setStudying(true); setRoute('flashcards'); };
  const startQuiz = (config) => { setQuizConfig(config); setQuizResult(null); setRoute('quiz'); };

  const finishQuiz = (result) => {
    const attempt = { ...result, id: 'live-' + Date.now() };
    setSessionAttempts((a) => [attempt, ...a]);
    setQuizResult(attempt);
  };

  let screen = null;
  if (route === 'home') {
    screen = <Dashboard domains={window.DOMAINS} history={history} fresh={fresh}
                        onNav={nav} onStartStudy={() => startStudy(null)} onStartQuiz={() => nav('quiz')} />;
  } else if (route === 'flashcards') {
    screen = studying
      ? <StudySession domain={studyDomain} onExit={() => setStudying(false)} />
      : <DeckOverview domains={window.DOMAINS} fresh={fresh} onStart={startStudy} />;
  } else if (route === 'quiz') {
    if (quizResult) {
      screen = <QuizResults result={quizResult}
                            onRetry={() => { const c = quizConfig; setQuizResult(null); setQuizConfig({ ...c }); }}
                            onHome={() => nav('home')} />;
    } else if (quizConfig) {
      screen = <QuizRunner key={'run-' + JSON.stringify(quizConfig) + history.length}
                           config={quizConfig} timerSpeed={SPEED[t.timerSpeed] || 1}
                           onFinish={finishQuiz} onExit={() => setQuizConfig(null)} />;
    } else {
      screen = <ModeSelect onStart={startQuiz} />;
    }
  } else if (route === 'history') {
    screen = historyDetail
      ? <QuizResults result={historyDetail} isHistory onHome={() => setHistoryDetail(null)} />
      : <HistoryScreen history={history} onOpen={setHistoryDetail} onStartQuiz={() => nav('quiz')} />;
  } else if (route === 'settings') {
    screen = <SettingsScreen themePref={themePref} onThemePref={setThemePref}
                             onReset={() => { setResetFlag(true); setSessionAttempts([]); nav('home'); }} />;
  }

  return (
    <div className="app-root" data-theme={theme} data-viewport={t.preview === 'Mobile' ? 'mobile' : 'responsive'}>
      <AppShell route={route} onNav={nav} theme={theme} onToggleTheme={toggleTheme}>
        {screen}
      </AppShell>
      <TweaksPanel>
        <TweakSection label="Demo" />
        <TweakRadio label="Timer speed" value={t.timerSpeed} options={['1\u00d7', '10\u00d7', '60\u00d7']}
                    onChange={(v) => setTweak('timerSpeed', v)} />
        <TweakRadio label="Preview" value={t.preview} options={['Responsive', 'Mobile']}
                    onChange={(v) => setTweak('preview', v)} />
        <TweakToggle label="New user (empty states)" value={t.newUser}
                     onChange={(v) => { setTweak('newUser', v); if (!v) setResetFlag(false); }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
