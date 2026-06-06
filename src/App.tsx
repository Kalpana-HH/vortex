import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Compass, Terminal, Eye, BookOpen, MessageSquare, Youtube, Instagram, Box, ExternalLink, ChevronRight, ChevronLeft, Award, Calendar, MapPin, Users, Handshake, Sparkles, Cpu, Wrench, Image } from 'lucide-react';
import { teamMembers } from './data/team';

const vortexLogo = '/vortex_logo.png';

type PageID = 'home' | 'team' | 'journey' | 'sponsors' | 'resources' | 'contact' | 'gallery';

interface PageItem {
  id: PageID;
  label: string;
}

// Interactive Spinning FIRST Experience odometer component with deceleration physics
const FIRSTExperienceSpinner = ({ targetYears }: { targetYears: number }) => {
  const [currentValue, setCurrentValue] = useState<string | number>('?');
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    let counts = 0;
    const maxCounts = 18;

    const spin = () => {
      counts++;
      if (counts < maxCounts) {
        setCurrentValue(Math.floor(Math.random() * 10));
        const delay = 40 + (counts * counts * 0.9);
        timerRef.current = setTimeout(spin, delay);
      } else {
        setCurrentValue(targetYears);
        setIsSpinning(false);
      }
    };

    timerRef.current = setTimeout(spin, 30);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsSpinning(false);
    setCurrentValue('?');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      onMouseEnter={startSpin}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center justify-center bg-[var(--bg-primary)] border border-[var(--border)] p-3 rounded-xl mt-3 select-none relative group/spin-card overflow-hidden w-full transition duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.02]"
    >
      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
        FIRST Experience
      </span>
      
      {/* Visual odometer slot-card */}
      <div className="relative mt-2 px-4 py-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-md min-w-[75px] text-center shadow-inner overflow-hidden flex items-center justify-center gap-1.5">
        <div className="absolute inset-x-0 top-0 h-1 bg-black/5" />
        <span className={`font-mono text-xl font-black transition-all duration-150 inline-block ${isSpinning ? 'text-[var(--accent)] scale-110 blur-[0.5px] animate-pulse' : 'text-[var(--text-primary)]'}`}>
          {currentValue}
        </span>
        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
          {currentValue === 1 ? 'Year' : 'Years'}
        </span>
      </div>

      <div className="mt-2 text-[8px] font-bold text-[var(--text-secondary)] group-hover/spin-card:text-[var(--accent)] transition duration-150 uppercase tracking-widest flex items-center gap-1">
        <span>{isSpinning ? '⚙️ SPINNING...' : currentValue === '?' ? '✨ HOVER TO SPIN' : '✅ REVEALED'}</span>
      </div>
    </div>
  );
};

// High-fidelity media assets list
const galleryItems = [
  {
    id: 1,
    title: 'Precision Chassis Milling',
    caption: 'Custom machining of our lightweight aerospace-grade aluminum chassis base-plate on our shop router.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    category: 'MECHANICAL',
    date: 'July 2026'
  },
  {
    id: 2,
    title: 'Custom PCB Circuit Design',
    caption: 'Prototyping dynamic sensor routing hubs inside Altium to sync absolute encoders and pinpoint system modules.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    category: 'ELECTRONICS',
    date: 'June 2026'
  },
  {
    id: 3,
    title: '3D CAD Mecanum Assembly',
    caption: 'Optimizing high-reduction gearbox placements and motor clearance inside OnShape.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    category: 'CAD MODELS',
    date: 'June 2026'
  },
  {
    id: 4,
    title: 'Electrical Harness Inspection',
    caption: 'Testing clean wire loom protections, power distribution modules, and custom copper bus connections.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    category: 'ELECTRONICS',
    date: 'August 2026'
  },
  {
    id: 5,
    title: 'Initial Team Brainstorm Block',
    caption: 'Texas rookie builders studying math bounds, game elements, design spreadsheets, and robot rules.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    category: 'WORKSHOPS',
    date: 'June 2026'
  },
  {
    id: 6,
    title: 'Trajectory Polynomial Plotting',
    caption: 'Drafting bezier mathematical spline curves to calculate path control velocity parameters.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    category: 'CAD MODELS',
    date: 'August 2026'
  }
];

