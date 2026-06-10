# Walking Skeleton — Claude Architect Exam Trainer

**Phase:** 1
**Generated:** 2026-06-10

## Capability Proven End-to-End

A candidate can open the built static app, navigate between Home, Flashcards, Quiz, History, and Settings, toggle the theme, and have that theme preference (plus any namespaced study state) survive a full page refresh — all served from a static build with no server running.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite 5 + TypeScript (`@vitejs/plugin-react`, template `react-ts`) | Mandated by PROJECT.md constraints; Vite produces a static `dist/` deployable on any static host (APP-01) |
| Build output | Static assets via `vite build` → `dist/` with `base: './'` (relative paths) | App must open from `file://` / any static host with no server runtime |
| Persistence | Browser `localStorage`, single namespaced+versioned key `cae-trainer:v1` holding a JSON blob `{ schemaVersion: 1, theme, ... }` | No backend by design (APP-03); one key keeps reset trivial (clear the namespace) |
| Theme | `data-theme="light\|dark"` on `.app-root`; preference `system\|light\|dark` resolved against `prefers-color-scheme`; default `system` | Matches UI-SPEC `useResolvedTheme`; BRQ paper/ink themes already keyed off `[data-theme]` in `app.css` |
| Routing | In-memory route state (`'home'\|'flashcards'\|'quiz'\|'history'\|'settings'`) in `App` state, switched by AppShell nav — NOT react-router | Prototype `app.jsx` uses a single `route` state string; no URL/deep-link requirement in v1; avoids an extra dependency |
| Styling | Hand-rolled CSS on BRQ tokens (NOT shadcn, NOT CSS-in-JS). Port `design/brq/colors_and_type.css` + `design/app.css` verbatim into `src/styles/` | UI-SPEC Registry Safety: first-party CSS only; design is approved and authoritative |
| Directory layout | `src/` with `components/` (AppShell, Btn, ConfirmDialog, EmptyState, DomainBadge, WeightChip, ProgressBar, icons), `screens/` (Dashboard, Settings + Flashcards/Quiz/History placeholders), `lib/` (storage), `styles/`, `data/` (domains), `public/` (fonts + brand assets) | Vertical-slice friendly; later phases add `screens/` + `lib/` modules without touching the shell |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite + React + TS, ESLint, `tsc` typecheck, `vite build`)
- [x] Routing — five real in-app routes reachable via nav (Home/Flashcards/Quiz/History/Settings)
- [x] Persistence — one real `localStorage` read AND one real write through `cae-trainer:v1` (theme preference is the proven read/write; reset proves namespace clear)
- [x] UI — interactive theme toggle + reset-with-confirm wired to the storage layer; Home dashboard renders BRQ-styled content
- [x] Deployment — `vite build` emits a static `dist/index.html` openable with no server; `npm run dev` documented for local full-stack run

## Out of Scope (Deferred to Later Slices)

Explicit — prevents later phases re-litigating Phase 1 minimalism:

- Flashcard SRS engine, deck overview, flip/rating UI — **Phase 3**
- Quiz engine, all 4 quiz modes, ScoreDial, Timer, results, history detail — **Phase 4**
- The typed flashcard/question content dataset — **Phase 2** (Phase 1 ships only the 5-domain metadata needed by the dashboard + settings)
- Flashcards / Quiz / History route bodies are **placeholder screens** in Phase 1 (navigation works end-to-end; the screens get real bodies in Phases 3 & 4)
- URL-based routing / deep links — not required for v1
- Seeded demo history and mastery numbers (prototype `data.jsx` HISTORY) — Phase 1 ships the new-user (fresh/empty) state only; real progress arrives once Phases 3/4 write it

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without changing its architectural decisions (storage key, theme model, directory layout, static-build contract):

- **Phase 2:** Embed the typed flashcard + question dataset; make Flashcards/Quiz placeholder screens browse real content.
- **Phase 3:** Replace the Flashcards placeholder with the SRS study loop; persist the schedule under the `cae-trainer:v1` namespace.
- **Phase 4:** Replace the Quiz + History placeholders with the quiz engine, four modes, results, and persisted attempt history.
