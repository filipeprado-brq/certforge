---
phase: 01-app-shell-persistence
plan: "01"
subsystem: app-shell
tags: [scaffold, vite, react, typescript, brq-design, css, localstorage, persistence, tdd]
dependency_graph:
  requires: []
  provides:
    - Vite + React + TS static build pipeline (base './')
    - BRQ Design System tokens, fonts, brand assets ported to src/styles + public/brq
    - cae-trainer:v1 namespaced localStorage persistence contract
    - useStoredState React hook
    - DOMAINS typed metadata with exam weights
  affects:
    - All subsequent plans (01-02, Phase 2, Phase 3, Phase 4) depend on this foundation
tech_stack:
  added:
    - react@^18
    - react-dom@^18
    - vite@^5
    - "@vitejs/plugin-react@^4"
    - typescript@^5
    - vitest@^1
    - jsdom@^24
  patterns:
    - Static build with relative base ('./')
    - Hand-rolled CSS on BRQ design tokens (no shadcn)
    - Namespaced versioned localStorage (cae-trainer:v1)
    - TDD for persistence layer (vitest + jsdom)
key_files:
  created:
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - index.html
    - src/main.tsx
    - src/vite-env.d.ts
    - .gitignore
    - src/styles/brq-tokens.css
    - src/styles/app.css
    - src/lib/storage.ts
    - src/lib/storage.test.ts
    - src/lib/useStoredState.ts
    - src/data/domains.ts
    - public/brq/fonts/Aspekta-450.ttf
    - public/brq/fonts/Inter-Regular.ttf
    - public/brq/fonts/GeistMono-Regular.ttf
    - public/brq/fonts/GeistMono-SemiBold.ttf
    - public/brq/assets/brq-logo-black.png
    - public/brq/assets/brq-logo-white.png
    - public/brq/assets/iso-grid-pattern.svg
    - public/brq/assets/iso-cubes-stack.svg
    - public/brq/assets/iso-stairs.svg
  modified: []
decisions:
  - "tsconfig.json uses project references (tsconfig.app.json + tsconfig.node.json) with composite:true to support tsc -b build mode"
  - "vite.config.ts uses /// <reference types='vitest' /> to expose test config types without TS error under tsc -b"
  - "storage.ts exposes DEFAULT_STATE as module-internal const; useStoredState.ts defines its own reset defaults to avoid unused imports under noUnusedLocals"
  - "BRQ design CSS ported verbatim — only @font-face src URLs and iso-texture background-image URL updated to /brq/* (Vite public root)"
metrics:
  duration: "~15 minutes"
  completed: "2026-06-10"
  tasks_completed: 3
  files_changed: 24
---

# Phase 01 Plan 01: App Shell & Persistence Foundation Summary

**One-liner:** Vite + React + TS static scaffold with BRQ Design System CSS ported from design/ and a versioned localStorage layer (cae-trainer:v1) exposed via useStoredState hook.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Scaffold Vite + React + TypeScript static-build project | 338f2a0 | Done |
| 2 | Port BRQ foundations (tokens, fonts, brand assets, component CSS) | 8b06a36 | Done |
| 3 RED | Add failing storage tests (TDD red phase) | 6264f45 | Done |
| 3 GREEN | Implement persistence + domain metadata (TDD green) | fa09326 | Done |

## What Was Built

**Task 1 — Vite scaffold:**
- `package.json` with React 18, Vite 5, TypeScript 5, Vitest 1, jsdom 24
- `vite.config.ts` with `base: './'`, `test: { environment: 'jsdom', globals: true }`
- `tsconfig.json` with project references → `tsconfig.app.json` (ES2020, bundler, strict) + `tsconfig.node.json` (composite)
- `index.html` → `src/main.tsx` module entry
- `npm run build` emits `dist/index.html` with relative asset paths

