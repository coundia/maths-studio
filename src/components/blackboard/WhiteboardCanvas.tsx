import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2 } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const WhiteboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

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

  const COLORS = ['#ffffff', '#f87171', '#34d399', '#60a5fa', '#fbbf24'];

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 relative shadow-inner">
      {/* Drawing toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md p-2 rounded-xl flex items-center space-x-2 border border-slate-700 shadow-xl z-10">
        <div className="flex space-x-1 border-r border-slate-600 pr-2 mr-1">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-6 h-6 rounded-full transition-transform ${color === c && !isEraser ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-800' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`p-1.5 rounded-lg transition-colors ${isEraser ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          title="Gomme"
        >
          <Eraser className="w-5 h-5" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
          title="Effacer tout"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

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
