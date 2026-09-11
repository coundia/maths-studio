/**
 * Rampes de reference (valeurs OKLCH de Tailwind CSS v4).
 *
 * Elles servent de squelette : quand une couleur est configuree dans le `.env`,
 * on conserve l'echelle de luminosite de la rampe de reference (deja calibree
 * pour le contraste) et on ne deplace que la teinte et la saturation.
 */

import type { Oklch } from './colorMath';

export const RAMP_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type RampStop = (typeof RAMP_STOPS)[number];
export type Ramp = Record<RampStop, string>;
export type OklchRamp = Record<RampStop, Oklch>;

const ramp = (entries: Array<[number, number, number]>): OklchRamp => {
  const result = {} as OklchRamp;
  RAMP_STOPS.forEach((stop, index) => {
    const [l, c, h] = entries[index];
    result[stop] = { l, c, h };
  });
  return result;
};

/** Rampe neutre (base : slate). */
export const REFERENCE_NEUTRAL: OklchRamp = ramp([
  [0.984, 0.003, 247.858],
  [0.968, 0.007, 247.896],
  [0.929, 0.013, 255.508],
  [0.869, 0.022, 252.894],
  [0.704, 0.04, 256.788],
  [0.554, 0.046, 257.417],
  [0.446, 0.043, 257.281],
  [0.372, 0.044, 257.287],
  [0.279, 0.041, 260.031],
  [0.208, 0.042, 265.755],
  [0.129, 0.042, 264.695],
]);

/** Rampe primaire (base : emerald). */
export const REFERENCE_PRIMARY: OklchRamp = ramp([
  [0.979, 0.021, 166.113],
  [0.95, 0.052, 163.051],
  [0.905, 0.093, 164.15],
  [0.845, 0.143, 164.978],
  [0.765, 0.177, 163.223],
  [0.696, 0.17, 162.48],
  [0.596, 0.145, 163.225],
  [0.508, 0.118, 165.612],
  [0.432, 0.095, 166.913],
  [0.378, 0.077, 168.94],
  [0.262, 0.051, 172.552],
]);

/** Rampe accent (base : indigo). */
export const REFERENCE_ACCENT: OklchRamp = ramp([
  [0.962, 0.018, 272.314],
  [0.93, 0.034, 272.788],
  [0.87, 0.065, 274.039],
  [0.785, 0.115, 274.713],
  [0.673, 0.182, 276.935],
  [0.585, 0.233, 277.117],
  [0.511, 0.262, 276.966],
  [0.457, 0.24, 277.023],
  [0.398, 0.195, 277.366],
  [0.359, 0.144, 278.697],
  [0.257, 0.09, 281.288],
]);

/** Rampe information (base : sky). */
export const REFERENCE_INFO: OklchRamp = ramp([
  [0.977, 0.013, 236.62],
  [0.951, 0.026, 236.824],
  [0.901, 0.058, 230.902],
  [0.828, 0.111, 230.318],
  [0.746, 0.16, 232.661],
  [0.685, 0.169, 237.323],
  [0.588, 0.158, 241.966],
  [0.5, 0.134, 242.749],
  [0.443, 0.11, 240.79],
  [0.391, 0.09, 240.876],
  [0.293, 0.066, 243.157],
]);

/** Rampe avertissement (base : amber). */
export const REFERENCE_WARNING: OklchRamp = ramp([
  [0.987, 0.022, 95.277],
  [0.962, 0.059, 95.617],
  [0.924, 0.12, 95.746],
  [0.879, 0.169, 91.605],
  [0.828, 0.189, 84.429],
  [0.769, 0.188, 70.08],
  [0.666, 0.179, 58.318],
  [0.555, 0.163, 48.998],
  [0.473, 0.137, 46.201],
  [0.414, 0.112, 45.904],
  [0.279, 0.077, 45.635],
]);

/** Rampe danger (base : red). */
export const REFERENCE_DANGER: OklchRamp = ramp([
  [0.971, 0.013, 17.38],
  [0.936, 0.032, 17.717],
  [0.885, 0.062, 18.334],
  [0.808, 0.114, 19.571],
  [0.704, 0.191, 22.216],
  [0.637, 0.237, 25.331],
  [0.577, 0.245, 27.325],
  [0.505, 0.213, 27.518],
  [0.444, 0.177, 26.899],
  [0.396, 0.141, 25.723],
  [0.258, 0.092, 26.042],
]);

/** Rampe mise en avant (base : fuchsia). */
export const REFERENCE_HIGHLIGHT: OklchRamp = ramp([
  [0.977, 0.017, 320.058],
  [0.952, 0.037, 318.852],
  [0.903, 0.076, 319.62],
  [0.833, 0.145, 321.434],
  [0.74, 0.238, 322.16],
  [0.667, 0.295, 322.15],
  [0.591, 0.293, 322.896],
  [0.518, 0.253, 323.949],
  [0.452, 0.211, 324.591],
  [0.401, 0.17, 325.612],
  [0.293, 0.136, 325.661],
]);
