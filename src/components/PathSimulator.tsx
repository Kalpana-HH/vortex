import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Compass, Code, Copy, 
  Plus, Trash2, Settings, Sliders, Eye, Save, 
  Check, FileCode, Sparkles, Move, Info, ChevronRight
} from 'lucide-react';

interface Point2D {
  x: number; // inches, -72 to 72
  y: number; // inches, -72 to 72
}

interface PathSegment {
  id: string;
  name: string;
  type: 'CUBIC' | 'QUADRATIC' | 'LINEAR';
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
  headingRule: 'TANGENT' | 'CONSTANT' | 'LINEAR';
  startHeading: number; // degrees
  endHeading: number;   // degrees
  constantHeading: number; // degrees
}

const DEFAULT_SEGMENTS: PathSegment[] = [
  {
    id: 'seg-1',
    name: 'Deliver Left Preload',
    type: 'CUBIC',
    p0: { x: -60, y: -36 },
    p1: { x: -36, y: -12 },
    p2: { x: -24, y: 0 },
    p3: { x: -12, y: 24 },
    headingRule: 'LINEAR',
    startHeading: 0,
    endHeading: 90,
    constantHeading: 0
  },
  {
    id: 'seg-2',
    name: 'Sweep Spike Sample 1',
    type: 'QUADRATIC',
    p0: { x: -12, y: 24 },
    p1: { x: -36, y: 48 },
    p2: { x: -36, y: 48 },
    p3: { x: -56, y: 36 },
    headingRule: 'TANGENT',
    startHeading: 90,
    endHeading: 180,
    constantHeading: 0
  }
];

interface PresetGroup {
  name: string;
  desc: string;
  segments: PathSegment[];
}

const PRESET_PATH_GROUPS: PresetGroup[] = [
  {
    name: 'Vortex Red Alliance Specimen Auto',
    desc: 'Starts near wall, deposits preload specimen, sweeps 3 samples to subzone, parks in observation deck.',
    segments: [
      {
        id: 'spec-1',
        name: 'Move to Chamber',
        type: 'CUBIC',
        p0: { x: -12, y: -63 },
        p1: { x: -12, y: -48 },
        p2: { x: -12, y: -36 },
        p3: { x: -8, y: -30 },
        headingRule: 'CONSTANT',
        startHeading: 180,
        endHeading: 180,
        constantHeading: 180
      },
      {
        id: 'spec-2',
        name: 'Intake Ground Sample',
        type: 'CUBIC',
        p0: { x: -8, y: -30 },
        p1: { x: -24, y: -48 },
        p2: { x: -36, y: -36 },
        p3: { x: -48, y: -36 },
        headingRule: 'LINEAR',
        startHeading: 180,
        endHeading: 270,
        constantHeading: 180
      }
    ]
  },
  {
    name: 'Vortex Blue Alliance Sample Sweep',
    desc: 'Delivers preload to high basket scoring area, sweeps samples from spike marks into basket.',
    segments: [
      {
        id: 'sweep-1',
        name: 'Basket Score Preload',
        type: 'CUBIC',
        p0: { x: 36, y: 63 },
        p1: { x: 48, y: 48 },
        p2: { x: 50, y: 50 },
        p3: { x: 54, y: 54 },
        headingRule: 'CONSTANT',
        startHeading: 45,
        endHeading: 45,
        constantHeading: 45
      },
      {
        id: 'sweep-2',
        name: 'Drive back to Spike 1',
        type: 'LINEAR',
        p0: { x: 54, y: 54 },
        p1: { x: 36, y: 36 },
        p2: { x: 36, y: 36 },
        p3: { x: 36, y: 36 },
        headingRule: 'TANGENT',
        startHeading: 45,
        endHeading: 225,
        constantHeading: 45
      }
    ]
  }
];

