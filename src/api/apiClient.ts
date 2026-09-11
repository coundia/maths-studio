import { ExpressionSolution, StudioMetrics } from '../types';
import { resolveExpressionClient } from '../lib/clientApi/resolver';
import { getMetrics as getClientMetrics, getStoredBoardSettings, saveBoardSettingsToDisk, recordStepView } from '../lib/clientApi/storage';

/**
 * Helper function to determine if we are running in Static/Client Mode
 * The flag VITE_STATIC_MODE will be set to 'true' during the GitHub Pages build.
 */
const isStaticMode = () => import.meta.env.VITE_STATIC_MODE === 'true';

export const apiClient = {
  // --- Resolver ---
  async resolveExpression(
    expression: string,
    operationType: string = 'factorization',
    aiToken?: string,
    aiIncludeComments: boolean = true
  ): Promise<ExpressionSolution> {
    if (isStaticMode()) {
      return resolveExpressionClient(expression, operationType, aiToken, aiIncludeComments);
    }
    const response = await fetch('/api/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression, operationType, aiToken, aiIncludeComments }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur lors de la résolution.');
    }
    return response.json();
  },

  // --- Board Settings ---
  async getBoardSettings(): Promise<{ status: string; settings: any }> {
    if (isStaticMode()) {
      return { status: 'ok', settings: getStoredBoardSettings() };
    }
    const res = await fetch('/api/board/settings');
    return res.json();
  },

  async saveBoardSettings(settings: any): Promise<{ status: string; settings: any }> {
    if (isStaticMode()) {
      saveBoardSettingsToDisk(settings);
      return { status: 'ok', settings };
    }
    const res = await fetch('/api/board/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // --- Metrics ---
  async getMetrics(): Promise<StudioMetrics> {
    if (isStaticMode()) {
      return getClientMetrics();
    }
    const res = await fetch('/api/metrics');
    return res.json();
  },

  async recordStepComplete(isCompletion: boolean): Promise<void> {
    if (isStaticMode()) {
      recordStepView(isCompletion);
      return;
    }
    await fetch('/api/step-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompletion }),
    });
  },

  // --- Data Fetching (Courses, Exercises) ---
  async getCourses(): Promise<any[]> {
    if (isStaticMode()) {
        const [c5, c4, c3] = await Promise.all([
          fetch('/data/courses-5e.json').then(r => r.json()).catch(() => []),
          fetch('/data/courses-4e.json').then(r => r.json()).catch(() => []),
          fetch('/data/courses-3e.json').then(r => r.json()).catch(() => [])
        ]);
        return [
          ...c3.map((c: any) => ({ ...c, gradeLevel: '3e' })),
          ...c4.map((c: any) => ({ ...c, gradeLevel: '4e' })),
          ...c5.map((c: any) => ({ ...c, gradeLevel: '5e' }))
        ];
    }
    const res = await fetch('/api/courses');
    return res.json();
  },

  async getExercises(): Promise<any> {
    if (isStaticMode()) {
        const [e5, e4, e3] = await Promise.all([
          fetch('/data/exercises-5e.json').then(r => r.json()).catch(() => ({})),
          fetch('/data/exercises-4e.json').then(r => r.json()).catch(() => ({})),
          fetch('/data/exercises-3e.json').then(r => r.json()).catch(() => ({}))
        ]);
        return { ...e5, ...e4, ...e3 };
    }
    const res = await fetch('/api/exercises');
    return res.json();
  }
};
