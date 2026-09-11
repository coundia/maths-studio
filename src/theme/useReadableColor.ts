import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { contrastRatio, enforceContrast } from './colorMath';

/**
 * Rend lisible une couleur qui ne vient pas de la palette.
 *
 * Certaines couleurs sont fournies par les donnees (etapes resolues par
 * l'heuristique ou par Gemini, solutions en cache) : elles sont ecrites en dur
 * dans `data/` et ne suivent donc pas le theme. Sur fond clair, un bleu ciel ou
 * un ambre vif y devient illisible.
 *
 * Ce hook renvoie une fonction qui rehausse ces couleurs juste ce qu'il faut
 * pour atteindre le contraste minimum sur le fond indique, en conservant la
 * teinte : les termes restent distinguables les uns des autres.
 */
export function useReadableColor(
  backgroundVariable = '--color-surface-muted',
  minRatio = 4.5
): (color?: string | null) => string | undefined {
  const { theme } = useTheme();

  return useMemo(() => {
    const fallback = theme === 'dark' ? '#1d293d' : '#f1f5f9';
    let background = fallback;

    if (typeof window !== 'undefined') {
      const resolved = getComputedStyle(document.documentElement)
        .getPropertyValue(backgroundVariable)
        .trim();
      if (/^#[0-9a-fA-F]{3,8}$/.test(resolved)) background = resolved;
    }

    const cache = new Map<string, string>();

    return (color?: string | null) => {
      if (!color) return undefined;
      const cached = cache.get(color);
      if (cached) return cached;

      const adjusted =
        contrastRatio(color, background) >= minRatio
          ? color
          : enforceContrast(color, background, minRatio);
      cache.set(color, adjusted);
      return adjusted;
    };
    // `theme` force le recalcul a chaque bascule clair / sombre.
  }, [theme, backgroundVariable, minRatio]);
}