export default function PathSimulator() {
  const [segments, setSegments] = useState<PathSegment[]>(DEFAULT_SEGMENTS);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('seg-1');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationTime, setAnimationTime] = useState<number>(0); // 0 to 1
  const [animSegmentIndex, setAnimSegmentIndex] = useState<number>(0);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 0.5, 1, 2
  
  // Hover & selection tracker for manual drags
  const [draggingPoint, setDraggingPoint] = useState<{ segmentIndex: number; pointName: 'p0' | 'p1' | 'p2' | 'p3' } | null>(null);
  
  // Text notification / feedback overlay
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [saveName, setSaveName] = useState<string>('My Custom Spline');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const canvasRef = useRef<SVGSVGElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const selectedSegmentIndex = segments.findIndex(s => s.id === selectedSegmentId);
  const activeSegment = segments[selectedSegmentIndex] || segments[0];

  // Load custom saved paths on mount
  useEffect(() => {
    const saved = localStorage.getItem('vortex_custom_paths');
    if (saved) {
      try {
        setSegments(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Sync to localstorage
  const saveToLocalStorage = (data: PathSegment[]) => {
    localStorage.setItem('vortex_custom_paths', JSON.stringify(data));
  };

  // Bezier coordinate computations
  const getPointOnBezier = (segment: PathSegment, t: number): Point2D => {
    const { p0, p1, p2, p3, type } = segment;
    if (type === 'LINEAR') {
      return {
        x: (1 - t) * p0.x + t * p3.x,
        y: (1 - t) * p0.y + t * p3.y
      };
    } else if (type === 'QUADRATIC') {
      return {
        x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p3.x,
        y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p3.y
      };
    } else {
      // CUBIC
      return {
        x: Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * t * t * p2.x + Math.pow(t, 3) * p3.x,
        y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * t * t * p2.y + Math.pow(t, 3) * p3.y
      };
    }
  };

  // Numerical derivative to compute path tangent angle format (in degrees)
  const getTangentAngle = (segment: PathSegment, t: number): number => {
    const eps = 0.001;
    const t0 = Math.max(0, t - eps);
    const t1 = Math.min(1, t + eps);
    const pt0 = getPointOnBezier(segment, t0);
    const pt1 = getPointOnBezier(segment, t1);
    
    const dx = pt1.x - pt0.x;
    const dy = pt1.y - pt0.y;
    
    if (Math.abs(dx) < 1e-5 && Math.abs(dy) < 1e-5) {
      return 0;
    }
    const angleRad = Math.atan2(dy, dx);
    let deg = angleRad * (180 / Math.PI);
    return deg < 0 ? deg + 360 : deg;
  };

  // Interpolate robot heading angle along the path segment
  const getHeadingAngle = (segment: PathSegment, t: number): number => {
    if (segment.headingRule === 'CONSTANT') {
      return segment.constantHeading;
    } else if (segment.headingRule === 'TANGENT') {
      return getTangentAngle(segment, t);
    } else {
      // LINEAR Interpolation
      const start = segment.startHeading;
      const end = segment.endHeading;
      return start + (end - start) * t;
    }
  };

  // Canvas pixel coordinates mapping
  // Grid coordinates go from -72 (bottom left) to 72 (top right)
  const mapToCanvas = (pt: Point2D) => {
    const size = 480;
    const borderOffset = 0; // standard container scaling
    const scale = size / 144; // 144 inches total field width
    return {
      cx: borderOffset + (pt.x + 72) * scale,
      cy: borderOffset + (72 - pt.y) * scale // invert Y axis
    };
  };

  // Revert back from canvas coordinates to game space coordinates
  const mapToCartesian = (cx: number, cy: number): Point2D => {
    const size = 480;
    const scale = size / 144;
    return {
      x: Math.round((cx / scale) - 72),
      y: Math.round(72 - (cy / scale))
    };
  };

  // Handle playing animation
  useEffect(() => {
    if (isPlaying) {
      let lastTime = performance.now();
      const tick = (now: number) => {
        const delta = (now - lastTime) / 1000; // seconds
        lastTime = now;
        
        // Speed up factor: path defaults to take 4.5 seconds per segment at 1x
        const duration = 3.5 / playSpeed;
        const speed = 1 / duration;
        
        setAnimationTime((prev) => {
          let next = prev + delta * speed;
          if (next >= 1.0) {
            // cycle to next segment
            setAnimSegmentIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= segments.length) {
                return 0;
              }
              return nextIndex;
            });
            return 0;
          }
          return next;
        });
        
        animationFrameId.current = requestAnimationFrame(tick);
      };
      
      animationFrameId.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, playSpeed, segments.length]);

  // Point dragging observers
  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingPoint) return;
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 480;
    const cy = ((e.clientY - rect.top) / rect.height) * 480;
    
    const cartesian = mapToCartesian(cx, cy);
    // Cap coordinates limit on the 12' field
    const clampedX = Math.max(-72, Math.min(72, cartesian.x));
    const clampedY = Math.max(-72, Math.min(72, cartesian.y));
    
    setSegments((prev) => {
      const copy = [...prev];
      const targetSeg = { ...copy[draggingPoint.segmentIndex] };
      const pointName = draggingPoint.pointName;
      
      targetSeg[pointName] = { x: clampedX, y: clampedY };
      
      // Keep segment continuity if linking endpoint of segment N to start point of N+1
      if (pointName === 'p3' && draggingPoint.segmentIndex < copy.length - 1) {
        copy[draggingPoint.segmentIndex + 1] = {
          ...copy[draggingPoint.segmentIndex + 1],
          p0: { x: clampedX, y: clampedY }
        };
      }
      if (pointName === 'p0' && draggingPoint.segmentIndex > 0) {
        copy[draggingPoint.segmentIndex - 1] = {
          ...copy[draggingPoint.segmentIndex - 1],
          p3: { x: clampedX, y: clampedY }
        };
      }
      
      copy[draggingPoint.segmentIndex] = targetSeg;
      saveToLocalStorage(copy);
      return copy;
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggingPoint(null);
  };

  // Segment modifiers
  const handleUpdateSegment = (updates: Partial<PathSegment>) => {
    const updated = segments.map((seg, idx) => {
      if (seg.id === selectedSegmentId) {
        const nextSeg = { ...seg, ...updates };
        // Clean linear/quadratic continuity updates
        if (updates.p3 && idx < segments.length - 1) {
          segments[idx + 1].p0 = updates.p3;
        }
        if (updates.p0 && idx > 0) {
          segments[idx - 1].p3 = updates.p0;
        }
        return nextSeg;
      }
      return seg;
    });
    setSegments(updated);
    saveToLocalStorage(updated);
  };

  const handleAddSegment = () => {
    const lastSeg = segments[segments.length - 1] || activeSegment;
    const startPoint = lastSeg ? lastSeg.p3 : { x: 0, y: 0 };
    const newSeg: PathSegment = {
      id: `seg-${Date.now()}`,
      name: `Spline Connection ${segments.length + 1}`,
      type: 'CUBIC',
      p0: { ...startPoint },
      p1: { x: Math.min(72, startPoint.x + 20), y: Math.min(72, startPoint.y + 20) },
      p2: { x: Math.min(72, startPoint.x + 30), y: Math.min(72, startPoint.y + 10) },
      p3: { x: Math.min(72, startPoint.x + 40), y: Math.min(72, startPoint.y + 30) },
      headingRule: 'TANGENT',
      startHeading: lastSeg ? lastSeg.endHeading : 0,
      endHeading: lastSeg ? lastSeg.endHeading : 0,
      constantHeading: lastSeg ? lastSeg.constantHeading : 0
    };
    const nextArr = [...segments, newSeg];
    setSegments(nextArr);
    setSelectedSegmentId(newSeg.id);
    saveToLocalStorage(nextArr);
  };

  const handleDeleteSegment = (idToDelete: string) => {
    if (segments.length <= 1) return;
    const filter = segments.filter(s => s.id !== idToDelete);
    
    // Connect continuity elements
    const updated = filter.map((seg, idx) => {
      if (idx > 0 && idx < filter.length) {
        seg.p0 = filter[idx - 1].p3;
      }
      return seg;
    });
    
    setSegments(updated);
    setSelectedSegmentId(updated[0].id);
    saveToLocalStorage(updated);
  };

  const handleLoadPreset = (index: number) => {
    const preset = PRESET_PATH_GROUPS[index];
    setSegments(preset.segments);
    setSelectedSegmentId(preset.segments[0].id);
    setActivePresetIndex(index);
    setAnimationTime(0);
    setAnimSegmentIndex(0);
    saveToLocalStorage(preset.segments);
  };

  // Render variables
  const plottedRobotPos = getPointOnBezier(segments[animSegmentIndex] || activeSegment, animationTime);
  const plottedRobotHeading = getHeadingAngle(segments[animSegmentIndex] || activeSegment, animationTime);

  // Generate ready-to-copy Pedro Pathing Java Code
  const generateJavaCode = (): string => {
    let code = `/*\n * Team Vortex #51E6 Autonomous Path Profile\n * Generated using Vortex Pedro Pathing Simulator\n */\n\n`;
    code += `// Initialize inside your Autonomous OpMode Follower variable\n`;
    code += `Follower follower = new Follower(hardwareMap);\n\n`;
    code += `// Path Segments Generation\n`;
    
    segments.forEach((seg, index) => {
      const p0Str = `new Point(${seg.p0.x.toFixed(1)}, ${seg.p0.y.toFixed(1)}, Point.CARTESIAN)`;
      const p1Str = `new Point(${seg.p1.x.toFixed(1)}, ${seg.p1.y.toFixed(1)}, Point.CARTESIAN)`;
      const p2Str = `new Point(${seg.p2.x.toFixed(1)}, ${seg.p2.y.toFixed(1)}, Point.CARTESIAN)`;
      const p3Str = `new Point(${seg.p3.x.toFixed(1)}, ${seg.p3.y.toFixed(1)}, Point.CARTESIAN)`;
      
      code += `// Segment ${index + 1}: ${seg.name}\n`;
      if (seg.type === 'LINEAR') {
        code += `Path segment${index + 1} = new Path(new BezierLine(${p0Str}, ${p3Str}));\n`;
      } else if (seg.type === 'QUADRATIC') {
        code += `Path segment${index + 1} = new Path(new BezierCurve(${p0Str}, ${p1Str}, ${p3Str}));\n`;
      } else {
        code += `Path segment${index + 1} = new Path(new BezierCurve(${p0Str}, ${p1Str}, ${p2Str}, ${p3Str}));\n`;
      }
      
      if (seg.headingRule === 'CONSTANT') {
        code += `segment${index + 1}.setConstantHeadingInterpolation(Math.toRadians(${seg.constantHeading}));\n\n`;
      } else if (seg.headingRule === 'TANGENT') {
        code += `segment${index + 1}.setTangentHeadingInterpolation();\n\n`;
      } else {
        code += `segment${index + 1}.setLinearHeadingInterpolation(Math.toRadians(${seg.startHeading}), Math.toRadians(${seg.endHeading}));\n\n`;
      }
    });

    code += `// Build sequential path chain follower execution list\n`;
    code += `PathChain autoChain = follower.pathBuilder()\n`;
    segments.forEach((seg, index) => {
      const p0Str = `new Point(${seg.p0.x.toFixed(1)}, ${seg.p0.y.toFixed(1)}, Point.CARTESIAN)`;
      const p1Str = `new Point(${seg.p1.x.toFixed(1)}, ${seg.p1.y.toFixed(1)}, Point.CARTESIAN)`;
      const p2Str = `new Point(${seg.p2.x.toFixed(1)}, ${seg.p2.y.toFixed(1)}, Point.CARTESIAN)`;
      const p3Str = `new Point(${seg.p3.x.toFixed(1)}, ${seg.p3.y.toFixed(1)}, Point.CARTESIAN)`;
      
      let construct = '';
      if (seg.type === 'LINEAR') construct = `new BezierLine(${p0Str}, ${p3Str})`;
      else if (seg.type === 'QUADRATIC') construct = `new BezierCurve(${p0Str}, ${p1Str}, ${p3Str})`;
      else construct = `new BezierCurve(${p0Str}, ${p1Str}, ${p2Str}, ${p3Str})`;

      let headStr = '';
      if (seg.headingRule === 'CONSTANT') headStr = `addParametricHeading(Math.toRadians(${seg.constantHeading}))`;
      else if (seg.headingRule === 'TANGENT') headStr = `addParametricHeading(Double.NaN)`; // Uses heading of movement direction
      else headStr = `addParametricHeading(Math.toRadians(${seg.startHeading}), Math.toRadians(${seg.endHeading}))`;

      code += `    .addPath(${construct})\n    .${headStr}\n`;
    });
    code += `    .build();\n\n`;
    code += `// To execute inside autonomous start:\n`;
    code += `follower.followPath(autoChain);`;
    return code;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateJavaCode());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleResetSaved = () => {
    setSegments(DEFAULT_SEGMENTS);
    setSelectedSegmentId('seg-1');
    setActivePresetIndex(null);
    setAnimationTime(0);
    setAnimSegmentIndex(0);
    localStorage.removeItem('vortex_custom_paths');
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn text-left w-full max-w-6xl mx-auto" id="path-simulator-root">
      
      {/* Upper Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Specification Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-extrabold flex items-center gap-1">
              <Compass className="h-3 w-3 text-[var(--accent)]" /> Active Coordinate Matrix
            </span>
            <h4 className="text-sm font-black uppercase text-[var(--text-primary)] mt-1">Real-time Kinematics</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2 px-1">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">X Position</div>
              <div className="font-mono text-base font-extrabold text-[var(--accent)] mt-0.5">{plottedRobotPos.x.toFixed(1)}"</div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2 px-1">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Y Position</div>
              <div className="font-mono text-base font-extrabold text-[var(--accent)] mt-0.5">{plottedRobotPos.y.toFixed(1)}"</div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2 px-1">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Heading</div>
              <div className="font-mono text-sm font-extrabold text-[var(--text-primary)] mt-0.5">{plottedRobotHeading.toFixed(0)}°</div>
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] mt-3 leading-relaxed border-t border-[var(--border)] pt-2 flex items-center gap-1">
            <Info className="h-3 w-3 shrink-0" /> Field relative coordinate space starts from (-72", -72") to (72", 72").
          </p>
        </div>

        {/* Center Path Presets */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm md:col-span-2">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-extrabold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" /> Pedro Spline Presets
            </span>
            <h4 className="text-sm font-black uppercase text-[var(--text-primary)] mt-1">Select Path Pipeline</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {PRESET_PATH_GROUPS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleLoadPreset(index)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer ${
                    activePresetIndex === index 
                      ? 'border-[var(--accent)] bg-[var(--accent)]/[0.04]' 
                      : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/40'
                  }`}
                >
                  <span className={`font-black uppercase tracking-wider ${activePresetIndex === index ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {preset.name}
                  </span>
                  <span className="text-[10.5px] text-[var(--text-secondary)] leading-relaxed line-clamp-1">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 mt-4 items-center justify-between border-t border-[var(--border)] pt-2.5">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono">
              Segment Count: <strong className="text-[var(--text-primary)] font-bold">{segments.length}</strong>
            </span>
            <button 
              onClick={handleResetSaved}
              className="text-[10px] font-mono font-bold tracking-wider text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset default path
            </button>
          </div>
        </div>

      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Canvas Rendering Field (8 / 12) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col items-center">
            
            <div className="relative w-full max-w-[480px] aspect-square bg-[#0f1115] rounded-xl overflow-hidden border border-[var(--border)] shadow-inner">
              
              {/* Grid Canvas */}
              <svg
                ref={canvasRef}
                viewBox="0 0 480 480"
                className="w-full h-full select-none"
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              >
                {/* Draw 6x6 tiles representing standard FTC 24" interlocking mats */}
                {Array.from({ length: 6 }).map((_, r) => (
                  <g key={r}>
                    {Array.from({ length: 6 }).map((_, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={c * 80}
                        y={r * 80}
                        width={80}
                        height={80}
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="0.8"
                        strokeDasharray={r === 3 || c === 3 ? "0" : "2 2"}
                      />
                    ))}
                  </g>
                ))}

                {/* Subdued Game Layout Zones for Red/Blue representation */}
                {/* Red Observation Zone */}
                <rect x="0" y="400" width="80" height="80" fill="rgba(239, 68, 68, 0.05)" />
                <line x1="0" y1="400" x2="80" y2="400" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" />
                <line x1="80" y1="400" x2="80" y2="480" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" />
                <text x="15" y="445" fill="rgba(239, 68, 68, 0.4)" fontSize="7" fontFamily="monospace" fontWeight="bold">RED OBS</text>

                {/* Blue Observation Zone */}
                <rect x="400" y="0" width="80" height="80" fill="rgba(59, 130, 246, 0.05)" />
                <line x1="400" y1="80" x2="480" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
                <line x1="400" y1="0" x2="400" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
                <text x="415" y="45" fill="rgba(59, 130, 246, 0.4)" fontSize="7" fontFamily="monospace" fontWeight="bold">BLUE OBS</text>

                {/* Center origin visual marker */}
                <circle cx="240" cy="240" r="3" fill="#3f3f46" />

                {/* Draw Bezier Splines connector curves */}
                {segments.map((seg, sIdx) => {
                  const pointsCount = 60;
                  const linePts: string[] = [];
                  for (let i = 0; i <= pointsCount; i++) {
                    const t = i / pointsCount;
                    const bPt = getPointOnBezier(seg, t);
                    const drawPt = mapToCanvas(bPt);
                    linePts.push(`${drawPt.cx},${drawPt.cy}`);
                  }
                  
                  const isCurSegment = seg.id === selectedSegmentId;
                  return (
                    <g key={seg.id}>
                      {/* Interactive Bezier Spline Path Line */}
                      <polyline
                        points={linePts.join(' ')}
                        fill="none"
                        stroke={isCurSegment ? 'var(--accent)' : '#4b5563'}
                        strokeWidth={isCurSegment ? '3.5' : '2'}
                        strokeDasharray={isCurSegment ? 'none' : '4 4'}
                        opacity={isCurSegment ? '1' : '0.5'}
                        className="transition-all duration-200"
                      />
                      
                      {/* Tangent guide markers at points */}
                      {isCurSegment && seg.type === 'CUBIC' && (
                        <>
                          {/* Anchor links help builders parse handles relations */}
                          <line
                            x1={mapToCanvas(seg.p0).cx}
                            y1={mapToCanvas(seg.p0).cy}
                            x2={mapToCanvas(seg.p1).cx}
                            y2={mapToCanvas(seg.p1).cy}
                            stroke="rgba(0, 240, 255, 0.25)"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          <line
                            x1={mapToCanvas(seg.p3).cx}
                            y1={mapToCanvas(seg.p3).cy}
                            x2={mapToCanvas(seg.p2).cx}
                            y2={mapToCanvas(seg.p2).cy}
                            stroke="rgba(0, 240, 255, 0.25)"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Interactive Drag handles on selected segment (visible to editor) */}
                {(() => {
                  const seg = activeSegment;
                  const idx = selectedSegmentIndex;
                  if (idx === -1) return null;
                  
                  const c0 = mapToCanvas(seg.p0);
                  const c1 = mapToCanvas(seg.p1);
                  const c2 = mapToCanvas(seg.p2);
                  const c3 = mapToCanvas(seg.p3);

                  return (
                    <g>
                      {/* P0 Start Handle */}
                      <circle
                        cx={c0.cx}
                        cy={c0.cy}
                        r="7"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onMouseDown={() => setDraggingPoint({ segmentIndex: idx, pointName: 'p0' })}
                        title="Start Point (P0)"
                      />
                      <text x={c0.cx - 4} y={c0.cy - 10} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="black" className="pointer-events-none select-none">P0</text>

                      {/* P1 Control Handle (only if Quadratic or Cubic) */}
                      {seg.type !== 'LINEAR' && (
                        <>
                          <circle
                            cx={c1.cx}
                            cy={c1.cy}
                            r="6"
                            fill="var(--accent)"
                            stroke="#ffffff"
                            strokeWidth="1"
                            className="cursor-pointer hover:scale-125 transition-transform"
                            onMouseDown={() => setDraggingPoint({ segmentIndex: idx, pointName: 'p1' })}
                            title="Control Point 1 (P1)"
                          />
                          <text x={c1.cx - 4} y={c1.cy - 9} fill="var(--accent)" fontSize="8" fontFamily="monospace" fontWeight="black" className="pointer-events-none select-none">P1</text>
                        </>
                      )}

                      {/* P2 Control Handle (only if Cubic) */}
                      {seg.type === 'CUBIC' && (
                        <>
                          <circle
                            cx={c2.cx}
                            cy={c2.cy}
                            r="6"
                            fill="var(--accent)"
                            stroke="#ffffff"
                            strokeWidth="1"
                            className="cursor-pointer hover:scale-125 transition-transform"
                            onMouseDown={() => setDraggingPoint({ segmentIndex: idx, pointName: 'p2' })}
                            title="Control Point 2 (P2)"
                          />
                          <text x={c2.cx - 4} y={c2.cy - 9} fill="var(--accent)" fontSize="8" fontFamily="monospace" fontWeight="black" className="pointer-events-none select-none">P2</text>
                        </>
                      )}

                      {/* P3 End Handle */}
                      <circle
                        cx={c3.cx}
                        cy={c3.cy}
                        r="7"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onMouseDown={() => setDraggingPoint({ segmentIndex: idx, pointName: 'p3' })}
                        title="End Point (P3)"
                      />
                      <text x={c3.cx - 4} y={c3.cy - 10} fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="black" className="pointer-events-none select-none">P3</text>
                    </g>
                  );
                })()}

                {/* Animated Robot Simulator Layer */}
                {(() => {
                  const robPt = mapToCanvas(plottedRobotPos);
                  
                  // Robot model parameters: 18" scale in pixels is ~60 pixels
                  // Render a stylish dark gray / cyan glowing robot chassis with wheels
                  return (
                    <g transform={`translate(${robPt.cx}, ${robPt.cy}) rotate(${90 - plottedRobotHeading})`}>
                      {/* Robot Main Chassis Box */}
                      <rect
                        x="-25"
                        y="-25"
                        width="50"
                        height="50"
                        rx="6"
                        fill="#1e1e24"
                        stroke="var(--accent)"
                        strokeWidth="2.5"
                        className="shadow-[0_0_15px_rgba(0,240,255,0.3)] opacity-90"
                      />
                      
                      {/* Drivetrain Mecanum Wheels */}
                      {/* Front-Left wheel */}
                      <rect x="-29" y="-23" width="7" height="15" rx="2" fill="#52525b" />
                      {/* Front-Right wheel */}
                      <rect x="22" y="-23" width="7" height="15" rx="2" fill="#52525b" />
                      {/* Rear-Left wheel */}
                      <rect x="-29" y="8" width="7" height="15" rx="2" fill="#52525b" />
                      {/* Rear-Right wheel */}
                      <rect x="22" y="8" width="7" height="15" rx="2" fill="#52525b" />

                      {/* Sub-assemblies: Intake claw scoop indicator */}
                      <path d="M-12,-26 L12,-26 L14,-32 L-14,-32 Z" fill="#3f3f46" stroke="var(--accent)" strokeWidth="1" />

                      {/* Heading direction line pointer */}
                      <line x1="0" y1="0" x2="0" y2="-22" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="0,-25 -4,-18 4,-18" fill="var(--accent)" />
                      
                      {/* Tech logo inside chassis */}
                      <circle cx="0" cy="4" r="5" fill="none" stroke="var(--accent)" strokeWidth="1" />
                      <text x="-3" y="7" fill="var(--accent)" fontSize="8" fontFamily="monospace" fontWeight="bold">V</text>
                    </g>
                  );
                })()}

              </svg>
            </div>

            {/* Playback Play/Pause controllers */}
            <div className="flex items-center justify-between w-full mt-4 bg-[var(--bg-primary)] p-3.5 border border-[var(--border)] rounded-xl gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlaying 
                      ? 'bg-amber-500 text-black hover:brightness-105' 
                      : 'bg-[var(--accent)] text-black hover:brightness-105'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause simulation</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>RUN AUTONOMOUS</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setAnimationTime(0);
                    setAnimSegmentIndex(0);
                    setIsPlaying(false);
                  }}
                  className="h-9 w-9 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent)]/5 flex items-center justify-center transition cursor-pointer"
                  title="Reset simulation step"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed Factor triggers */}
              <div className="flex items-center gap-1 bg-[#18181b] p-1 border border-stone-800 rounded-lg">
                <span className="text-[9.5px] font-mono text-[var(--text-secondary)] px-2 font-bold select-none uppercase">Speed:</span>
                {[0.5, 1, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setPlaySpeed(sp)}
                    className={`text-[10px] font-mono px-2 py-1 rounded font-black cursor-pointer uppercase ${
                      playSpeed === sp 
                        ? 'bg-[var(--accent)] text-black' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Coordinates / Spline Controls (5 / 12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Segment selection container */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-extrabold block">Autonomous Chain</span>
            <h4 className="text-sm font-black uppercase text-[var(--text-primary)] -mt-1">Active Splines</h4>
            
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              {segments.map((seg, idx) => (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                    selectedSegmentId === seg.id 
                      ? 'border-[var(--accent)] bg-[var(--accent)]/[0.04]' 
                      : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-zinc-800 text-[10px] font-black flex items-center justify-center text-[var(--accent)]">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-[var(--text-primary)] block">{seg.name}</span>
                      <span className="text-[9px] font-mono text-[var(--text-secondary)] mt-0.5">{seg.type} · {seg.headingRule}</span>
                    </div>
                  </div>
                  {segments.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSegment(seg.id);
                      }}
                      className="text-stone-500 hover:text-rose-500 p-1.5 rounded-lg border border-transparent hover:border-stone-800 hover:bg-stone-900 cursor-pointer"
                      title="Remove segment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddSegment}
              className="mt-2 w-full h-9 rounded-xl border border-dashed border-[var(--border)] text-xs font-black uppercase text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Next Spline Connection
            </button>
          </div>

          {/* Points Editor block */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-extrabold block">Point Configurations</span>
            
            {/* Segment Spline Curve Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase">Spline Solver Degree</label>
              <div className="grid grid-cols-3 gap-1 bg-[#1e1e24] border border-[var(--border)] p-1 rounded-xl">
                {['LINEAR', 'QUADRATIC', 'CUBIC'].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => handleUpdateSegment({ type: deg as any })}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                      activeSegment.type === deg 
                        ? 'bg-[var(--accent)] text-black' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {deg}
                  </button>
                ))}
              </div>
            </div>

            {/* Heading solver rules */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase">Robot Heading Rule</label>
              <div className="grid grid-cols-3 gap-1 bg-[#1e1e24] border border-[var(--border)] p-1 rounded-xl">
                {['TANGENT', 'CONSTANT', 'LINEAR'].map((rule) => (
                  <button
                    key={rule}
                    onClick={() => handleUpdateSegment({ headingRule: rule as any })}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                      activeSegment.headingRule === rule 
                        ? 'bg-[var(--accent)] text-black' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {rule}
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinates Inputs */}
            <div className="grid grid-cols-2 gap-3.5 mt-2 border-t border-[var(--border)] pt-4">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-semibold text-emerald-500 uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Start (P0)
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block">X"</span>
                    <input
                      type="number"
                      value={activeSegment.p0.x}
                      onChange={(e) => {
                        const x = parseFloat(e.target.value) || 0;
                        handleUpdateSegment({ p0: { ...activeSegment.p0, x } });
                      }}
                      className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block">Y"</span>
                    <input
                      type="number"
                      value={activeSegment.p0.y}
                      onChange={(e) => {
                        const y = parseFloat(e.target.value) || 0;
                        handleUpdateSegment({ p0: { ...activeSegment.p0, y } });
                      }}
                      className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-semibold text-rose-500 uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> End (P3)
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block">X"</span>
                    <input
                      type="number"
                      value={activeSegment.p3.x}
                      onChange={(e) => {
                        const x = parseFloat(e.target.value) || 0;
                        handleUpdateSegment({ p3: { ...activeSegment.p3, x } });
                      }}
                      className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block">Y"</span>
                    <input
                      type="number"
                      value={activeSegment.p3.y}
                      onChange={(e) => {
                        const y = parseFloat(e.target.value) || 0;
                        handleUpdateSegment({ p3: { ...activeSegment.p3, y } });
                      }}
                      className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              {activeSegment.type !== 'LINEAR' && (
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-semibold text-[var(--accent)] uppercase flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Control 1 (P1)
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1">
                      <span className="text-[8px] font-mono text-[var(--text-secondary)] block">X"</span>
                      <input
                        type="number"
                        value={activeSegment.p1.x}
                        onChange={(e) => {
                          const x = parseFloat(e.target.value) || 0;
                          handleUpdateSegment({ p1: { ...activeSegment.p1, x } });
                        }}
                        className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-mono text-[var(--text-secondary)] block">Y"</span>
                      <input
                        type="number"
                        value={activeSegment.p1.y}
                        onChange={(e) => {
                          const y = parseFloat(e.target.value) || 0;
                          handleUpdateSegment({ p1: { ...activeSegment.p1, y } });
                        }}
                        className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSegment.type === 'CUBIC' && (
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-semibold text-[var(--accent)] uppercase flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Control 2 (P2)
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1">
                      <span className="text-[8px] font-mono text-[var(--text-secondary)] block">X"</span>
                      <input
                        type="number"
                        value={activeSegment.p2.x}
                        onChange={(e) => {
                          const x = parseFloat(e.target.value) || 0;
                          handleUpdateSegment({ p2: { ...activeSegment.p2, x } });
                        }}
                        className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-mono text-[var(--text-secondary)] block">Y"</span>
                      <input
                        type="number"
                        value={activeSegment.p2.y}
                        onChange={(e) => {
                          const y = parseFloat(e.target.value) || 0;
                          handleUpdateSegment({ p2: { ...activeSegment.p2, y } });
                        }}
                        className="w-full h-8 px-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Heading angles configuration form settings */}
            {activeSegment.headingRule === 'CONSTANT' && (
              <div className="flex flex-col gap-1 bg-[var(--bg-primary)] border border-[var(--border)] p-3 rounded-xl">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Constant Angle</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeSegment.constantHeading}
                    onChange={(e) => handleUpdateSegment({ constantHeading: parseInt(e.target.value) || 0 })}
                    className="flex-1 accent-[var(--accent)]"
                  />
                  <span className="font-mono text-xs font-bold text-[var(--accent)] min-w-[32px]">{activeSegment.constantHeading}°</span>
                </div>
              </div>
            )}

            {activeSegment.headingRule === 'LINEAR' && (
              <div className="grid grid-cols-2 gap-3.5 bg-[var(--bg-primary)] border border-[var(--border)] p-3 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold text-[var(--text-secondary)] uppercase">Start Rotation</span>
                  <input
                    type="number"
                    value={activeSegment.startHeading}
                    onChange={(e) => handleUpdateSegment({ startHeading: parseInt(e.target.value) || 0 })}
                    className="w-full h-8 px-2 rounded bg-[var(--card-bg)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold text-[var(--text-secondary)] uppercase">End Rotation</span>
                  <input
                    type="number"
                    value={activeSegment.endHeading}
                    onChange={(e) => handleUpdateSegment({ endHeading: parseInt(e.target.value) || 0 })}
                    className="w-full h-8 px-2 rounded bg-[var(--card-bg)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Embedded ready-to-copy Pedro Pathing Java Code generator block */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase font-extrabold flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" /> Compiler System
            </span>
            <h4 className="text-sm font-black uppercase text-[var(--text-primary)] mt-1">Generated Pedro Pathing Java Code</h4>
          </div>
          <button
            onClick={handleCopyCode}
            className="h-9 px-4 rounded-lg bg-[var(--accent)] text-black font-mono text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 self-start cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>COPIED PERFECTLY!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>COPY JAVA CLASS</span>
              </>
            )}
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950/90 text-[11px] font-mono text-stone-200">
          <div className="absolute top-3 right-3 bg-stone-800/40 text-[9px] font-bold px-2 py-0.5 rounded text-stone-400 select-none uppercase tracking-widest border border-stone-800">
            Follower.java
          </div>
          <pre className="p-5 overflow-x-auto text-left leading-relaxed max-h-[280px]">
            <code>{generateJavaCode()}</code>
          </pre>
        </div>
      </div>

    </div>
  );
}
