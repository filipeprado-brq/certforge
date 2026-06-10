---
phase: 02-exam-content
plan: "01"
subsystem: content-data-layer
tags: [content, types, tdd, flashcards, questions, loader, official-sample]
dependency_graph:
  requires:
    - src/data/domains.ts (DomainId/Domain from Phase 01)
  provides:
    - Typed Flashcard/Question/Scenario/Source interfaces (src/data/types.ts)
    - 6 official scenario names as const tuple (src/data/scenarios.ts)
    - 15 seed flashcards embedded as typed TS module (src/data/flashcards.ts)
    - 14 seed questions + 12 official sample questions embedded as typed TS module (src/data/questions.ts)
    - Typed loader/selectors: getFlashcards, getQuestions, flashcardCountsByDomain, questionCountsByDomain (src/data/content.ts)
  affects:
    - 02-02 (expansion — adds cards/questions to this same dataset)
    - 02-03 (browse views — consumes loader selectors)
    - Phase 3 (SRS — consumes Flashcard type + getFlashcards)
    - Phase 4 (Quiz engine — consumes Question type + getQuestions)
tech_stack:
  added:
    - "@types/node (dev) — for node:fs, node:url, node:path in content.test.ts"
  patterns:
    - Embedded typed TS modules (no fetch/XHR — CONT-06)
    - TDD RED/GREEN cycle with vitest globals
    - 4-tuple literal for options field to satisfy [string,string,string,string]
    - Curly-quote apostrophes in string literals (U+2019) to avoid ASCII single-quote delimiter conflicts
key_files:
  created:
    - src/data/types.ts
    - src/data/scenarios.ts
    - src/data/flashcards.ts
    - src/data/questions.ts
    - src/data/content.ts
    - src/data/content.test.ts
  modified:
    - package.json (added @types/node devDependency)
    - package-lock.json
decisions:
  - "Types defined in src/data/types.ts; DomainId imported from ./domains (no redefinition)"
  - "options field uses array literal syntax satisfying [string,string,string,string] 4-tuple"
  - "Curly apostrophes (U+2019) used in string values to avoid unbalanced ASCII single-quote delimiters"
  - "@types/node added as devDependency to support node:fs/node:url/node:path imports in test file"
  - "content.test.ts path resolution uses fileURLToPath with fallback to process.cwd() for jsdom env compatibility"
metrics:
  duration: "~9 minutes"
  completed: "2026-06-10"
  tasks_completed: 2
  files_changed: 8
---

# Phase 02 Plan 01: Typed Content Data Layer Summary

**One-liner:** Embedded TypeScript content layer with 15 seed flashcards, 14 seed questions, and 12 official exam-guide sample questions tagged source:'official-sample', plus typed loader/selectors (getFlashcards, getQuestions, per-domain counts), all verified by TDD invariant tests.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 RED | Define types, scenarios, and failing invariant tests | 9c53151 | Done |
| 2 GREEN | Author seed dataset + 12 official questions + typed loader | b53128e | Done |

## What Was Built

**Task 1 — Types, scenarios, failing tests (RED):**
- `src/data/types.ts`: exports `Scenario` union (6 strings), `Source` union, `Flashcard` interface, `Question` interface; imports `DomainId` from `./domains` (no redefinition)
- `src/data/scenarios.ts`: `SCENARIOS as const` tuple of 6 official scenario names + `ScenarioName` type alias
- `src/data/content.test.ts`: 21 invariant tests covering count assertions (flashcards===15, questions===26, official-sample===12), shape checks (4 options, correct in 0..3, non-empty explanations), selector filtering, count-map sums, and CONT-06 no-network-primitive check via `readFileSync`

