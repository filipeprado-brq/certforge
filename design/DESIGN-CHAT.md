# Exam UI Design System

_Started 2026-06-10 15:32 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Claude Certified Architect"
Project is currently empty (no files)
Current date is now June 10, 2026
</system-info>

<pasted_text name="Pasted text (105 lines)">
You are designing the UI for a web app called "Claude Architect Exam Trainer" — a
  study tool for the "Claude Certified Architect – Foundations" certification.
  Generate high-fidelity, production-grade screens (desktop + mobile) as an
  interactive prototype. All content/UI text is in ENGLISH.

  == PRODUCT ==
  A static, offline-first study app (React + Vite + TS, data in localStorage, no
  backend). Two pillars:
  1) Spaced-repetition (Leitner) FLASHCARDS covering exam concepts.
  2) An exam-style multiple-choice QUIZ engine (1 correct + 3 distractors + an
     explanation revealed after answering).

  Target user: a solution architect (6+ months building with Claude) preparing for
  the exam. Tone: focused, credible, calm, "developer-grade". Not childish/gamey,
  but motivating. Think Linear / Anki / modern dev-tool aesthetics.

  == DOMAIN FACTS (use these verbatim in the UI) ==
  5 exam domains with weights (use as labels + progress emphasis):
    D1 Agentic Architecture &amp; Orchestration — 27%
    D2 Tool Design &amp; MCP Integration — 18%
    D3 Claude Code Configuration &amp; Workflows — 20%
    D4 Prompt Engineering &amp; Structured Output — 20%
    D5 Context Management &amp; Reliability — 15%
  6 exam scenarios (used by one quiz mode):
    Customer Support Resolution Agent; Code Generation with Claude Code;
    Multi-Agent Research System; Developer Productivity with Claude;
    Claude Code for Continuous Integration; Structured Data Extraction.
  Scoring: scaled score 100–1000, pass mark 720 (show pass/fail).
  Flashcard recall ratings: "Again" and "Good" (drives SRS scheduling).
  Quiz modes: (a) Scenario Simulation — 4 scenarios drawn from the 6,
  questions grouped by scenario; (b) Domain Practice — pick 1 of 5 domains;
  (c) Timed Full Exam — countdown timer + final scaled score; (d) Free/Random —
  pick N questions, explanation shown after each answer.

  == SCREENS TO DESIGN ==
  1. HOME / DASHBOARD
     - App header + nav (Flashcards, Quiz, History, Settings).
     - "Today" summary: cards due, last quiz score.
     - Two primary entry cards: "Study Flashcards" and "Take a Quiz".
     - Per-domain mastery overview (5 domains, each with % progress + weight badge).
     - Subtle empty state for a brand-new user.

  2. FLASHCARDS — DECK OVERVIEW
     - Per-domain breakdown: cards learned, cards due today, total.
     - Domain filter chips (All + 5 domains).
     
  3. FLASHCARDS — STUDY SESSION (the core loop)
     - A single card, front (prompt/term) -&gt; flip -&gt; back (concept/answer).
     - Domain label on the card.
     - After flip: two rating buttons "Again" (resurface soon) and "Good" (space out).
     - Session progress (e.g. 4 / 18) + remaining due count.
     - Show flip animation and the answered/known state.
     
  4. QUIZ — MODE SELECT
     - Four selectable mode cards (Scenario Simulation, Domain Practice,
       Timed Full Exam, Free/Random), each with a one-line description.
     - For Domain Practice: domain picker. For Free/Random: a "number of questions"
       selector. For Timed Full Exam: show duration + that it's scored 100–1000.
       
  5. QUIZ — QUESTION SCREEN
     - Question stem (can be long, scenario-framed). Scenario banner when in
       Scenario Simulation mode.
     - Four answer options (A–D), single-select.
     - Default state (unanswered) and ANSWERED state: correct option highlighted
       green, chosen-wrong option red, plus an EXPLANATION panel ("Why this is
       correct / why the others are wrong").
     - Progress indicator + (in timed mode) a countdown timer in the header.
     - "Next" action.
     
  6. QUIZ — RESULTS SUMMARY
     - Big score. For timed exam: scaled score 100–1000 with a clear PASS/FAIL
       against 720. For other modes: raw correct/total + %.
     - Per-domain breakdown bar chart.
     - "Review missed questions" list (question + your answer + correct + explanation).
     - Actions: retry, back to home.
     
  7. HISTORY
     - List of past quiz attempts (date, mode, score, pass/fail badge).
     - Tap an attempt to see its results summary.
     
  8. SETTINGS
     - Theme toggle (light/dark), and a "Reset all progress" destructive action
       with confirm.
       
  == DESIGN SYSTEM ==
  - Provide BOTH light and dark themes.
  - Define a small token set: color palette (1 primary accent + neutrals +
    semantic success/error/warning), type scale, spacing, radius, elevation.
  - Recommended direction: clean neutral surfaces, one confident accent color,
    generous whitespace, rounded cards, clear focus states. Each of the 5 domains
    should have a distinct but harmonious color used consistently as a label/badge.
  - Reusable components: AppShell/Nav, DomainBadge, ProgressBar, Flashcard,
    RatingButtons, QuizOption (states: default/selected/correct/incorrect),
    ExplanationPanel, ScoreDial/Gauge, Timer, AttemptListItem, Button variants,
    EmptyState, ConfirmDialog.
  - Fully responsive: design desktop AND mobile layouts for each screen.
  - Accessible: WCAG AA contrast, visible keyboard focus, don't rely on color alone
    (use icons/labels for correct/incorrect).
    
  == DELIVERABLE ==
  An interactive, multi-screen prototype with realistic sample content (write a few
  plausible exam-style flashcards and one full sample multiple-choice question per
  quiz state so the correct/incorrect/explanation states are visible). Include the
  design tokens/spec. Keep it implementable in React + Tailwind.

</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Hi-fi design">
Create a high-fidelity, polished design.

Follow this general design process (use the todo list to remember):
(1) ask questions, (2) find existing UI kits and collect design context — copy ALL relevant components and read ALL relevant examples; ask the user if you can't find them, (3) start your file with assumptions + context + design reasoning (as if you are a junior designer and the user is your manager), with placeholders for the designs, and show it to the user early, (4) build out the designs and show the user again ASAP; append some next steps, (5) use your tools to check, verify and iterate on the design.

Good hi-fi designs do not start from scratch — they are rooted in existing design context. Ask the user to Import their codebase, or find a suitable UI kit / design resources, or ask for screenshots of existing UI. You MUST spend time trying to acquire design context, including components. If you cannot find them, ask the user for them. In the Import menu, they can link a local codebase, provide screenshots or Figma links; they can also link another project. Mocking a full product from scratch is a LAST RESORT and will lead to poor design. If stuck, try listing design assets and ls'ing design system files — be proactive! Some designs may need multiple design systems — get them all. Use the starter components (device frames and the like) to get high-quality scaffolding for free.

When presenting several options or explorations side-by-side, lay them out clearly: give the page a neutral gray background, put each option in its own labeled frame (a small heading + a white rounded card sized to its content), and group related options into sections.

When designing, asking many good questions is ESSENTIAL.

Give options: try to give 3+ variations across several dimensions. Mix by-the-book designs that match existing patterns with new and novel interactions, including interesting layouts, metaphors, and visual styles. Have some options that use color or advanced CSS; some with iconography and some without. Start your variations basic and get more advanced and creative as you go! Try remixing the brand assets and visual DNA in interesting ways — play with scale, fills, texture, visual rhythm, layering, novel layouts, type treatments. The goal is not the perfect option; it's exploring atomic variations the user can mix and match.

CSS, HTML, JS and SVG are amazing. Users often don't know what they can do. Surprise the user.

If you do not have an icon, asset or component, draw a placeholder: in hi-fi design, a placeholder is better than a bad attempt at the real thing.
</attached-skill>

<attached-skill name="Interactive prototype">
Create a fully interactive prototype with realistic state management and transitions. Use React useState/useEffect for dynamic behavior. Include hover states, click interactions, form validation, animated transitions, and multi-step navigation flows. It should feel like a real working app, not a static mockup.
</attached-skill>

<attached-skill name="BRQ Design System (design system)">
[Design System] This project uses the **BRQ Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/90efda48-1c15-412e-afed-04dcdc3ca5d5/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# BRQ Design System — Guia de Uso

&gt; **Building what matters.**
&gt; Sistema de design institucional da BRQ Digital Solutions.
&gt; Use este documento como fonte da verdade para recriar a identidade BRQ em qualquer ambiente — decks, sites, apps, e-mails, peças de marca.

---

## 1. Princípios

A marca BRQ é **editorial, monocromática e confiante**. A regra mental ao desenhar qualquer peça:

1. **Preto e branco primeiro.** A cor é um acento pontual, nunca o protagonista. Comece tudo em preto sobre off-white (ou branco sobre preto).
2. **Uma cor de acento por tela/slide.** Roxo, verde, laranja e azul existem — mas só convivem juntos em *tags de categoria*. Em qualquer outro lugar, escolha uma.
3. **Tipografia faz o trabalho pesado.** Títulos grandes em Aspekta, com entrelinha apertada e alinhados à esquerda. Pouca decoração.
4. **Hairlines, não caixas.** A moldura editorial (linha fina em cima e embaixo, com rótulos em mono) é a assinatura visual — preferível a sombras e bordas pesadas.
5. **Respiro generoso.** Whitespace (ou *blackspace*) é obrigatório. Menos é mais.
6. **Cantos nunca retos.** Botões e tags são pílula (999px); cards têm raio ≥ 20px.
7. **Grafismo isométrico** (cubos, escadas, torres, esferas em linha fina) interage com a fotografia — nunca é decoração solta.

---

## 2. Cores

### Escala monocromática (padrão)
| Token | Hex | Uso |
|---|---|---|
| `--brq-black` | `#000000` | Fundo escuro principal, texto sobre claro |
| `--brq-ink` | `#1A1A1A` | Preto suave para grandes áreas |
| `--brq-gray-900` | `#2A2A2A` | |
| `--brq-gray-800` | `#4A4A4A` | Texto secundário sobre claro |
| `--brq-gray-600` | `#808080` | Texto terciário / legendas |
| `--brq-gray-400` | `#B8B8B8` | |
| `--brq-gray-300` | `#D9D9D9` | |
| `--brq-gray-200` | `#EFEFEF` | **Fundo off-white de slide** |
| `--brq-gray-100` | `#F5F5F5` | Superfície elevada |
| `--brq-white` | `#FFFFFF` | Fundo claro puro, texto sobre escuro |

&gt; As duas superfícies padrão são **preto (`#000`)** e **off-white (`#EFEFEF`)**.

### Acentos secundários (um por tela)
| Token | Hex | Categoria |
|---|---|---|
| `--brq-roxo` | `#460E78` | Soluções Digitais / Tech / GenAI |
| `--brq-verde` | `#1DA669` | Squads / Studio / Mobile |
| `--brq-laranja` | `#EE7C38` | Dados &amp; Engenharia / Data &amp; Analytics |
| `--brq-azul` | `#5A85CB` | Cloud / Salesforce |

### Hairlines
- Sobre escuro: `rgba(255,255,255,0.18)`
- Sobre claro: `rgba(0,0,0,0.14)`

---

## 3. Tipografia

Três famílias, papéis fixos:

| Família | Papel | Peso | Regras |
|---|---|---|---|
| **Aspekta** | Display, títulos | 450 (assinatura) | Sentence case, **nunca CAIXA ALTA**, alinhado à esquerda, tracking −2%, entrelinha 0.9–1.1 |
| **Inter** | Corpo de texto | 300 / 500 | Colunas estreitas (máx. ~52ch), entrelinha 1.5 |
| **Geist Mono** | Tags, números de seção, rótulos, botões, metadata | 600 | SEMPRE CAIXA ALTA, tracking +8% |

### Escala (slides 1920×1080)
| Token | px | Aplicação |
|---|---|---|
| Display XXL | 160–240 | Capas extremas / fechamento |
| Display XL | 112 | Capa padrão |
| Display LG | 88 | Títulos de seção |
| Display MD | 72 | Título de slide de conteúdo |
| H1 | 48 | |
| H2 | 36 | |
| H3 | 28 | Título de card |
| Corpo LG | 20–28 | Subtítulo / parágrafo de slide |
| Corpo | 16–18 | |
| Mono | 11–16 | Rótulos, tags |

&gt; **Regra para apresentações:** nunca use texto menor que 22px em slide. Em caixas/cards de slide, títulos ≥ 36px e descrição ≥ 22px.

---

## 4. Espaçamento &amp; Forma

- **Base de 4px.** Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- **Raios:** `xs 8` (chips inline) · `sm 12` (inputs) · `md 20` (mínimo de tag) · `lg 28` (cards) · `xl 40` (posters) · `pill 999` (botões e tags).
- **Hairline:** 1px.
- **Sombras:** evite. A marca é flat. Use `0 4px 24px rgba(0,0,0,0.08)` só quando estritamente necessário.

---

## 5. Componentes

- **Tag / pill** — Geist Mono 600, caixa alta, padding `10px 20px`, raio 999, fundo na cor da categoria, texto branco.
- **Botão** — pílula; *filled* (preto ou roxo), *outline* (borda 1.5px) ou *link-pill* com seta `→`. Rótulo em Geist Mono caixa alta.
- **Stat card** — número gigante em Aspekta 450 + rótulo curto em mono. Variantes de superfície: branco, preto, roxo.
- **Case card** — tag de categoria + título Aspekta + trio de métricas com hairline acima de cada uma.
- **Campo de formulário** — rótulo (mono, caixa alta) sobre input; borda 1.5px, raio 12, foco = borda preta.
- **Moldura de slide** — linha hairline no topo (`rótulo · logo · número`) e na base (`© BRQ · seção`), tudo em Geist Mono.

---

## 6. Marca

- **Logo:** wordmark `brq®`. Preto sobre claro, branco sobre escuro. Posição padrão: topo, ~5% da largura. O `®` é parte do logo.
- **Grafismo isométrico:** cubos, escadas, torre, esfera e grade — apenas contorno, traço fino, sem preenchimento. Usado como fundo/overlay sobre preto, ou interagindo com retratos.
- **Fotografia:** retratos editoriais, guarda-roupa neutro (preto / carvão / sage), luz suave. Frequentemente combinados com o grafismo isométrico ao fundo.

---

## 7. Estrutura de arquivos

```
colors_and_type.css          → tokens (variáveis CSS) + classes utilitárias + @font-face
fonts/                       → Aspekta-450, Inter, Geist Mono (.ttf)
assets/
  logo/                      → brq-logo-black.png, brq-logo-white.png
  graphics/                  → iso-cubes-stack, iso-stairs, iso-tower, iso-sphere, iso-grid-pattern (.svg)
  brand/                     → retratos e imagens editoriais
preview/                     → cartões de referência (cores, tipo, espaçamento, componentes, marca)
slides/                      → deck de exemplo + componentes de slide (.jsx)
ui_kits/marketing_site/      → recriação do site institucional
```

---

## 8. Como usar em outro ambiente

### Web / HTML
1. Copie `colors_and_type.css` e a pasta `fonts/` para o projeto.
2. Inclua no `&lt;head&gt;`:
   ```html
   &lt;link rel="stylesheet" href="colors_and_type.css"&gt;
   ```
3. Use as variáveis e classes:
   ```html
   &lt;h1 class="brq-display"&gt;Building what matters.&lt;/h1&gt;
   &lt;p class="brq-body"&gt;Texto de apoio em Inter Light.&lt;/p&gt;
   &lt;span class="brq-mono"&gt;Soluções Digitais&lt;/span&gt;
   ```
4. Referencie cores via token: `color: var(--brq-roxo);`

### Sem os arquivos de fonte (fallback CDN)
Se não puder embarcar os `.ttf`, substitua o bloco `@font-face` por:
```css
@import url('https://api.fontshare.com/v2/css?f[]=aspekta@400,450,500&amp;display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&amp;family=Geist+Mono:wght@400;600&amp;display=swap');
```

### Figma / outras ferramentas
- Crie estilos de cor com os hex da seção 2.
- Crie estilos de texto com a escala da seção 3 (Aspekta 450 / Inter 300+500 / Geist Mono 600).
- Replique a moldura hairline como componente de frame.

### Checklist rápido antes de publicar
- [ ] A peça começa em preto/off-white, com no máximo **uma** cor de acento?
- [ ] Títulos em Aspekta 450, sentence case, alinhados à esquerda?
- [ ] Tags e botões em Geist Mono CAIXA ALTA, formato pílula?
- [ ] Cantos arredondados (nenhum reto em card/botão)?
- [ ] Moldura hairline com rótulos em mono presente?
- [ ] Texto legível (≥ 22px em slide)?
- [ ] Respiro/whitespace generoso?

---

*© BRQ 2026 — Building what matters.*

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/90efda48-1c15-412e-afed-04dcdc3ca5d5/colors_and_type.css`). The 88 custom properties it defines are:

--brq-azul, --brq-azul-400, --brq-black, --brq-gray-100, --brq-gray-200, --brq-gray-300, --brq-gray-400, --brq-gray-600, --brq-gray-800, --brq-gray-900, --brq-ink, --brq-laranja, --brq-laranja-400, --brq-roxo, --brq-roxo-400, --brq-verde, --brq-verde-400, --brq-white, --ease-in-out, --ease-out, --fg-on-ink, --fg-on-ink-muted, --fg-on-ink-subtle, --fg-on-paper, --fg-on-paper-muted, --fg-on-paper-subtle, --font-body, --font-display, --font-mono, --fw-body, --fw-body-light, --fw-body-med, --fw-display, --fw-display-regular, --fw-mono, --hairline-on-ink, --hairline-on-paper, --hairline-weight, --lh-body, --lh-display, --lh-mono, --lh-title, --ls-body, --ls-display, --ls-mono, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xl, --radius-xs, --shadow-none, --shadow-soft, --space-1, --space-10, --space-2, --space-3, --space-4, --space-5, --space-6, --space-7, --space-8, --space-9, --surface-ink, --surface-paper, --surface-paper-pure, --surface-raised, --t-base, --t-fast, --t-slow, --type-body, --type-body-lg, --type-body-sm, --type-display-lg, --type-display-md, --type-display-sm, --type-display-xl, --type-display-xxl, --type-h1, --type-h2, --type-h3, --type-h4, --type-mono, --type-mono-lg, --type-mono-sm, --type-subtitle, --type-subtitle-lg, --type-subtitle-sm

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/90efda48-1c15-412e-afed-04dcdc3ca5d5/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: questions_v2]_

## User

Questions answered:
- domain_colors: Use the 4 BRQ accents + black/ink as the 5th domain color
- accent: Black only (accent reserved for domain badges)
- semantic_colors: Verde for success + a new harmonious red I derive (oklch-matched)
- theme_default: Follow system preference
- mobile_presentation: One responsive prototype (resize to see mobile) + a viewport toggle tweak
- variations: One strong direction, fully consistent
- interactivity: Clickable flow with staged states (no real persistence)
- empty_state: Decide for me
- timed_exam: Short demo timer (e.g. 5 min / 10 questions) so it's testable
- tweaks: Timer speed
- branding: Yes — brq® logo in the app shell + iso graphics as subtle texture

## Assistant

_[tool: update_todos]_

_[tool: copy_files]_

_[tool: copy_starter_component]_

All decisions in — building one consistent BRQ-styled direction: black-only product accent, 4 BRQ accents + ink for the 5 domains, verde + derived red for quiz semantics, system-preference theme, responsive layout, staged interactivity, demo-length timed exam with a timer-speed tweak.

_[tool: copy_files]_

_[tool: write_file]_

_[tool: write_file]_

Now the sample content — domains, flashcards, exam-style questions, seeded history:

_[tool: write_file]_

_[tool: write_file]_

Now the screens — flashcards first:

_[tool: write_file]_

Now the quiz engine (mode select → runner → results):

_[tool: write_file]_

Now home / history / settings:

_[tool: write_file]_

_[tool: str_replace_edit]_

The main app wiring + HTML entry:

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: str_replace_edit]_

Rendering well. One small fix — header title wrapping:

_[tool: done]_

_[tool: fork_verifier_agent]_

The **Claude Architect Exam Trainer** prototype is live — a fully clickable, BRQ-styled study app:

- **All 8 screens**: dashboard, deck overview, flashcard study loop (3D flip + Again/Good), quiz mode select, question screen (correct/incorrect + explanation states), results (score dial vs. 720 pass mark), history with drill-in, settings with reset confirm
- **BRQ throughout**: paper/ink themes (follows system, toggle in header + settings), Aspekta/Inter/Geist Mono, hairlines, pill buttons, 4 accents + ink for the 5 domains, verde + an oklch-derived red for quiz semantics
- **Real content**: 15 exam-style flashcards and 14 questions with full explanations; the timed exam is a testable 5 min / 10 questions scored 100–1000
- **Tweaks panel**: timer speed (1×/10×/60×), mobile 390px preview, and a "new user" toggle to see all empty states

Caveats / next steps: state is staged per-session (no localStorage persistence, as agreed); the question bank is a sample — happy to expand it, add real Leitner box visualization, or wire persistence if you want it closer to production.

