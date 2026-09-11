# Math3D Studio - Agent Instructions

Welcome to the Math3D Studio codebase! This file (`AGENTS.md`) contains the core rules, architectural guidelines, and context that AI agents must follow when modifying or extending this project.

## Project Overview
Math3D Studio is an interactive, animated Mathematics learning platform tailored for the Senegalese curriculum (4ème and 3ème / BFEM preparation). It features 3D geometry visualizers, algebraic solvers, and interactive lessons.

## Technology Stack
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4.
- **Visuals**: Three.js (for 3D Geometry), KaTeX (for LaTeX rendering), Framer Motion (`motion`).
- **Backend**: Express (Node.js) with JSON-based file storage (no traditional database).
- **AI Integration**: Google Gemini API (`@google/genai`) for fallback algebraic resolutions.

## Core Architectural Rules

### 1. No Emojis Allowed
- Absolutely NO emojis are allowed anywhere in the codebase.
- This includes source code (JS, TS, TSX, shell scripts) as well as Markdown documentation (README, AGENTS, artifacts, plans).
- Never generate responses or documentation containing emojis.

### 2. The 3-Tier Resolution Pipeline
When modifying the algebra resolver (`server/resolve` endpoint), you must respect the 3-tier architecture:
1. **Tier 1 (Cache)**: SHA-256 hash lookup in `data/math3d_cache.json` (< 50ms).
2. **Tier 2 (Heuristics)**: Deterministic, offline calculation for standard expansions and factorizations (< 15ms).
3. **Tier 3 (AI Fallback)**: Gemini API call for complex/unknown expressions, with immediate atomic caching to avoid duplicate calls.

### 3. UI/UX Design System
- **Glassmorphism**: Use `backdrop-blur` and semi-transparent backgrounds (`bg-white/70`, `bg-slate-900/70`) for containers, headers, and sidebars.
- **Vibrant Colors & Gradients**: Use modern Tailwind gradients (e.g., `from-emerald-500 to-indigo-500`) rather than flat primary colors.
- **Micro-animations**: Interactive elements (buttons, cards) must have scale animations (`hover:scale-[1.01] active:scale-95 transition-all`).
- **Dark Mode**: The app supports light and dark modes via a custom theme toggle. Always ensure components have `dark:` variants configured harmoniously.

### 3bis. Colour Palette (configured from `.env`)
The whole palette is generated from the `VITE_THEME_*` variables of the `.env` file
(see `.env.example`). Source lives in `src/theme/`, and `scripts/vite-plugin-theme.ts`
turns it into a stylesheet at dev/build time (virtual module `virtual:theme.css`).

Rules to follow when writing UI:
- **Never hardcode a hex colour in a component.** Use Tailwind utilities
  (`bg-slate-800`, `text-emerald-400`, ...) or the semantic tokens
  (`bg-canvas`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-line`,
  `bg-primary`, `text-on-primary`, `text-primary-ink`, `bg-primary-soft`, ...).
  Every Tailwind colour family is re-mapped onto one of the seven configured
  roles, so `slate` and `neutral` (or `emerald` and `green`) resolve to the very
  same ramp.
- **Every colour class needs its counterpart.** A class with no `dark:` variant
  renders the same in both themes and will eventually become unreadable. The
  convention used across the codebase is
  `text-<family>-600 dark:text-<family>-400` for text,
  `bg-white dark:bg-slate-900` for surfaces,
  `border-slate-200 dark:border-slate-800` for hairlines.
- **Shades carry a meaning.** 600/700 are the light-mode text shades, 300/400 the
  dark-mode ones: they are automatically darkened or lightened until they reach
  the WCAG threshold set in the `.env`. Shade 500 stays exactly the colour that
  was configured (it is mostly a fill), except on the neutral ramp.
- **Colours coming from data** (resolver steps, cached solutions) are not part of
  the palette: pass them through the `useReadableColor()` hook
  (`src/theme/useReadableColor.ts`) before rendering them.
- Run `npm run theme:check` after touching the palette: it prints the generated
  ramps and fails when a text/background pair falls below the threshold.

### 3ter. Responsive Breakpoints
- **< 640px (mobile)**: header wraps onto two rows, the tab group spans the full
  width, the course sidebar is an overlay drawer.
- **640px - 1023px (tablet)**: the sidebar stays an overlay drawer so the lesson
  keeps the full width; the floating "Prérequis" tab is hidden (the same action
  is available from the course card).
- **>= 1024px (`lg`, desktop)**: the sidebar becomes a static column and the
  brand wordmark appears.
- No element may make the page scroll horizontally: wide content (formulas, chip
  rows, tables) goes inside its own `overflow-x-auto` container, and pill rows
  use `flex-wrap`.

### 4. Data Storage
- There is no SQL/NoSQL database. All data (courses, exercises, caches, metrics) is stored in the `data/` directory as JSON files.
- **Important**: Because Vite watches all files by default, the `data/` directory is explicitly ignored in `vite.config.ts` to prevent infinite HMR reload loops when the Express server updates JSON files.

## Development Commands
- Start dev server: `./start.sh` or `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