**Task 2 — Data + loader implementation (GREEN):**
- `src/data/flashcards.ts`: 15 `Flashcard[]` entries (f1..f15) ported verbatim from `design/data.jsx`, typed — no mastery/cardsDue fields (Phase 3 concerns)
- `src/data/questions.ts`: 14 seed `Question[]` entries (q1..q14, source:'original') + 12 official sample entries (sq1..sq12, source:'official-sample') with exact domain/scenario mappings from 02-CONTEXT.md `<specifics>`
- `src/data/content.ts`: static-import loader exposing `getFlashcards({domain?})`, `getQuestions({domain?, scenario?})`, `flashcardCountsByDomain()`, `questionCountsByDomain()` — plain `.filter`/`.reduce`, no fetch/XHR/dynamic import
- `@types/node` devDependency added for `node:fs` etc. in test file

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] content.test.ts import.meta.url path resolution in jsdom environment**
- **Found during:** Task 2 GREEN verification
- **Issue:** `new URL('./flashcards.ts', import.meta.url).pathname` resolved to `/src/data/flashcards.ts` (jsdom's http://localhost base) instead of the absolute filesystem path, causing 3 ENOENT errors in the CONT-06 check
- **Fix:** Updated content.test.ts to use `fileURLToPath(import.meta.url)` with a `process.cwd()` fallback for non-file: URL schemes; imported `fileURLToPath` and `dirname`/`join` from Node built-ins
- **Files modified:** `src/data/content.test.ts`
- **Commit:** b53128e

**2. [Rule 3 - Blocking] @types/node missing for node: built-in imports in test**
- **Found during:** Task 2 build gate (`tsc -b` check)
- **Issue:** `tsc -b && vite build` failed with TS2307 "Cannot find module 'node:fs'" and TS2580 "Cannot find name 'process'" because `tsconfig.app.json` lacked `@types/node`
- **Fix:** `npm install --save-dev @types/node` — added devDependency
- **Files modified:** `package.json`, `package-lock.json`
- **Commit:** b53128e

**3. [Rule 1 - Bug] grep-c acceptance criteria off-by-one due to comment lines**
- **Found during:** Post-implementation acceptance check
- **Issue:** `grep -c "source: 'official-sample'"` returned 13 (12 actual + 1 comment line containing the pattern); same for 'original' (15 instead of 14)
- **Fix:** Removed the source type text from the comment headers so only actual property assignments are counted
- **Files modified:** `src/data/questions.ts`
- **Commit:** b53128e

## TDD Gate Compliance

- RED gate: commit `9c53151` — `test(02-01): add failing content-layer invariant tests (TDD red)`
- GREEN gate: commit `b53128e` — `feat(02-01): typed content layer — seed deck + 12 official questions + loader (TDD green)`
- REFACTOR: Not needed — implementation was clean on first pass

## Known Stubs

None — this plan creates a pure data layer. All 15 flashcards and 26 questions have real content. No UI components or progress data are included (those are Phase 3/4 concerns).

## Threat Flags

No new security surface beyond the plan's threat model.

| Addressed | File | Mitigation |
|-----------|------|------------|
| T-02-01 Tampering | src/data/*.ts | Static authored content compiled into bundle; CONT-06 grep gate in content.test.ts asserts no fetch/XHR/import() |
| T-02-02 Info disclosure | content arrays | Public study material by design; offline app, no secrets |

## Self-Check: PASSED

- [x] `src/data/types.ts` exists; contains `interface Question` and `interface Flashcard`; imports `DomainId` from `./domains`
- [x] `src/data/scenarios.ts` exists; contains `SCENARIOS`; contains 'Customer Support Resolution Agent'
- [x] `src/data/flashcards.ts` exists; `grep -c "id: 'f"` returns 15
- [x] `src/data/questions.ts` exists; `grep -c "source: 'official-sample'"` returns 12; `grep -c "source: 'original'"` returns 14; `grep -cE "id: 'sq([1-9]|1[0-2])'"` returns 12; `grep -c "id: 'q"` returns 14
- [x] `src/data/content.ts` exists; exports `getFlashcards`, `getQuestions`, `flashcardCountsByDomain`, `questionCountsByDomain`; no fetch/XHR/axios/dynamic-import
- [x] `src/data/content.test.ts` exists; contains official-sample===12 assertion
- [x] `npm test` — 37/37 tests pass (GREEN)
- [x] `npm run typecheck` — exits 0
- [x] `npm run build` — exits 0
- [x] Commits verified: 9c53151 (RED), b53128e (GREEN)
