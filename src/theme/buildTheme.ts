/**
 * Construction de la palette complete a partir de la configuration `.env`.
 *
 * Deux sorties :
 *  1. les rampes 50 -> 950 de chaque role, injectees sur les variables
 *     `--color-<famille>-<nuance>` de Tailwind v4 (toutes les classes
 *     `bg-slate-800`, `text-emerald-400`, ... suivent automatiquement) ;
 *  2. des jetons semantiques (`--color-canvas`, `--color-ink`, ...) dont le
 *     contraste fond / texte est verifie et corrige automatiquement.
 */

import {
  contrastRatio,
  enforceContrast,
  enforceContrastOklch,
  hexToOklch,
  oklchToHex,
  pickBestContrast,
} from './colorMath';
import { RAMP_STOPS, type OklchRamp, type Ramp, type RampStop } from './referenceRamps';
import {
  REFERENCE_RAMPS,
  ROLE_FAMILIES,
  THEME_ROLES,
  readThemeConfig,
  type ThemeConfig,
  type ThemeEnv,
  type ThemeRole,
} from './themeConfig';

const WHITE = '#ffffff';

/** Roles colores (tout sauf le neutre), qui recoivent les jetons semantiques. */
export const ACCENT_ROLES = THEME_ROLES.filter((role) => role !== 'neutral') as Exclude<
  ThemeRole,
  'neutral'
>[];

/**
 * Derive une rampe complete depuis une couleur pivot.
 *
 * On garde l'echelle de luminosite de la rampe de reference (elle est calibree
 * pour que 600 sur blanc et 300 sur noir restent lisibles) et on n'applique que
 * la teinte et la saturation de la couleur choisie. Un decalage de luminosite
 * attenue vers les extremites permet quand meme a la nuance 500 de ressembler a
 * la couleur demandee.
 */
export function deriveRampOklch(seedHex: string, reference: OklchRamp): OklchRamp {
  const seed = hexToOklch(seedHex);
  const pivot = reference[500];

  const hueShift = seed.c < 0.01 ? 0 : seed.h - pivot.h;
  const chromaScale = pivot.c < 1e-6 ? 1 : Math.min(seed.c / pivot.c, 3);
  const lightnessShift = Math.max(-0.12, Math.min(0.12, seed.l - pivot.l));

  const result = {} as OklchRamp;
  RAMP_STOPS.forEach((stop, index) => {
    const ref = reference[stop];
    // Poids 1 sur la nuance 500 (index 5), 0 sur les extremites 50 et 950.
    const weight = 1 - Math.abs(index - 5) / 5;
    result[stop] = {
      l: Math.max(0.03, Math.min(0.99, ref.l + lightnessShift * weight)),
      c: Math.max(0, ref.c * chromaScale),
      h: ref.h + hueShift,
    };
  });

  return result;
}

/**
 * Nuances utilisees comme couleur de texte, et fond sur lequel elles doivent
 * rester lisibles. C'est la cle de la coherence fond / texte : le code ecrit
 * `text-emerald-600 dark:text-emerald-400`, donc la nuance 600 doit contraster
 * sur le fond clair et la nuance 400 sur le fond sombre.
 */
const TEXT_ANCHORS = {
  /** Lisibles sur le fond clair : on les assombrit si besoin. */
  onLight: [700, 600] as RampStop[],
  /** Lisibles sur le fond sombre : on les eclaircit si besoin. */
  onDark: [300, 400] as RampStop[],
};

const MIN_STEP = 0.012;

/**
 * Cale la rampe sur les fonds reels.
 *
 * Les nuances 600/700 sont assombries jusqu'a etre lisibles sur le fond clair,
 * les nuances 300/400 eclaircies jusqu'a etre lisibles sur le fond sombre, puis
 * les nuances voisines sont repoussees pour que l'echelle reste strictement
 * decroissante. Les corrections s'ecartent toujours du centre de la rampe :
 * elles ne peuvent donc pas se contredire.
 */
