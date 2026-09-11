import { ExpressionSolution } from '../../types.js';
import { normalizeExpression, computeExpressionHash, solveByHeuristic } from './heuristics.js';
import { solveByGeminiAI, sanitizeAlgebraInput } from './gemini.js';
import { getCachedSolution, saveSolution, recordResolution } from './storage.js';

export async function resolveExpressionClient(
  expression: string,
  operationType: string = 'factorization',
  aiToken?: string,
  aiIncludeComments: boolean = true
): Promise<ExpressionSolution> {
  const startTime = Date.now();
  const rawExpression = sanitizeAlgebraInput(expression || '');

  if (!rawExpression) {
    throw new Error("L'expression mathématique ne peut pas être vide.");
  }

  // FR-02: Normalization
  const normalized = normalizeExpression(rawExpression);
  if (!normalized) {
    throw new Error("Expression invalide après normalisation.");
  }

  // FR-03: SHA-256 Hash
  const hash = await computeExpressionHash(operationType, normalized);

  // TIER 1: Cache (FR-04)
  const cached = getCachedSolution(hash);
  if (cached) {
    return {
      ...cached,
      source: 'cache',
      latencyMs: Date.now() - startTime,
    };
  }

  // TIER 2: Deterministic Heuristic (FR-05)
  // Can be enabled if needed, matching server logic
  const heuristicSolution = await solveByHeuristic(rawExpression, normalized, operationType);
  if (heuristicSolution) {
    heuristicSolution.latencyMs = Date.now() - startTime;
    saveSolution(heuristicSolution);
    recordResolution('heuristic');
    return heuristicSolution;
  }

  // TIER 3: Fallback IA Unique (FR-06)
  try {
    const aiSolution = await solveByGeminiAI(rawExpression, normalized, operationType, aiToken, aiIncludeComments);
    aiSolution.latencyMs = Date.now() - startTime;
    saveSolution(aiSolution);
    recordResolution('ai');
    return aiSolution;
  } catch (aiErr: any) {
    console.error('Gemini API Error in client fallback resolver:', aiErr);
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
    return {
      id: hash,
      rawExpression,
      normalizedExpression: normalized,
      operationType: operationType as any,
      finalFormLatex: normalized,
      summary: `Expression analysée (${aiErr?.message || 'Mode hors-ligne'}).`,
      source: 'heuristic',
      cachedAt: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      steps: fallbackSteps,
    };
  }
}
