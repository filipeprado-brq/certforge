---
phase: 03-flashcards-spaced-repetition
verified: 2026-06-10T20:20:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
re_verification: false
gaps: []
deferred: []
human_verification:
  - test: "Visual flip animation"
    expected: "Card performs a CSS rotateY(180deg) transition when tapped; front face hides, back face appears with answer text; animation is smooth and .prefers-reduced-motion disables transition"
    why_human: "CSS transition behavior and visual appearance cannot be verified programmatically"
  - test: "Session empty-state after all caught up"
    expected: "When no cards are due (all rated Good recently), the Deck Overview shows 'All caught up' EmptyState with no Start button instead of a 0-due Start CTA"
    why_human: "Requires setting all cards to a future dueAt and verifying EmptyState renders without running the full app"
---

# Phase 3: Flashcards & Spaced Repetition Verification Report

**Phase Goal:** The candidate can run a complete flashcard study session driven by spaced repetition — flip cards, rate recall, and see missed cards resurface sooner while known cards space out, with progress tracked per domain.
**Verified:** 2026-06-10T20:20:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Gate Results

| Gate | Result | Detail |
|------|--------|--------|
| `npm test` | PASS | 81/81 tests pass across 6 test files |
| `npm run typecheck` | PASS | `tsc --noEmit` exits 0 |
| `npm run build` | PASS | `vite build` emits `dist/index.html` (223 kB JS, 20 kB CSS) |

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can flip a flashcard to reveal the concept/answer on the back | VERIFIED | `FlashcardsStudy.tsx:228` — `.flashcard${flipped ? ' flipped' : ''}` applies CSS class; front button `onClick={() => setFlipped(true)}`; `.flashcard.flipped { transform: rotateY(180deg) }` in `app.css:235`; component test asserts `.flashcard.flipped` class present after click |
| 2 | User can rate recall (Again / Good) and the rating changes when that card is next shown | VERIFIED | `FlashcardsStudy.tsx:53-60` — `handleRate(rating)` calls `nextState(srs[cardId], rating, Date.now())` then `rateCard(cardId, updated)`; component test asserts `{rating: 'good', box: 2}` written to `cae-trainer:v1` localStorage |
| 3 | Cards rated "again" resurface in a nearer interval and cards rated "good" space out, per a Leitner/SRS schedule that persists | VERIFIED | `srs.ts`: Again→box1/dueAt=startOfDay(now); Good→box+1(cap5)/dueAt=startOfDay(now)+interval*days; `deckStats.test.ts` ordering guard; `storage.test.ts` round-trip and clearAll tests; 4 storage tests specifically verify SRS persistence |
| 4 | User can start a study session limited to cards due today, optionally filtered to a single domain | VERIFIED | `FlashcardsStudy.tsx:36` — `buildDueQueue(allCards, srs, Date.now(), sessionDomain)` in `startSession()`; domain filter chips wire to `setFilter`; `sessionDomain` is `undefined` (all) or a `DomainId`; `deckStats.test.ts` confirms domain filter in `buildDueQueue` |
| 5 | User can see per-domain flashcard progress (cards learned and due counts) | VERIFIED | Deck Overview renders `{s.learned} / {s.total} learned` and `{s.due} due today` per domain from live `deckStatsByDomain(allCards, srs, now)`; Dashboard shows `{Math.round(pct)}%` and `{s.due} due` per domain with `ProgressBar` driven by SRS state; component test asserts `0 /` and `due today` labels for fresh user |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/srs.ts` | Pure now-injected Leitner scheduler | VERIFIED | 81 lines; exports `Box`, `Rating`, `SrsCard`, `intervalDays`, `startOfDay`, `isDue`, `nextState`; zero `Date.now()` calls inside the module |
| `src/lib/deckStats.ts` | Per-domain stats + due-queue builder | VERIFIED | 90 lines; exports `DomainStat`, `deckStatsByDomain`, `buildDueQueue`, `overallDueCount`; zero `Date.now()` calls inside |
| `src/lib/storage.ts` | `PersistedState.srs` additive field in `cae-trainer:v1` | VERIFIED | `srs: Record<string, SrsCard>` required field with `DEFAULT_STATE.srs = {}`; `schemaVersion` stays 1; `readState` merges defaults |
| `src/lib/useStoredState.ts` | React binding with `rateCard`/`setSrs`/`resetAll` | VERIFIED | Exposes `srs`, `rateCard(id, card)`, `setSrs(next)`, `resetAll()`; `resetAll` calls `clearAll()` + `setSrsState({})` |
| `src/screens/FlashcardsStudy.tsx` | Deck Overview + Study Session | VERIFIED | 292 lines; view-gated (deck/session); flip, Again/Good rating, session progress, done state, domain filter |
| `src/screens/Dashboard.tsx` | Real SRS-derived per-domain mastery | VERIFIED | Imports `deckStatsByDomain`, `useStoredState`; computes `pct = s.total ? (s.learned / s.total) * 100 : 0` from live SRS state; no static `value={0}` |
| `src/App.tsx` | Flashcards route wired to `FlashcardsStudy` | VERIFIED | `route === 'flashcards'` → `<FlashcardsStudy />`; all 5 routes present (home, flashcards, quiz, history, settings) |
| `src/lib/srs.test.ts` | 12 tests covering all 9 acceptance hooks | VERIFIED | All 9 context hooks covered: intervalDays [0,1,3,7,16], unseen→again, unseen→good, box2→good, box5→good(cap), box4→again, isDue(unseen), isDue(dueAt=startOfDay), isDue(future) |
| `src/lib/deckStats.test.ts` | 13 tests including ordering guard | VERIFIED | Fresh-user, learned threshold (box3/box2/box4), due count, rated-good not in queue, rated-again in queue, unseen in queue, domain filter, ordering guard, overallDueCount |
| `src/screens/FlashcardsStudy.test.tsx` | 3 component tests | VERIFIED | Deck Overview renders; flip reveals `.flashcard.flipped`; Good rating persists `{rating:'good', box:2}` to localStorage |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `FlashcardsStudy.tsx` | `srs.ts:nextState` | import + `handleRate` | WIRED | `nextState(srs[cardId], rating, Date.now())` called on every rating |
| `FlashcardsStudy.tsx` | `deckStats.ts:buildDueQueue` | import + `startSession` | WIRED | `buildDueQueue(allCards, srs, Date.now(), sessionDomain)` builds queue on session start |
| `FlashcardsStudy.tsx` | `deckStats.ts:deckStatsByDomain` | import + render | WIRED | `stats = deckStatsByDomain(allCards, srs, now)` drives per-domain learned/due display |
| `FlashcardsStudy.tsx` | `useStoredState:rateCard` | import + `handleRate` | WIRED | `rateCard(cardId, updated)` persists every rating |
| `Dashboard.tsx` | `deckStats.ts:deckStatsByDomain` | import + render | WIRED | `stats = deckStatsByDomain(cards, srs, Date.now())` produces `pct` and `s.due` per domain |
| `Dashboard.tsx` | `useStoredState:srs` | import + destructure | WIRED | `const { srs } = useStoredState()` passed to deckStatsByDomain |
| `App.tsx` | `FlashcardsStudy` | import + route guard | WIRED | `route === 'flashcards'` renders `<FlashcardsStudy />` |
| `useStoredState.ts` | `storage.ts:patchState` | import + `rateCard`/`setSrs` | WIRED | Every rating calls `patchState({ srs: next })` |
| `useStoredState.ts` | `storage.ts:clearAll` | import + `resetAll` | WIRED | `resetAll()` calls `clearAll()` + resets in-memory `srs` to `{}` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `FlashcardsStudy.tsx` | `stats` (learned/due per domain) | `deckStatsByDomain(allCards, srs, now)` → `useStoredState().srs` → `localStorage.getItem('cae-trainer:v1')` | Yes — reads live srs map from localStorage; fresh user gets total due | FLOWING |
| `FlashcardsStudy.tsx` | `queue` (session card order) | `buildDueQueue(allCards, srs, Date.now(), sessionDomain)` from real cards + real srs | Yes — filters by `isDue`, sorts seen-due before unseen | FLOWING |
| `FlashcardsStudy.tsx` | `currentCard` (card being shown) | `allCards.find(c => c.id === queue[pos])` from `getFlashcards()` | Yes — embedded typed dataset | FLOWING |
| `Dashboard.tsx` | `stats`/`pct` (domain mastery) | `deckStatsByDomain(cards, srs, Date.now())` → `useStoredState().srs` | Yes — live SRS state; no static 0 placeholder | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `intervalDays` returns [0,1,3,7,16] | srs.test.ts assertion | PASS — test verified in 81-test run | PASS |
| `nextState(undefined,'again',now)` → box1, dueAt=startOfDay(now) | srs.test.ts | PASS | PASS |
| `nextState(undefined,'good',now)` → box2, dueAt=tomorrow | srs.test.ts | PASS | PASS |
| `nextState({box:5},'good',now)` → stays box5 | srs.test.ts | PASS | PASS |
| `nextState({box:4},'again',now)` → box1, due today | srs.test.ts | PASS | PASS |
| `isDue(undefined,now)` → true | srs.test.ts | PASS | PASS |
| Rated 'good' card NOT in next queue | deckStats.test.ts | PASS | PASS |
| Rated 'again' card IS in next queue | deckStats.test.ts | PASS | PASS |
| Seen-due sorts before unseen (ordering guard) | deckStats.test.ts | PASS | PASS |
| Fresh user: learned=0, due=total per domain | deckStats.test.ts | PASS | PASS |
| SRS round-trips through cae-trainer:v1 | storage.test.ts | PASS | PASS |
| clearAll removes srs | storage.test.ts | PASS | PASS |
| Good rating persists box:2 to localStorage | FlashcardsStudy.test.tsx | PASS | PASS |
| Flip reveals .flashcard.flipped class | FlashcardsStudy.test.tsx | PASS | PASS |
| Date.now() absent inside srs.ts | `grep -c "Date\.now()" src/lib/srs.ts` → 0 | 0 occurrences | PASS |
| Date.now() absent inside deckStats.ts | `grep -c "Date\.now()" src/lib/deckStats.ts` → 0 | 0 occurrences | PASS |
| Scope: no quiz engine symbols in FlashcardsStudy | `grep -E "timer\|secondsLeft\|scaled\|computeResult\|quizMode" FlashcardsStudy.tsx` | Empty — no matches | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FLASH-01 | 03-02 | User can flip through flashcards | SATISFIED | `.flashcard.flipped` CSS class toggled by `setFlipped(true)` on front click; component test verifies |
| FLASH-02 | 03-01, 03-02 | User can rate recall (again/good) to drive scheduling | SATISFIED | `handleRate` calls `nextState`+`rateCard`; `srs.test.ts` covers all rating transitions |
| FLASH-03 | 03-01 | SRS algorithm: missed resurface sooner, known space out | SATISFIED | Leitner intervals [0,1,3,7,16]; Again→box1/due-today; Good→box+1(cap5)/spaced; persisted in `cae-trainer:v1`; reset-all clears |
| FLASH-04 | 03-01, 03-02 | Study session limited to due cards, optional domain filter | SATISFIED | `buildDueQueue(allCards, srs, Date.now(), sessionDomain)` with domain filter chips in Deck Overview |
| FLASH-05 | 03-01, 03-02 | Per-domain flashcard progress (learned + due counts) | SATISFIED | Deck Overview and Dashboard both show live `deckStatsByDomain` derived learned/total/due per domain |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

No TODOs, FIXMEs, placeholders, static empty returns, or hardcoded null/undefined values found in any Phase 3 file. The `pct = 0` guard in Dashboard line 145 and FlashcardsStudy line 221 are correct fallbacks for the empty-total edge case, not stubs — they are overridden by live data when cards exist.

---

### Human Verification Required

#### 1. Visual flip animation

**Test:** Open the app in a browser, navigate to Flashcards, start a session, tap any card.
**Expected:** Card performs a smooth CSS rotateY(180deg) 3D flip; front face slides away; back face (with answer) appears. In reduced-motion mode (OS preference), transition is suppressed.
**Why human:** CSS transition behavior and 3D perspective visual correctness cannot be verified programmatically without a rendering engine.

#### 2. Session empty-state when all cards are caught up

**Test:** After rating all cards "Good" in a session, return to Deck Overview.
**Expected:** "All caught up" EmptyState message appears with body text "No cards are due right now — come back later or pick another domain." The Start Session button should not appear.
**Why human:** Requires a running browser session; the component test suite covers the happy-path, not the fully-spaced state.

---

### Gaps Summary

No gaps. All 5 success criteria and 5 FLASH requirements are fully satisfied. The 2 human verification items are quality/visual checks, not functional blockers.

---

## Summary

Phase 3 goal is achieved. The codebase delivers a complete, end-to-end SRS-driven flashcard study loop:

- **Purity verified:** `srs.ts` and `deckStats.ts` contain zero `Date.now()` calls; all time injection happens at the UI boundary in `FlashcardsStudy.tsx` and `Dashboard.tsx`.
- **Interval contract verified:** [0,1,3,7,16] days for boxes 1-5; Again→box1/due-today; Good→box+1(cap5)/spaced; tests cover all 9 context acceptance hooks.
- **Persistence verified:** `PersistedState.srs` added additively to `cae-trainer:v1`; `schemaVersion` stays 1; `rateCard` merges one card; `resetAll` calls `clearAll()` + resets in-memory `{}`.
- **UI loop verified:** Flip reveals `.flashcard.flipped`; rating row visible after flip; `handleRate` chains `nextState→rateCard→setPos`; session progress counter (N/Total) and remaining count displayed.
- **Due queue ordering locked:** Seen-due cards sort before unseen cards; ordering guard test in `deckStats.test.ts` prevents regression.
- **Dashboard real data verified:** `deckStatsByDomain` with live SRS state drives `pct` and `{s.due} due` — no static placeholder.
- **Scope discipline clean:** No quiz engine symbols (`timer`, `secondsLeft`, `scaled`, `computeResult`, `quizMode`) in any flashcard screen.
- **All 81 tests pass; typecheck 0 errors; build emits `dist/index.html`.**

---

_Verified: 2026-06-10T20:20:00Z_
_Verifier: Claude (gsd-verifier)_
