import { ExpressionSolution, StudioMetrics } from '../../types.js';

const CACHE_KEY = 'math3d_cache';
const METRICS_KEY = 'math3d_metrics';
const BOARD_SETTINGS_KEY = 'math3d_board_settings';

interface StoredData {
  solutions: Record<string, ExpressionSolution>;
  accessCount: Record<string, number>;
}

interface RawMetrics {
  totalRequests: number;
  cacheHits: number;
  heuristicResolutions: number;
  aiCalls: number;
  stepsCompleted: number;
  totalStepsViewed: number;
}

let memoryCache: StoredData = {
  solutions: {},
  accessCount: {},
};

let metrics: RawMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  heuristicResolutions: 0,
  aiCalls: 0,
  stepsCompleted: 0,
  totalStepsViewed: 0,
};

// Initialization: we can fetch default cache from public/data/ if memoryCache is empty,
// but for simplicity we rely on localStorage first.
try {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    memoryCache = JSON.parse(cachedData);
  } else {
    // Optionally fetch initial cache from public/data/math3d_cache.json if needed
    // This could be done asynchronously in a real initialization step.
    fetch('/data/math3d_cache.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.solutions) {
          memoryCache = { ...memoryCache, ...data };
          localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
        }
      })
      .catch(() => {});
  }
} catch (e) {
  console.warn('Could not load cache from localStorage:', e);
}

try {
  const metricsData = localStorage.getItem(METRICS_KEY);
  if (metricsData) {
    metrics = { ...metrics, ...JSON.parse(metricsData) };
  }
} catch (e) {
  console.warn('Could not load metrics from localStorage:', e);
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
  } catch (err) {
    console.error('Error saving cache to localStorage:', err);
  }
}

function saveMetrics() {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
  } catch (err) {
    console.error('Error saving metrics to localStorage:', err);
  }
}

export function getCachedSolution(hash: string): ExpressionSolution | null {
  if (memoryCache.solutions[hash]) {
    memoryCache.accessCount[hash] = (memoryCache.accessCount[hash] || 0) + 1;
    metrics.totalRequests += 1;
    metrics.cacheHits += 1;
    saveMetrics();
    return memoryCache.solutions[hash];
  }
  return null;
}

export function saveSolution(solution: ExpressionSolution): void {
  memoryCache.solutions[solution.id] = solution;
  memoryCache.accessCount[solution.id] = (memoryCache.accessCount[solution.id] || 0) + 1;
  saveCache();
}

export function recordResolution(source: 'heuristic' | 'ai'): void {
  metrics.totalRequests += 1;
  if (source === 'heuristic') {
    metrics.heuristicResolutions += 1;
  } else if (source === 'ai') {
    metrics.aiCalls += 1;
  }
  saveMetrics();
}

export function recordStepView(isCompletion: boolean): void {
  metrics.totalStepsViewed += 1;
  if (isCompletion) {
    metrics.stepsCompleted += 1;
  }
  saveMetrics();
}

export function getMetrics(): StudioMetrics {
  const total = Math.max(metrics.totalRequests, 1);
  const cacheHitRate = Math.round((metrics.cacheHits / total) * 100);
  const heuristicRate = Math.round((metrics.heuristicResolutions / total) * 100);
  const aiCallRate = Math.round((metrics.aiCalls / total) * 100);
  const stepsTotal = Math.max(metrics.totalStepsViewed, 1);
  const completionRate = Math.round((metrics.stepsCompleted / stepsTotal) * 100);

  return {
    ...metrics,
    cacheHitRate,
    heuristicRate,
    aiCallRate,
    completionRate,
  };
}

export function getAllCachedSolutions(): ExpressionSolution[] {
  return Object.values(memoryCache.solutions).sort((a, b) => {
    return new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime();
  });
}

export function getStoredBoardSettings(): any | null {
  try {
    const data = localStorage.getItem(BOARD_SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading board settings from localStorage:', err);
  }
  return null;
}

export function saveBoardSettingsToDisk(settings: any): boolean {
  try {
    localStorage.setItem(BOARD_SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Error saving board settings to localStorage:', err);
    return false;
  }
}
