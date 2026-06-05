import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const vortexLogo = '/src/assets/images/vortex_logo_1780695925306.png';

type PageID = 'home' | 'team' | 'journey' | 'sponsors' | 'resources' | 'contact';

interface PageItem {
  id: PageID;
  label: string;
}

export default function App() {
  const [activePage, setActivePage] = useState<PageID>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages: PageItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'team', label: 'Roster' },
    { id: 'journey', label: 'Our journey' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' }
  ];

  const navigateTo = (pageId: PageID) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000035] text-white font-sans flex flex-col justify-between selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
      
      {/* High-End Design Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-[#2563EB]/20 bg-[#000035]/95 backdrop-blur-sm">
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
            <span className="font-sans text-[10px] font-black tracking-[0.2em] text-white uppercase mt-1 transition duration-200 group-hover:text-[#00F0FF]">
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
                      ? 'text-[#00F0FF]'
                      : 'text-[#8892B0] hover:text-[#00F0FF]'
                  }`}
                  id={`nav-link-${p.id}`}
                >
                  <span>{p.label}</span>
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00F0FF]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Solid CTAs and controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('contact')}
              className="hidden sm:inline-block rounded-md px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#000035] bg-[#00F0FF] hover:bg-[#00F0FF]/90 active:scale-98 transition duration-200 cursor-pointer"
              id="cta-nav-button"
            >
              Get In Touch
            </button>
            
            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#2563EB]/30 bg-[#080845] md:hidden cursor-pointer text-[#8892B0] hover:text-[#00F0FF] transition duration-150"
              title="Toggle Navigation Menu"
              id="mobile-navigation-trigger"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#2563EB]/20 bg-[#000035] px-6 py-4 flex flex-col gap-3 md:hidden transition-all duration-200" id="mobile-menu-drawer">
            {pages.map((p) => {
              const isSelected = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => navigateTo(p.id)}
                  className={`text-sm font-bold uppercase tracking-wider py-3 text-left transition-all ${
                    isSelected
                      ? 'text-[#00F0FF] border-l-2 border-[#00F0FF] pl-3'
                      : 'text-[#8892B0] hover:text-[#00F0FF] pl-3'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              onClick={() => navigateTo('contact')}
              className="mt-2 w-full text-center rounded-md py-3 text-xs font-bold uppercase tracking-widest text-[#000035] bg-[#00F0FF] hover:bg-[#00F0FF]/90 transition duration-150"
            >
              Get In Touch
            </button>
          </div>
        )}
      </nav>

      {/* Main Pages Switcher */}
      <main className="flex-grow bg-[#000035]">
        
        {/* Render HOME segment */}
        {activePage === 'home' && (
          <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-16" id="home-page-view">
            
            {/* Central High-Fidelity Branding Banner Matching Image Style Exactly */}
            <div className="relative text-center py-16 px-8 rounded-2xl bg-[#080845] border border-[#2563EB]/15 overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB]"></div>
              
              {/* Massive Logo Frame matching vertical branding */}
              <div className="mb-6 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-[#00F0FF]/15 rounded-2xl blur-lg"></div>
                  <img 
                    src={vortexLogo} 
                    alt="Vortex Team Emblem" 
                    className="relative h-28 w-28 object-contain transition duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="font-sans text-4xl md:text-5xl font-black tracking-[0.25em] text-white uppercase mt-2 leading-none">
                  VORTEX
                </h1>
              </div>
              


              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigateTo('team')}
                  className="rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#000035] bg-[#00F0FF]"
                >
                  Meet The Crew
                </button>
                <button 
                  onClick={() => navigateTo('sponsors')}
                  className="rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-wider border border-[#2563EB]/40 hover:border-[#00F0FF] transition duration-150"
                >
                  Sponsor Portal
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Render TEAM/ROSTER segment (Emptied as requested) */}
        {activePage === 'team' && (
          <div className="mx-auto max-w-6xl px-6 py-24 min-h-[400px]" id="team-page-view" />
        )}

        {/* Render JOURNEY/TIMELINE + BLOGS segment (Emptied as requested) */}
        {activePage === 'journey' && (
          <div className="mx-auto max-w-6xl px-6 py-24 min-h-[400px]" id="journey-page-view" />
        )}

        {/* Render SPONSORS segment (Emptied as requested) */}
        {activePage === 'sponsors' && (
          <div className="mx-auto max-w-6xl px-6 py-24 min-h-[400px]" id="sponsors-page-view" />
        )}

        {/* Render RESOURCES segment (Emptied as requested) */}
        {activePage === 'resources' && (
          <div className="mx-auto max-w-6xl px-6 py-24 min-h-[400px]" id="resources-page-view" />
        )}

        {/* Render CONTACT segment (Emptied as requested) */}
        {activePage === 'contact' && (
          <div className="mx-auto max-w-3xl px-6 py-24 min-h-[400px]" id="contact-page-view" />
        )}

      </main>

      {/* Aesthetic High-Contrast Footer */}
      <footer className="border-t border-[#2563EB]/15 bg-[#000035] py-12">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <img 
              src={vortexLogo} 
              alt="Vortex logo badge" 
              className="h-8 w-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-sans text-[9px] font-black tracking-[0.15em] text-white uppercase mt-0.5">
              VORTEX
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#8892B0]">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition">Home</button>
            <button onClick={() => navigateTo('team')} className="hover:text-white transition">Roster</button>
            <button onClick={() => navigateTo('journey')} className="hover:text-white transition">Journey</button>
            <button onClick={() => navigateTo('sponsors')} className="hover:text-white transition">Sponsors</button>
            <button onClick={() => navigateTo('resources')} className="hover:text-white transition">Resources</button>
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition">Contact</button>
          </div>

          <p className="text-[10px] text-[#8892B0] text-center md:text-right">
            © {new Date().getFullYear()} Vortex Robotics. All Rights Reserved. FTC Team #00000.
          </p>
        </div>
      </footer>

    </div>
  );
}