**Task 2 — BRQ Design System:**
- Copied 4 font files + 5 brand assets to `public/brq/`; they bundle to `dist/brq/`
- `src/styles/brq-tokens.css`: all CSS variables (--brq-roxo, --space-*, radii, type scale, @font-face rules with `/brq/fonts/` URLs)
- `src/styles/app.css`: paper/ink themes via `[data-theme]`, domain accent vars (--d1..--d5), all component classes (shell, nav-tab, bottom-nav, btn variants, domain-badge, progress, dialog, empty-state, flashcard, quiz-option, etc.), responsive 600px + 860px breakpoints for APP-04

**Task 3 — Persistence + domain metadata (TDD):**
- `src/lib/storage.ts`: STORAGE_KEY='cae-trainer:v1', SCHEMA_VERSION=1, readState/writeState/patchState/clearAll with try/catch (T-01-01 + T-01-02 mitigations)
- `src/lib/useStoredState.ts`: React hook holding `themePref` in useState, initialized from readState()
- `src/data/domains.ts`: 5 domains (d1-d5), weights 27+18+20+20+15=100
- `src/lib/storage.test.ts`: 9 vitest tests — all passing (round-trip, patch, clear, first-run, corruption, version mismatch)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] vite.config.ts needs vitest type reference for tsc -b**
- **Found during:** Task 1 build verification
- **Issue:** `tsc -b && vite build` failed with "Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'" — the `test` block in vite.config.ts is a vitest augmentation not recognized by base Vite types under `tsc -b` mode
- **Fix:** Added `/// <reference types="vitest" />` triple-slash directive at top of `vite.config.ts`
- **Files modified:** `vite.config.ts`
- **Commit:** 338f2a0

**2. [Rule 3 - Blocking] tsconfig.json needed tsconfig.app.json in addition to tsconfig.node.json**
- **Found during:** Task 1 scaffold
- **Issue:** Standard Vite react-ts template uses two references — tsconfig.node.json covers vite.config.ts, tsconfig.app.json covers src/. Using a single tsconfig for both causes `noUnusedLocals` and `composite` to conflict
- **Fix:** Created separate `tsconfig.app.json` with `composite: true`, `noEmit: true`, `include: ["src"]`; `tsconfig.json` references both
- **Files modified:** `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Commit:** 338f2a0

## TDD Gate Compliance

- RED gate: commit `6264f45` — `test(01-01): add failing tests for storage layer (TDD red)`
- GREEN gate: commit `fa09326` — `feat(01-01): implement namespaced versioned persistence + domain metadata`
- REFACTOR: Not needed — implementation was clean on first pass

## Known Stubs

None — this plan creates the foundation layer (CSS, storage, metadata); no UI components or data wiring exist yet. The `src/main.tsx` renders `<div className="app-root" data-theme="light">Bootstrapping…</div>` as a placeholder, but the full App component and screens are deliberately out of scope for this plan (see SKELETON.md).

## Threat Flags

No new security surface beyond what the plan's threat model already covers.

| Addressed | File | Mitigation |
|-----------|------|------------|
| T-01-01 Tampering | src/lib/storage.ts | readState validates schemaVersion, falls back to defaults on mismatch/corruption; all parsing in try/catch |
| T-01-02 DoS | src/lib/storage.ts | writeState/clearAll wrapped in try/catch; quota-exceeded or denied-storage degrades to in-memory defaults |

## Self-Check: PASSED

- [x] `dist/index.html` exists
- [x] `dist/brq/fonts/Aspekta-450.ttf` exists
- [x] `dist/brq/assets/brq-logo-white.png` exists
- [x] `src/styles/brq-tokens.css` contains `--brq-roxo: #460E78`
- [x] `src/styles/app.css` contains `data-theme="dark"`, `max-width: 860px`, `max-width: 600px`
- [x] `src/lib/storage.ts` contains `cae-trainer:v1` and exports all four functions
- [x] `src/lib/useStoredState.ts` exports `useStoredState`
- [x] `src/data/domains.ts` exports `DOMAINS` with d1..d5
- [x] `npm test` — 9/9 tests pass
- [x] `npm run typecheck` — exits 0
- [x] `npm run build` — exits 0
- [x] Commits verified: 338f2a0, 8b06a36, 6264f45, fa09326
