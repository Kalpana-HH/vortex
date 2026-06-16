import React from 'react';
import { 
  Sparkles, 
  Lock, 
  Calendar
} from 'lucide-react';

export default function PortfolioHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="portfolios-page-view">
      
      {/* Page Header */}
      <div className="text-center pb-6 border-b border-[var(--border)] flex flex-col items-center">
        <span className="text-[10px] font-black tracking-[0.25em] text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-md mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
          GLOBAL FTC COMMUNITY HUB
        </span>
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-wide uppercase" id="portfolio-header-landmark">
          Engineering Portfolio Archives
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
          The central archive to discover, review, and exchange award-winning FTC engineering notebooks and portfolios built by leading minds across the globe.
        </p>
      </div>

      {/* Main Locked Frame Container (Fully blurred background, cannot interact, on top says Coming Soon!) */}
      <div className="relative border border-[var(--border)] rounded-2xl min-h-[500px] overflow-hidden bg-[var(--card-bg)]/20 flex items-center justify-center p-4">
        
        {/* Blurred underlay placeholder representing catalog columns - completely obscured */}
        <div className="absolute inset-0 w-full h-full filter blur-[18px] opacity-[0.08] pointer-events-none select-none grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1 border border-stone-700/50 bg-stone-900/30 rounded-xl" />
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-stone-700/50 bg-stone-900/30 rounded-xl p-6" />
            <div className="border border-stone-700/50 bg-stone-900/30 rounded-xl p-6" />
          </div>
        </div>

        {/* Foreground Coming Soon Overlay */}
        <div className="relative z-10 w-full max-w-md mx-auto bg-[var(--bg-primary)]/90 border border-[var(--accent)]/20 backdrop-blur-xl rounded-2xl p-8 md:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col items-center gap-6">
          
          {/* Glowing Lock Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-full filter blur-xl animate-pulse w-14 h-14" />
            <div className="h-14 w-14 bg-[var(--bg-primary)] border border-[var(--accent)]/30 rounded-full flex items-center justify-center text-[var(--accent)] shadow-lg z-10">
              <Lock className="h-6 w-6 stroke-[2]" />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] font-black text-[var(--accent)] bg-[var(--accent)]/10 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/20">
              Coming Soon!
            </span>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-wide mt-2">
              Archive Gateway Closed
            </h3>
          </div>

          {/* Locked status text */}
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
            Our global database sharing segment is presently locked for seasonal systems maintenance. Upload services and interactive notebook downloads will remain offline until the official regional release.
          </p>

          <hr className="w-full border-[var(--border)]/60" />

          {/* Timeline */}
          <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border)]/80 py-2.5 px-4 rounded-xl w-full justify-center">
            <Calendar className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-[10px] font-black tracking-wider uppercase text-[var(--text-secondary)] font-mono">
              Availability: <span className="text-[var(--text-primary)] font-bold">Fall Series v2 Release</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
