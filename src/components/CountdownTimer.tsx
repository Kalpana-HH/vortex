import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Check, Award, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  isUnlocked?: boolean;
}

export default function CountdownTimer({ isUnlocked = false }: CountdownTimerProps) {
  // Configurable event details with persistence
  const [eventTitle, setEventTitle] = useState(() => {
    return localStorage.getItem('vortex_countdown_event_title') || 'FTC State Qualifier';
  });
  const [targetDateStr, setTargetDateStr] = useState(() => {
    return localStorage.getItem('vortex_countdown_target_date') || '2026-12-12T09:00:00';
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(eventTitle);
  const [inputDate, setInputDate] = useState('2026-12-12');
  const [inputTime, setInputTime] = useState('09:00');

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOver, setIsOver] = useState(false);

  // Initialize input dates from saved state
  useEffect(() => {
    const [date, time] = targetDateStr.split('T');
    setInputDate(date || '2026-12-12');
    setInputTime(time ? time.substring(0, 5) : '09:00');
  }, [targetDateStr]);

  // Main countdown calculation loop
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsOver(true);
        return;
      }

      setIsOver(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputDate && inputTitle.trim()) {
      const newTargetStr = `${inputDate}T${inputTime || '00:00'}:00`;
      setTargetDateStr(newTargetStr);
      setEventTitle(inputTitle.trim());
      localStorage.setItem('vortex_countdown_target_date', newTargetStr);
      localStorage.setItem('vortex_countdown_event_title', inputTitle.trim());
      setIsEditing(false);
    }
  };

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 md:p-8 backdrop-blur-xl transition-all duration-300 shadow-md text-left" 
      id="live-countdown"
    >
      {/* Background radial soft light gradient */}
      <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[80px]"></div>
      <div className="absolute -left-20 -bottom-20 -z-10 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-[80px]"></div>

      <div className="flex flex-col gap-6">
        {/* Countdown Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--accent)]"></span>
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Target Event Counter</span>
              <h3 className="font-sans text-lg font-black text-[var(--text-primary)] uppercase tracking-wide">
                {eventTitle}
              </h3>
            </div>
          </div>

          {/* Access-conditional Editing Mechanism */}
          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={() => {
                  if (!isEditing) {
                    setInputTitle(eventTitle);
                    const [date, time] = targetDateStr.split('T');
                    setInputDate(date);
                    setInputTime(time.substring(0, 5));
                  }
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black border border-[var(--accent)]/20 transition-all duration-200 cursor-pointer"
                id="btn-edit-target"
                title="Configure countdown"
              >
                {isEditing ? (
                  <>
                    <Check className="h-3.5 w-3.5 animate-pulse" />
                    <span>Cancel Customisation</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-3.5 w-3.5" />
                    <span>Config Event & Date</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Date Selector form */}
        <AnimatePresence>
          {isEditing && isUnlocked && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onSubmit={handleSaveDate} 
              className="flex flex-col gap-4 rounded-xl border border-dashed border-[var(--accent)]/30 bg-[var(--accent)]/[0.02] p-5 transition-all overflow-hidden" 
              id="configure-date-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono font-black uppercase text-[var(--text-secondary)]">What's Coming Up?</label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    required
                    placeholder="Event Title..."
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition duration-150"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono font-black uppercase text-[var(--text-secondary)]">Target Date</label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    required
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--accent)] transition duration-150"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono font-black uppercase text-[var(--text-secondary)]">Target Time (24h)</label>
                  <input
                    type="time"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    required
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--accent)] transition duration-150"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--accent)] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--btn-text)] hover:opacity-90 active:scale-95 transition-all outline-none cursor-pointer"
                  id="submit-countdown-date"
                >
                  Save Active Target
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Timer Cards */}
        {isOver ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-primary)]/40 animate-fadeIn" id="countdown-completed-state">
            <Award className="h-10 w-10 text-[var(--accent)] animate-bounce mb-2" />
            <span className="text-xl font-black text-[var(--text-primary)] uppercase tracking-wide">
              Competing Live!
            </span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mt-1 leading-relaxed">
              We have launched! The scheduled countdown target ({new Date(targetDateStr).toLocaleDateString()}) has officially been reached. Follow our live journey or send us high-performance wishes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-5">
            {/* Days Card */}
            <div className="flex flex-col items-center rounded-2xl bg-[var(--bg-primary)]/45 p-2 sm:p-5 text-center border border-[var(--border)] select-none hover:border-[var(--accent)]/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all duration-300">
              <span className="font-mono text-xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                {padZero(timeLeft.days)}
              </span>
              <span className="mt-1 text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase text-[var(--text-secondary)]">
                Days
              </span>
            </div>

            {/* Hours Card */}
            <div className="flex flex-col items-center rounded-2xl bg-[var(--bg-primary)]/45 p-2 sm:p-5 text-center border border-[var(--border)] select-none hover:border-[var(--accent)]/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all duration-300">
              <span className="font-mono text-xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                {padZero(timeLeft.hours)}
              </span>
              <span className="mt-1 text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase text-[var(--text-secondary)]">
                Hours
              </span>
            </div>

            {/* Minutes Card */}
            <div className="flex flex-col items-center rounded-2xl bg-[var(--bg-primary)]/45 p-2 sm:p-5 text-center border border-[var(--border)] select-none hover:border-[var(--accent)]/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all duration-300">
              <span className="font-mono text-xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                {padZero(timeLeft.minutes)}
              </span>
              <span className="mt-1 text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase text-[var(--text-secondary)]">
                Minutes
              </span>
            </div>

            {/* Seconds Card */}
            <div className="flex flex-col items-center rounded-2xl bg-[var(--bg-primary)]/50 p-2 sm:p-5 text-center border border-[var(--accent)]/30 select-none hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-[var(--accent)]/60 animate-pulse"></div>
              <span className="font-mono text-xl sm:text-3xl md:text-4xl font-extrabold text-[var(--accent)]">
                {padZero(timeLeft.seconds)}
              </span>
              <span className="mt-1 text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase text-[var(--accent)]">
                Seconds
              </span>
            </div>
          </div>
        )}

        {/* Footer Target Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-xs font-semibold text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Target Launch: <strong className="text-[var(--text-primary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-md font-mono">{new Date(targetDateStr).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
