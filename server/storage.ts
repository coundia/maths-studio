import fs from 'fs';
import path from 'path';
import { ExpressionSolution, StudioMetrics } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(DATA_DIR, 'math3d_cache.json');
const METRICS_FILE = path.join(DATA_DIR, 'math3d_metrics.json');
const BOARD_SETTINGS_FILE = path.join(DATA_DIR, 'board_settings.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// Load initial data if exists
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    memoryCache = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not load cache file, starting fresh:', e);
}

try {
  if (fs.existsSync(METRICS_FILE)) {
    const raw = fs.readFileSync(METRICS_FILE, 'utf-8');
    metrics = { ...metrics, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('Could not load metrics file, starting fresh:', e);
}

function saveCacheToDisk() {
  try {
    const tempFile = `${CACHE_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(memoryCache, null, 2), 'utf-8');
    fs.renameSync(tempFile, CACHE_FILE);
  } catch (err) {
    console.error('Error persisting cache to disk:', err);
  }
}

function saveMetricsToDisk() {
  try {
    const tempFile = `${METRICS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(metrics, null, 2), 'utf-8');
    fs.renameSync(tempFile, METRICS_FILE);
  } catch (err) {
    console.error('Error persisting metrics to disk:', err);
  }
}

export function getCachedSolution(hash: string): ExpressionSolution | null {
  if (memoryCache.solutions[hash]) {
    memoryCache.accessCount[hash] = (memoryCache.accessCount[hash] || 0) + 1;
    metrics.totalRequests += 1;
    metrics.cacheHits += 1;
    saveMetricsToDisk();
    return memoryCache.solutions[hash];
  }
  return null;
}

export function saveSolution(solution: ExpressionSolution): void {
  memoryCache.solutions[solution.id] = solution;
  memoryCache.accessCount[solution.id] = (memoryCache.accessCount[solution.id] || 0) + 1;
  saveCacheToDisk();
}

export function recordResolution(source: 'heuristic' | 'ai'): void {
  metrics.totalRequests += 1;
  if (source === 'heuristic') {
    metrics.heuristicResolutions += 1;
  } else if (source === 'ai') {
    metrics.aiCalls += 1;
  }
  saveMetricsToDisk();
}

export function recordStepView(isCompletion: boolean): void {
  metrics.totalStepsViewed += 1;
  if (isCompletion) {
    metrics.stepsCompleted += 1;
  }
  saveMetricsToDisk();
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
    if (fs.existsSync(BOARD_SETTINGS_FILE)) {
      const raw = fs.readFileSync(BOARD_SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading board settings from disk:', err);
  }
  return null;
}

export function saveBoardSettingsToDisk(settings: any): boolean {
  try {
    const tempFile = `${BOARD_SETTINGS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(settings, null, 2), 'utf-8');
    fs.renameSync(tempFile, BOARD_SETTINGS_FILE);
    return true;
  } catch (err) {
    console.error('Error persisting board settings to disk:', err);
    return false;
  }
}
