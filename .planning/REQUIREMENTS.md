# Requirements: Claude Architect Exam Trainer

**Defined:** 2026-06-10
**Core Value:** A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### App Shell & Persistence

- [x] **APP-01**: App is a React + Vite + TypeScript project that builds to static assets deployable on any static host
- [ ] **APP-02**: App has a home screen with navigation to Flashcards and Quiz modes
- [x] **APP-03**: All study state (SRS schedule, quiz history, scores) persists in browser localStorage and survives refresh
- [ ] **APP-04**: App is responsive and usable on desktop and mobile browser widths
- [ ] **APP-05**: User can reset all local progress from the UI

### Content

- [ ] **CONT-01**: A flashcard dataset covers concepts across all 5 exam domains, with each card tagged by domain
- [ ] **CONT-02**: A multiple-choice question bank covers the 5 domains, each question tagged by domain and (where applicable) scenario
- [ ] **CONT-03**: Each question has exactly 1 correct answer, 3 distractors, and an explanation of why the answer is correct and others are wrong
- [ ] **CONT-04**: The 12 sample questions from the official guide are included in the question bank, tagged to scenario/domain
- [ ] **CONT-05**: Card and question volume per domain roughly tracks the exam weights (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%)
- [ ] **CONT-06**: Content is stored in a typed, structured format (e.g. TS/JSON) embedded in the app build

### Flashcards (SRS)

- [ ] **FLASH-01**: User can flip through flashcards (prompt on front, concept/answer on back)
- [ ] **FLASH-02**: User can rate recall on each card (e.g. again / good) to drive scheduling
- [ ] **FLASH-03**: Flashcards use a Leitner/SRS algorithm so missed cards resurface sooner and known cards space out
- [ ] **FLASH-04**: User can start a study session limited to cards due today, optionally filtered by domain
- [ ] **FLASH-05**: User can see flashcard progress (cards learned, due count) per domain

### Quiz Engine & Modes

- [ ] **QUIZ-01**: Quiz engine presents a question with 4 options, accepts a selection, and reveals correctness + explanation after answering
- [ ] **QUIZ-02**: Scenario simulation mode — 4 scenarios drawn at random from the 6 exam scenarios, with questions grouped by scenario
- [ ] **QUIZ-03**: Per-domain practice mode — user picks a domain and answers questions filtered to it
- [ ] **QUIZ-04**: Timed full-exam mode — full simulation with a countdown timer and a final scaled score (100–1000, pass mark 720 shown as pass/fail)
- [ ] **QUIZ-05**: Free/random mode — user picks N questions drawn at random, with explanation shown after each answer
- [ ] **QUIZ-06**: After a quiz, user sees a results summary (score, per-domain breakdown, review of missed questions)
- [ ] **QUIZ-07**: Quiz attempt history is recorded and viewable

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
| APP-02 | Phase 1 | Pending |
| APP-03 | Phase 1 | Complete |
| APP-04 | Phase 1 | Pending |
| APP-05 | Phase 1 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-05 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| FLASH-01 | Phase 3 | Pending |
| FLASH-02 | Phase 3 | Pending |
| FLASH-03 | Phase 3 | Pending |
| FLASH-04 | Phase 3 | Pending |
| FLASH-05 | Phase 3 | Pending |
| QUIZ-01 | Phase 4 | Pending |
| QUIZ-02 | Phase 4 | Pending |
| QUIZ-03 | Phase 4 | Pending |
| QUIZ-04 | Phase 4 | Pending |
| QUIZ-05 | Phase 4 | Pending |
| QUIZ-06 | Phase 4 | Pending |
| QUIZ-07 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-06-10*
*Last updated: 2026-06-10 after roadmap creation*
