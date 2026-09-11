import React, { useState } from 'react';
import { CourseStep } from '../coursesData';
import { MathView } from './MathView';
import { Sparkles, ArrowRight, Check, Compass, CircleDot, Layers, Box } from 'lucide-react';

interface GeometryVisualizers3eProps {
  interactiveType: string;
  currentStepIdx: number;
  currentStep: CourseStep;
}

export const GeometryVisualizers3e: React.FC<GeometryVisualizers3eProps> = ({
  interactiveType,
  currentStepIdx,
  currentStep,
}) => {
  // States for interactive exploration
  const [thalesConfig, setThalesConfig] = useState<'triangle' | 'papillon'>('triangle');
  const [thalesRatio, setThalesRatio] = useState<number>(0.35); // AM/AB
  const [angleCentreVal, setAngleCentreVal] = useState<number>(80);
  const [activeParallelogramMethod, setActiveParallelogramMethod] = useState<number>(1);
  const [pointMOffset, setPointMOffset] = useState<number>(0); // Angle inscrit sliding point

  // 1. THÉORÈME DE THALÈS (Configuration Triangle & Papillon)
  if (interactiveType === 'thales-svg') {
    const isTriangle = thalesConfig === 'triangle';
    const amX = 60 + (380 - 60) * thalesRatio;
    const anY = 50 + (230 - 50) * thalesRatio;

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Toggle between Triangle and Butterfly configuration */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setThalesConfig('triangle')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              isTriangle
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Configuration Triangle (Emboîtée)
          </button>
          <button
            onClick={() => setThalesConfig('papillon')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              !isTriangle
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Configuration Papillon (Croisée)
          </button>
        </div>

        {/* SVG Visualization */}
        <svg viewBox="0 0 460 260" className="w-full max-w-[440px] h-auto drop-shadow-md select-none">
          <defs>
            <pattern id="grid-thales" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="460" height="260" fill="url(#grid-thales)" opacity="0.3" />

          {isTriangle ? (
            <>
              {/* Grand Triangle ABC */}
              {/* A=(220, 40), B=(70, 220), C=(370, 220) */}
              <polygon
                points="220,40 70,220 370,220"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Base (BC) */}
              <line x1="40" y1="220" x2="400" y2="220" stroke="#3b82f6" strokeWidth="3" />
              <text x="410" y="225" fill="#60a5fa" fontSize="12" fontWeight="bold">
                (BC)
              </text>

              {/* Parallel line (MN) */}
              {/* M is on [AB], N is on [AC] */}
              {/* Interpolation at ratio: M = A + ratio*(B-A), N = A + ratio*(C-A) */}
              {(() => {
                const mx = 220 + (70 - 220) * (currentStepIdx >= 2 ? 0.333 : thalesRatio);
                const my = 40 + (220 - 40) * (currentStepIdx >= 2 ? 0.333 : thalesRatio);
                const nx = 220 + (370 - 220) * (currentStepIdx >= 2 ? 0.333 : thalesRatio);
                const ny = 40 + (220 - 40) * (currentStepIdx >= 2 ? 0.333 : thalesRatio);

                return (
                  <>
                    {/* Small triangle AMN colored */}
                    <polygon
                      points={`220,40 ${mx},${my} ${nx},${ny}`}
                      fill="#10b981"
                      fillOpacity="0.2"
                    />

                    {/* (MN) Line extending */}
                    <line
                      x1={mx - 30}
                      y1={my}
                      x2={nx + 30}
                      y2={ny}
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                    <text x={nx + 35} y={ny + 4} fill="#34d399" fontSize="12" fontWeight="bold">
                      (MN) // (BC)
                    </text>

                    {/* Point M */}
                    <circle cx={mx} cy={my} r="4.5" fill="#10b981" />
                    <text x={mx - 18} y={my + 4} fill="#a7f3d0" fontSize="13" fontWeight="bold">
                      M
                    </text>

                    {/* Point N */}
                    <circle cx={nx} cy={ny} r="4.5" fill="#10b981" />
                    <text x={nx + 10} y={ny + 4} fill="#a7f3d0" fontSize="13" fontWeight="bold">
                      N
                    </text>

                    {/* Parallel marks */}
                    <polygon
                      points={`${(mx + nx) / 2 - 5},${my - 4} ${(mx + nx) / 2 + 5},${my} ${(mx + nx) / 2 - 5},${my + 4}`}
                      fill="#10b981"
                    />
                    <polygon
                      points="215,216 225,220 215,224"
                      fill="#3b82f6"
                    />
                  </>
                );
              })()}

              {/* Vertex A */}
              <circle cx="220" cy="40" r="5" fill="#ef4444" />
              <text x="220" y="28" fill="#f87171" textAnchor="middle" fontSize="15" fontWeight="bold">
                A (Sommet commun)
              </text>

              {/* Vertex B */}
              <circle cx="70" cy="220" r="4.5" fill="#3b82f6" />
              <text x="60" y="240" fill="#93c5fd" fontSize="14" fontWeight="bold">
                B
              </text>

              {/* Vertex C */}
              <circle cx="370" cy="220" r="4.5" fill="#3b82f6" />
              <text x="375" y="240" fill="#93c5fd" fontSize="14" fontWeight="bold">
                C
              </text>
            </>
          ) : (
            <>
              {/* Configuration Papillon: A is in the center */}
              {/* A=(220, 130), M=(120, 60), N=(320, 60), B=(320, 210), C=(120, 210) */}
              <line x1="80" y1="60" x2="360" y2="60" stroke="#10b981" strokeWidth="3" />
              <line x1="80" y1="210" x2="360" y2="210" stroke="#3b82f6" strokeWidth="3" />

              {/* Secant lines crossing at A */}
              <line x1="120" y1="60" x2="320" y2="210" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="320" y1="60" x2="120" y2="210" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Shading triangles */}
              <polygon points="220,130 120,60 320,60" fill="#10b981" fillOpacity="0.25" />
              <polygon points="220,130 120,210 320,210" fill="#3b82f6" fillOpacity="0.2" />

              {/* Center A */}
              <circle cx="220" cy="130" r="5" fill="#ef4444" />
              <text x="235" y="135" fill="#f87171" fontSize="14" fontWeight="bold">
                A
              </text>

              <circle cx="120" cy="60" r="4" fill="#10b981" />
              <text x="105" y="55" fill="#a7f3d0" fontSize="13" fontWeight="bold">
                M
              </text>
              <circle cx="320" cy="60" r="4" fill="#10b981" />
              <text x="325" y="55" fill="#a7f3d0" fontSize="13" fontWeight="bold">
                N
              </text>

              <circle cx="120" cy="210" r="4" fill="#3b82f6" />
              <text x="105" y="225" fill="#93c5fd" fontSize="13" fontWeight="bold">
                C
              </text>
              <circle cx="320" cy="210" r="4" fill="#3b82f6" />
              <text x="325" y="225" fill="#93c5fd" fontSize="13" fontWeight="bold">
                B
              </text>

              <text x="370" y="65" fill="#34d399" fontSize="12" fontWeight="bold">
                (MN) // (BC)
              </text>
            </>
          )}
        </svg>

        {/* Ratio Formula Card */}
        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Égalité fondamentale des 3 rapports :</span>
          <div className="my-1 text-sm sm:text-base font-extrabold text-black dark:text-white">
            <span className="text-emerald-700 dark:text-emerald-300">AM / AB</span> ={' '}
            <span className="text-sky-700 dark:text-sky-300">AN / AC</span> ={' '}
            <span className="text-amber-700 dark:text-amber-300">MN / BC</span>
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-[11px]">
            {isTriangle ? 'Petit triangle AMN / Grand triangle ABC' : 'Rapports en nœud papillon'}
          </span>
        </div>
      </div>
    );
  }

  // 2. ANGLE INSCRIT & ANGLE AU CENTRE
  if (interactiveType === 'angle-inscrit-svg') {
    const cx = 220;
    const cy = 130;
    const r = 95;

    // Angles on circle in degrees
    const angleA = 200;
    const angleB = 340;
    // Mobile Point M angle on the upper arc
    const angleM = 90 + pointMOffset * 20; // Default at top (90 deg)

    const rad = (deg: number) => (deg * Math.PI) / 180;
    const ax = cx + r * Math.cos(rad(angleA));
    const ay = cy + r * Math.sin(rad(angleA));
    const bx = cx + r * Math.cos(rad(angleB));
    const by = cy + r * Math.sin(rad(angleB));
    const mx = cx + r * Math.cos(rad(angleM));
    const my = cy - r * Math.sin(rad(angleM)); // SVG Y goes down

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Slider to slide M along the circle */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-700 dark:text-slate-300">Déplacer le point M sur l'arc :</span>
          <input
            type="range"
            min="-2"
            max="2"
            step="1"
            value={pointMOffset}
            onChange={(e) => setPointMOffset(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
          <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">Position {pointMOffset + 3}/5</span>
        </div>

        <svg viewBox="0 0 440 260" className="w-full max-w-[420px] h-auto drop-shadow-md select-none">
          {/* Main Circle */}
          <circle cx={cx} cy={cy} r={r} fill="#0b1120" stroke="#475569" strokeWidth="2.5" />

          {/* Intercepted Arc AB highlighted in bright Amber */}
          <path
            d={`M ${ax} ${ay} A ${r} ${r} 0 0 0 ${bx} ${by}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="5"
          />
          <text x={cx} y={cy + r + 20} fill="#fbbf24" textAnchor="middle" fontSize="12" fontWeight="bold">
            Arc intercepté AB
          </text>

          {/* Central Angle AOB */}
          <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#ef4444" strokeWidth="2.5" />
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#ef4444" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="4.5" fill="#ef4444" />
          <text x={cx - 15} y={cy - 5} fill="#f87171" fontSize="13" fontWeight="bold">
            O
          </text>

          {/* Angle au centre arc fill */}
          <polygon
            points={`${cx},${cy} ${ax},${ay} ${bx},${by}`}
            fill="#ef4444"
            fillOpacity="0.15"
          />
          <text x={cx} y={cy + 25} fill="#ef4444" textAnchor="middle" fontSize="13" fontWeight="bold">
            80° (Centre)
          </text>

          {/* Inscribed Angle AMB */}
          <line x1={mx} y1={my} x2={ax} y2={ay} stroke="#10b981" strokeWidth="3" />
          <line x1={mx} y1={my} x2={bx} y2={by} stroke="#10b981" strokeWidth="3" />
          <circle cx={mx} cy={my} r="6" fill="#10b981" />
          <text x={mx} y={my - 12} fill="#34d399" textAnchor="middle" fontSize="15" fontWeight="bold">
            M (40°)
          </text>

          {/* Points A and B */}
          <circle cx={ax} cy={ay} r="4.5" fill="#f59e0b" />
          <text x={ax - 18} y={ay + 5} fill="#fde68a" fontSize="13" fontWeight="bold">
            A
          </text>
          <circle cx={bx} cy={by} r="4.5" fill="#f59e0b" />
          <text x={bx + 10} y={by + 5} fill="#fde68a" fontSize="13" fontWeight="bold">
            B
          </text>
        </svg>

        {/* Dynamic Inscribed Angle Formula Card */}
        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <div className="text-sm font-bold text-black dark:text-white flex items-center justify-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400">AMB (inscrit) = 40°</span>
            <span className="text-slate-600 dark:text-slate-400">=</span>
            <span className="text-red-600 dark:text-red-400">AOB (centre) / 2 = 80° / 2</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
            Déplacez le point M : l'angle reste rigoureusement invariant à 40° !
          </p>
        </div>
      </div>
    );
  }

  // 3. PARTAGE D'UN SEGMENT EN 3 PARTIES ÉGALES
  if (interactiveType === 'partage-segment') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <svg viewBox="0 0 460 250" className="w-full max-w-[440px] h-auto drop-shadow-md select-none">
          {/* Main Segment [AB] */}
          {/* A = (60, 180), B = (390, 180) -> Length = 330px */}
          <line x1="60" y1="180" x2="390" y2="180" stroke="#94a3b8" strokeWidth="4" />
          <circle cx="60" cy="180" r="5" fill="#ef4444" />
          <text x="50" y="205" fill="#ef4444" fontSize="15" fontWeight="bold">
            A
          </text>
          <circle cx="390" cy="180" r="5" fill="#3b82f6" />
          <text x="395" y="205" fill="#3b82f6" fontSize="15" fontWeight="bold">
            B
          </text>

          {/* Division Points P and Q on [AB] */}
          {/* P at 1/3 (170, 180), Q at 2/3 (280, 180) */}
          {currentStepIdx >= 3 && (
            <>
              {/* Part 1: AP */}
              <line x1="60" y1="180" x2="170" y2="180" stroke="#10b981" strokeWidth="5" />
              <circle cx="170" cy="180" r="4.5" fill="#10b981" />
              <text x="170" y="205" fill="#34d399" textAnchor="middle" fontSize="14" fontWeight="bold">
                P
              </text>

              {/* Part 2: PQ */}
              <line x1="170" y1="180" x2="280" y2="180" stroke="#10b981" strokeWidth="5" />
              <circle cx="280" cy="180" r="4.5" fill="#10b981" />
              <text x="280" y="205" fill="#34d399" textAnchor="middle" fontSize="14" fontWeight="bold">
                Q
              </text>

              {/* Equality labels */}
              <text x="115" y="170" fill="#a7f3d0" textAnchor="middle" fontSize="12" fontWeight="bold">
                1/3
              </text>
              <text x="225" y="170" fill="#a7f3d0" textAnchor="middle" fontSize="12" fontWeight="bold">
                1/3
              </text>
              <text x="335" y="170" fill="#a7f3d0" textAnchor="middle" fontSize="12" fontWeight="bold">
                1/3
              </text>
            </>
          )}

          {/* Auxiliary half-line [Ax) at ~30 deg */}
          {/* Angle 30 deg: dx = cos(30)*L, dy = -sin(30)*L */}
          <line x1="60" y1="180" x2="360" y2="50" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3" />
          <text x="365" y="45" fill="#cbd5e1" fontSize="12">
            [Ax)
          </text>

          {/* Compass marks M1, M2, M3 on [Ax) */}
          {/* M1=(160, 137), M2=(260, 93), M3=(360, 50) */}
          <circle cx="160" cy="137" r="4" fill="#fbbf24" />
          <text x="155" y="125" fill="#fbbf24" fontSize="11" fontWeight="bold">
            M1
          </text>

          <circle cx="260" cy="93" r="4" fill="#fbbf24" />
          <text x="255" y="80" fill="#fbbf24" fontSize="11" fontWeight="bold">
            M2
          </text>

          <circle cx="360" cy="50" r="4" fill="#fbbf24" />
          <text x="355" y="38" fill="#fbbf24" fontSize="11" fontWeight="bold">
            M3
          </text>

          {/* Connecting (M3, B) */}
          <line x1="360" y1="50" x2="390" y2="180" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Parallel lines from M1 to P and M2 to Q */}
          {currentStepIdx >= 2 && (
            <>
              <line
                x1="260"
                y1="93"
                x2="280"
                y2="180"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <line
                x1="160"
                y1="137"
                x2="170"
                y2="180"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </>
          )}
        </svg>

        <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono">
          Théorème de Thalès : <span className="text-emerald-600 dark:text-emerald-400 font-bold">AP = PQ = QB = AB / 3</span>
        </div>
      </div>
    );
  }

  // 4. PARALLÉLOGRAMME GUIDE
  if (interactiveType === 'parallelogramme-guide') {
    const methods = [
      { id: 1, name: 'Diagonales de même milieu', rule: '[AC] et [BD] ont le même milieu I' },
      { id: 2, name: 'Égalité vectorielle', rule: 'Vecteur AB = Vecteur DC' },
      { id: 3, name: 'Côtés opposés // et égaux', rule: '(AB) // (CD) et AB = CD' },
      { id: 4, name: 'Côtés opposés égaux 2 à 2', rule: 'AB = CD et AD = BC' },
    ];

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Method selector buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveParallelogramMethod(m.id)}
              className={`p-2 rounded-xl text-[11px] font-semibold text-center transition-all ${
                activeParallelogramMethod === m.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Méthode {m.id}
            </button>
          ))}
        </div>

        {/* SVG Diagram illustrating the chosen method */}
        <svg viewBox="0 0 420 220" className="w-full max-w-[400px] h-auto drop-shadow-md select-none">
          {/* Parallelogram ABCD: A(100, 160), B(320, 160), C(360, 60), D(140, 60) */}
          <polygon
            points="100,160 320,160 360,60 140,60"
            fill="#0f172a"
            stroke="#10b981"
            strokeWidth="3"
          />

          {/* Vertices */}
          <circle cx="100" cy="160" r="4.5" fill="#ef4444" />
          <text x="85" y="175" fill="#f87171" fontSize="14" fontWeight="bold">
            A
          </text>
          <circle cx="320" cy="160" r="4.5" fill="#3b82f6" />
          <text x="330" y="175" fill="#93c5fd" fontSize="14" fontWeight="bold">
            B
          </text>
          <circle cx="360" cy="60" r="4.5" fill="#3b82f6" />
          <text x="370" y="55" fill="#93c5fd" fontSize="14" fontWeight="bold">
            C
          </text>
          <circle cx="140" cy="60" r="4.5" fill="#ef4444" />
          <text x="125" y="55" fill="#f87171" fontSize="14" fontWeight="bold">
            D
          </text>

          {/* Diagonals if method 1 */}
          {activeParallelogramMethod === 1 && (
            <>
              <line x1="100" y1="160" x2="360" y2="60" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4" />
              <line x1="320" y1="160" x2="140" y2="60" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4" />
              {/* Intersection I at (230, 110) */}
              <circle cx="230" cy="110" r="4.5" fill="#f59e0b" />
              <text x="235" y="105" fill="#fbbf24" fontSize="13" fontWeight="bold">
                I (Milieu commun)
              </text>
            </>
          )}

          {/* Vector arrows if method 2 */}
          {activeParallelogramMethod === 2 && (
            <>
              {/* Vector AB */}
              <line x1="100" y1="160" x2="320" y2="160" stroke="#38bdf8" strokeWidth="4" />
              <polygon points="310,155 320,160 310,165" fill="#38bdf8" />
              {/* Vector DC */}
              <line x1="140" y1="60" x2="360" y2="60" stroke="#38bdf8" strokeWidth="4" />
              <polygon points="350,55 360,60 350,65" fill="#38bdf8" />
            </>
          )}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Règle BFEM appliquée : </span>
          <span className="text-slate-900 dark:text-white">
            {methods.find((m) => m.id === activeParallelogramMethod)?.rule}
          </span>
        </div>
      </div>
    );
  }

  // 5. REPÉRAGE DANS LE PLAN (Coordonnées et distance)
  if (interactiveType === 'reperage-plan') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <svg viewBox="0 0 440 260" className="w-full max-w-[420px] h-auto drop-shadow-md select-none">
          <defs>
            <pattern id="grid-plan" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="440" height="260" fill="url(#grid-plan)" opacity="0.6" />

          {/* Origin O at (80, 200) */}
          {/* Axis Ox */}
          <line x1="50" y1="200" x2="400" y2="200" stroke="#64748b" strokeWidth="2.5" />
          <polygon points="395,196 405,200 395,204" fill="#64748b" />
          <text x="405" y="215" fill="#94a3b8" fontSize="12" fontWeight="bold">
            x
          </text>

          {/* Axis Oy */}
          <line x1="80" y1="230" x2="80" y2="30" stroke="#64748b" strokeWidth="2.5" />
          <polygon points="76,35 80,25 84,35" fill="#64748b" />
          <text x="65" y="30" fill="#94a3b8" fontSize="12" fontWeight="bold">
            y
          </text>

          <text x="65" y="215" fill="#94a3b8" fontSize="12" fontWeight="bold">
            O
          </text>

          {/* Point A(1; 2): x=80+1*40=120, y=200-2*40=120 */}
          <circle cx="120" cy="120" r="5" fill="#ef4444" />
          <text x="105" y="115" fill="#f87171" fontSize="13" fontWeight="bold">
            A(1; 2)
          </text>

          {/* Point B(4; 6): x=80+4*40=240, y=200-6*40=40 (wait, scaled to fit) */}
          {/* Scale 1 unit = 35px: */}
          {/* A(1; 2) -> (80 + 35 = 115, 200 - 70 = 130) */}
          {/* B(4; 5) -> (80 + 140 = 220, 200 - 175 = 25) */}
          {/* Vector AB line */}
          <line x1="115" y1="130" x2="255" y2="60" stroke="#10b981" strokeWidth="3.5" />
          <circle cx="255" cy="60" r="5" fill="#38bdf8" />
          <text x="265" y="65" fill="#7dd3fc" fontSize="13" fontWeight="bold">
            B(4; 6)
          </text>

          {/* Milieu K(2.5; 4) at (185, 95) */}
          <circle cx="185" cy="95" r="4.5" fill="#fbbf24" />
          <text x="195" y="100" fill="#fde68a" fontSize="12" fontWeight="bold">
            Milieu K(2,5; 4)
          </text>

          {/* Triangle for distance projection */}
          <line x1="115" y1="130" x2="255" y2="130" stroke="#64748b" strokeDasharray="3" />
          <line x1="255" y1="130" x2="255" y2="60" stroke="#64748b" strokeDasharray="3" />
          <text x="185" y="145" fill="#a7f3d0" fontSize="11" textAnchor="middle">
            Δx = 3
          </text>
          <text x="270" y="95" fill="#a7f3d0" fontSize="11">
            Δy = 4
          </text>
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold">Distance AB = √(3² + 4²) = √25 = 5</div>
        </div>
      </div>
    );
  }

  // 6. RACINE CARRÉE
  if (interactiveType === 'racine-carree') {
    return (
      <div className="w-full flex flex-col items-center space-y-4 max-w-lg">
        <div className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Extraction du plus grand carré parfait
          </span>
          <div className="text-2xl font-bold font-mono text-black dark:text-white">
            <MathView latex="\sqrt{72} = \sqrt{36 \times 2} = \sqrt{36} \times \sqrt{2} = 6\sqrt{2}" display={true} />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono">4 = 2²</div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono">9 = 3²</div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono">16 = 4²</div>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold border border-emerald-500/40">36 = 6²</div>
          </div>
        </div>
      </div>
    );
  }

  // 7. SYSTÈMES À 2 INCONNUES
  if (interactiveType === 'systemes-2-inconnues') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="w-full max-w-md p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2.5">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Point d'intersection des deux droites
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-black dark:text-white">
            <MathView latex="M(x \,;\, y) = (3 \,;\, 2)" display={true} />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            L'équation (D1) : 2x + 3y = 12 et (D2) : 5x - y = 13 se coupent en un point unique M(3, 2).
          </p>
        </div>
      </div>
    );
  }

  // 8. GÉOMÉTRIE DANS L'ESPACE
  if (interactiveType === 'geometrie-espace') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <svg viewBox="0 0 400 220" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* 3D Pyramid */}
          {/* Base: (100, 180), (280, 180), (320, 140), (140, 140) */}
          {/* Apex S: (210, 40) */}
          <polygon points="100,180 280,180 320,140 140,140" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
          <line x1="210" y1="40" x2="100" y2="180" stroke="#10b981" strokeWidth="2.5" />
          <line x1="210" y1="40" x2="280" y2="180" stroke="#10b981" strokeWidth="2.5" />
          <line x1="210" y1="40" x2="320" y2="140" stroke="#10b981" strokeWidth="2.5" />
          <line x1="210" y1="40" x2="140" y2="140" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4" />

          {/* Height SH */}
          <line x1="210" y1="40" x2="210" y2="160" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
          <circle cx="210" cy="40" r="4.5" fill="#ef4444" />
          <text x="210" y="30" fill="#f87171" textAnchor="middle" fontSize="13" fontWeight="bold">
            S (Sommet)
          </text>

          {/* Parallel section cut */}
          <polygon points="155,110 245,110 265,90 175,90" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="2" />
          <text x="280" y="100" fill="#93c5fd" fontSize="11" fontWeight="bold">
            Section k = 1/2
          </text>
        </svg>

        <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono">
          Rapport de réduction k = 1/2 : <span className="text-emerald-600 dark:text-emerald-400 font-bold">V' = (1/2)³ × V = 1/8 V</span>
        </div>
      </div>
    );
  }

  // Fallback default formula card
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center max-w-lg w-full">
      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
        {currentStep.rule}
      </div>
      <div className="my-3 text-lg sm:text-2xl font-mono font-bold text-black dark:text-white">
        <MathView latex={currentStep.latex} display={true} />
      </div>
      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
        {currentStep.explanation}
      </p>
    </div>
  );
};
