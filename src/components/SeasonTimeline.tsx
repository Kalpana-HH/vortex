import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, MapPin, Flag, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  phase: string;
  month: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  description: string;
  milestones: string[];
  lessons: string;
}

export default function SeasonTimeline() {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(3); // Default index 3 (December Autonomous testing)

  const events: TimelineEvent[] = [
    {
      phase: "Phase 1",
      month: "September",
      title: "Season Kickoff & Low-Fidelity Prototyping",
      status: "completed",
      description: "Dissecting game rules, calculating physical limits, and constructing rapid cardboard & wood intake prototypes to test debris engagement vectors.",
      milestones: [
        "Analyzed Rulebooks & Scoring Optimization matrices",
        "Completed low-CG drivetrain geometry sketches",
        "Built 3 modular active rubber-sweeper rollers for scoring pieces"
      ],
      lessons: "Quick cardboard and wood mockups are 10x faster than cad iterations for weeding out sizing constraints."
    },
    {
      phase: "Phase 2",
      month: "October",
      title: "Assembly CAD & Custom CNC Milling",
      status: "completed",
      description: "Transferring physical dimensions into full 3D assemblies in Onshape. Shaving plate weight under sponsor supervision on CNC carbon routers.",
      milestones: [
        "Generated full 3D assembly of the active robot prototype",
        "Milled 3mm robust 6061 aluminium side plates",
        "3D printed TPU shock mounts for standard cameras"
      ],
      lessons: "In CAD, always add a 0.5mm wiggle clearance margin for standard laser cutting of slot sockets to ease physical assembly."
    },
    {
      phase: "Phase 3",
      month: "November",
      title: "Electronics Integration & Wiring",
      status: "completed",
      description: "Installing core electronics, custom strain-relief wire paths, battery casing locks, and dead-wheel encoder odometry pods.",
      milestones: [
        "Mounted REV Control & Expansion Hub nodes securely",
        "Crimped and insulated electrical connector jackets",
        "Calibrated absolute dead-wheel encoder spring tensions"
      ],
      lessons: "Strain-relief loops around motor inputs prevent micro-disconnects when climbing up field barriers."
    },
    {
      phase: "Phase 4",
      month: "December",
      title: "Autonomous Path Planning & Vision Tuning",
      status: "active",
      description: "Adjusting PID algorithms, installing state space motion profiles, and integrating neural computer vision with Limelight AprilTags.",
      milestones: [
        "Installed RoadRunner Mecanum kinematics controller loops",
        "Tuned translational & angular velocity coefficient constraints",
        "Achieved millisecond alignment on high backdrop markers"
      ],
      lessons: "Integrating localized optical flow sensor corrections decreases coordinate slippage drift under 0.15 inches during long routines."
    },
    {
      phase: "Phase 5",
      month: "January - February",
      title: "League Qualifiers & Field Diagnostics",
      status: "upcoming",
      description: "Competing in local League tournaments. Gathering scouting catalogs, optimizing alliance strategies, and making swift adjustments in pits.",
      milestones: [
        "Engage in 5 league ranking matches with strategic alliances",
        "Aggregate full robotic status performance scouting sheets",
        "Refine active intake sweeps for faster floor cycles"
      ],
      lessons: "Always carry spare ready-clamped 3D parts and redundant limit switches in your match toolbox."
    },
    {
      phase: "Phase 6",
      month: "March",
      title: "State Championship Finals",
      status: "upcoming",
      description: "Competing at State Championship level. Presenting our custom Engineering Portfolio to judges and contending as Alliance Captains.",
      milestones: [
        "Qualify for tournament playoff brackets in the top tier alliances",
        "Submit finalized structural notebooks to panel judges",
        "Engage with regional sponsors regarding our career mentoring tracks"
      ],
      lessons: "Judge interactions are summarized best by letting your students present their own specialized sections directly."
    }
  ];

  const currentEvent = events[activePhaseIndex];

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900" id="season-timeline-sandbox">
      {/* Timeline Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
          <Calendar className="h-4 w-4" />
          <span className="text-xs font-bold tracking-widest uppercase">The Build Season</span>
        </div>
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Our Roadmap & Season Progress
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Robotics is a continuous journey. Track our real mechanical, structural, and software milestones month-by-month as we march toward State qualification.
        </p>
      </div>

      {/* Main Grid layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left column: Visual Step progression list */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Build Phases & Milestones
          </span>
          <div className="flex flex-col gap-2.5 relative">
            {/* Draw a subtle connect line for timeline */}
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

            {events.map((ev, index) => {
              const isActive = index === activePhaseIndex;
              return (
                <button
                  key={ev.phase}
                  onClick={() => setActivePhaseIndex(index)}
                  className={`relative z-10 flex items-center justify-between rounded-xl border p-3.5 text-left transition cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:border-cyan-500 dark:bg-cyan-500/5 dark:text-cyan-400 shadow-sm'
                      : 'border-slate-100 bg-slate-50/40 text-slate-700 hover:bg-slate-100 dark:border-slate-850 dark:bg-slate-950/20 dark:hover:bg-slate-950/60'
                  }`}
                  id={`timeline-step-btn-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-150 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                      {ev.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : ev.status === 'active' ? (
                        <Clock className="h-5 w-5 text-indigo-650 dark:text-cyan-400 animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-350 dark:text-slate-650" />
                      )}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {ev.phase} • {ev.month}
                      </span>
                      <span className="text-xs font-bold leading-normal truncate max-w-[140px] sm:max-w-xs">{ev.title}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${isActive ? 'translate-x-0.5 opacity-100' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected events detailed panel */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-dashed border-slate-250/70 bg-slate-50/30 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/20">
          
          <div className="flex flex-col gap-5">
            {/* Phase header */}
            <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4 dark:border-slate-850/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 dark:text-cyan-400 uppercase">
                  {currentEvent.phase} Progress details
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase ${
                  currentEvent.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400' :
                  currentEvent.status === 'active' ? 'bg-indigo-600/10 text-indigo-600 dark:bg-cyan-500/20 dark:text-cyan-400 animate-pulse' :
                  'bg-slate-100 text-slate-450 dark:bg-slate-800/60 dark:text-slate-500'
                }`}>
                  {currentEvent.status}
                </span>
              </div>
              <h3 className="font-sans text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {currentEvent.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {currentEvent.description}
              </p>
            </div>

            {/* Target milestones points checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Key Deliverables & Goals:
              </span>
              <div className="flex flex-col gap-2">
                {currentEvent.milestones.map((mil, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 dark:text-slate-350 font-medium">
                    <Flag className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{mil}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engineer Note / Lesson Learned callout */}
          <div className="mt-6 rounded-lg bg-white/70 p-4 border border-slate-100 shadow-sm dark:bg-slate-900/50 dark:border-slate-850">
            <span className="text-[9px] font-extrabold text-indigo-650 dark:text-cyan-400 uppercase tracking-widest block">
              Lessons from the Field:
            </span>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              "{currentEvent.lessons}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
