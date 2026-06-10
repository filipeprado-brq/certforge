---
phase: 1
slug: app-shell-persistence
status: draft
shadcn_initialized: false
preset: none
created: 2026-06-10
source: Claude Design handoff (BRQ Design System) — see design/ at repo root
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Claude Architect Exam Trainer. Grounded in a concrete
> Claude Design handoff that uses the **BRQ Design System**. The full prototype (HTML/CSS/JSX),
> brand tokens, fonts, and assets live in `design/` at the repo root and are the **authoritative
> visual reference** — recreate them faithfully in React + Vite + TS. This SPEC covers the whole
> app's design language; Phase 1 implements the foundation (shell, theming, persistence, home,
> settings). Flashcard and quiz screens are specified here too so later phases (3, 4) inherit the
> same contract.

---

## Source of Truth

| Artifact | Path | Role |
|----------|------|------|
| Brand tokens + fonts | `design/brq/colors_and_type.css`, `design/brq/fonts/` | BRQ primitives, type scale, fonts (Aspekta / Inter / Geist Mono) |
| Product tokens + components CSS | `design/app.css` | Themes (paper/ink), domain accents, all component styles |
| Shared components | `design/components.jsx` | AppShell, DomainBadge, ProgressBar, Btn, Timer, ScoreDial, ConfirmDialog, EmptyState, icons |
| Screens | `design/screens-home.jsx`, `screens-flashcards.jsx`, `screens-quiz.jsx` | Reference layouts for all 8 screens |
| App wiring | `design/app.jsx` | Routing, theme resolution, staged state |
| Sample content | `design/data.jsx` | 5 domains, 6 scenarios, 15 flashcards, 14 questions, seeded history (feeds Phase 2) |
| Brand assets | `design/brq/assets/` | `brq-logo-black/white.png`, `iso-grid-pattern.svg`, iso graphics |
| Design intent | `design/DESIGN-CHAT.md`, `design/HANDOFF-README.md` | Decisions locked during design |

**Implementation note:** the prototype loads React via CDN + Babel-in-browser. The real app is
React + Vite + TS. Port the visual output (CSS + component structure), not the prototype's runtime.
Copy `brq/colors_and_type.css`, `app.css`, the fonts, and the brand assets into the app's source.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-rolled CSS on BRQ tokens — **not** shadcn) |
| Preset | BRQ Design System ("Building what matters" — editorial, monochromatic) |
| Component library | none (custom components in `design/components.jsx`) |
| Icon library | custom 16px line icons (`Icon` + `IconCheck/X/Clock/Cards/ArrowR/Flip/Sun/Moon`), `currentColor`, stroke 1.6 |
| Font | Aspekta 450 (display/titles), Inter 300–500 (body), Geist Mono 600 (labels/mono, ALL CAPS) |

**BRQ rules that bind every screen:** start from paper/ink (off-white `#EFEFEF` / black `#000`); one
accent per surface; titles in Aspekta sentence-case left-aligned; tags & buttons are Geist Mono
UPPERCASE pills; hairlines over boxes/shadows; rounded corners everywhere (cards ≥ 28px, pills 999px);
generous whitespace.

---

## Spacing Scale

From `--space-*` in `design/brq/colors_and_type.css` (4px base). All multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Icon gaps, inline padding |
| space-2 | 8px | Compact element spacing, chip rows |
| space-3 | 12px | Tight gaps, button clusters |
| space-4 | 16px | Default element spacing |
| space-5 | 24px | Card padding, section gaps |
| space-6 | 32px | Card padding (large), shell horizontal padding |
| space-7 | 48px | Header→content gap, page-head margin |
| space-8 | 64px | Empty-state padding |
| space-9 | 96px | Shell bottom padding, footer top margin |
| space-10 | 128px | Page-level spacing |

Exceptions: button/chip internal paddings use exact px from `app.css` (e.g. `13px 26px` filled btn, `5px 12px` domain badge) — keep verbatim.

---

## Typography

Product scale (smaller than the slide scale). Tokens in `colors_and_type.css`; helpers `.t-display`, `.t-mono`, `.brq-body` in CSS.

| Role | Family | Size | Weight | Line Height | Notes |
|------|--------|------|--------|-------------|-------|
| Display / Page title | Aspekta | clamp(34→48px) | 450 | 1.0 | sentence case, left, tracking −0.02em |
| Heading (card title) | Aspekta | 24–28px | 450 | 1.1 | never ALL CAPS |
| Body | Inter | 16–18px | 300 (light) | 1.5 | max ~52ch column |
| Body medium | Inter | 16–18px | 500 | 1.5 | emphasis |
| Label / Mono | Geist Mono | 11–16px | 600 | 1.2 | ALWAYS UPPERCASE, tracking +0.04em |
| Stat number | Aspekta | up to 56px | 450 | 1.0 | tabular-nums |

---

## Color

Two themes via `[data-theme]` on `.app-root`. Theme follows system preference by default, with a header/settings toggle (`useResolvedTheme`).

| Role | Light (paper) | Dark (ink) | Usage |
|------|---------------|------------|-------|
| Dominant (60%) | `--bg` #EFEFEF | #000000 | App background |
| Secondary (30%) | `--surface` #FFFFFF / `--surface-2` #F5F5F5 | #1A1A1A / #2A2A2A | Cards, raised surfaces, nav pills |
| Foreground | `--fg` #000 / muted #4A4A4A / subtle #808080 | #FFF / #B8B8B8 / #808080 | Text hierarchy |
| Hairline | rgba(0,0,0,0.14) | rgba(255,255,255,0.18) | Signature dividers/borders |
| Primary action fill | #000 (`--fill`) | #FFF | Buttons, active nav tab |
| Destructive | #C2402D (`--sem-error`) | #D9604A | Reset / fail only |
| Success | #1DA669 (`--brq-verde`) | #4FC68A | Correct answers, pass |