export function tuneRampForContrast(
  ramp: OklchRamp,
  config: ThemeConfig,
  backdrops: ThemeBackdrops,
  isNeutral = false
): OklchRamp {
  const tuned = { ...ramp };
  const clampL = (value: number) => Math.max(0.03, Math.min(0.99, value));

  for (const stop of TEXT_ANCHORS.onLight) {
    tuned[stop] = enforceContrastOklch(
      tuned[stop],
      backdrops.light,
      config.minContrastText,
      'darker'
    );
  }
  for (const stop of TEXT_ANCHORS.onDark) {
    tuned[stop] = enforceContrastOklch(
      tuned[stop],
      backdrops.dark,
      config.minContrastText,
      'lighter'
    );
  }
  // Sur la rampe neutre, la nuance 500 sert de texte secondaire en mode clair
  // (`text-slate-500 dark:text-slate-400`) : on la cale elle aussi. Sur les
  // rampes colorees elle reste exactement la couleur choisie dans le .env, ou
  // elle sert surtout de fond et d'element decoratif.
  if (isNeutral) {
    tuned[500] = enforceContrastOklch(
      tuned[500],
      backdrops.light,
      config.minContrastText,
      'darker'
    );
  }

  // Cascade vers le clair : 300 -> 200 -> 100 -> 50 ne doivent jamais etre plus sombres que 400.
  const lighterChain: RampStop[] = [400, 300, 200, 100, 50];
  for (let i = 1; i < lighterChain.length; i += 1) {
    const previous = tuned[lighterChain[i - 1]];
    const current = tuned[lighterChain[i]];
    if (current.l < previous.l + MIN_STEP) {
      tuned[lighterChain[i]] = { ...current, l: clampL(previous.l + MIN_STEP) };
    }
  }

  // Cascade vers le sombre : 700 -> 800 -> 900 -> 950 ne doivent jamais etre plus clairs que 600.
  const darkerChain: RampStop[] = [600, 700, 800, 900, 950];
  for (let i = 1; i < darkerChain.length; i += 1) {
    const previous = tuned[darkerChain[i - 1]];
    const current = tuned[darkerChain[i]];
    if (current.l > previous.l - MIN_STEP) {
      tuned[darkerChain[i]] = { ...current, l: clampL(previous.l - MIN_STEP) };
    }
  }

  // La nuance 500 est la couleur choisie dans le .env : on la conserve telle
  // quelle (c'est surtout un fond et un element decoratif), en verifiant
  // seulement qu'elle reste comprise entre 400 et 600.
  const upper = tuned[400].l - MIN_STEP;
  const lower = tuned[600].l + MIN_STEP;
  if (upper > lower) {
    tuned[500] = { ...tuned[500], l: Math.max(lower, Math.min(upper, tuned[500].l)) };
  }

  return tuned;
}

/**
 * Fonds de reference pour l'ajustement de contraste.
 *
 * Ce ne sont pas les fonds de page, mais les fonds les moins favorables que le
 * texte rencontre reellement : le plus sombre des fonds clairs et le plus clair
 * des fonds sombres. Une nuance calee sur eux reste lisible partout.
 */
export interface ThemeBackdrops {
  light: string;
  dark: string;
}

const toRamp = (oklchRamp: OklchRamp): Ramp => {
  const result = {} as Ramp;
  for (const stop of RAMP_STOPS) {
    result[stop] = oklchToHex(oklchRamp[stop]);
  }
  return result;
};

const darkest = (colors: string[]): string =>
  colors.reduce((acc, color) => (hexToOklch(color).l < hexToOklch(acc).l ? color : acc));

const lightest = (colors: string[]): string =>
  colors.reduce((acc, color) => (hexToOklch(color).l > hexToOklch(acc).l ? color : acc));

export function deriveRamp(
  seedHex: string,
  reference: OklchRamp,
  config?: ThemeConfig,
  backdrops?: ThemeBackdrops,
  isNeutral = false
): Ramp {
  const oklchRamp = deriveRampOklch(seedHex, reference);
  if (!config || !backdrops) return toRamp(oklchRamp);
  return toRamp(tuneRampForContrast(oklchRamp, config, backdrops, isNeutral));
}

/** Ajuste une couleur jusqu'a satisfaire le contraste minimum sur tous les fonds donnes. */
function enforceAgainstAll(foreground: string, backgrounds: string[], minRatio: number): string {
  let current = foreground;
  for (let pass = 0; pass < backgrounds.length + 1; pass += 1) {
    const worst = backgrounds.reduce(
      (acc, background) => {
        const ratio = contrastRatio(current, background);
        return ratio < acc.ratio ? { background, ratio } : acc;
      },
      { background: backgrounds[0], ratio: Number.POSITIVE_INFINITY }
    );

    if (worst.ratio >= minRatio) return current;
    const next = enforceContrast(current, worst.background, minRatio);
    if (next === current) return current;
    current = next;
  }
  return current;
}

