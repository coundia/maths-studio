import React, { useState } from 'react';
import { CourseStep } from '../coursesData';
import { Dot, Minus, ArrowRight, Ruler } from 'lucide-react';

interface GeometryVisualizers6eProps {
  interactiveType: string;
  currentStepIdx: number;
  currentStep: CourseStep;
}

/**
 * Visualiseurs interactifs dédiés au programme de 6e : vocabulaire de base de
 * la géométrie, symétrie orthogonale, cercle, angles, droites perpendiculaires
 * et parallèles. Même schéma que GeometryVisualizers5e.tsx (petit contrôle en
 * en-tête, diagramme SVG, encart de synthèse), pour rester cohérent avec le
 * reste de l'application.
 *
 * Les couleurs des tracés utilisent les classes `fill-*`/`stroke-*` de la
 * palette (600 en clair, 400 en sombre) plutôt que des couleurs hexadécimales
 * fixes : sur fond blanc, un pastel pensé pour le mode sombre (ex. #7dd3fc)
 * devient quasi invisible (~1.7:1, sous le seuil WCAG), alors que ces classes
 * héritent du même contraste déjà garanti pour le texte de l'application.
 */
export const GeometryVisualizers6e: React.FC<GeometryVisualizers6eProps> = ({ interactiveType }) => {
  // 1. INTRODUCTION À LA GÉOMÉTRIE 6E
  const [introView, setIntroView] = useState<'point' | 'droite' | 'segment' | 'demi-droite'>('droite');

  // 2. SYMÉTRIE ORTHOGONALE 6E
  const [symDistance, setSymDistance] = useState<number>(45);

  // 3. LE CERCLE 6E
  const [cercleRadius, setCercleRadius] = useState<number>(70);

  // 4. LES ANGLES 6E
  const [angleDeg, setAngleDeg] = useState<number>(60);

  // 5. DROITES PERPENDICULAIRES ET PARALLÈLES 6E
  const [perpParallView, setPerpParallView] = useState<'perpendiculaires' | 'parallèles'>('perpendiculaires');

  // ---------------------------------------------------------------------
  // 1. INTRODUCTION À LA GÉOMÉTRIE : point, droite, segment, demi-droite
  // ---------------------------------------------------------------------
  if (interactiveType === 'geometrie-intro-6e') {
    const views: Array<{ id: typeof introView; label: string; icon: React.ElementType }> = [
      { id: 'point', label: 'Point A', icon: Dot },
      { id: 'droite', label: 'Droite (AB)', icon: Minus },
      { id: 'segment', label: 'Segment [AB]', icon: Ruler },
      { id: 'demi-droite', label: 'Demi-droite [AB)', icon: ArrowRight },
    ];

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setIntroView(v.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  introView === v.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        <svg viewBox="0 0 400 160" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Point A toujours visible */}
          <circle cx="80" cy="80" r="4.5" className="fill-red-600 dark:fill-red-400" />
          <text x="80" y="65" textAnchor="middle" className="fill-red-700 dark:fill-red-400 text-[13px] font-bold">
            A
          </text>

          {introView === 'droite' && (
            <>
              <line x1="20" y1="80" x2="380" y2="80" strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
              <polygon points="380,80 370,75 370,85" className="fill-sky-600 dark:fill-sky-400" />
              <polygon points="20,80 30,75 30,85" className="fill-sky-600 dark:fill-sky-400" />
              <circle cx="220" cy="80" r="4.5" className="fill-red-600 dark:fill-red-400" />
              <text x="220" y="65" textAnchor="middle" className="fill-red-700 dark:fill-red-400 text-[13px] font-bold">
                B
              </text>
              <text x="200" y="115" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
                (AB) : illimitée dans les deux sens
              </text>
            </>
          )}

          {introView === 'segment' && (
            <>
              <line x1="80" y1="80" x2="220" y2="80" strokeWidth="4" strokeLinecap="round" className="stroke-emerald-600 dark:stroke-emerald-400" />
              <circle cx="220" cy="80" r="4.5" className="fill-emerald-600 dark:fill-emerald-400" />
              <text x="220" y="65" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[13px] font-bold">
                B
              </text>
              <text x="150" y="115" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-bold">
                [AB] : limité par A et B
              </text>
            </>
          )}

          {introView === 'demi-droite' && (
            <>
              <line x1="80" y1="80" x2="360" y2="80" strokeWidth="3" className="stroke-amber-600 dark:stroke-amber-400" />
              <polygon points="360,80 348,75 348,85" className="fill-amber-600 dark:fill-amber-400" />
              <circle cx="220" cy="80" r="4" className="fill-amber-600 dark:fill-amber-400" />
              <text x="220" y="65" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[13px] font-bold">
                B
              </text>
              <text x="220" y="115" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[12px] font-bold">
                [AB) : origine A, illimitée vers B
              </text>
            </>
          )}

          {introView === 'point' && (
            <text x="80" y="115" textAnchor="middle" className="fill-red-700 dark:fill-red-400 text-[12px] font-bold">
              Un point : une position, sans longueur
            </text>
          )}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {introView === 'point' && 'Un point est repéré par une lettre majuscule.'}
            {introView === 'droite' && 'Une droite est un ensemble illimité de points alignés.'}
            {introView === 'segment' && 'AB (sans crochets) désigne la longueur du segment [AB].'}
            {introView === 'demi-droite' && "[AB) et [BA) ne sont pas la même demi-droite : l'ordre compte."}
          </span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // 2. SYMÉTRIE ORTHOGONALE : M, M' et la médiatrice (D)
  // ---------------------------------------------------------------------
  if (interactiveType === 'symetrie-axiale-6e') {
    const axisY = 100;
    const mX = 200;
    const mY = axisY - symDistance;
    const mPrimeY = axisY + symDistance;

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Distance de M à (D) : <b className="text-emerald-600 dark:text-emerald-400">{symDistance} px</b>
          </span>
          <input
            type="range"
            min="15"
            max="80"
            value={symDistance}
            onChange={(e) => setSymDistance(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>

        <svg viewBox="0 0 400 220" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Axe (D) */}
          <line x1="20" y1={axisY} x2="380" y2={axisY} strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
          <text x="365" y={axisY - 8} className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
            (D)
          </text>

          {/* Segment [MM'] pointillé */}
          <line x1={mX} y1={mY} x2={mX} y2={mPrimeY} strokeWidth="1.5" strokeDasharray="4" className="stroke-slate-500 dark:stroke-slate-500" />

          {/* Marque d'angle droit en I */}
          <rect x={mX - 8} y={axisY - 8} width="8" height="8" fill="none" strokeWidth="1.2" className="stroke-slate-500 dark:stroke-slate-500" />
          <circle cx={mX} cy={axisY} r="3" className="fill-slate-600 dark:fill-slate-400" />
          <text x={mX + 8} y={axisY + 14} className="fill-slate-700 dark:fill-slate-400 text-[11px] font-bold">
            I
          </text>

          {/* Point M au-dessus */}
          <circle cx={mX} cy={mY} r="5" className="fill-red-600 dark:fill-red-400" />
          <text x={mX - 15} y={mY + 4} className="fill-red-700 dark:fill-red-400 text-[13px] font-bold">
            M
          </text>

          {/* Point M' symétrique en dessous */}
          <circle cx={mX} cy={mPrimeY} r="5" className="fill-emerald-600 dark:fill-emerald-400" />
          <text x={mX - 20} y={mPrimeY + 4} className="fill-emerald-700 dark:fill-emerald-300 text-[13px] font-bold">
            M'
          </text>
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">(D) est la médiatrice de [MM'] : </span>
          <span className="text-slate-700 dark:text-slate-300">
            I milieu de [MM'], et (D) ⊥ (MM') — les deux distances valent {symDistance} px.
          </span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // 3. LE CERCLE : rayon, diamètre, corde et position d'un point
  // ---------------------------------------------------------------------
  if (interactiveType === 'cercle-6e') {
    const cx = 200;
    const cy = 110;
    const r = cercleRadius;
    const diameter = (r * 2).toFixed(0);

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Rayon r = <b className="text-emerald-600 dark:text-emerald-400">{r} px</b> (diamètre = {diameter} px)
          </span>
          <input
            type="range"
            min="45"
            max="90"
            value={cercleRadius}
            onChange={(e) => setCercleRadius(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>

        <svg viewBox="0 0 400 220" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />

          {/* Centre O */}
          <circle cx={cx} cy={cy} r="3.5" className="fill-red-600 dark:fill-red-400" />
          <text x={cx + 6} y={cy - 6} className="fill-red-700 dark:fill-red-400 text-[12px] font-bold">
            O
          </text>

          {/* Rayon OA */}
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} strokeWidth="2.5" className="stroke-amber-600 dark:stroke-amber-400" />
          <circle cx={cx + r} cy={cy} r="4" className="fill-amber-600 dark:fill-amber-400" />
          <text x={cx + r / 2 - 10} y={cy - 8} className="fill-amber-700 dark:fill-amber-300 text-[11px] font-bold">
            rayon
          </text>

          {/* Diamètre */}
          <line x1={cx - r} y1={cy + 40} x2={cx + r} y2={cy + 40} strokeWidth="2" strokeDasharray="5" className="stroke-violet-600 dark:stroke-violet-400" />
          <text x={cx} y={cy + 55} textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[11px] font-bold">
            diamètre = 2 × rayon
          </text>

          {/* Points intérieur / sur / extérieur */}
          <circle cx={cx - r * 0.5} cy={cy - r * 0.3} r="4" className="fill-sky-600 dark:fill-sky-400" />
          <text x={cx - r * 0.5 - 8} y={cy - r * 0.3 - 8} className="fill-sky-700 dark:fill-sky-300 text-[10px] font-bold">
            intérieur
          </text>

          <circle
            cx={cx + r * Math.cos((-50 * Math.PI) / 180)}
            cy={cy + r * Math.sin((-50 * Math.PI) / 180)}
            r="4"
            className="fill-emerald-600 dark:fill-emerald-400"
          />
          <text
            x={cx + r * Math.cos((-50 * Math.PI) / 180) + 8}
            y={cy + r * Math.sin((-50 * Math.PI) / 180)}
            className="fill-emerald-700 dark:fill-emerald-300 text-[10px] font-bold"
          >
            sur le cercle
          </text>

          <circle cx={cx + r * 1.35} cy={cy + 25} r="4" className="fill-red-600 dark:fill-red-400" />
          <text x={cx + r * 1.35 + 8} y={cy + 25} className="fill-red-700 dark:fill-red-400 text-[10px] font-bold">
            extérieur
          </text>
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">C(O ; r) : </span>
          <span className="text-slate-700 dark:text-slate-300">tous les points du cercle sont à la distance r du centre O.</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // 4. LES ANGLES : mesure au rapporteur et classification
  // ---------------------------------------------------------------------
  if (interactiveType === 'angles-6e') {
    const ox = 90;
    const oy = 170;
    const armLength = 140;
    const rad = (angleDeg * Math.PI) / 180;
    const yx = ox + armLength * Math.cos(rad);
    const yy = oy - armLength * Math.sin(rad);

    const arcRadius = 34;
    const arcEndX = ox + arcRadius * Math.cos(rad);
    const arcEndY = oy - arcRadius * Math.sin(rad);
    const largeArc = angleDeg > 180 ? 1 : 0;

    const classification =
      angleDeg === 0
        ? 'nul'
        : angleDeg < 90
        ? 'aigu'
        : angleDeg === 90
        ? 'droit'
        : angleDeg < 180
        ? 'obtus'
        : 'plat';

    const classificationColor =
      classification === 'droit'
        ? 'text-sky-600 dark:text-sky-400'
        : classification === 'aigu'
        ? 'text-emerald-600 dark:text-emerald-400'
        : classification === 'obtus'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-rose-600 dark:text-rose-400';

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            mes x̂Oy = <b className="text-emerald-600 dark:text-emerald-400">{angleDeg}°</b>
          </span>
          <input
            type="range"
            min="0"
            max="180"
            step="5"
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-28 accent-emerald-500 cursor-pointer"
          />
        </div>

        <svg viewBox="0 0 380 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Côté [Ox) fixe */}
          <line x1={ox} y1={oy} x2={ox + armLength} y2={oy} strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
          <text x={ox + armLength - 8} y={oy + 16} className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
            x
          </text>

          {/* Côté [Oy) mobile */}
          <line x1={ox} y1={oy} x2={yx} y2={yy} strokeWidth="2.5" className="stroke-amber-600 dark:stroke-amber-400" />
          <text x={yx + (angleDeg > 90 ? -14 : 4)} y={yy - 4} className="fill-amber-700 dark:fill-amber-300 text-[12px] font-bold">
            y
          </text>

          {/* Arc de mesure */}
          <path
            d={`M ${ox + arcRadius} ${oy} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`}
            fill="none"
            strokeWidth="2"
            className="stroke-emerald-600 dark:stroke-emerald-400"
          />

          {/* Sommet O */}
          <circle cx={ox} cy={oy} r="4" className="fill-red-600 dark:fill-red-400" />
          <text x={ox - 16} y={oy + 4} className="fill-red-700 dark:fill-red-400 text-[12px] font-bold">
            O
          </text>
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          <span className={`font-bold ${classificationColor}`}>Angle {classification}</span>
          <span className="text-slate-700 dark:text-slate-300"> — mesure {angleDeg}°</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // 5. DROITES PERPENDICULAIRES ET PARALLÈLES
  // ---------------------------------------------------------------------
  if (interactiveType === 'droites-perp-parall-6e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setPerpParallView('perpendiculaires')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              perpParallView === 'perpendiculaires'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Perpendiculaires
          </button>
          <button
            onClick={() => setPerpParallView('parallèles')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              perpParallView === 'parallèles'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Parallèles
          </button>
        </div>

        <svg viewBox="0 0 400 220" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {perpParallView === 'perpendiculaires' ? (
            <>
              <line x1="40" y1="110" x2="360" y2="110" strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
              <text x="365" y="115" className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
                (D₁)
              </text>
              <line x1="200" y1="20" x2="200" y2="200" strokeWidth="2.5" className="stroke-amber-600 dark:stroke-amber-400" />
              <text x="206" y="30" className="fill-amber-700 dark:fill-amber-300 text-[12px] font-bold">
                (D₂)
              </text>
              {/* Marque d'angle droit */}
              <rect x="200" y="94" width="16" height="16" fill="none" strokeWidth="1.5" className="stroke-emerald-600 dark:stroke-emerald-400" />
              <text x="222" y="150" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-bold">
                (D₁) ⊥ (D₂)
              </text>
            </>
          ) : (
            <>
              <line x1="40" y1="70" x2="360" y2="70" strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
              <text x="365" y="75" className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
                (L)
              </text>
              <line x1="40" y1="150" x2="360" y2="150" strokeWidth="2.5" className="stroke-sky-600 dark:stroke-sky-400" />
              <text x="365" y="155" className="fill-sky-700 dark:fill-sky-300 text-[12px] font-bold">
                (Δ)
              </text>
              {/* Transversale perpendiculaire aux deux */}
              <line x1="200" y1="30" x2="200" y2="190" strokeWidth="2" strokeDasharray="5" className="stroke-amber-600 dark:stroke-amber-400" />
              <rect x="200" y="54" width="14" height="14" fill="none" strokeWidth="1.3" className="stroke-emerald-600 dark:stroke-emerald-400" />
              <rect x="200" y="134" width="14" height="14" fill="none" strokeWidth="1.3" className="stroke-emerald-600 dark:stroke-emerald-400" />
              <text x="140" y="115" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-bold">
                (L) ∥ (Δ)
              </text>
            </>
          )}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono">
          {perpParallView === 'perpendiculaires' ? (
            <span className="text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Perpendiculaires : </span>
              deux droites sécantes formant un angle droit.
            </span>
          ) : (
            <span className="text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Parallèles : </span>
              deux droites toutes deux perpendiculaires à une même troisième droite.
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
};
