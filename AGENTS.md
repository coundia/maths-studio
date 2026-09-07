# 🤖 Math3D Studio - Agent Instructions

Welcome to the Math3D Studio codebase! This file (`AGENTS.md`) contains the core rules, architectural guidelines, and context that AI agents must follow when modifying or extending this project.

## 🎯 Project Overview
Math3D Studio is an interactive, animated Mathematics learning platform tailored for the Senegalese curriculum (4ème and 3ème / BFEM preparation). It features 3D geometry visualizers, algebraic solvers, and interactive lessons.

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4.
- **Visuals**: Three.js (for 3D Geometry), KaTeX (for LaTeX rendering), Framer Motion (`motion`).
- **Backend**: Express (Node.js) with JSON-based file storage (no traditional database).
- **AI Integration**: Google Gemini API (`@google/genai`) for fallback algebraic resolutions.

## 🏗️ Core Architectural Rules

### 1. The 3-Tier Resolution Pipeline
When modifying the algebra resolver (`server/resolve` endpoint), you must respect the 3-tier architecture:
1. **Tier 1 (Cache)**: SHA-256 hash lookup in `data/math3d_cache.json` (< 50ms).
2. **Tier 2 (Heuristics)**: Deterministic, offline calculation for standard expansions and factorizations (< 15ms).
3. **Tier 3 (AI Fallback)**: Gemini API call for complex/unknown expressions, with immediate atomic caching to avoid duplicate calls.

### 2. UI/UX Design System
- **Glassmorphism**: Use `backdrop-blur` and semi-transparent backgrounds (`bg-white/70`, `bg-slate-900/70`) for containers, headers, and sidebars.
- **Vibrant Colors & Gradients**: Use modern Tailwind gradients (e.g., `from-emerald-500 to-indigo-500`) rather than flat primary colors.
- **Micro-animations**: Interactive elements (buttons, cards) must have scale animations (`hover:scale-[1.01] active:scale-95 transition-all`).
- **Dark Mode**: The app supports light and dark modes via a custom theme toggle. Always ensure components have `dark:` variants configured harmoniously.

### 3. Data Storage
- There is no SQL/NoSQL database. All data (courses, exercises, caches, metrics) is stored in the `data/` directory as JSON files.
- **Important**: Because Vite watches all files by default, the `data/` directory is explicitly ignored in `vite.config.ts` to prevent infinite HMR reload loops when the Express server updates JSON files.

## 💻 Development Commands
- Start dev server: `./start.sh` or `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
