import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, RotateCcw, AlertTriangle, ShieldCheck, 
  Sparkles, Sliders, Info, Compass, HelpCircle, Activity,
  Maximize2, Cpu, Wrench, Layers
} from 'lucide-react';

interface RobotComponent {
  id: string;
  name: string;
  weightG: number; // weight in grams
  xMm: number;    // X coord from robot center (-228.6 to 228.6 mm)
  yMm: number;    // Y coord from robot center (-228.6 to 228.6 mm)
  zMm: number;    // Z coord height (0 to 457.2 mm)
}

const DEFAULT_COMPONENTS: RobotComponent[] = [
  { id: '1', name: 'Mecanum Strafer Chassis Frame', weightG: 3200, xMm: 0, yMm: 0, zMm: 45 },
  { id: '2', name: 'REV Slim NiMH Battery 12V', weightG: 850, xMm: -140, yMm: 0, zMm: 35 },
  { id: '3', name: 'Control Hub & Core Electronics Pack', weightG: 450, xMm: -80, yMm: -60, zMm: 80 },
  { id: '4', name: 'Heavy Duty Cascading Slides Assembly', weightG: 1400, xMm: 30, yMm: 0, zMm: 220 },
  { id: '5', name: 'Active Pivot Intakes & Claws', weightG: 680, xMm: 160, yMm: -10, zMm: 120 }
];

const PRESETS = [
  {
    name: 'Stock Home Configuration',
    desc: 'Core default chassis setup with battery placed centrally on the back plate, lift slides compressed.',
    components: DEFAULT_COMPONENTS
  },
  {
    name: 'Slides Fully Extended Top (High CG Risk)',
    desc: 'Simulates the heavy cargo slides sliding fully upright to top scoring junction heights. Center of gravity elevates dramatically.',
    components: [
      { id: '1', name: 'Mecanum Strafer Chassis Frame', weightG: 3200, xMm: 0, yMm: 0, zMm: 45 },
      { id: '2', name: 'REV Slim NiMH Battery 12V', weightG: 850, xMm: -140, yMm: 0, zMm: 35 },
      { id: '3', name: 'Control Hub & Core Electronics Pack', weightG: 450, xMm: -80, yMm: -60, zMm: 80 },
      { id: '4', name: 'Heavy Duty Cascading Slides Assembly (EXTENDED)', weightG: 1400, xMm: 80, yMm: 0, zMm: 420 },
      { id: '5', name: 'Active Pivot Intakes & Claws (UP)', weightG: 685, xMm: 120, yMm: -10, zMm: 390 }
    ]
  },
  {
    name: 'Drivetrain Only Base (Ultra Stable)',
    desc: 'Low-gravity chassis testing. Perfect for programming drive algorithms first before hardware superstructures arrive.',
    components: [
      { id: '1', name: 'Mecanum Strafer Chassis Frame', weightG: 3200, xMm: 0, yMm: 0, zMm: 45 },
      { id: '2', name: 'REV Slim NiMH Battery 12V', weightG: 850, xMm: 0, yMm: 0, zMm: 30 },
      { id: '3', name: 'Control Hub & Core Electronics Pack', weightG: 450, xMm: 0, yMm: -40, zMm: 60 }
    ]
  },
  {
    name: 'Forward Heavy Intake Reach',
    desc: 'Intake active roller unit reaches completely outside the perimeter to grab cones. Shows significant horizontal deviation.',
    components: [
      { id: '1', name: 'Mecanum Strafer Chassis Frame', weightG: 3200, xMm: 0, yMm: 0, zMm: 45 },
      { id: '2', name: 'REV Slim NiMH Battery 12V', weightG: 850, xMm: -140, yMm: 0, zMm: 35 },
      { id: '3', name: 'Control Hub & Core Electronics Pack', weightG: 450, xMm: -80, yMm: -60, zMm: 80 },
      { id: '4', name: 'Heavy Duty Cascading Slides Assembly', weightG: 1400, xMm: 40, yMm: 0, zMm: 220 },
      { id: '5', name: 'Active Pivot Intakes (REACHING FRONT)', weightG: 1100, xMm: 220, yMm: 0, zMm: 80 }
    ]
  }
];

