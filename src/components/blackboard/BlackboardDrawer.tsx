import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  X, ChevronRight, ChevronLeft, Plus, Trash2, Edit2, Copy, Save, Download, Upload, FileDown,
  PenTool, Keyboard, Highlighter, Palette, Underline, CheckSquare, Square, Code,
  History, Clock, Eye, Sun, Moon, Settings, Sliders, Pipette,
  GripHorizontal, Minimize2, Maximize2, MoreHorizontal, ChevronDown, ChevronUp, Maximize,
  Calculator, Sparkles, RefreshCw, Type
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { 
  BoardSettings, 
  DEFAULT_BOARD_SETTINGS, 
  loadBoardSettings, 
  saveBoardSettings, 
  fetchServerBoardSettings,
  getBoardThemeClasses, 
  getGridStyle, 
  getFontSizeRem 
} from './boardSettings';
import { BoardSettingsDrawer } from './BoardSettingsDrawer';
import 'mathlive';
import { initVirtualKeyboardInCurrentBrowsingContext } from 'mathlive';

// Declare math-field for TypeScript
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 
        class?: string;
      };
    }
  }
}

export type BlackboardLine = {
  id: number;
  initialValue: string;
  isComment?: boolean;
  commentText?: string;
  color?: string;
};

/**
 * Détecte si une ligne représente un commentaire / texte (commence par '#' ou '\#').
 * Exemple : "#1.Factorisons A" -> true
 */
export function isCommentLine(input: string): boolean {
  if (!input) return false;
  const s = input.trim();
  return s.startsWith('#') || s.startsWith('\\#') || s.startsWith('{\\#}') || /^\\text\{\s*\\?#/.test(s);
}

/**
 * Extrait le texte d'un commentaire en retirant le symbole dièse (#) initial.
 * Exemple : "#1.Factorisons A" -> "1.Factorisons A"
 */
export function extractCommentText(input: string): string {
  if (!input) return '';
  let s = input.trim();
  const textMatch = s.match(/^\\text\{\s*\\?#(.*)\}$/);
  if (textMatch) {
    s = textMatch[1];
  } else {
    s = s.replace(/^(\{\\\#\}|\\\#|#+)\s*/, '');
  }
  return s.trim();
}

/**
 * Normalise et convertit les notations mathématiques en LaTeX standard :
 * - Notation 'v' pour racine carrée : 2v2 -> 2\sqrt{2}, v2 -> \sqrt{2}, 3v5 -> 3\sqrt{5}, v(x+1) -> \sqrt{x+1}, (2v3)2 -> (2\sqrt{3})^{2}
 * - Variables & segments suivis de puissances : x2 -> x^{2}, x3 -> x^{3}, 2x2 -> 2x^{2}, AB2 -> AB^{2}, y4 -> y^{4}
 * - Expressions parenthésées suivies d'exposant : (x+1)2 -> (x+1)^{2}, (2\sqrt{2})2 -> (2\sqrt{2})^{2}, \right)3 -> \right)^{3}
 * - Raccourcis usuels : racine / rac / sqrt, pi, deg, +-
 * - Opérateurs de multiplication : * ou · ou • ou \cdot -> \times 
 * - Opérateurs de comparaison et flèches : != -> \neq, <= -> \leq, >= -> \geq, => -> \Rightarrow, <=> -> \Leftrightarrow
 * - Protège intégralement les commandes LaTeX réelles (\times, \frac, \sqrt, \alpha, \pi, etc.)
 */
export function formatMathExpression(input: string): string {
  if (!input) return '';
  if (isCommentLine(input)) {
    return extractCommentText(input);
  }
  let str = input;
  // Masquer le dièse (diez / # / \#) dans le rendu
  str = str.replace(/\\#/g, '').replace(/(?<![a-zA-Z0-9])#(?![\?])/g, '');
  str = str.replace(/\\\$/g, '');
  str = str.replace(/\*\*([0-9]+)/g, '^{$1}');
  str = str.replace(/\\cdot\b/g, '\\times ');
  str = str.replace(/[·•\*]/g, '\\times ');
  str = str.replace(/!=/g, '\\neq ');
  str = str.replace(/<=/g, '\\leq ');
  str = str.replace(/>=/g, '\\geq ');
  str = str.replace(/<=>/g, '\\Leftrightarrow ');
  str = str.replace(/=>/g, '\\Rightarrow ');
  str = str.replace(/->/g, '\\rightarrow ');
  str = str.replace(/\+-/g, '\\pm ');

  // Normaliser \text{v} ou \mathrm{v} généré par certains claviers en 'v'
  str = str.replace(/\\text\{v\}/g, 'v');
  str = str.replace(/\\mathrm\{v\}/g, 'v');

  // Interprétation logique de 'v' comme racine carrée (ex: 2v2 -> 2\sqrt{2}, v3 -> \sqrt{3}, 3v5 -> 3\sqrt{5})
  // 1) v avec parenthèses LaTeX (\left( ... \right)) ou () ou {}
  str = str.replace(/(?<![a-zA-Z\\])v\s*\\left\((.*?)\\right\)/g, '\\sqrt{$1}');
  str = str.replace(/(?<![a-zA-Z\\])v\s*\(([^)]+)\)/g, '\\sqrt{$1}');
  str = str.replace(/(?<![a-zA-Z\\])v\s*\{([^}]+)\}/g, '\\sqrt{$1}');
  str = str.replace(/([0-9]+)\s*v\s*\\left\((.*?)\\right\)/g, '$1\\sqrt{$2}');
  str = str.replace(/([0-9]+)\s*v\s*\(([^)]+)\)/g, '$1\\sqrt{$2}');
  str = str.replace(/([0-9]+)\s*v\s*\{([^}]+)\}/g, '$1\\sqrt{$2}');

  // 2) Nombre suivi de v et d'un nombre (ex: 2v2 -> 2\sqrt{2}, 3v5 -> 3\sqrt{5}, 10v3 -> 10\sqrt{3})
  str = str.replace(/([0-9]+)\s*v\s*([0-9]+)/g, '$1\\sqrt{$2}');

  // 3) Racine suivie d'un nombre sans coefficient précédent (ex: v2 -> \sqrt{2}, v3 -> \sqrt{3}, +v5 -> +\sqrt{5})
  str = str.replace(/(?<![a-zA-Z\\])v\s*([0-9]+)/g, '\\sqrt{$1}');

  // 4) Nombre suivi de v et d'une variable (ex: 2vx -> 2\sqrt{x}, 3va -> 3\sqrt{a})
  str = str.replace(/([0-9]+)\s*v\s*([a-zA-Z])(?![a-zA-Z])/g, '$1\\sqrt{$2}');

  // 5) v isolé suivi d'une variable simple (ex: vx -> \sqrt{x})
  str = str.replace(/(?<![a-zA-Z\\])v\s*([a-zA-Z])(?![a-zA-Z])/g, '\\sqrt{$1}');

  // 6) Autres alias fréquents pour racine : racine2 -> \sqrt{2}, rac3 -> \sqrt{3}, sqrt4 -> \sqrt{4}
  str = str.replace(/(?<![a-zA-Z\\])(?:racine|rac|sqrt)\s*([0-9]+)/g, '\\sqrt{$1}');
  str = str.replace(/(?<![a-zA-Z\\])(?:racine|rac|sqrt)\s*\\left\((.*?)\\right\)/g, '\\sqrt{$1}');
  str = str.replace(/(?<![a-zA-Z\\])(?:racine|rac|sqrt)\s*\(([^)]+)\)/g, '\\sqrt{$1}');
  str = str.replace(/(?<![a-zA-Z\\])(?:racine|rac|sqrt)\s*\{([^}]+)\}/g, '\\sqrt{$1}');

  // 7) Raccourci pi hors commande
  str = str.replace(/(?<![a-zA-Z\\])pi(?![a-zA-Z])/gi, '\\pi');

  // Parenthèses suivies d'un exposant : (x+1)2 -> (x+1)^{2}, (2\sqrt{2})2 -> (2\sqrt{2})^{2}, \right)3 -> \right)^{3}
  str = str.replace(/(\)|\\right\))\s*([2-9][0-9]*|1[0-9]+)/g, '$1^{$2}');

  // Variables et longueurs géométriques suivies de nombres (ex: x2 -> x^{2}, x3 -> x^{3}, BC2 -> BC^{2})
  const regex = /(\\[a-zA-Z]+(?:\{[^}]*\})*)|(?<![\\^_a-zA-Z])([a-zA-Z]+)\s*([2-9][0-9]*|1[0-9]+)/g;

  str = str.replace(regex, (match, cmd, varName, varPow) => {
    if (cmd) return cmd;
    if (varName && varPow) return `${varName}^{${varPow}}`;
    return match;
  });

  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Fournit la table complète des raccourcis automatiques en ligne pour MathLive.
 * Interprète de façon intuitive les saisies comme 2v2 (2 racine de 2), x2, etc.
 */
