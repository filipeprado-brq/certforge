# Phase 3: Flashcards & Spaced Repetition - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning
**Source:** Orchestrator-defined SRS contract grounded in the design handoff + existing code

<domain>
## Phase Boundary

Turn the read-only flashcard catalog (Phase 2) into a **study loop driven by spaced repetition**:
flip a card, rate recall (Again / Good), and have the schedule resurface missed cards sooner and
space out known cards — persisted across sessions, with per-domain progress. Reuse the existing
data layer (`src/data/content.ts`, `flashcards.ts`, `domains.ts`), the BRQ flashcard styles already
ported in `src/styles/app.css` (`.flashcard`, `.face--front/back`, `.rating-row`, flip transform),
and the persistence layer (`src/lib/storage.ts`, `useStoredState`).

In scope: a pure, unit-testable Leitner scheduler; persisted per-card SRS state in the
`cae-trainer:v1` namespace; a Deck Overview (per-domain learned/due counts + start session, domain
filter); a Study Session (due queue, flip reveal, Again/Good rating that updates the schedule,
session progress + remaining count); per-domain progress surfaced on the Dashboard.

Out of scope: the quiz engine / modes / scoring / history (Phase 4); editing content (v2). The
existing `FlashcardsBrowse` catalog from Phase 2 may be folded into the Deck Overview or kept as a
"browse all" view — planner's discretion — but the **study loop** is the deliverable.
</domain>

<decisions>
## Implementation Decisions

### Leitner scheduler (FLASH-02, FLASH-03) — pure, deterministic, unit-testable
- **5 boxes** (1..5). New/unseen cards start effectively at box 1 and are **due immediately**.
- Rating transitions:
  - **Again** → reset to **box 1** (resurface soon).
  - **Good** → **box + 1**, capped at box 5 (space out).
- **Intervals by box, in days:** box1 = 0 (same day / immediately), box2 = 1, box3 = 3, box4 = 7, box5 = 16.
- **Due rule:** a card is due when `now >= dueAt`. On rating, set `dueAt = startOfDay(now) + interval(newBox) days` and record `lastRated` + `box`.
- **Determinism for tests:** put the scheduler in a pure module `src/lib/srs.ts` whose functions take
  an injected `now` (epoch ms or a day-index) — e.g. `nextState(prev, rating, now)`, `isDue(card, now)`,
  `intervalDays(box)`. Do NOT call `Date.now()` inside pure logic; the UI passes `Date.now()` in.
  This lets unit tests assert "Again→box1, due today" and "Good→box+1, due later" without real time.

### Persistence (FLASH-03) — extend the existing namespace additively
- Extend `PersistedState` in `src/lib/storage.ts` with an additive field:
  `srs: Record<string, SrsCard>` where key = flashcard `id` and
  `SrsCard = { box: 1|2|3|4|5; dueAt: number /*epoch ms*/; lastRated: number; rating: 'again'|'good' }`.
  Keep `schemaVersion` = 1 (additive, backward-compatible — `readState` already merges defaults; default `srs` to `{}`).
- Use `patchState({ srs: ... })` / `useStoredState` to persist. Reset-all (Phase 1) already clears the
  whole namespace, so it wipes SRS too — no extra work, but verify it still returns to a clean state.

### Study session (FLASH-01, FLASH-04)
- Build the **due queue**: all flashcards whose `isDue(card, now)` is true (unseen = due), optionally
  filtered to one domain. Order: due-soonest first, then unseen; stable.
- Present one card at a time: front (prompt/term) + DomainBadge → **flip** (reuse `.flashcard.flipped`
  rotateY + `prefers-reduced-motion` already in CSS) → back (concept/answer) → **rating row**
  (Again / Good buttons, the `.rating-row` grid). On rate: compute `nextState`, persist, advance.
- Show **session progress** (e.g. "4 / 18") and **remaining due** count. When the queue empties, show a
  done state with a summary and a way back to Deck/Home.
