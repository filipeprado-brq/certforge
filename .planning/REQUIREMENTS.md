# Requirements: Claude Architect Exam Trainer

**Defined:** 2026-06-10
**Core Value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### App Shell & Persistence

- [x] **APP-01**: App is a React + Vite + TypeScript project that builds to static assets deployable on any static host
- [x] **APP-02**: App has a home screen with navigation to Flashcards and Quiz modes
- [x] **APP-03**: All study state (SRS schedule, quiz history, scores) persists in browser localStorage and survives refresh
- [x] **APP-04**: App is responsive and usable on desktop and mobile browser widths
- [x] **APP-05**: User can reset all local progress from the UI

### Content

- [x] **CONT-01**: A flashcard dataset covers concepts across all 5 exam domains, with each card tagged by domain
- [x] **CONT-02**: A multiple-choice question bank covers the 5 domains, each question tagged by domain and (where applicable) scenario
- [x] **CONT-03**: Each question has exactly 1 correct answer, 3 distractors, and an explanation of why the answer is correct and others are wrong
- [x] **CONT-04**: The 12 sample questions from the official guide are included in the question bank, tagged to scenario/domain
- [x] **CONT-05**: Card and question volume per domain roughly tracks the exam weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
- [x] **CONT-06**: Content is stored in a typed, structured format (e.g. TS/JSON) embedded in the app build

### Flashcards (SRS)

- [x] **FLASH-01**: User can flip through flashcards (prompt on front, concept/answer on back)
- [x] **FLASH-02**: User can rate recall on each card (e.g. again / good) to drive scheduling
- [x] **FLASH-03**: Flashcards use a Leitner/SRS algorithm so missed cards resurface sooner and known cards space out
- [x] **FLASH-04**: User can start a study session limited to cards due today, optionally filtered by domain
- [x] **FLASH-05**: User can see flashcard progress (cards learned, due count) per domain

### Quiz Engine & Modes

- [x] **QUIZ-01**: Quiz engine presents a question with 4 options, accepts a selection, and reveals correctness + explanation after answering
- [x] **QUIZ-02**: Scenario simulation mode — 4 scenarios drawn at random from the 6 exam scenarios, with questions grouped by scenario
- [x] **QUIZ-03**: Per-domain practice mode — user picks a domain and answers questions filtered to it
- [x] **QUIZ-04**: Timed full-exam mode — full simulation with a countdown timer and a final scaled score (100–1000, pass mark 720 shown as pass/fail)
- [x] **QUIZ-05**: Free/random mode — user picks N questions drawn at random, with explanation shown after each answer
- [x] **QUIZ-06**: After a quiz, user sees a results summary (score, per-domain breakdown, review of missed questions)
- [x] **QUIZ-07**: Quiz attempt history is recorded and viewable

## v1.1 Requirements — Content Expansion (CURRENT MILESTONE)

The active milestone. Content-only — no new app features. Targets are proportional to exam weights
(D1 27% / D2 18% / D3 20% / D4 20% / D5 15%). Reuses the existing typed content layer (`src/data/*`).

- [x] **EXP-01**: Flashcard bank expanded to ≥150 total, weight-proportional (≥ D1 40, D2 27, D3 30, D4 30, D5 23), each domain-tagged
- [x] **EXP-02**: Question bank expanded to ≥120 total, weight-proportional (≥ D1 32, D2 22, D3 24, D4 24, D5 18); the 12 official sample questions preserved unchanged
- [x] **EXP-03**: Every exam-guide task statement (1.1–5.6) is covered by ≥1 flashcard on its core concept
- [x] **EXP-04**: Each of the 6 official scenarios has ≥8 scenario-tagged questions (strong Scenario Simulation pool)
- [x] **EXP-05**: ≥15 questions include a code/config snippet (CLAUDE.md, .mcp.json, tool_choice, hooks, CLI -p/--output-format json/--json-schema, JSON Schema)
- [x] **EXP-06**: All new questions are exam-style — exactly 1 correct + 3 plausible distractors, with substantive whyCorrect + whyOthers grounded in the guide
- [x] **EXP-07**: content.test.ts updated with the new minimums + coverage/scenario assertions; invariants preserved (official-sample === 12, 4-option shape, unique ids, no network fetch); typecheck + build + tests green

### v1.1 Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| EXP-01 | Phase 5 | Complete |
| EXP-02 | Phase 6 | Complete |
| EXP-03 | Phase 5 | Complete |
| EXP-04 | Phase 6 | Complete |
| EXP-05 | Phase 6 | Complete |
| EXP-06 | Phase 6 | Complete |
| EXP-07 | Phase 6 | Complete |

**v1.1 Coverage:**
- v1.1 requirements: 7 total (EXP-01..EXP-07)
- Mapped to phases: 7 (100%)
- Unmapped: 0

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Management

- **CMS-01**: In-app editor to add/edit flashcards and questions
- **CMS-02**: Import/export content via JSON/CSV

### Sync & Accounts

- **SYNC-01**: Optional backend for user accounts and cross-device progress sync

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Backend / accounts / cross-device sync | Offline-first static app by design; localStorage suffices for v1 |
| Content editor/import UI | Content authored and embedded; deferred to v2 |
| Native mobile app | Responsive web is enough for v1 |
| Multilingual UI/content | English-only to match the real exam |
| Verbatim reproduction of real exam questions | Only the guide's provided samples are used; rest are original, exam-style |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| APP-01 | Phase 1 | Complete |
| APP-02 | Phase 1 | Complete |
| APP-03 | Phase 1 | Complete |
| APP-04 | Phase 1 | Complete |
| APP-05 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 2 | Complete |
| CONT-06 | Phase 2 | Complete |
| FLASH-01 | Phase 3 | Complete |
| FLASH-02 | Phase 3 | Complete |
| FLASH-03 | Phase 3 | Complete |
| FLASH-04 | Phase 3 | Complete |
| FLASH-05 | Phase 3 | Complete |
| QUIZ-01 | Phase 4 | Complete |
| QUIZ-02 | Phase 4 | Complete |
| QUIZ-03 | Phase 4 | Complete |
| QUIZ-04 | Phase 4 | Complete |
| QUIZ-05 | Phase 4 | Complete |
| QUIZ-06 | Phase 4 | Complete |
| QUIZ-07 | Phase 4 | Complete |
| EXP-01 | Phase 5 | Complete |
| EXP-02 | Phase 6 | Complete |
| EXP-03 | Phase 5 | Complete |
| EXP-04 | Phase 6 | Complete |
| EXP-05 | Phase 6 | Complete |
| EXP-06 | Phase 6 | Complete |
| EXP-07 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 23 total — mapped to phases: 23 (100%)
- v1.1 requirements: 7 total — mapped to phases: 7 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-06-10*
*Last updated: 2026-06-11 — v1.1 roadmap created (EXP-01..07 mapped to phases 5–6)*