export interface SemanticTokens {
  [token: string]: string;
}

export interface ContrastCheck {
  mode: 'light' | 'dark';
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  passes: boolean;
}

export interface BuiltTheme {
  config: ThemeConfig;
  /** Rampe par role. */
  ramps: Record<ThemeRole, Ramp>;
  /** Rampe par famille Tailwind (plusieurs familles pointent vers le meme role). */
  families: Record<string, Ramp>;
  light: SemanticTokens;
  dark: SemanticTokens;
  checks: ContrastCheck[];
  warnings: string[];
}

function buildModeTokens(
  mode: 'light' | 'dark',
  ramps: Record<ThemeRole, Ramp>,
  config: ThemeConfig
): SemanticTokens {
  const neutral = ramps.neutral;
  const isLight = mode === 'light';
  const surfaces = isLight ? config.light : config.dark;

  const canvas = surfaces.canvas;
  const surface = surfaces.surface;
  const surfaceMuted = isLight ? neutral[100] : neutral[800];
  const surfaceStrong = isLight ? neutral[200] : neutral[700];
  const backdrops = [canvas, surface, surfaceMuted];

  const ink = enforceAgainstAll(surfaces.ink, backdrops, config.minContrastText);
  const inkMuted = enforceAgainstAll(
    isLight ? neutral[600] : neutral[400],
    backdrops,
    config.minContrastText
  );
  const inkSubtle = enforceAgainstAll(
    isLight ? neutral[500] : neutral[500],
    backdrops,
    config.minContrastUi
  );

  const tokens: SemanticTokens = {
    canvas,
    surface,
    'surface-muted': surfaceMuted,
    'surface-strong': surfaceStrong,
    line: isLight ? neutral[200] : neutral[800],
    'line-strong': isLight ? neutral[300] : neutral[700],
    ink,
    'ink-muted': inkMuted,
    'ink-subtle': inkSubtle,
    'ink-invert': pickBestContrast([neutral[50], neutral[950]], ink),
  };

  for (const role of ACCENT_ROLES) {
    const ramp = ramps[role];
    const solid = isLight ? ramp[600] : ramp[500];
    const soft = isLight ? ramp[50] : ramp[950];

    tokens[role] = solid;
    tokens[`on-${role}`] = enforceContrast(
      pickBestContrast([WHITE, neutral[950]], solid),
      solid,
      config.minContrastUi
    );
    tokens[`${role}-ink`] = enforceAgainstAll(
      isLight ? ramp[700] : ramp[300],
      backdrops,
      config.minContrastText
    );
    tokens[`${role}-soft`] = soft;
    tokens[`${role}-line`] = isLight ? ramp[200] : ramp[800];
    tokens[`on-${role}-soft`] = enforceContrast(
      isLight ? ramp[800] : ramp[200],
      soft,
      config.minContrastText
    );
  }

  return tokens;
}

function collectChecks(
  mode: 'light' | 'dark',
  tokens: SemanticTokens,
  config: ThemeConfig
): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  const add = (pair: string, foreground: string, background: string, required: number) => {
    const ratio = contrastRatio(foreground, background);
    checks.push({
      mode,
      pair,
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      required,
      passes: ratio >= required - 0.005,
    });
  };

  for (const background of ['canvas', 'surface', 'surface-muted']) {
    add(`ink / ${background}`, tokens.ink, tokens[background], config.minContrastText);
    add(`ink-muted / ${background}`, tokens['ink-muted'], tokens[background], config.minContrastText);
    add(`ink-subtle / ${background}`, tokens['ink-subtle'], tokens[background], config.minContrastUi);
    for (const role of ACCENT_ROLES) {
      add(`${role}-ink / ${background}`, tokens[`${role}-ink`], tokens[background], config.minContrastText);
    }
  }

  for (const role of ACCENT_ROLES) {
    add(`on-${role} / ${role}`, tokens[`on-${role}`], tokens[role], config.minContrastUi);
    add(
      `on-${role}-soft / ${role}-soft`,
      tokens[`on-${role}-soft`],
      tokens[`${role}-soft`],
      config.minContrastText
    );
  }

  return checks;
}

/**
 * Verifie les nuances de rampe reellement employees comme couleur de texte dans
 * les composants (`text-emerald-600 dark:text-emerald-400`, `text-slate-400`...).
 */