**Product accent rule:** the product's only "accent" is **black/ink** (the fill). Color is reserved
exclusively for **domain badges** and **quiz semantics**. Never colorize generic interactive elements.

### Domain colors (5 domains = 4 BRQ accents + ink)

| Domain | Token | Light | Dark | AA text color |
|--------|-------|-------|------|---------------|
| D1 Agentic Architecture & Orchestration (27%) | `--d1` | #460E78 roxo | #7A3AB3 | `--d1-fg` |
| D2 Tool Design & MCP Integration (18%) | `--d2` | #5A85CB azul | #8AA8DC | #3D69B5 / azul-400 |
| D3 Claude Code Configuration & Workflows (20%) | `--d3` | #1DA669 verde | (verde) | #157A4E / verde-400 |
| D4 Prompt Engineering & Structured Output (20%) | `--d4` | #EE7C38 laranja | (laranja) | #C25A1B / laranja-400 |
| D5 Context Management & Reliability (15%) | `--d5` | #000 ink | #FFF | ink / white |

Domain badge background uses the domain color with white text (D5 uses ink badge, outlined in dark theme).

---

## Component Inventory (port from `design/components.jsx` + `app.css`)

**Phase 1 (build now):**
- `AppShell` — top header (brq® logo that swaps black/white by theme, mono title, desktop nav-tabs pills, theme toggle icon-btn), `<main>`, footer (mono, hairline). Mobile: `bottom-nav` fixed bar (≤860px), header title hidden ≤600px.
- Nav tabs: Home, Flashcards, Quiz, History, Settings — active tab = filled pill; `aria-current="page"`.
- Theme toggle: `IconSun`/`IconMoon`, 36px pill icon-btn; toggles paper↔ink; default = system.
- `Btn` variants: filled / outline / ghost / danger / danger-filled, sizes sm/lg, optional `→` arrow.
- `ConfirmDialog` — alertdialog, scrim, Esc to close, used for "Reset all progress" (danger).
- `EmptyState` — dashed-border card, glyph, title + body + action (new-user dashboard).
- `Dashboard` (home) — "Today" summary (cards due, last quiz score), two entry cards (Study Flashcards / Take a Quiz), per-domain mastery overview (5 rows: DomainBadge + WeightChip + ProgressBar). New-user empty state.
- `SettingsScreen` — theme preference control + destructive "Reset all progress" with ConfirmDialog.
- Shared primitives also used now: `DomainBadge`, `WeightChip`, `ProgressBar`, hairline, `.card`, focus-visible outline (2px solid `--fg`).

**Phases 3 & 4 (spec'd here, built later) — keep the contract:**
- `DeckOverview`, `StudySession` (3D flip card, `Again`/`Good` rating row) — Phase 3.
- `ModeSelect`, `QuizRunner`, `QuizOption` (default/selected/correct/incorrect/dimmed), `ExplanationPanel`, `ScenarioBanner`, `Timer`, `ScoreDial` (240° arc, 720 pass mark line), `DomainBars`, `PassChip`, `HistoryScreen`/`attempt-row`, `QuizResults` — Phase 4.

---

## Screen Map (8 screens → phases)

| Screen | Phase | Reference |
|--------|-------|-----------|
| Home / Dashboard | 1 | `screens-home.jsx` → Dashboard |
| Settings (theme + reset) | 1 | `screens-home.jsx` → SettingsScreen |
| Flashcards — Deck Overview | 3 | `screens-flashcards.jsx` → DeckOverview |
| Flashcards — Study Session (flip + Again/Good) | 3 | `screens-flashcards.jsx` → StudySession |
| Quiz — Mode Select | 4 | `screens-quiz.jsx` → ModeSelect |
| Quiz — Question (answered states + explanation) | 4 | `screens-quiz.jsx` → QuizRunner/QuizOption |
| Quiz — Results (ScoreDial vs 720, DomainBars, review) | 4 | `screens-quiz.jsx` → QuizResults |
| History (attempt list → drill-in) | 4 | `screens-home.jsx` → HistoryScreen |

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| App title (header) | `Claude Architect · Exam Trainer` |
| Footer | `© BRQ 2026 · Building what matters` · `Claude Certified Architect · Foundations` |
| Primary CTA (home) | `Study flashcards` / `Take a quiz` |
| Empty state heading (new user) | `Start your prep` |
| Empty state body | `No study history yet. Begin with a flashcard session or take a practice quiz to see your per-domain progress build here.` |
| Reset confirmation | `Reset all progress`: `This clears your SRS schedule, quiz history, and scores on this device. This cannot be undone.` (confirm label: `Reset everything`) |
| Pass/fail | `Pass` ≥ 720 / `Fail` < 720 (scaled 100–1000) |

---

## Persistence (Phase 1 functional contract)

- All study state (SRS schedule, quiz attempts, scores, theme preference) persists in **localStorage**; survives refresh and restart. (Prototype uses staged in-memory state — the real app must persist.)
- A namespaced storage key (e.g. `cae-trainer:v1`) with a versioned schema.
- Settings "Reset all progress" clears the namespace and returns to a clean/new-user state.
- App must render correctly on first run (no stored state) — show new-user empty states.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none (no shadcn / no third-party registry) | — | not required |

All components are first-party CSS on BRQ tokens. No external component registry is introduced.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
