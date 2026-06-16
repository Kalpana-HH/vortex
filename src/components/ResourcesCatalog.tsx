import { useState } from 'react';
import { trainingResources } from '../data/resources';
import { TrainingResource } from '../types';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp, Link as LinkIcon, GraduationCap, Code2, AlertCircle } from 'lucide-react';

export default function ResourcesCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<TrainingResource | null>(null);
  const [copiedResourceID, setCopiedResourceID] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Record<number, boolean>>>({});

  const categories = ['All', 'CAD', 'Hardware', 'Programming', 'Notebook & Outreach'];

  const filteredResources = trainingResources.filter((res) => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guideSteps.some((step) => step.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedResourceID(id);
      setTimeout(() => setCopiedResourceID(null), 2000);
    });
  };

  const toggleStepCheck = (resourceId: string, idx: number) => {
    setCheckedSteps((prev) => {
      const resourceSteps = prev[resourceId] || {};
      return {
        ...prev,
        [resourceId]: {
          ...resourceSteps,
          [idx]: !resourceSteps[idx],
        },
      };
    });
  };

  return (
    <section className="relative scroll-mt-20 py-12" id="resources-section">
      <div className="flex flex-col gap-8">
        
        {/* Module Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-650 dark:text-cyan-405">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Vortex STEM Resources</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Training & Technical Resources
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A repository of verified engineering calculations, Java Linear OpModes, CAD assembly guides, and notebook templates to get team members fully up to speed.
              </p>
            </div>

            {/* Quick Search inside Resources */}
            <div className="w-full max-w-xs md:max-w-sm">
              <input
                type="text"
                placeholder="Search training guides & code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
                id="resource-search"
              />
            </div>
          </div>
        </div>

        {/* Categories Select bar */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-slate-850">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedResource(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm dark:bg-cyan-500'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
              }`}
              id={`resource-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid and expanded panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List panel */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            {filteredResources.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400">No resources matched filters.</span>
              </div>
            ) : (
              filteredResources.map((res) => {
                const isCurrent = selectedResource?.id === res.id;
                return (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResource(res)}
                    className={`flex flex-col text-left rounded-xl p-4 transition-all border duration-300 ${
                      isCurrent
                        ? 'bg-slate-50 dark:bg-slate-950/40 border-indigo-500 dark:border-cyan-400 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/30'
                    }`}
                    id={`res-card-${res.id}`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[8.5px] font-extrabold tracking-wider uppercase text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                        {res.category}
                      </span>
                      <span className={`rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${
                        res.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                        res.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-rose-500/10 text-rose-600'
                      }`}>
                        {res.difficulty}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-450 line-clamp-2">
                      {res.description}
                    </p>

                    <span className="mt-3 text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline">
                      Launch interactive checklist →
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Interactive Playground/Content viewing */}
          <div className="lg:col-span-2">
            {selectedResource ? (
              <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" id="resource-active-workspace">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-4 dark:border-slate-850/50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-cyan-650 dark:text-cyan-405">
                      Vortex Resource Guide • {selectedResource.category}
                    </span>
                    <h3 className="font-sans text-xl font-extrabold text-slate-950 dark:text-white">
                      {selectedResource.title}
                    </h3>
                  </div>

                  {/* Level labels info */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Time: {selectedResource.readTime}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      selectedResource.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                      selectedResource.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {selectedResource.difficulty}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                  {selectedResource.description}
                </p>

                {/* Interactive checklist progress */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-850/60 dark:bg-slate-950/20">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      Step-by-Step Training Checklist
                    </h5>
                    {/* Completion percentages progress bar */}
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {Math.round(
                        (Object.values(checkedSteps[selectedResource.id] || {}).filter(Boolean).length /
                          selectedResource.guideSteps.length) *
                          100
                      ) || 0}% Done
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    {selectedResource.guideSteps.map((step, idx) => {
                      const isDone = !!checkedSteps[selectedResource.id]?.[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStepCheck(selectedResource.id, idx)}
                          className={`flex items-start gap-2.5 cursor-pointer rounded-lg p-2.5 transition-all text-xs border ${
                            isDone
                              ? 'bg-emerald-500/5 border-emerald-500/15 text-slate-500 line-through dark:border-emerald-500/10'
                              : 'bg-white border-slate-100 text-slate-700 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-300'
                          }`}
                        >
                          <button className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950'
                          }`}>
                            {isDone && <Check className="h-2.5 w-2.5" />}
                          </button>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Code Snippet Box with dynamic copy state */}
                {selectedResource.codeSnippet && (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                        Code Blueprint ({selectedResource.codeLanguage?.toUpperCase()})
                      </span>
                      <button
                        onClick={() => handleCopyCode(selectedResource.id, selectedResource.codeSnippet!)}
                        className="flex items-center gap-1 rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                        title="Copy code blueprint to clipboard"
                        id={`btn-copy-code-${selectedResource.id}`}
                      >
                        {copiedResourceID === selectedResource.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Config</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-xs font-mono text-emerald-400 leading-relaxed shadow-inner max-h-72">
                      <code>{selectedResource.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Links */}
                {selectedResource.externalLinks && selectedResource.externalLinks.length > 0 && (
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-50 dark:border-slate-850/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Downloadable References & Documentation
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.externalLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-lg border border-slate-250 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-450 dark:hover:bg-slate-950/70"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-slate-200 p-6 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10">
                <GraduationCap className="h-10 w-10 text-slate-350 dark:text-slate-600 mb-2" />
                <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">No training module in focus</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] mt-1 mx-auto leading-relaxed">
                  Choose any guide module on the left rail to open checklists, step guides, and Java code blueprint templates.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
