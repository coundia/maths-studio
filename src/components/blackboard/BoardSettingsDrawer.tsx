import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Grid, 
  Palette, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  Hash, 
  Sparkles, 
  Keyboard, 
  PenTool, 
  Trash2,
  Check,
  Plus,
  CloudCheck,
  Pipette
} from 'lucide-react';
import { 
  BoardSettings, 
  BoardThemeStyle, 
  BoardGridPattern, 
  BoardFontSize, 
  DEFAULT_PRESET_COLORS,
  isValidHexColor,
  normalizeHexColor
} from './boardSettings';

interface BoardSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BoardSettings;
  onUpdateSettings: (newSettings: BoardSettings) => void;
  onResetSettings: () => void;
  onClearBoard?: () => void;
}

export const BoardSettingsDrawer: React.FC<BoardSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onClearBoard,
}) => {
  const [colorInput, setColorInput] = useState('#ec4899');
  const [colorInputText, setColorInputText] = useState('#ec4899');
  const [colorFeedback, setColorFeedback] = useState<string | null>(null);

  const update = <K extends keyof BoardSettings>(key: K, value: BoardSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleAddCustomColor = (rawColor: string) => {
    if (!isValidHexColor(rawColor)) {
      setColorFeedback('Code hex invalide (ex: #FF5722)');
      setTimeout(() => setColorFeedback(null), 3000);
      return;
    }
    const hex = normalizeHexColor(rawColor);
    const existing = settings.customColors || [];
    const allKnown = [...DEFAULT_PRESET_COLORS, ...existing].map((c) => c.toLowerCase());
    if (allKnown.includes(hex.toLowerCase())) {
      setColorFeedback('Cette couleur existe déjà dans la palette !');
      setTimeout(() => setColorFeedback(null), 3000);
      return;
    }

    const updated = [...existing, hex];
    update('customColors', updated);
    setColorFeedback('Couleur ajoutée et enregistrée !');
    setTimeout(() => setColorFeedback(null), 3000);
  };

  const handleRemoveCustomColor = (hexToRemove: string) => {
    const updated = (settings.customColors || []).filter(
      (c) => c.toLowerCase() !== hexToRemove.toLowerCase()
    );
    update('customColors', updated);
    if (settings.drawDefaultColor.toLowerCase() === hexToRemove.toLowerCase()) {
      update('drawDefaultColor', DEFAULT_PRESET_COLORS[0]);
    }
  };

  const QUICK_SUGGESTIONS = [
    { hex: '#ec4899', name: 'Rose fluo' },
    { hex: '#8b5cf6', name: 'Violet' },
    { hex: '#06b6d4', name: 'Cyan vif' },
    { hex: '#84cc16', name: 'Lime' },
    { hex: '#f97316', name: 'Orange' },
    { hex: '#eab308', name: 'Jaune' },
    { hex: '#14b8a6', name: 'Turquoise' },
    { hex: '#a855f7', name: 'Pourpre' },
  ];

  const allAvailableColors = Array.from(
    new Set([...DEFAULT_PRESET_COLORS, ...(settings.customColors || [])])
  );

  const THEMES: { id: BoardThemeStyle; label: string; desc: string; bg: string; border: string }[] = [
    {
      id: 'classic-slate',
      label: 'Ardoise Moderne',
      desc: 'Style sombre élégant neutre',
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-300 dark:border-slate-700',
    },
    {
      id: 'chalkboard-green',
      label: 'Tableau Vert Craie',
      desc: 'Ambiance classe & craie classique',
      bg: 'bg-[#123620]',
      border: 'border-[#1e4d30]',
    },
    {
      id: 'chalkboard-black',
      label: 'Ardoise Noire d\'école',
      desc: 'Contraste maximal style tableau d\'école',
      bg: 'bg-[#0b0e14]',
      border: 'border-slate-200 dark:border-slate-800',
    },
    {
      id: 'whiteboard-clean',
      label: 'Tableau Blanc Feutre',
      desc: 'Tableau blanc épuré haute clarté',
      bg: 'bg-white',
      border: 'border-slate-300',
    },
    {
      id: 'blueprint-blue',
      label: 'Bleu Technique',
      desc: 'Style papier millimétré géomètre',
      bg: 'bg-[#0a2540]',
      border: 'border-[#153e66]',
    },
  ];

  const GRIDS: { id: BoardGridPattern; label: string; iconDesc: string }[] = [
    { id: 'none', label: 'Uni (Sans grille)', iconDesc: 'Fond lisse uni' },
    { id: 'grid-small', label: 'Petits carreaux (5mm)', iconDesc: 'Cahier de calcul' },
    { id: 'grid-large', label: 'Grands carreaux', iconDesc: 'Écolier Seyès' },
    { id: 'ruled', label: 'Lignes horizontales', iconDesc: 'Ligné d\'écriture' },
    { id: 'dots', label: 'Points discrets', iconDesc: 'Repère & Géométrie' },
  ];

  const FONT_SIZES: { id: BoardFontSize; label: string; scale: string; badge: string }[] = [
    { id: 'compact', label: 'Compact', scale: '1.8rem', badge: 'Calculs longs' },
    { id: 'normal', label: 'Normal', scale: '2.2rem', badge: 'Standard' },
    { id: 'large', label: 'Grand', scale: '2.6rem', badge: 'Recommandé' },
    { id: 'huge', label: 'Projection', scale: '3.4rem', badge: 'Grand écran / Vidéo' },
  ];

  const DRAW_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#ffffff'];
  const DRAW_WIDTHS = [
    { val: 2, label: 'Fin' },
    { val: 4, label: 'Moyen' },
    { val: 6, label: 'Épais' },
    { val: 9, label: 'Feutre' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[110] print:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] md:w-[460px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[120] flex flex-col print:hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Settings className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Paramètres du Tableau
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Check className="w-2.5 h-2.5" /> Stockage actif
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sauvegarde automatique
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Fermer les paramètres"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
              
              {/* SECTION 1: STYLE ET ARRIERE PLAN */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Style & Arrière-plan du Tableau</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEMES.map((theme) => {
                    const isSelected = settings.themeStyle === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => update('themeStyle', theme.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative group flex items-start space-x-2.5 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg shrink-0 ${theme.bg} ${theme.border} border shadow-inner flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                            {theme.label}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                            {theme.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: QUADRILLAGE ET PAPIER */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Grid className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Quadrillage de Fond</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Opacité: {Math.round(settings.gridOpacity * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {GRIDS.map((grid) => {
                    const isSelected = settings.gridPattern === grid.id;
                    return (
                      <button
                        key={grid.id}
                        onClick={() => update('gridPattern', grid.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span className="truncate">{grid.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {settings.gridPattern !== 'none' && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Discret (5%)</span>
                      <span>Prononcé (35%)</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.35"
                      step="0.02"
                      value={settings.gridOpacity}
                      onChange={(e) => update('gridOpacity', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 3: TYPOGRAPHIE ET ALIGNEMENT */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Type className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Taille & Alignement des Formules</span>
                </div>

                {/* Font Size Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Taille du texte mathématique :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_SIZES.map((size) => {
                      // Tolérance pour l'arrondi (ex: 2.6000001)
                      const isSelected = typeof settings.fontSize === 'number' 
                        ? Math.abs(settings.fontSize - (size.id as number)) < 0.1
                        : settings.fontSize === size.id;
                      return (
                        <button
                          key={size.id}
                          onClick={() => update('fontSize', size.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 font-bold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold">{size.label}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {size.scale}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            {size.badge}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Zoom Step Configurator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Vitesse de zoom (+ / -) :
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                      {(settings.zoomStep || 0.2).toFixed(1)} rem
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    value={settings.zoomStep || 0.2}
                    onChange={(e) => update('zoomStep', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                    Ajustez la sensibilité des boutons de zoom en bas à gauche.
                  </p>
                </div>

                {/* Alignment */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Alignement des étapes de calcul :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => update('alignment', 'center')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
                        settings.alignment === 'center'
                          ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <AlignCenter className="w-4 h-4" />
                      <span>Centré</span>
                    </button>
                    <button
                      onClick={() => update('alignment', 'left')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
                        settings.alignment === 'left'
                          ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <AlignLeft className="w-4 h-4" />
                      <span>Aligné à gauche</span>
                    </button>
                  </div>
                </div>

                {/* Line Numbers Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <Hash className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Numérotation des lignes
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400">
                        Affiche 1, 2, 3... à gauche des étapes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => update('showLineNumbers', !settings.showLineNumbers)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.showLineNumbers ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.showLineNumbers ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION 4: SAISIE INTELLIGENTE ET CLAVIER */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-400">
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Saisie & Raccourcis Mathématiques</span>
                </div>

                {/* Auto Complete */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Auto-complétion intelligente
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Convertit x2 en x², rac en √, != en ≠
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => update('autoCompleteEnabled', !settings.autoCompleteEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.autoCompleteEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.autoCompleteEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Keyboard on focus */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <Keyboard className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Clavier virtuel automatique
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400">
                        Déploie le tiroir clavier au clic sur une équation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => update('autoOpenKeyboardOnFocus', !settings.autoOpenKeyboardOnFocus)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.autoOpenKeyboardOnFocus ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.autoOpenKeyboardOnFocus ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION 5: COULEURS ET PALETTE PERSONNALISÉE */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Palette className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>Palette & Nouvelles Couleurs</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {allAvailableColors.length} couleurs
                  </span>
                </div>

                {/* Feedback message if any */}
                {colorFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>{colorFeedback}</span>
                  </motion.div>
                )}

                {/* Add a new custom color */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Pipette className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    Ajouter une nouvelle couleur :
                  </label>

                  <div className="flex items-center gap-2">
                    {/* Native color picker swatch */}
                    <div className="relative shrink-0 w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
                      <input
                        type="color"
                        value={colorInput}
                        onChange={(e) => {
                          setColorInput(e.target.value);
                          setColorInputText(e.target.value);
                        }}
                        className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer opacity-0"
                        title="Ouvrir le sélecteur de couleur"
                      />
                      <div 
                        className="w-full h-full"
                        style={{ backgroundColor: colorInput }}
                      />
                    </div>

                    {/* Hex code input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={colorInputText}
                        onChange={(e) => {
                          setColorInputText(e.target.value);
                          if (isValidHexColor(e.target.value)) {
                            setColorInput(normalizeHexColor(e.target.value));
                          }
                        }}
                        placeholder="#FF5722"
                        className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        maxLength={7}
                      />
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAddCustomColor(colorInputText)}
                      className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  {/* Quick suggestion chips */}
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Suggestions rapides (cliquez pour ajouter) :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SUGGESTIONS.map((sug) => {
                        const isAdded = allAvailableColors.some(
                          (c) => c.toLowerCase() === sug.hex.toLowerCase()
                        );
                        return (
                          <button
                            key={sug.hex}
                            onClick={() => !isAdded && handleAddCustomColor(sug.hex)}
                            disabled={isAdded}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] border transition-all ${
                              isAdded
                                ? 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 cursor-default'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105 hover:border-indigo-400 dark:hover:border-indigo-700'
                            }`}
                            title={isAdded ? 'Déjà dans la palette' : `Ajouter ${sug.name}`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: sug.hex }}
                            />
                            <span>{sug.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Custom colors list with remove option */}
                {(settings.customColors || []).length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                      Vos couleurs personnalisées ({settings.customColors.length}) :
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {settings.customColors.map((c) => (
                        <div
                          key={c}
                          className="flex items-center gap-1.5 py-1 px-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-mono group"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">{c}</span>
                          <button
                            onClick={() => handleRemoveCustomColor(c)}
                            className="p-0.5 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title={`Supprimer la couleur ${c}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION: OPTIONS MODE DESSIN */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <PenTool className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span>Mode Dessin & Tracé</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                      Couleur initiale du feutre / craie (sélectionnez parmi votre palette) :
                    </label>
                    <div className="flex flex-wrap items-center gap-2 max-h-24 overflow-y-auto p-1">
                      {allAvailableColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => update('drawDefaultColor', c)}
                          className={`w-7 h-7 rounded-full transition-transform border border-slate-300/30 dark:border-slate-700/30 shrink-0 ${
                            settings.drawDefaultColor.toLowerCase() === c.toLowerCase()
                              ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c }}
                          title={`Choisir ${c} comme couleur par défaut`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                      Épaisseur du trait par défaut :
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DRAW_WIDTHS.map((w) => (
                        <button
                          key={w.val}
                          onClick={() => update('drawDefaultWidth', w.val)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all text-center ${
                            settings.drawDefaultWidth === w.val
                              ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: INTELLIGENCE ARTIFICIELLE */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-400">
                  <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Intelligence Artificielle (Gemini)</span>
                </div>
                
                <div className="bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="flex flex-col space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clé API (Token) Gemini</span>
                    <input 
                      type="password"
                      value={settings.aiToken || ''}
                      onChange={(e) => update('aiToken', e.target.value)}
                      placeholder="Collez votre clé secrète ici..."
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ce token est nécessaire pour faire fonctionner la résolution automatique (heuristique avancée). Il est stocké uniquement sur votre navigateur.
                  </p>
                </div>

                {/* Editeur d'opérations */}
                <div className="bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Boutons Rapides (Baguette Magique)</span>
                  <div className="flex flex-wrap gap-2">
                    {settings.customOperations?.map((op, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-2 pr-1 py-1 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
                        <span>{op}</span>
                        <button 
                          onClick={() => {
                            const newOps = settings.customOperations.filter((_, i) => i !== idx);
                            update('customOperations', newOps);
                          }}
                          className="text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-0.5 rounded"
                          title="Supprimer cette opération"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newOp = window.prompt('Ajouter un bouton rapide (ex: Factorisation) :');
                        if (newOp && newOp.trim()) {
                          update('customOperations', [...(settings.customOperations || []), newOp.trim()]);
                        }
                      }}
                      className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg px-2 py-1 text-xs font-medium transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 7: ACTIONS RAPIDES */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={onResetSettings}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Rétablir les réglages d'origine</span>
                </button>

                {onClearBoard && (
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous réinitialiser et vider toutes les lignes du tableau ?')) {
                        onClearBoard();
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    <span>Effacer tout le tableau</span>
                  </button>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <CloudCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Sauvegardé dans le stockage</span>
                <span className="sm:hidden">Sauvegardé</span>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Appliquer & Fermer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
