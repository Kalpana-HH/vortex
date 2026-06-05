import React, { useState } from 'react';
import { teamMembers } from '../data/team';
import { TeamMember } from '../types';
import { ShieldAlert, Quote, MessageSquareDot, Wrench, Cpu, Star, ExternalLink, Mail } from 'lucide-react';

export default function TeamCatalog() {
  const [activeDept, setActiveDept] = useState<string>('All');
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const departments = ['All', 'Mechanical', 'Software', 'Design & Outreach', 'Mentors'];

  const filteredMembers = teamMembers.filter((m) => {
    return activeDept === 'All' || m.department === activeDept;
  });

  return (
    <section className="relative scroll-mt-20 py-12" id="team-section">
      <div className="flex flex-col gap-8">
        
        {/* Module Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Star className="h-5 w-5 animate-spin-slow" />
            <span className="text-xs font-bold tracking-widest uppercase">The Brains and Builders</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Meet Team Vortex
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A crew of passionate builders, software architects, visualizers, and community mentors. We live in CAD and dream in autonomous coordinates.
              </p>
            </div>

            {/* Dept Filter */}
            <div className="mt-4 flex flex-wrap gap-1.5 md:mt-0">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setActiveDept(dept);
                    setSelectedMember(null); // Clear selected item if filters change
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeDept === dept
                      ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  id={`dept-tab-${dept.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {dept === 'All' ? 'All Roles' : dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Members Grid & Profile Inspector Pane */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Members List Grid */}
          <div className="lg:col-span-2 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {filteredMembers.map((member) => {
              const isSelected = selectedMember?.id === member.id;
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  className={`relative flex flex-col justify-between cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/10 shadow-md dark:border-indigo-400 dark:bg-indigo-950/20'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm dark:border-slate-850/60 dark:bg-slate-900 dark:hover:border-slate-800'
                  }`}
                  id={`team-member-card-${member.id}`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Role Header */}
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${
                        member.department === 'Software' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        member.department === 'Mechanical' ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' :
                        member.department === 'Design & Outreach' ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                        'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}>
                        {member.department}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        #{member.id}00
                      </span>
                    </div>

                    {/* Member Profile Avatar Mock and Title */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-extrabold shadow-sm transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350'
                      }`}>
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-sans text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {member.name}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-cyan-400/80">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-450 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>

                  {/* Tiny meta summary */}
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850/50 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-indigo-400" />
                      {member.favComponent.substring(0, 24)}...
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      See full bio →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profile Inspector Pane */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-2xl border bg-gradient-to-b p-6 shadow-sm transition-all ${
              selectedMember 
                ? 'border-indigo-500/30 bg-indigo-50/5/30 dark:border-indigo-500/20 dark:bg-slate-950/40' 
                : 'border-slate-200/50 bg-slate-50/30 border-dashed dark:border-slate-850 dark:bg-slate-900/10'
            }`} id="member-profile-inspector">
              {selectedMember ? (
                <div className="flex flex-col gap-6">
                  {/* Title Header */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-xl font-extrabold text-white shadow-md">
                      {selectedMember.name.split(' ').map((n) => n[0]).join('')}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="font-sans text-lg font-extrabold text-slate-900 dark:text-white">
                        {selectedMember.name}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedMember.role}
                      </p>
                      <span className="mt-1 text-[10px] font-semibold tracking-wide text-slate-400">
                        Department: {selectedMember.department}
                      </span>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <MessageSquareDot className="h-3.5 w-3.5 text-indigo-500" />
                      Biography
                    </span>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 bg-slate-50/60 p-3 rounded-lg border border-slate-100 dark:border-slate-850 dark:bg-slate-950/20">
                      {selectedMember.bio}
                    </p>
                  </div>

                  {/* Quote Banner */}
                  <div className="relative rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 dark:border-indigo-950/30 dark:bg-indigo-950/10">
                    <Quote className="absolute -top-2.5 -left-1 h-5 w-5 rotate-180 text-indigo-600/20 dark:text-indigo-400/20" />
                    <p className="font-serif text-xs italic leading-relaxed text-indigo-800 dark:text-indigo-300">
                      "{selectedMember.quote}"
                    </p>
                  </div>

                  {/* Favorites Panel */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-850 dark:bg-slate-900">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                        <Wrench className="h-3 w-3" />
                        <span>FAV TOOL</span>
                      </div>
                      <p className="mt-1 font-sans text-xs font-bold text-slate-700 dark:text-slate-300">
                        {selectedMember.favTool}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-850 dark:bg-slate-900">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Cpu className="h-3 w-3" />
                        <span>FAV PART</span>
                      </div>
                      <p className="mt-1 font-sans text-xs font-bold text-slate-700 dark:text-slate-300">
                        {selectedMember.favComponent}
                      </p>
                    </div>
                  </div>

                  {/* Action/Contact Links */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-850/50">
                    <a
                      href="mailto:teamvortex00000@gmail.com"
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-950"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email member</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500">
                    <UserCircleFallback className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Select a Member</p>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500 max-w-[180px] mt-0.5">
                      Click any teammate card to see favorite components, tools, quotes, and deeper profiles.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Fallback user icon
function UserCircleFallback(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