- Reference layout: `design/screens-flashcards.jsx` (`StudySession` + `DeckOverview`) — port the
  interaction, not the CDN runtime.

### Deck Overview + per-domain progress (FLASH-04, FLASH-05)
- Deck Overview: per-domain rows showing **cards learned** and **cards due today**, total, a domain
  filter, and a "Start session" CTA (respects due + selected domain). "Learned" = cards at **box ≥ 3**
  (seen and spaced at least twice); "due" = `isDue` count. New users: all cards unseen → 0 learned,
  all due.
- Dashboard: replace the static `mastery` placeholder with **real** per-domain progress derived from
  SRS state (learned / total, due count). Keep the BRQ visuals (DomainBadge, ProgressBar, WeightChip).
- A pure `src/lib/deckStats.ts` (or selectors in srs.ts) computes per-domain {total, learned, due}
  from the flashcard list + SRS state + now — unit-testable.

### Wiring
- Replace/augment the Phase-2 `FlashcardsBrowse` route so the Flashcards area leads with Deck Overview
  → Start Session → Study Session. Navigation must stay end-to-end across all 5 routes. Quiz/History
  routes unchanged (Quiz browse from Phase 2 stays; History still placeholder).
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code (reuse — do not duplicate)
- `src/lib/storage.ts` — `PersistedState`, `readState/writeState/patchState/clearAll` (extend additively with `srs`).
- `src/lib/useStoredState.ts` — React persistence hook.
- `src/data/content.ts`, `src/data/flashcards.ts`, `src/data/domains.ts` — flashcards + DOMAINS + selectors.
- `src/styles/app.css` — `.flashcard`, `.face--front/--back`, `.rating-row`, `.flashcard.flipped`, `.card`, `.filter-chip`, `ProgressBar`/`DomainBadge`/`WeightChip` classes.
- `src/components/*` — DomainBadge, ProgressBar, Btn, EmptyState (reuse).
- `src/screens/Dashboard.tsx` — currently shows static mastery; wire to real SRS-derived progress.

### Design contract & layout reference
- `.planning/phases/01-app-shell-persistence/01-UI-SPEC.md` — BRQ contract (covers StudySession/flip/rating; no new UI-SPEC needed).
- `design/screens-flashcards.jsx` — DeckOverview + StudySession reference layouts (flip, Again/Good, progress).
- `design/app.jsx` — staged study state reference (`startStudy`, `studyDomain`, session flow).
</canonical_refs>

<specifics>
## Verifiable acceptance hooks (for plan/test design)

- `intervalDays(box)` returns [0,1,3,7,16] for boxes [1,2,3,4,5].
- `nextState(unseen, 'again', now)` → box 1, dueAt = startOfDay(now) (due today).
- `nextState(unseen, 'good', now)` → box 2, dueAt = startOfDay(now)+1d (not due today).
- `nextState({box:2}, 'good', now)` → box 3; `nextState({box:5}, 'good', now)` → stays box 5.
- `nextState({box:4}, 'again', now)` → box 1 (reset), due today.
- `isDue(card, now)` true for unseen and for `now >= dueAt`; false otherwise.
- Per-domain stats: a freshly-reset user shows learned=0 and due=total for every domain.
- A rated 'good' card is NOT in the next due queue for the same `now` (it spaced out); a rated 'again' card IS.
- SRS state round-trips through `cae-trainer:v1`; reset-all clears it.
</specifics>

<deferred>
## Deferred Ideas
- Quiz engine, modes, timer, scoring (100–1000 / pass 720), results, attempt history → Phase 4.
- Advanced SRS (SM-2 ease factors, lapses, custom intervals) → not now; Leitner is sufficient for v1.
- Editing/authoring content → v2 (CMS).
</deferred>

---

*Phase: 03-flashcards-spaced-repetition*
*Context gathered: 2026-06-10 (orchestrator-defined SRS contract)*
