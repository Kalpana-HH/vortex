import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Download, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

interface Tier {
  name: string;
  minAmount: number;
  maxAmount: number;
  tagline: string;
  benefits: string[];
  color: string;
  bgSelected: string;
  textColor: string;
}

export default function SponsorPortal() {
  const [pledge, setPledge] = useState<number>(1200); // Default Pledge is $1200 (Gold Sponsor)
  
  const sponsors = [
    { name: 'Onshape PTC', type: 'Titanium Partner', logoText: 'PTC' },
    { name: 'goBILDA', type: 'Gold Component Sponsor', logoText: 'GB' },
    { name: 'REV Robotics', type: 'Control Systems Sponsor', logoText: 'REV' },
    { name: 'NASA STEM Space Grant', type: 'Platinum Grant Sponsor', logoText: 'NASA' },
    { name: 'SolidWorks Labs', type: 'CAD Software Partner', logoText: 'SW' },
    { name: 'Local Precision CNC', type: 'Fabrication Sponsor', logoText: 'CNC' }
  ];

  const tiers: Tier[] = [
    {
      name: 'Bronze Supporter',
      minAmount: 100,
      maxAmount: 499,
      tagline: 'Empower Student Exploration',
      benefits: [
        'Corporate name on our official website sponsor wall',
        'Inclusion in our quarterly STEM community newsletter',
        'Official Team Vortex digital supporter badge'
      ],
      color: 'border-amber-700/30 bg-amber-500/5',
      bgSelected: 'bg-amber-500 text-white',
      textColor: 'text-amber-800 dark:text-amber-400'
    },
    {
      name: 'Silver Partner',
      minAmount: 500,
      maxAmount: 999,
      tagline: 'Fund Key Raw Subsystems',
      benefits: [
        'Small company logo printed on tournament team jerseys',
        'Dedicated team feature shoutout on our social media channels',
        'Inbound links from our sponsorship directory to your page',
        'Printed copy of our complete FIRST Engineering Portfolio'
      ],
      color: 'border-slate-300/60 bg-slate-100/50',
      bgSelected: 'bg-slate-500 text-white',
      textColor: 'text-slate-700 dark:text-slate-300'
    },
    {
      name: 'Gold Sponsor',
      minAmount: 1000,
      maxAmount: 2499,
      tagline: 'Mainstream Hardware Catalyst',
      benefits: [
        'Medium logo displayed on tournament jerseys & pit banners',
        'Custom 1.5-inch vinyl decal in prime placement on robot side plates',
        'Engraved team plaque & custom-milled Vortex gears desk award',
        'Direct invitations to VIP scrimmages and design review roundtables'
      ],
      color: 'border-yellow-500/30 bg-yellow-500/5',
      bgSelected: 'bg-yellow-500 text-slate-950',
      textColor: 'text-yellow-650 dark:text-yellow-400'
    },
    {
      name: 'Platinum Underwriter',
      minAmount: 2500,
      maxAmount: 4999,
      tagline: 'Primary Regional Core Benefactor',
      benefits: [
        'Large front-and-center logo positioning across all banners and jerseys',
        'Prominent 3-inch logo decal on robot physical chassis composite sheets',
        'Dedicated corporate highlight blog post and press release features',
        'Private demonstration day hosted at your office with our robotics team'
      ],
      color: 'border-indigo-500/30 bg-indigo-500/5',
      bgSelected: 'bg-indigo-650 text-white',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'Diamond Title Sponsor',
      minAmount: 5000,
      maxAmount: 10000,
      tagline: 'The Ultimate STEM Enabler',
      benefits: [
        'Official naming rights: "Vortex Robotics presented by [Your Company Name]"',
        'Largest dominant logo display: jerseys, front chassis paneling, and crates',
        'Sponsorship highlight featured at our local middle school hands-on seminars',
        'Direct recruitment funnel access: private panel with our senior software/CAD students'
      ],
      color: 'border-cyan-500/30 bg-cyan-500/5',
      bgSelected: 'bg-cyan-600 text-white',
      textColor: 'text-cyan-700 dark:text-cyan-400'
    }
  ];

  // Determine current tier based on pledge slider
  const currentTier = tiers.find(t => pledge >= t.minAmount && pledge <= t.maxAmount) || tiers[tiers.length - 1];

  const handleDownloadProspectus = () => {
    alert("This action mock-downloads our 2026-2027 Sponsorship Prospectus. In production, this anchors to a direct PDF file outlining team budgets, travel expenses, and tax-exempt 501(c)(3) documentation.");
  };

  return (
    <div className="scroll-mt-20 flex flex-col gap-8" id="sponsor-portal-section">
      
      {/* Module Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
          <Building2 className="h-4 w-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Support the Team</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-xl">
            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              Cultivating Tomorrow’s Engineers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vortex is a non-profit student team. 100% of community contributions go directly to precision goBILDA hardware parts, travel logistics, and free youth STEM clinics.
            </p>
          </div>
          <button
            onClick={handleDownloadProspectus}
            className="shrink-0 flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-850 dark:bg-cyan-600 dark:hover:bg-cyan-500 transition cursor-pointer self-start md:self-auto"
            id="download-prospectus-btn"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Prospectus (PDF)</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Side: Interactive Pledge Calculator */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-150 bg-white p-6 dark:border-slate-850 dark:bg-slate-900 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5 dark:border-slate-850">
            <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
              Interactive Sponsor Tier Estimator
            </h3>
            <p className="text-[11px] text-slate-500">
              Drag the slider to choose your budget pledge amount and instantly inspect corresponding promotional benefits for your brand.
            </p>
          </div>

          {/* Calculator slider interface */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 bg-slate-50/60 p-4 rounded-xl border border-slate-100 dark:bg-slate-950/30 dark:border-slate-850">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-405 dark:text-slate-500 tracking-wider">
                  Select Donation Commitment
                </span>
                <span className="font-mono text-2xl font-black text-indigo-650 dark:text-cyan-400 flex items-center gap-0.5">
                  <DollarSign className="h-5 w-5 shrink-0" />
                  {pledge.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={pledge}
                onChange={(e) => setPledge(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-800 dark:accent-cyan-400 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>$100 Bronze</span>
                <span>$1,000 Gold</span>
                <span>$2,500 Platinum</span>
                <span>$5,000+ Diamond Title</span>
              </div>
            </div>

            {/* Quick Select Quick Chips */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Quick Select Tier Troughs
              </span>
              <div className="flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setPledge(t.minAmount)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight transition ${
                      currentTier.name === t.name
                        ? `${t.bgSelected} shadow-sm`
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-950/20 dark:text-slate-400'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Info Banner */}
            <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/25 p-3 dark:border-slate-800 dark:bg-slate-950/20">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-600 dark:text-cyan-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-slate-700 dark:text-slate-300">
                  Tax Deductible Contributions
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Vortex Robotics files through our local educational district’s 501(c)(3) STEM foundation. Tax-receipt certificates, IRS tax identification numbers (EIN), and invoice documentation are delivered upon processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tier Benefits Display Card */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 flex flex-col justify-between gap-5 transition duration-350 bg-slate-50/20 dark:bg-slate-950/10 ${currentTier.color}`}>
          
          <div className="flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-slate-100/10 pb-3">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTier.bgSelected}`}>
                  {currentTier.name}
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {pledge >= 5000 ? '$5k+' : `$${currentTier.minAmount} - $${currentTier.maxAmount}`}
                </span>
              </div>
              <h4 className="font-sans text-xl font-extrabold text-slate-950 dark:text-white mt-1.5">
                {currentTier.tagline}
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Your pledge of <span className="font-bold text-slate-700 dark:text-slate-300">${pledge.toLocaleString()}</span> yields the following organizational features during our regional qualifier cycle:
              </p>
            </div>

            {/* Benefit bullet list */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Benefits Package list:
              </span>
              <div className="flex flex-col gap-2.5">
                {currentTier.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-2 items-start text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-normal">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Call to action button */}
          <a
            href="mailto:teamvortex00000@gmail.com?subject=Sponsorship%20Inquiry%20-%20Vortex%20Robotics"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-xs py-3 shadow-md active:scale-95 transition"
            id={`sponsor-contract-${currentTier.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <Mail className="h-4 w-4" />
            <span>Pledge ${pledge.toLocaleString()} Commitment</span>
          </a>

        </div>

      </div>

      {/* Grid of Existing Sponsors Logos */}
      <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-850">
        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-indigo-500" />
          Thank You to Our Corporate Benefactors & Suppliers
        </span>

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 md:grid-cols-6">
          {sponsors.map((sp) => (
            <div 
              key={sp.name} 
              className="group flex flex-col justify-center items-center rounded-xl border border-slate-150 bg-white p-3 shadow-sm hover:border-slate-300 dark:border-slate-850 dark:bg-slate-900 transition text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-xs font-black tracking-tighter text-slate-400 dark:bg-slate-950 dark:text-slate-600 uppercase group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition">
                {sp.logoText}
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-205 leading-tight">
                {sp.name}
              </span>
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {sp.type}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
