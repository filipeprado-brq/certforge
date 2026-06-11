# Claude Architect Exam Trainer

## What This Is

A static, offline-first web app that helps candidates prepare for the **Claude Certified Architect – Foundations** certification. It combines a spaced-repetition flashcard deck covering the concepts from all 5 exam domains with an exam-style multiple-choice quiz engine (1 correct answer + 3 distractors, each with explanations). Built for self-study by solution architects preparing for the exam.

## Core Value

A candidate can study the exam's concepts via flashcards and take realistic, exam-style multiple-choice practice questions with explanations — entirely in the browser, offline.

## Current Milestone: v1.1 Content Expansion

**Goal:** Grow and deepen the study bank — from 50→~150 flashcards and 40→~120 questions, proportional to exam weights — without adding app features.

**Target features:**
- Flashcards expanded to ~150, covering every exam-guide task statement (1.1–5.6)
- Questions expanded to ~120 (12 official preserved), weight-proportional
- Stronger Scenario Simulation pool — each of the 6 official scenarios well-represented
- Harder tradeoff-style questions with plausible distractors (style of the 12 official samples)
- Code/config-snippet questions (CLAUDE.md, .mcp.json, tool_choice, hooks, CLI flags, JSON Schema)
- Richer whyCorrect/whyOthers explanations grounded in the guide

## Requirements

### Validated

<!-- v1.0 shipped & verified (phases 1-4, 23 requirements) -->

- ✓ Spaced-repetition (Leitner) flashcards covering all 5 domains — v1.0
- ✓ Exam-style MCQ (1 correct + 3 distractors + explanation) — v1.0
- ✓ Four quiz modes: scenario simulation, per-domain, timed full exam (scaled 100–1000, pass 720), free/random — v1.0
- ✓ Quiz results (score, per-domain breakdown, missed review) + attempt history — v1.0
- ✓ Local progress persistence (SRS schedule + quiz history) in localStorage — v1.0
- ✓ Content authored from the official guide, embedded in the build (50 flashcards, 40 questions incl. 12 official) — v1.0
- ✓ Static React+Vite+TS build, responsive, paper/ink theming, reset-all — v1.0

### Active

<!-- v1.1 Content Expansion — see EXP-* in REQUIREMENTS.md -->

- [ ] Flashcard bank expanded to ~150, weight-proportional, ≥1 card per task statement (1.1–5.6)
- [ ] Question bank expanded to ~120, weight-proportional, 12 official preserved
- [ ] Each of the 6 official scenarios has a strong scenario-tagged question pool
- [ ] Harder tradeoff-style questions with plausible distractors
- [ ] Code/config-snippet questions across the relevant domains
- [ ] Richer explanations + content.test.ts updated minimums/invariants stay green

### Out of Scope

- Backend / user accounts / cross-device sync — chosen offline-first static app; localStorage is sufficient for v1
- Content import/editor UI (JSON/CSV) — content is authored and embedded; deferred to a later version
- Mobile native app — web app is responsive enough for v1; native is a future option
- Multilingual UI/content — content and UI are English-only to match the real exam
- Reproducing actual exam questions verbatim — the guide's sample questions are used; the rest are original questions in the exam's style

## Context

- Source material: the official "Claude Certified Architect – Foundations Certification Exam Guide" (v0.1). It defines 5 weighted domains, 6 scenarios, task statements with Knowledge/Skills bullets, an appendix of in-scope technologies, and 12 sample multiple-choice questions with explanations.
- Domain weights: Domain 1 Agentic Architecture & Orchestration (27%), Domain 2 Tool Design & MCP Integration (18%), Domain 3 Claude Code Configuration & Workflows (20%), Domain 4 Prompt Engineering & Structured Output (20%), Domain 5 Context Management & Reliability (15%). Question/flashcard volume should roughly track these weights.
- The 6 scenarios: Customer Support Resolution Agent, Code Generation with Claude Code, Multi-Agent Research System, Developer Productivity with Claude, Claude Code for CI, Structured Data Extraction.
- The 12 sample questions from the guide should be included in the question bank (verbatim, since they are provided as practice material), each tagged to its scenario/domain.
- The exam's own answer patterns are a useful authoring guide for distractors: deterministic enforcement > prompt; better tool descriptions > complexity; explicit criteria + few-shot > self-reported confidence; least-privilege tool access; structured errors > generic; right API for the latency need; attention dilution in large contexts.

## Constraints

- **Tech stack**: React + Vite + TypeScript — chosen for clean component/state handling across multiple quiz modes and SRS; produces a static build.
- **Persistence**: Browser localStorage only — no backend by design.
- **Language**: English content and UI — matches the real exam.
- **Hosting**: Must build to static assets (no server runtime required).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static offline web app (no backend) | Simplest to build/host; single-user study tool needs no server | — Pending |
| React + Vite + TypeScript | Component model fits SRS + multiple quiz modes; static output | — Pending |
| Spaced repetition (Leitner/SRS) for flashcards | More effective memorization than flat review | — Pending |
| Content authored from guide, embedded in app | Ships value immediately; no empty-app cold start | — Pending |
| English-only content + UI | Aligns study with the actual exam language | — Pending |
| Include the guide's 12 sample questions in the bank | Provided as practice material; high-fidelity exam style | — Pending |
| Question/card volume tracks domain weights | Practice mirrors real exam emphasis (D1 27%, etc.) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-11 — v1.0 shipped (phases 1-4); started milestone v1.1 Content Expansion*
