---
phase: 01-app-shell-persistence
plan: "02"
subsystem: app-shell
tags: [react, typescript, routing, theming, persistence, tdd, brq-design, components]
dependency_graph:
  requires:
    - 01-01 (Vite scaffold, BRQ CSS, cae-trainer:v1 storage layer, useStoredState, DOMAINS)
  provides:
    - BRQ component library (icons, Btn, ProgressBar, DomainBadge/WeightChip, ConfirmDialog, EmptyState, AppShell)
    - App root with in-app routing across all 5 routes
    - Home dashboard (fresh/new-user state)
    - Settings screen (theme radiogroup + Reset all progress via ConfirmDialog)
    - Placeholder screens for Flashcards, Quiz, History
    - Theme persistence via useStoredState (survives refresh)
    - Reset clears cae-trainer:v1 namespace and returns to Home
  affects:
    - All subsequent phases consume the AppShell + component library
    - Phase 3 (Flashcards) and Phase 4 (Quiz) will replace Placeholder screens
tech_stack:
  added:
    - "@testing-library/react@^14"
    - "@testing-library/user-event@^14"
    - "@testing-library/jest-dom@^6"
  patterns:
    - Named export function App() (not default export) — imported by main.tsx and test
    - useResolvedTheme hook tracks matchMedia('(prefers-color-scheme: dark)') with change listener
    - TDD: test(01-02) RED commit → feat(01-02) GREEN commit
    - All nav items appear in both desktop nav-tabs and mobile bottom-nav (same NAV array)