export default function COMCalculator() {
  const [components, setComponents] = useState<RobotComponent[]>(() => {
    const saved = localStorage.getItem('vortex_com_components');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePresetIndex, setActivePresetIndex] = useState<number>(-1);
  const [showHelper, setShowHelper] = useState(true);

  // New element form states
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<string | number>('');
  const [x, setX] = useState<string | number>('');
  const [y, setY] = useState<string | number>('');
  const [z, setZ] = useState<string | number>('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('vortex_com_components', JSON.stringify(components));
  }, [components]);

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Parse the values with safe dynamic fallbacks
    const parsedWeight = typeof weight === 'number' ? weight : parseInt(weight);
    const parsedX = typeof x === 'number' ? x : parseFloat(x);
    const parsedY = typeof y === 'number' ? y : parseFloat(y);
    const parsedZ = typeof z === 'number' ? z : parseFloat(z);

    const valWeight = isNaN(parsedWeight) ? 250 : Math.max(1, parsedWeight);
    const valX = isNaN(parsedX) ? 0 : Math.max(-228.6, Math.min(228.6, parsedX));
    const valY = isNaN(parsedY) ? 0 : Math.max(-228.6, Math.min(228.6, parsedY));
    const valZ = isNaN(parsedZ) ? 50 : Math.max(0, Math.min(457.2, parsedZ));

    const newComponent: RobotComponent = {
      id: Date.now().toString(),
      name: name.trim(),
      weightG: valWeight,
      xMm: valX,
      yMm: valY,
      zMm: valZ
    };

    setComponents(prev => [...prev, newComponent]);
    setName('');
    setWeight('');
    setX('');
    setY('');
    setZ('');
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  const handleLoadPreset = (index: number) => {
    setComponents(PRESETS[index].components);
    setActivePresetIndex(index);
  };

  const handleResetDefaults = () => {
    setComponents(DEFAULT_COMPONENTS);
    setActivePresetIndex(0);
  };

  const handleClearAll = () => {
    setComponents([]);
    setActivePresetIndex(-1);
  };

  // PHYSICS COM MATH FORMULAS
  // X_com = sum(w_i * x_i) / sum(w_i)
  // Y_com = sum(w_i * y_i) / sum(w_i)
  // Z_com = sum(w_i * z_i) / sum(w_i)
  const totalWeight = components.reduce((sum, c) => sum + c.weightG, 0);

  const comX = totalWeight > 0 
    ? components.reduce((sum, c) => sum + (c.weightG * c.xMm), 0) / totalWeight 
    : 0;

  const comY = totalWeight > 0 
    ? components.reduce((sum, c) => sum + (c.weightG * c.yMm), 0) / totalWeight 
    : 0;

  const comZ = totalWeight > 0 
    ? components.reduce((sum, c) => sum + (c.weightG * c.zMm), 0) / totalWeight 
    : 0;

  // Stability Metric Calculations
  // Robot limit size boundary is 18x18 inches (457.2 x 457.2 mm)
  // Our coordinates span center-zero: -228.6 mm to +228.6 mm
  const robotLimitMm = 228.6; 
  
  // Distance from CoM (X, Y) to nearest footprint support line
  // Standard wheel contact points form a polygon. Let's find min outer margin
  const distToLeft = robotLimitMm + comX;
  const distToRight = robotLimitMm - comX;
  const distToFront = robotLimitMm - comY;
  const distToBack = robotLimitMm + comY;
  
  const minHorizontalMargin = Math.min(distToLeft, distToRight, distToFront, distToBack);

  // Tip Risk index calculations: higher Z (CoM height) and smaller horizontal margins elevate tip ratios 
  // Stability Score ranges from 0% (Extremely high tip risk) to 100% (Absolute bedrock stability)
  const calculateStability = () => {
    if (totalWeight === 0) return { percent: 100, label: 'No Weight', color: 'text-slate-400' };
    
    // Theoretical tip index coefficient: comZ / minHorizontalMargin
    const tipCoefficient = minHorizontalMargin > 0 ? (comZ / minHorizontalMargin) : 10;
    
    // Scale stability percentage based on heights and margins standard ratios
    let stabilityPercent = 100 - (tipCoefficient * 25);
    stabilityPercent = Math.max(5, Math.min(100, stabilityPercent));

    if (stabilityPercent >= 80) {
      return { percent: Math.round(stabilityPercent), label: 'Excellent (Bedrock)', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' };
    } else if (stabilityPercent >= 55) {
      return { percent: Math.round(stabilityPercent), label: 'Good (Operational)', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' };
    } else if (stabilityPercent >= 35) {
      return { percent: Math.round(stabilityPercent), label: 'Moderate Tipping Risk', color: 'text-amber-500 border-amber-500/20 bg-amber-500/10' };
    } else {
      return { percent: Math.round(stabilityPercent), label: 'CRITICAL (High Turn Tip Risk)', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10 animate-pulse' };
    }
  };

  const stability = calculateStability();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="com-page-view animate-fadeIn">
      
      {/* Page Header */}
      <div className="border-b border-[var(--border)] pb-8 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-1">Kinematic Engineering</span>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Center of Mass Calculator</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
            Simulate and calibrate the combined geometric centroid $(X_c, Y_c, Z_c)$ of the robot. Identify center of gravity heights and analyze tipping risk instantly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs font-bold uppercase text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--text-primary)] transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Load Default Stock</span>
          </button>

          <button 
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3.5 py-2 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Stability Warning Bar */}
      {stability.percent < 35 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex gap-3 text-left">
          <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
          <div>
            <h4 className="text-xs font-extrabold uppercase text-rose-500">Hazardous Center of Gravity Detected!</h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Your robot has an elevated tipping risk coefficient due to a high center of mass height <span className="font-mono font-bold">({comZ.toFixed(1)} mm)</span> and asymmetrical weight placement. Ensure you place the main battery pack lower or add passive wheel support weights to optimize corner traction.
            </p>
          </div>
        </div>
      )}

      {/* LOAD PRESETS SLIDER ROW */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wide text-left text-[var(--text-secondary)] flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
          Select Subsystem Testing Presets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(idx)}
              className={`rounded-xl border p-4 flex flex-col gap-2 transition duration-200 outline-none ${
                activePresetIndex === idx
                  ? 'border-[var(--accent)] bg-[var(--card-bg)] shadow-[0_0_20px_rgba(0,240,255,0.06)]'
                  : 'border-[var(--border)] bg-[var(--card-bg)]/40 hover:border-slate-550'
              }`}
            >
              <div className="font-sans text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">{preset.name}</div>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 mt-0.5">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Coordinates Plot Canvas Vector Map */}
        <div className="lg:col-span-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 text-left flex flex-col gap-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500">Diagnostic Plane</span>
            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase">Top-Down Footprint Coordinates map</h3>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              Visualizes the virtual 18" sizing box limits & wheels support contact boundaries. Glowing matrix pinpoint represents the calculated CoM.
            </p>
          </div>

          {/* Interactive Plotting Stage SVG Container */}
          <div className="relative border border-[var(--border)]/70 bg-[var(--bg-primary)]/70 rounded-xl aspect-square flex items-center justify-center p-2.5 overflow-hidden">
            
            {/* SVG Plot plane */}
            {(() => {
              // Map mm coordinates to internal SVG viewBox dimensions (e.g. 0 to 300 viewBox)
              // Robot sizing boundaries mm span from -228.6 to 228.6. We can map mm to svg coordinates:
              // MM coordinate to SVG layout multiplier: SVG is 300x300, center is 150, 150
              // mm val mapped to px: px = 150 + (mm / 228.6) * 120
              const toSvgX = (mm: number) => 150 + (mm / 228.6) * 110;
              const toSvgY = (mm: number) => 150 + (mm / 228.6) * 110; // SVG downward is increasing Y, so Y coord maps downward

              return (
                <svg className="w-full h-full max-w-[400px] max-h-[400px]" viewBox="0 0 300 300">
                  {/* Grid Lines in background */}
                  <line x1="150" y1="10" x2="150" y2="290" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" className="opacity-50" />
                  <line x1="10" y1="150" x2="290" y2="150" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" className="opacity-50" />
                  <circle cx="150" cy="150" r="110" fill="none" stroke="var(--border)" strokeWidth="1" className="opacity-20" />
                  <circle cx="150" cy="150" r="55" fill="none" stroke="var(--border)" strokeWidth="1" className="opacity-20" />

                  {/* 18x18 Inches Robot Support Limits Box Boundary */}
                  <rect 
                    x="40" 
                    y="40" 
                    width="220" 
                    height="220" 
                    fill="none" 
                    stroke="var(--border)" 
                    strokeWidth="1.5"
                    className="opacity-60"
                  />
                  
                  {/* Wheel contact point squares - Mecanum support footprints */}
                  <rect x="42" y="42" width="20" height="35" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1" className="opacity-40" />
                  <rect x="238" y="42" width="20" height="35" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1" className="opacity-40" />
                  <rect x="42" y="223" width="20" height="35" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1" className="opacity-40" />
                  <rect x="238" y="223" width="20" height="35" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1" className="opacity-40" />
                  
                  {/* Outer safety frame text */}
                  <text x="45" y="32" className="text-[8px] font-mono fill-slate-500" textAnchor="start">18x18 FTC Boundary Limit (457 mm)</text>

                  {/* Render constituent components points */}
                  {components.map((comp) => {
                    const cx = toSvgX(comp.xMm);
                    const cy = toSvgY(comp.yMm);
                    // Circle size proportional to component weight
                    const radius = Math.max(4, Math.min(22, 3 + (comp.weightG / 400)));

                    return (
                      <g key={comp.id}>
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={radius} 
                          fill="var(--accent)" 
                          fillOpacity="0.1" 
                          stroke="var(--accent)" 
                          strokeWidth="1.5"
                          className="opacity-70 group hover:opacity-100 transition duration-150"
                        />
                        <text 
                          x={cx} 
                          y={cy - radius - 3} 
                          className="text-[7.5px] font-bold fill-slate-500 font-sans opacity-0 hover:opacity-100 p-1 pointer-events-none transition duration-150"
                          textAnchor="middle"
                        >
                          {comp.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Glowing Overall Calculated Center of Mass (CoM) Target Indicator */}
                  {totalWeight > 0 && (
                    <g className="animate-fadeIn">
                      <circle 
                        cx={toSvgX(comX)} 
                        cy={toSvgY(comY)} 
                        r="14" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <line 
                        x1={toSvgX(comX) - 20} 
                        y1={toSvgY(comY)} 
                        x2={toSvgX(comX) + 20} 
                        y2={toSvgY(comY)} 
                        stroke="#10b981" 
                        strokeWidth="1.5" 
                      />
                      <line 
                        x1={toSvgX(comX)} 
                        y1={toSvgY(comY) - 20} 
                        x2={toSvgX(comX)} 
                        y2={toSvgY(comY) + 20} 
                        stroke="#10b981" 
                        strokeWidth="1.5" 
                      />
                      <circle 
                        cx={toSvgX(comX)} 
                        cy={toSvgY(comY)} 
                        r="4" 
                        fill="#10b981" 
                      />
                    </g>
                  )}
                </svg>
              );
            })()}

            {/* Float values markers */}
            <div className="absolute bottom-3 left-4 flex gap-4 text-[9px] font-mono text-[var(--text-secondary)] bg-[var(--card-bg)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              <div>Robot Center: <span className="text-[var(--text-primary)] font-bold">(0, 0)</span></div>
              <div>CoM (Top Crosshair): <span className="text-emerald-400 font-bold">({comX.toFixed(1)}, {comY.toFixed(1)}) mm</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: STATS & COEFFICIENTS + COMPONENT ADDITION */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          
          {/* Stability calculations scorecard */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-4 w-4 text-[var(--accent)]" />
              Dynamic Centroid Coordinates Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-primary)]/50 border border-[var(--border)]/65 rounded-lg p-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Combined Weight</span>
                <div className="text-xl font-black text-[var(--text-primary)] mt-1">{totalWeight.toLocaleString('en')}<span className="text-xs font-normal text-slate-500 ml-1">g</span></div>
                <div className="text-[9px] text-[var(--text-secondary)] font-medium">({(totalWeight / 453.592).toFixed(2)} lbs total robot)</div>
              </div>

              <div className="bg-[var(--bg-primary)]/50 border border-[var(--border)]/65 rounded-lg p-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">CoM Height (Z-axis)</span>
                <div className="text-xl font-black text-emerald-400 mt-1">{comZ.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-1">mm</span></div>
                <div className="text-[9px] text-[var(--text-secondary)] font-medium">Out of 457.2 mm cap limit</div>
              </div>
            </div>

            {/* Horizontal Coordinate metrics lines */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="font-bold text-[var(--text-primary)]">Left/Right Centeredness (X-com):</span>
                <span className={`font-mono font-bold ${Math.abs(comX) > 40 ? 'text-amber-500' : 'text-[var(--text-secondary)]'}`}>
                  {comX.toFixed(1)} mm {comX > 0 ? '→ Right' : '← Left'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="font-bold text-[var(--text-primary)]">Front/Back Offset (Y-com):</span>
                <span className={`font-mono font-bold ${Math.abs(comY) > 40 ? 'text-amber-500' : 'text-[var(--text-secondary)]'}`}>
                  {comY.toFixed(1)} mm {comY > 0 ? '↓ Back' : '↑ Front'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="font-bold text-[var(--text-primary)]">Tipping Support Margin:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {minHorizontalMargin.toFixed(1)} mm safety clearance
                </span>
              </div>
            </div>

            {/* Stability meter graphic bar */}
            <div className={`mt-2 border rounded-xl p-3 flex flex-col gap-1.5 ${stability.color}`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[var(--text-primary)]">Symmetrical Base Stability Score</span>
                <span className="font-mono font-bold">{stability.percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    stability.percent > 70 ? 'bg-emerald-500' :
                    stability.percent > 45 ? 'bg-cyan-500' :
                    stability.percent > 25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${stability.percent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 text-left">
                Rating status: <span className="font-bold text-[var(--text-primary)]">{stability.label}</span>
              </span>
            </div>
          </div>

          {/* Component builder addition card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1 mb-4">
              <Plus className="h-4 w-4 text-[var(--accent)]" />
              Add Robot Component Model
            </h3>

            <form onSubmit={handleAddComponent} className="flex flex-col gap-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px]">Component Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Linear Lift slides unit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px]">Weight (Grams) *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="250"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px]">Z-Axis Height (0-457 mm) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="457"
                    placeholder="50"
                    value={z}
                    onChange={(e) => setZ(e.target.value)}
                    className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px]">X Coord (-228 to +228 mm) *</label>
                  <input 
                    type="number" 
                    required
                    min="-228"
                    max="228"
                    placeholder="0"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px]">Y Coord (-228 to +228 mm) *</label>
                  <input 
                    type="number" 
                    required
                    min="-228"
                    max="228"
                    placeholder="0"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="mt-2 w-full text-center rounded-full py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 active:scale-98 transition duration-150 cursor-pointer shadow-sm"
              >
                Insert Part into Physics Model
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* TABLE SEGMENT FOR PARTS ON MODELS */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl pt-6 flex flex-col gap-4 overflow-hidden">
        <div className="px-6 flex flex-col text-left">
          <h4 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Loaded Constituents Mass Ledger</h4>
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">Verify absolute coordinate placements of all mechanical units.</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-[var(--border)] border-b bg-[var(--bg-primary)]/40 text-[10px] uppercase font-extrabold tracking-widest text-[var(--text-secondary)]">
                <th className="py-3 px-6">Component Placement</th>
                <th className="py-3 px-4 text-center">Weight (Grams)</th>
                <th className="py-3 px-4 text-center">X Coordinate</th>
                <th className="py-3 px-4 text-center">Y Coordinate</th>
                <th className="py-3 px-4 text-center">Z Coordinate (CG Height)</th>
                <th className="py-3 px-4 text-center">Weight %</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => {
                const weightRatio = totalWeight > 0 ? (comp.weightG / totalWeight) * 100 : 0;
                return (
                  <tr key={comp.id} className="border-b border-[var(--border)]/40 hover:bg-[var(--accent)]/5 transition font-sans items-center">
                    <td className="py-3.5 px-6 font-bold text-[var(--text-primary)] text-sm">{comp.name}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--text-primary)] font-bold">{comp.weightG} g</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">{comp.xMm} mm</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">{comp.yMm} mm</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--accent)] font-semibold">{comp.zMm} mm</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--text-secondary)]">{weightRatio.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 table-cell">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handleDeleteComponent(comp.id)}
                          className="p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] hover:border-rose-500 hover:text-rose-500 text-slate-500 transition"
                          title="Remove Component"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-6 bg-[var(--bg-primary)]/40 border-t border-[var(--border)]/60 text-right text-[11px] text-[var(--text-secondary)] font-sans">
          Mass metrics dynamically calculated according to centroid gravity constraints.
        </div>
      </div>

    </div>
  );
}
