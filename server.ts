import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { normalizeExpression, computeExpressionHash, solveByHeuristic } from './server/heuristics.js';
import { solveByGeminiAI, sanitizeAlgebraInput } from './server/gemini.js';
import {
  getCachedSolution,
  saveSolution,
  recordResolution,
  recordStepView,
  getMetrics,
  getAllCachedSolutions,
  getStoredBoardSettings,
  saveBoardSettingsToDisk,
} from './server/storage.js';
import {
  getCoursesHandler,
  getCourseByIdHandler,
  getExercisesHandler,
  getChapterExercisesHandler,
} from './server/courseApi.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Math3D Studio Resolver', timestamp: new Date().toISOString() });
  });

  // Decoupled Courses & Exercises REST API (JSON backed)
  app.get('/api/courses', getCoursesHandler);
  app.get('/api/courses/:id', getCourseByIdHandler);
  app.get('/api/exercises', getExercisesHandler);
  app.get('/api/exercises/:chapterId', getChapterExercisesHandler);

  // KPI Metrics endpoint
  app.get('/api/metrics', (req, res) => {
    res.json(getMetrics());
  });

  // Cached expression history
  app.get('/api/history', (req, res) => {
    const list = getAllCachedSolutions();
    res.json(list.slice(0, 30));
  });

  // Board Settings storage endpoints
  app.get('/api/board/settings', (req, res) => {
    const settings = getStoredBoardSettings();
    res.json({ status: 'ok', settings: settings || null });
  });

  app.post('/api/board/settings', (req, res) => {
    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload' });
    }
    const saved = saveBoardSettingsToDisk(newSettings);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to write settings to disk' });
    }
    res.json({ status: 'ok', settings: newSettings });
  });

  // Step Completion tracking for KPI (FR-10, Section 7)
  app.post('/api/step-complete', (req, res) => {
    const { isCompletion } = req.body || {};
    recordStepView(Boolean(isCompletion));
    res.json({ status: 'recorded' });
  });

  // Core 3-tier Resolver Pipeline (FR-01 to FR-07)
  app.post('/api/resolve', async (req, res) => {
    const startTime = Date.now();
    try {
      const rawExpression = sanitizeAlgebraInput(req.body?.expression || '');
      const operationType = req.body?.operationType || 'factorization';

      if (!rawExpression) {
        return res.status(400).json({ error: "L'expression mathématique ne peut pas être vide." });
      }

      // FR-02: Normalization
      const normalized = normalizeExpression(rawExpression);
      if (!normalized) {
        return res.status(400).json({ error: "Expression invalide après normalisation." });
      }

      // FR-03: SHA-256 Hash
      const hash = computeExpressionHash(operationType, normalized);

      // TIER 1: Cache (FR-04) - Target < 50 ms
      const cached = getCachedSolution(hash);
      if (cached) {
        const latency = Date.now() - startTime;
        return res.json({
          ...cached,
          source: 'cache',
          latencyMs: latency,
        });
      }

      // TIER 2: Deterministic Heuristic (FR-05) - Target < 15 ms, 0 AI calls
      const heuristicSolution = solveByHeuristic(rawExpression, normalized, operationType);
      if (heuristicSolution) {
        heuristicSolution.latencyMs = Date.now() - startTime;
        // FR-07: Immediate atomic persistence
        saveSolution(heuristicSolution);
        recordResolution('heuristic');
        return res.json(heuristicSolution);
      }

      // TIER 3: Fallback IA Unique (FR-06) - Zero calculation redundancy
      // Only 1 call per unique problem, temperature 0.0, strict JSON schema
      try {
        const aiSolution = await solveByGeminiAI(rawExpression, normalized, operationType);
        aiSolution.latencyMs = Date.now() - startTime;
        // FR-07: Immediate atomic persistence
        saveSolution(aiSolution);
        recordResolution('ai');
        return res.json(aiSolution);
      } catch (aiErr: any) {
        console.error('Gemini API Error in fallback resolver:', aiErr);
        // If Gemini fails (e.g. no key or network issue), provide an educational fallback response
        const fallbackSteps = [
          {
            stepNumber: 1,
            title: "Analyse symbolique de l'expression",
            explanation: `L'expression "${rawExpression}" a été normalisée en "${normalized}".`,
            appliedRule: "Analyse polynomiale",
            latex: normalized,
            visualState: {
              type: 'generic_algebra_3d' as const,
              action: 'initial_state' as const,
              dimensions: { x: 4, a: 2, depth: 0.8 },
              labels: [{ text: normalized, position: [0, 0, 0.6] as [number, number, number], color: "#38bdf8" }],
            },
          }
        ];
        const errorFallback = {
          id: hash,
          rawExpression,
          normalizedExpression: normalized,
          operationType,
          finalFormLatex: normalized,
          summary: `Expression analysée (${aiErr?.message || 'Mode hors-ligne'}).`,
          source: 'heuristic' as const,
          cachedAt: new Date().toISOString(),
          latencyMs: Date.now() - startTime,
          steps: fallbackSteps,
        };
        return res.json(errorFallback);
      }
    } catch (err: any) {
      console.error('Resolution Pipeline Error:', err);
      res.status(500).json({ error: err.message || 'Erreur interne de résolution.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Math3D Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