function collectRampChecks(
  ramps: Record<ThemeRole, Ramp>,
  config: ThemeConfig,
  backdrops: ThemeBackdrops
): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  const add = (
    mode: 'light' | 'dark',
    pair: string,
    foreground: string,
    background: string,
    required: number
  ) => {
    const ratio = contrastRatio(foreground, background);
    checks.push({
      mode,
      pair,
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      required,
      passes: ratio >= required - 0.005,
    });
  };

  for (const role of THEME_ROLES) {
    for (const stop of [600, 700] as RampStop[]) {
      add('light', `${role}-${stop} / fond clair`, ramps[role][stop], backdrops.light, config.minContrastText);
    }
    for (const stop of [300, 400] as RampStop[]) {
      add('dark', `${role}-${stop} / fond sombre`, ramps[role][stop], backdrops.dark, config.minContrastText);
    }
    // La nuance 500 n'a pas le meme role selon la rampe : texte secondaire du
    // mode clair pour le gris, couleur de remplissage pour les rampes colorees.
    if (role === 'neutral') {
      add('light', `${role}-500 / fond clair`, ramps[role][500], backdrops.light, config.minContrastText);
    } else {
      add('dark', `${role}-500 / fond sombre`, ramps[role][500], backdrops.dark, config.minContrastUi);
    }
  }

  return checks;
}

export function buildTheme(env: ThemeEnv): BuiltTheme {
  const config = readThemeConfig(env);

  // Premiere passe : la rampe neutre fournit les fonds de cartes (100 en clair,
  // 800 en sombre) sur lesquels le reste de la palette devra rester lisible.
  const baseNeutral = deriveRamp(config.seeds.neutral, REFERENCE_RAMPS.neutral);
  const backdrops: ThemeBackdrops = {
    light: darkest([config.light.canvas, config.light.surface, baseNeutral[100]]),
    dark: lightest([config.dark.canvas, config.dark.surface, baseNeutral[800]]),
  };

  const ramps = THEME_ROLES.reduce((acc, role) => {
    acc[role] = deriveRamp(
      config.seeds[role],
      REFERENCE_RAMPS[role],
      config,
      backdrops,
      role === 'neutral'
    );
    return acc;
  }, {} as Record<ThemeRole, Ramp>);

  const families: Record<string, Ramp> = {};
  for (const role of THEME_ROLES) {
    for (const family of ROLE_FAMILIES[role]) {
      families[family] = ramps[role];
    }
  }

  const light = buildModeTokens('light', ramps, config);
  const dark = buildModeTokens('dark', ramps, config);

  const checks = [
    ...collectChecks('light', light, config),
    ...collectChecks('dark', dark, config),
    ...collectRampChecks(ramps, config, backdrops),
  ];
  const warnings = [...config.warnings];

  for (const check of checks) {
    if (!check.passes) {
      warnings.push(
        `Contraste insuffisant en mode ${check.mode} : ${check.pair} = ${check.ratio}:1 (minimum ${check.required}:1). Choisissez une couleur plus contrastee dans le .env.`
      );
    }
  }

  return { config, ramps, families, light, dark, checks, warnings };
}

const declarations = (tokens: SemanticTokens, indent = '  '): string =>
  Object.entries(tokens)
    .map(([name, value]) => `${indent}--color-${name}: ${value};`)
    .join('\n');

/**
 * Genere la feuille de style de la palette.
 *
 * Les regles ne sont volontairement placees dans aucune couche (`@layer`) :
 * en CSS, une regle hors couche l'emporte toujours sur une regle en couche, donc
 * ces variables ecrasent celles de Tailwind quel que soit l'ordre d'import.
 */
export function themeToCss(theme: BuiltTheme): string {
  const rampLines: string[] = [];
  for (const family of Object.keys(theme.families).sort()) {
    for (const stop of RAMP_STOPS) {
      rampLines.push(`  --color-${family}-${stop}: ${theme.families[family][stop as RampStop]};`);
    }
  }

  return [
    '/* Genere automatiquement depuis les variables VITE_THEME_* du fichier .env. */',
    '/* Ne pas editer a la main : modifiez le .env puis relancez le serveur. */',
    ':root {',
    rampLines.join('\n'),
    '',
    '  /* Jetons semantiques - mode clair */',
    declarations(theme.light),
    '}',
    '',
    ':root.dark {',
    '  /* Jetons semantiques - mode sombre */',
    declarations(theme.dark),
    '}',
    '',
  ].join('\n');
}
