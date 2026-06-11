// =============================================================================
// Quiz mode metadata — 4 modes with names, descriptions, and meta strings
// Copied from design/data.jsx with corrected timed meta (real 600s / 10 min)
// =============================================================================

export interface QuizModeMeta {
  key: 'scenario' | 'domain' | 'timed' | 'free'
  name: string
  desc: string
  meta: string
}

export const QUIZ_MODES: QuizModeMeta[] = [
  {
    key: 'scenario',
    name: 'Scenario Simulation',
    desc: '4 scenarios drawn from the 6 official ones — questions grouped by scenario, the way the real exam frames them.',
    meta: '4 of 6 scenarios · grouped questions',
  },
  {
    key: 'domain',
    name: 'Domain Practice',
    desc: 'Drill a single exam domain. Pick one of the five and work through its question pool.',
    meta: 'Pick 1 of 5 domains',
  },
  {
    key: 'timed',
    name: 'Timed Full Exam',
    desc: 'Exam conditions: countdown timer, no feedback until the end, final scaled score 100–1000 against the 720 pass mark.',
    meta: '10 min · 10 questions · scored 100–1000',
  },
  {
    key: 'free',
    name: 'Free Practice',
    desc: 'Random questions across all domains, with the explanation revealed after every answer.',
    meta: 'Pick 5–15 questions',
  },
]
