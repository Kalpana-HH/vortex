import React, { useState, useEffect } from 'react';
import { 
  Trophy, Sparkles, Quote, Image as ImageIcon, Plus, Trash2, 
  Edit2, X, CheckCircle2, Award, Heart, Loader2, ArrowRight, ExternalLink 
} from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

interface AwardItem {
  id: string;
  title: string;
  event: string;
  year: string;
  trophyType: 'gold' | 'silver' | 'bronze' | 'blue' | 'pink';
  category: 'Championship' | 'Engineering' | 'Design' | 'Outreach';
  judgesQuote: string;
  teamResponse: string;
  mediaHighlight: string;
}

const DEFAULT_AWARDS: AwardItem[] = [
  {
    id: 'award_inspire_2025',
    title: 'Inspire Award Winner',
    event: 'FTC Texas Regional Championship',
    year: '2025',
    trophyType: 'gold',
    category: 'Championship',
    judgesQuote: "This team's outstanding engineering portfolio spun a web of precise calculations, while their robot executed orbits with frictionless accuracy. Their community outreach illuminated the entire regional landscape.",
    teamResponse: "Winning the Inspire Award was a defining moment for Team Vortex. Our entire team burst into cheers as we hugged our mentors, knowing that our late-night CAD sprints and portfolio editing had truly made a difference.",
    mediaHighlight: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'award_think_2025',
    title: 'Think Award Winner',
    event: 'FTC Houston Qualifier matches',
    year: '2025',
    trophyType: 'blue',
    category: 'Engineering',
    judgesQuote: "From initial napkin sketches to complete multi-segment Bezier spline calculations, this team mapped their design process with stellar academic integrity. They made complex math look like child's play.",
    teamResponse: "Our documentation lead literally cried! We compiled a 120-page Engineering Portfolio explaining our automated path-simulators and center of mass formulas in painstaking detail.",
    mediaHighlight: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'award_innovate_2024',
    title: 'Innovate Award',
    event: 'North Texas League Tournament',
    year: '2024',
    trophyType: 'pink',
    category: 'Design',
    judgesQuote: "For constructing a highly elegant, custom-milled intake system that uses adaptive tensioners to swallow competition elements instantly from any orientation. Elegant, robust, and completely original.",
    teamResponse: "We went through seven different intake mockups on the laser-cutter before arriving at this dual-tension custom polyurethane roller. It felt incredible to see our fabrication hours recognized by the judges.",
    mediaHighlight: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800'
  }
];

interface AwardsDisplayProps {
  db?: any;
  currentUser?: any;
  isUnlocked: boolean;
}

