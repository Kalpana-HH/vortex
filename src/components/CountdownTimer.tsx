import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Check } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  // Configurable first competition date (e.g., Dec 12, 2026)
  const [targetDateStr, setTargetDateStr] = useState('2026-12-12T09:00:00');
  const [isEditing, setIsEditing] = useState(false);
  const [inputDate, setInputDate] = useState('2026-12-12');
  const [inputTime, setInputTime] = useState('09:00');

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOver, setIsOver] = useState(false);

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
    if (inputDate) {
      setTargetDateStr(`${inputDate}T${inputTime || '00:00'}:00`);
      setIsEditing(false);
    }
  };

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl transition-all duration-300 shadow-sm dark:border-slate-800 dark:bg-slate-900/60" id="live-countdown">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5"></div>

      <div className="flex flex-col gap-4">
        {/* Countdown Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h3 className="font-sans text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              FTC State Qualifier Countdown
            </h3>
          </div>

          <button
            onClick={() => {
              if (!isEditing) {
                const [date, time] = targetDateStr.split('T');
                setInputDate(date);
                setInputTime(time.substring(0, 5));
              }
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            id="btn-edit-target"
            title="Configure target date"
          >
            {isEditing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit className="h-3.5 w-3.5" />
                <span>Configure</span>
              </>
            )}
          </button>
        </div>

        {/* Date Selector form */}
        {isEditing && (
          <form onSubmit={handleSaveDate} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 p-4 transition-all" id="configure-date-form">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Date</label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-sans outline-none focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Time</label>
              <input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-sans outline-none focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-500 active:scale-95 transition-all outline-none"
              id="submit-countdown-date"
            >
              Apply Target
            </button>
          </form>
        )}

        {/* Timer Cards */}
        {isOver ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-8 w-8 text-cyan-500 animate-bounce" />
            <span className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              Competing Live right now!
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The counter expired for {new Date(targetDateStr).toLocaleDateString()}. Wish us luck!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {/* Days Card */}
            <div className="flex flex-col items-center rounded-xl bg-slate-50/70 p-3 sm:p-4 text-center border border-slate-100/50 shadow-sm dark:bg-slate-950/40 dark:border-slate-850/30">
              <span className="font-mono text-3xl font-extrabold text-cyan-600 sm:text-4xl dark:text-cyan-400">
                {padZero(timeLeft.days)}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Days
              </span>
            </div>

            {/* Hours Card */}
            <div className="flex flex-col items-center rounded-xl bg-slate-50/70 p-3 sm:p-4 text-center border border-slate-100/50 shadow-sm dark:bg-slate-950/40 dark:border-slate-850/30">
              <span className="font-mono text-3xl font-extrabold text-indigo-600 sm:text-4xl dark:text-indigo-400">
                {padZero(timeLeft.hours)}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Hours
              </span>
            </div>

            {/* Minutes Card */}
            <div className="flex flex-col items-center rounded-xl bg-slate-50/70 p-3 sm:p-4 text-center border border-slate-100/50 shadow-sm dark:bg-slate-950/40 dark:border-slate-850/30">
              <span className="font-mono text-3xl font-extrabold text-purple-600 sm:text-4xl dark:text-purple-400">
                {padZero(timeLeft.minutes)}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Minutes
              </span>
            </div>

            {/* Seconds Card */}
            <div className="flex flex-col items-center rounded-xl bg-slate-50/70 p-3 sm:p-4 text-center border border-slate-100/50 shadow-sm dark:bg-slate-950/40 dark:border-slate-850/30">
              <span className="font-mono text-3xl font-extrabold text-rose-500 sm:text-4xl dark:text-rose-400">
                {padZero(timeLeft.seconds)}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Seconds
              </span>
            </div>
          </div>
        )}

        {/* Display Current Target Date */}
        <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          Target Qualifier Event: <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(targetDateStr).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </p>
      </div>
    </div>
  );
}