export function getMathLiveInlineShortcuts(autoCompleteEnabled: boolean): Record<string, string> {
  if (!autoCompleteEnabled) {
    return {
      '*': '\\times',
      'xx': '\\times',
      'cdot': '\\times',
      'times': '\\times',
    };
  }

  const shortcuts: Record<string, string> = {
    // Multiplication
    '*': '\\times',
    'xx': '\\times',
    'cdot': '\\times',
    'times': '\\times',

    // Opérateurs de comparaison, logique et flèches
    '!=': '\\neq',
    '<=': '\\leq',
    '>=': '\\geq',
    '=>': '\\Rightarrow',
    '<=>': '\\Leftrightarrow',
    '->': '\\rightarrow',
    '+-': '\\pm',

    // Ensembles de nombres usuels
    'IR': '\\mathbb{R}',
    'IN': '\\mathbb{N}',
    'IZ': '\\mathbb{Z}',
    'IQ': '\\mathbb{Q}',
    'ID': '\\mathbb{D}',

    // Fonctions et notations du programme
    'pi': '\\pi',
    'deg': '^{\\circ}',
    '°': '^{\\circ}',
    'racine': '\\sqrt{#?}',
    'rac': '\\sqrt{#?}',
    'sqrt': '\\sqrt{#?}',
    'vecteur': '\\vec{#?}',
    'vect': '\\vec{#?}',
    'angle': '\\widehat{#?}',

    // Puissances usuelles de variables
    'x2': 'x^2', 'x3': 'x^3', 'x4': 'x^4',
    'y2': 'y^2', 'y3': 'y^3', 'y4': 'y^4',
    'z2': 'z^2', 'z3': 'z^3',
    'a2': 'a^2', 'a3': 'a^3',
    'b2': 'b^2', 'b3': 'b^3',
    'c2': 'c^2', 'c3': 'c^3',
    't2': 't^2', 't3': 't^3',
    'n2': 'n^2', 'n3': 'n^3',

    // Théorème de Pythagore / segments géométriques
    'AB2': 'AB^2', 'BC2': 'BC^2', 'AC2': 'AC^2',
    'MN2': 'MN^2', 'EF2': 'EF^2', 'AH2': 'AH^2',
    'AI2': 'AI^2', 'BH2': 'BH^2', 'CH2': 'CH^2',

    // Parenthèses avec carré
    ')2': ')^2',
    ')3': ')^3',

    // 'v' comme racine carrée
    'v(': '\\sqrt(',
    'v{': '\\sqrt{',
  };

  // Raccourcis directs pour v + nombre (v2 -> \sqrt{2}, v3 -> \sqrt{3}, etc.)
  for (let n = 1; n <= 19; n++) {
    shortcuts[`v${n}`] = `\\sqrt{${n}}`;
  }

  // Raccourcis directs pour coefficient + v + nombre (2v2 -> 2\sqrt{2}, 3v5 -> 3\sqrt{5}, etc.)
  for (let c = 2; c <= 15; c++) {
    for (const d of [2, 3, 5, 6, 7, 8, 10, 11, 13, 14, 15, 17, 19]) {
      shortcuts[`${c}v${d}`] = `${c}\\sqrt{${d}}`;
    }
  }

  // Regex shortcuts pour MathLive
  // 1) 2v2 -> 2\sqrt{2}
  shortcuts['/([0-9]+)v([0-9]+)/'] = '$1\\sqrt{$2}';
  // 2) Nombre suivi de v -> place le curseur dans la racine (2v -> 2\sqrt{#?})
  shortcuts['/([0-9]+)v/'] = '$1\\sqrt{#?}';
  // 3) Racine en début ou après opérateur (ex: v2 -> \sqrt{2})
  shortcuts['/([^a-zA-Z\\]|^)v([0-9]+)/'] = '$1\\sqrt{$2}';
  // 4) Racine avec parenthèse (v( -> \sqrt()
  shortcuts['/([^a-zA-Z\\]|^)v\\(/'] = '$1\\sqrt(';
  // 5) Variables avec puissances
  shortcuts['/([xyzabcntXYZABCNT])([2-9])/'] = '$1^$2';

  return shortcuts;
}