export default function AwardsDisplay({ db, currentUser, isUnlocked }: AwardsDisplayProps) {
  const [awards, setAwards] = useState<AwardItem[]>(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_awards');
      return saved ? JSON.parse(saved) : DEFAULT_AWARDS;
    } catch {
      return DEFAULT_AWARDS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Modal / Form state for Add or Edit
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formEvent, setFormEvent] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formTrophyType, setFormTrophyType] = useState<AwardItem['trophyType']>('gold');
  const [formCategory, setFormCategory] = useState<AwardItem['category']>('Championship');
  const [formJudgesQuote, setFormJudgesQuote] = useState('');
  const [formTeamResponse, setFormTeamResponse] = useState('');
  const [formMediaHighlight, setFormMediaHighlight] = useState('');

  // Sync real-time database changes from other devices
  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(doc(db, "custom_data", "awards"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setAwards(data.items);
          localStorage.setItem('vortex_custom_awards', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Awards Cloud Sync inactive:", error);
    });
    return () => unsubscribe();
  }, [db]);

  // Unified save helper to sync globally if user is Admin
  const updateAwardsList = async (newAwards: AwardItem[]) => {
    setAwards(newAwards);
    localStorage.setItem('vortex_custom_awards', JSON.stringify(newAwards));
    if (db) {
      const userEmailLower = currentUser?.email?.toLowerCase();
      const isAdminEmail = !!(currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "awards"), {
            items: newAwards,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync awards to Firestore:", e);
        }
      } else if (isUnlocked) {
        alert("⚠️ Local Only Mode: Achievement saved locally. Log in as an administrator ('Sync with Google' on bottom bar) to broadcast this award to all other devices!");
      }
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormEvent('');
    setFormYear(new Date().getFullYear().toString());
    setFormTrophyType('gold');
    setFormCategory('Championship');
    setFormJudgesQuote('');
    setFormTeamResponse('');
    setFormMediaHighlight('');
    setEditingId(null);
    setFormOpen(false);
  };

  const handleOpenEdit = (award: AwardItem) => {
    setEditingId(award.id);
    setFormTitle(award.title);
    setFormEvent(award.event);
    setFormYear(award.year);
    setFormTrophyType(award.trophyType);
    setFormCategory(award.category);
    setFormJudgesQuote(award.judgesQuote);
    setFormTeamResponse(award.teamResponse);
    setFormMediaHighlight(award.mediaHighlight);
    setFormOpen(true);
  };

  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formEvent) {
      alert("Please fill in Title and Event Name");
      return;
    }

    const completeFields: AwardItem = {
      id: editingId || `award_${Date.now()}`,
      title: formTitle,
      event: formEvent,
      year: formYear || new Date().getFullYear().toString(),
      trophyType: formTrophyType,
      category: formCategory,
      judgesQuote: formJudgesQuote,
      teamResponse: formTeamResponse,
      mediaHighlight: formMediaHighlight || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
    };

    let updatedList: AwardItem[];
    if (editingId) {
      updatedList = awards.map(a => a.id === editingId ? completeFields : a);
    } else {
      updatedList = [...awards, completeFields];
    }

    updateAwardsList(updatedList);
    resetForm();
  };

  const handleDeleteAward = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the award reference: "${name}"? This change will synchronize globally.`)) {
      const updated = awards.filter(a => a.id !== id);
      updateAwardsList(updated);
    }
  };

  const filteredAwards = activeCategory === 'All' 
    ? awards 
    : awards.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  // Render dynamic pure-CSS modern minimalist floating prism trophies
  const renderTrophy3D = (type: AwardItem['trophyType']) => {
    let glowColor = 'rgba(251, 191, 36, 0.4)';
    let coreColor = 'from-amber-400 to-yellow-300';

    switch (type) {
      case 'silver':
        glowColor = 'rgba(148, 163, 184, 0.4)';
        coreColor = 'from-stone-300 to-zinc-400';
        break;
      case 'bronze':
        glowColor = 'rgba(194, 65, 12, 0.4)';
        coreColor = 'from-orange-400 to-amber-600';
        break;
      case 'blue':
        glowColor = 'rgba(6, 182, 212, 0.4)';
        coreColor = 'from-cyan-400 to-blue-500';
        break;
      case 'pink':
        glowColor = 'rgba(236, 72, 153, 0.4)';
        coreColor = 'from-pink-400 to-rose-500';
        break;
    }

    return (
      <div 
        className="relative w-36 h-36 flex items-center justify-center select-none"
        style={{ perspective: '800px' }}
      >
        {/* Glow backdrop */}
        <div 
          className="absolute w-24 h-24 rounded-full filter blur-2xl opacity-20 transition-all duration-700 group-hover:opacity-40"
          style={{ backgroundColor: glowColor }}
        />

        {/* 3D Exhibit Star/Underplate */}
        <div 
          className="absolute bottom-4 w-20 h-4 bg-stone-950 border border-stone-800 rounded-full flex items-center justify-center shadow-lg"
          style={{
            transform: 'rotateX(60deg)',
            boxShadow: `0 8px 24px ${glowColor}`
          }}
        >
          {/* Inner metallic base ring */}
          <div className="w-16 h-2 bg-gradient-to-r from-stone-800 to-stone-900 rounded-full" />
        </div>

        {/* Levitating Floating 3D Prism Object */}
        <div 
          className="relative w-16 h-16 flex items-center justify-center animate-bounce transform-gpu"
          style={{ 
            animationDuration: '4s',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Outer Glass Refraction Cage (rotated rhomboid) */}
          <div 
            className="absolute w-12 h-12 border border-white/20 bg-white/[0.04] backdrop-blur-[2px] rounded-lg transition-transform duration-700 group-hover:scale-115"
            style={{
              transform: 'rotateX(45deg) rotateY(45deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Internal energetic/neon glowing core */}
          <div 
            className={`absolute w-6 h-6 bg-gradient-to-tr ${coreColor} rounded-md shadow-lg transition-transform duration-700 group-hover:rotate-180`}
            style={{
              boxShadow: `0 0 16px currentColor`,
              color: glowColor.replace('0.3', '1').replace('0.4', '1')
            }}
          />

          {/* Small orbital particle indicators */}
          <div className="absolute -top-3 -right-2 w-1 h-1 rounded-full bg-white opacity-40 animate-ping" />
          <div className="absolute -bottom-2 -left-3 w-1.5 h-1.5 rounded-full bg-white/30 opacity-20" />
        </div>
      </div>
    );
  };

  const categories = ['All', 'Championship', 'Engineering', 'Design', 'Outreach'];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="awards-display-page">
      
      {/* Header section with explicit achievements layout */}
      <div className="border-b border-[var(--border)] pb-8 text-left flex flex-col md:flex-row md:items-end justify-between gap-6" id="achievements-header-landmark">
        <div className="flex-1">
          <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-1">Honorable Mentions & History</span>
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">Our Achievements</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">
            The historical record of official FIRST Tech Championship trophies, outstanding engineering accolades, and design recognition earned by Team Vortex across robotics seasons.
          </p>
        </div>

        {/* Categories Tab and CMS Add Option combined */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex bg-[var(--card-bg)] border border-[var(--border)] rounded-full p-1" id="awards-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-[var(--accent)] text-black font-black' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isUnlocked && (
            <button
              onClick={() => setFormOpen(true)}
              className="rounded-full bg-[var(--accent)] hover:scale-105 transition active:scale-95 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(0,240,255,0.2)]"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              <span>Add Achievement</span>
            </button>
          )}
        </div>
      </div>

      {filteredAwards.length === 0 ? (
        <div className="border border-dashed border-[var(--border)] rounded-2xl p-16 text-center text-stone-400 flex flex-col items-center justify-center gap-4">
          <Trophy className="h-12 w-12 text-stone-600 animate-pulse" />
          <div>
            <p className="font-bold text-stone-200">No awards cataloged.</p>
            <p className="text-xs text-stone-500 mt-1">If you are an administrator, click the Add Achievement button above to add an item.</p>
          </div>
        </div>
      ) : (
        /* Awards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="awards-showcase-grid">
          {filteredAwards.map((award) => (
            <div 
              key={award.id}
              className="group relative bg-[#0b0b12]/90 border border-stone-850 rounded-2xl overflow-hidden flex flex-col p-6 text-left transition-all duration-500 hover:border-[var(--accent)]/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] animate-fadeIn"
            >
              {/* Category flag & admin actions */}
              <div className="flex items-center justify-between mb-4 z-10">
                <span className="text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-0.5 rounded bg-black/60 border border-stone-800 text-[var(--accent)]">
                  {award.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold text-stone-400 bg-black/60 px-2.5 py-0.5 rounded border border-stone-800/80">
                    {award.year}
                  </span>

                  {isUnlocked && (
                    <div className="flex items-center gap-1 ml-2 relative z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(award);
                        }}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
                        title="Edit award card info"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAward(award.id, award.title);
                        }}
                        className="p-1 rounded bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-rose-400 hover:text-white transition cursor-pointer"
                        title="Delete award card"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Centered Exhibit Platform with Under-Grid */}
              <div className="aspect-[4/3] flex items-center justify-center relative my-4 rounded-xl bg-black/35 border border-stone-900/60 overflow-hidden">
                {/* Minimalist Grid Pattern for Showcase staging */}
                <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                
                {renderTrophy3D(award.trophyType)}
              </div>

              {/* Bottom text: Title & Location */}
              <div className="pt-4 border-t border-stone-900/60 z-10 mt-auto">
                <h3 className="font-sans text-base font-black uppercase text-stone-100 leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                  {award.title}
                </h3>
                <div className="mt-1 text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  {award.event}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Dynamic admin setup portal inside Awards component */}
      {formOpen && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveAward}
            className="bg-[#121214] border border-[var(--accent)]/45 rounded-2xl w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-left flex flex-col gap-4 animate-slideIn max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-black tracking-wider text-[var(--accent)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)] animate-spin-slow" />
                <span>
                  {editingId !== null ? "MODIFY ACHIEVEMENT CARD" : "LOG NEW ACHIEVEMENT"}
                </span>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-stone-400 hover:text-white transition rounded-full hover:bg-stone-800 p-1 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Award Title</label>
                <input 
                  type="text" 
                  className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. Inspire Award Winner, Think Award"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Event Name</label>
                  <input 
                    type="text" 
                    className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                    placeholder="e.g. West Texas Qualifier"
                    value={formEvent}
                    onChange={(e) => setFormEvent(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Year</label>
                  <input 
                    type="text" 
                    className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                    placeholder="e.g. 2025"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Trophy Style (3D Glow)</label>
                  <select 
                    className="bg-[#121214] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                    value={formTrophyType}
                    onChange={(e) => setFormTrophyType(e.target.value as any)}
                  >
                    <option value="gold">Gold Trophy Monolith</option>
                    <option value="silver">Silver Trophy Monolith</option>
                    <option value="bronze">Bronze Medal Block</option>
                    <option value="blue">Cyber Blue Crown Base</option>
                    <option value="pink">Aesthetic Pink Neon Orb</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Exhibition Category</label>
                  <select 
                    className="bg-[#121214] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                  >
                    <option value="Championship">Championship</option>
                    <option value="Engineering">Engineering & Software</option>
                    <option value="Design">Industrial Design</option>
                    <option value="Outreach">Community Outreach</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Official Judges' Feedback / Quote</label>
                <textarea 
                  rows={2}
                  className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                  placeholder="The written or spoken feedback from the official event judges..."
                  value={formJudgesQuote}
                  onChange={(e) => setFormJudgesQuote(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Team's Emotional Response / Recollection</label>
                <textarea 
                  rows={2}
                  className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                  placeholder="How did the team feel or reply when this milestone was read out?"
                  value={formTeamResponse}
                  onChange={(e) => setFormTeamResponse(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Celebration Photo URL</label>
                <input 
                  type="text" 
                  className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                  placeholder="https://images.unsplash.com/... or search link"
                  value={formMediaHighlight}
                  onChange={(e) => setFormMediaHighlight(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border)] pt-4 mt-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="rounded-lg border border-[var(--border)] text-stone-300 hover:text-white hover:bg-stone-800 transition px-4 py-2 text-xs font-mono font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                className="rounded-lg bg-[var(--accent)] text-black hover:opacity-95 active:scale-95 transition px-5 py-2 text-xs font-mono font-black tracking-wider cursor-pointer"
              >
                {editingId !== null ? "SAVE MODIFICATIONS" : "BROADCAST TO WORLD"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
