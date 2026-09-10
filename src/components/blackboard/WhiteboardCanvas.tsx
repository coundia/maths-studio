import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, Plus, Pipette, ChevronUp, PenTool } from 'lucide-react';
import { 
  BoardThemeStyle, 
  BoardGridPattern, 
  getGridStyle, 
  getBoardThemeClasses 
} from './boardSettings';
import { useTheme } from '../../context/ThemeContext';

interface Point {
  x: number;
  y: number;
}

interface WhiteboardCanvasProps {
  isOverlay?: boolean;
  themeStyle?: BoardThemeStyle;
  gridPattern?: BoardGridPattern;
  gridOpacity?: number;
  defaultColor?: string;
  defaultLineWidth?: number;
  customColors?: string[];
  onAddCustomColor?: (color: string) => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ 
  isOverlay = false,
  themeStyle = 'classic-slate',
  gridPattern = 'none',
  gridOpacity = 0.15,
  defaultColor,
  defaultLineWidth,
  customColors = [],
  onAddCustomColor
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(() => {
    if (isOverlay) return '#ef4444';
    if (defaultColor) return defaultColor;
    return themeStyle === 'whiteboard-clean' ? '#1e293b' : '#ffffff';
  });
  const [lineWidth, setLineWidth] = useState(() => {
    if (isOverlay) return 4;
    return defaultLineWidth || 3;
  });
  const [isEraser, setIsEraser] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Sync default color and line width when settings change
  useEffect(() => {
    if (!isOverlay && defaultColor) {
      setColor(defaultColor);
    }
  }, [defaultColor, isOverlay]);

  useEffect(() => {
    if (!isOverlay && defaultLineWidth) {
      setLineWidth(defaultLineWidth);
    }
  }, [defaultLineWidth, isOverlay]);

  // Resize canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // Save current canvas content
        const ctx = canvasRef.current.getContext('2d');
        const imageData = ctx?.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        // Restore content after resize
        if (ctx && imageData) {
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Set context properties
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling on touch devices
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    ctx.beginPath();
    const { x, y } = getCoordinates(e);
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const baseColors = isOverlay 
    ? ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'] 
    : ['#ffffff', '#f87171', '#34d399', '#60a5fa', '#fbbf24', '#c084fc'];

  const allToolbarColors = Array.from(new Set([...baseColors, ...(customColors || [])]));

  const themeClasses = getBoardThemeClasses(themeStyle, isDark);
  const gridStyle = getGridStyle(gridPattern, gridOpacity, themeStyle, isDark);

  return (
    <div 
      className={`w-full h-full flex flex-col relative ${isOverlay ? 'pointer-events-auto z-50' : `${themeClasses.containerClass} rounded-2xl overflow-hidden shadow-inner`}`}
      style={!isOverlay ? gridStyle : undefined}
    >
      {/* Drawing toolbar - Collapsible */}
      {isToolbarVisible ? (
        <div className={`absolute left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl flex items-center space-x-2 border border-slate-700 shadow-2xl z-10 max-w-[95%] overflow-x-auto ${isOverlay ? 'top-24' : 'top-4'}`}>
          <div className="flex items-center space-x-1.5 border-r border-slate-700 pr-2 mr-1">
            {allToolbarColors.map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-6 h-6 rounded-full transition-transform shrink-0 border border-black/20 ${color.toLowerCase() === c.toLowerCase() && !isEraser ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-md' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}

            {/* Real-time Color Picker */}
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-slate-400 hover:scale-110 transition-transform cursor-pointer shrink-0" title="Choisir une autre couleur">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const newC = e.target.value;
                  setColor(newC);
                  setIsEraser(false);
                }}
                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0"
                title="Choisir une autre couleur"
              />
              <div 
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: color }}
              >
                <Pipette className="w-3 h-3 drop-shadow" />
              </div>
            </div>

            {/* Quick Add picked color to custom colors */}
            {onAddCustomColor && !allToolbarColors.some(c => c.toLowerCase() === color.toLowerCase()) && (
              <button
                onClick={() => onAddCustomColor(color)}
                className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs transition-colors shrink-0 shadow-sm"
                title={`Ajouter ${color} à ma palette personnalisée`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${isEraser ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            title="Gomme"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors shrink-0 cursor-pointer"
            title="Effacer tout"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="w-px h-5 bg-slate-700 mx-1" />

          {/* Hide Toolbar Button */}
          <button
            onClick={() => setIsToolbarVisible(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Masquer la barre d'outils"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Collapsed Pill Button */
        <button
          onClick={() => setIsToolbarVisible(true)}
          className={`absolute left-1/2 -translate-x-1/2 bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-slate-700/80 text-xs font-semibold text-white shadow-xl z-10 cursor-pointer transition-all hover:scale-105 ${isOverlay ? 'top-24' : 'top-4'}`}
          title="Afficher les outils de dessin"
        >
          <PenTool className="w-3.5 h-3.5 text-indigo-400" />
          <span>Outils de dessin</span>
        </button>
      )}

      <div ref={containerRef} className="flex-1 w-full h-full cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