key_files:
  created:
    - src/components/icons.tsx
    - src/components/Btn.tsx
    - src/components/ProgressBar.tsx
    - src/components/DomainBadge.tsx
    - src/components/ConfirmDialog.tsx
    - src/components/EmptyState.tsx
    - src/components/AppShell.tsx
    - src/screens/Dashboard.tsx
    - src/screens/Settings.tsx
    - src/screens/Placeholder.tsx
    - src/App.tsx
    - src/App.test.tsx
    - src/test-setup.ts
  modified:
    - src/main.tsx (replace bootstrap placeholder with <App />)
    - package.json (add @testing-library/* devDeps)
    - vite.config.ts (add setupFiles: ['./src/test-setup.ts'])
decisions:
  - "App exports named function App() so App.test.tsx can import it directly without default-export gymnastics"
  - "useResolvedTheme tracks system media query via addEventListener('change') so system-theme changes update the resolved theme at runtime"
  - "onToggleTheme flips between explicit 'light'/'dark' based on current resolved theme — pref=system then flip to explicit preserves user intent"
  - "Dashboard renders both an entry-card 'Study flashcards' button AND an EmptyState action with the same label — tests use getAllByText to handle this correctly"
  - "Dashboard uses fresh-state-only layout (all mastery 0, card counts —) since content arrives in Phase 2"
  - "Reset calls resetAll() then setRoute('home') — two state updates that React batches into one render"
metrics:
  duration: "~25 minutes"
  completed: "2026-06-10"
  tasks_completed: 3
  files_changed: 13
---

# Phase 01 Plan 02: App Shell + Interactive Walking Skeleton Summary

**One-liner:** BRQ AppShell + full 5-route in-app navigation with system-default theming, persisted toggle, and confirm-gated reset — all wired to the Plan 01 storage layer.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Port BRQ shared components + AppShell to TSX | 45dc8f6 | Done |
| 2 | Port Home dashboard, Settings, and placeholder screens | 99e3f6f | Done |
| 3 RED | Add failing App tests (TDD red) | 56f832b | Done |
| 3 GREEN | Wire App root — routing, theme, persistence | 4a4070e | Done |

## What Was Built

**Task 1 — BRQ component library:**
- `icons.tsx`: Icon wrapper + 8 typed icon components (IconCheck/X/Clock/Cards/ArrowR/Flip/Sun/Moon), viewBox 16, stroke currentColor, strokeWidth 1.6, aria-hidden
- `Btn.tsx`: variant (filled/outline/ghost/danger/danger-filled), size (sm/lg), optional → arrow; spreads button props
- `ProgressBar.tsx`: role=progressbar with aria-valuenow/min/max, configurable color and height
- `DomainBadge.tsx`: imports Domain from data/domains; d5 uses domain-badge--d5 class; others set background: var(--{id}); includes WeightChip
- `ConfirmDialog.tsx`: role=alertdialog, aria-modal, scrim click-to-cancel, Escape key listener via useEffect
- `EmptyState.tsx`: dashed-border card with isometric cube glyph svg
- `AppShell.tsx`: header (logo swaps brq-logo-black/white by theme, mono title, spacer, desktop nav-tabs with aria-current, theme toggle icon-btn), main, footer (two copy lines), fixed bottom-nav for mobile — both navs from same NAV array

**Task 2 — Screens:**
- `Dashboard.tsx`: page-head (Home kicker), two entry cards (Flashcards with IconCards + Study flashcards CTA / Quiz ink card with IconClock + Take a quiz CTA), per-domain mastery card--flush with row-list mapping DOMAINS (DomainBadge + name + WeightChip + ProgressBar at 0), EmptyState "Start your prep" for new-user
- `Settings.tsx`: page-head, Appearance card with chip-row radiogroup (system/light/dark), About the exam card with DOMAINS list + DomainBadge, Reset all progress card with danger Btn opening ConfirmDialog (title="Reset all progress?", confirmLabel="Yes, reset everything")
- `Placeholder.tsx`: reusable page-head + EmptyState "Coming soon" for Flashcards/Quiz/History routes

**Task 3 — App root wiring:**
- `App.tsx`: Route union type, useResolvedTheme (matchMedia prefers-color-scheme with change listener), useStoredState() for themePref/setThemePref/resetAll, onToggleTheme flips between explicit light/dark, route switch across all 5 screens, `<div className="app-root" data-theme={theme}>` wrapper
- `main.tsx`: now renders `<App />` with CSS imports
- `App.test.tsx`: 7 tests covering default Home route, Flashcards nav + aria-current update, data-theme=light default, theme toggle to dark, theme persistence to cae-trainer:v1, restore on remount, reset clears namespace + returns Home
- 16 total tests pass (9 storage + 7 App); `npm run build` emits dist/index.html

## TDD Gate Compliance

- RED gate: commit `56f832b` — `test(01-02): add failing App tests for navigation, theme, persistence, reset (TDD red)`
- GREEN gate: commit `4a4070e` — `feat(01-02): wire App root — routing, theme resolution, persistence (TDD green)`
- REFACTOR: Not needed — implementation was clean on first pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test query for multiple "Study flashcards" elements**
- **Found during:** Task 3 TDD GREEN (test run)
- **Issue:** Dashboard renders "Study flashcards" twice — once as the entry card Btn and once as the EmptyState action button. `getByText('Study flashcards')` threw "Found multiple elements"
- **Fix:** Changed to `getAllByText('Study flashcards')` and asserted `length >= 1` in both affected tests; reset test used flexible `/reset/i` regex to match the "Reset…" button with its HTML entity
- **Files modified:** `src/App.test.tsx`
- **Commit:** 4a4070e (same GREEN commit)

## Known Stubs

Dashboard card stats show `—` for card counts and `0%` mastery for all domains. These are intentional new-user / fresh-state values, not functional stubs — Phase 2 (Content) will wire real flashcard/question data, and Phases 3/4 will write mastery progress. Navigation and all structural behaviors work end-to-end.

## Threat Flags

No new security surface beyond the plan's threat model.

| Addressed | File | Mitigation |
|-----------|------|------------|
| T-01-05 Destructive action | src/screens/Settings.tsx | Reset gated behind ConfirmDialog (role=alertdialog) with explicit "Yes, reset everything" label — cannot fire on a single accidental click |
| T-01-06 Tampering | src/App.tsx | useResolvedTheme returns 'light' \| 'dark' union only; stored themePref outside the valid union falls back to defaults via Plan 01 readState validation |

## Self-Check: PASSED

- [x] `src/components/AppShell.tsx` exists and contains nav-tabs, bottom-nav, aria-current, brq-logo-white.png, brq-logo-black.png, Claude Architect · Exam Trainer
- [x] `src/components/ConfirmDialog.tsx` exists and contains role="alertdialog", Escape
- [x] `src/components/DomainBadge.tsx` imports from '../data/domains'
- [x] `src/screens/Dashboard.tsx` contains Study flashcards, Take a quiz, onNav('flashcards'), onNav('quiz'), DOMAINS
- [x] `src/screens/Settings.tsx` contains radiogroup, system/light/dark, Yes, reset everything, onReset, DOMAINS
- [x] `src/App.tsx` contains useStoredState, prefers-color-scheme, data-theme=, Route union, resetAll
- [x] `src/main.tsx` contains `<App`
- [x] `node_modules/@testing-library/react` exists
- [x] `npm run typecheck` exits 0
- [x] `npm test` — 16/16 tests pass (9 storage + 7 App)
- [x] `npm run build` exits 0, `dist/index.html` exists
- [x] Commits verified: 45dc8f6, 99e3f6f, 56f832b, 4a4070e
