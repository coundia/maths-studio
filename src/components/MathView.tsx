import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  latex: string;
  display?: boolean;
  className?: string;
  id?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  latex,
  display = true,
  className = '',
  id,
}) => {
  const html = useMemo(() => {
    if (!latex) return '';
    try {
      // Remove accidental $ if present
      const cleanLatex = latex.replace(/^\$+|\$+$/g, '').trim();
      return katex.renderToString(cleanLatex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch (e) {
      console.warn('KaTeX rendering error:', e);
      return `<span class="text-rose-400 font-mono">${latex}</span>`;
    }
  }, [latex, display]);

  return (
    <div
      id={id}
      className={`katex-math-container select-text max-w-full overflow-x-auto overflow-y-hidden scrollbar-thin ${
        display ? 'block py-1' : 'inline-block align-middle'
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
