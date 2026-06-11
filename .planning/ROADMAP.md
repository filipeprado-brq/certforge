# Roadmap: Claude Architect Exam Trainer

**Created:** 2026-06-10
**Granularity:** coarse
**Mode:** mvp (vertical slices — each phase ships an end-to-end user-facing capability)
**Core Value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.

## Phases

<!-- Milestone v1.0 (complete) -->
- [x] **Phase 1: App Shell & Persistence** - Static React/Vite/TS app that runs, navigates, and remembers progress
- [x] **Phase 2: Exam Content** - Typed, embedded flashcard + question dataset authored from the official guide, browsable in-app (completed 2026-06-10)
- [x] **Phase 3: Flashcards & Spaced Repetition** - Full SRS-driven flashcard study loop with per-domain progress (completed 2026-06-10)
- [x] **Phase 4: Quiz Engine & Modes** - Exam-style quiz engine with all 4 modes, results, and attempt history (completed 2026-06-11)

<!-- Milestone v1.1 Content Expansion -->
- [ ] **Phase 5: Flashcard Bank Expansion** - Grow the deck to ~150 weight-proportional cards covering every task statement (1.1-5.6)
- [ ] **Phase 6: Question Bank Expansion** - Grow the bank to ~120 weight-proportional questions with deep scenario pools, code/config snippets, and a green invariants/coverage test suite

## Phase Details

### Phase 1: App Shell & Persistence
**Goal:** A deployable static app that runs end-to-end — the candidate can open it, navigate between Flashcards and Quiz areas, and any state written is remembered across refreshes.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** APP-01, APP-02, APP-03, APP-04, APP-05
**Success Criteria** (what must be TRUE):
  1. User can build the project to static assets and open the resulting build in a browser with no server running
  2. User lands on a home screen and can navigate to a Flashcards area and a Quiz area
  3. State written to localStorage by the app survives a page refresh and browser restart
  4. The app layout is usable at both desktop and mobile browser widths
  5. User can reset all local progress from a control in the UI and see state cleared
**Plans:** 2/2 plans executed
Plans:
- [x] 01-01-PLAN.md — Scaffold Vite+React+TS static build, port BRQ tokens/fonts/assets/CSS, namespaced versioned localStorage layer + domain metadata
- [x] 01-02-PLAN.md — BRQ AppShell + routing + system theming with persisted toggle, Home dashboard, Settings with Reset-all-progress, placeholder screens
**UI hint:** yes

### Phase 2: Exam Content
**Goal:** The candidate has real study material — a typed, structured dataset of flashcards and exam-style questions authored from the official guide, embedded in the build and browsable in the app.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. User can browse flashcards spanning all 5 exam domains, each labeled with its domain
  2. User can browse multiple-choice questions, each with exactly 1 correct answer, 3 distractors, an explanation, and domain/scenario tags
  3. The 12 sample questions from the official guide appear in the bank, tagged to their scenario and domain
  4. Card and question counts per domain visibly track the exam weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
  5. All content loads from a typed, structured source embedded in the build (no network fetch)
**Plans:** 3/3 plans complete
Plans:
- [x] 02-01-PLAN.md — Typed content layer: types + scenarios + loader/selectors + seed port (15 flashcards, 14 questions) + the 12 official sample questions verbatim
- [x] 02-02-PLAN.md — Expand deck + bank to per-domain weight-tracking minimums (50 flashcards, 40 questions)
- [x] 02-03-PLAN.md — Read-only browse catalogs replacing the Flashcards/Quiz placeholders, with domain/scenario filters and visible % of exam
**UI hint:** yes

### Phase 3: Flashcards & Spaced Repetition
**Goal:** The candidate can run a complete flashcard study session driven by spaced repetition — flip cards, rate recall, and see missed cards resurface sooner while known cards space out, with progress tracked per domain.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** FLASH-01, FLASH-02, FLASH-03, FLASH-04, FLASH-05
**Success Criteria** (what must be TRUE):
  1. User can flip a flashcard to reveal the concept/answer on the back
  2. User can rate recall (e.g. again / good) and the rating changes when that card is next shown
  3. Cards rated "again" resurface in a nearer interval and cards rated "good" space out, per a Leitner/SRS schedule that persists
  4. User can start a study session limited to cards due today, optionally filtered to a single domain
  5. User can see per-domain flashcard progress (cards learned and due counts)
**Plans:** 2/2 plans
Plans:
- [x] 03-01-PLAN.md — Pure now-injected Leitner scheduler (srs.ts) + per-domain deckStats + additive SRS persistence in cae-trainer:v1, fully unit-tested against the 03-CONTEXT acceptance hooks (TDD)
- [x] 03-02-PLAN.md — Deck Overview + Study Session study loop (flip, Again/Good rate→persist→advance, due queue, progress) + real per-domain Dashboard progress + Flashcards-route wiring (component-tested)
**UI hint:** yes

### Phase 4: Quiz Engine & Modes
**Goal:** The candidate can take realistic exam-style practice in any of the four quiz modes, get correctness and explanations, and review scored results with a viewable attempt history.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07
**Success Criteria** (what must be TRUE):
  1. User can answer a 4-option question and see correctness plus the explanation after selecting
  2. User can run scenario simulation (4 of the 6 scenarios drawn at random, questions grouped by scenario), per-domain practice (filtered to a chosen domain), timed full-exam (countdown timer with a final scaled score 100–1000 and pass/fail at 720), and free/random (N random questions with explanation after each)
  3. After any quiz, user sees a results summary with score, per-domain breakdown, and a review of missed questions
  4. User can open a history view showing past quiz attempts and their scores
