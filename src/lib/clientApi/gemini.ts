import { GoogleGenAI, Type } from '@google/genai';
import { ExpressionSolution, MathStep } from '../src/types.js';
import { computeExpressionHash } from './heuristics.js';

let aiClient: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

function getGenAI(userApiKey?: string): GoogleGenAI {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Une clé API Gemini est requise. Veuillez la configurer dans les paramètres (icône Engrenage).');
  }
  
  if (aiClient && currentApiKey === apiKey) {
    return aiClient;
  }
  
  currentApiKey = apiKey;
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  
  return aiClient;
}

/**
 * Sanitize user input to avoid prompt injection and keep algebra query safe
 */
export function sanitizeAlgebraInput(input: string): string {
  if (!input) return '';
  // Limit length
  const trimmed = input.slice(0, 100);
  // Strip control characters, keep standard mathematical symbols and alphanumeric
  return trimmed.replace(/[^\w\s\+\-\*\/\^\(\)\[\]\{\}\=\.\,\:\<\>]/g, '');
}

/**
 * FR-06: Fallback IA Unique (JSON strict, temperature 0.0)
 * Solves any general polynomial, difference of cubes, quadratic with leading coefficient, etc.
 */
export async function solveByGeminiAI(
  rawExpr: string,
  normalizedExpr: string,
  operationType: string,
  aiToken?: string,
  aiIncludeComments: boolean = true
): Promise<ExpressionSolution> {
  const startTime = Date.now();
  const hash = await computeExpressionHash(operationType, normalizedExpr);
  const ai = getGenAI(aiToken);

  const commentRule = aiIncludeComments 
    ? "2. Décompose l'explication en 3 à 5 étapes pédagogiques claires adaptées à un lycéen ou étudiant (Persona Amadou)."
    : "2. INTERDICTION D'UTILISER DU TEXTE. Ne fournis AUCUN commentaire, explication ou texte narratif. Le champ 'explanation' DOIT être vide. Fournis UNIQUEMENT les formules mathématiques.";

  const prompt = `Tu es le moteur mathématique de Math3D Studio. Décompose pas-à-pas la factorisation ou résolution de l'expression suivante : "${normalizedExpr}" (Type d'opération demandée : ${operationType}).

RÈGLES STRICTES :
1. ATTENTION : Réfléchis méthodiquement (Chain of Thought) pour garantir que ton calcul algébrique est 100% exact. Ne fais pas d'erreur de signe, de développement ou de factorisation. Vérifie ton calcul mentalement avant de l'écrire.
${commentRule}
3. Pour chaque étape, associe une interprétation spatiale et géométrique 3D (aires, volumes, découpes, réagencements de blocs).
4. Toutes les formules LaTeX DOIVENT être fournies SANS délimiteurs "$" ou "$$".
5. Spécifie pour chaque étape le type visuel 3D parmi : "difference_of_squares_3d", "perfect_square_3d", "common_factor_3d", "grouped_blocks_3d", "quadratic_tiles_3d", "generic_algebra_3d".
6. Spécifie l'action géométrique parmi : "initial_state", "slice_cut", "separate", "rearrange", "highlight", "final_factored".
7. Langue : Français soigné et rigoureux.
8. Notation de multiplication : utilise TOUJOURS \\times (symbole ×) et JAMAIS \\cdot (point) dans les formules LaTeX.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      temperature: 0.0,
      responseMimeType: 'application/json',
      systemInstruction: 'Tu es un expert en algèbre et didactique des mathématiques avec visualisation géométrique 3D.',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: 'Brève synthèse pédagogique de la méthode de résolution.',
          },
          finalFormLatex: {
            type: Type.STRING,
            description: 'Formule factorisée finale au format LaTeX pur sans dollars.',
          },
          steps: {
            type: Type.ARRAY,
            description: 'Liste ordonnée des étapes de factorisation et de démonstration géométrique 3D.',
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                appliedRule: { type: Type.STRING },
                latex: { type: Type.STRING },
                visualState: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: 'Type de visualisation 3D parmi: difference_of_squares_3d, perfect_square_3d, common_factor_3d, grouped_blocks_3d, quadratic_tiles_3d, generic_algebra_3d',
                    },
                    action: {
                      type: Type.STRING,
                      description: 'Action géométrique parmi: initial_state, slice_cut, separate, rearrange, highlight, final_factored',
                    },
                    dimensions: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        a: { type: Type.NUMBER },
                        b: { type: Type.NUMBER },
                        depth: { type: Type.NUMBER },
                      },
                      required: ['x', 'a'],
                    },
                  },
                  required: ['type', 'action', 'dimensions'],
                },
              },
              required: ['stepNumber', 'title', 'explanation', 'appliedRule', 'latex', 'visualState'],
            },
          },
        },
        required: ['summary', 'finalFormLatex', 'steps'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Réponse vide du modèle de calcul IA.');
  }

  const parsed = JSON.parse(text);

  // Validate and sanitize parsed steps
  const steps: MathStep[] = (parsed.steps || []).map((st: any, idx: number) => ({
    stepNumber: st.stepNumber || idx + 1,
    title: st.title || `Étape ${idx + 1}`,
    explanation: st.explanation || '',
    appliedRule: st.appliedRule || 'Propriété algébrique',
    latex: (st.latex || '').replace(/\$/g, '').replace(/\\cdot\b/g, '\\times').replace(/\\cdotp\b/g, '\\times').replace(/·/g, ' \\times '),
    visualState: {
      type: st.visualState?.type || 'grouped_blocks_3d',
      action: st.visualState?.action || 'initial_state',
      dimensions: {
        x: Number(st.visualState?.dimensions?.x) || 4,
        a: Number(st.visualState?.dimensions?.a) || 2,
        b: Number(st.visualState?.dimensions?.b) || 1,
        depth: Number(st.visualState?.dimensions?.depth) || 0.8,
      },
      cutoutProgress: st.visualState?.action === 'final_factored' ? 1.0 : (idx / (parsed.steps.length || 1)),
      slideProgress: st.visualState?.action === 'final_factored' ? 1.0 : (idx / (parsed.steps.length || 1)),
      rotationAngle: st.visualState?.action === 'final_factored' ? Math.PI / 2 : 0,
      labels: [
        { text: `Étape ${idx + 1}`, position: [0, -2.4, 0], color: '#38bdf8' },
      ],
    },
  }));

  return {
    id: hash,
    rawExpression: rawExpr,
    normalizedExpression: normalizedExpr,
    operationType: operationType as any,
    finalFormLatex: (parsed.finalFormLatex || '').replace(/\$/g, '').replace(/\\cdot\b/g, '\\times').replace(/\\cdotp\b/g, '\\times').replace(/·/g, ' \\times '),
    summary: parsed.summary || 'Résolution et factorisation complétée.',
    source: 'ai',
    cachedAt: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    steps,
  };
}
