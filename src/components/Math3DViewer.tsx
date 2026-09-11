import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VisualState } from '../types';
import { RotateCcw, Play, Pause, Grid, Layers, Sparkles, MoveRight, Eye } from 'lucide-react';

interface Math3DViewerProps {
  visualState: VisualState;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  stepExplanation: string;
  concreteExample?: {
    xVal: number;
    aVal: number;
    description: string;
  };
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

export const Math3DViewer: React.FC<Math3DViewerProps> = ({
  visualState,
  stepNumber,
  totalSteps,
  stepTitle,
  stepExplanation,
  concreteExample = { xVal: 5, aVal: 3, description: "Exemple concret : x = 5, coin de 3×3" },
  onNextStep,
  onPrevStep,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const cutPlaneRef = useRef<THREE.Mesh | null>(null);

  // References to animated sub-meshes
  const meshR1Ref = useRef<THREE.Mesh | null>(null);
  const meshR2Ref = useRef<THREE.Mesh | null>(null);
  const meshCutoutRef = useRef<THREE.Mesh | null>(null);
  const dimensionLabelsRef = useRef<THREE.Group | null>(null);

  // Step Animation progress (0.0 to 1.0)
  const [animProgress, setAnimProgress] = useState<number>(1.0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showUnitGrid, setShowUnitGrid] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'front'>('iso');

  const animProgressRef = useRef<number>(1.0);
  animProgressRef.current = animProgress;

  // Auto-play current step animation whenever stepNumber changes
  useEffect(() => {
    setAnimProgress(0.0);
    setIsAnimating(true);
  }, [stepNumber]);

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep modern slate
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(8, 9, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 30;
    controls.minDistance = 3;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lighting (natural, crisp classroom lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.5);
    fillLight.position.set(-10, -6, -8);
    scene.add(fillLight);

    // Warm table floor
    const floorGeom = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle grid helper on floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x4f46e5, 0x334155);
    gridHelper.position.y = -1.98;
    scene.add(gridHelper);

    // Container for dynamic algebra blocks
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Dimension labels container
    const dimGroup = new THREE.Group();
    scene.add(dimGroup);
    dimensionLabelsRef.current = dimGroup;

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Render loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update animation progress if playing
      if (isAnimating) {
        setAnimProgress((prev) => {
          const next = prev + delta * 0.45; // ~2.2s per step animation
          if (next >= 1.0) {
            setIsAnimating(false);
            return 1.0;
          }
          return next;
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Texture generator for physical unit grid lines (makes blocks look like countable wooden / Lego cubes!)
  const createBlockMaterial = useCallback(
    (hexColor: number, isHighlighted = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Base fill
      const r = (hexColor >> 16) & 255;
      const g = (hexColor >> 8) & 255;
      const b = hexColor & 255;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, 128, 128);

      // Draw subtle grid lines if unit grid is enabled
      if (showUnitGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 3;
        ctx.strokeRect(1, 1, 126, 126);

        // Internal cross for texture
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, 0);
        ctx.lineTo(64, 128);
        ctx.moveTo(0, 64);
        ctx.lineTo(128, 64);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
        emissive: isHighlighted ? hexColor : 0x000000,
        emissiveIntensity: isHighlighted ? 0.35 : 0.05,
      });
    },
    [showUnitGrid]
  );

  // Build the 3D block geometries
  const buildBlocks = useCallback(() => {
    if (!dynamicGroupRef.current) return;
    const group = dynamicGroupRef.current;

    // Clean previous children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      if ((obj as THREE.Mesh).material) {
        if (Array.isArray((obj as THREE.Mesh).material)) {
          ((obj as THREE.Mesh).material as THREE.Material[]).forEach((m) => m.dispose());
        } else {
          ((obj as THREE.Mesh).material as THREE.Material).dispose();
        }
      }
    }

    const { type, dimensions } = visualState;
    const x = dimensions.x || 5;
    const a = dimensions.a || 2;
    const b = dimensions.b || 1.5;
    const depth = dimensions.depth || 0.9;

    // Helper to add distinct white outline bevel
    const addWireEdges = (mesh: THREE.Mesh, edgeColor = 0xffffff, opacity = 0.55) => {
      const edgesGeom = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(
        edgesGeom,
        new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity, linewidth: 2 })
      );
      mesh.add(line);
    };