// Interactive Gallery View Component with Lightbox popup
const GalleryPageView = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MECHANICAL' | 'ELECTRONICS' | 'CAD' | 'WORKSHOPS'>('ALL');
  const [zoomedImage, setZoomedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = galleryItems.filter(item => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CAD') return item.category === 'CAD MODELS';
    return item.category === activeTab;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-12" id="gallery-page-view">
      
      {/* Title Header */}
      <div className="border-b border-[var(--border)] pb-6 text-left flex flex-col gap-2">
        <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Visual Showcase</span>
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Media Gallery</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
          Visual documentation of our rookie workspaces, initial high-precision CAD architectures, and mechanical layouts as we prepare to embark on our very first season.
        </p>
      </div>

      {/* Categories Toolbar Filter Row */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--border)]/70">
        {(['ALL', 'MECHANICAL', 'ELECTRONICS', 'CAD', 'WORKSHOPS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition duration-150 cursor-pointer ${
              activeTab === tab 
                ? 'bg-[var(--accent)] text-[var(--btn-text)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent)]/5 border border-[var(--border)]/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of gallery assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setZoomedImage(item)}
            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full text-left"
          >
            {/* Image hover slot */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border)]">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <span className="text-white text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 border border-white/40 bg-black/20 backdrop-blur-sm rounded-lg">
                  🔎 ZOOM PICTURE
                </span>
              </div>
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content card descriptions */}
            <div className="p-5 flex flex-col gap-2 flex-grow">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] ml-auto">
                  {item.date}
                </span>
              </div>
              <h4 className="font-sans text-sm font-black text-[var(--text-primary)] uppercase tracking-wide">
                {item.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Popover Image zoom overlay */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm transition duration-300 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden max-w-2xl w-full relative flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/25 transition cursor-pointer"
              title="Close image overlay"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <img 
                src={zoomedImage.image} 
                alt={zoomedImage.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 text-left flex flex-col gap-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                  {zoomedImage.category}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)] ml-auto">
                  {zoomedImage.date}
                </span>
              </div>
              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-wide mt-1">
                {zoomedImage.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                {zoomedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Team member portraits using premium high-contrast photography placeholders
const portraits: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=450', // Alex Rivera
  '2': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=450', // Sarah Chen
  '3': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=450', // Marcus Vance
  '4': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=450', // Emily Taylor
  '5': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=450', // David Kim
  '6': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=450'  // Coach Elena Rostova
};

const sponsorLogos = [
  { 
    name: 'NASA Jet Propulsion Lab', 
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=300', 
    tier: 'Titanium Sponsor',
    desc: 'Advancing aerospace system research and technical grant support.'
  },
  { 
    name: 'goBILDA', 
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=300', 
    tier: 'Gold Partner',
    desc: 'Supplying physical chassis framework tooling & mechanical components.'
  },
  { 
    name: 'REV Robotics', 
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600&h=300', 
    tier: 'Gold Partner',
    desc: 'Supplying advanced motor controls, absolute encoders and wiring kits.'
  },
  { 
    name: 'SolidWorks', 
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600&h=300', 
    tier: 'Titanium Sponsor',
    desc: 'Empowering our builders with master level 3D CAD design licenses.'
  },
  { 
    name: 'Altium Designer', 
    logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600&h=300', 
    tier: 'Silver Sponsor',
    desc: 'Guiding custom printed circuit board layout architectures.'
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<PageID>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sponsorText, setSponsorText] = useState('');

  // Style customization / theme engine states
  const [theme, setTheme] = useState<'light' | 'custom'>('light');
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Custom colors state: default values represent a nice sleek cosmic style
  const [customBg, setCustomBg] = useState('#0a0a23');
  const [customText, setCustomText] = useState('#ffffff');
  const [customAccent, setCustomAccent] = useState('#00f0ff');
  const [customCardBg, setCustomCardBg] = useState('#131338');
  const [customBorder, setCustomBorder] = useState('#2563eb');

  // Compute live values depending on active theme mode
  const bgValue = theme === 'light' ? '#ffffff' : customBg;
  const textValue = theme === 'light' ? '#0f172a' : customText;
  const textSecValue = theme === 'light' ? '#4b5563' : (customText + 'bf'); // ~75% opacity for secondary body text
  const accentValue = theme === 'light' ? '#2563eb' : customAccent;
  const cardBgValue = theme === 'light' ? '#f8fafc' : customCardBg;
  const borderValue = theme === 'light' ? '#e2e8f0' : customBorder;
  const navBgValue = theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : (customBg + 'f0');
  const footerBgValue = theme === 'light' ? '#f1f5f9' : customBg;
  const btnTextValue = theme === 'light' ? '#ffffff' : '#000035';

  // Typewriter effect for Sponsor CTA Button
  useEffect(() => {
    const textToType = "WANT TO BE OUR SPONSOR? REGISTER INTEREST TODAY";
    let index = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const handleType = () => {
      if (!isDeleting) {
        setSponsorText(textToType.substring(0, index + 1));
        index++;
        if (index === textToType.length) {
          isDeleting = true;
          timer = setTimeout(handleType, 2000); // pause at the end
        } else {
          timer = setTimeout(handleType, 100);
        }
      } else {
        setSponsorText(textToType.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(handleType, 1000); // pause at start
        } else {
          timer = setTimeout(handleType, 60);
        }
      }
    };

    timer = setTimeout(handleType, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sponsor slideshow auto-timer
  useEffect(() => {
    if (activePage === 'sponsors') {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sponsorLogos.length);
      }, 4000);
      return () => clearInterval(slideInterval);
    }
  }, [activePage]);

  const pages: PageItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'team', label: 'Roster' },
    { id: 'journey', label: 'Our journey' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' }
  ];

  const navigateTo = (pageId: PageID) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col justify-between selection:bg-[var(--accent)]/30 selection:text-[var(--accent)] transition-all duration-300">
      
      {/* Dynamic Style Injection representing the live color palette options */}
      <style>{`
        :root {
          --bg-primary: ${bgValue};
          --text-primary: ${textValue};
          --text-secondary: ${textSecValue};
          --accent: ${accentValue};
          --card-bg: ${cardBgValue};
          --border: ${borderValue};
          --nav-bg: ${navBgValue};
          --footer-bg: ${footerBgValue};
          --btn-text: ${btnTextValue};
        }
      `}</style>
      
      {/* High-End Design Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-sm transition-all duration-300 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          
          {/* Brand/Logo Layout Matching Image exactly */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex flex-col items-center justify-center cursor-pointer select-none group py-1"
            id="brand-logo-trigger"
          >
            <img 
              src={vortexLogo} 
              alt="Vortex logo badge" 
              className="h-10 w-10 object-contain transition duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="font-sans text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase mt-1 transition duration-200 group-hover:text-[var(--accent)]">
              VORTEX
            </span>
          </div>

          {/* Desktop Navigation Link Nodes */}
          <div className="hidden md:flex items-center gap-8">
            {pages.map((p) => {
              const isSelected = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => navigateTo(p.id)}
                  className={`text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer relative py-2 ${
                    isSelected
                      ? 'text-[var(--accent)] font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                  }`}
                  id={`nav-link-${p.id}`}
                >
                  <span>{p.label}</span>
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--accent)] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Solid CTAs and controls */}
          <div className="flex items-center gap-4">
            
            <button
              onClick={() => navigateTo('contact')}
              className="hidden sm:inline-block rounded-md px-5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 active:scale-98 transition duration-200 cursor-pointer"
              id="cta-nav-button"
            >
              Get In Touch
            </button>
            
            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card-bg)] md:hidden cursor-pointer text-[var(--text-secondary)] hover:text-[var(--accent)] transition duration-150"
              title="Toggle Navigation Menu"
              id="mobile-navigation-trigger"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Custom Theme Popover Control Box in Top-Right Corner */}
            <div className="relative inline-block text-left" id="theme-engine-popover-container">
              <button
                onClick={() => setCustomizerOpen(!customizerOpen)}
                className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 active:scale-98 transition duration-150 cursor-pointer"
                id="theme-customizer-toggle"
                title="Style customizer setting controls"
              >
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                <span>Theme</span>
              </button>

              {customizerOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-2xl z-50 text-left"
                  id="customizer-picker-dropdown"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span className="text-[11px] font-mono font-black text-[var(--accent)] uppercase tracking-wider">Vortex Style engine</span>
                    </div>
                    <button 
                      onClick={() => setCustomizerOpen(false)}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent)] p-1 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mode Selector Option Blocks */}
                  <div className="flex gap-2 p-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg mb-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                        theme === 'light' 
                          ? 'bg-[var(--accent)] text-[var(--btn-text)] shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      White Theme
                    </button>
                    <button
                      onClick={() => setTheme('custom')}
                      className={`flex-1 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                        theme === 'custom' 
                          ? 'bg-[var(--accent)] text-[var(--btn-text)] shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Custom Theme
                    </button>
                  </div>

                  {/* Dynamic Instructions */}
                  <p className="text-[11px] text-[var(--text-secondary)] leading-normal mb-4">
                    {theme === 'light' 
                      ? 'Currently running our default clean white workspace. Tap "Custom Theme" to reveal precise color pickers for layout customization!'
                      : '🎨 custom theme active! Tap each color block below to pick unique colors for each element:'}
                  </p>

                  {/* Labeled custom picker inputs */}
                  {theme === 'custom' ? (
                    <div className="flex flex-col gap-3">
                      
                      {/* Background option selector */}
                      <div className="flex items-center justify-between gap-3 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border)]">
                        <div className="text-left">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Background</label>
                          <span className="text-[9px] text-[var(--text-secondary)] block">Main application canvas</span>
                        </div>
                        <input 
                          type="color" 
                          value={customBg} 
                          onChange={(e) => setCustomBg(e.target.value)} 
                          className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                          title="Choose background color"
                        />
                      </div>

                      {/* Text color option selector */}
                      <div className="flex items-center justify-between gap-3 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border)]">
                        <div className="text-left">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Text Color</label>
                          <span className="text-[9px] text-[var(--text-secondary)] block">Main headings & bios</span>
                        </div>
                        <input 
                          type="color" 
                          value={customText} 
                          onChange={(e) => setCustomText(e.target.value)} 
                          className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                          title="Choose text color"
                        />
                      </div>

                      {/* Highlight Accent color option selector */}
                      <div className="flex items-center justify-between gap-3 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border)]">
                        <div className="text-left">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Accent Color</label>
                          <span className="text-[9px] text-[var(--text-secondary)] block">Buttons, lines, overlays</span>
                        </div>
                        <input 
                          type="color" 
                          value={customAccent} 
                          onChange={(e) => setCustomAccent(e.target.value)} 
                          className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                          title="Choose accent color"
                        />
                      </div>

                      {/* Card block color option selector */}
                      <div className="flex items-center justify-between gap-3 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border)]">
                        <div className="text-left">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Card Color</label>
                          <span className="text-[9px] text-[var(--text-secondary)] block">Roster & resource cards</span>
                        </div>
                        <input 
                          type="color" 
                          value={customCardBg} 
                          onChange={(e) => setCustomCardBg(e.target.value)} 
                          className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                          title="Choose card background color"
                        />
                      </div>

                      {/* Thin grid lines / separator borders option selector */}
                      <div className="flex items-center justify-between gap-3 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border)]">
                        <div className="text-left">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Borders Color</label>
                          <span className="text-[9px] text-[var(--text-secondary)] block">Subtle card outlines</span>
                        </div>
                        <input 
                          type="color" 
                          value={customBorder} 
                          onChange={(e) => setCustomBorder(e.target.value)} 
                          className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                          title="Choose borders color"
                        />
                      </div>

                      {/* Presets Grid */}
                      <div className="border-t border-[var(--border)] pt-2.5 mt-1 text-left">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-bold block mb-1.5 text-center">Fast Theme Presets:</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => {
                              setCustomBg('#0a0a23');
                              setCustomText('#ffffff');
                              setCustomAccent('#00f0ff');
                              setCustomCardBg('#131338');
                              setCustomBorder('#2563eb');
                            }}
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#131338] border border-[#2563eb] text-[#00f0ff] rounded hover:opacity-90"
                          >
                            Cosmos
                          </button>
                          <button
                            onClick={() => {
                              setCustomBg('#07080a');
                              setCustomText('#1ed760');
                              setCustomAccent('#ffffff');
                              setCustomCardBg('#12161a');
                              setCustomBorder('#334155');
                            }}
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#12161a] border border-zinc-700 text-[#1ed760] rounded hover:opacity-90"
                          >
                            Emerald
                          </button>
                          <button
                            onClick={() => {
                              setCustomBg('#1e1b4b');
                              setCustomText('#fdf4ff');
                              setCustomAccent('#f0abfc');
                              setCustomCardBg('#312e81');
                              setCustomBorder('#4338ca');
                            }}
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#312e81] border border-indigo-500 text-[#f5f3ff] rounded hover:opacity-90"
                          >
                            Nebula
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center p-3 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-primary)]">
                      <span className="text-[10px] uppercase font-mono text-[var(--accent)] font-bold tracking-wide">Ready for customization</span>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-6 py-4 flex flex-col gap-3 md:hidden transition-all duration-200" id="mobile-menu-drawer">
            {pages.map((p) => {
              const isSelected = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => navigateTo(p.id)}
                  className={`text-sm font-bold uppercase tracking-wider py-3 text-left transition-all ${
                    isSelected
                      ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] pl-3'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)] pl-3'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              onClick={() => navigateTo('contact')}
              className="mt-2 w-full text-center rounded-md py-3 text-xs font-bold uppercase tracking-widest text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition duration-150"
            >
              Get In Touch
            </button>
          </div>
        )}
      </nav>

      {/* Main Pages Switcher */}
      <main className="flex-grow bg-[var(--bg-primary)]">
        
        {/* Render HOME segment */}
        {activePage === 'home' && (
          <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-16" id="home-page-view">
            
            {/* Central High-Fidelity Branding Banner Matching Image Style Exactly */}
            <div className="relative text-center py-16 px-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] overflow-hidden flex flex-col items-center justify-center shadow-md transition duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)]"></div>
              
              {/* Massive Logo Frame matching vertical branding */}
              <div className="mb-6 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-[var(--accent)]/15 rounded-2xl blur-lg"></div>
                  <img 
                    src={vortexLogo} 
                    alt="Vortex Team Emblem" 
                    className="relative h-28 w-28 object-contain transition duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="font-sans text-4xl md:text-5xl font-black tracking-[0.25em] text-[var(--text-primary)] uppercase mt-2 leading-none">
                  VORTEX
                </h1>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] tracking-wide max-w-md mx-auto leading-relaxed uppercase">
                FTC Team #00000 • Custom Engineering, High-Precision Dynamics, and Community-First Science and Technology Kampaigns.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigateTo('team')}
                  className="rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition duration-150 cursor-pointer"
                >
                  Meet The Crew
                </button>
                <button 
                  onClick={() => navigateTo('sponsors')}
                  className="rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition duration-150 bg-transparent cursor-pointer"
                >
                  Sponsor Portal
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Render TEAM/ROSTER segment with photo located directly underneath description */}
        {activePage === 'team' && (
          <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-12" id="team-page-view">
            
            {/* Students Section */}
            <div className="flex flex-col gap-8">
              {/* Header section with department title */}
              <div className="border-b border-[var(--border)] pb-6 text-left">
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">The Crew</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Meet Team Vortex</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                  A community of high school builders, software developers, and outreach leaders custom manufacturing robotics for FTC competition.
                </p>
              </div>

              {/* Grid of multiple people */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.filter(member => member.department !== 'Mentors').map((member) => {
                  const placeholderPhoto = portraits[member.id] || `https://picsum.photos/seed/${member.name}/600/450`;
                  return (
                    <div 
                      key={member.id} 
                      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left"
                      id={`team-member-card-${member.id}`}
                    >
                      <div className="flex flex-col gap-4">
                        {/* Name, Role & Department Tag */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
                              {member.department}
                            </span>
                          </div>
                          <h4 className="font-sans text-lg font-black tracking-wide text-[var(--text-primary)] uppercase mt-1">
                            {member.name}
                          </h4>
                          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                            {member.role}
                          </span>
                        </div>

                        {/* Description / Bio */}
                        <p className="text-xs leading-relaxed text-[var(--text-secondary)] min-h-[50px]">
                          {member.bio}
                        </p>

                        {/* Photo directly underneath their description (as explicitly requested!) */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] group">
                          <img 
                            src={placeholderPhoto} 
                            alt={`Portrait of ${member.name}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* FIRST Experience Animated odometer */}
                        <FIRSTExperienceSpinner targetYears={member.yearsExperience || 0} />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Mentors Section */}
            <div className="flex flex-col gap-8 mt-4">
              {/* Header section for Mentors */}
              <div className="border-b border-[var(--border)] pb-6 text-left">
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Guidance</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Mentors & Advisors</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                  Industry professional advisors and math/science educators guiding our fabrication techniques and engineering design processes.
                </p>
              </div>

              {/* Grid of Mentors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 'm1',
                    name: 'Coach Elena Rostova',
                    role: 'Lead Technical Mentor',
                    department: 'Coaching',
                    bio: 'With over 10 years of aerospace engineering experience, Elena teaches Vortex structural math, electrical safety, and industrial CAD standards.',
                    photo: portraits['6'] || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=450',
                    yearsExperience: 8
                  },
                  {
                    id: 'm2',
                    name: 'Dr. Arthur Pendleton',
                    role: 'Control Theory Consultant',
                    department: 'Advisory',
                    bio: 'Arthur is an associate professor of engineering who guides our developers on advanced sensor fusion matrices and smooth acceleration pathing curves.',
                    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=450',
                    yearsExperience: 5
                  },
                  {
                    id: 'm3',
                    name: 'Sarah Vance',
                    role: 'Sponsorship & Outreach Advisor',
                    department: 'Business Advisory',
                    bio: 'Sarah coaches the design team on budgeting, industry partner presentations, public speaking, and building a sustainable high school robotics brand.',
                    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=450',
                    yearsExperience: 4
                  },
                  {
                    id: 'm4',
                    name: 'Marcus Chen',
                    role: 'Manufacturing & Machining Mentor',
                    department: 'Fabrication',
                    bio: 'A veteran machinist and shop owner who teaches safe operation of CNC routers, manual lathe operations, and close-tolerance chassis fabrication.',
                    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=450',
                    yearsExperience: 6
                  },
                  {
                    id: 'm5',
                    name: 'Dr. Lisa Sterling',
                    role: 'Software & Logic Advisor',
                    department: 'Programming',
                    bio: 'A research systems software architect who guides the programming sub-division in thread-safe multi-threading, custom telemetry loops, and vision processing filters.',
                    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=450',
                    yearsExperience: 7
                  }
                ].map((mentor) => (
                  <div 
                    key={mentor.id} 
                    className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left"
                    id={`mentor-card-${mentor.id}`}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Name, Role & Department Tag */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
                            {mentor.department}
                          </span>
                          <span className="font-mono text-xs text-[var(--text-secondary)]">Advisor</span>
                        </div>
                        <h4 className="font-sans text-lg font-black tracking-wide text-[var(--text-primary)] uppercase mt-1">
                          {mentor.name}
                        </h4>
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                          {mentor.role}
                        </span>
                      </div>

                      {/* Description / Bio */}
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)] min-h-[50px]">
                        {mentor.bio}
                      </p>

                      {/* Photo directly underneath their description (exactly matching student card layout!) */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] group">
                        <img 
                          src={mentor.photo} 
                          alt={`Portrait of ${mentor.name}`}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* FIRST Experience Animated odometer */}
                      <FIRSTExperienceSpinner targetYears={mentor.yearsExperience || 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Render JOURNEY/TIMELINE + BLOGS segment with vertical chronological timeline */}
        {activePage === 'journey' && (
          <div className="mx-auto max-w-4xl px-6 py-12 flex flex-col gap-10" id="journey-page-view">
            <div className="border-b border-[var(--border)] pb-6 text-left">
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Our Timeline</span>
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Our Journey</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                A historical record of our robotics seasons, hardware fabrication sprints, and championship qualifier runs.
              </p>
            </div>

            {/* Vertical Roadmap Line */}
            <div className="relative border-l border-[var(--border)] ml-4 md:ml-6 flex flex-col gap-10 py-4">
              {[
                {
                  id: 1,
                  date: 'Summer 2026',
                  event: 'Team Inception & Recruitment',
                  badge: 'Rookie Stage',
                  desc: 'Officially launched Team Vortex as a Texas FTC competitor! Recruited high-school builders, developers, and notebook writers eager to learn.'
                },
                {
                  id: 2,
                  date: 'August 2026',
                  event: 'Safety Drills & OnShape CAD Sprints',
                  badge: 'Preparation',
                  desc: 'Conducted rigorous pre-season workshops on safe shop CNC machining, lathe operations, and advanced 3D parts sketching.'
                },
                {
                  id: 3,
                  date: 'September 2026',
                  event: 'FTC Season Global Kickoff',
                  badge: 'Upcoming Kickoff',
                  desc: 'The minute the official game parameters are released, our constructors will map grid geometry and prototype theoretical intake systems!'
                },
                {
                  id: 4,
                  date: 'Late 2026',
                  event: 'Custom Drive Base Integration',
                  badge: 'Upcoming Build',
                  desc: 'Custom milling of lightweight chassis plates and writing initial pinpoint three-wheel odometry algorithms for control loops.'
                },
                {
                  id: 5,
                  date: 'Early 2027',
                  event: 'Inaugural Tournament Qualifiers',
                  badge: 'Rookie Goal',
                  desc: 'Rolling our competition machine onto the layout field for our first-ever official Texas district qualifier matches. Proudly fresh without any previous run logs or award histories, focused wholly on discovery!'
                }
              ].map((milestone) => (
                <div key={milestone.id} className="relative pl-8 md:pl-10 group">
                  {/* Dot Marker */}
                  <div className="absolute -left-[9px] top-1.5 h-[17px] w-[17px] rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:scale-125 group-hover:shadow-[0_0_10px_var(--accent)]" />
                  
                  {/* Content card */}
                  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 transition hover:border-[var(--accent)]/30 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                      <span className="font-mono text-xs text-[var(--accent)] font-extrabold">{milestone.date}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">{milestone.badge}</span>
                    </div>
                    <h4 className="font-sans text-md font-extrabold text-[var(--text-primary)] uppercase group-hover:text-[var(--accent)] transition-colors">{milestone.event}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render SPONSORS segment with animated automatic image slideshow and interactive typing button */}
        {activePage === 'sponsors' && (
          <div className="mx-auto max-w-4xl px-6 py-12 flex flex-col gap-12" id="sponsors-page-view">
            <div className="border-b border-[var(--border)] pb-6 text-center">
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Our Supporters</span>
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Vortex Sponsors</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl mx-auto">
                Without our generous corporate partners and mechanical advisors, custom sheet routing and national qualifiers would not be possible.
              </p>
            </div>

            {/* Premium Autoplay/Manual Slideshow */}
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden text-left" id="sponsors-slideshow">
              <div className="absolute top-4 right-4 bg-[var(--bg-primary)]/80 border border-[var(--border)] px-2 py-1 rounded text-[10px] font-mono text-[var(--accent)] uppercase tracking-wider">
                Industrial Showcase
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                {/* Logo Image */}
                <div className="w-full md:w-1/2 aspect-[16/10] bg-[var(--bg-primary)]/45 border border-[var(--border)] rounded-xl overflow-hidden relative group flex items-center justify-center shrink-0">
                  <img 
                    src={sponsorLogos[currentSlide].logo} 
                    alt={sponsorLogos[currentSlide].name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[9px] font-mono font-black text-[var(--accent)] tracking-wider uppercase">
                      {sponsorLogos[currentSlide].tier}
                    </span>
                  </div>
                </div>

                {/* Slideshow metadata */}
                <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                  <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest block">Corporate Champion</span>
                  <h3 className="text-xl font-black text-[var(--text-primary)] uppercase mt-1">
                    {sponsorLogos[currentSlide].name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed min-h-[50px]">
                    {sponsorLogos[currentSlide].desc}
                  </p>

                  {/* Manual trigger controllers */}
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex gap-1.5">
                      {sponsorLogos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-[var(--accent)]' : 'w-2 bg-[var(--border)]'}`}
                          title={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2 ml-auto">
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? sponsorLogos.length - 1 : prev - 1))}
                        className="p-1.5 rounded bg-[var(--bg-primary)] hover:bg-[var(--accent)]/15 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition cursor-pointer"
                        title="Prior slide"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % sponsorLogos.length)}
                        className="p-1.5 rounded bg-[var(--bg-primary)] hover:bg-[var(--accent)]/15 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition cursor-pointer"
                        title="Next slide"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typewriter Styled Big Sponsor Interest button */}
            <div className="flex flex-col items-center gap-4 py-6 border-y border-[var(--border)] text-center">
              <span className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider block">Join Team Vortex as a corporate affiliate</span>
              <button
                onClick={() => navigateTo('contact')}
                className="w-full max-w-xl group relative overflow-hidden rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-primary)] py-5 px-6 font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)] shadow-2xl transition duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] active:scale-98 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1 min-h-[22px]">
                  <span>{sponsorText}</span>
                  <span className="w-1.5 h-3.5 bg-[var(--accent)] animate-pulse shrink-0 inline-block align-middle" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Render RESOURCES segment */}
        {activePage === 'resources' && (
          <div className="mx-auto max-w-4xl px-6 py-12 flex flex-col gap-12" id="resources-page-view">
            
            {/* Hero Centered Section */}
            <div className="text-center pb-6 border-b border-[var(--border)] flex flex-col items-center">
              <span className="text-[10px] font-black tracking-[0.25em] text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-md mb-3">
                FTC Standard Control Ecosystem
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-wide uppercase">
                Pedro Pathing Hub
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
                Configure your pathing architectures, bezier spline controllers, and coordinates of Vortex. Complete with 10 customizable resource decks.
              </p>
            </div>

            {/* Grid of 10 Dummy Resource placeholders styled with live theme variables */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { id: 1, name: 'Pedro Pathing Setup', desc: 'Core library installation script to drive Mecanum drivetrains with sub-millimeter trajectory accuracy.' },
                { id: 2, name: 'Polynomial Integrator', desc: 'Mathematical solver to calibrate bezier curves and acceleration profile coefficients.' },
                { id: 3, name: 'Bezier Curve Plottings', desc: 'Virtual coordinate plot scripts to simulate path curves directly on high-performance canvases.' },
                { id: 4, name: 'Odometry Wheel Calibration', desc: 'Adjust dead-wheel encoder ticks per revolution to assure absolute real-time positioning feedback.' },
                { id: 5, name: 'Linear Velocity Controller', desc: 'PID feedforward tuning configurations to control acceleration steps during auto cycles.' },
                { id: 6, name: 'Tangent Angle Matrices', desc: 'Verify tangent vectors when driving backwards during intricate cone intake cycles.' },
                { id: 7, name: 'Braking Distance Optimizer', desc: 'Configure motor voltage braking routines to stop precisely in front of high-junction grids.' },
                { id: 8, name: 'Error Tolerance Modifier', desc: 'Adaptive feedback correction bounds to trigger dynamic replanning during high speed crashes.' },
                { id: 9, name: 'Telemetry Log Dump', desc: 'Store local debugging coordinate arrays directly within the REV Control Hub flash modules.' },
                { id: 10, name: 'Sensor Fusion Matrix', desc: 'Incorporate Pinpoint hub encoders together with modern IMU gyroscopes for angle correction.' }
              ].map((dummy) => (
                <div 
                  key={dummy.id}
                  className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-colors shrink-0">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{dummy.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 pr-1 leading-relaxed">{dummy.desc}</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer">
                    <span>EDIT PATH LINK</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Our Resources Subsection with exactly 5 custom helper cards */}
            <div className="border-t border-[var(--border)] pt-12 flex flex-col gap-6">
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Shared Assets</span>
                <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase">Our Resources</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Download engineering booklets, presentation templates, and custom driver configs developed by Team Vortex.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { name: 'OnShape CAD Workspace', icon: Box, desc: 'Complete 3D CAD modeling file directory of the Vortex competition robot. Open-source workspace.' },
                  { name: 'Engineering Portfolio PDF', icon: BookOpen, desc: 'The verified portfolio notebook document submitted during regional Inspire Award design reviews.' },
                  { name: 'Driver Station Config File', icon: Terminal, desc: 'Telemetry dashboard layouts, button mapping parameters, and gamepad profiles for rapid operator execution.' },
                  { name: 'Community Outreach Slide Deck', icon: Users, desc: 'Outreach workshop slides, robotics demo booklets, and safety sheets prepared for middle school STEM labs.' },
                  { name: 'Sponsorship Pitch Toolkit', icon: Handshake, desc: 'The official visual presentations shared during business sponsor evaluations showcasing resource budgeting.' }
                ].map((item, index) => {
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left"
                    >
                      <div className="h-10 w-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-colors shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{item.name}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-auto pt-2 flex items-center text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer">
                        <span>ACCESS DOCUMENT</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Render CONTACT segment */}
        {activePage === 'contact' && (
          <div className="mx-auto max-w-3xl px-6 py-24 min-h-[400px]" id="contact-page-view">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 max-w-xl mx-auto shadow-xl text-left">
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block">Inquire</span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase mt-1">Get In Touch</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 mb-6">
                Are you a local business owner looking to sponsor, a school wishing for safety demonstrations, or a student wanting to join Vortex? Drop our captain a line!
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert("Vortex received your message! We will get back to you within 24 hours."); }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Your Name</label>
                  <input required type="text" className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="Alex Smith" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Your Email</label>
                  <input required type="email" className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="alex@example.com" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Message Detail</label>
                  <textarea required rows={4} className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="Let us know what you want to collaborate on..." />
                </div>
                <button type="submit" className="w-full rounded-md py-3 text-xs font-bold uppercase tracking-widest text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition cursor-pointer">
                  Dispatch Message
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Spacious Custom Designed Dual-Tired Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] pt-16 pb-12 transition duration-300 text-left">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-12">
          
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Column 1: Branding & Rookie Status */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div 
                onClick={() => navigateTo('home')} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img 
                  src={vortexLogo} 
                  alt="Vortex Team Badge" 
                  className="h-10 w-10 object-contain transition duration-200 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="font-sans text-xs font-black tracking-[0.2em] text-[var(--text-primary)] uppercase">
                  VORTEX
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed pr-6 mt-1">
                As a newly established rookie FTC robotics team based in Texas, Team Vortex is dedicated to teaching mechanical CAD modeling, computer science trajectory math, and advanced electronics. We are starting our journey completely from scratch as a brand new team soon without any previous runs or awards yet, focusing entirely on deep learning, student leadership, and high precision custom engineering!
              </p>
            </div>

            {/* Columns 2-4: Structured Navigation Directories */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Directory 1 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
                  Explore Hub
                </span>
                <div className="flex flex-col gap-25 text-xs text-[var(--text-secondary)]">
                  <button onClick={() => navigateTo('home')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer">Main Home</button>
                  <button onClick={() => navigateTo('team')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer">Meet Crew</button>
                  <button onClick={() => navigateTo('gallery')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer font-bold">Media Gallery</button>
                </div>
              </div>

              {/* Directory 2 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
                  Rookie Intel
                </span>
                <div className="flex flex-col gap-25 text-xs text-[var(--text-secondary)]">
                  <button onClick={() => navigateTo('journey')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer font-bold">Inaugural Journey</button>
                  <button onClick={() => navigateTo('sponsors')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer">Sponsors Portal</button>
                  <button onClick={() => navigateTo('resources')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer">Engineering Decks</button>
                </div>
              </div>

              {/* Directory 3 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
                  Inquire
                </span>
                <div className="flex flex-col gap-25 text-xs text-[var(--text-secondary)]">
                  <button onClick={() => navigateTo('contact')} className="hover:text-[var(--text-primary)] transition text-left cursor-pointer">Connect With Us</button>
                  <span className="text-[11px] text-[var(--text-secondary)] tracking-wide">Texas Region — FTC Team</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom division footer status */}
          <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <p className="text-[11px] text-[var(--text-secondary)] text-center md:text-left">
              © {new Date().getFullYear()} Vortex Robotics. All Rights Reserved. FTC Team #00000 • TX Rookie Initiative.
            </p>

            {/* Social circular hovering links */}
            <div className="flex items-center gap-3">
              {[
                { name: 'Spotify Playlist Tracker', href: 'https://open.spotify.com', outlineColor: 'hover:border-green-500/30 text-green-400', path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.745-.47-.077-.337.135-.668.47-.745 3.856-.88 7.15-.51 9.812 1.12.296.18.387.563.207.857zm1.226-2.724c-.226.367-.71.486-1.077.26-2.72-1.672-6.87-2.155-10.076-1.182-.412.125-.845-.107-.97-.52-.125-.412.107-.845.52-.97 3.666-1.112 8.232-.577 11.343 1.336.368.226.486.71.26 1.076zm.105-2.81c-3.262-1.937-8.644-2.115-11.758-1.17-.5.152-1.025-.133-1.177-.633-.15-.5.133-1.025.633-1.177 3.59-1.09 9.53-.883 13.292 1.35.454.27.604.856.335 1.31-.27.454-.856.604-1.31.335z" },
                { name: 'YouTube Guides', href: 'https://youtube.com', outlineColor: 'hover:border-red-500/30 text-red-500', path: "M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.52 3.545 12 3.545 12 3.545s-7.52 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.48 20.455 12 20.455 12 20.455s7.52 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { name: 'Discord Community', href: 'https://discord.gg', outlineColor: 'hover:border-indigo-500/30 text-indigo-400', path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.67 4.37a.07.07 0 0 0-.034.027C.53 9.16-.309 13.825.1 18.361a.08.08 0 0 0 .03.056 19.909 19.909 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.96a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" },
                { name: 'Instagram Capture Reels', href: 'https://instagram.com', outlineColor: 'hover:border-pink-500/30 text-pink-500', path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
                { name: 'GitHub Workspace Codebase', href: 'https://github.com', outlineColor: 'hover:border-zinc-500/30 text-[var(--accent)]', path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }
              ].map((s) => (
                <a 
                  key={s.name}
                  href={s.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] ${s.outlineColor} hover:bg-[var(--accent)]/5 hover:scale-105 transition-all duration-300`}
                  title={`Vortex ${s.name}`}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}

