/**
 * Lecture et validation de la palette configuree dans le fichier `.env`.
 *
 * Ce module est volontairement pur (aucun acces a `import.meta` ni a `process`)
 * pour pouvoir etre utilise aussi bien cote navigateur que cote Node
 * (plugin Vite, script d'audit de contraste).
 */

import type { OklchRamp } from './referenceRamps';
import {
  REFERENCE_ACCENT,
  REFERENCE_DANGER,
  REFERENCE_HIGHLIGHT,
  REFERENCE_INFO,
  REFERENCE_NEUTRAL,
  REFERENCE_PRIMARY,
  REFERENCE_WARNING,
} from './referenceRamps';
import { oklchToHex, parseHex } from './colorMath';

export const THEME_ROLES = [
  'neutral',
  'primary',
  'accent',
  'info',
  'warning',
  'danger',
  'highlight',
] as const;

export type ThemeRole = (typeof THEME_ROLES)[number];

export const REFERENCE_RAMPS: Record<ThemeRole, OklchRamp> = {
  neutral: REFERENCE_NEUTRAL,
  primary: REFERENCE_PRIMARY,
  accent: REFERENCE_ACCENT,
  info: REFERENCE_INFO,
  warning: REFERENCE_WARNING,
  danger: REFERENCE_DANGER,
  highlight: REFERENCE_HIGHLIGHT,
};

/**
 * Familles Tailwind redirigees vers chaque role.
 *
 * Le code existant utilise indifferemment `slate` et `neutral`, `emerald` et
 * `green`, etc. En faisant pointer toutes ces familles vers une seule rampe, on
 * supprime les incoherences visuelles sans avoir a reecrire les milliers de
 * classes utilitaires deja presentes dans les composants.
 */
export const ROLE_FAMILIES: Record<ThemeRole, string[]> = {
  neutral: ['slate', 'gray', 'zinc', 'neutral', 'stone'],
  primary: ['emerald', 'green', 'teal', 'lime'],
  accent: ['indigo', 'violet', 'blue'],
  info: ['sky', 'cyan'],
  warning: ['amber', 'yellow', 'orange'],
  danger: ['red', 'rose'],
  highlight: ['fuchsia', 'purple', 'pink'],
};

export const ROLE_ENV_KEYS: Record<ThemeRole, string> = {
  neutral: 'VITE_THEME_NEUTRAL',
  primary: 'VITE_THEME_PRIMARY',
  accent: 'VITE_THEME_ACCENT',
  info: 'VITE_THEME_INFO',
  warning: 'VITE_THEME_WARNING',
  danger: 'VITE_THEME_DANGER',
  highlight: 'VITE_THEME_HIGHLIGHT',
};

export interface SurfaceConfig {
  canvas: string;
  surface: string;
  ink: string;
}

export interface ThemeConfig {
  /** Couleur pivot (nuance 500) de chaque role. */
  seeds: Record<ThemeRole, string>;
  light: SurfaceConfig;
  dark: SurfaceConfig;
  /** Contraste minimum pour le texte courant (WCAG AA = 4.5). */
  minContrastText: number;
  /** Contraste minimum pour le texte secondaire et les elements d'interface. */
  minContrastUi: number;
  /** Mode applique quand l'utilisateur n'a encore rien choisi. */
  defaultMode: 'light' | 'dark' | 'system';
  /** Messages produits lors de la lecture du `.env` (valeurs invalides, etc.). */
  warnings: string[];
}

export type ThemeEnv = Record<string, string | undefined>;

const DEFAULT_SEEDS: Record<ThemeRole, string> = THEME_ROLES.reduce((acc, role) => {
  acc[role] = oklchToHex(REFERENCE_RAMPS[role][500]);
  return acc;
}, {} as Record<ThemeRole, string>);

const DEFAULT_LIGHT: SurfaceConfig = {
  canvas: oklchToHex(REFERENCE_NEUTRAL[50]),
  surface: '#ffffff',
  ink: oklchToHex(REFERENCE_NEUTRAL[900]),
};

const DEFAULT_DARK: SurfaceConfig = {
  canvas: '#0b1120',
  surface: oklchToHex(REFERENCE_NEUTRAL[900]),
  ink: oklchToHex(REFERENCE_NEUTRAL[100]),
};

function readColor(
  env: ThemeEnv,
  key: string,
  fallback: string,
  warnings: string[]
): string {
  const raw = env[key];
  if (raw === undefined || raw.trim() === '') return fallback;

  const cleaned = raw.trim().replace(/^["']|["']$/g, '');
  const parsed = parseHex(cleaned);
  if (!parsed) {
    warnings.push(
      `${key}="${cleaned}" n'est pas une couleur hexadecimale valide (#rgb ou #rrggbb). Valeur par defaut utilisee : ${fallback}.`
    );
    return fallback;
  }
  return cleaned.startsWith('#') ? cleaned.toLowerCase() : `#${cleaned.toLowerCase()}`;
}

function readNumber(env: ThemeEnv, key: string, fallback: number, warnings: string[]): number {
  const raw = env[key];
  if (raw === undefined || raw.trim() === '') return fallback;

  const value = Number(raw.trim().replace(/^["']|["']$/g, ''));
  if (!Number.isFinite(value) || value < 1 || value > 21) {
    warnings.push(
      `${key}="${raw}" doit etre un rapport de contraste entre 1 et 21. Valeur par defaut utilisee : ${fallback}.`
    );
    return fallback;
  }
  return value;
}

export function readThemeConfig(env: ThemeEnv): ThemeConfig {
  const warnings: string[] = [];

  const seeds = THEME_ROLES.reduce((acc, role) => {
    acc[role] = readColor(env, ROLE_ENV_KEYS[role], DEFAULT_SEEDS[role], warnings);
    return acc;
  }, {} as Record<ThemeRole, string>);

  const rawMode = (env.VITE_THEME_DEFAULT_MODE || '').trim().replace(/^["']|["']$/g, '');
  const defaultMode =
    rawMode === 'light' || rawMode === 'dark' || rawMode === 'system' ? rawMode : 'dark';
  if (rawMode && rawMode !== defaultMode) {
    warnings.push(
      `VITE_THEME_DEFAULT_MODE="${rawMode}" est invalide (valeurs acceptees : light, dark, system). "dark" utilise.`
    );
  }

  return {
    seeds,
    light: {
      canvas: readColor(env, 'VITE_THEME_LIGHT_CANVAS', DEFAULT_LIGHT.canvas, warnings),
      surface: readColor(env, 'VITE_THEME_LIGHT_SURFACE', DEFAULT_LIGHT.surface, warnings),
      ink: readColor(env, 'VITE_THEME_LIGHT_INK', DEFAULT_LIGHT.ink, warnings),
    },
    dark: {
      canvas: readColor(env, 'VITE_THEME_DARK_CANVAS', DEFAULT_DARK.canvas, warnings),
      surface: readColor(env, 'VITE_THEME_DARK_SURFACE', DEFAULT_DARK.surface, warnings),
      ink: readColor(env, 'VITE_THEME_DARK_INK', DEFAULT_DARK.ink, warnings),
    },
    minContrastText: readNumber(env, 'VITE_THEME_MIN_CONTRAST', 4.5, warnings),
    minContrastUi: readNumber(env, 'VITE_THEME_MIN_CONTRAST_UI', 3, warnings),
    defaultMode,
    warnings,
  };
}

export { DEFAULT_SEEDS, DEFAULT_LIGHT, DEFAULT_DARK };