**Plans:** 3/3 plans complete
Plans:
- [x] 04-01-PLAN.md — Pure injected quiz engine (scaledScore/isPass/gradeAttempt/selectQuestions/timer, rng+now injected, no Math.random/Date.now) + additive quizHistory persistence, fully unit-tested vs the 04-CONTEXT acceptance hooks (TDD)
- [x] 04-02-PLAN.md — Port BRQ ScoreDial/DomainBars/PassChip/Timer to TSX + ModeSelect (4 modes/config) + QuizRunner (non-timed reveal+explanation vs timed defer/countdown/auto-submit, scenario banner)
- [x] 04-03-PLAN.md — QuizResults (timed ScoreDial+PassChip / raw %, DomainBars, missed review) + QuizFlow wiring + HistoryScreen (record+view attempts) + Quiz/History route swap + App.test Quiz/History assertion updates
**UI hint:** yes

<!-- Milestone v1.1 Content Expansion -->

### Phase 5: Flashcard Bank Expansion
**Goal:** The candidate has a deeper, exam-weight-balanced flashcard deck — grown from ~50 to ≥150 cards — in which every exam-guide task statement (1.1 through 5.6) is represented by at least one card on its core concept, all flowing through the existing SRS study loop unchanged.
**Mode:** mvp
**Depends on:** Phase 4 (extends the existing typed content layer and SRS loop shipped in v1.0)
**Requirements:** EXP-01, EXP-03
**Success Criteria** (what must be TRUE):
  1. The flashcard deck contains ≥150 cards, with per-domain counts meeting the weight-proportional minimums (D1 ≥40, D2 ≥27, D3 ≥30, D4 ≥30, D5 ≥23), each card domain-tagged
  2. Every exam-guide task statement 1.1–5.6 is covered by at least one flashcard on its core concept (verifiable via task-statement coverage)
  3. All new cards load from the existing typed source embedded in the build (no network fetch) and appear in the SRS study session and the per-domain progress view without code changes to the study loop
  4. The flashcard-related minimums and per-domain assertions in content.test.ts are updated and green for the expanded deck
**Plans:** 3/4 plans executed
Plans:
- [x] 05-01-PLAN.md — Add optional `taskRef` to the Flashcard type; raise content.test.ts to ≥150 + new per-domain mins + add the 30-statement TASK_STATEMENTS coverage gate (RED before authoring)
- [x] 05-02-PLAN.md — Author +27 D1 (f51-f77) and +18 D2 (f78-f95) cards with taskRefs covering all of 1.1-1.7 and 2.1-2.5
- [x] 05-03-PLAN.md — Author +20 D3 (f96-f115) and +20 D4 (f116-f135) cards with taskRefs covering all of 3.1-3.6 and 4.1-4.6
- [ ] 05-04-PLAN.md — Author +15 D5 (f136-f150) cards covering 5.1-5.6, cross ≥150 total, backfill taskRef gaps onto f1-f50, full suite green

### Phase 6: Question Bank Expansion
**Goal:** The candidate has a deeper, exam-realistic question bank — grown from ~40 to ≥120 questions — with strong per-scenario pools, code/config-snippet questions, and harder tradeoff-style distractors, with the full content test suite (new minimums + coverage/scenario assertions + preserved invariants) green.
**Mode:** mvp
**Depends on:** Phase 5 (final dataset state; closes out the cross-cutting content.test.ts invariants for the whole expanded bank)
**Requirements:** EXP-02, EXP-04, EXP-05, EXP-06, EXP-07
**Success Criteria** (what must be TRUE):
  1. The question bank contains ≥120 questions with per-domain counts meeting the weight-proportional minimums (D1 ≥32, D2 ≥22, D3 ≥24, D4 ≥24, D5 ≥18), and the 12 official sample questions are preserved unchanged
  2. Each of the 6 official scenarios has ≥8 scenario-tagged questions, so Scenario Simulation draws from a strong pool for every scenario
  3. At least 15 questions include a code/config snippet (CLAUDE.md, .mcp.json, tool_choice, hooks, CLI -p/--output-format json/--json-schema, JSON Schema)
  4. Every new question is exam-style — exactly 1 correct + 3 plausible distractors — with substantive whyCorrect and whyOthers explanations grounded in the guide
  5. content.test.ts enforces the new minimums plus coverage/scenario assertions while preserving the invariants (official-sample === 12, 4-option shape, unique ids, no network fetch), and typecheck + build + tests are all green
**Plans:** TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Shell & Persistence | 2/2 | Complete | 2026-06-10 |
| 2. Exam Content | 3/3 | Complete   | 2026-06-10 |
| 3. Flashcards & Spaced Repetition | 2/2 | Complete | 2026-06-10 |
| 4. Quiz Engine & Modes | 3/3 | Complete   | 2026-06-11 |
| 5. Flashcard Bank Expansion | 3/4 | In Progress|  |
| 6. Question Bank Expansion | 0/? | Not started | - |

## Coverage

**v1.0** (phases 1–4): 23 requirements, 100% mapped, 0 orphaned.
**v1.1** (phases 5–6): 7 requirements (EXP-01..EXP-07), 100% mapped, 0 orphaned.

| Phase | Requirements |
|-------|--------------|
| 1 | APP-01, APP-02, APP-03, APP-04, APP-05 |
| 2 | CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06 |
| 3 | FLASH-01, FLASH-02, FLASH-03, FLASH-04, FLASH-05 |
| 4 | QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07 |
| 5 | EXP-01, EXP-03 |
| 6 | EXP-02, EXP-04, EXP-05, EXP-06, EXP-07 |

---
*Last updated: 2026-06-11 after planning Phase 5 (4 plans, 4 waves)*