interface BlackboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlackboardDrawer: React.FC<BlackboardDrawerProps> = ({ isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<'draw' | 'type'>('type');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isKeyboardMinimized, setIsKeyboardMinimized] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isFormatBarOpen, setIsFormatBarOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [boardSettings, setBoardSettings] = useState<BoardSettings>(() => loadBoardSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dragControls = useDragControls();
  const boardBodyRef = useRef<HTMLDivElement>(null);

  // Close actions dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isActionsMenuOpen]);

  // Synchronize board settings with server data storage on mount
  useEffect(() => {
    fetchServerBoardSettings().then((remoteSettings) => {
      if (remoteSettings) {
        setBoardSettings((current) => ({
          ...current,
          ...remoteSettings,
          customColors: Array.isArray(remoteSettings.customColors) && remoteSettings.customColors.length > 0
            ? remoteSettings.customColors
            : current.customColors,
        }));
      }
    });
  }, []);

  const handleUpdateSettings = (newSettings: BoardSettings) => {
    setBoardSettings(newSettings);
    saveBoardSettings(newSettings);
  };

  const handleAddCustomColor = (color: string) => {
    const hex = color.trim().toLowerCase();
    const existing = boardSettings.customColors || [];
    if (!existing.some((c) => c.toLowerCase() === hex)) {
      const updated = {
        ...boardSettings,
        customColors: [...existing, hex],
      };
      handleUpdateSettings(updated);
    }
  };

  const handleResetSettings = () => {
    setBoardSettings(DEFAULT_BOARD_SETTINGS);
    saveBoardSettings(DEFAULT_BOARD_SETTINGS);
  };

  const handleClearBoard = () => {
    setLines([{ id: Date.now(), initialValue: '' }]);
    mathFieldsRef.current = {};
    localStorage.removeItem('math3d_blackboard_lines');
  };

  // Type for a saved board
  type SavedBoard = {
    id: number;
    date: string;
    name: string;
    lines: string[];
  };

  // Initialize saved boards from localStorage
  const [savedBoards, setSavedBoards] = useState<SavedBoard[]>(() => {
    try {
      const saved = localStorage.getItem('math3d_board_saves');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });
  
  const commentInputsRef = useRef<Record<number, HTMLInputElement | null>>({});

  // Initialize lines from localStorage if available
  const [lines, setLines] = useState<BlackboardLine[]>(() => {
    try {
      const saved = localStorage.getItem('math3d_blackboard_lines');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((val, idx) => {
            const isComment = isCommentLine(val);
            return {
              id: Date.now() + idx,
              initialValue: val,
              isComment,
              commentText: isComment ? extractCommentText(val) : '',
            };
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse blackboard history:', e);
    }
    return [{ id: Date.now(), initialValue: '', isComment: false, commentText: '' }];
  });
  
  const [activeLineId, setActiveLineId] = useState<number | null>(null);

  const handleAddLine = (afterIndex?: number, asComment = false) => {
    const newLine: BlackboardLine = {
      id: Date.now(),
      initialValue: '',
      isComment: asComment,
      commentText: '',
    };
    if (afterIndex !== undefined && afterIndex >= 0) {
      setLines(prev => {
        const next = [...prev];
        next.splice(afterIndex + 1, 0, newLine);
        return next;
      });
    } else {
      setLines(prev => [...prev, newLine]);
    }
    setActiveLineId(newLine.id);
    setTimeout(() => {
      if (asComment) {
        commentInputsRef.current[newLine.id]?.focus();
      } else {
        mathFieldsRef.current[newLine.id]?.focus();
      }
    }, 60);
  };
  const autoCompleteEnabled = boardSettings.autoCompleteEnabled;
  const setAutoCompleteEnabled = (val: boolean) => {
    handleUpdateSettings({ ...boardSettings, autoCompleteEnabled: val });
  };
  const [rawModeLines, setRawModeLines] = useState<Record<number, boolean>>({});
  const [refreshingLineId, setRefreshingLineId] = useState<number | null>(null);

  const handleRefreshLine = (lineId: number) => {
    setRefreshingLineId(lineId);

    const targetLine = lines.find(l => l.id === lineId);
    if (targetLine?.isComment) {
      const inputEl = commentInputsRef.current[lineId];
      const cur = inputEl ? inputEl.value : (targetLine.commentText || '');
      const cleaned = extractCommentText(cur);
      if (inputEl) inputEl.value = cleaned;
      setLines(prev => prev.map(l => l.id === lineId ? { ...l, commentText: cleaned } : l));
      saveToLocalStorageSilently();
      setTimeout(() => setRefreshingLineId(null), 450);
      return;
    }

    // If currently in raw LaTeX edit mode, sync from textarea and switch back to visual math mode
    const textarea = document.querySelector(`textarea[data-line-id="${lineId}"]`) as HTMLTextAreaElement;
    let currentVal = '';

    if (rawModeLines[lineId] && textarea) {
      currentVal = textarea.value || '';
      setRawModeLines(prev => ({ ...prev, [lineId]: false }));
    } else {
      const mf = mathFieldsRef.current[lineId];
      currentVal = mf?.value || '';
    }

    // Check if line starts with '#' or '\#' (interpreted as a comment/text line without the #)
    if (isCommentLine(currentVal)) {
      const comment = extractCommentText(currentVal);
      setLines(prev => prev.map(l => l.id === lineId ? {
        ...l,
        isComment: true,
        commentText: comment,
        initialValue: `#${comment}`
      } : l));
      setTimeout(() => {
        const inputEl = commentInputsRef.current[lineId];
        if (inputEl) {
          inputEl.value = comment;
          inputEl.focus();
        }
        saveToLocalStorageSilently();
      }, 50);
      setTimeout(() => setRefreshingLineId(null), 450);
      return;
    }

    // Auto-convert x2 -> x^2, x3 -> x^3, * -> \times, etc.
    const cleaned = formatMathExpression(currentVal);

    // Update lines state in React
    setLines(prev => prev.map(l => l.id === lineId ? { ...l, initialValue: cleaned } : l));

    const mf = mathFieldsRef.current[lineId];
    if (mf) {
      try {
        mf.setValue('', { format: 'latex' });
        setTimeout(() => {
          mf.setValue(cleaned, { format: 'latex' });
          try {
            if (typeof mf.render === 'function') {
              mf.render();
            }
          } catch {}
          mf.focus();
          saveToLocalStorageSilently();
        }, 25);
      } catch (e) {
        console.error("Erreur de rafraîchissement du rendu :", e);
      }
    }

    setTimeout(() => {
      setRefreshingLineId(null);
    }, 450);
  };

  const handleRefreshAllLines = () => {
    lines.forEach(line => {
      if (line.isComment) {
        const inputEl = commentInputsRef.current[line.id];
        if (inputEl) {
          inputEl.value = extractCommentText(inputEl.value);
        }
      } else {
        const mf = mathFieldsRef.current[line.id];
        const currentVal = mf?.value || line.initialValue || '';
        if (isCommentLine(currentVal)) {
          const comment = extractCommentText(currentVal);
          setLines(prev => prev.map(l => l.id === line.id ? { ...l, isComment: true, commentText: comment } : l));
        } else {
          const cleaned = formatMathExpression(currentVal);
          if (mf) {
            mf.setValue(cleaned, { format: 'latex' });
            try {
              if (typeof mf.render === 'function') mf.render();
            } catch {}
          }
        }
      }
    });
    setLines(prev => prev.map(l => {
      if (l.isComment) {
        const inputEl = commentInputsRef.current[l.id];
        return { ...l, commentText: inputEl?.value ?? l.commentText };
      }
      const mf = mathFieldsRef.current[l.id];
      return { ...l, initialValue: mf?.value || l.initialValue };
    }));
    saveToLocalStorageSilently();
  };

  const [selectionContext, setSelectionContext] = useState<{
    lineId: number;
    show: boolean;
  } | null>(null);
  
  const autoCompleteRef = useRef(autoCompleteEnabled);
  useEffect(() => {
    autoCompleteRef.current = autoCompleteEnabled;
  }, [autoCompleteEnabled]);
  
  const kbdContainerRef = useRef<HTMLDivElement>(null);
  const mathFieldsRef = useRef<{ [key: number]: any }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure MathLive Virtual Keyboard
  useEffect(() => {
    let handleGeometryChange: (() => void) | null = null;
    let mvkRef: any = null;

    if (typeof window !== 'undefined' && isOpen && activeMode === 'type') {
      try {
        initVirtualKeyboardInCurrentBrowsingContext();
      } catch (e) {
        console.warn('initVirtualKeyboardInCurrentBrowsingContext:', e);
      }

      const mvk = (window as any).mathVirtualKeyboard;
      if (mvk) {
        mvkRef = mvk;
        try {
          mvk.policy = 'manual';
        } catch (e) {}

        if (kbdContainerRef.current) {
          try {
            mvk.container = kbdContainerRef.current;
          } catch (e) {
            console.warn('mathVirtualKeyboard container assignment error handled:', e);
          }
        }
        
        // Hide/show based on state
        try {
          if (isKeyboardOpen && !isKeyboardMinimized) {
            mvk.show();
          } else {
            mvk.hide();
          }
        } catch (e) {
          console.warn('mathVirtualKeyboard show/hide error:', e);
        }

        // Prevent MathLive from automatically hiding on focusout/blur during drag
        handleGeometryChange = () => {
          if (isKeyboardOpen && !isKeyboardMinimized && !mvk.visible) {
            try {
              mvk.show();
            } catch (e) {}
          }
        };

        try {
          mvk.addEventListener('geometrychange', handleGeometryChange);
        } catch (e) {}
      }
    }
    
    // Cleanup on unmount or close
    return () => {
      if (mvkRef && handleGeometryChange) {
        try {
          mvkRef.removeEventListener('geometrychange', handleGeometryChange);
        } catch (e) {}
      }
      if (typeof window !== 'undefined') {
        const mvk = (window as any).mathVirtualKeyboard;
        if (mvk) {
          try {
            mvk.hide();
          } catch (e) {}
          try {
            mvk.container = document.body; // reset to default
          } catch (e) {
            // Silently ignore if in an iframe
          }
        }
      }
    };
  }, [isOpen, activeMode, isKeyboardOpen, isKeyboardMinimized]);

  // Apply inline shortcuts setting to all math fields
  useEffect(() => {
    Object.values(mathFieldsRef.current).forEach((mf: any) => {
      if (mf) {
        if (!autoCompleteEnabled) {
          mf.inlineShortcuts = getMathLiveInlineShortcuts(false);
        } else {
          // Restore defaults first
          mf.inlineShortcuts = undefined;
          
          // Get defaults (now restored) and merge with our custom shortcuts
          const defaults = mf.inlineShortcuts || {};
          mf.inlineShortcuts = {
            ...defaults,
            ...getMathLiveInlineShortcuts(true),
          };
        }
      }
    });
  }, [autoCompleteEnabled, lines]);

  const getLineSerializedValue = (line: BlackboardLine): string => {
    if (line.isComment) {
      const inputEl = commentInputsRef.current[line.id];
      const text = inputEl ? inputEl.value : (line.commentText || '');
      return `#${extractCommentText(text)}`;
    }
    const mf = mathFieldsRef.current[line.id];
    return mf ? mf.value : (line.initialValue || '');
  };

  // Fonction de sauvegarde silencieuse (Auto-save)
  const saveToLocalStorageSilently = () => {
    const currentValues = lines.map(line => getLineSerializedValue(line));
    localStorage.setItem('math3d_blackboard_lines', JSON.stringify(currentValues));
    
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      localStorage.setItem('math3d_whiteboard_canvas', canvas.toDataURL());
    }
  };

  // Auto-save whenever the structure of lines changes (add/delete/duplicate)
  useEffect(() => {
    // Petit timeout pour laisser React rendre les nouveaux éléments dans le DOM
    const t = setTimeout(saveToLocalStorageSilently, 100);
    return () => clearTimeout(t);
  }, [lines]);

  const handleSave = () => {
    saveToLocalStorageSilently();
    
    // Also create a snapshot in the history (Left Sidebar)
    const currentValues = lines.map(line => getLineSerializedValue(line));
    
    const newSave: SavedBoard = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      name: `Brouillon du ${new Date().toLocaleDateString()}`,
      lines: currentValues,
    };
    
    const updatedSaves = [newSave, ...savedBoards];
    setSavedBoards(updatedSaves);
    localStorage.setItem('math3d_board_saves', JSON.stringify(updatedSaves));
    
    // Quick visual feedback
    alert("Nouveau brouillon sauvegardé dans l'historique !");
  };

  const loadSave = (save: SavedBoard) => {
    setLines(save.lines.map((val, idx) => {
      const isComment = isCommentLine(val);
      return {
        id: Date.now() + idx,
        initialValue: val,
        isComment,
        commentText: isComment ? extractCommentText(val) : '',
      };
    }));
    setIsLeftSidebarOpen(false);
  };

  const deleteSave = (id: number) => {
    const updated = savedBoards.filter(s => s.id !== id);
    setSavedBoards(updated);
    localStorage.setItem('math3d_board_saves', JSON.stringify(updated));
  };

  const renameSave = (id: number, currentName: string) => {
    const newName = window.prompt("Nom de la sauvegarde :", currentName);
    if (newName !== null && newName.trim() !== "") {
      const updated = savedBoards.map(s => s.id === id ? { ...s, name: newName.trim() } : s);
      setSavedBoards(updated);
      localStorage.setItem('math3d_board_saves', JSON.stringify(updated));
    }
  };

  const handleExport = () => {
    const currentValues = lines.map(line => getLineSerializedValue(line));
    
    const blob = new Blob([JSON.stringify(currentValues, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `math3d_board_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // If empty array, give at least one empty line
          if (parsed.length === 0) parsed.push('');
          
          setLines(parsed.map((val, idx) => {
            const isComment = isCommentLine(val);
            return {
              id: Date.now() + idx,
              initialValue: val,
              isComment,
              commentText: isComment ? extractCommentText(val) : '',
            };
          }));
        } else {
          alert("Format de fichier invalide. Veuillez importer un fichier JSON valide.");
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier. Le format JSON est peut-être corrompu.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  // No auto-focus because we have multiple fields now

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-50 dark:bg-[#0B1120] z-[100] flex flex-col overflow-hidden print:bg-white print:static print:h-auto print:overflow-visible"
        >
          {/* Print only formulas stylesheet */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-blackboard, #printable-blackboard * {
                visibility: visible;
              }
              #printable-blackboard {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
              }
              math-field::part(virtual-keyboard-toggle) {
                display: none !important;
              }
            }
          `}</style>

          {/* Header */}
          <div className={`flex items-center justify-between p-3 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0 z-20 print:hidden transition-all ${isZenMode ? 'hidden' : 'flex'}`}>
            {/* Left: History toggle & Title & Mode Switcher */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className={`p-2 rounded-xl border transition-colors ${
                  isLeftSidebarOpen 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Historique des sauvegardes"
              >
                <History className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-xl shadow-sm">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Tableau Math3D
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                    {activeMode === 'type' ? 'Calculs & Formules' : 'Dessin Libre'}
                  </p>
                </div>
              </div>

              {/* Mode Switcher Pill */}
              <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl border border-slate-300/60 dark:border-slate-700/60">
                <button
                  onClick={() => setActiveMode('type')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'type'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Équations</span>
                </button>
                <button
                  onClick={() => setActiveMode('draw')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'draw'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dessin</span>
                </button>
              </div>
            </div>

            {/* Right: Primary Call to Action & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Primary Call to Action (CTA) */}
              {activeMode === 'type' ? (
                <button
                  id="btn-header-add-line"
                  onClick={() => handleAddLine()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow-indigo-500/25 cursor-pointer"
                  title="Ajouter une ligne de calcul (Entrée)"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouvelle Ligne</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                  title="Sauvegarder le dessin actuel"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Sauvegarder</span>
                </button>
              )}

              {/* Virtual Keyboard Toggle (in type mode) */}
              {activeMode === 'type' && (
                <button
                  id="btn-toggle-floating-keyboard"
                  onClick={() => {
                    setIsKeyboardOpen(!isKeyboardOpen);
                    if (!isKeyboardOpen) setIsKeyboardMinimized(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isKeyboardOpen
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={isKeyboardOpen ? "Masquer le clavier virtuel" : "Afficher le clavier virtuel"}
                >
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  <span className="hidden md:inline">Clavier</span>
                </button>
              )}

              {/* Collapsible Actions Dropdown (Grouped Import, Export, PDF, Clear) */}
              <div className="relative" ref={actionsMenuRef}>
                <button
                  id="btn-board-actions-menu"
                  onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isActionsMenuOpen
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Actions du tableau (Export, Sauvegarde, Import)"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Actions</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImport} 
                />

                <AnimatePresence>
                  {isActionsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-medium"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Gestion & Export
                      </div>

                      <button
                        onClick={() => {
                          handleSave();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-emerald-500" />
                        <span>Sauvegarder dans l'historique</span>
                      </button>

                      <button
                        onClick={() => {
                          window.print();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors cursor-pointer"
                      >
                        <FileDown className="w-4 h-4 text-rose-500" />
                        <span>Exporter en PDF (Imprimer)</span>
                      </button>

                      <button
                        onClick={() => {
                          handleExport();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-indigo-500" />
                        <span>Télécharger fichier (.json)</span>
                      </button>

                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>Importer un fichier (.json)</span>
                      </button>

                      <button
                        onClick={() => {
                          handleRefreshAllLines();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-left transition-colors cursor-pointer"
                        title="Rafraîchit et convertit automatiquement les puissances (x2 → x², x3 → x³) sur toutes les lignes"
                      >
                        <RefreshCw className="w-4 h-4 text-sky-500" />
                        <span>Rafraîchir & Formater tout</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAddLine(lines.length - 1, true);
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-left transition-colors cursor-pointer"
                        title="Insérer une ligne de texte ou commentaire"
                      >
                        <Type className="w-4 h-4 text-amber-500" />
                        <span>Ajouter un commentaire</span>
                      </button>

                      <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        onClick={() => {
                          handleClearBoard();
                          setIsActionsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Effacer tout le tableau</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Zen Mode Button */}
              <button
                onClick={() => setIsZenMode(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Mode Plein Écran Épuré (Masquer les barres d'outils)"
              >
                <Maximize className="w-4 h-4" />
              </button>

              {/* Board Settings Icon Button */}
              <button
                id="btn-open-board-settings"
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSettingsOpen
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                title="Paramètres du tableau (Arrière-plan, Grille, Taille, Raccourcis)"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                title={theme === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Fermer le tableau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={boardBodyRef} className="flex-1 relative overflow-hidden flex print:overflow-visible">
            
            {/* Left Sidebar for History */}
            <AnimatePresence>
              {isLeftSidebarOpen && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute left-0 top-0 bottom-0 w-full sm:w-80 md:w-96 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-30 flex flex-col print:hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <History className="w-5 h-5 text-indigo-500" /> Historique
                    </span>
                    <button
                      onClick={() => setIsLeftSidebarOpen(false)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                    {savedBoards.length === 0 ? (
                      <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-10">
                        Aucune sauvegarde pour le moment.<br/>Cliquez sur "Sauvegarder" pour créer un brouillon.
                      </div>
                    ) : (
                      savedBoards.map(save => (
                        <div key={save.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 flex-1 pr-2" title={save.name}>
                              {save.name}
                            </h3>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => renameSave(save.id, save.name)}
                                className="text-slate-400 hover:text-indigo-500 p-1 transition-colors"
                                title="Renommer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteSave(save.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3">
                            <Clock className="w-3 h-3" /> {save.date} ({save.lines.length} lignes)
                          </p>
                          
                          {/* Preview de la première équation */}
                          {(() => {
                            const firstEq = save.lines.find(l => l.trim() !== '');
                            if (!firstEq) return null;
                            return (
                              <div className="mb-3 px-2 py-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-hidden pointer-events-none flex justify-center shadow-inner">
                                <math-field 
                                  ref={(el: any) => { 
                                    if (el) {
                                      if (el.value !== firstEq) el.value = firstEq; 
                                      el.readOnly = true;
                                    }
                                  }}
                                  style={{ fontSize: '0.9rem', border: 'none', outline: 'none', background: 'transparent', maxWidth: '100%' }}
                                />
                              </div>
                            );
                          })()}

                          <button
                            onClick={() => loadSave(save)}
                            className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                          >
                            Charger ce brouillon
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeMode === 'draw' ? (
              <div className="flex-1 p-4 print:p-0">
                <WhiteboardCanvas 
                  themeStyle={boardSettings.themeStyle}
                  gridPattern={boardSettings.gridPattern}
                  gridOpacity={boardSettings.gridOpacity}
                  defaultColor={boardSettings.drawDefaultColor}
                  defaultLineWidth={boardSettings.drawDefaultWidth}
                  customColors={boardSettings.customColors}
                  onAddCustomColor={handleAddCustomColor}
                />
              </div>
            ) : (
              <>
                {/* Full Page Equation Display (MathLive Field) */}
                <div className={`flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto print:overflow-visible print:p-0 transition-all duration-300 relative ${isLeftSidebarOpen ? 'ml-0 sm:ml-80 md:ml-96 print:ml-0 mr-0' : 'mr-0'}`}>
                  
                  {/* Demo Mode Overlay */}
                  {isDemoMode && (
                    <div className="absolute inset-0 z-[60]">
                      <WhiteboardCanvas 
                        isOverlay={true} 
                        customColors={boardSettings.customColors}
                        onAddCustomColor={handleAddCustomColor}
                      />
                    </div>
                  )}

                  {/* Collapsible Format & Style Toolbar ("buttons masquable") */}
                  <div className="sticky top-2 z-[70] self-center flex flex-col items-center mb-4 transition-all print:hidden">
                    {/* Collapsed/Expand Toggle Pill */}
                    <button
                      id="btn-toggle-format-bar"
                      onClick={() => setIsFormatBarOpen(!isFormatBarOpen)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
                        isFormatBarOpen
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
                          : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow'
                      }`}
                      title={isFormatBarOpen ? "Masquer la barre d'outils" : "Afficher les couleurs et outils de formatage"}
                    >
                      <Palette className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isFormatBarOpen ? 'Masquer les outils' : 'Outils de Style & Couleurs'}</span>
                      {isFormatBarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Expanded Toolbar Panel */}
                    <AnimatePresence>
                      {isFormatBarOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 sm:px-4 rounded-2xl shadow-xl max-w-full"
                        >
                          {/* Demo Mode Toggle */}
                          <button
                            onClick={() => setIsDemoMode(!isDemoMode)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              isDemoMode 
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title="Mode Démonstration : Dessiner sur les équations"
                          >
                            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">Surligneur Démo</span>
                          </button>

                          {/* Auto-complete Toggle */}
                          <button
                            onClick={() => setAutoCompleteEnabled(!autoCompleteEnabled)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              autoCompleteEnabled 
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title="Transformer automatiquement les mots (ex: pi) en symboles (π)"
                          >
                            {autoCompleteEnabled ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">Auto-complétion</span>
                          </button>

                          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

                          {/* Color swatches */}
                          <div className="flex items-center gap-1.5 max-w-[200px] sm:max-w-[320px] overflow-x-auto py-0.5">
                            {Array.from(new Set(['#ef4444', '#3b82f6', '#10b981', '#f59e0b', ...(boardSettings.customColors || [])])).map((c) => (
                              <button
                                key={c}
                                onClick={() => {
                                  if (activeLineId && mathFieldsRef.current[activeLineId]) {
                                    mathFieldsRef.current[activeLineId].applyStyle({ color: c });
                                    mathFieldsRef.current[activeLineId].focus();
                                  }
                                }}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black/10 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs transition-transform hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
                                style={{ backgroundColor: c }}
                                title={`Mettre en couleur ${c}`}
                              />
                            ))}
                          </div>

                          {/* On-the-fly Color Picker */}
                          <div 
                            className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 shadow-xs hover:scale-110 transition-transform cursor-pointer shrink-0"
                            title="Choisir une autre couleur pour la formule"
                          >
                            <input
                              type="color"
                              defaultValue="#ec4899"
                              onChange={(e) => {
                                const newC = e.target.value;
                                if (activeLineId && mathFieldsRef.current[activeLineId]) {
                                  mathFieldsRef.current[activeLineId].applyStyle({ color: newC });
                                  mathFieldsRef.current[activeLineId].focus();
                                }
                                handleAddCustomColor(newC);
                              }}
                              className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0"
                            />
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white">
                              <Pipette className="w-3 h-3 drop-shadow" />
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (activeLineId && mathFieldsRef.current[activeLineId]) {
                                mathFieldsRef.current[activeLineId].applyStyle({ color: 'none' });
                                mathFieldsRef.current[activeLineId].focus();
                              }
                            }}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
                            title="Enlever la couleur"
                          >
                            ✕
                          </button>
                          
                          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                          
                          {/* Underline */}
                          <button
                            onClick={() => {
                              if (activeLineId && mathFieldsRef.current[activeLineId]) {
                                mathFieldsRef.current[activeLineId].insert('\\underline{#0}');
                                mathFieldsRef.current[activeLineId].focus();
                              }
                            }}
                            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Souligner la sélection"
                          >
                            <Underline className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {(() => {
                    const isDark = theme === 'dark';
                    const themeClasses = getBoardThemeClasses(boardSettings.themeStyle, isDark);
                    const gridStyle = getGridStyle(boardSettings.gridPattern, boardSettings.gridOpacity, boardSettings.themeStyle, isDark);
                    return (
                      <div 
                        id="printable-blackboard" 
                        className={`w-full flex-1 flex flex-col items-center gap-4 ${themeClasses.containerClass} ${themeClasses.textClass} rounded-3xl border p-6 sm:p-8 min-h-[300px] mb-8 transition-colors duration-200 print:shadow-none print:border-none print:bg-transparent print:p-0 print:mb-0`}
                        style={gridStyle}
                      >
                        {lines.map((line, index) => (
                          <div 
                            key={line.id} 
                            className={`w-full flex items-center ${boardSettings.alignment === 'left' ? 'justify-start pl-8 sm:pl-14' : 'justify-center'} gap-2 group relative print:mb-6 print:break-inside-avoid`}
                          >
                            {/* Numbering */}
                            {boardSettings.showLineNumbers && (
                              <span className="absolute left-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50/80 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-xs sm:text-sm shadow-sm print:hidden">
                                {index + 1}
                              </span>
                            )}
                            
                            {/* Line content: Comment (Plain text) OR Math Field (Formula) */}
                            {line.isComment ? (
                              <div className={`w-full flex-1 flex items-center ${boardSettings.alignment === 'left' ? 'justify-start' : 'justify-center'} px-2 sm:px-4 py-1`}>
                                <div 
                                  className="w-full max-w-4xl flex items-center px-3.5 py-2 rounded-xl border-l-4 border-amber-500/70 dark:border-amber-400/70 bg-amber-50/40 dark:bg-amber-950/20 text-slate-800 dark:text-slate-100 transition-all focus-within:ring-2 focus-within:ring-amber-500/30 focus-within:border-amber-500 print:bg-transparent print:border-l-0 print:px-0 print:py-0"
                                >
                                  <input
                                    ref={(el) => { commentInputsRef.current[line.id] = el; }}
                                    type="text"
                                    defaultValue={extractCommentText(line.commentText || '')}
                                    placeholder="Commentaire ou consigne (ex: 1. Factorisons A)..."
                                    className="w-full bg-transparent border-none outline-none font-sans font-semibold tracking-wide text-slate-900 dark:text-slate-100 placeholder:text-slate-400/70 dark:placeholder:text-slate-500 print:text-black print:font-bold"
                                    style={{
                                      fontSize: getFontSizeRem(boardSettings.fontSize),
                                      textAlign: boardSettings.alignment,
                                      color: line.color || undefined
                                    }}
                                    onFocus={() => {
                                      setActiveLineId(line.id);
                                    }}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (val.startsWith('#')) {
                                        val = val.replace(/^#+\s*/, '');
                                        e.target.value = val;
                                      }
                                      setLines(prev => prev.map(l => l.id === line.id ? { ...l, commentText: val } : l));
                                      saveToLocalStorageSilently();
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddLine(index);
                                      } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
                                        e.preventDefault();
                                        setLines(prev => prev.map(l => l.id === line.id ? { ...l, isComment: false, commentText: '', initialValue: '' } : l));
                                        setTimeout(() => {
                                          mathFieldsRef.current[line.id]?.focus();
                                        }, 50);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className={`w-full flex-1 flex ${boardSettings.alignment === 'left' ? 'justify-start' : 'justify-center'} ${rawModeLines[line.id] ? 'hidden' : 'block'}`}>
                                <math-field 
                                  ref={(el: any) => {
                                    if (el) {
                                      if (!mathFieldsRef.current[line.id]) {
                                        // First time initialization for this field
                                        el.value = line.initialValue;
                                        
                                        el.addEventListener('paste', (e: ClipboardEvent) => {
                                          const text = e.clipboardData?.getData('text/plain');
                                          if (text && isCommentLine(text)) {
                                            e.preventDefault();
                                            const comment = extractCommentText(text);
                                            setLines(prev => prev.map(l => l.id === line.id ? {
                                              ...l,
                                              isComment: true,
                                              commentText: comment,
                                              initialValue: `#${comment}`
                                            } : l));
                                            setTimeout(() => {
                                              const inputEl = commentInputsRef.current[line.id];
                                              if (inputEl) {
                                                inputEl.value = comment;
                                                inputEl.focus();
                                              }
                                              saveToLocalStorageSilently();
                                            }, 50);
                                            return;
                                          }

                                          if (!autoCompleteRef.current) return;
                                          if (!text) return;
                                          
                                          // Format pasted text into clean standard LaTeX (e.g. 2v2 -> 2\sqrt{2}, x2 -> x^2)
                                          e.preventDefault();
                                          const processed = formatMathExpression(text);
                                          el.executeCommand(['insert', processed]);
                                        });

                                        // Auto-save on every keystroke & auto-detection of comment '#'
                                        el.addEventListener('input', () => {
                                          if (el.value && isCommentLine(el.value)) {
                                            const comment = extractCommentText(el.value);
                                            setLines(prev => prev.map(l => l.id === line.id ? {
                                              ...l,
                                              isComment: true,
                                              commentText: comment,
                                              initialValue: `#${comment}`
                                            } : l));
                                            setTimeout(() => {
                                              const inputEl = commentInputsRef.current[line.id];
                                              if (inputEl) {
                                                inputEl.value = comment;
                                                inputEl.focus();
                                              }
                                              saveToLocalStorageSilently();
                                            }, 50);
                                            return;
                                          }

                                          let val = el.value || '';
                                          let needsUpdate = false;

                                          if (val.includes('\\text{v}') || val.includes('\\mathrm{v}')) {
                                            val = val.replace(/\\(text|mathrm)\{v\}/g, 'v');
                                            needsUpdate = true;
                                          }

                                          if (val.includes('\\cdot') || val.includes('·')) {
                                            val = val.replace(/\\cdot\b/g, '\\times').replace(/·/g, '\\times');
                                            needsUpdate = true;
                                          }

                                          // Détection automatique en temps réel des motifs "v" comme racine carrée (ex: 2v2 -> 2\sqrt{2}, v2 -> \sqrt{2})
                                          if (autoCompleteRef.current && (
                                            /([0-9]+)\s*v\s*([0-9]+)/.test(val) ||
                                            /(?<![a-zA-Z\\])v\s*([0-9]+)/.test(val) ||
                                            /(?<![a-zA-Z\\])v\s*\\left\(/.test(val) ||
                                            /(?<![a-zA-Z\\])v\s*\(/.test(val)
                                          )) {
                                            val = val.replace(/([0-9]+)\s*v\s*\\left\((.*?)\\right\)/g, '$1\\sqrt{$2}');
                                            val = val.replace(/([0-9]+)\s*v\s*\(([^)]+)\)/g, '$1\\sqrt{$2}');
                                            val = val.replace(/(?<![a-zA-Z\\])v\s*\\left\((.*?)\\right\)/g, '\\sqrt{$1}');
                                            val = val.replace(/(?<![a-zA-Z\\])v\s*\(([^)]+)\)/g, '\\sqrt{$1}');
                                            val = val.replace(/([0-9]+)\s*v\s*([0-9]+)/g, '$1\\sqrt{$2}');
                                            val = val.replace(/(?<![a-zA-Z\\])v\s*([0-9]+)/g, '\\sqrt{$1}');
                                            needsUpdate = true;
                                          }

                                          if (needsUpdate) {
                                            const currentSel = el.selection;
                                            el.setValue(val, { format: 'latex' });
                                            try {
                                              if (currentSel) el.selection = currentSel;
                                            } catch {}
                                          }
                                          saveToLocalStorageSilently();
                                        });
                                        
                                        // Detect selection for context menu
                                        el.addEventListener('selection-change', () => {
                                          if (el.hasFocus() && !el.selection.isCollapsed) {
                                            try {
                                              const sel = el.getValue(el.selection, 'latex');
                                              if (/^[0-9]+$/.test(sel)) {
                                                setSelectionContext({ lineId: line.id, show: true });
                                              } else {
                                                setSelectionContext(null);
                                              }
                                            } catch (e) {
                                              setSelectionContext(null);
                                            }
                                          } else {
                                            setSelectionContext(null);
                                          }
                                        });
                                      }
                                      // Save base shortcuts on first initialization if not saved
                                      if (!el._baseShortcuts) {
                                        el._baseShortcuts = el.inlineShortcuts || {};
                                      }

                                      mathFieldsRef.current[line.id] = el;
                                      el.onkeydown = (e: KeyboardEvent) => {
                                        if (e.key === '#' || (e.key === '3' && e.altKey)) {
                                          e.preventDefault();
                                          setLines(prev => prev.map(l => l.id === line.id ? {
                                            ...l,
                                            isComment: true,
                                            commentText: '',
                                            initialValue: '#'
                                          } : l));
                                          setTimeout(() => {
                                            commentInputsRef.current[line.id]?.focus();
                                          }, 50);
                                          return;
                                        }

                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          try {
                                            const currentVal = el.value || '';
                                            if (isCommentLine(currentVal)) {
                                              const comment = extractCommentText(currentVal);
                                              setLines(prev => prev.map(l => l.id === line.id ? {
                                                ...l,
                                                isComment: true,
                                                commentText: comment,
                                                initialValue: `#${comment}`
                                              } : l));
                                              handleAddLine(index);
                                              return;
                                            }
                                            const formatted = formatMathExpression(currentVal);
                                            if (formatted !== currentVal) {
                                              el.setValue(formatted, { format: 'latex' });
                                              try {
                                                if (typeof el.render === 'function') el.render();
                                              } catch {}
                                            }
                                          } catch {}
                                          handleAddLine(index);
                                        }
                                      };
                                      try {
                                        el.mathVirtualKeyboardPolicy = 'manual';
                                      } catch {}
                                      el.inlineShortcuts = getMathLiveInlineShortcuts(autoCompleteEnabled);
                                    }
                                  }}
                                  math-virtual-keyboard-policy="manual"
                                  onFocus={() => {
                                    setActiveLineId(line.id);
                                    if (boardSettings.autoOpenKeyboardOnFocus) {
                                      setIsKeyboardOpen(true);
                                      setIsKeyboardMinimized(false);
                                    }
                                  }}
                                  style={{ 
                                    fontSize: getFontSizeRem(boardSettings.fontSize), 
                                    width: '90%', 
                                    textAlign: boardSettings.alignment, 
                                    border: 'none', 
                                    outline: 'none', 
                                    background: 'transparent',
                                    color: 'inherit'
                                  }}
                                >
                                </math-field>

                                {/* Context Menu for Power/Subscript */}
                                {selectionContext?.show && selectionContext.lineId === line.id && (
                                   <div className="absolute top-[-50px] z-50 flex items-center gap-1 bg-slate-800 text-white p-1 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                                      <button 
                                        onMouseDown={(e) => {
                                          e.preventDefault(); 
                                          if (mathFieldsRef.current[line.id]) {
                                            mathFieldsRef.current[line.id].insert('^{#0}');
                                            mathFieldsRef.current[line.id].focus();
                                          }
                                          setSelectionContext(null);
                                        }}
                                        className="flex items-center px-3 py-1.5 text-xs font-bold hover:bg-indigo-500 rounded-lg transition-colors"
                                        title="Mettre en Puissance"
                                      >
                                        x²
                                      </button>
                                      <div className="w-px h-5 bg-slate-600 mx-0.5" />
                                      <button 
                                        onMouseDown={(e) => {
                                          e.preventDefault(); 
                                          if (mathFieldsRef.current[line.id]) {
                                            mathFieldsRef.current[line.id].insert('_{#0}');
                                            mathFieldsRef.current[line.id].focus();
                                          }
                                          setSelectionContext(null);
                                        }}
                                        className="flex items-center px-3 py-1.5 text-xs font-bold hover:bg-emerald-500 rounded-lg transition-colors"
                                        title="Mettre en Indice"
                                      >
                                        x₂
                                      </button>
                                   </div>
                                )}
                              </div>
                            )}

                            {/* Raw LaTeX Editor (only available for math lines) */}
                            {!line.isComment && rawModeLines[line.id] && (
                              <div className="w-full flex-1 flex justify-center px-4">
                                <textarea
                                  data-line-id={line.id}
                                  className="w-full max-w-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-sm p-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 focus:outline-none resize-none"
                                  rows={3}
                                  defaultValue={mathFieldsRef.current[line.id]?.value || line.initialValue}
                                  placeholder="Entrez le code LaTeX brut ici..."
                                  onBlur={(e) => {
                                    const el = mathFieldsRef.current[line.id];
                                    if (el) {
                                      // Clean value (strip $$)
                                      let val = e.target.value.trim();
                                      if (val.startsWith('$$') && val.endsWith('$$')) {
                                        val = val.substring(2, val.length - 2).trim();
                                      } else if (val.startsWith('$') && val.endsWith('$')) {
                                        val = val.substring(1, val.length - 1).trim();
                                      }
                                      // Convert raw string literal '\$' or '$$' inserted by bad pastes to real LaTeX
                                      val = val.replace(/\\\$/g, ''); 
                                      // Format math powers and operators
                                      val = formatMathExpression(val);
                                      el.value = val;
                                      saveToLocalStorageSilently();
                                    }
                                  }}
                                />
                              </div>
                            )}

                            {/* Actions line - Discrete glassmorphic capsule */}
                            <div className={`absolute right-1 flex items-center gap-1 transition-opacity print:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-md ${
                              activeLineId === line.id ? 'opacity-100' : 'opacity-60 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                            }`}>
                              {/* Refresh / Re-render Equation Icon */}
                              <button
                                onClick={() => handleRefreshLine(line.id)}
                                className={`p-1.5 text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-lg transition-all cursor-pointer ${
                                  refreshingLineId === line.id ? 'animate-spin text-sky-600' : 'hover:rotate-45'
                                }`}
                                title={line.isComment ? "Actualiser le commentaire" : "Actualiser et formater le calcul (ex: x2 → x², x3 → x³)"}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>

                              {/* Toggle between Math formula and Text comment */}
                              <button
                                onClick={() => {
                                  if (line.isComment) {
                                    // Convert to Math formula
                                    const text = line.commentText || '';
                                    setLines(prev => prev.map(l => l.id === line.id ? {
                                      ...l,
                                      isComment: false,
                                      initialValue: text,
                                      commentText: ''
                                    } : l));
                                    setTimeout(() => {
                                      const mf = mathFieldsRef.current[line.id];
                                      if (mf) {
                                        mf.value = text;
                                        mf.focus();
                                      }
                                      saveToLocalStorageSilently();
                                    }, 50);
                                  } else {
                                    // Convert to Comment (text without #)
                                    const mf = mathFieldsRef.current[line.id];
                                    const val = mf ? mf.value : (line.initialValue || '');
                                    const comment = extractCommentText(val);
                                    setLines(prev => prev.map(l => l.id === line.id ? {
                                      ...l,
                                      isComment: true,
                                      commentText: comment,
                                      initialValue: `#${comment}`
                                    } : l));
                                    setTimeout(() => {
                                      const inputEl = commentInputsRef.current[line.id];
                                      if (inputEl) {
                                        inputEl.value = comment;
                                        inputEl.focus();
                                      }
                                      saveToLocalStorageSilently();
                                    }, 50);
                                  }
                                }}
                                className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-all cursor-pointer"
                                title={line.isComment ? "Convertir en formule mathématique" : "Convertir en texte / commentaire"}
                              >
                                {line.isComment ? <Calculator className="w-4 h-4" /> : <Type className="w-4 h-4" />}
                              </button>

                              {!line.isComment && (
                                <button
                                  onClick={() => {
                                    setRawModeLines(prev => ({ ...prev, [line.id]: !prev[line.id] }));
                                    if (rawModeLines[line.id]) {
                                      setTimeout(() => mathFieldsRef.current[line.id]?.focus(), 50);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                                  title={rawModeLines[line.id] ? "Interpréter (Vue Mathématique)" : "Éditer le LaTeX brut"}
                                >
                                  {rawModeLines[line.id] ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  let duplicatedVal = '';
                                  if (line.isComment) {
                                    const inputEl = commentInputsRef.current[line.id];
                                    duplicatedVal = inputEl ? inputEl.value : (line.commentText || '');
                                  } else {
                                    const mf = mathFieldsRef.current[line.id];
                                    duplicatedVal = mf ? mf.value : (line.initialValue || '');
                                  }
                                  const newLines = [...lines];
                                  newLines.splice(index + 1, 0, {
                                    id: Date.now(),
                                    initialValue: line.isComment ? `#${duplicatedVal}` : duplicatedVal,
                                    isComment: line.isComment,
                                    commentText: line.isComment ? duplicatedVal : '',
                                    color: line.color,
                                  });
                                  setLines(newLines);
                                }}
                                className="p-1.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all cursor-pointer"
                                title="Dupliquer la ligne"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              
                              {lines.length > 1 && (
                                <button
                                  onClick={() => {
                                    const newLines = lines.filter(l => l.id !== line.id);
                                    setLines(newLines);
                                    delete mathFieldsRef.current[line.id];
                                    delete commentInputsRef.current[line.id];
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all cursor-pointer"
                                  title="Supprimer la ligne"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Primary Call to Action Buttons */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
                          <button
                            id="btn-add-line-bottom-cta"
                            onClick={() => handleAddLine()}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter une ligne de calcul</span>
                            <span className="ml-1 px-2 py-0.5 text-[10px] font-mono font-medium bg-white/20 rounded-md">Entrée ↵</span>
                          </button>

                          <button
                            id="btn-add-comment-bottom-cta"
                            onClick={() => handleAddLine(undefined, true)}
                            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                            title="Ajouter une consigne ou un titre (ex: 1. Factorisons A)"
                          >
                            <Type className="w-4 h-4 text-amber-500" />
                            <span>Commentaire / Titre</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  <p className="mt-4 text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1.5 print:hidden">
                    <Keyboard className="w-3.5 h-3.5 text-indigo-400" /> Saisie au clavier physique ou avec le clavier interactif flottant.
                  </p>
                </div>

                {/* Floating Virtual Keyboard Toggle Button (when closed) */}
                <AnimatePresence>
                  {!isKeyboardOpen && (
                    <motion.button
                      id="btn-open-floating-keyboard"
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsKeyboardOpen(true);
                        setIsKeyboardMinimized(false);
                      }}
                      className="absolute bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-all text-xs sm:text-sm font-semibold border border-indigo-400/30 print:hidden cursor-pointer"
                      title="Afficher le clavier virtuel flottant"
                    >
                      <Keyboard className="w-4 h-4" />
                      <span>Clavier Virtuel</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Floating Draggable Virtual Keyboard Container */}
                <AnimatePresence>
                  {isKeyboardOpen && (
                    <motion.div
                      drag
                      dragControls={dragControls}
                      dragListener={false}
                      dragMomentum={false}
                      dragConstraints={boardBodyRef}
                      dragElastic={0}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute bottom-6 right-6 z-50 w-[94vw] sm:w-[580px] md:w-[640px] max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl rounded-2xl overflow-hidden flex flex-col print:hidden select-none"
                      style={{
                        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(99, 102, 241, 0.15)'
                      }}
                    >
                      {/* Draggable Header */}
                      <div
                        onPointerDown={(e) => {
                          e.preventDefault();
                          dragControls.start(e);
                        }}
                        className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90 cursor-grab active:cursor-grabbing shrink-0 select-none touch-none"
                        title="Glisser pour déplacer le clavier"
                      >
                        <div className="flex items-center gap-2 pointer-events-none">
                          <GripHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Keyboard className="w-4 h-4 text-indigo-500" />
                            <span>Clavier Virtuel MathLive</span>
                          </span>
                          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200/60 dark:border-indigo-800/50">
                            Flottant & Déplaçable
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Minimize / Expand Toggle */}
                          <button
                            onClick={() => setIsKeyboardMinimized(!isKeyboardMinimized)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400 cursor-pointer"
                            title={isKeyboardMinimized ? "Agrandir le clavier" : "Réduire le clavier"}
                          >
                            {isKeyboardMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                          </button>

                          {/* Close */}
                          <button
                            onClick={() => setIsKeyboardOpen(false)}
                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors text-slate-500 dark:text-slate-400 cursor-pointer"
                            title="Masquer le clavier"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Container for MathLive Virtual Keyboard */}
                      <div 
                        ref={kbdContainerRef} 
                        className={isKeyboardMinimized ? 'hidden' : 'h-[250px] sm:h-[280px] overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 relative'}
                        style={{ '--keyboard-zindex': 10 } as React.CSSProperties}
                      >
                        {/* MathLive injects its keyboard here */}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Floating Exit Button for Zen Mode */}
          <AnimatePresence>
            {isZenMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                onClick={() => setIsZenMode(false)}
                className="fixed top-4 right-4 z-[90] flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20 text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 print:hidden"
                title="Quitter le mode plein écran épuré"
              >
                <X className="w-4 h-4" />
                <span>Quitter Mode Zen</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Board Settings Drawer */}
          <BoardSettingsDrawer
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={boardSettings}
            onUpdateSettings={handleUpdateSettings}
            onResetSettings={handleResetSettings}
            onClearBoard={handleClearBoard}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
