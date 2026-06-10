# Roadmap: Claude Architect Exam Trainer

**Created:** 2026-06-10
**Granularity:** coarse
**Mode:** mvp (vertical slices — each phase ships an end-to-end user-facing capability)
**Core Value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.

## Phases

- [x] **Phase 1: App Shell & Persistence** - Static React/Vite/TS app that runs, navigates, and remembers progress
- [x] **Phase 2: Exam Content** - Typed, embedded flashcard + question dataset authored from the official guide, browsable in-app (completed 2026-06-10)
- [ ] **Phase 3: Flashcards & Spaced Repetition** - Full SRS-driven flashcard study loop with per-domain progress
- [ ] **Phase 4: Quiz Engine & Modes** - Exam-style quiz engine with all 4 modes, results, and attempt history

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
**Plans:** TBD
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
**Plans:** TBD
**UI hint:** yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Shell & Persistence | 2/2 | Complete | 2026-06-10 |
| 2. Exam Content | 3/3 | Complete   | 2026-06-10 |
| 3. Flashcards & Spaced Repetition | 0/0 | Not started | - |
| 4. Quiz Engine & Modes | 0/0 | Not started | - |

## Coverage

- v1 requirements: 23 total
- Mapped to phases: 23 (100%)
- Orphaned: 0

| Phase | Requirements |
|-------|--------------|
| 1 | APP-01, APP-02, APP-03, APP-04, APP-05 |
| 2 | CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06 |
| 3 | FLASH-01, FLASH-02, FLASH-03, FLASH-04, FLASH-05 |
| 4 | QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07 |

---
*Last updated: 2026-06-10 after Phase 2 planning (02-01, 02-02, 02-03)*
