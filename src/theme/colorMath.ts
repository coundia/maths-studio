/**
 * Utilitaires de couleur (sRGB <-> OKLab/OKLCH) utilises pour generer la palette.
 *
 * Tout passe par OKLCH car c'est un espace perceptuellement uniforme : deux
 * couleurs de meme luminosite (L) y paraissent aussi claires l'une que l'autre.
 * C'est ce qui permet de garantir la coherence fond / texte quelle que soit la
 * teinte choisie dans le fichier .env.
 */

export interface Rgb {
  /** 0..1 */
  r: number;
  /** 0..1 */
  g: number;
  /** 0..1 */
  b: number;
}

export interface Oklch {
  /** Luminosite perceptuelle, 0..1 */
  l: number;
  /** Chroma (saturation), 0..~0.4 */
  c: number;
  /** Teinte en degres, 0..360 */
  h: number;
}

const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

/** Convertit "#rgb", "#rrggbb" ou "rrggbb" en composantes 0..1. */
export function parseHex(input: string): Rgb | null {
  const raw = input.trim().replace(/^#/, '');
  const hex =
    raw.length === 3
      ? raw
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : raw;

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;

  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(clamp(value, 0, 1) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

const srgbToLinear = (value: number): number =>
  value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const linearToSrgb = (value: number): number =>
  value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const chroma = Math.sqrt(okA * okA + okB * okB);
  const hue = chroma < 1e-6 ? 0 : (Math.atan2(okB, okA) * 180) / Math.PI;

  return { l: okL, c: chroma, h: hue < 0 ? hue + 360 : hue };
}

/** Conversion brute : le resultat peut sortir du gamut sRGB (canaux hors 0..1). */
export function oklchToRgbRaw({ l, c, h }: Oklch): Rgb {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const bb = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = l - 0.0894841775 * a - 1.291485548 * bb;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  return {
    r: linearToSrgb(4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube),
    g: linearToSrgb(-1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube),
    b: linearToSrgb(-0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube),
  };
}

const inGamut = ({ r, g, b }: Rgb, epsilon = 0.001): boolean =>
  r >= -epsilon && r <= 1 + epsilon && g >= -epsilon && g <= 1 + epsilon && b >= -epsilon && b <= 1 + epsilon;

/**
 * Ramene une couleur OKLCH dans le gamut sRGB en reduisant la chroma
 * (recherche dichotomique). La luminosite et la teinte sont preservees,
 * ce qui garde les rapports de contraste intacts.
 */
export function oklchToRgb(color: Oklch): Rgb {
  const l = clamp(color.l, 0, 1);
  const direct = oklchToRgbRaw({ ...color, l });
  if (inGamut(direct)) {
    return { r: clamp(direct.r, 0, 1), g: clamp(direct.g, 0, 1), b: clamp(direct.b, 0, 1) };
  }

  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToRgbRaw({ l, c: mid, h: color.h }))) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const mapped = oklchToRgbRaw({ l, c: low, h: color.h });
  return { r: clamp(mapped.r, 0, 1), g: clamp(mapped.g, 0, 1), b: clamp(mapped.b, 0, 1) };
}

export const oklchToHex = (color: Oklch): string => toHex(oklchToRgb(color));

export const hexToOklch = (hex: string, fallback: Oklch = { l: 0.5, c: 0, h: 0 }): Oklch => {
  const rgb = parseHex(hex);
  return rgb ? rgbToOklch(rgb) : fallback;
};

/** Luminance relative WCAG 2.1. */
export function relativeLuminance(rgb: Rgb): number {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapport de contraste WCAG entre deux couleurs hex (1 a 21). */
export function contrastRatio(foreground: string, background: string): number {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return 1;

  const lumFg = relativeLuminance(fg);
  const lumBg = relativeLuminance(bg);
  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Ajuste la luminosite d'une couleur (en OKLCH) jusqu'a atteindre le rapport de
 * contraste demande face au fond. La teinte est conservee : on ne change que la
 * clarte, dans la direction qui eloigne du fond.
 *
 * Retourne la couleur d'origine si l'objectif est deja atteint, ou la meilleure
 * approximation trouvee (noir ou blanc perceptuel) si l'objectif est impossible.
 */
export function enforceContrast(foreground: string, background: string, minRatio: number): string {
  if (minRatio <= 1) return foreground;
  if (contrastRatio(foreground, background) >= minRatio) return foreground;

  const bgRgb = parseHex(background);
  const fgOklch = parseHex(foreground) ? rgbToOklch(parseHex(foreground)!) : null;
  if (!bgRgb || !fgOklch) return foreground;

  // On s'eloigne du fond : fond clair -> on assombrit, fond sombre -> on eclaircit.
  const goDarker = relativeLuminance(bgRgb) > 0.18;
  const target = goDarker ? 0 : 1;

  let best = foreground;
  let bestRatio = contrastRatio(foreground, background);

  // 40 pas suffisent pour un ecart de luminosite < 0.025.
  for (let step = 1; step <= 40; step += 1) {
    const ratioOfTravel = step / 40;
    const l = fgOklch.l + (target - fgOklch.l) * ratioOfTravel;
    // La chroma maximale atteignable diminue aux extremes : on la laisse au
    // mappeur de gamut, qui la reduira juste ce qu'il faut.
    const candidate = oklchToHex({ l, c: fgOklch.c, h: fgOklch.h });
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
    if (ratio >= minRatio) return candidate;
  }

  return best;
}

/** Choisit, entre plusieurs couleurs, celle qui contraste le mieux avec le fond. */
export function pickBestContrast(candidates: string[], background: string): string {
  let best = candidates[0];
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }
  return best;
}

/**
 * Variante d'`enforceContrast` travaillant directement en OKLCH, dans une
 * direction imposee. Utilisee pour caler les nuances d'une rampe sur un fond
 * donne sans jamais inverser l'ordre des nuances.
 */
export function enforceContrastOklch(
  color: Oklch,
  background: string,
  minRatio: number,
  direction: 'darker' | 'lighter'
): Oklch {
  if (minRatio <= 1) return color;
  if (contrastRatio(oklchToHex(color), background) >= minRatio) return color;

  const target = direction === 'darker' ? 0 : 1;
  let best = color;
  let bestRatio = contrastRatio(oklchToHex(color), background);

  for (let step = 1; step <= 60; step += 1) {
    const l = color.l + (target - color.l) * (step / 60);
    const candidate: Oklch = { l, c: color.c, h: color.h };
    const ratio = contrastRatio(oklchToHex(candidate), background);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
    if (ratio >= minRatio) return candidate;
  }

  return best;
}

export { clamp };