    if (type === 'difference_of_squares_3d') {
      // 1. Piece R1: Width (x - a), Height x, Depth
      const geomR1 = new THREE.BoxGeometry(x - a, x, depth);
      const matR1 = createBlockMaterial(0x0284c7); // Vivid Ocean Blue
      const meshR1 = new THREE.Mesh(geomR1, matR1);
      meshR1.position.set(-a / 2, 0, 0);
      meshR1.castShadow = true;
      meshR1.receiveShadow = true;
      addWireEdges(meshR1, 0x38bdf8);
      group.add(meshR1);
      meshR1Ref.current = meshR1;

      // 2. Piece R2: Width a, Height (x - a), Depth
      const geomR2 = new THREE.BoxGeometry(a, x - a, depth);
      const matR2 = createBlockMaterial(0x7c3aed); // Vivid Violet/Purple
      const meshR2 = new THREE.Mesh(geomR2, matR2);
      meshR2.castShadow = true;
      meshR2.receiveShadow = true;
      addWireEdges(meshR2, 0xc084fc);
      group.add(meshR2);
      meshR2Ref.current = meshR2;

      // 3. Cutout piece: Width a, Height a, Depth (represents the subtracted a² piece)
      const geomCutout = new THREE.BoxGeometry(a, a, depth);
      const matCutout = createBlockMaterial(0xe11d48, true); // Vivid Coral/Rose Red
      const meshCutout = new THREE.Mesh(geomCutout, matCutout);
      meshCutout.castShadow = true;
      meshCutout.receiveShadow = true;
      addWireEdges(meshCutout, 0xf43f5e, 0.8);
      group.add(meshCutout);
      meshCutoutRef.current = meshCutout;

      // 4. Cutting guide plane (visible on step 2 & 3)
      const cutGeom = new THREE.PlaneGeometry(x + 0.6, depth + 0.4);
      const cutMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15, // Bright yellow laser cut line
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const cutPlane = new THREE.Mesh(cutGeom, cutMat);
      cutPlane.rotation.x = Math.PI / 2;
      cutPlane.position.set(0, (x - a) / 2 - x / 2, 0);
      cutPlane.visible = stepNumber === 2 || stepNumber === 3;
      group.add(cutPlane);
      cutPlaneRef.current = cutPlane;

    } else if (type === 'perfect_square_3d') {
      // 4 pieces assembling into a perfect square (x + a)²
      const matX2 = createBlockMaterial(0x0284c7);
      const matXa1 = createBlockMaterial(0x6366f1);
      const matXa2 = createBlockMaterial(0x6366f1);
      const matA2 = createBlockMaterial(0xf59e0b);

      const mX2 = new THREE.Mesh(new THREE.BoxGeometry(x, x, depth), matX2);
      const mXa1 = new THREE.Mesh(new THREE.BoxGeometry(x, a, depth), matXa1);
      const mXa2 = new THREE.Mesh(new THREE.BoxGeometry(a, x, depth), matXa2);
      const mA2 = new THREE.Mesh(new THREE.BoxGeometry(a, a, depth), matA2);

      [mX2, mXa1, mXa2, mA2].forEach((m) => {
        m.castShadow = true;
        m.receiveShadow = true;
        addWireEdges(m);
        group.add(m);
      });

      meshR1Ref.current = mX2;
      meshR2Ref.current = mXa1;
      meshCutoutRef.current = mA2;

    } else if (type === 'common_factor_3d') {
      // Common factor: ax + ab = a(x + b)
      const h = a;
      const m1 = new THREE.Mesh(new THREE.BoxGeometry(x, h, depth), createBlockMaterial(0x0284c7));
      const m2 = new THREE.Mesh(new THREE.BoxGeometry(b, h, depth), createBlockMaterial(0x10b981));
      [m1, m2].forEach((m) => {
        m.castShadow = true;
        m.receiveShadow = true;
        addWireEdges(m);
        group.add(m);
      });
      meshR1Ref.current = m1;
      meshR2Ref.current = m2;

    } else {
      // Generic blocks
      const count = Math.min(6, Math.max(2, Math.round(x)));
      for (let i = 0; i < count; i++) {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 1.4, depth),
          createBlockMaterial(0x6366f1)
        );
        m.position.set((i - count / 2 + 0.5) * 1.6, 0, 0);
        m.castShadow = true;
        m.receiveShadow = true;
        addWireEdges(m);
        group.add(m);
      }
    }
  }, [visualState, stepNumber, createBlockMaterial]);

  // Rebuild blocks when visualState or unitGrid changes
  useEffect(() => {
    buildBlocks();
  }, [buildBlocks]);

  // Dynamic frame-by-frame procedural animation based on animProgress
  useEffect(() => {
    const { type, dimensions } = visualState;
    const x = dimensions.x || 5;
    const a = dimensions.a || 2;
    const b = dimensions.b || 1.5;
    const p = animProgress;

    if (type === 'difference_of_squares_3d') {
      const meshR1 = meshR1Ref.current;
      const meshR2 = meshR2Ref.current;
      const meshCutout = meshCutoutRef.current;
      const cutPlane = cutPlaneRef.current;

      if (!meshR1 || !meshR2 || !meshCutout) return;

      // Reset base R1
      meshR1.position.set(-a / 2, 0, 0);
      meshR1.rotation.set(0, 0, 0);

      // STEP 1: Carré initial plein x × x
      if (stepNumber === 1) {
        meshCutout.visible = true;
        meshCutout.position.set((x - a) / 2, (x - a) / 2, 0);
        meshCutout.rotation.set(0, 0, 0);
        (meshCutout.material as THREE.MeshStandardMaterial).opacity = 1.0;

        meshR2.position.set((x - a) / 2, -a / 2, 0);
        meshR2.rotation.set(0, 0, 0);

        if (cutPlane) cutPlane.visible = false;
      }

      // STEP 2: Le coin a² se soulève et s'envole hors du carré !
      else if (stepNumber === 2) {
        meshCutout.visible = true;
        if (cutPlane) cutPlane.visible = p < 0.7;

        // Smooth physical trajectory: lifts in Z and floats outward
        const liftZ = p * 3.5;
        const moveX = (x - a) / 2 + p * 2.2;
        const moveY = (x - a) / 2 + p * 2.2;

        meshCutout.position.set(moveX, moveY, liftZ);
        meshCutout.rotation.z = p * 0.4;
        meshCutout.rotation.x = p * 0.3;

        meshR2.position.set((x - a) / 2, -a / 2, 0);
        meshR2.rotation.set(0, 0, 0);
      }

      // STEP 3: Coup de scie : le "L" se sépare en deux morceaux (bleu et violet)
      else if (stepNumber === 3) {
        meshCutout.visible = false; // Corner is now completely gone
        if (cutPlane) cutPlane.visible = true;

        // Piece R2 separates slightly along X
        const sepX = (x - a) / 2 + p * 0.7;
        meshR2.position.set(sepX, -a / 2, 0);
        meshR2.rotation.set(0, 0, 0);
      }

      // STEP 4: LA TRANSFORMATION MAGIQUE EN 3D :
      // Le morceau violet se soulève, pivote de 90° et va s'emboîter au-dessus du morceau bleu !
      else if (stepNumber === 4) {
        meshCutout.visible = false;
        if (cutPlane) cutPlane.visible = false;

        // Starting point of R2 (at the bottom right)
        const startX = (x - a) / 2 + 0.7;
        const startY = -a / 2;

        // Destination point of R2 (flush on top of R1)
        // R1 has center (-a/2, 0) and height x. Its top edge is at Y = x/2.
        // Once rotated by -90 deg (-pi/2), R2 has height a, so its center should be Y = x/2 + a/2.
        const endX = -a / 2;
        const endY = x / 2 + a / 2;

        // Arc trajectory (lifts up in Z like a crane/hand moving it)
        const arcZ = Math.sin(p * Math.PI) * 2.2;
        const currentX = startX + (endX - startX) * p;
        const currentY = startY + (endY - startY) * p;
        const currentRotZ = -p * (Math.PI / 2);

        meshR2.position.set(currentX, currentY, arcZ);
        meshR2.rotation.z = currentRotZ;
      }

      // STEP 5: Le rectangle unifié final de dimensions (x - a) × (x + a)
      else if (stepNumber >= 5) {
        meshCutout.visible = false;
        if (cutPlane) cutPlane.visible = false;

        // Perfectly docked and flush
        meshR2.position.set(-a / 2, x / 2 + a / 2, 0);
        meshR2.rotation.z = -Math.PI / 2;
      }
    } else if (type === 'perfect_square_3d') {
      // Exploded assembly into perfect square
      const gap = (1 - p) * 1.5;
      const mX2 = meshR1Ref.current;
      const mXa1 = meshR2Ref.current;
      const mA2 = meshCutoutRef.current;

      if (mX2 && mXa1 && mA2) {
        mX2.position.set(-a / 2 - gap, -a / 2 - gap, 0);
        mXa1.position.set(-a / 2 - gap, x / 2 + gap, 0);
        mA2.position.set(x / 2 + gap, x / 2 + gap, 0);
      }
    } else if (type === 'common_factor_3d') {
      const m1 = meshR1Ref.current;
      const m2 = meshR2Ref.current;
      if (m1 && m2) {
        const gap = stepNumber === 1 ? 1.0 - p * 0.2 : (1 - p) * 0.8;
        m1.position.set(-b / 2 - gap / 2, 0, 0);
        m2.position.set(x / 2 + gap / 2, 0, 0);
      }
    }
  }, [animProgress, stepNumber, visualState]);

  // Camera preset views
  const applyView = (view: 'iso' | 'top' | 'front') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCameraView(view);

    if (view === 'iso') {
      cameraRef.current.position.set(8, 9, 11);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'top') {
      // 2D Bird's eye planar view
      cameraRef.current.position.set(0, 16, 0.01);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'front') {
      cameraRef.current.position.set(0, 0, 15);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  return (
    <div
      id="math3d-interactive-stage"
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] lg:min-h-[540px] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Bar: Visual Controls & Concrete Context */}
      <div className="relative z-10 p-4 flex items-center justify-between gap-3 pointer-events-none">
        {/* Left: Step indicator badge */}
        <div className="flex items-center space-x-2 pointer-events-auto bg-white/80 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono">
            Étape {stepNumber} / {totalSteps}
          </span>
          <span className="text-slate-500 dark:text-slate-400">•</span>
          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">{stepTitle}</span>
        </div>

        {/* Right: Camera Presets & Unit Grid Toggle */}
        <div className="flex items-center space-x-1.5 pointer-events-auto bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
          <button
            onClick={() => applyView('iso')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              cameraView === 'iso' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
            }`}
            title="Vue 3D Isométrique"
          >
            Vue 3D
          </button>
          <button
            onClick={() => applyView('top')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              cameraView === 'top' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
            }`}
            title="Vue 2D du dessus (Plan)"
          >
            Vue 2D (Dessus)
          </button>
          <button
            onClick={() => setShowUnitGrid(!showUnitGrid)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showUnitGrid ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white'
            }`}
            title="Afficher/Masquer le quadrillage des cubes unités (façon Lego/Montessori)"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyView('iso')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
            title="Réinitialiser la caméra"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating 3D Legend of Pieces (Terre à terre) */}
      <div className="relative z-10 px-4 py-2 pointer-events-none flex flex-wrap gap-2">
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 shadow-sm">
          <span className="w-3 h-3 rounded-sm bg-sky-500 shadow-sm shadow-sky-500/50" />
          <span className="font-medium">Pièce principale R₁ (Bleue)</span>
        </div>
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 shadow-sm">
          <span className="w-3 h-3 rounded-sm bg-purple-500 shadow-sm shadow-purple-500/50" />
          <span className="font-medium">Pièce mobile R₂ (Violette)</span>
        </div>
        {stepNumber <= 2 && (
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 shadow-sm">
            <span className="w-3 h-3 rounded-sm bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="font-medium">Coin retiré -a² (Rouge)</span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Animation Scrubbing Bar */}
      <div className="relative z-10 p-4 m-3 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-xl shadow-2xl flex flex-col space-y-2.5">
        {/* Step description banner */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-slate-900 dark:text-white">Mouvement 3D en cours :</span>
            <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">{stepExplanation}</span>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(animProgress * 100)}%
          </span>
        </div>

        {/* Play / Pause button & Interactive Progress Slider */}
        <div className="flex items-center space-x-3">
          <button
            id="play-step-animation-btn"
            onClick={() => {
              if (animProgress >= 0.99) {
                setAnimProgress(0);
              }
              setIsAnimating(!isAnimating);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 active:scale-95"
          >
            {isAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{animProgress >= 0.99 ? 'Rejouer le mouvement' : 'Animer'}</span>
              </>
            )}
          </button>

          {/* Interactive Scrub Slider */}
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">0%</span>
            <input
              id="animation-progress-scrubber"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={animProgress}
              onChange={(e) => {
                setIsAnimating(false);
                setAnimProgress(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              title="Glissez avec la souris ou le doigt pour animer manuellement la pièce en 3D !"
            />
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">100%</span>
          </div>

          {/* Quick Step Nav buttons right inside the stage */}
          {onPrevStep && onNextStep && (
            <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
              <button
                onClick={onPrevStep}
                disabled={stepNumber <= 1}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 text-xs rounded transition-colors"
                title="Étape précédente"
              >
                ◀
              </button>
              <button
                onClick={onNextStep}
                disabled={stepNumber >= totalSteps}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 text-xs rounded transition-colors"
                title="Étape suivante"
              >
                
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
