import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Navigation2, Check, ArrowRight, CornerDownRight, 
  RefreshCw, HelpCircle, Volume2, VolumeX, Cpu, Palette, Users, 
  Search, Mail, Award, Compass, ExternalLink, Handshake 
} from 'lucide-react';

interface OnboardingTourProps {
  activePage: string;
  setActivePage: (page: any) => void;
  customizerOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'custom') => void;
}

interface TourStep {
  title: string;
  description: string;
  selector: string; // CSS Selector of the element to target
  mobileSelector?: string; // Fallback selector for mobile devices
  page: string; // The app page this step resides on
  icon: React.ComponentType<any>;
  action?: () => void; // Optional function to run on start
}

export default function OnboardingTour({
  activePage,
  setActivePage,
  customizerOpen,
  setCustomizerOpen,
  setTheme
}: OnboardingTourProps) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1); // -1 means main tour inactive
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('vortex_tour_muted') === 'true';
  });

  // Unique keyframes and style overrides injected into head
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes floatConfetti {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
      @keyframes pulseBeacon {
        0% { transform: scale(0.95); opacity: 0.8; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      .animate-confetti {
        animation: floatConfetti 3.5s linear infinite;
      }
      .animate-beacon {
        animation: pulseBeacon 1.8s infinite cubic-bezier(0.16, 1, 0.3, 1);
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Web Audio Synth for futuristic client-side audio cues
  const playSfx = (type: 'click' | 'success' | 'skip') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        const now = ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chime
        chords.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.0, now);
          gain.gain.linearRampToValueAtTime(0.05, now + i * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.5);
        });
      } else if (type === 'skip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) {
      console.warn('Audio synthesis neglected:', e);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const state = !prev;
      localStorage.setItem('vortex_tour_muted', String(state));
      return state;
    });
  };

  // Define our 8-step interactive onboarding steps
  const steps: TourStep[] = [
    {
      title: "Home Base",
      description: "Welcome to Team Vortex! Click or tap our logo here anytime from any page to get right back to the main dashboard.",
      selector: "#brand-logo-trigger",
      page: "home",
      icon: Cpu
    },
    {
      title: "Customize Colors",
      description: "Pick your favorite style! Tap here to switch between Light Mode and our sleek Cosmic Dark Mode with live interactive sliders.",
      selector: "#theme-customizer-toggle",
      page: "home",
      icon: Palette,
      action: () => {
        setCustomizerOpen(true);
      }
    },
    {
      title: "Filter the Roster",
      description: "Want to see who is on the team? Filter high school students easily by their specialization: Mechanical, Software, or Outreach.",
      selector: "#team-department-filter-controls",
      mobileSelector: "#nav-link-team",
      page: "team",
      icon: Users,
      action: () => {
        setCustomizerOpen(false);
        setActivePage('team');
      }
    },
    {
      title: "Our Journey",
      description: "Check out our history, design ideas, and planned milestones! Here you can follow our timeline and read our current and future thoughts.",
      selector: "#journey-header-landmark",
      mobileSelector: "#nav-link-journey",
      page: "journey",
      icon: Award,
      action: () => {
        setCustomizerOpen(false);
        setActivePage('journey');
      }
    },
    {
      title: "Sponsor Vortex",
      description: "Interested in supporting or partnership? Visit our sponsors segment to see current community patrons and find out how to back us!",
      selector: "#sponsors-header-landmark",
      mobileSelector: "#nav-link-sponsors",
      page: "sponsors",
      icon: Handshake,
      action: () => {
        setCustomizerOpen(false);
        setActivePage('sponsors');
      }
    },
    {
      title: "Search Our Assets",
      description: "Looking for CAD files, guides, or Pedro Pathing configurations? Search our repository instantly by typing CAD, PID, or Pedro.",
      selector: "#resources-dynamic-search-box",
      mobileSelector: "#nav-link-resources",
      page: "resources",
      icon: Search,
      action: () => {
        setCustomizerOpen(false);
        setActivePage('resources');
      }
    },
    {
      title: "Get in Touch",
      description: "Have questions, want to sponsor the team, or need a safety demo at your school? Send a message directly to our team captains here!",
      selector: "#cta-nav-button",
      mobileSelector: "#contact-page-view",
      page: "contact",
      icon: Mail,
      action: () => {
        setCustomizerOpen(false);
        setActivePage('contact');
      }
    },
    {
      title: "Follow Our Socials",
      description: "Stay connected! Easily reach our community YouTube guides, Instagram capture reels, Discord server, and Spotify workspace tracker directly from the footer of any page.",
      selector: "#vortex-footer-socials",
      page: "contact",
      icon: Compass,
      action: () => {
        setCustomizerOpen(false);
        // Scroll smoothly to the very bottom to highlight the footer socials beautifully
        const timer = setTimeout(() => {
          const el = document.getElementById('vortex-footer-socials');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  ];

  // ALWAYS trigger welcome overlay on device mount for previewing purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measure & update target element coordinates dynamically + Auto scroll target into viewport center
  useEffect(() => {
    if (currentStepIndex === -1) {
      setTargetCoords(null);
      return;
    }

    const updateCoords = () => {
      const step = steps[currentStepIndex];
      const selector = (isMobile && step.mobileSelector) ? step.mobileSelector : step.selector;
      const element = document.querySelector(selector);

      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetCoords({
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
          });

          // Smoothly scroll element into the center of the viewport
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
          return;
        }
      }

      // Fallback coordinate representing center-top screen
      setTargetCoords({
        x: window.innerWidth / 2 - 20,
        y: 160 + window.scrollY,
        width: 40,
        height: 40
      });
    };

    // Run custom action
    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.action) {
      currentStep.action();
    }

    const timer = setTimeout(() => {
      updateCoords();
    }, 380);

    window.addEventListener('scroll', updateCoords, { passive: true });
    window.addEventListener('resize', updateCoords);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [currentStepIndex, isMobile, activePage]);

  // Handler to initiate onboarding walkthrough
  const startTour = () => {
    playSfx('click');
    setShowWelcome(false);
    setCurrentStepIndex(0);
    setActivePage('home');
    setCustomizerOpen(false);
  };

  const handleNext = () => {
    playSfx('click');
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      triggerCelebration();
    }
  };

  const handlePrev = () => {
    playSfx('click');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const triggerCelebration = () => {
    setCurrentStepIndex(-1);
    setTargetCoords(null);
    setCustomizerOpen(false);
    setShowCelebration(true);
    playSfx('success');
    localStorage.setItem('vortex_tour_completed', 'true');
  };

  const closeCelebration = () => {
    playSfx('click');
    setShowCelebration(false);
  };

  const completeTour = () => {
    playSfx('skip');
    setCurrentStepIndex(-1);
    setTargetCoords(null);
    setCustomizerOpen(false);
    localStorage.setItem('vortex_tour_completed', 'true');
  };

  const skipTour = () => {
    playSfx('skip');
    setShowWelcome(false);
    setCurrentStepIndex(-1);
    setTargetCoords(null);
    localStorage.setItem('vortex_tour_completed', 'true');
  };

  const forceReplayTour = () => {
    localStorage.removeItem('vortex_tour_completed');
    setShowCelebration(false);
    startTour();
  };

  useEffect(() => {
    (window as any).triggerVortexTour = forceReplayTour;
    return () => {
      delete (window as any).triggerVortexTour;
    };
  }, []);

  const activeStep = steps[currentStepIndex];
  const StepIconComp = activeStep ? activeStep.icon : Cpu;

  // Compute pop-up card placements dynamically below or above spotlight
  const getPopupStyle = () => {
    if (!targetCoords) return {};
    const centerOfTargetX = targetCoords.x + targetCoords.width / 2;
    const bottomOfTargetY = targetCoords.y + targetCoords.height + 15;

    const popupWidth = 320;
    let left = centerOfTargetX - popupWidth / 2;
    if (left < 15) left = 15;
    if (left + popupWidth > window.innerWidth - 15) left = window.innerWidth - popupWidth - 15;

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${bottomOfTargetY}px`,
      zIndex: 1000
    };
  };

  // Compute mouse pointer cursor positioning exactly at highlight bounds
  const getCursorStyle = () => {
    if (!targetCoords) return {};
    const pointerX = targetCoords.x + targetCoords.width / 2;
    const pointerY = targetCoords.y + targetCoords.height / 2;

    return {
      position: 'absolute' as const,
      left: `${pointerX}px`,
      top: `${pointerY}px`,
      pointerEvents: 'none' as const,
      transition: 'left 0.43s cubic-bezier(0.25, 1, 0.5, 1), top 0.43s cubic-bezier(0.25, 1, 0.5, 1)',
      zIndex: 1010
    };
  };

  return (
    <>
      <AnimatePresence>
        {/* Step 0: Friendly Welcome Dialogue Popup Box */}
        {showWelcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left relative overflow-hidden"
              id="vortex-onboarding-welcome-modal"
            >
              {/* Circuit ambient graphic */}
              <div className="absolute top-0 right-0 h-28 w-28 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block">Interactive Tour</span>
                    <h4 className="text-sm font-black uppercase text-white tracking-wide">Welcome to Vortex!</h4>
                  </div>
                </div>

                {/* Local Mute Slider Trigger */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition duration-150 cursor-pointer border border-slate-700/50"
                  title={isMuted ? 'Unmute tour sounds' : 'Mute tour sounds'}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Hey there! Want a quick, 5-step tour of our site? We'll show you how to customize colors, filter team members, and find all our robotics resources in no time.
              </p>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  type="button"
                  onClick={skipTour}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition duration-150 cursor-pointer"
                >
                  Skip Tour
                </button>
                <button
                  type="button"
                  onClick={startTour}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-400/20 active:scale-95 transition-all duration-150 hover:shadow-cyan-400/40 flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebratory Success Confetti Finish Dialog Card */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
            
            {/* CSS-based particle streamers representing fireworks */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
              {Array.from({ length: 24 }).map((_, i) => {
                const colors = ['bg-cyan-400', 'bg-fuchsia-400', 'bg-violet-500', 'bg-amber-400', 'bg-emerald-400'];
                const randColor = colors[i % colors.length];
                const randLeft = `${Math.random() * 100}%`;
                const randDelay = `${Math.random() * 3.5}s`;
                const randSize = `${Math.random() * 8 + 6}px`;

                return (
                  <div
                    key={i}
                    className={`absolute rounded-full animate-confetti opacity-80 ${randColor}`}
                    style={{
                      left: randLeft,
                      top: '-20px',
                      width: randSize,
                      height: randSize,
                      animationDelay: randDelay,
                    }}
                  />
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ ease: "easeOut", duration: 0.45 }}
              className="bg-slate-900 border border-cyan-500/20 text-white rounded-3xl p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(6,182,212,0.18)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mx-auto h-16 w-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-400/10">
                <Award className="h-8 w-8 animate-bounce" />
              </div>

              <span className="text-[10px] font-mono tracking-[0.2em] font-black uppercase text-cyan-400 block mb-2">
                Mission Complete
              </span>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white mb-3">
                You're All Set!
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-xs mx-auto">
                Excellent! You have successfully completed the Interactive Academy walkthrough of Team Vortex's dashboard. Explore the CAD, customizers, and meet our builders!
              </p>

              <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3 text-left mb-6">
                <Cpu className="h-5 w-5 text-fuchsia-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono font-black text-fuchsia-400 uppercase tracking-widest block">Recruit Status</span>
                  <span className="text-[11px] font-sans text-slate-200">Onboarding Badge Unlocked</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={closeCelebration}
                  className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md shadow-cyan-400/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Enter Dashboard
                </button>
                <button
                  type="button"
                  onClick={forceReplayTour}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[10px] uppercase tracking-wider border border-slate-700 transition duration-150 cursor-pointer"
                >
                  Replay Walkthrough
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Steps 1-5 Overlay Visual Guide components */}
      <AnimatePresence>
        {currentStepIndex >= 0 && targetCoords && (
          <div className="absolute inset-0 pointer-events-none z-[90]">
            
            {/* Screen Mask Spotlight Overlay */}
            <div className="fixed inset-0 bg-slate-950/50 pointer-events-auto mix-blend-multiply z-[85]" />

            {/* Glowing spotlight mask border focusing on target bounds */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                left: targetCoords.x - 6,
                top: targetCoords.y - 6,
                width: targetCoords.width + 12,
                height: targetCoords.height + 12
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="absolute border-2 border-cyan-400 rounded-xl pointer-events-none z-[88] bg-cyan-400/5 mix-blend-screen"
            >
              {/* Dynamic Concentric Beacon Pulsing Outer Ring */}
              <div className="absolute -inset-4 border border-cyan-400/40 rounded-2xl animate-beacon pointer-events-none" />
              <div className="absolute -inset-10 border border-cyan-500/20 rounded-[1.25rem] animate-beacon pointer-events-none" style={{ animationDelay: '0.6s' }} />
            </motion.div>

            {/* Interactive ACTUAL High-Fidelity OS mouse pointer vector dragging dynamically */}
            <div style={getCursorStyle()}>
              {/* Pulsing radar point at pointer coordinate */}
              <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-cyan-400/40 border border-cyan-400 pointer-events-none" />
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full border border-cyan-400/40 animate-ping opacity-75 pointer-events-none" />
              
              {/* Real high fidelity vector OS Pointer Mouse cursor shape in clean outline */}
              <svg 
                className="w-10 h-10 select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] filter transform -rotate-12 translate-x-[-1px] translate-y-[-1px]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Thick Cyan highlight border edge */}
                <path 
                  d="M 4 2 L 4 19.5 L 9.2 14.8 L 14.2 21.6 L 16.5 20 L 11.5 13.2 L 17 13.2 Z" 
                  fill="white" 
                  stroke="#22d3ee" 
                  strokeWidth="2.2" 
                  strokeLinejoin="miter"
                />
                {/* Dark slate internal mouse body */}
                <path 
                  d="M 5.1 3.8 L 5.1 17.5 L 8.8 13.9 L 14 20 L 15.3 19.1 L 10.2 12.8 L 15 12.8 Z" 
                  fill="#020617" 
                  stroke="none"
                />
              </svg>
            </div>

            {/* Interactive Step Tooltip / Pop-Up Box positioned dynamically */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={getPopupStyle()}
              className="w-[320px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left pointer-events-auto z-[95]"
              id="vortex-onboarding-popover-stage"
            >
              {/* Close Button shortcut */}
              <button
                onClick={completeTour}
                className="absolute top-4.5 right-4.5 p-1 text-slate-400 hover:text-white rounded-md transition duration-150 cursor-pointer"
                title="Cancel tour"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-3.5 flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <StepIconComp className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1">
                    <Navigation2 className="h-2.5 w-2.5 fill-cyan-400 rotate-90" />
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <h5 className="font-sans text-xs font-black uppercase text-white mt-0.5 pr-4 tracking-wide">
                    {activeStep.title}
                  </h5>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                {activeStep.description}
              </p>

              {/* Progress Indicator Dots */}
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStepIndex ? 'w-4 bg-cyan-400' : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Control Action Navigation Row */}
                <div className="flex items-center gap-1.5 animate-fadeIn">
                  {currentStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  
                  {/* Sound Trigger toggle for step cards */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 text-slate-400 hover:text-slate-200 transition duration-150 cursor-pointer"
                    title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5 opacity-60" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-all duration-150 shadow-md shadow-cyan-400/10 cursor-pointer flex items-center gap-1"
                  >
                    <span>{currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
