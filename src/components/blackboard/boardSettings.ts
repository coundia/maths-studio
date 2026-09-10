export type BoardThemeStyle = 
  | 'classic-slate'
  | 'chalkboard-green'
  | 'chalkboard-black'
  | 'whiteboard-clean'
  | 'blueprint-blue';

export type BoardGridPattern = 
  | 'none'
  | 'grid-small'
  | 'grid-large'
  | 'ruled'
  | 'dots';

export type BoardFontSize = number; // in rem

export type BoardAlignment = 'center' | 'left';

export interface BoardSettings {
  themeStyle: BoardThemeStyle;
  gridPattern: BoardGridPattern;
  gridOpacity: number; // 0.05 to 0.4
  fontSize: BoardFontSize;
  zoomStep: number; // Pas de zoom configurable
  alignment: BoardAlignment;
  showLineNumbers: boolean;
  autoCompleteEnabled: boolean;
  autoOpenKeyboardOnFocus: boolean;
  enterCreatesNewLine: boolean;
  drawDefaultColor: string;
  drawDefaultWidth: number;
  customColors: string[]; // List of user-added custom hex colors
}

export const DEFAULT_PRESET_COLORS: string[] = [
  '#38bdf8', // Sky
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#f87171', // Red
  '#c084fc', // Purple
  '#ffffff', // Chalk white
];

export const DEFAULT_CUSTOM_COLORS: string[] = [
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
];

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
  themeStyle: 'classic-slate',
  gridPattern: 'grid-small',
  gridOpacity: 0.15,
  fontSize: 2.6,
  zoomStep: 0.2,
  alignment: 'center',
  showLineNumbers: true,
  autoCompleteEnabled: true,
  autoOpenKeyboardOnFocus: false,
  enterCreatesNewLine: true,
  drawDefaultColor: '#38bdf8',
  drawDefaultWidth: 3,
  customColors: DEFAULT_CUSTOM_COLORS,
};

const STORAGE_KEY = 'math3d_board_settings';

export function loadBoardSettings(): BoardSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      let fontSize = parsed.fontSize;
      if (typeof fontSize === 'string') {
        if (fontSize === 'compact') fontSize = 1.8;
        else if (fontSize === 'normal') fontSize = 2.2;
        else if (fontSize === 'huge') fontSize = 3.4;
        else fontSize = 2.6;
      }
      return { 
        ...DEFAULT_BOARD_SETTINGS, 
        ...parsed,
        fontSize,
        zoomStep: parsed.zoomStep !== undefined ? parsed.zoomStep : 0.2,
        customColors: Array.isArray(parsed.customColors) && parsed.customColors.length > 0 
          ? parsed.customColors 
          : DEFAULT_CUSTOM_COLORS,
      };
    }
  } catch (err) {
    console.warn('Failed to load board settings from localStorage:', err);
  }
  return DEFAULT_BOARD_SETTINGS;
}

export async function fetchServerBoardSettings(): Promise<BoardSettings | null> {
  try {
    const res = await fetch('/api/board/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.settings) {
        let fontSize = data.settings.fontSize;
        if (typeof fontSize === 'string') {
          if (fontSize === 'compact') fontSize = 1.8;
          else if (fontSize === 'normal') fontSize = 2.2;
          else if (fontSize === 'huge') fontSize = 3.4;
          else fontSize = 2.6;
        }
        return {
          ...DEFAULT_BOARD_SETTINGS,
          ...data.settings,
          fontSize: fontSize || 2.6,
          zoomStep: data.settings.zoomStep !== undefined ? data.settings.zoomStep : 0.2,
          customColors: Array.isArray(data.settings.customColors) && data.settings.customColors.length > 0
            ? data.settings.customColors
            : DEFAULT_CUSTOM_COLORS,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch server board settings:', err);
  }
  return null;
}

export function saveBoardSettings(settings: BoardSettings): void {
  // 1. Save to local storage for immediate persistence
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save board settings to localStorage:', err);
  }

  // 2. Persist to server backend storage (data/board_settings.json)
  fetch('/api/board/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  }).catch((err) => {
    console.warn('Could not sync board settings with server storage:', err);
  });
}

export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color.trim());
}

export function normalizeHexColor(color: string): string {
  const c = color.trim().toLowerCase();
  if (c.startsWith('#')) return c;
  return `#${c}`;
}


export function getFontSizeRem(size: BoardFontSize | string): string {
  if (typeof size === 'number') return `${size}rem`;
  switch (size as string) {
    case 'compact': return '1.8rem';
    case 'normal': return '2.2rem';
    case 'large': return '2.6rem';
    case 'huge': return '3.4rem';
    default: return '2.6rem';
  }
}

export function getBoardThemeClasses(themeStyle: BoardThemeStyle, isDark: boolean): {
  containerClass: string;
  textClass: string;
  accentColor: string;
} {
  switch (themeStyle) {
    case 'chalkboard-green':
      return {
        containerClass: 'bg-[#123620] border-[#1e4d30] shadow-2xl',
        textClass: 'text-emerald-50 selection:bg-emerald-600/40',
        accentColor: '#34d399',
      };
    case 'chalkboard-black':
      return {
        containerClass: 'bg-[#0b0e14] border-slate-800 shadow-2xl',
        textClass: 'text-slate-100 selection:bg-slate-700',
        accentColor: '#94a3b8',
      };
    case 'whiteboard-clean':
      return {
        containerClass: 'bg-white border-slate-300 shadow-xl',
        textClass: 'text-slate-900 selection:bg-indigo-200',
        accentColor: '#6366f1',
      };
    case 'blueprint-blue':
      return {
        containerClass: 'bg-[#0a2540] border-[#153e66] shadow-2xl',
        textClass: 'text-sky-50 selection:bg-sky-700/50',
        accentColor: '#38bdf8',
      };
    case 'classic-slate':
    default:
      return {
        containerClass: isDark
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-200 shadow-xl',
        textClass: isDark
          ? 'text-slate-100 selection:bg-indigo-600/40'
          : 'text-slate-900 selection:bg-indigo-100',
        accentColor: '#6366f1',
      };
  }
}

export function getGridStyle(
  pattern: BoardGridPattern,
  opacity: number,
  themeStyle: BoardThemeStyle,
  isDark: boolean
): React.CSSProperties {
  if (pattern === 'none') {
    return {};
  }

  // Determine line color base on theme
  const isLightBackground = themeStyle === 'whiteboard-clean' || (themeStyle === 'classic-slate' && !isDark);
  const color = isLightBackground
    ? `rgba(71, 85, 105, ${opacity * 1.1})`
    : `rgba(226, 232, 240, ${opacity})`;

  switch (pattern) {
    case 'grid-small':
      return {
        backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      };
    case 'grid-large':
      return {
        backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      };
    case 'ruled':
      return {
        backgroundImage: `linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: '100% 36px',
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
        backgroundSize: '24px 24px',
      };
    default:
      return {};
  }
}
