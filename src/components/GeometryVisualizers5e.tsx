import React, { useState } from 'react';
import { CourseStep } from '../coursesData';
import { MathView } from './MathView';
import { Box, Compass, RefreshCw, Triangle, Square, Percent, Divide, Maximize2, Hash, Calculator } from 'lucide-react';

interface GeometryVisualizers5eProps {
  interactiveType: string;
  currentStepIdx: number;
  currentStep: CourseStep;
}

export const GeometryVisualizers5e: React.FC<GeometryVisualizers5eProps> = ({
  interactiveType,
  currentStepIdx,
  currentStep,
}) => {
  // States for 5e interactive widgets
  const [solidType, setSolidType] = useState<'prisme' | 'cylindre'>('prisme');
  const [cylinderRadius, setCylinderRadius] = useState<number>(3);
  const [solidHeight, setSolidHeight] = useState<number>(7);

  const [activeQuadShape, setActiveQuadShape] = useState<'parallelogramme' | 'rectangle' | 'losange' | 'carre'>('parallelogramme');
  const [propMangoKg, setPropMangoKg] = useState<number>(5);

  const [triangleType, setTriangleType] = useState<'somme-angles' | 'mediatrice' | 'hauteur' | 'mediane' | 'bissectrice'>('somme-angles');
  const [angleAVal, setAngleAVal] = useState<number>(60);
  const [angleBVal, setAngleBVal] = useState<number>(70);

  const [fractionDenominator, setFractionDenominator] = useState<number>(3);
  const [fractionMultiplier, setFractionMultiplier] = useState<number>(2);

  const [angleSecantAngle, setAngleSecantAngle] = useState<number>(55);

  const [symRotateAngle, setSymRotateAngle] = useState<number>(180);
  const [symShape, setSymShape] = useState<'point' | 'segment' | 'triangle'>('segment');

  const [relPointVal, setRelPointVal] = useState<number>(-3);

  // 1. GÉOMÉTRIE DANS L'ESPACE 5E (Prisme droit & Cylindre de révolution)
  if (interactiveType === 'geometrie-espace-5e') {
    const isCyl = solidType === 'cylindre';
    const cylVolume = (Math.PI * cylinderRadius * cylinderRadius * solidHeight).toFixed(1);
    const cylAreaL = (2 * Math.PI * cylinderRadius * solidHeight).toFixed(1);
    // For triangular prism: base triangle b=6, h_t=4 => Area=12, P=6+5+5=16
    const prismBaseArea = 12;
    const prismPerimeter = 16;
    const prismVol = prismBaseArea * solidHeight;
    const prismAreaL = prismPerimeter * solidHeight;

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Solid toggle */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSolidType('prisme')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              !isCyl ? 'bg-emerald-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Prisme droit triangulaire</span>
          </button>
          <button
            onClick={() => setSolidType('cylindre')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              isCyl ? 'bg-emerald-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cylindre de révolution</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Hauteur h = <b className="text-emerald-400">{solidHeight} cm</b></span>
            <input
              type="range"
              min="4"
              max="12"
              value={solidHeight}
              onChange={(e) => setSolidHeight(Number(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer"
            />
          </div>
          {isCyl && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Rayon r = <b className="text-sky-400">{cylinderRadius} cm</b></span>
              <input
                type="range"
                min="2"
                max="6"
                value={cylinderRadius}
                onChange={(e) => setCylinderRadius(Number(e.target.value))}
                className="w-20 accent-sky-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* SVG Drawing */}
        <svg viewBox="0 0 400 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          <defs>
            <linearGradient id="solidGrad5e" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {!isCyl ? (
            // Triangular Prism in perspective
            <>
              {/* Bottom base: A(120, 160), B(240, 160), C(170, 180) */}
              {/* Top base: A'(120, 50), B'(240, 50), C'(170, 70) */}
              <polygon points="120,160 240,160 170,180" fill="#0f172a" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
              <polygon points="120,50 240,50 170,70" fill="url(#solidGrad5e)" stroke="#10b981" strokeWidth="2.5" />

              {/* Lateral edges */}
              <line x1="120" y1="50" x2="120" y2="160" stroke="#10b981" strokeWidth="2.5" />
              <line x1="240" y1="50" x2="240" y2="160" stroke="#10b981" strokeWidth="2.5" />
              <line x1="170" y1="70" x2="170" y2="180" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Front visible faces */}
              <polygon points="120,50 170,70 170,180 120,160" fill="#10b981" fillOpacity="0.15" />
              <polygon points="170,70 240,50 240,160 170,180" fill="#38bdf8" fillOpacity="0.2" />

              {/* Height dimension */}
              <line x1="265" y1="50" x2="265" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
              <text x="275" y="110" fill="#fbbf24" fontSize="12" fontWeight="bold">
                h = {solidHeight} cm
              </text>
              <text x="170" y="42" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                Base triangulaire
              </text>
            </>
          ) : (
            // Cylinder of revolution
            <>
              {/* Bottom ellipse */}
              <ellipse cx="200" cy="150" rx={cylinderRadius * 16} ry="18" fill="#0f172a" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
              <path
                d={`M ${200 - cylinderRadius * 16} 150 A ${cylinderRadius * 16} 18 0 0 0 ${200 + cylinderRadius * 16} 150`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Lateral sides */}
              <line x1={200 - cylinderRadius * 16} y1="50" x2={200 - cylinderRadius * 16} y2="150" stroke="#10b981" strokeWidth="2.5" />
              <line x1={200 + cylinderRadius * 16} y1="50" x2={200 + cylinderRadius * 16} y2="150" stroke="#10b981" strokeWidth="2.5" />
              <rect x={200 - cylinderRadius * 16} y="50" width={cylinderRadius * 32} height="100" fill="url(#solidGrad5e)" opacity="0.3" />

              {/* Top ellipse */}
              <ellipse cx="200" cy="50" rx={cylinderRadius * 16} ry="18" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2.5" />

              {/* Radius line on top */}
              <line x1="200" y1="50" x2={200 + cylinderRadius * 16} y2="50" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="200" cy="50" r="3.5" fill="#ef4444" />
              <text x={200 + (cylinderRadius * 16) / 2} y="44" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                r = {cylinderRadius}
              </text>

              {/* Height line */}
              <line x1={200 + cylinderRadius * 16 + 25} y1="50" x2={200 + cylinderRadius * 16 + 25} y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
              <text x={200 + cylinderRadius * 16 + 32} y="105" fill="#fbbf24" fontSize="12" fontWeight="bold">
                h = {solidHeight}
              </text>
            </>
          )}
        </svg>

        {/* Real-time Formulas */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-md text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] mb-1">Aire Latérale A_L</span>
            <span className="text-emerald-400 font-bold text-sm">
              {!isCyl ? `${prismAreaL} cm²` : `${cylAreaL} cm² (${2 * cylinderRadius * solidHeight}π)`}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] mb-1">Volume Total V</span>
            <span className="text-sky-400 font-bold text-sm">
              {!isCyl ? `${prismVol} cm³` : `${cylVolume} cm³ (${cylinderRadius * cylinderRadius * solidHeight}π)`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. LE QUADRILATÈRE 5E (Parallélogramme, Rectangle, Losange, Carré)
  if (interactiveType === 'quadrilatere-5e') {
    const quadConfig = {
      parallelogramme: {
        points: '80,150 280,150 320,60 120,60',
        diag1: { x1: 80, y1: 150, x2: 320, y2: 60 },
        diag2: { x1: 280, y1: 150, x2: 120, y2: 60 },
        rule: 'Diagonales de même milieu I • Côtés opposés // et égaux',
        formula: 'Aire = Base × Hauteur = b × h',
      },
      rectangle: {
        points: '90,150 310,150 310,60 90,60',
        diag1: { x1: 90, y1: 150, x2: 310, y2: 60 },
        diag2: { x1: 310, y1: 150, x2: 90, y2: 60 },
        rule: '4 angles droits • Diagonales de MÊME LONGUEUR qui se coupent au milieu',
        formula: 'Aire = Longueur × Largeur = L × l',
      },
      losange: {
        points: '200,40 320,105 200,170 80,105',
        diag1: { x1: 200, y1: 40, x2: 200, y2: 170 },
        diag2: { x1: 80, y1: 105, x2: 320, y2: 105 },
        rule: '4 côtés de même longueur • Diagonales PERPENDICULAIRES',
        formula: 'Aire = (Grande diagonale D × petite d) / 2',
      },
      carre: {
        points: '135,160 265,160 265,50 135,50',
        diag1: { x1: 135, y1: 160, x2: 265, y2: 50 },
        diag2: { x1: 265, y1: 160, x2: 135, y2: 50 },
        rule: 'À la fois Rectangle et Losange : 4 angles droits & 4 côtés égaux',
        formula: 'Aire = côté² = c × c',
      },
    }[activeQuadShape];

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full max-w-md">
          {(['parallelogramme', 'rectangle', 'losange', 'carre'] as const).map((shape) => (
            <button
              key={shape}
              onClick={() => setActiveQuadShape(shape)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold capitalize transition-all ${
                activeQuadShape === shape
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {shape === 'parallelogramme' ? 'Parallélogramme' : shape === 'carre' ? 'Carré' : shape}
            </button>
          ))}
        </div>

        {/* SVG Display */}
        <svg viewBox="0 0 400 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Main polygon */}
          <polygon points={quadConfig.points} fill="#0f172a" stroke="#10b981" strokeWidth="3" />
          {/* Diagonals */}
          <line
            x1={quadConfig.diag1.x1}
            y1={quadConfig.diag1.y1}
            x2={quadConfig.diag1.x2}
            y2={quadConfig.diag1.y2}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <line
            x1={quadConfig.diag2.x1}
            y1={quadConfig.diag2.y1}
            x2={quadConfig.diag2.x2}
            y2={quadConfig.diag2.y2}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4"
          />
          {/* Center I */}
          <circle cx="200" cy="105" r="4.5" fill="#f59e0b" />
          <text x="210" y="102" fill="#fbbf24" fontSize="12" fontWeight="bold">
            I (Milieu)
          </text>

          {/* Right angles for rectangle & carre */}
          {(activeQuadShape === 'rectangle' || activeQuadShape === 'carre') && (
            <rect x="90" y="60" width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="2" />
          )}

          {/* Perpendicular mark for losange */}
          {activeQuadShape === 'losange' && (
            <path d="M 195 105 L 195 95 L 200 95" fill="none" stroke="#ef4444" strokeWidth="2" />
          )}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-xs text-emerald-400 font-bold">{quadConfig.rule}</div>
          <div className="text-xs text-sky-300 font-mono">{quadConfig.formula}</div>
        </div>
      </div>
    );
  }

  // 3. PROPORTIONNALITÉ 5E (Tableau & Produit en croix)
  if (interactiveType === 'proportionnalite-5e') {
    const pricePerKg = 500;
    const totalCost = propMangoKg * pricePerKg;

    return (
      <div className="w-full flex flex-col items-center space-y-3 max-w-md">
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Exemple : Prix des mangues au marché (500 FCFA / kg)
          </div>

          {/* Slider for kg */}
          <div className="flex items-center justify-center space-x-3 text-xs text-slate-300">
            <span>Quantité : <b className="text-emerald-400 text-sm">{propMangoKg} kg</b></span>
            <input
              type="range"
              min="1"
              max="15"
              value={propMangoKg}
              onChange={(e) => setPropMangoKg(Number(e.target.value))}
              className="w-32 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Interactive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2 border border-slate-800">Masse (kg)</th>
                  <th className="p-2 border border-slate-800">1</th>
                  <th className="p-2 border border-slate-800">3</th>
                  <th className="p-2 border border-slate-800 bg-emerald-950 text-emerald-300">{propMangoKg}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white">
                  <td className="p-2 border border-slate-800 font-bold text-slate-400">Prix (FCFA)</td>
                  <td className="p-2 border border-slate-800">500</td>
                  <td className="p-2 border border-slate-800">1 500</td>
                  <td className="p-2 border border-slate-800 bg-emerald-950 text-emerald-400 font-bold">
                    {totalCost.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-center">
            <span className="text-slate-400">Coefficient k = </span>
            <span className="text-emerald-400 font-bold">500 FCFA/kg</span>
            <div className="text-sky-300 mt-1">
              Produit en croix : x = ({propMangoKg} × 1500) / 3 = {totalCost.toLocaleString()} FCFA
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. LES TRIANGLES 5E (Somme des angles 180° & Droites remarquables)
  if (interactiveType === 'triangles-5e') {
    const angleCVal = 180 - (angleAVal + angleBVal);

    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Toggle between sum of angles and special lines */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['somme-angles', 'mediatrice', 'hauteur', 'mediane', 'bissectrice'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTriangleType(mode)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                triangleType === mode
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'somme-angles'
                ? 'Somme = 180°'
                : mode === 'mediatrice'
                ? 'Médiatrices (Circonscrit)'
                : mode === 'hauteur'
                ? 'Hauteurs (Orthocentre)'
                : mode === 'mediane'
                ? 'Médianes (G)'
                : 'Bissectrices (Inscrit)'}
            </button>
          ))}
        </div>

        {/* Angle Sliders if in sum mode */}
        {triangleType === 'somme-angles' && (
          <div className="flex items-center justify-center gap-4 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Â = <b className="text-emerald-400">{angleAVal}°</b></span>
              <input
                type="range"
                min="20"
                max="100"
                value={angleAVal}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val + angleBVal < 170) setAngleAVal(val);
                }}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">B̂ = <b className="text-sky-400">{angleBVal}°</b></span>
              <input
                type="range"
                min="20"
                max="100"
                value={angleBVal}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (angleAVal + val < 170) setAngleBVal(val);
                }}
                className="w-20 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Triangle SVG */}
        <svg viewBox="0 0 400 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Triangle ABC: A(180, 40), B(60, 165), C(320, 165) */}
          <polygon points="180,40 60,165 320,165" fill="#0f172a" stroke="#10b981" strokeWidth="3" />

          {/* Vertices */}
          <circle cx="180" cy="40" r="4.5" fill="#ef4444" />
          <text x="180" y="28" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">
            A ({triangleType === 'somme-angles' ? `${angleAVal}°` : ''})
          </text>
          <circle cx="60" cy="165" r="4.5" fill="#3b82f6" />
          <text x="50" y="180" fill="#93c5fd" fontSize="13" fontWeight="bold">
            B ({triangleType === 'somme-angles' ? `${angleBVal}°` : ''})
          </text>
          <circle cx="320" cy="165" r="4.5" fill="#3b82f6" />
          <text x="325" y="180" fill="#93c5fd" fontSize="13" fontWeight="bold">
            C ({triangleType === 'somme-angles' ? `${angleCVal}°` : ''})
          </text>

          {/* Special lines overlay */}
          {triangleType === 'mediatrice' && (
            <>
              {/* Circumcircle centered around (185, 115) */}
              <circle cx="185" cy="115" r="76" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
              <line x1="190" y1="20" x2="190" y2="185" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="185" cy="115" r="4.5" fill="#f59e0b" />
              <text x="195" y="115" fill="#fbbf24" fontSize="12" fontWeight="bold">
                O (Centre circonscrit)
              </text>
            </>
          )}

          {triangleType === 'hauteur' && (
            <>
              {/* Height from A perpendicular to BC (x=180, y=40 to 165) */}
              <line x1="180" y1="40" x2="180" y2="165" stroke="#ef4444" strokeWidth="2.5" />
              <rect x="180" y="153" width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="188" y="100" fill="#f87171" fontSize="12" fontWeight="bold">
                Hauteur h
              </text>
            </>
          )}

          {triangleType === 'mediane' && (
            <>
              {/* Midpoint of BC is (190, 165). Median joins A(180, 40) to (190, 165) */}
              <line x1="180" y1="40" x2="190" y2="165" stroke="#a855f7" strokeWidth="2.5" />
              {/* G is at 2/3 along median: y ≈ 40 + (125)*2/3 ≈ 123 */}
              <circle cx="187" cy="123" r="5" fill="#a855f7" />
              <text x="198" y="125" fill="#d8b4fe" fontSize="12" fontWeight="bold">
                G (Centre de gravité, 2/3)
              </text>
            </>
          )}

          {triangleType === 'bissectrice' && (
            <>
              {/* Inscribed circle centered at (185, 125) radius 38 */}
              <circle cx="185" cy="125" r="38" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
              <circle cx="185" cy="125" r="4" fill="#10b981" />
              <text x="195" y="130" fill="#34d399" fontSize="12" fontWeight="bold">
                I (Cercle inscrit)
              </text>
            </>
          )}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs">
          {triangleType === 'somme-angles' ? (
            <div className="text-emerald-400 font-bold">
              Â + B̂ + Ĉ = {angleAVal}° + {angleBVal}° + {angleCVal}° = 180°
            </div>
          ) : (
            <div className="text-sky-300">
              {triangleType === 'mediatrice' && 'Les 3 médiatrices se coupent au centre du cercle circonscrit (OA = OB = OC).'}
              {triangleType === 'hauteur' && 'Les 3 hauteurs se coupent en l\'orthocentre H.'}
              {triangleType === 'mediane' && 'Le centre de gravité G est situé aux 2/3 de chaque médiane à partir du sommet (AG = 2/3 AA\').'}
              {triangleType === 'bissectrice' && 'Les 3 bissectrices se coupent au centre du cercle inscrit tangent aux côtés.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. LES FRACTIONS 5E (Égalité visuelle et opérations)
  if (interactiveType === 'fractions-5e') {
    const num = 2 * fractionMultiplier;
    const den = fractionDenominator * fractionMultiplier;

    return (
      <div className="w-full flex flex-col items-center space-y-3 max-w-md">
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Invariance de la fraction : Simplification & Agrandissement
          </div>

          {/* Multiplier button toggle */}
          <div className="flex items-center justify-center space-x-2 text-xs">
            <span className="text-slate-400">Multiplier numérateur & dénominateur par :</span>
            {[1, 2, 3, 4].map((k) => (
              <button
                key={k}
                onClick={() => setFractionMultiplier(k)}
                className={`w-7 h-7 rounded-lg font-bold transition-all ${
                  fractionMultiplier === k
                    ? 'bg-emerald-600 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Visual Fraction Bar */}
          <div className="w-full h-9 bg-slate-900 rounded-xl overflow-hidden flex border border-slate-700">
            {Array.from({ length: den }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 border-r border-slate-800 transition-colors ${
                  idx < num ? 'bg-emerald-500/80' : 'bg-slate-900'
                }`}
              />
            ))}
          </div>

          <div className="my-2 text-xl sm:text-2xl font-mono font-bold text-white">
            <MathView
              latex={`\\frac{2}{3} = \\frac{2 \\times ${fractionMultiplier}}{3 \\times ${fractionMultiplier}} = \\frac{${num}}{${den}}`}
              display={true}
            />
          </div>

          <p className="text-xs text-slate-400">
            Même proportion colorée ({((num / den) * 100).toFixed(0)}%), seule la finesse du découpage change.
          </p>
        </div>
      </div>
    );
  }

  // 6. LES ANGLES 5E (Parallèles et sécante, alternes-internes)
  if (interactiveType === 'angles-5e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Slider for secant inclination */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Inclinaison de la sécante : <b className="text-emerald-400">{angleSecantAngle}°</b></span>
          <input
            type="range"
            min="35"
            max="75"
            value={angleSecantAngle}
            onChange={(e) => setAngleSecantAngle(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* SVG Diagram */}
        <svg viewBox="0 0 400 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Parallel lines d1 and d2 */}
          <line x1="40" y1="65" x2="360" y2="65" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="365" y="70" fill="#7dd3fc" fontSize="12" fontWeight="bold">
            (d1)
          </text>
          <line x1="40" y1="145" x2="360" y2="145" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="365" y="150" fill="#7dd3fc" fontSize="12" fontWeight="bold">
            (d2) // (d1)
          </text>

          {/* Secant line Delta */}
          {/* At y=65, x ≈ 140 ; at y=145, x ≈ 250 */}
          {(() => {
            const dx = (80 / Math.tan((angleSecantAngle * Math.PI) / 180));
            const x1 = 190 - dx;
            const x2 = 190 + dx;
            return (
              <>
                <line x1={x1 - 30} y1="35" x2={x2 + 30} y2="175" stroke="#f59e0b" strokeWidth="3" />
                <text x={x2 + 35} y="180" fill="#fbbf24" fontSize="12" fontWeight="bold">
                  (Δ)
                </text>

                {/* Intersection points */}
                <circle cx={x1} cy="65" r="4.5" fill="#ef4444" />
                <circle cx={x2} cy="145" r="4.5" fill="#ef4444" />

                {/* Arc for alternate interior 1 (under d1, right of secant) */}
                <circle cx={x1} cy="65" r="16" fill="#10b981" fillOpacity="0.35" />
                <text x={x1 + 18} y="85" fill="#34d399" fontSize="11" fontWeight="bold">
                  {angleSecantAngle}°
                </text>

                {/* Arc for alternate interior 2 (above d2, left of secant) */}
                <circle cx={x2} cy="145" r="16" fill="#10b981" fillOpacity="0.35" />
                <text x={x2 - 32} y="135" fill="#34d399" fontSize="11" fontWeight="bold">
                  {angleSecantAngle}°
                </text>
              </>
            );
          })()}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono">
          <div className="text-emerald-400 font-bold">Théorème des angles alternes-internes :</div>
          <span className="text-slate-300">
            Puisque (d1) // (d2), les deux angles en forme de Z sont rigoureusement égaux ({angleSecantAngle}°).
          </span>
        </div>
      </div>
    );
  }

  // 7. LA SYMÉTRIE CENTRALE 5E
  if (interactiveType === 'symetrie-centrale-5e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Toggle rotation / slider */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Rotation du demi-tour : <b className="text-emerald-400">{symRotateAngle}°</b></span>
          <input
            type="range"
            min="0"
            max="180"
            step="10"
            value={symRotateAngle}
            onChange={(e) => setSymRotateAngle(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* SVG Central Symmetry */}
        <svg viewBox="0 0 400 200" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Center O at (200, 100) */}
          <circle cx="200" cy="100" r="5" fill="#ef4444" />
          <text x="200" y="85" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">
            O (Centre de symétrie)
          </text>

          {/* Original Segment AB: A(100, 60), B(150, 40) */}
          <line x1="100" y1="60" x2="150" y2="40" stroke="#3b82f6" strokeWidth="3.5" />
          <circle cx="100" cy="60" r="4" fill="#3b82f6" />
          <text x="85" y="60" fill="#93c5fd" fontSize="12" fontWeight="bold">
            A
          </text>
          <circle cx="150" cy="40" r="4" fill="#3b82f6" />
          <text x="145" y="30" fill="#93c5fd" fontSize="12" fontWeight="bold">
            B
          </text>

          {/* Alignment dashed lines through O */}
          <line x1="100" y1="60" x2="300" y2="140" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3" />
          <line x1="150" y1="40" x2="250" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3" />

          {/* Symmetrical Segment A'B': A'(300, 140), B'(250, 160) */}
          {(() => {
            const rad = ((symRotateAngle - 180) * Math.PI) / 180;
            // Vector from O(200, 100) to A'(300, 140) is (+100, +40)
            const aX = 200 + 100 * Math.cos(rad) - 40 * Math.sin(rad);
            const aY = 100 + 100 * Math.sin(rad) + 40 * Math.cos(rad);
            const bX = 200 + 50 * Math.cos(rad) - 60 * Math.sin(rad);
            const bY = 100 + 50 * Math.sin(rad) + 60 * Math.cos(rad);

            return (
              <>
                <line x1={aX} y1={aY} x2={bX} y2={bY} stroke="#10b981" strokeWidth="3.5" />
                <circle cx={aX} cy={aY} r="4.5" fill="#10b981" />
                <text x={aX + 8} y={aY + 4} fill="#a7f3d0" fontSize="12" fontWeight="bold">
                  A'
                </text>
                <circle cx={bX} cy={bY} r="4.5" fill="#10b981" />
                <text x={bX + 8} y={bY + 4} fill="#a7f3d0" fontSize="12" fontWeight="bold">
                  B'
                </text>
              </>
            );
          })()}
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono">
          <span className="text-emerald-400 font-bold">Propriété de l'isométrie : </span>
          <span className="text-white">O est le milieu de [AA'] et [BB'] • AB = A'B' • (AB) // (A'B')</span>
        </div>
      </div>
    );
  }

  // 8. MULTIPLES ET DIVISEURS 5E (Division euclidienne & PGCD)
  if (interactiveType === 'multiples-diviseurs-5e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3 max-w-md">
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Égalité euclidienne fondamentale
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            <MathView latex="89 = 7 \\times 12 + 5 \\quad (0 \\le 5 < 7)" display={true} />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-900 text-slate-300">
              <span className="block text-[10px] text-slate-500">Dividende</span>
              <b>89</b>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 text-slate-300">
              <span className="block text-[10px] text-slate-500">Diviseur</span>
              <b>7</b>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 text-slate-300">
              <span className="block text-[10px] text-slate-500">Quotient</span>
              <b>12</b>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
              <span className="block text-[10px] text-emerald-500">Reste</span>
              <b>5</b>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. CALCUL DANS D 5E (Priorités & Distributivité)
  if (interactiveType === 'calcul-dans-d-5e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3 max-w-md">
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Distributivité de la multiplication
          </span>
          <div className="text-lg sm:text-2xl font-mono font-bold text-white">
            <MathView latex="k \\times (a + b) = k \\times a + k \\times b" display={true} />
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="text-emerald-400 font-bold">Exemple de calcul mental réfléchi :</div>
            <div className="text-white">
              7 × 102 = 7 × (100 + 2) = 700 + 14 = <b className="text-amber-300">714</b>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 10. LES NOMBRES DÉCIMAUX RELATIFS 5E (Axe gradué & additions)
  if (interactiveType === 'nombres-decimaux-relatifs-5e' || interactiveType === 'reperage-5e') {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Slider for point coordinate */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Position du point A : <b className="text-emerald-400">{relPointVal}</b></span>
          <input
            type="range"
            min="-6"
            max="6"
            value={relPointVal}
            onChange={(e) => setRelPointVal(Number(e.target.value))}
            className="w-28 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Graduated axis SVG */}
        <svg viewBox="0 0 400 120" className="w-full max-w-[380px] h-auto drop-shadow-md select-none">
          {/* Main axis line */}
          <line x1="30" y1="60" x2="370" y2="60" stroke="#64748b" strokeWidth="2.5" />
          <polygon points="365,56 375,60 365,64" fill="#64748b" />

          {/* Graduations from -6 to +6. Center 0 at x=200, step=25px */}
          {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((n) => {
            const gx = 200 + n * 25;
            const isZero = n === 0;
            return (
              <g key={n}>
                <line
                  x1={gx}
                  y1={isZero ? 48 : 54}
                  x2={gx}
                  y2={isZero ? 72 : 66}
                  stroke={isZero ? '#ef4444' : '#475569'}
                  strokeWidth={isZero ? 2.5 : 1.5}
                />
                <text
                  x={gx}
                  y="85"
                  fill={isZero ? '#f87171' : n < 0 ? '#93c5fd' : '#a7f3d0'}
                  fontSize={isZero ? '12' : '10'}
                  fontWeight={isZero ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {n > 0 ? `+${n}` : `${n}`}
                </text>
              </g>
            );
          })}

          {/* Point A */}
          <circle cx={200 + relPointVal * 25} cy="60" r="5" fill="#10b981" />
          <text x={200 + relPointVal * 25} y="40" fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="middle">
            A({relPointVal > 0 ? `+${relPointVal}` : relPointVal})
          </text>
        </svg>

        <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono">
          <span className="text-slate-400">Distance à zéro de A = </span>
          <span className="text-emerald-400 font-bold">{Math.abs(relPointVal)} unités</span>
          <span className="text-slate-400 ml-3">Opposé = </span>
          <span className="text-sky-300 font-bold">{-relPointVal > 0 ? `+${-relPointVal}` : -relPointVal}</span>
        </div>
      </div>
    );
  }

  // Fallback default formula card
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center max-w-lg w-full">
      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
        {currentStep.rule}
      </div>
      <div className="my-3 text-lg sm:text-2xl font-mono font-bold text-black dark:text-white">
        <MathView latex={currentStep.latex} display={true} />
      </div>
      <p className="text-xs sm:text-sm text-neutral-700 dark:text-slate-300 mt-2 leading-relaxed">
        {currentStep.explanation}
      </p>
    </div>
  );
};
