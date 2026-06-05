import React, { useState } from 'react';
import { 
  Settings, 
  Layers, 
  Pocket, 
  Cpu, 
  HelpCircle, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';

interface Subsystem {
  id: string;
  name: string;
  title: string;
  motors: string;
  gearRatio: string;
  weight: string;
  hardwareSpecs: string[];
  softwareControl: string;
  description: string;
}

export default function RobotSpecsExplorer() {
  const [activeTab, setActiveTab] = useState<string>('drive');
  
  // Real Physics Calculations State for the interactive drivetrain calculator on page
  const [motorRpm, setMotorRpm] = useState<number>(312); // Standard goBILDA Yellow Jacket RPM
  const [wheelDiameterMm, setWheelDiameterMm] = useState<number>(96); // Standard mecanum wheel diameter in mm
  
  const subsystems: Subsystem[] = [
    {
      id: 'drive',
      name: 'Mecanum Drivetrain',
      title: 'Chassis & Omni-Directional Drive Module',
      motors: '4x goBILDA Yellow Jacket 19.2:1 (312 RPM)',
      gearRatio: '1:1 (Direct Drive)',
      weight: '14.2 lbs (Including battery & plates)',
      hardwareSpecs: [
        'Custom CNC machined 6061-T6 aluminum side channels',
        '96mm goBILDA Premium Mecanum wheels with ball-bearing rollers',
        '8mm REX steel shafts with clamping hubs for zero backlash',
        'Full protective polycarbonate top belly pan shield'
      ],
      softwareControl: 'RoadRunner mecanum kinematic feedforward control with localized PID loop targeting 3-wheel dead-wheel odometry pods.',
      description: 'Our custom-milled low-clearance platter system allows high agile drift turns while keeping weight packed 2.5 inches above ground.'
    },
    {
      id: 'intake',
      name: 'Active Intake',
      title: 'Dual-Stage Intake Manipulator',
      motors: '1x goBILDA Yellow Jacket 13.7:1 (435 RPM)',
      gearRatio: '1.5:1 Reduction (Chain driven)',
      weight: '2.8 lbs',
      hardwareSpecs: [
        'Flexible 3D-molded TPU surgical tubing sweeping rollers',
        'Lexan active gate flaps for high-speed debris acquisition',
        'Ball-bearing pivoting arm with adjustable slip clutch',
        'High-density green silicone foam alignment spacers'
      ],
      softwareControl: 'Automated current-limit sensing; motor reverses automatically if current spikes above 6.5A (indicates sample jam).',
      description: 'An expansive sweep intake that collects standard competition samples from any orientation and safely centers them into the elevator hopper.'
    },
    {
      id: 'lift',
      name: 'Linear Lift Elevator',
      title: 'High-Speed Cascading Viper Slide',
      motors: '2x goBILDA Yellow Jacket 5.2:1 (1150 RPM)',
      gearRatio: 'Direct spool',
      weight: '4.5 lbs (Chassis mount)',
      hardwareSpecs: [
        'Dual REV Robotics aluminum Viper Slide linear runners with 4 stages',
        'Dyneema 100lb zero-stretch braided synthetic core cord',
        'Magnetic physical limit switch safety-stops at ends of travel',
        'CNC machined spool guides to prevent cord cross-wrapping'
      ],
      softwareControl: 'Custom closed-loop PID control with Feedforward (Ka/Kv coefficient tuning) for motion profiling. Holds slides in place under full carriage load.',
      description: 'Reaches a maximum level target height of 42 inches in only 0.78 seconds, ensuring rapid cycles between the field floor and high baskets.'
    },
    {
      id: 'sensors',
      name: 'Sensors & Odometry',
      title: 'Pose Localization & Visual Odometry Station',
      motors: 'No active motors (Passive dead wheels)',
      gearRatio: 'N/A',
      weight: '0.6 lbs',
      hardwareSpecs: [
        'Limelight 3G high-FPS processing vision camera',
        '3x custom spring-loaded passive odometry tracker pods',
        'SparkFun OTOS (Optical Tracking Odometry Sensor) utilizing dual optical flow sensors',
        'REV Hub integrated 9-Axis IMU sensor node'
      ],
      softwareControl: 'Three-wheel dead wheel coordinate odometry fused with optical flow positioning and intermittent visual AprilTag camera corrections.',
      description: 'Allows our autonomous routine to pinpoint our robot to within ±0.25 inches layout precision on the actual competition field floor.'
    }
  ];

  const currentSubsystem = subsystems.find(s => s.id === activeTab) || subsystems[0];

  // Calculate theoretical drivetrain velocity
  // Velocity = RPM * Pi * Wheel Diameter / 60 / 1000 => meters per second
  const theoreticalSpeedMps = ((motorRpm * Math.PI * wheelDiameterMm) / 60 / 1000).toFixed(2);
  const theoreticalSpeedFps = (parseFloat(theoreticalSpeedMps) * 3.28084).toFixed(2);

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900" id="robot-tech-specs">
      
      {/* Component Title */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
          <Settings className="h-4 w-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Hardware Analytics</span>
        </div>
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Active Robot Design Architecture
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click the core subsystems below to inspect our actual mechanical CAD specifications and live software feedback controllers.
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        
        {/* Left Side: Interactive tabs & Physics tool */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Subsystem Selector buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Select Subsystem
            </span>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
              {subsystems.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    activeTab === sub.id
                      ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:border-cyan-500 dark:bg-cyan-500/5 dark:text-cyan-400'
                      : 'border-slate-100 bg-slate-50/50 text-slate-650 hover:bg-slate-100 dark:border-slate-850 dark:bg-slate-950/20 dark:hover:bg-slate-950/60'
                  }`}
                  id={`subsystem-btn-${sub.id}`}
                >
                  <Layers className={`h-4 w-4 ${activeTab === sub.id ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold">{sub.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Drivetrain Speed Estimator Tool */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-850 dark:bg-slate-950/20">
            <h4 className="flex items-center gap-2 font-sans text-xs font-bold text-slate-800 dark:text-slate-200">
              <Compass className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Kinematic Parameter Estimator
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Adjust structural wheel sizing and motor output speeds to calculate theoretical max linear velocity of the chassis.
            </p>

            <div className="mt-4 flex flex-col gap-3.5 border-t border-slate-100 pt-3.5 dark:border-slate-850">
              {/* Motor RPM Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Output Shaft Speed:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{motorRpm} RPM</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="1200" 
                  step="10" 
                  value={motorRpm}
                  onChange={(e) => setMotorRpm(parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-800 dark:accent-cyan-400"
                />
              </div>

              {/* Wheel Diameter Input */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Mecanum Wheel Diameter:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{wheelDiameterMm} mm</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="120" 
                  step="1" 
                  value={wheelDiameterMm}
                  onChange={(e) => setWheelDiameterMm(parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-800 dark:accent-cyan-400"
                />
              </div>

              {/* Results */}
              <div className="mt-1 rounded-lg bg-white/80 p-2.5 border border-slate-100 dark:border-slate-850 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Theoretical Max Speed</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-extrabold text-indigo-650 dark:text-cyan-400 font-mono">{theoreticalSpeedMps}</span>
                    <span className="text-[10px] text-slate-500">m/s</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-450 font-mono">{theoreticalSpeedFps}</span>
                    <span className="text-[9px] text-slate-400">ft/s</span>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[8.5px] font-bold text-indigo-650 dark:bg-cyan-950/40 dark:text-cyan-450">
                  No Slip Matrix
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Tab Details Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5 border-l border-slate-100 pl-0 lg:pl-6 dark:border-slate-850">
          
          <div className="flex flex-col gap-4">
            {/* Header info */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-cyan-400">
                Subassembly Specifications Profile
              </span>
              <h3 className="font-sans text-xl font-extrabold text-slate-900 dark:text-white">
                {currentSubsystem.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {currentSubsystem.description}
              </p>
            </div>

            {/* Quick specifications mini grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-50/50 p-2.5 border border-slate-100 dark:border-slate-900 dark:bg-slate-950/20">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Actuators</span>
                <p className="mt-0.5 font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 truncate" title={currentSubsystem.motors}>
                  {currentSubsystem.motors}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50/50 p-2.5 border border-slate-100 dark:border-slate-900 dark:bg-slate-950/20">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Gear Tuning</span>
                <p className="mt-0.5 font-sans text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentSubsystem.gearRatio}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50/50 p-2.5 border border-slate-100 dark:border-slate-900 dark:bg-slate-950/20">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Subsystem Weight</span>
                <p className="mt-0.5 font-sans text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentSubsystem.weight}
                </p>
              </div>
            </div>

            {/* Detailed Hardware Features list */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Material & Hardware Build:
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {currentSubsystem.hardwareSpecs.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-650 dark:text-slate-350">
                    <Pocket className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Software Control Box */}
          <div className="rounded-xl border border-dashed border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/10">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-cyan-400">
              <Cpu className="h-4 w-4" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase">Active Software Control Strategy</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-mono">
              {currentSubsystem.softwareControl}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
