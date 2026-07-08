import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Compass, Terminal, Eye, BookOpen, MessageSquare, Youtube, Instagram, Box, ExternalLink, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Award, Calendar, MapPin, Users, Handshake, Sparkles, Cpu, Wrench, Image, Clock, FileText, School, Shield, RefreshCw, CheckCircle, Lock, Unlock, LogIn, LogOut, CheckCircle2, Search, Edit, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { teamMembers } from './data/team';
import BOMManager from './components/BOMManager';
import COMCalculator from './components/COMCalculator';
import PortfolioHub from './components/PortfolioHub';
import CountdownTimer from './components/CountdownTimer';
import PathSimulator from './components/PathSimulator';
import AwardsDisplay from './components/AwardsDisplay';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDocFromServer, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const vortexLogo = '/assets/images/vortex_logo.png';
const vortexLongLogo = '/assets/images/Vortex_long.png';

const getInitials = (text: string) => {
  if (!text) return 'VTX';
  const clean = text.replace(/(Inc|Corp|Ltd|Team|Robotics|Designer|Lab|Jet Propulsion|Company|Sponsor|Partner|FTC|Texas|Region)/gi, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'VTX';
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return (words[0][0] + (words[1] ? words[1][0] : '') + (words[2] ? words[2][0] : '')).toUpperCase();
};

// Reusable Image component that handles missing imagery by rendering an elegant, styled SVG canvas fallback with technical indicators in the active theme
const ImageWithFallback = ({ src: propSrc, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [localSrc, setLocalSrc] = useState<string | undefined>(undefined);

  // Read current saved overriding src if any
  const getOverridingSrc = () => {
    if (!imgRef.current) return undefined;
    try {
      const savedImagesText = localStorage.getItem('vortex_image_replacements');
      if (savedImagesText) {
        const parsed = JSON.parse(savedImagesText);
        const selector = getElementSelector(imgRef.current);
        if (parsed[selector]) {
          return parsed[selector];
        }
      }
    } catch (e) {}
    return undefined;
  };

  // Keep local image resource updated with global edits in real-time
  useEffect(() => {
    const updateSrc = () => {
      const override = getOverridingSrc();
      if (override !== undefined) {
        setLocalSrc(override);
      } else {
        setLocalSrc(propSrc);
      }
    };

    updateSrc();

    // Small polling loop to sync edits globally on the client state instantly
    const interval = setInterval(updateSrc, 300);
    return () => clearInterval(interval);
  }, [propSrc]);

  const activeSrc = localSrc !== undefined ? localSrc : propSrc;
  const showPlaceholder = error || !activeSrc;

  // Reset states when the image source path shifts
  useEffect(() => {
    setError(false);
  }, [activeSrc]);

  return (
    <div className="relative w-full h-full min-h-[inherit]">
      {showPlaceholder && (
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--accent)]/[0.08] to-[var(--accent)]/[0.02] border border-[var(--border)] text-[var(--accent)] select-none p-4 text-center w-full h-full ${className || ''}`}
          style={{ filter: 'none', borderStyle: 'solid' }}
        >
          <div className="w-11 h-11 rounded-full border border-[var(--border)]/35 bg-[var(--card-bg)] flex items-center justify-center text-xs font-black tracking-widest text-[var(--accent)] shadow-md mb-2 uppercase">
            {getInitials(alt || '')}
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[var(--text-primary)] uppercase font-extrabold block truncate max-w-full px-1">
            {alt || 'IMAGE PENDING'}
          </span>
          <span className="text-[8px] font-mono text-[var(--text-secondary)] uppercase mt-1 block tracking-wider opacity-90">
            SPECIFY PINPOINT PNG
          </span>
        </div>
      )}

      {/* Maintain the active img tag in the DOM at all times so click observers can target, edit, and apply drops perfectly */}
      <img
        ref={imgRef}
        src={activeSrc || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="transparent"/></svg>'}
        alt={alt}
        className={`${className || ''} ${showPlaceholder ? 'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20' : ''}`}
        onError={() => setError(true)}
        onLoad={() => {
          setError(false);
        }}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};

type PageID = 'home' | 'team' | 'journey' | 'sponsors' | 'resources' | 'contact' | 'gallery' | 'bom' | 'com-calc' | 'portfolios' | 'pathing' | 'awards';

interface PageItem {
  id: PageID;
  label: string;
}

// Static FIRST Experience badge display
const FIRSTExperienceYears = ({ targetYears }: { targetYears: number }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center bg-[var(--bg-primary)] border border-[var(--border)] p-3 rounded-xl mt-3 select-none relative overflow-hidden w-full transition duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.02]"
    >
      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
        FIRST Experience
      </span>
      
      {/* Visual static years slot-card */}
      <div className="relative mt-2 px-4 py-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-md min-w-[75px] text-center shadow-inner overflow-hidden flex items-center justify-center gap-1.5">
        <div className="absolute inset-x-0 top-0 h-1 bg-black/5" />
        <span className="font-mono text-xl font-black text-[var(--accent)]">
          {targetYears}
        </span>
        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
          {targetYears === 1 ? 'Year' : 'Years'}
        </span>
      </div>
    </div>
  );
};

// High-fidelity media assets list mapped to local PNG configurations or high-quality CDN stand-ins
const galleryItems = [
  {
    id: 1,
    title: 'Precision Chassis Milling',
    caption: 'Custom machining of our lightweight aerospace-grade aluminum chassis base-plate on our shop router.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'MECHANICAL',
    date: 'July 2026'
  },
  {
    id: 2,
    title: 'Custom PCB Circuit Design',
    caption: 'Prototyping dynamic sensor routing hubs inside Altium to sync absolute encoders and pinpoint system modules.',
    image: 'https://images.unsplash.com/photo-1517055720413-6afc8296900d?auto=format&fit=crop&w=800&q=80',
    category: 'ELECTRONICS',
    date: 'June 2026'
  },
  {
    id: 3,
    title: '3D CAD Mecanum Assembly',
    caption: 'Optimizing high-reduction gearbox placements and motor clearance inside OnShape.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    category: 'CAD MODELS',
    date: 'June 2026'
  },
  {
    id: 4,
    title: 'Electrical Harness Inspection',
    caption: 'Testing clean wire loom protections, power distribution modules, and custom copper bus connections.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    category: 'ELECTRONICS',
    date: 'August 2026'
  },
  {
    id: 5,
    title: 'Initial Team Brainstorm Block',
    caption: 'Texas rookie builders studying math bounds, game elements, design spreadsheets, and robot rules.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    category: 'WORKSHOPS',
    date: 'June 2026'
  },
  {
    id: 6,
    title: 'Trajectory Polynomial Plotting',
    caption: 'Drafting bezier mathematical spline curves to calculate path control velocity parameters.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'CAD MODELS',
    date: 'August 2026'
  }
];

// Duplicated rows for infinite scrolling collage background
const collageRow1 = [...galleryItems, ...galleryItems, ...galleryItems];
const collageRow2 = [...galleryItems, ...galleryItems, ...galleryItems].reverse();

// Interactive Gallery View Component with Lightbox popup
interface GalleryPageViewProps {
  isUnlocked: boolean;
  gallery: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
}

const GalleryPageView = ({ isUnlocked, gallery, onAdd, onEdit, onDelete }: GalleryPageViewProps) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MECHANICAL' | 'ELECTRONICS' | 'CAD' | 'WORKSHOPS'>('ALL');
  const [zoomedImage, setZoomedImage] = useState<any | null>(null);

  const filteredItems = gallery.filter(item => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CAD') return item.category === 'CAD MODELS';
    return item.category === activeTab;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-12" id="gallery-page-view">
      
      {/* Title Header */}
      <div className="border-b border-[var(--border)] pb-6 text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Visual Showcase</span>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Media Gallery</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
            Visual documentation of our rookie workspaces, initial high-precision CAD architectures, and mechanical layouts as we prepare to embark on our very first season.
          </p>
        </div>
        {isUnlocked && (
          <button
            onClick={onAdd}
            className="rounded-full bg-[var(--accent)] text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Image
          </button>
        )}
      </div>

      {/* Categories Toolbar Filter Row */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--border)]/70">
        {(['ALL', 'MECHANICAL', 'ELECTRONICS', 'CAD', 'WORKSHOPS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition duration-150 cursor-pointer ${
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
            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full text-left relative"
          >
            {isUnlocked && (
              <div className="absolute top-3 right-3 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-black border border-white/10 hover:border-transparent transition cursor-pointer shadow-md"
                  title="Edit Image Details"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-red-600 text-[var(--text-primary)] hover:text-white border border-white/10 hover:border-transparent transition cursor-pointer shadow-md"
                  title="Remove from Gallery"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {/* Image hover slot */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border)]">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <span className="text-white text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 border border-white/40 bg-black/20 backdrop-blur-sm rounded-lg">
                  🔎 ZOOM PICTURE
                </span>
              </div>
              <ImageWithFallback 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-contain p-4 bg-[var(--bg-primary)] transition-transform duration-300 group-hover:scale-105"
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
              <ImageWithFallback 
                src={zoomedImage.image} 
                alt={zoomedImage.title} 
                className="w-full h-full object-contain p-6"
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



// Team member portraits using local actual-path PNG configurations
const portraits: Record<string, string> = {
  '1': '/assets/images/portraits/person_1.png', // Alex Rivera
  '2': '/assets/images/portraits/person_2.png', // Sarah Chen
  '3': '/assets/images/portraits/person_3.png', // Marcus Vance
  '4': '/assets/images/portraits/person_4.png', // Emily Taylor
  '5': '/assets/images/portraits/person_5.png', // David Kim
  '6': '/assets/images/portraits/person_6.png'  // Coach Elena Rostova (person_6)
};

const sponsorLogos = [
  { 
    name: 'NASA Jet Propulsion Lab', 
    logo: '/assets/images/sponsors/nasa_jpl.png', 
    tier: 'Titanium Sponsor',
    desc: 'Advancing aerospace system research and technical grant support.'
  },
  { 
    name: 'goBILDA', 
    logo: '/assets/images/sponsors/gobilda.png', 
    tier: 'Gold Partner',
    desc: 'Supplying physical chassis framework tooling & mechanical components.'
  },
  { 
    name: 'REV Robotics', 
    logo: '/assets/images/sponsors/rev_robotics.png', 
    tier: 'Gold Partner',
    desc: 'Supplying advanced motor controls, absolute encoders and wiring kits.'
  },
  { 
    name: 'SolidWorks', 
    logo: '/assets/images/sponsors/solidworks.png', 
    tier: 'Titanium Sponsor',
    desc: 'Empowering our builders with master level 3D CAD design licenses.'
  },
  { 
    name: 'Altium Designer', 
    logo: '/assets/images/sponsors/altium_designer.png', 
    tier: 'Silver Sponsor',
    desc: 'Guiding custom printed circuit board layout architectures.'
  }
];

const decryptVal = (codes: number[], key = 42) => {
  return codes.map(c => String.fromCharCode(c ^ key)).join('');
};

// Initialize Firebase Application, Firestore Database, and Authentication services
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ...((firebaseConfig as any).firestoreDatabaseId ? { databaseId: (firebaseConfig as any).firestoreDatabaseId } : {})
});
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const getElementText = (el: HTMLElement): string => {
  if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
    return el.childNodes[0].nodeValue?.trim() || '';
  }
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes[i];
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
      return child.nodeValue.trim();
    }
  }
  return el.textContent?.trim() || '';
};

const getElementSelector = (el: HTMLElement): string => {
  const parts: string[] = [];
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body) {
    let part = curr.tagName.toLowerCase();
    if (curr.id) {
      part += `#${curr.id}`;
      parts.unshift(part);
      break;
    } else {
      let sibIndex = 0;
      let sibling = curr.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === curr.tagName) {
          sibIndex++;
        }
        sibling = sibling.previousElementSibling;
      }
      part += `:nth-of-type(${sibIndex + 1})`;
    }
    parts.unshift(part);
    curr = curr.parentElement;
  }
  return parts.join(' > ');
};

const setElementTextPreservingChildren = (el: HTMLElement, newText: string) => {
  if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
    if (el.childNodes[0].nodeValue !== newText) {
      el.childNodes[0].nodeValue = newText;
    }
    return;
  }
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes[i];
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
      if (child.nodeValue !== newText) {
        child.nodeValue = newText;
      }
      return;
    }
  }
  if (el.childNodes.length === 0) {
    if (el.textContent !== newText) {
      el.textContent = newText;
    }
  }
};

let isRestoring = false;

const restoreAllTextNodes = () => {
  if (isRestoring) return;
  const savedText = localStorage.getItem('vortex_text_replacements');
  const savedImages = localStorage.getItem('vortex_image_replacements');
  const savedLinks = localStorage.getItem('vortex_link_replacements');
  
  try {
    isRestoring = true;
    
    // 1. Restore Custom Text Nodes
    if (savedText) {
      const replacements = JSON.parse(savedText);
      let dirty = false;
      for (const [selector, newVal] of Object.entries(replacements)) {
        if (selector.includes('#sponsors-slideshow') && !selector.includes('sponsor-name') && !selector.includes('sponsor-desc') && !selector.includes('sponsor-tier')) {
          delete replacements[selector];
          dirty = true;
          continue;
        }
        try {
          const el = document.querySelector(selector) as HTMLElement;
          if (el) {
            setElementTextPreservingChildren(el, newVal as string);
          }
        } catch (err) {}
      }
      if (dirty) {
        localStorage.setItem('vortex_text_replacements', JSON.stringify(replacements));
      }
    }

    // 2. Restore Custom Image Elements (Base64 or external drops)
    if (savedImages) {
      const imgReplacements = JSON.parse(savedImages);
      for (const [selector, base64] of Object.entries(imgReplacements)) {
        try {
          const el = document.querySelector(selector) as HTMLImageElement;
          if (el && base64 && el.src !== base64) {
            el.src = base64 as string;
          }
        } catch (err) {}
      }
    }

    // 3. Restore Custom Link Elements (href)
    if (savedLinks) {
      const linkReplacements = JSON.parse(savedLinks);
      for (const [selector, href] of Object.entries(linkReplacements)) {
        try {
          const el = document.querySelector(selector) as HTMLAnchorElement;
          if (el && href && el.getAttribute('href') !== href) {
            el.setAttribute('href', href as string);
          }
        } catch (err) {}
      }
    }

  } catch (e) {
    console.error('Failed to restore dynamic CMS nodes', e);
  } finally {
    isRestoring = false;
  }
};

const saveAllTextNodes = () => {
  // Saved automatically on apply
};

export default function App() {
  const [activePage, setActivePage] = useState<PageID>('home');

  // Dynamic admin lists backed by LocalStorage with original constants as static fallbacks
  const [gallery, setGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_gallery');
      return saved ? JSON.parse(saved) : galleryItems;
    } catch {
      return galleryItems;
    }
  });

  const [sponsorsState, setSponsorsState] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_sponsors');
      return saved ? JSON.parse(saved) : sponsorLogos;
    } catch {
      return sponsorLogos;
    }
  });

  const [roster, setRoster] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_roster');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Merge staff/mentors list with students as default
    const mentorsList = [
      {
        id: 'm1',
        name: 'Coach Elena Rostova',
        role: 'Lead Technical Mentor',
        department: 'Mentors',
        bio: 'With over 10 years of aerospace engineering experience, Elena teaches Vortex structural math, electrical safety, and industrial CAD standards.',
        favTool: 'Vernier Calipers & Torque Wrench',
        favComponent: 'Planetary Gearboxes',
        quote: 'Measure twice, cut once, document always.',
        yearsExperience: 8
      },
      {
        id: 'm2',
        name: 'Dr. Arthur Pendleton',
        role: 'Control Theory Consultant',
        department: 'Mentors',
        bio: 'Arthur is an associate professor of engineering who guides our developers on advanced sensor fusion matrices and smooth acceleration pathing curves.',
        favTool: 'Sensor Probes',
        favComponent: 'Bosch BNO055 IMU',
        quote: 'Acceleration is continuous, control must be active.',
        yearsExperience: 5
      },
      {
        id: 'm3',
        name: 'Sarah Vance',
        role: 'Sponsorship & Outreach Advisor',
        department: 'Mentors',
        bio: 'Sarah coaches the design team on budgeting, industry partner presentations, public speaking, and building a sustainable high school robotics brand.',
        favTool: 'Sponsorship Pitch Deck',
        favComponent: 'Engineering Portfolio',
        quote: 'Robotics is an enterprise, treat it like one.',
        yearsExperience: 4
      },
      {
        id: 'm4',
        name: 'Marcus Chen',
        role: 'Manufacturing & Machining Mentor',
        department: 'Mentors',
        bio: 'A veteran machinist and shop owner who teaches safe operation of CNC routers, manual lathe operations, and close-tolerance chassis fabrication.',
        favTool: 'CNC Mill',
        favComponent: 'Custom Solid Billet Chassis',
        quote: 'Friction is the enemy, precision is the antidote.',
        yearsExperience: 6
      },
      {
        id: 'm5',
        name: 'Dr. Lisa Sterling',
        role: 'Software & Logic Advisor',
        department: 'Mentors',
        bio: 'A research systems software architect who guides the programming sub-division in thread-safe multi-threading, custom telemetry loops, and vision processing filters.',
        favTool: 'Debugger',
        favComponent: 'Intel RealSense depth camera',
        quote: 'Threads are parallel, logic is singular.',
        yearsExperience: 7
      }
    ];
    return [...teamMembers, ...mentorsList];
  });

  const [pedroPathing, setPedroPathing] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_pedro_pathing');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { 
        id: 1, 
        name: 'Pedro Pathing Setup', 
        desc: 'Core library installation script to drive Mecanum drivetrains with sub-millimeter trajectory accuracy.',
        details: 'Setup requires importing the `pedropathing` library in Android Studio. The primary class `Follower` controls coordinate kinematics.\n\nInitialize using:\nfollower = new Follower(hardwareMap);\n\nDefine linear coefficients inside your robot configuration files to synchronize odometry track widths.',
        cta: 'GO TO CODE GITHUB'
      },
      { 
        id: 7, 
        name: 'Braking Distance Optimizer', 
        desc: 'Configure motor voltage braking routines to stop precisely in front of high-junction grids.',
        details: 'Determines ideal deceleration triggers based on immediate distance remaining, actively stopping the robot weight within 15 milliseconds of reaching target layout.',
        cta: 'OPTIMIZER TESTER'
      },
      { 
        id: 8, 
        name: 'Error Tolerance Modifier', 
        desc: 'Adaptive feedback correction bounds to trigger dynamic replanning during high speed crashes.',
        details: 'Triggers dynamic local spline replanning if the translation error gets larger than 2.0 inches, bypassing physical chassis collisions with opponent robots.',
        cta: 'TRIGGER MODIFIERS'
      },
      { 
        id: 9, 
        name: 'Telemetry Log Dump', 
        desc: 'Store local debugging coordinate arrays directly within the REV Control Hub flash modules.',
        details: 'Logs timestamps (t), actual coordinates (x, y, Theta), target coordinates, loop-time frequencies (Hz), and battery voltage directly to local CSV arrays for playback.',
        cta: 'DUMP LOG DATA'
      },
      { 
        id: 10, 
        name: 'Sensor Fusion Matrix', 
        desc: 'Incorporate Pinpoint hub encoders together with modern IMU gyroscopes for angle correction.',
        details: 'Fuses high-frequency hardware odometry trackers together with the internal Bosch IMU gyroscopes using a complementary velocity filter, completely eliminating rotational drift.',
        cta: 'FUSION ANALYSIS'
      }
    ];
  });

  const [sharedAssets, setSharedAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_custom_shared_assets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { 
        name: 'Dynamic Team Budget & BOM Planner', 
        icon: 'Wrench', 
        desc: 'Interactive parts and ledger manager. Budget structural assemblies, aluminum structures, electronics, and weights in real-time.',
        isTool: true,
        target: 'bom',
        cta: 'LAUNCH PLANNER',
        details: 'Vortex direct online Bill of Materials planner utility. Real-time cost, weight calculations, custom suppliers, priority matrices, and threshold indicators.'
      },
      { 
        name: 'Center of Mass Coordinator Tool', 
        icon: 'Cpu', 
        desc: 'Simulate structural load points on an 18" virtual FTC-sizing bounding mesh in 3D. Predict center-of-gravity elevations.',
        isTool: true,
        target: 'com-calc',
        cta: 'LAUNCH CALCULATOR',
        details: 'Calculates overall structural centroid gravity values including height boundaries. Identifies active tipping and corner load risk metrics with a vector matrix plot.'
      },
      { 
        name: 'OnShape CAD Workspace', 
        icon: 'Box', 
        desc: 'Complete 3D CAD modeling archive of the Vortex competition robot. Access open-source robot models, drive pods, and assemblies.',
        isTool: false,
        target: 'https://cad.onshape.com',
        cta: 'OPEN WORKSPACE',
        details: 'Our OnShape workspace contains the full parametric assemblies for the custom Mecanum chassis frame, cascading elevators, active claws, and electronics bracketry. Useful for inspecting material volumes.'
      },
      { 
        name: 'Engineering Portfolio Archives', 
        icon: 'BookOpen', 
        desc: 'Our interactive global portfolio sharing center. Upload, browse, and filter engineering portfolios by awards won.',
        isTool: true,
        target: 'portfolios',
        cta: 'LAUNCH PORTFOLIO HUB',
        details: 'A specialized platform enabling robotics teams globally to submit and curate their engineering notebooks, filter by awards (like Inspire and Think), and browse digital A4 specifications.'
      }
    ];
  });

  const [adminModalType, setAdminModalType] = useState<'gallery' | 'sponsor' | 'roster' | 'resource' | null>(null);
  const [adminModalEditId, setAdminModalEditId] = useState<any>(null);
  const [adminModalFields, setAdminModalFields] = useState<any>({});

  const updateGallery = async (newGallery: any) => {
    setGallery(newGallery);
    localStorage.setItem('vortex_custom_gallery', JSON.stringify(newGallery));
    if (db) {
      const activeUser = auth?.currentUser || currentUser;
      const userEmailLower = activeUser?.email?.toLowerCase();
      const isAdminEmail = !!(activeUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "gallery"), {
            items: newGallery,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync gallery to Firestore:", e);
        }
      } else {
        alert("⚠️ Local Only Mode: You are editing locally. To make these gallery cards visible on other devices immediately, please click the 'Sync with Google' button on the bottom black toolbar and log in as an administrator.");
      }
    }
  };

  const updateSponsors = async (newSponsors: any) => {
    setSponsorsState(newSponsors);
    localStorage.setItem('vortex_custom_sponsors', JSON.stringify(newSponsors));
    if (db) {
      const activeUser = auth?.currentUser || currentUser;
      const userEmailLower = activeUser?.email?.toLowerCase();
      const isAdminEmail = !!(activeUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "sponsors"), {
            items: newSponsors,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync sponsors to Firestore:", e);
        }
      } else {
        alert("⚠️ Local Only Mode: You are editing locally. To make these sponsor cards visible on other devices immediately, please click the 'Sync with Google' button on the bottom black toolbar and log in as an administrator.");
      }
    }
  };

  const updateRoster = async (newRoster: any) => {
    setRoster(newRoster);
    localStorage.setItem('vortex_custom_roster', JSON.stringify(newRoster));
    if (db) {
      const activeUser = auth?.currentUser || currentUser;
      const userEmailLower = activeUser?.email?.toLowerCase();
      const isAdminEmail = !!(activeUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "roster"), {
            items: newRoster,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync roster to Firestore:", e);
        }
      } else {
        alert("⚠️ Local Only Mode: You are editing locally. To make these roster cards visible on other devices immediately, please click the 'Sync with Google' button on the bottom black toolbar and log in as an administrator.");
      }
    }
  };

  const updatePedroPathing = async (newItems: any) => {
    setPedroPathing(newItems);
    localStorage.setItem('vortex_custom_pedro_pathing', JSON.stringify(newItems));
    if (db) {
      const activeUser = auth?.currentUser || currentUser;
      const userEmailLower = activeUser?.email?.toLowerCase();
      const isAdminEmail = !!(activeUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "pedro_pathing"), {
            items: newItems,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync pedro_pathing to Firestore:", e);
        }
      } else {
        alert("⚠️ Local Only Mode: You are editing locally. To make these trajectory spec cards visible on other devices immediately, please click the 'Sync with Google' button on the bottom black toolbar and log in as an administrator.");
      }
    }
  };

  const updateSharedAssets = async (newItems: any) => {
    setSharedAssets(newItems);
    localStorage.setItem('vortex_custom_shared_assets', JSON.stringify(newItems));
    if (db) {
      const activeUser = auth?.currentUser || currentUser;
      const userEmailLower = activeUser?.email?.toLowerCase();
      const isAdminEmail = !!(activeUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com"));
      if (isAdminEmail) {
        try {
          await setDoc(doc(db, "custom_data", "shared_assets"), {
            items: newItems,
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to sync shared_assets to Firestore:", e);
        }
      } else {
        alert("⚠️ Local Only Mode: You are editing locally. To make these interactive tool cards visible on other devices immediately, please click the 'Sync with Google' button on the bottom black toolbar and log in as an administrator.");
      }
    }
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbReplacements, setDbReplacements] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vortex_text_replacements');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [firebaseAuthError, setFirebaseAuthError] = useState<string | null>(null);
  const [firebaseSyncError, setFirebaseSyncError] = useState<string | null>(null);

  const getTextReplacement = (selector: string, fallback: string) => {
    if (dbReplacements && dbReplacements[selector]) {
      return dbReplacements[selector];
    }
    try {
      const savedText = localStorage.getItem('vortex_text_replacements');
      if (savedText) {
        const parsed = JSON.parse(savedText);
        if (parsed[selector]) {
          return parsed[selector];
        }
      }
    } catch (e) {}
    return fallback;
  };

  // Register Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Universal real-time Firestore synchronization
  useEffect(() => {
    // Validate connection to Firestore as requested by skill guideline
    const validateConn = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setFirebaseSyncError(null);
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration: client is offline.");
          setFirebaseSyncError("Please check your Firebase configuration. The client is currently offline.");
        } else {
          console.log("Firestore ready or test document restricted (expected under strict security rules):", error instanceof Error ? error.message : String(error));
        }
      }
    };
    validateConn();

    // Register active real-time subscriber for site-wide text, image, and link edits
    const unsubscribeText = onSnapshot(collection(db, "text_replacements"), (snapshot) => {
      const liveReplacements: Record<string, string> = {};
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        if (data && data.selector && typeof data.text === 'string') {
          liveReplacements[data.selector] = data.text;
        }
      });

      // Synchronize back to local storage seamlessly so all components retrieve it
      localStorage.setItem('vortex_text_replacements', JSON.stringify(liveReplacements));
      setDbReplacements(liveReplacements);
      restoreAllTextNodes();
      setFirebaseSyncError(null);
    }, (error) => {
      const errMsg = error instanceof Error ? error.message : String(error);
      setFirebaseSyncError(`Firestore local fallback active. Sync is pending rules/database setup on your custom Firebase project: ${errMsg}`);
      
      // Keep exact required diagnostic format for AI Studio verification systems in console logs
      const errInfo: FirestoreErrorInfo = {
        error: errMsg,
        authInfo: {
          userId: auth?.currentUser?.uid || null,
          email: auth?.currentUser?.email || null,
          emailVerified: auth?.currentUser?.emailVerified || null,
          isAnonymous: auth?.currentUser?.isAnonymous || null,
          tenantId: auth?.currentUser?.tenantId || null,
          providerInfo: auth?.currentUser?.providerData?.map(provider => ({
            providerId: provider.providerId,
            email: provider.email,
          })) || []
        },
        operationType: OperationType.GET,
        path: "text_replacements"
      };
      console.warn("Firestore Error Details logged gracefully: ", JSON.stringify(errInfo));
    });

    const unsubscribeImages = onSnapshot(collection(db, "image_replacements"), (snapshot) => {
      const liveImages: Record<string, string> = {};
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        if (data && data.selector && typeof data.src === 'string') {
          liveImages[data.selector] = data.src;
        }
      });
      localStorage.setItem('vortex_image_replacements', JSON.stringify(liveImages));
      restoreAllTextNodes();
    }, (error) => {
      console.warn("Firestore image subscription inactive (expected in offline/pre-deployment scenarios):", error);
    });

    const unsubscribeLinks = onSnapshot(collection(db, "link_replacements"), (snapshot) => {
      const liveLinks: Record<string, string> = {};
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        if (data && data.selector && typeof data.href === 'string') {
          liveLinks[data.selector] = data.href;
        }
      });
      localStorage.setItem('vortex_link_replacements', JSON.stringify(liveLinks));
      restoreAllTextNodes();
    }, (error) => {
      console.warn("Firestore link subscription inactive (expected in offline/pre-deployment scenarios):", error);
    });

    // Real-time synchronization of gallery items
    const unsubscribeGallery = onSnapshot(doc(db, "custom_data", "gallery"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setGallery(data.items);
          localStorage.setItem('vortex_custom_gallery', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Firestore gallery subscription inactive:", error);
    });

    // Real-time synchronization of sponsors
    const unsubscribeSponsors = onSnapshot(doc(db, "custom_data", "sponsors"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setSponsorsState(data.items);
          localStorage.setItem('vortex_custom_sponsors', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Firestore sponsors subscription inactive:", error);
    });

    // Real-time synchronization of team roster
    const unsubscribeRoster = onSnapshot(doc(db, "custom_data", "roster"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setRoster(data.items);
          localStorage.setItem('vortex_custom_roster', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Firestore roster subscription inactive:", error);
    });

    // Real-time synchronization of robot specs/pedro pathing
    const unsubscribePedroPathing = onSnapshot(doc(db, "custom_data", "pedro_pathing"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setPedroPathing(data.items);
          localStorage.setItem('vortex_custom_pedro_pathing', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Firestore pedro_pathing subscription inactive:", error);
    });

    // Real-time synchronization of shared assets/resources
    const unsubscribeSharedAssets = onSnapshot(doc(db, "custom_data", "shared_assets"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setSharedAssets(data.items);
          localStorage.setItem('vortex_custom_shared_assets', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.warn("Firestore shared_assets subscription inactive:", error);
    });

    return () => {
      unsubscribeText();
      unsubscribeImages();
      unsubscribeLinks();
      unsubscribeGallery();
      unsubscribeSponsors();
      unsubscribeRoster();
      unsubscribePedroPathing();
      unsubscribeSharedAssets();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setFirebaseAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn("Authentication Error observed:", err);
      if (err instanceof Error) {
        if (err.message.includes('auth/operation-not-allowed')) {
          setFirebaseAuthError("Google Sign-In is disabled on your custom Firebase project. Please enable 'Google' inside the Sign-In methods settings in the Firebase Console.");
        } else {
          setFirebaseAuthError(err.message);
        }
      } else {
        setFirebaseAuthError(String(err));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseAuthError(null);
    } catch (err) {
      console.warn("Sign Out Error observed:", err);
    }
  };

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('vortex_sys_config_unlocked') === 'true';
  });
  const [editingElement, setEditingElement] = useState<{ 
    selector: string; 
    tagName: string; 
    text?: string;
    link?: string;
    linkSelector?: string;
    isImage?: boolean;
    imageSrc?: string;
  } | null>(null);
  const [hoveredElement, setHoveredElement] = useState<{ 
    selector: string; 
    rect: DOMRect; 
    tagName: string; 
    text?: string;
    link?: string;
    linkSelector?: string;
    isImage?: boolean;
    imageSrc?: string;
    element: HTMLElement;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sponsorText, setSponsorText] = useState('');

  // Synchronously restore custom CMS nodes before browser paints to prevent flicker
  React.useLayoutEffect(() => {
    restoreAllTextNodes();
  }, [activePage, currentSlide, isUnlocked, currentUser, dbReplacements]);

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error' | 'pending_activation'>('idle');
  const [contactServerMessage, setContactServerMessage] = useState('');
  const [isDraftAutosaved, setIsDraftAutosaved] = useState(false);

  // New Features: Team Filter and Resource Search States
  const [teamFilter, setTeamFilter] = useState<'All' | 'Mechanical' | 'Software' | 'Design & Outreach' | 'All-Rounder'>('All');
  const [teamSearch, setTeamSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [activeResourceDetail, setActiveResourceDetail] = useState<{
    name: string;
    desc: string;
    icon: any;
    details?: string;
    isTool?: boolean;
    target?: string;
    cta?: string;
  } | null>(null);

  // Auto-save contact form drafts
  useEffect(() => {
    const savedName = localStorage.getItem('vortex_draft_name');
    const savedEmail = localStorage.getItem('vortex_draft_email');
    const savedMessage = localStorage.getItem('vortex_draft_message');
    if (savedName) setContactName(savedName);
    if (savedEmail) setContactEmail(savedEmail);
    if (savedMessage) setContactMessage(savedMessage);
    if (savedName || savedEmail || savedMessage) {
      setIsDraftAutosaved(true);
    }
  }, []);

  useEffect(() => {
    if (contactName) {
      localStorage.setItem('vortex_draft_name', contactName);
      setIsDraftAutosaved(true);
    } else {
      localStorage.removeItem('vortex_draft_name');
    }
  }, [contactName]);

  useEffect(() => {
    if (contactEmail) {
      localStorage.setItem('vortex_draft_email', contactEmail);
      setIsDraftAutosaved(true);
    } else {
      localStorage.removeItem('vortex_draft_email');
    }
  }, [contactEmail]);

  useEffect(() => {
    if (contactMessage) {
      localStorage.setItem('vortex_draft_message', contactMessage);
      setIsDraftAutosaved(true);
    } else {
      localStorage.removeItem('vortex_draft_message');
    }
  }, [contactMessage]);

  useEffect(() => {
    if (!contactName && !contactEmail && !contactMessage) {
      setIsDraftAutosaved(false);
    }
  }, [contactName, contactEmail, contactMessage]);

  // Handle live global CMS text edits and restoration logic when unlocked
  useEffect(() => {
    // Force immediate text restoration
    restoreAllTextNodes();

    if (isUnlocked) {
      const handleGlobalClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        // Skip interactive control toolbars and popovers
        if (target.closest('#cms-control-toolbar, #cms-editor-popover, #theme-engine-popover-container, .flatpickr-calendar, #cms-hover-badge')) {
          return;
        }

        // Avoid breaking input controls
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          return;
        }

        // Handle overridden links on click when unlocked so they navigate properly too
        const clickable = target.closest('a, button, .cursor-pointer') as HTMLElement | null;
        if (!clickable) return;

        const selector = getElementSelector(clickable);
        const savedLinksText = localStorage.getItem('vortex_link_replacements');
        if (savedLinksText) {
          try {
            const savedLinks = JSON.parse(savedLinksText);
            const overriddenLink = savedLinks[selector];
            if (overriddenLink) {
              e.preventDefault();
              e.stopPropagation();
              
              if (overriddenLink.startsWith('http://') || overriddenLink.startsWith('https://')) {
                window.open(overriddenLink, '_blank', 'noopener,noreferrer');
              } else {
                navigateTo(overriddenLink);
              }
            }
          } catch (err) {}
        }
      };

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        // Skip popovers, tools, and the overlay banner itself
        if (target.closest('#cms-control-toolbar, #cms-editor-popover, #theme-engine-popover-container, .flatpickr-calendar, #cms-hover-badge')) {
          return;
        }

        if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target.tagName)) {
          return;
        }

        const imgEl = (target.tagName === 'IMG' ? target : (target.closest('img') || target.querySelector('img'))) as HTMLImageElement | null;
        
        let edible: HTMLElement | null = null;
        let isImg = false;
        let link: string | undefined = undefined;
        let linkSel: string | undefined = undefined;
        let text: string | undefined = undefined;

        if (imgEl) {
          edible = imgEl;
          isImg = true;
          const parentAnchor = imgEl.closest('a') as HTMLAnchorElement | null;
          link = parentAnchor ? parentAnchor.getAttribute('href') || '' : undefined;
          linkSel = parentAnchor ? getElementSelector(parentAnchor) : undefined;
        } else {
          // Check if target is a clean text block first (rather than matching cursor-pointer parents immediately)
          const TEXT_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LI', 'LABEL', 'EM', 'STRONG', 'B', 'I', 'SMALL', 'FIGCAPTION', 'TH', 'TD', 'BUTTON', 'A'];
          const isTextTag = TEXT_TAGS.includes(target.tagName);
          const rawText = getElementText(target);
          const hasContent = rawText && rawText.trim().length > 0;

          if (isTextTag && hasContent) {
            edible = target;
            text = rawText;
          } else {
            // Check direct text node children for custom tags
            const hasTextChild = Array.from(target.childNodes).some(child => child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim());
            if (hasTextChild && hasContent) {
              edible = target;
              text = rawText;
            }
          }

          // If we found an individual text block, grab the parent's clickable target link so we can still edit both text & link together
          if (edible) {
            const parentAnchor = target.closest('a') as HTMLAnchorElement | null;
            const parentButton = target.closest('button') as HTMLButtonElement | null;
            const parentCursorPointer = target.closest('.cursor-pointer') as HTMLElement | null;

            if (parentAnchor) {
              link = parentAnchor.getAttribute('href') || '';
              linkSel = getElementSelector(parentAnchor);
            } else if (parentButton) {
              linkSel = getElementSelector(parentButton);
              const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
              link = savedLinks[linkSel] || '';
            } else if (parentCursorPointer) {
              linkSel = getElementSelector(parentCursorPointer);
              const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
              link = savedLinks[linkSel] || '';
            }
          } else {
            // Fall back to actual clickable buttons/links if they don't have direct text but are wrappers
            const anchorEl = target.closest('a') as HTMLAnchorElement | null;
            const buttonEl = target.closest('button') as HTMLButtonElement | null;
            const cursorPointerEl = target.closest('.cursor-pointer') as HTMLElement | null;

            if (anchorEl) {
              edible = anchorEl;
              link = anchorEl.getAttribute('href') || '';
              linkSel = getElementSelector(anchorEl);
              text = getElementText(anchorEl);
            } else if (buttonEl) {
              edible = buttonEl;
              const selector = getElementSelector(buttonEl);
              const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
              link = savedLinks[selector] || '';
              linkSel = selector;
              text = getElementText(buttonEl);
            } else if (cursorPointerEl) {
              edible = cursorPointerEl;
              const selector = getElementSelector(cursorPointerEl);
              const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
              link = savedLinks[selector] || '';
              linkSel = selector;
              text = getElementText(cursorPointerEl);
            }
          }
        }

        if (edible) {
          const selector = getElementSelector(edible);
          const rect = edible.getBoundingClientRect();

          if (hoveredElement && hoveredElement.selector === selector) {
            const dy = Math.abs(hoveredElement.rect.top - rect.top);
            const dx = Math.abs(hoveredElement.rect.left - rect.left);
            const dw = Math.abs(hoveredElement.rect.width - rect.width);
            const dh = Math.abs(hoveredElement.rect.height - rect.height);
            if (dy < 1 && dx < 1 && dw < 1 && dh < 1) {
              return;
            }
          }

          setHoveredElement({
            selector,
            rect,
            tagName: edible.tagName,
            text,
            link,
            linkSelector: linkSel,
            isImage: isImg,
            imageSrc: isImg ? (edible as HTMLImageElement).src : undefined,
            element: edible
          });
        } else {
          if (!target.closest('#cms-hover-badge')) {
            setHoveredElement(null);
          }
        }
      };

      const handleScrollOrResize = () => {
        setHoveredElement(prev => {
          if (!prev || !prev.element) return null;
          const el = document.querySelector(prev.selector) as HTMLElement;
          if (el) {
            return {
              ...prev,
              rect: el.getBoundingClientRect()
            };
          }
          return null;
        });
      };

      const handleDragOver = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        const imgEl = (target.tagName === 'IMG' ? target : (target.closest('img') || target.querySelector('img'))) as HTMLImageElement | null;
        if (imgEl) {
          e.preventDefault();
          imgEl.classList.add('ring-4', 'ring-cyan-500', 'ring-offset-2', 'scale-[1.03]', 'transition-all', 'duration-300');
        }
      };

      const handleDragLeave = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        const imgEl = (target.tagName === 'IMG' ? target : (target.closest('img') || target.querySelector('img'))) as HTMLImageElement | null;
        if (imgEl) {
          imgEl.classList.remove('ring-4', 'ring-cyan-500', 'ring-offset-2', 'scale-[1.03]');
        }
      };

      const handleDrop = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        const imgEl = (target.tagName === 'IMG' ? target : (target.closest('img') || target.querySelector('img'))) as HTMLImageElement | null;
        if (imgEl) {
          e.preventDefault();
          imgEl.classList.remove('ring-4', 'ring-cyan-500', 'ring-offset-2', 'scale-[1.03]');
          
          const files = e.dataTransfer?.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                const selector = getElementSelector(imgEl);
                
                try {
                  // Save locally
                  const saved = localStorage.getItem('vortex_image_replacements') || '{}';
                  const parsed = JSON.parse(saved);
                  parsed[selector] = base64;
                  localStorage.setItem('vortex_image_replacements', JSON.stringify(parsed));
                  
                  // Apply immediately
                  imgEl.src = base64;
                  
                  // Sync with Firestore if admin
                  const userEmailLower = currentUser?.email?.toLowerCase();
                  const isAdminEmail = currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com");
                  if (isAdminEmail) {
                    const docId = btoa(selector).replace(/\//g, '_').replace(/=/g, '');
                    await setDoc(doc(db, "image_replacements", docId), {
                      selector: selector,
                      src: base64,
                      updatedAt: serverTimestamp()
                    });
                  }
                } catch (err) {
                  console.warn("Failed to set/sync dropped image:", err);
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      };

      document.addEventListener('click', handleGlobalClick, true);
      document.addEventListener('mouseover', handleMouseOver, true);
      window.addEventListener('scroll', handleScrollOrResize, { passive: true });
      window.addEventListener('resize', handleScrollOrResize, { passive: true });
      document.addEventListener('dragover', handleDragOver, true);
      document.addEventListener('dragleave', handleDragLeave, true);
      document.addEventListener('drop', handleDrop, true);

      // Continuously enforce restored states safely
      const interval = setInterval(() => {
        restoreAllTextNodes();
      }, 350);

      return () => {
        document.removeEventListener('click', handleGlobalClick, true);
        document.removeEventListener('mouseover', handleMouseOver, true);
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
        document.removeEventListener('dragover', handleDragOver, true);
        document.removeEventListener('dragleave', handleDragLeave, true);
        document.removeEventListener('drop', handleDrop, true);
        clearInterval(interval);
      };
    } else {
      const handleLockedClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        // Skip interactive components inside toolbars
        if (target.closest('#cms-control-toolbar, #cms-editor-popover, #theme-engine-popover-container, .flatpickr-calendar')) {
          return;
        }

        const clickable = target.closest('a, button, .cursor-pointer') as HTMLElement | null;
        if (!clickable) return;

        const selector = getElementSelector(clickable);
        const savedLinksText = localStorage.getItem('vortex_link_replacements');
        if (savedLinksText) {
          try {
            const savedLinks = JSON.parse(savedLinksText);
            const overriddenLink = savedLinks[selector];
            if (overriddenLink) {
              e.preventDefault();
              e.stopPropagation();
              
              if (overriddenLink.startsWith('http://') || overriddenLink.startsWith('https://')) {
                window.open(overriddenLink, '_blank', 'noopener,noreferrer');
              } else {
                navigateTo(overriddenLink);
              }
            }
          } catch (err) {}
        }
      };

      document.addEventListener('click', handleLockedClick, true);

      const interval = setInterval(() => {
        restoreAllTextNodes();
      }, 500);
      return () => {
        document.removeEventListener('click', handleLockedClick, true);
        clearInterval(interval);
      };
    }
  }, [isUnlocked, activePage, currentUser, hoveredElement]);

  // Floating Scroll to Top and FAQ states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dropdown menus state declarations
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  // Animated placeholder typewriter states
  const [namePlaceholder, setNamePlaceholder] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('');
  const [messagePlaceholder, setMessagePlaceholder] = useState('');

  // Style customization / theme engine states
  const [theme, setTheme] = useState<'light' | 'custom'>('custom');
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Custom colors state: default values represent a nice sleek cosmic style
  const [customBg, setCustomBg] = useState('#0a0a23');
  const [customText, setCustomText] = useState('#ffffff');
  const [customAccent, setCustomAccent] = useState('#00f0ff');
  const [customCardBg, setCustomCardBg] = useState('#131338');
  const [customBorder, setCustomBorder] = useState('#2563eb');
  const [customNavOpacity, setCustomNavOpacity] = useState(0.20);

  // Hex to RGB parser helper
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Cursor glow style configuration states (Default color is teal)
  const [cursorGlowEnabled, setCursorGlowEnabled] = useState(true);
  const [cursorGlowColor, setCursorGlowColor] = useState('#14b8a6');
  const [cursorGlowOpacity, setCursorGlowOpacity] = useState(0.35);
  const [cursorGlowSize, setCursorGlowSize] = useState(100);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMouseInWindow, setIsMouseInWindow] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const lastHoveredCardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Disable or bypass on coarse elements (standard capacitive phone/tablet screens)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isMouseInWindow) {
        setIsMouseInWindow(true);
      }

      // Detect if user's cursor is over an element styled like a card or a button
      let isOver = false;
      let cardEl: HTMLElement | null = null;
      let target = e.target as HTMLElement | null;

      // Do not apply cursor glow feature on elements inside a nav bar, navigation tabs, or footer
      const isInsideBypassedArea = target && (
        target.closest('nav') || 
        target.closest('footer') ||
        target.closest('[id*="nav"]') || 
        target.closest('[class*="nav"]') ||
        target.closest('[id*="footer"]') ||
        target.closest('[class*="footer"]')
      );

      if (!isInsideBypassedArea) {
        while (target) {
          if (target.classList && (
            target.tagName === 'BUTTON' ||
            target.getAttribute('role') === 'button' ||
            target.classList.contains('bg-[var(--card-bg)]') ||
            target.classList.contains('card') ||
            target.classList.contains('cursor-pointer') ||
            target.getAttribute('data-glow-card') === 'true' ||
            (typeof target.className === 'string' && (
              target.className.includes('bg-[var(--card-bg)]') ||
              target.className.includes('cursor-pointer')
            )) ||
            target.getAttribute('id')?.includes('card')
          )) {
            cardEl = target;
            isOver = true;
            break;
          }
          target = target.parentElement;
        }
      }

      // If we hovered over a different card or left the card completely
      if (cardEl !== lastHoveredCardRef.current) {
        if (lastHoveredCardRef.current) {
          lastHoveredCardRef.current.classList.remove('glow-card-target');
          lastHoveredCardRef.current.style.removeProperty('--mouse-x');
          lastHoveredCardRef.current.style.removeProperty('--mouse-y');
          lastHoveredCardRef.current.style.removeProperty('--glow-opacity-var');
        }
        lastHoveredCardRef.current = cardEl;
      }

      if (cardEl && cursorGlowEnabled) {
        setIsHoveringCard(true);
        if (!cardEl.classList.contains('glow-card-target')) {
          cardEl.classList.add('glow-card-target');
        }
        const rect = cardEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardEl.style.setProperty('--mouse-x', `${x}px`);
        cardEl.style.setProperty('--mouse-y', `${y}px`);
        cardEl.style.setProperty('--glow-opacity-var', String(cursorGlowOpacity));
      } else {
        setIsHoveringCard(false);
      }
    };

    const handleMouseLeave = () => {
      setIsMouseInWindow(false);
      setIsHoveringCard(false);
      if (lastHoveredCardRef.current) {
        lastHoveredCardRef.current.classList.remove('glow-card-target');
        lastHoveredCardRef.current.style.removeProperty('--mouse-x');
        lastHoveredCardRef.current.style.removeProperty('--mouse-y');
        lastHoveredCardRef.current.style.removeProperty('--glow-opacity-var');
        lastHoveredCardRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      setIsMouseInWindow(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (lastHoveredCardRef.current) {
        lastHoveredCardRef.current.classList.remove('glow-card-target');
        lastHoveredCardRef.current.style.removeProperty('--mouse-x');
        lastHoveredCardRef.current.style.removeProperty('--mouse-y');
        lastHoveredCardRef.current.style.removeProperty('--glow-opacity-var');
        lastHoveredCardRef.current = null;
      }
    };
  }, [isMouseInWindow, cursorGlowEnabled, cursorGlowOpacity]);

  // Compute live values depending on active theme mode
  const bgValue = theme === 'light' ? '#ffffff' : customBg;
  const textValue = theme === 'light' ? '#0f172a' : customText;
  const textSecValue = theme === 'light' ? '#4b5563' : (customText + 'bf'); // ~75% opacity for secondary body text
  const accentValue = theme === 'light' ? '#2563eb' : customAccent;
  const cardBgValue = theme === 'light' ? '#f8fafc' : customCardBg;
  const borderValue = theme === 'light' ? '#e2e8f0' : customBorder;
  
  const rgbVal = hexToRgb(customBg);
  const navBgValue = theme === 'light' 
    ? `rgba(255, 255, 255, ${customNavOpacity})` 
    : (rgbVal ? `rgba(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}, ${customNavOpacity})` : `rgba(10, 10, 35, ${customNavOpacity})`);
    
  const footerBgValue = theme === 'light' ? '#f1f5f9' : customBg;
  const btnTextValue = theme === 'light' ? '#ffffff' : '#000035';

  // Toggle Scroll to Top Button on scroll and calculate scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to Home key to trigger smooth scroll to top
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If pressing Home key on page
      if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    if (activePage === 'home' && sponsorsState.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sponsorsState.length);
      }, 4000);
      return () => clearInterval(slideInterval);
    }
  }, [activePage, sponsorsState.length]);

  // Typewriter effect for Name input placeholder
  useEffect(() => {
    const textToType = "Type your name here";
    let index = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const handleType = () => {
      if (!isDeleting) {
        setNamePlaceholder(textToType.substring(0, index + 1));
        index++;
        if (index === textToType.length) {
          isDeleting = true;
          timer = setTimeout(handleType, 2200); // look finished
        } else {
          timer = setTimeout(handleType, 100);
        }
      } else {
        setNamePlaceholder(textToType.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(handleType, 1000); // pause empty
        } else {
          timer = setTimeout(handleType, 60);
        }
      }
    };

    timer = setTimeout(handleType, 600);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for Email input placeholder
  useEffect(() => {
    const textToType = "Type your email here";
    let index = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const handleType = () => {
      if (!isDeleting) {
        setEmailPlaceholder(textToType.substring(0, index + 1));
        index++;
        if (index === textToType.length) {
          isDeleting = true;
          timer = setTimeout(handleType, 2200);
        } else {
          timer = setTimeout(handleType, 100);
        }
      } else {
        setEmailPlaceholder(textToType.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(handleType, 1000);
        } else {
          timer = setTimeout(handleType, 60);
        }
      }
    };

    timer = setTimeout(handleType, 900);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for Message textarea placeholder
  useEffect(() => {
    const ideasList = [
      "What's the process to join this team?",
      "How can I sponsor you?",
      "Can we run autonomous routines together?",
      "Do you want to run some practice games?",
      "Can I request a new idea for the robot?",
      "Can I request a new idea for the website?",
      "Can I request a new idea for the scouting?",
      "Can we run some scrimmage games at your field?",
      "Can we set up an autonomous alliance test?"
    ];
    let ideaIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const handleType = () => {
      const currentIdea = ideasList[ideaIndex];
      if (!isDeleting) {
        setMessagePlaceholder(currentIdea.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentIdea.length) {
          isDeleting = true;
          timer = setTimeout(handleType, 2000); // hold at end of phrase
        } else {
          timer = setTimeout(handleType, 80);
        }
      } else {
        setMessagePlaceholder(currentIdea.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          ideaIndex = (ideaIndex + 1) % ideasList.length;
          timer = setTimeout(handleType, 1000);
        } else {
          timer = setTimeout(handleType, 40);
        }
      }
    };

    timer = setTimeout(handleType, 1200);
    return () => clearTimeout(timer);
  }, []);

  const pages: PageItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'team', label: 'Roster' },
    { id: 'journey', label: 'Our journey' },
    { id: 'awards', label: 'Achievements' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' }
  ];

  const navigateTo = (pageId: PageID) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputName = contactName.trim();
    const inputEmail = contactEmail.trim().toLowerCase();
    const inputMessage = contactMessage.trim();

    if (!inputName || !inputEmail || !inputMessage) return;
    setContactSubmitting(true);
    setContactStatus('idle');
    setContactServerMessage('');

    let newlyUnlocked = false;
    let isAdminAction = false;

    // Check if credentials match the secret authorization token (fully obfuscated in code)
    try {
      const dName = decryptVal([86, 111, 114, 116, 101, 120, 95, 70, 84, 67], 0); // Vortex_FTC
      const dEmail = decryptVal([104, 114, 97, 104, 97, 48, 51, 49, 49, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109], 0); // hraha0311@gmail.com
      const dMsg = decryptVal([79, 112, 101, 110], 0); // Open

      if (inputName === dName && inputEmail === dEmail && inputMessage === dMsg) {
        // Authorize override session instantly, store configuration trigger
        localStorage.setItem('vortex_sys_config_unlocked', 'true');
        setIsUnlocked(true);
        newlyUnlocked = true;
        isAdminAction = true;
      } else if (isUnlocked) {
        isAdminAction = true;
        // Secondary submission when already unlocked: also save the updated info as dynamic fallbacks
        localStorage.setItem('vortex_custom_contact_info_name', inputName);
        localStorage.setItem('vortex_custom_contact_info_email', inputEmail);
        localStorage.setItem('vortex_custom_contact_info_message', inputMessage);

        // Also save all current site text edits right away!
        saveAllTextNodes();
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/Hraha0311@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          _subject: isAdminAction 
            ? `[Admin Logged In] New Team Vortex Contact Inquiry from ${contactName}` 
            : `New Team Vortex Contact Inquiry from ${contactName}`,
          _admin_status: isAdminAction ? 'Admin Session Active' : 'Public User',
          _honey: '', // Honeypot spam protection
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const isSuccess = data.success === true || data.success === 'true';
        
        if (isSuccess) {
          if (newlyUnlocked) {
            setContactStatus('success');
            setContactServerMessage('Admin Logged In! Developer Session Verified and dispatch email successfully routed! Redirecting to CMS Platform...');
            localStorage.removeItem('vortex_draft_name');
            localStorage.removeItem('vortex_draft_email');
            localStorage.removeItem('vortex_draft_message');
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setTimeout(() => {
              navigateTo('portfolios');
            }, 3500);
          } else if (isAdminAction) {
            setContactStatus('success');
            setContactServerMessage('Admin Logged In! Team Inquiry successfully dispatched. Local site configuration and custom contents refreshed!');
            localStorage.removeItem('vortex_draft_name');
            localStorage.removeItem('vortex_draft_email');
            localStorage.removeItem('vortex_draft_message');
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setTimeout(() => {
              navigateTo('home');
            }, 4500);
          } else {
            setContactStatus('success');
            setContactServerMessage(data.message || 'Thank you! Your message has been sent successfully.');
            localStorage.removeItem('vortex_draft_name');
            localStorage.removeItem('vortex_draft_email');
            localStorage.removeItem('vortex_draft_message');
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setTimeout(() => {
              navigateTo('home');
            }, 6500);
          }
        } else {
          // If response is OK but success is false, FormSubmit requires email activation first.
          setContactStatus('pending_activation');
          setTimeout(() => {
            navigateTo('home');
          }, 6500);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setContactServerMessage(errorData.message || errorData.error || 'Courier rejected submission');
        setContactStatus('error');
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      setContactServerMessage(err?.message || "Check network connection and try again.");
      setContactStatus('error');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col justify-between selection:bg-[var(--accent)]/30 selection:text-[var(--accent)] transition-all duration-300">
      


      {/* Dynamic Style Injection representing the live color palette options and cursor glow styles */}
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

        @keyframes collage-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        @keyframes collage-scroll-right {
          0% { transform: translate3d(-33.3333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-collage-left {
          animation: collage-scroll-left 45s linear infinite;
        }
        .animate-collage-right {
          animation: collage-scroll-right 45s linear infinite;
        }

        ${cursorGlowEnabled ? `
          .glow-card-target {
            position: relative !important;
            overflow: hidden !important;
            isolation: isolate !important;
          }
          /* Using dynamic variables to render the glow effect safely confined within the card borders, behind content */
          .glow-card-target::after {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            pointer-events: none !important;
            z-index: -1 !important;
            background: radial-gradient(
              ${cursorGlowSize}px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
              ${cursorGlowColor} 0%,
              transparent 70%
            ) !important;
            opacity: var(--glow-opacity-var, 0) !important;
            transition: opacity 0.25s ease !important;
          }
        ` : ''}

        /* Custom scrollbar style for theme engine */
        .theme-scrollover::-webkit-scrollbar {
          width: 5px;
        }
        .theme-scrollover::-webkit-scrollbar-track {
          background: transparent;
        }
        .theme-scrollover::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 99px;
        }
        .theme-scrollover::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
      `}</style>
          {/* High-End Design Hover Navigation Bar */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-max max-w-5xl z-40 border border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-md shadow-lg ${
          mobileMenuOpen ? 'rounded-[24px]' : 'rounded-full'
        }`}
        style={{ transition: 'border-radius 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease' }}
        id="hover-navbar"
      >
        <div className="mx-auto flex items-center justify-between md:justify-center gap-4 md:gap-5.5 px-6 py-1.5">
          
          {/* Left-Aligned Logo & Navigation Links Group */}
          <div className="flex items-center gap-4 md:gap-5.5">
            {/* Brand/Logo Layout: Horizontally paired, ultra-slim single line */}
            <div 
              onClick={() => navigateTo('home')} 
              className="flex flex-row items-center gap-2 cursor-pointer select-none group py-1 mr-1"
              id="brand-logo-trigger"
            >
              <img 
                src={vortexLogo} 
                alt="Vortex logo badge" 
                className="h-7 w-7 object-contain transition duration-200 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="font-sans text-sm font-black tracking-[0.2em] text-[var(--text-primary)] uppercase transition duration-200 group-hover:text-[var(--accent)]">
                VORTEX
              </span>
            </div>

            {/* Desktop Navigation Link Nodes */}
            <div className="hidden md:flex items-center gap-5">
              {/* Home Link */}
              <button
                onClick={() => navigateTo('home')}
                className={`text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer relative py-2 ${
                  activePage === 'home'
                    ? 'text-[var(--accent)] font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                }`}
                id="nav-link-home"
              >
                <span>Home</span>
                {activePage === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--accent)] rounded-full" />
                )}
              </button>

              {/* About Dropdown node */}
              <div 
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer relative py-2 flex items-center gap-1 ${
                    activePage === 'journey' || activePage === 'team' || activePage === 'awards'
                      ? 'text-[var(--accent)] font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                  }`}
                  id="nav-link-about"
                >
                  <span>About</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : 'rotate-0'}`} />
                  {(activePage === 'journey' || activePage === 'team' || activePage === 'awards') && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--accent)] rounded-full" />
                  )}
                </button>
                
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1.5 shadow-2xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          navigateTo('journey');
                          setAboutOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          activePage === 'journey'
                            ? 'text-[var(--accent)] bg-[var(--accent)]/5 font-extrabold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border)]/30'
                        }`}
                      >
                        Our journey
                      </button>
                      <button
                        onClick={() => {
                          navigateTo('team');
                          setAboutOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          activePage === 'team'
                            ? 'text-[var(--accent)] bg-[var(--accent)]/5 font-extrabold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border)]/30'
                        }`}
                      >
                        Roster
                      </button>
                      <button
                        onClick={() => {
                          navigateTo('awards');
                          setAboutOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          activePage === 'awards'
                            ? 'text-[var(--accent)] bg-[var(--accent)]/5 font-extrabold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--border)]/30'
                        }`}
                      >
                        Awards
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Link nodes (Gallery, Resources, Contact) */}
              {pages.filter(p => !['home', 'team', 'journey', 'awards'].includes(p.id)).map((p) => {
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
          </div>

          {/* Solid CTAs and controls */}
          <div className="flex items-center gap-2 md:gap-2.5">
            
            <button
              onClick={() => navigateTo('contact')}
              className="hidden sm:inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 active:scale-98 transition duration-200 cursor-pointer"
              id="cta-nav-button"
            >
              Get In Touch
            </button>
            
            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] md:hidden cursor-pointer text-[var(--text-secondary)] hover:text-[var(--accent)] transition duration-150"
              title="Toggle Navigation Menu"
              id="mobile-navigation-trigger"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Custom Theme Popover Control Box in Top-Right Corner */}
            <div className="relative inline-block text-left" id="theme-engine-popover-container">
              <button
                onClick={() => setCustomizerOpen(!customizerOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 active:scale-98 transition duration-150 cursor-pointer"
                id="theme-customizer-toggle"
                title="Style customizer setting controls"
              >
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              </button>

              {customizerOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-3rem)] sm:max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-2xl z-50 text-left"
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

                  {/* Scrollable Container so all style adjustments are compact and completely visible in viewports */}
                  <div className="max-h-[350px] overflow-y-auto theme-scrollover pr-1.5 flex flex-col gap-3.5 select-none">

                  {/* Mode Selector Option Blocks */}
                  <div className="flex gap-2 p-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full mb-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${
                        theme === 'light' 
                          ? 'bg-[var(--accent)] text-[var(--btn-text)] shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      White Theme
                    </button>
                    <button
                      onClick={() => setTheme('custom')}
                      className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${
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

                      {/* Dynamic Nav Opacity Range Control */}
                      <div className="flex flex-col gap-1.5 bg-[var(--bg-primary)] p-2.5 rounded-lg border border-[var(--border)]">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Nav opacity</label>
                            <span className="text-[9px] text-[var(--text-secondary)] block">Set custom transparency</span>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--accent)] font-bold">{Math.round(customNavOpacity * 100)}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0.3"
                          max="1.0"
                          step="0.05"
                          value={customNavOpacity}
                          onChange={(e) => setCustomNavOpacity(parseFloat(e.target.value))}
                          className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                          title="Choose navbar custom opacity level"
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
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#131338] border border-[#2563eb] text-[#00f0ff] rounded-full hover:opacity-90"
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
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#12161a] border border-zinc-700 text-[#1ed760] rounded-full hover:opacity-90"
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
                            className="text-[9px] font-extrabold uppercase py-1 px-1 bg-[#312e81] border border-indigo-500 text-[#f5f3ff] rounded-full hover:opacity-90"
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

                  {/* Interactive Cursor Glow Controls */}
                  <div className="mt-4 border-t border-[var(--border)] pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Cursor Glow</span>
                        <span className="text-[9px] text-[var(--text-secondary)] block">Ambient light overlays on content cards</span>
                      </div>
                      <button
                        onClick={() => setCursorGlowEnabled(!cursorGlowEnabled)}
                        className={`relative inline-flex h-5.5 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                          cursorGlowEnabled ? 'bg-[var(--accent)]' : 'bg-stone-600'
                        }`}
                        title="Toggle cursor glow"
                        type="button"
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                            cursorGlowEnabled ? 'translate-x-[24px]' : 'translate-x-[4px]'
                          }`}
                        />
                      </button>
                    </div>

                    {cursorGlowEnabled && (
                      <div className="flex flex-col gap-2.5 bg-[var(--bg-primary)] p-2.5 rounded-lg border border-[var(--border)] animate-fade-in text-left">
                        {/* Glow Color Selector */}
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2">
                          <div className="text-left">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Glow Color</label>
                            <span className="text-[9px] text-[var(--text-secondary)] block">Real-time light orb shade</span>
                          </div>
                          <input 
                            type="color" 
                            value={cursorGlowColor} 
                            onChange={(e) => setCursorGlowColor(e.target.value)} 
                            className="h-8 w-14 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                            title="Choose cursor glow color"
                          />
                        </div>

                        {/* Live Opacity Slider */}
                        <div className="flex flex-col gap-1.5 pt-1 border-b border-[var(--border)] pb-2.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Glow Opacity</label>
                            <span className="text-[10px] font-mono text-[var(--accent)] font-bold">{Math.round(cursorGlowOpacity * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.05" 
                            max="1.00" 
                            step="0.05"
                            value={cursorGlowOpacity} 
                            onChange={(e) => setCursorGlowOpacity(parseFloat(e.target.value))} 
                            className="w-full accent-[var(--accent)] h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                            title="Set cursor glow opacity level"
                          />
                        </div>

                        {/* Live Size Slider */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-extrabold block">Glow Size</label>
                            <span className="text-[10px] font-mono text-[var(--accent)] font-bold">{cursorGlowSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="40" 
                            max="600" 
                            step="10"
                            value={cursorGlowSize} 
                            onChange={(e) => setCursorGlowSize(parseInt(e.target.value))} 
                            className="w-full accent-[var(--accent)] h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                            title="Set cursor glow area size"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Navigation Drawer with smooth height & opacity toggle animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 py-4 flex flex-col gap-2 md:hidden rounded-b-[24px] overflow-hidden" 
              id="mobile-menu-drawer"
            >
              {/* Home Link */}
              <button
                onClick={() => navigateTo('home')}
                className={`text-sm font-bold uppercase tracking-wider py-3 text-left transition-all px-4 ${
                  activePage === 'home'
                    ? 'text-[var(--accent)] border-l-2 border-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--accent)] border-l-2 border-transparent'
                }`}
              >
                Home
              </button>

              {/* Mobile About Collapsible */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`text-sm font-bold uppercase tracking-wider py-3 text-left flex items-center justify-between transition-all px-4 ${
                    activePage === 'journey' || activePage === 'team' || activePage === 'awards'
                      ? 'text-[var(--accent)] border-l-2 border-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)] border-l-2 border-transparent'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pl-4 border-l border-[var(--border)] ml-4 gap-1"
                    >
                      <button
                        onClick={() => navigateTo('journey')}
                        className={`text-[13px] font-bold uppercase tracking-wider py-2.5 text-left transition-all ${
                          activePage === 'journey' ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Our journey
                      </button>
                      <button
                        onClick={() => navigateTo('team')}
                        className={`text-[13px] font-bold uppercase tracking-wider py-2.5 text-left transition-all ${
                          activePage === 'team' ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Roster
                      </button>
                      <button
                        onClick={() => navigateTo('awards')}
                        className={`text-[13px] font-bold uppercase tracking-wider py-2.5 text-left transition-all ${
                          activePage === 'awards' ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Achievements
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Link nodes (Gallery, Resources, Contact) */}
              {pages.filter(p => !['home', 'team', 'journey', 'awards'].includes(p.id)).map((p) => {
                const isSelected = activePage === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => navigateTo(p.id)}
                    className={`text-sm font-bold uppercase tracking-wider py-3 text-left transition-all px-4 ${
                      isSelected
                        ? 'text-[var(--accent)] border-l-2 border-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent)] border-l-2 border-transparent'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
              
              <div className="px-4">
                <button
                  onClick={() => navigateTo('contact')}
                  className="mt-2 w-full text-center rounded-full py-3 text-xs font-bold uppercase tracking-widest text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition duration-150"
                >
                  Get In Touch
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Pages Switcher */}
      <main key={activePage} className="flex-grow pt-20 md:pt-24 bg-[var(--bg-primary)] animate-fadeIn px-4 md:px-0">
        
        {/* Render HOME segment */}
        {activePage === 'home' && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10 md:gap-16" id="home-page-view">
            
             {/* Central High-Fidelity Branding Banner Matching Image Style Exactly */}
            <div className="relative text-center py-10 md:py-16 px-4 md:px-8 flex flex-col items-center justify-center transition duration-300 min-h-[calc(100vh-140px)] pb-24 md:pb-32 overflow-hidden rounded-2xl">
              
              {/* Scrolling Background Photo Collage */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-[0.55] dark:opacity-[0.45] transition-opacity duration-300">
                {/* Dynamic radial & linear mask over the background for flawless contrast */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--bg-primary)_80%)] z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)]/90 z-10" />
                
                {/* Dual Row Interlocking Rotating Stream Grid */}
                <div className="flex flex-col gap-8 transform -rotate-3 md:-rotate-6 scale-110 h-full justify-center opacity-85">
                  {/* Row 1: Leftward moving track */}
                  <div className="flex whitespace-nowrap gap-5 w-[300%] animate-collage-left">
                    {collageRow1.map((item, index) => (
                      <div 
                        key={`col1-${item.id}-${index}`} 
                        className="w-64 h-44 md:w-80 md:h-56 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] shadow-md flex-shrink-0 pointer-events-none"
                      >
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover filter contrast-115 brightness-[0.9] dark:brightness-80"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Rightward moving track */}
                  <div className="flex whitespace-nowrap gap-5 w-[300%] animate-collage-right">
                    {collageRow2.map((item, index) => (
                      <div 
                        key={`col2-${item.id}-${index}`} 
                        className="w-64 h-44 md:w-80 md:h-56 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] shadow-md flex-shrink-0 pointer-events-none"
                      >
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover filter contrast-115 brightness-[0.9] dark:brightness-80"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Foreground content wrapped in relative z-10 container for pointer-events & elite legibility */}
              <div className="relative z-10 flex flex-col items-center justify-center">
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
                  <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.25em] text-[var(--text-primary)] uppercase mt-2 leading-none">
                    VORTEX
                  </h1>
                </div>
                
                <p className="text-sm text-[var(--text-secondary)] tracking-wide max-w-md mx-auto leading-relaxed uppercase">
                  FTC Team #00000 • Custom Engineering, High-Precision Dynamics, and Community-First Science and Technology Kampaigns.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => navigateTo('team')}
                    className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition duration-150 cursor-pointer"
                  >
                    Meet The Crew
                  </button>
                  <button 
                    onClick={() => {
                      navigateTo('home');
                      setTimeout(() => {
                        document.getElementById('sponsors-home-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition duration-150 bg-transparent cursor-pointer"
                  >
                    Sponsor Portal
                  </button>
                </div>
              </div>

              {/* Animated Scroll Down indicator button per user request */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-20">
                <button
                  onClick={() => {
                    document.getElementById('machine-spec-showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="p-3 bg-[var(--card-bg)] hover:bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] rounded-full shadow-md cursor-pointer transition-all duration-300 flex items-center justify-center group"
                  aria-label="Scroll down to content"
                >
                  <ChevronDown className="h-5 w-5 transition duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Seasonal Machine Design Showcase (incorporates the actual local PNG hero file) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 overflow-hidden relative shadow-sm hover:border-[var(--accent)]/35 transition-all duration-300" id="machine-spec-showcase">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/[0.03] rounded-full blur-3xl pointer-events-none" />
              
              {/* Image side - Showing the CAD image per user request */}
              <div className="md:col-span-5 relative aspect-[16/11] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] group">
                <ImageWithFallback 
                  src="/assets/images/vortex_robot_hero_1780695937145.png" 
                  alt="CAD-Version Drivetrain 2026-27" 
                  className="w-full h-full object-contain p-4 transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Specifications details side */}
              <div className="md:col-span-7 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase px-2 py-0.5 rounded bg-[var(--accent)]/15 border border-[var(--accent)]/20">Specifications</span>
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">FTC SEASON MACHINE v1.0</span>
                </div>
                <h3 className="font-sans text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
                  Stealth Mecanum Drivetrain
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Our rookie engineering subdivision has modeled and custom manufactured a high-precision aerospace-grade aluminum 4-wheel mecanum drivetrain base. Powered by goBILDA 19.2:1 Yellow Jacket motors and managed by real-time Pinpoint absolute odometry.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  <div className="border border-[var(--border)] bg-[var(--bg-primary)]/50 p-2.5 rounded-lg text-left">
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase block">Drive Ratio</span>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wide">19.2:1 @ 312RPM</span>
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--bg-primary)]/50 p-2.5 rounded-lg text-left">
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase block">Control Hub</span>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wide">REV Controls</span>
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--bg-primary)]/50 p-2.5 rounded-lg text-left">
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase block">Odometry</span>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wide">3-Wheel Pinpoint</span>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Contrast Live Event Countdown System */}
            <CountdownTimer isUnlocked={isUnlocked} db={db} currentUser={currentUser} />

            {/* Render SPONSORS segment with animated automatic image slideshow and interactive typing button */}
            <div className="flex flex-col gap-12 mt-4 pt-12 border-t border-[var(--border)]" id="sponsors-home-section">
              <div className="text-center" id="sponsors-header-landmark">
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Our Supporters</span>
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Vortex Sponsors</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl mx-auto">
                  Without our generous corporate partners and mechanical advisors, custom sheet routing and national qualifiers would not be possible.
                </p>
              </div>

              {isUnlocked && (
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur-sm shadow-md">
                  <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] font-extrabold uppercase mr-auto flex items-center gap-1.5 pl-1">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--accent)] animate-spin-slow" /> Sponsor Slides Management
                  </span>
                  <button
                    onClick={() => {
                      setAdminModalType('sponsor');
                      setAdminModalEditId(null);
                      setAdminModalFields({ name: '', logo: '', tier: 'Gold Partner', desc: '' });
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-wider transition hover:brightness-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Slide
                  </button>
                  {sponsorsState.length > 0 && currentSlide < sponsorsState.length && (
                    <>
                      <button
                        onClick={() => {
                          setAdminModalType('sponsor');
                          setAdminModalEditId(currentSlide);
                          setAdminModalFields({ ...sponsorsState[currentSlide] });
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-extrabold uppercase transition flex items-center gap-1 cursor-pointer border border-white/10"
                      >
                        <Edit className="h-3 w-3" /> Edit Slide ({currentSlide + 1})
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${sponsorsState[currentSlide].name}?`)) {
                            const updated = sponsorsState.filter((_: any, idx: number) => idx !== currentSlide);
                            updateSponsors(updated);
                            setCurrentSlide(0);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-[10px] font-extrabold uppercase transition flex items-center gap-1 cursor-pointer border border-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" /> Delete Slide
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Premium Autoplay/Manual Slideshow */}
              {sponsorsState.length === 0 ? (
                <div className="py-12 text-center border border-[var(--border)] rounded-2xl bg-[var(--card-bg)] flex flex-col items-center justify-center gap-2">
                  <Sparkles className="h-8 w-8 text-[var(--accent)]/40 mb-1" />
                  <h4 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-wider">No sponsors declared yet</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                    Corporate affiliate arrays are currently empty. Log in as admin and click "Add Slide" to deploy sponsor layouts.
                  </p>
                </div>
              ) : (
                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden text-left" id="sponsors-slideshow">
                  <div className="absolute top-4 right-4 bg-[var(--bg-primary)]/80 border border-[var(--border)] px-2 py-1 rounded text-[10px] font-mono text-[var(--accent)] uppercase tracking-wider">
                    Industrial Showcase
                  </div>
                  
                  {(() => {
                    const activeSlide = sponsorsState[currentSlide] || sponsorsState[0] || { name: '', logo: '', tier: '', desc: '' };
                    return (
                      <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                        {/* Logo Image */}
                        <div className="w-full md:w-1/2 aspect-[16/10] bg-[var(--bg-primary)]/45 border border-[var(--border)] rounded-xl overflow-hidden relative group flex items-center justify-center shrink-0">
                          <ImageWithFallback 
                            src={activeSlide.logo} 
                            alt={activeSlide.name}
                            className="w-full h-full object-contain p-6 opacity-80 group-hover:opacity-100 transition duration-300"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent p-4 flex flex-col justify-end">
                            <span id={`sponsor-tier-${currentSlide}`} className="text-[9px] font-mono font-black text-[var(--accent)] tracking-wider uppercase">
                              {getTextReplacement(`#sponsor-tier-${currentSlide}`, activeSlide.tier)}
                            </span>
                          </div>
                        </div>

                        {/* Slideshow metadata */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest block">Corporate Champion</span>
                          <h3 id={`sponsor-name-${currentSlide}`} className="text-xl font-black text-[var(--text-primary)] uppercase mt-1">
                            {getTextReplacement(`#sponsor-name-${currentSlide}`, activeSlide.name)}
                          </h3>
                          <p id={`sponsor-desc-${currentSlide}`} className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed min-h-[50px]">
                            {getTextReplacement(`#sponsor-desc-${currentSlide}`, activeSlide.desc)}
                          </p>

                          {/* Manual trigger controllers */}
                          <div className="flex items-center gap-4 mt-6">
                            <div className="flex gap-1.5">
                              {sponsorsState.map((_, idx) => (
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
                                onClick={() => setCurrentSlide((prev) => (prev === 0 ? sponsorsState.length - 1 : prev - 1))}
                                className="p-1.5 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--accent)]/15 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition cursor-pointer"
                                title="Prior slide"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % sponsorsState.length)}
                                className="p-1.5 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--accent)]/15 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition cursor-pointer"
                                title="Next slide"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Typewriter Styled Big Sponsor Interest button */}
              <div className="flex flex-col items-center gap-4 py-6 border-y border-[var(--border)] text-center">
                <span className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider block">Join Team Vortex as a corporate affiliate</span>
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full max-w-xl group relative overflow-hidden rounded-full border border-[var(--accent)]/30 bg-[var(--bg-primary)] py-4 md:py-5 px-4 md:px-6 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[var(--accent)] shadow-2xl transition duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-1 min-h-[22px]">
                    <span>{sponsorText}</span>
                    <span className="w-1.5 h-3.5 bg-[var(--accent)] animate-pulse shrink-0 inline-block align-middle" />
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Render TEAM/ROSTER segment with photo located directly underneath description */}
        {activePage === 'team' && (() => {
          // Prepare the filtered members list
          const filteredMembers = roster.filter(member => {
            if (member.department === 'Mentors') return false;

            // 1. Department filter
            if (teamFilter !== 'All') {
              if (teamFilter === 'All-Rounder') {
                const isAllRounder = member.department === 'All-Rounder' ||
                  member.role.toLowerCase().includes('captain') ||
                  member.bio.toLowerCase().includes('all-rounder') ||
                  member.bio.toLowerCase().includes('all rounder');
                if (!isAllRounder) return false;
              } else {
                if (member.department !== teamFilter) return false;
              }
            }

            // 2. Name & custom conditional search filter
            if (teamSearch.trim()) {
              const query = teamSearch.toLowerCase().trim();

              const hasMechanicalKeyword = query.includes('mechanical');
              const hasSoftwareKeyword = query.includes('software');
              const hasDesignKeyword = query.includes('design') || query.includes('outreach');
              const hasAllRounderKeyword = query.includes('all-rounder') || query.includes('all rounder');

              let namePart = query
                .replace('mechanical', '')
                .replace('software', '')
                .replace('design', '')
                .replace('outreach', '')
                .replace('all-rounder', '')
                .replace('all rounder', '')
                .trim();

              // Department keywords narrow down searches conditionally ("on top of a name search")
              if (hasMechanicalKeyword && member.department !== 'Mechanical') {
                return false;
              }
              if (hasSoftwareKeyword && member.department !== 'Software') {
                return false;
              }
              if (hasDesignKeyword && member.department !== 'Design & Outreach') {
                return false;
              }
              if (hasAllRounderKeyword) {
                const isAllRounder = member.department === 'All-Rounder' ||
                  member.role.toLowerCase().includes('captain') ||
                  member.bio.toLowerCase().includes('all-rounder') ||
                  member.bio.toLowerCase().includes('all rounder');
                if (!isAllRounder) return false;
              }

              // Filter on a person's name if they specified a name word
              if (namePart) {
                if (!member.name.toLowerCase().includes(namePart)) {
                  return false;
                }
              }
            }

            return true;
          });

          return (
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="team-page-view">
              
              {/* Students Section */}
              <div className="flex flex-col gap-8">
                {/* Header section with department title */}
                <div className="border-b border-[var(--border)] pb-6 text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">The Crew</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" id="team-header-landmark">Meet Team Vortex</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                      A community of high school builders, software developers, and outreach leaders custom manufacturing robotics for FTC competition.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    {isUnlocked && (
                      <button
                        onClick={() => {
                          setAdminModalType('roster');
                          setAdminModalEditId(null);
                          setAdminModalFields({ name: '', role: '', department: 'Mechanical', bio: '', favTool: '', favComponent: '', quote: '', yearsExperience: 1 });
                        }}
                        className="rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-wider px-4 py-2 hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap self-start lg:self-auto shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Team Member
                      </button>
                    )}

                    {/* Department Filter Controls */}
                    <div className="flex flex-wrap gap-2 py-1" id="team-department-filter-controls">
                      {(['All', 'Mechanical', 'Software', 'Design & Outreach', 'All-Rounder'] as const).map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setTeamFilter(dept)}
                          className={`px-3.5 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                            teamFilter === dept
                              ? 'bg-[var(--accent)] text-[var(--btn-text)] border-[var(--accent)] shadow-md shadow-[var(--accent)]/20'
                              : 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Crew Search Box */}
                <div className="relative w-full max-w-md self-start" id="team-search-box-container">
                  <input
                    type="text"
                    placeholder="Search crew by name or category... (e.g. Alex, Mechanical)"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition duration-150 pr-10"
                  />
                  {teamSearch ? (
                    <button 
                      onClick={() => setTeamSearch('')}
                      className="absolute right-3 top-2.5 text-[10px] font-black tracking-wider uppercase text-[var(--accent)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <Search className="absolute right-3.5 top-3 h-4 w-4 text-[var(--text-secondary)] pointer-events-none animate-pulse" />
                  )}
                </div>

                {/* Grid or Empty view */}
                {filteredMembers.length === 0 ? (
                  <div className="py-16 text-center border border-[var(--border)] rounded-2xl bg-[var(--card-bg)] flex flex-col items-center justify-center gap-2 animate-fadeIn" id="team-empty-search-state">
                    <Search className="h-8 w-8 text-[var(--accent)]/60 animate-bounce mb-1" />
                    <h4 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-wider">No matching crew found</h4>
                    <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                      We couldn't locate any team members matching <code className="text-[var(--accent)] font-mono">"{teamSearch}"</code> inside the active tab. Try searching in another department, or reset filters.
                    </p>
                    <button 
                      onClick={() => { setTeamSearch(''); setTeamFilter('All'); }}
                      className="mt-3 px-4 py-2 rounded-full bg-[var(--accent)] text-black text-[10px] font-black tracking-wider uppercase hover:opacity-85 transition cursor-pointer"
                    >
                      Reset Filter & Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => {
                      const placeholderPhoto = portraits[member.id] || `https://picsum.photos/seed/${member.name}/600/450`;
                      return (
                        <motion.div 
                          key={member.id} 
                          whileHover={{ scale: 1.025, y: -4 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left relative"
                          id={`team-member-card-${member.id}`}
                        >
                          {isUnlocked && (
                            <div className="absolute top-4 right-4 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setAdminModalType('roster');
                                  setAdminModalEditId(member.id);
                                  setAdminModalFields({ ...member });
                                }}
                                className="p-1.5 rounded-full bg-black/70 hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-black border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-md"
                                title="Edit Crew Details"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${member.name} from the roster?`)) {
                                    const updated = roster.filter((r: any) => r.id !== member.id);
                                    updateRoster(updated);
                                  }
                                }}
                                className="p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-[var(--text-primary)] hover:text-white border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-md"
                                title="Remove from Roster"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex flex-col gap-4">
                            {/* Name, Role & Department Tag */}
                            <div className="flex flex-col gap-1 pr-14">
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
                              <ImageWithFallback 
                                src={placeholderPhoto} 
                                alt={`Portrait of ${member.name}`}
                                className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                              />
                            </div>

                            {/* FIRST Experience Animated odometer */}
                            <FIRSTExperienceYears targetYears={member.yearsExperience || 0} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dedicated Mentors Section */}
              <div className="flex flex-col gap-8 mt-4">
                {/* Header section for Mentors */}
                <div className="border-b border-[var(--border)] pb-6 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Guidance</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Mentors & Advisors</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                      Industry professional advisors and math/science educators guiding our fabrication techniques and engineering design processes.
                    </p>
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => {
                        setAdminModalType('roster');
                        setAdminModalEditId(null);
                        setAdminModalFields({ name: '', role: '', department: 'Mentors', bio: '', yearsExperience: 1 });
                      }}
                      className="rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-wider px-4 py-2 hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Mentor
                    </button>
                  )}
                </div>

                {/* Grid of Mentors */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roster.filter(m => m.department === 'Mentors').map((mentor) => {
                    const placeholderPhoto = mentor.photo || portraits[mentor.id] || `https://picsum.photos/seed/${mentor.name}/605/455`;
                    return (
                      <motion.div 
                        key={mentor.id} 
                        whileHover={{ scale: 1.025, y: -4 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left relative"
                        id={`mentor-card-${mentor.id}`}
                      >
                        {isUnlocked && (
                          <div className="absolute top-4 right-4 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setAdminModalType('roster');
                                setAdminModalEditId(mentor.id);
                                setAdminModalFields({ ...mentor });
                              }}
                              className="p-1.5 rounded-full bg-black/70 hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-black border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-md"
                              title="Edit Mentor Details"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove ${mentor.name}?`)) {
                                  const updated = roster.filter((r: any) => r.id !== mentor.id);
                                  updateRoster(updated);
                                }
                              }}
                              className="p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-[var(--text-primary)] hover:text-white border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-md"
                              title="Remove Mentor"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex flex-col gap-4">
                          {/* Name, Role & Department Tag */}
                          <div className="flex flex-col gap-1 pr-14">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
                                Advisors
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
                            <ImageWithFallback 
                              src={placeholderPhoto} 
                              alt={`Portrait of ${mentor.name}`}
                              className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* FIRST Experience Animated odometer */}
                          <FIRSTExperienceYears targetYears={mentor.yearsExperience || 0} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Render JOURNEY/TIMELINE + BLOGS segment with vertical chronological timeline */}
        {activePage === 'journey' && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="journey-page-view">
            <div className="border-b border-[var(--border)] pb-6 text-left" id="journey-header-landmark">
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

        {/* Render AWARDS & ACHIEVEMENTS segment */}
        {activePage === 'awards' && (
          <AwardsDisplay db={db} currentUser={currentUser} isUnlocked={isUnlocked} />
        )}

        {/* Render RESOURCES segment */}
        {activePage === 'resources' && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 flex flex-col gap-12" id="resources-page-view">
            
            {/* Hero Centered Section */}
            <div className="text-center pb-6 border-b border-[var(--border)] flex flex-col items-center">
              <span className="text-[10px] font-black tracking-[0.25em] text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-md mb-3">
                FTC Standard Control Ecosystem
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-wide uppercase" id="resources-header-landmark">
                Pedro Pathing Hub
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
                Configure your pathing architectures, bezier spline controllers, and coordinates of Vortex. Complete with 10 customizable resource decks.
              </p>

              {/* Dynamic Live Resource Search Box */}
              <div className="relative w-full max-w-md mt-6" id="resources-dynamic-search-box">
                <input
                  type="text"
                  placeholder="Search assets, guides, or files... (e.g. CAD, Pedro, PID)"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition duration-150 pr-10"
                />
                {resourceSearch ? (
                  <button 
                    onClick={() => setResourceSearch('')}
                    className="absolute right-3 top-2.5 text-[10px] font-black tracking-wider uppercase text-[var(--accent)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <Compass className="absolute right-3.5 top-3 h-4 w-4 text-[var(--text-secondary)] animate-spin-slow pointer-events-none" />
                )}
              </div>
            </div>
                {(() => {
                  const iconMap: any = { Wrench, Cpu, Box, BookOpen, Compass };

                  const query = resourceSearch.toLowerCase().trim();
                  
                  const filteredPedro = pedroPathing.filter(
                    (item: any) => item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
                  );
                  const filteredShared = sharedAssets.filter(
                    (item: any) => item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
                  );

                  const hasNoResults = filteredPedro.length === 0 && filteredShared.length === 0;

                  if (hasNoResults) {
                    return (
                      <div className="py-16 text-center border border-[var(--border)] rounded-2xl bg-[var(--card-bg)] flex flex-col items-center justify-center gap-2 animate-fadeIn">
                        <Compass className="h-8 w-8 text-[var(--text-secondary)] animate-bounce" />
                        <h4 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-wider">No matching assets found</h4>
                        <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                          We couldn't locate any files matching <code className="text-[var(--accent)] font-mono">"{resourceSearch}"</code>. Double-check spelling or try terms like "BOM", "CAD", "Pedro", "PID", or "Slide".
                        </p>
                        <button 
                          onClick={() => setResourceSearch('')}
                          className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] hover:opacity-85"
                        >
                          Reset Query Filter
                        </button>
                      </div>
                    );
                  }

                  const getSavedLink = (name: string, defaultTarget?: string) => {
                    const identifier = `resource-link-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
                    return savedLinks[`#${identifier}`] || defaultTarget || '#';
                  };

                  return (
                    <>
                      {filteredShared.length > 0 && (
                        <div className="flex flex-col gap-6 animate-fadeIn">
                          <div className="text-left border-l-2 border-[var(--accent)] pl-4 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block">Shared Assets</span>
                              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase">Our Resources</h3>
                            </div>
                            {isUnlocked && (
                              <button
                                onClick={() => {
                                  setAdminModalType('resource');
                                  setAdminModalEditId(null);
                                  setAdminModalFields({ name: '', icon: 'Wrench', desc: '', isTool: false, target: '', cta: 'DOWNLOAD ASSET', details: '', category: 'shared' });
                                }}
                                className="rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 hover:opacity-90 active:scale-[0.98] transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Asset
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredShared.map((item: any, index: number) => {
                              const IconComp = iconMap[item.icon] || Compass;
                              const isSpecialTool = item.isTool;
                              const resolvedLink = getSavedLink(item.name, item.target);
                              return (
                                <div 
                                  key={index}
                                  onClick={() => {
                                    if (isSpecialTool && item.target) {
                                      navigateTo(item.target as any);
                                    } else {
                                      setActiveResourceDetail({
                                        name: item.name,
                                        desc: item.desc,
                                        icon: IconComp,
                                        details: item.details,
                                        isTool: item.isTool,
                                        target: resolvedLink,
                                        cta: item.cta
                                      });
                                    }
                                  }}
                                  className={`bg-[var(--card-bg)] border rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 text-left cursor-pointer relative ${
                                    isSpecialTool 
                                      ? 'border-[var(--accent)]/40 shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-[var(--accent)] hover:shadow-[0_0_25px_rgba(0,240,255,0.12)]'
                                      : 'border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)]'
                                  }`}
                                >
                                  {isUnlocked && (
                                    <div className="absolute top-4 right-4 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => {
                                          setAdminModalType('resource');
                                          setAdminModalEditId(index);
                                          setAdminModalFields({ ...item, category: 'shared' });
                                        }}
                                        className="p-1 px-1.5 rounded-md bg-black/75 hover:bg-[var(--accent)] text-white hover:text-black border border-white/10 transition-all cursor-pointer"
                                        title="Edit Resource"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                            const updated = sharedAssets.filter((_: any, idx: number) => idx !== index);
                                            updateSharedAssets(updated);
                                          }
                                        }}
                                        className="p-1 px-1.5 rounded-md bg-black/75 hover:bg-red-600 text-white border border-white/10 transition-all cursor-pointer"
                                        title="Delete Resource"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pr-14">
                                    <div className={`h-10 w-10 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                                      isSpecialTool 
                                        ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]' 
                                        : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)]'
                                    }`}>
                                      <IconComp className="h-5 w-5" />
                                    </div>
                                    {isSpecialTool && (
                                      <span className="text-[8px] font-mono font-bold tracking-widest text-[var(--accent)] bg-[var(--accent)]/12 border border-[var(--accent)]/30 px-2 py-0.5 rounded-md uppercase">
                                        Interactive
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-sans text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{item.name}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
                                  </div>
                                  <div className="mt-auto pt-2 flex items-center justify-between text-[10px] font-bold">
                                    <div className="flex items-center text-[var(--accent)] hover:underline">
                                      <span>{item.cta}</span>
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </div>
                                    {isUnlocked && !isSpecialTool && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const identifier = `resource-link-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                          setEditingElement({
                                            selector: `#${identifier}-text`,
                                            tagName: 'A',
                                            text: item.cta,
                                            link: resolvedLink,
                                            linkSelector: `#${identifier}`
                                          });
                                        }}
                                        className="px-2 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-black transition-all text-[9.5px] font-bold gap-1 flex items-center cursor-pointer"
                                      >
                                        <Edit className="h-2.5 w-2.5" />
                                        <span>Edit Link</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {filteredPedro.length > 0 && (
                        <div className="border-t border-[var(--border)] pt-12 flex flex-col gap-6 animate-fadeIn">
                          <div className="text-left border-l-2 border-[var(--accent)] pl-4 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase">Trajectory Guides</span>
                              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase">Pedro Math Controllers</h3>
                            </div>
                            {isUnlocked && (
                              <button
                                onClick={() => {
                                  setAdminModalType('resource');
                                  setAdminModalEditId(null);
                                  setAdminModalFields({ name: '', icon: 'Compass', desc: '', isTool: false, target: '', cta: 'ACCESS DOCUMENT', details: '', category: 'pedro' });
                                }}
                                className="rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 hover:opacity-90 active:scale-[0.98] transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Setup spec
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredPedro.map((dummy: any, index: number) => {
                              const resolvedLink = getSavedLink(dummy.name, dummy.target);
                              const IconComp = iconMap[dummy.icon] || Compass;
                              return (
                                <div 
                                  key={dummy.id || index}
                                  onClick={() => {
                                    setActiveResourceDetail({
                                      name: dummy.name,
                                      desc: dummy.desc,
                                      icon: IconComp,
                                      details: dummy.details,
                                      isTool: false,
                                      target: resolvedLink,
                                      cta: dummy.cta || 'ACCESS DOCUMENT'
                                    });
                                  }}
                                  className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] text-left cursor-pointer relative"
                                >
                                  {isUnlocked && (
                                    <div className="absolute top-4 right-4 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => {
                                          setAdminModalType('resource');
                                          setAdminModalEditId(index);
                                          setAdminModalFields({ ...dummy, category: 'pedro' });
                                        }}
                                        className="p-1 px-1.5 rounded-md bg-black/75 hover:bg-[var(--accent)] text-white hover:text-black border border-white/10 transition-all cursor-pointer"
                                        title="Edit Spec"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${dummy.name}?`)) {
                                            const updated = pedroPathing.filter((_: any, idx: number) => idx !== index);
                                            updatePedroPathing(updated);
                                          }
                                        }}
                                        className="p-1 px-1.5 rounded-md bg-black/75 hover:bg-red-600 text-white border border-white/10 transition-all cursor-pointer"
                                        title="Delete Spec"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}

                                  <div className="h-10 w-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-colors shrink-0">
                                    <IconComp className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-sans text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{dummy.name}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 pr-1 leading-relaxed">{dummy.desc}</p>
                                  </div>
                                  <div className="mt-auto pt-2 flex items-center justify-between text-[10px] font-bold">
                                    <div className="flex items-center text-[var(--accent)] hover:underline">
                                      <span>{dummy.cta || 'ACCESS DOCUMENT'}</span>
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </div>
                                    {isUnlocked && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const identifier = `resource-link-${dummy.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                          setEditingElement({
                                            selector: `#${identifier}-text`,
                                            tagName: 'A',
                                            text: dummy.cta || 'ACCESS DOCUMENT',
                                            link: resolvedLink,
                                            linkSelector: `#${identifier}`
                                          });
                                        }}
                                        className="px-2 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-black transition-all text-[9.5px] font-bold gap-1 flex items-center cursor-pointer"
                                      >
                                        <Edit className="h-2.5 w-2.5" />
                                        <span>Edit Link</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

            {/* Modal for viewing detailed information about resources */}
            <AnimatePresence>
              {activeResourceDetail && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setActiveResourceDetail(null)}
                >
                  <div 
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl p-6 text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
                          {React.createElement(activeResourceDetail.icon || Compass, { className: "h-6 w-6 animate-pulse-slow" })}
                        </div>
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase block">Technical specification</span>
                          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--text-primary)]">{activeResourceDetail.name}</h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveResourceDetail(null)}
                        className="rounded-full p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30 transition cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 font-sans text-xs">
                      <div className="rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]/70 p-3 leading-relaxed text-[var(--text-secondary)]">
                        {activeResourceDetail.desc}
                      </div>

                      {activeResourceDetail.details && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Implementation details & math model</span>
                          <div className="rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--border)]/40 p-4 font-mono text-[11px] text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-60 animate-fadeIn">
                            {activeResourceDetail.details}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3 justify-end border-t border-[var(--border)]/40 pt-4">
                      {isUnlocked && !activeResourceDetail.isTool && (
                        <button 
                          type="button"
                          onClick={() => {
                            const identifier = `resource-link-${activeResourceDetail.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                            const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
                            const currentHref = savedLinks[`#${identifier}`] || activeResourceDetail.target || '#';
                            setEditingElement({
                              selector: `#${identifier}-text`,
                              tagName: 'A',
                              text: activeResourceDetail.cta || 'DOWNLOAD',
                              link: currentHref,
                              linkSelector: `#${identifier}`
                            });
                          }}
                          className="rounded-full border border-[var(--accent)]/45 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit Link</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setActiveResourceDetail(null)}
                        className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-bold uppercase text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--text-primary)] transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                      {activeResourceDetail.isTool && activeResourceDetail.target ? (
                        <button 
                          onClick={() => {
                            navigateTo(activeResourceDetail.target! as any);
                            setActiveResourceDetail(null);
                          }}
                          className="rounded-full bg-[var(--accent)] text-[var(--btn-text)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-95 transition cursor-pointer"
                        >
                          Launch Applet
                        </button>
                      ) : (
                        <a 
                          href={activeResourceDetail.target || '#'}
                          onClick={(e) => {
                            if (!activeResourceDetail.target || activeResourceDetail.target.startsWith('#')) {
                              e.preventDefault();
                              alert('This simulated document belongs to our regional FTC portfolio library. In a live environment, this download link routes directly to local Google Drive assets.');
                            }
                            setActiveResourceDetail(null);
                          }}
                          target={activeResourceDetail.target && !activeResourceDetail.target.startsWith('#') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="rounded-full bg-[var(--accent)] text-[var(--btn-text)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-95 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{activeResourceDetail.cta || 'DOWNLOAD'}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* Render BOM Manager segment */}
        {activePage === 'bom' && (
          <BOMManager db={db} currentUser={currentUser} />
        )}

        {/* Render Path Simulator segment */}
        {activePage === 'pathing' && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col gap-8" id="pathing-page-view">
            <div className="flex items-center gap-2 self-start">
              <button 
                onClick={() => navigateTo('resources')}
                className="text-[10px] font-mono font-bold tracking-wider text-[var(--accent)] hover:opacity-80 flex items-center gap-1 cursor-pointer uppercase bg-[var(--accent)]/10 px-2.5 py-1.5 rounded-full border border-[var(--accent)]/20"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back to Resources
              </button>
            </div>
            <div className="text-center pb-6 border-b border-[var(--border)] flex flex-col items-center">
              <span className="text-[10px] font-black tracking-[0.25em] text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-md mb-3">
                Autonomous Kinematics Solver
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-wide uppercase">
                Pedro Pathing Spline Builder
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
                Design multi-segment cubic bezier paths for First Tech Challenge. Drag handles, edit headings, run simulations, and copy ready-to-use follower code.
              </p>
            </div>
            <PathSimulator db={db} currentUser={currentUser} />
          </div>
        )}

        {/* Render COM Calculator segment */}
        {activePage === 'com-calc' && (
          <COMCalculator db={db} currentUser={currentUser} />
        )}

        {/* Render Portfolios Center segment */}
        {activePage === 'portfolios' && (
          <PortfolioHub />
        )}

        {/* Render CONTACT segment */}
        {activePage === 'contact' && (
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-24 min-h-[400px]" id="contact-page-view">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 sm:p-8 max-w-xl mx-auto shadow-xl text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block">Inquire</span>
                {isDraftAutosaved && (
                  <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md animate-pulse">
                     Draft Autosaved
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase mt-1" id="contact-header-landmark">Get In Touch</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 mb-6">
                Are you a local business owner looking to sponsor, a school wishing for safety demonstrations, or a student wanting to join Vortex? Drop our captain a line!
              </p>
              
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                {contactStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <strong className="font-bold uppercase tracking-wider">Successful!</strong>
                    </div>
                    <span className="block mt-1 text-[11px] text-emerald-300/80">Returning to the home page in a few seconds...</span>
                  </div>
                )}

                {contactStatus === 'pending_activation' && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-3 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <strong className="font-bold uppercase tracking-wider text-amber-300">Activation Required!</strong>
                    </div>
                    <p className="mb-2 text-stone-200 text-[11px]">
                      Please check your inbox at <strong>Hraha0311@gmail.com</strong> for a FormSubmit activation email and click the confirmation link to start receiving messages.
                    </p>
                    <span className="block mt-1.5 text-[11px] text-amber-300/80 font-mono">Returning to the home page in a few seconds...</span>
                  </div>
                )}

                {contactStatus === 'error' && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <strong className="font-bold uppercase tracking-wider">Failed!</strong>
                    </div>
                    {contactServerMessage && <span className="block mt-1 text-[11px] text-red-300/90">{contactServerMessage}</span>}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    disabled={contactSubmitting}
                    className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50" 
                    placeholder={namePlaceholder} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Your Email</label>
                  <input 
                    required 
                    type="email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={contactSubmitting}
                    className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50" 
                    placeholder={emailPlaceholder} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">Message Detail</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    disabled={contactSubmitting}
                    className="w-full rounded bg-[var(--bg-primary)] border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50" 
                    placeholder={messagePlaceholder} 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={contactSubmitting}
                  className="w-full rounded-full py-3 text-xs font-bold uppercase tracking-widest text-[var(--btn-text)] bg-[var(--accent)] hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {contactSubmitting ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>Transacting Delivery...</span>
                    </>
                  ) : (
                    <span>Dispatch Message</span>
                  )}
                </button>
                
                <div className="text-[9px] font-mono text-[var(--text-secondary)] text-center uppercase tracking-wider mt-1 block">
                  🛡️ Securely processed and delivered via Team Vortex Mailer Routing
                </div>
              </form>

              {localStorage.getItem('vortex_custom_contact_info_name') && (
                <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">Active Updated Information Saved!</span>
                  </div>
                  <div className="space-y-2 font-mono text-[11px] text-[var(--text-secondary)]">
                    <p><strong className="text-[var(--text-primary)]">AUTHORIZED IDENTIFIER:</strong> {localStorage.getItem('vortex_custom_contact_info_name')}</p>
                    <p><strong className="text-[var(--text-primary)]">UPDATED CORE EMAIL:</strong> {localStorage.getItem('vortex_custom_contact_info_email')}</p>
                    <p><strong className="text-[var(--text-primary)]">SESSION CUSTOM STATE:</strong> {localStorage.getItem('vortex_custom_contact_info_message')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Elegant FAQ Section below the contact form */}
            <div className="mt-16 border-t border-[var(--border)] pt-12 max-w-xl mx-auto" id="contact-faq-section">
              <div className="text-center mb-8">
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block">FAQ</span>
                <h4 className="text-xl font-black text-[var(--text-primary)] uppercase mt-1">Frequently Asked Questions</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Got questions about joining Vortex or supporting our team? Here are quick answers to our most common inquiries.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    q: "How can I join Team Vortex?",
                    a: "We welcome Texas high school students who are passionate about design, math, programming, mechanical builds, and outreach. No prior robotics experience is required—our mentors train all recruit members from scratch!",
                    icon: Users,
                    color: "text-sky-400"
                  },
                  {
                    q: "What is the expected time commitment?",
                    a: "The regular build season begins with kickoff in September. Expect 4-6 hours per week of team meetings, computer modeling, and robot testing, with increased sprint hours before Texas qualifier competitions.",
                    icon: Clock,
                    color: "text-amber-400"
                  },
                  {
                    q: "Where can I find meeting minutes?",
                    a: "All of our weekly meeting engineering logs, sprint design updates, and software progress journals are fully documented. You can easily view, search, and download them through the public shared folder linked inside our Resources page.",
                    icon: FileText,
                    color: "text-indigo-400"
                  },
                  {
                    q: "Why should we sponsor Team Vortex?",
                    a: "Sponsoring Vortex directly funds engineering parts, CNC routing, and Texas competition registrations. Your company logo will be proudly displayed on our official robot chassis, team attire, website, and promotional banners.",
                    icon: Handshake,
                    color: "text-emerald-400"
                  },
                  {
                    q: "How are sponsorship donations utilized?",
                    a: "100% of commercial funds go directly into robot hardware, custom manufacturing raw materials, programming control hubs, safety gear, and event entry registrations.",
                    icon: Wrench,
                    color: "text-teal-400"
                  },
                  {
                    q: "How do I request a demo for my school?",
                    a: "We love performing robot showcases and doing STEM workshops! Simply submit a school request message using our contact form above, and our high-school student outreach captains will coordinate with you to bring our demo field equipment directly to your school.",
                    icon: School,
                    color: "text-rose-400"
                  },
                  {
                    q: "Are there hands-on training safety guidelines?",
                    a: "Safety is our first priority. Every member undergoes strict machine safety certification drills. Hand tools, 3D printers, and CNC systems are only operated under direct, trained supervision in compliance with Texas FTC regulations.",
                    icon: Shield,
                    color: "text-red-400"
                  }
                ].map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200"
                      id={`faq-item-${idx}`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between gap-4 font-sans text-xs font-black text-[var(--text-primary)] uppercase tracking-wider hover:text-[var(--accent)] transition duration-150 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-4 h-4 shrink-0 transition-all duration-200 ${item.color}`} />
                          <span>{item.q}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-[var(--accent)]' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: "auto", 
                              opacity: 1,
                              transition: {
                                height: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 26,
                                  restDelta: 0.01
                                },
                                opacity: {
                                  duration: 0.25,
                                  ease: "easeOut"
                                }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 26,
                                  restDelta: 0.01
                                },
                                opacity: {
                                  duration: 0.15,
                                  ease: "easeIn"
                                }
                              }
                            }}
                            className="overflow-hidden border-t border-[var(--border)] bg-[var(--bg-primary)]/30"
                          >
                            <motion.p 
                              initial={{ y: -8, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -8, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="p-4 text-xs leading-relaxed text-[var(--text-secondary)]"
                            >
                              {item.a}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {activePage === 'gallery' && (
          <GalleryPageView 
            isUnlocked={isUnlocked} 
            gallery={gallery} 
            onAdd={() => {
              setAdminModalType('gallery');
              setAdminModalEditId(null);
              setAdminModalFields({ title: '', caption: '', image: '', category: 'MECHANICAL', date: 'July 2026' });
            }}
            onEdit={(item) => {
              setAdminModalType('gallery');
              setAdminModalEditId(item.id);
              setAdminModalFields({ ...item });
            }}
            onDelete={(id) => {
              if (confirm('Are you sure you want to remove this image from the gallery?')) {
                const updated = gallery.filter((item: any) => item.id !== id);
                updateGallery(updated);
              }
            }}
          />
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
                  <button 
                    onClick={() => {
                      navigateTo('home');
                      setTimeout(() => {
                        document.getElementById('sponsors-home-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }} 
                    className="hover:text-[var(--text-primary)] transition text-left cursor-pointer"
                  >
                    Sponsors Portal
                  </button>
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
            <div className="flex items-center gap-3" id="vortex-footer-socials">
              {[
                { name: 'Spotify Playlist Tracker', href: 'https://open.spotify.com', outlineColor: 'hover:border-green-500/30 text-green-400', path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.745-.47-.077-.337.135-.668.47-.745 3.856-.88 7.15-.51 9.812 1.12.296.18.387.563.207.857zm1.226-2.724c-.226.367-.71.486-1.077.26-2.72-1.672-6.87-2.155-10.076-1.182-.412.125-.845-.107-.97-.52-.125-.412.107-.845.52-.97 3.666-1.112 8.232-.577 11.343 1.336.368.226.486.71.26 1.076zm.105-2.81c-3.262-1.937-8.644-2.115-11.758-1.17-.5.152-1.025-.133-1.177-.633-.15-.5.133-1.025.633-1.177 3.59-1.09 9.53-.883 13.292 1.35.454.27.604.856.335 1.31-.27.454-.856.604-1.31.335z" },
                { name: 'YouTube Guides', href: 'https://youtube.com', outlineColor: 'hover:border-red-500/30 text-red-500', path: "M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.52 3.545 12 3.545 12 3.545s-7.52 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.48 20.455 12 20.455 12 20.455s7.52 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { name: 'Discord Community', href: 'https://discord.gg', outlineColor: 'hover:border-indigo-500/30 text-indigo-400', path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.67 4.37a.07.07 0 0 0-.034.027C.53 9.16-.309 13.825.1 18.361a.08.08 0 0 0 .03.056 19.909 19.909 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.96a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" },
                { name: 'Instagram Capture Reels', href: 'https://instagram.com', outlineColor: 'hover:border-pink-500/30 text-pink-500', path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
                { name: 'GitHub Workspace Codebase', href: 'https://github.com', outlineColor: 'hover:border-zinc-500/30 text-[var(--accent)]', path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }
              ].map((s) => {
                const identifier = `footer-social-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                const savedLinks = JSON.parse(localStorage.getItem('vortex_link_replacements') || '{}');
                const currentHref = savedLinks[`#${identifier}`] || s.href;
                return (
                  <div key={s.name} className="relative group/social">
                    <a 
                      id={identifier}
                      href={currentHref} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] ${s.outlineColor} hover:bg-[var(--accent)]/5 hover:scale-105 transition-all duration-300 flex items-center justify-center`}
                      title={`Vortex ${s.name}`}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d={s.path} />
                      </svg>
                    </a>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top-button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--accent)] text-[var(--btn-text)] shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300 z-50 cursor-pointer border border-[var(--accent)]/40 flex items-center justify-center hover-pulse"
            id="scroll-to-top-btn"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {isUnlocked && (
        <div 
          id="cms-control-toolbar" 
          contentEditable="false"
          suppressContentEditableWarning={true}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121214]/95 border border-[var(--accent)]/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-wrap items-center gap-4 text-xs animate-slideIn select-none max-w-[95vw]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono uppercase font-black text-emerald-400 tracking-wider">VORTEX CMS LIVE MODE</span>
          </div>
          
          <span className="text-[var(--text-secondary)]">|</span>

          {/* Universal Sync Auth Control */}
          <div className="flex items-center gap-2.5">
            {!currentUser ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="bg-[var(--accent)] hover:opacity-95 text-black px-2.5 py-1.5 rounded-full font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition select-none shadow"
              >
                <LogIn className="h-3 w-3" />
                <span>Sync with Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                  currentUser.email && (currentUser.email.toLowerCase() === "anumulakalpana4u@gmail.com" || currentUser.email.toLowerCase() === "hraha0311@gmail.com")
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                }`}>
                  {currentUser.email && (currentUser.email.toLowerCase() === "anumulakalpana4u@gmail.com" || currentUser.email.toLowerCase() === "hraha0311@gmail.com")
                    ? "Universal Synced"
                    : "No Write Perms"}
                </span>
                <span className="text-[10px] text-stone-300 font-mono truncate max-w-[120px]" title={currentUser.email || ''}>{currentUser.email}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-stone-500 hover:text-stone-300 transition cursor-pointer p-0.5 ml-0.5 flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Sync configuration / auth error helpers */}
            {firebaseAuthError && (
              <span className="text-[9px] text-red-400 bg-red-950/20 border border-red-500/15 px-1.5 py-0.5 rounded font-mono truncate max-w-[180px]" title={firebaseAuthError}>
                ⚠️ Auth Error: {firebaseAuthError}
              </span>
            )}

            {firebaseSyncError && (
              <span className="text-[9px] text-amber-400 bg-amber-950/20 border border-amber-500/15 px-1.5 py-0.5 rounded font-mono truncate max-w-[180px]" title={firebaseSyncError}>
                ℹ️ Local Cache (Sync Pending Setup)
              </span>
            )}
          </div>
          
          <span className="text-[var(--text-secondary)]">|</span>
          <span className="text-[10px] text-stone-200">Double-click any text element on the page to customize.</span>
          <span className="text-[var(--text-secondary)]">|</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm('Revert all custom site-wide text, image, and link edits? This will also wipe those modifications universally.')) {
                  localStorage.removeItem('vortex_saved_text_nodes');
                  localStorage.removeItem('vortex_text_replacements');
                  localStorage.removeItem('vortex_image_replacements');
                  localStorage.removeItem('vortex_link_replacements');
                  localStorage.removeItem('vortex_custom_contact_info_name');
                  localStorage.removeItem('vortex_custom_contact_info_email');
                  localStorage.removeItem('vortex_custom_contact_info_message');
                  
                  // Empty firestore collections if admin
                  const userEmailLower = currentUser?.email?.toLowerCase();
                  const isAdminEmail = currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com");
                  if (isAdminEmail) {
                    try {
                      // Text edits
                      const textSnapshot = await getDocs(collection(db, "text_replacements"));
                      await Promise.all(textSnapshot.docs.map(snapDoc => deleteDoc(doc(db, "text_replacements", snapDoc.id))));
                      
                      // Image edits
                      const imgSnapshot = await getDocs(collection(db, "image_replacements"));
                      await Promise.all(imgSnapshot.docs.map(snapDoc => deleteDoc(doc(db, "image_replacements", snapDoc.id))));

                      // Link edits
                      const linkSnapshot = await getDocs(collection(db, "link_replacements"));
                      await Promise.all(linkSnapshot.docs.map(snapDoc => deleteDoc(doc(db, "link_replacements", snapDoc.id))));
                    } catch (err) {
                      console.warn("Failed to universally clear node documents:", err);
                    }
                  }

                  window.location.reload();
                }
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] cursor-pointer transition select-none"
            >
              Clear Edits
            </button>
 
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                localStorage.removeItem('vortex_sys_config_unlocked');
                setIsUnlocked(false);
                window.location.reload();
              }}
              className="bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-500/25 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] cursor-pointer transition select-none"
            >
              Lock CMS
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Hover-Edit Ring Highlights & Badges when Live CMS is unlocked */}
      {isUnlocked && hoveredElement && (
        <>
          {/* Glowing Border Highlights around target elements */}
          <div 
            id="cms-hover-highlight-container"
            style={{
              position: 'fixed',
              top: `${hoveredElement.rect.top - 2}px`,
              left: `${hoveredElement.rect.left - 2}px`,
              width: `${hoveredElement.rect.width + 4}px`,
              height: `${hoveredElement.rect.height + 4}px`,
              pointerEvents: 'none',
              border: '1.5px dashed var(--accent)',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.25)',
              zIndex: 45,
              transition: 'all 0.15s ease-out'
            }}
          />

          {/* Floating Edit Badge at the top-right corner of the hovered element */}
          <div
            style={{
              position: 'fixed',
              top: `${Math.max(4, hoveredElement.rect.top - 20)}px`,
              left: `${hoveredElement.rect.right - 54}px`,
              zIndex: 46,
              transition: 'all 0.15s ease-out'
            }}
          >
            <button
              id="cms-hover-badge"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditingElement({
                  selector: hoveredElement.selector,
                  tagName: hoveredElement.tagName,
                  text: hoveredElement.text,
                  link: hoveredElement.link,
                  linkSelector: hoveredElement.linkSelector,
                  isImage: hoveredElement.isImage,
                  imageSrc: hoveredElement.imageSrc
                });
                setHoveredElement(null);
              }}
              className="bg-[var(--accent)] text-black font-mono font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-black/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer select-none"
            >
              <Edit className="h-2.5 w-2.5" />
              <span>EDIT</span>
            </button>
          </div>
        </>
      )}

      {/* Structured Floating Edit Modal */}
      {editingElement && (
        <div id="cms-editor-popover" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121214] border border-[var(--accent)]/45 rounded-2xl w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-left flex flex-col gap-4 animate-slideIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-black tracking-wider text-[var(--accent)]">
                <Terminal className="h-4 w-4 text-[var(--accent)] animate-pulse" />
                <span>EDIT TARGET: {editingElement.isImage ? "IMAGE" : editingElement.tagName.toUpperCase()} {editingElement.link !== undefined ? "(WITH ACTIVE LINK)" : ""}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingElement(null)}
                className="text-stone-400 hover:text-white transition rounded-full hover:bg-stone-800 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image Customizer (Choose files, Drag and Drop) */}
            {editingElement.isImage && (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
                  Image Asset Customizer
                </label>
                
                {/* Drag and Drop Zone + Preview */}
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-[var(--accent)]', 'bg-[var(--accent)]/5');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[var(--accent)]', 'bg-[var(--accent)]/5');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[var(--accent)]', 'bg-[var(--accent)]/5');
                    const files = e.dataTransfer?.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          setEditingElement({
                            ...editingElement,
                            imageSrc: base64
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                  className="border-2 border-dashed border-stone-800 rounded-xl p-6 bg-stone-950/40 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:border-[var(--accent)]/50 group"
                  onClick={() => document.getElementById('cms-file-input')?.click()}
                >
                  <input 
                    type="file" 
                    id="cms-file-input" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          setEditingElement({
                            ...editingElement,
                            imageSrc: base64
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {editingElement.imageSrc ? (
                    <div className="relative w-full max-h-[140px] flex items-center justify-center overflow-hidden rounded-lg bg-stone-900 border border-stone-800/80">
                      <img 
                        src={editingElement.imageSrc} 
                        alt="Preview" 
                        className="max-w-full max-h-[130px] object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider backdrop-blur-[2px]">
                        Replace / Drop New Image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Image className="h-8 w-8 text-stone-500 group-hover:text-[var(--accent)] transition duration-200" />
                      <span className="text-xs font-bold text-stone-300">Click to Select or Drag & Drop Image Here</span>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Supports PNG, JPG, SVG, WebP, GIF</span>
                    </div>
                  )}
                </div>

                {/* Direct source text field */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-stone-500">Image Source (URL or Base64 Data)</label>
                  <textarea
                    rows={2}
                    value={editingElement.imageSrc || ''}
                    onChange={(e) => setEditingElement({ ...editingElement, imageSrc: e.target.value })}
                    className="w-full text-[9px] font-mono rounded-xl bg-[#09090b] border border-stone-800 p-2 text-stone-400 focus:outline-none focus:border-[var(--accent)]/60 transition resize-none truncate"
                    placeholder="data:image/png;base64,... or https://"
                  />
                </div>
              </div>
            )}

            {/* Modal Edit Field */}
            {editingElement.text !== undefined && !editingElement.isImage && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Custom Localized Value</label>
                <textarea
                  rows={3}
                  value={editingElement.text}
                  onChange={(e) => setEditingElement({ ...editingElement, text: e.target.value })}
                  className="w-full text-xs rounded-xl bg-[#09090b] border border-stone-800 p-3.5 text-stone-200 font-sans focus:outline-none focus:border-[var(--accent)]/60 transition resize-y"
                />
              </div>
            )}

            {/* Link Edit Field (Only active if editing linked elements or buttons) */}
            {editingElement.link !== undefined && (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Destination Hyperlink (URL or Page ID)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingElement.link}
                    onChange={(e) => setEditingElement({ ...editingElement, link: e.target.value })}
                    className="flex-1 text-xs rounded-xl bg-[#09090b] border border-stone-800 p-3 text-stone-200 font-sans focus:outline-none focus:border-[var(--accent)]/60 transition"
                    placeholder="https://example.com or pageId ('home', 'team', etc.)"
                  />
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        setEditingElement({ ...editingElement, link: e.target.value });
                        e.target.value = ''; // reset selection
                      }
                    }}
                    className="text-[11px] font-sans rounded-xl bg-[#1a1a1f] border border-stone-800 px-3 text-stone-300 focus:outline-none cursor-pointer hover:border-stone-700 transition"
                  >
                    <option value="">Presets...</option>
                    <option value="home">Home Page</option>
                    <option value="team">Team Page</option>
                    <option value="journey">Journey Page</option>
                    <option value="learn">Learn Page</option>
                    <option value="resources">Resources Page</option>
                    <option value="gallery">Gallery Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="bom">BOM Manager</option>
                    <option value="com-calc">COM Calculator</option>
                    <option value="portfolios">Portfolios</option>
                  </select>
                </div>
              </div>
            )}

            {/* Selector Path Diagnostic */}
            <div className="bg-[#0c0c0e] p-3 rounded-lg border border-stone-800/60 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block font-bold block">Absolute Element Path</span>
                <span className="text-[10px] font-mono text-stone-300 select-all font-semibold truncate block">{editingElement.selector}</span>
                {editingElement.linkSelector && (
                  <>
                    <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block font-bold mt-1 block">Anchor Selector Path</span>
                    <span className="text-[10px] font-mono text-stone-300 select-all font-semibold truncate block">{editingElement.linkSelector}</span>
                  </>
                )}
              </div>
              
              {/* Dev Firestore Status Indicator */}
              <div className="pt-1.5 border-t border-stone-900 flex flex-col gap-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px]">Universal Sync Status:</span>
                  {currentUser && currentUser.email && (currentUser.email.toLowerCase() === "anumulakalpana4u@gmail.com" || currentUser.email.toLowerCase() === "hraha0311@gmail.com") ? (
                    <span className="text-emerald-400 flex items-center gap-1 uppercase font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Enabled
                    </span>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="text-amber-400 hover:text-amber-300 transition underline tracking-wider uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Local Only (Tap to Sync Auth)
                    </button>
                  )}
                </div>
                {firebaseAuthError && (
                  <span className="text-[9px] text-red-400 font-sans leading-normal">
                    ⚠️ {firebaseAuthError}
                  </span>
                )}
                {firebaseSyncError && (
                  <div className="text-[10px] text-amber-400 bg-amber-950/20 border border-amber-500/15 p-2.5 rounded-lg font-sans leading-normal mt-1.5 flex flex-col gap-1.5">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>Firestore Sync Active Error:</span>
                    </div>
                    <div className="font-mono text-[9px] text-stone-300 break-words bg-black/40 p-2 rounded border border-stone-800">
                      {firebaseSyncError}
                    </div>
                    <div className="text-stone-400 leading-normal mt-0.5 space-y-1">
                      <p className="font-semibold text-stone-300">💡 Common Solutions for your Custom Project:</p>
                      <span className="block pl-1.5">• Ensure a <strong>Firestore Database</strong> has been created in your Firebase Console (click "Create Database" under Firestore Database, choosing Production or Test mode).</span>
                      <span className="block pl-1.5">• Click <strong>"Sync with Google"</strong> in the bottom toolbar and authenticate with your admin account (<code>anumulakalpana4u@gmail.com</code>). Writes are locked to authorized admins.</span>
                      <span className="block pl-1.5">• Add the current domain <code>{window.location.hostname}</code> to your Firebase Console under <strong>Authentication &gt; Settings &gt; Authorized domains</strong> so Google Login can authenticate successfully.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Panel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingElement(null)}
                className="text-stone-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    // 1. Save custom text
                    if (editingElement.text && !editingElement.isImage) {
                      const savedTexts = localStorage.getItem('vortex_text_replacements') || '{}';
                      const parsedTexts = JSON.parse(savedTexts);
                      parsedTexts[editingElement.selector] = editingElement.text;
                      localStorage.setItem('vortex_text_replacements', JSON.stringify(parsedTexts));

                      setDbReplacements(prev => ({
                        ...prev,
                        [editingElement.selector]: editingElement.text
                      }));

                      // Sync with Firestore if admin
                      const userEmailLower = currentUser?.email?.toLowerCase();
                      const isAdminEmail = currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com");
                      if (isAdminEmail) {
                        const docId = btoa(editingElement.selector).replace(/\//g, '_').replace(/=/g, '');
                        await setDoc(doc(db, "text_replacements", docId), {
                          selector: editingElement.selector,
                          text: editingElement.text,
                          updatedAt: serverTimestamp()
                        });
                      }
                    }

                    // 2. Save custom hyperlink (href)
                    if (editingElement.link !== undefined && editingElement.linkSelector) {
                      const savedLinks = localStorage.getItem('vortex_link_replacements') || '{}';
                      const parsedLinks = JSON.parse(savedLinks);
                      parsedLinks[editingElement.linkSelector] = editingElement.link;
                      localStorage.setItem('vortex_link_replacements', JSON.stringify(parsedLinks));

                      // Sync with Firestore if admin
                      const userEmailLower = currentUser?.email?.toLowerCase();
                      const isAdminEmail = currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com");
                      if (isAdminEmail) {
                        const docId = btoa(editingElement.linkSelector).replace(/\//g, '_').replace(/=/g, '');
                        await setDoc(doc(db, "link_replacements", docId), {
                          selector: editingElement.linkSelector,
                          href: editingElement.link,
                          updatedAt: serverTimestamp()
                        });
                      }
                    }

                    // 3. Save custom image
                    if (editingElement.isImage && editingElement.imageSrc) {
                      const savedImages = localStorage.getItem('vortex_image_replacements') || '{}';
                      const parsedImages = JSON.parse(savedImages);
                      parsedImages[editingElement.selector] = editingElement.imageSrc;
                      localStorage.setItem('vortex_image_replacements', JSON.stringify(parsedImages));

                      // Find the element and update it immediately
                      const img = document.querySelector(editingElement.selector) as HTMLImageElement;
                      if (img) {
                        img.src = editingElement.imageSrc;
                      }

                      // Sync with Firestore if admin
                      const userEmailLower = currentUser?.email?.toLowerCase();
                      const isAdminEmail = currentUser && userEmailLower && (userEmailLower === "anumulakalpana4u@gmail.com" || userEmailLower === "hraha0311@gmail.com");
                      if (isAdminEmail) {
                        const docId = btoa(editingElement.selector).replace(/\//g, '_').replace(/=/g, '');
                        await setDoc(doc(db, "image_replacements", docId), {
                          selector: editingElement.selector,
                          src: editingElement.imageSrc,
                          updatedAt: serverTimestamp()
                        });
                      }
                    }

                    // Trigger immediate text sync
                    restoreAllTextNodes();
                  } catch (err) {
                    console.warn("Failed to deploy changes universally:", err);
                  }
                  setEditingElement(null);
                }}
                className="bg-[var(--accent)] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:opacity-90 active:scale-[0.98] transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>
                  {currentUser && (currentUser.email === "anumulakalpana4u@gmail.com" || currentUser.email === "hraha0311@gmail.com") 
                    ? "Apply & Sync Globally" 
                    : "Apply Checksum Locally"}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Structured Master CMS Item Modal */}
      {adminModalType && (
        <div id="cms-item-modal" className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121214] border border-[var(--accent)]/45 rounded-2xl w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-left flex flex-col gap-4 animate-slideIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-black tracking-wider text-[var(--accent)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)] animate-spin-slow" />
                <span>
                  {adminModalEditId !== null ? "MODIFY MASTER ITEM" : "CREATE NEW ITEM"} - {adminModalType.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalType(null)}
                className="text-stone-400 hover:text-white transition rounded-full hover:bg-stone-800 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dynamic fields based on adminModalType */}
            <div className="flex flex-col gap-4">
              {adminModalType === 'gallery' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Image URL / Source</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. /assets/images/gallery/item_1.png or https://example.com/item.jpg"
                      value={adminModalFields.src || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, src: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Item Title</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. Mechanical chassis manufacturing"
                      value={adminModalFields.title || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, title: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Category Tag</label>
                    <select 
                      className="bg-[#1e1e24] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      value={adminModalFields.category || 'Competitions'}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, category: e.target.value })}
                    >
                      <option value="Competitions">Competitions</option>
                      <option value="Fabrication">Fabrication</option>
                      <option value="Outreach">Outreach</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Description</label>
                    <textarea 
                      rows={3}
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                      placeholder="Enter a brief, professional description of this gallery item"
                      value={adminModalFields.description || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              {adminModalType === 'sponsor' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Sponsor Company Name</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. SolidWorks"
                      value={adminModalFields.name || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Logo Image URL</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. /assets/images/sponsors/logo.png or https://picsum.photos/300/150"
                      value={adminModalFields.logo || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, logo: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Sponsorship Tier Tag</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. Gold Partner / Diamond Affiliate"
                      value={adminModalFields.tier || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, tier: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Sponsor Description</label>
                    <textarea 
                      rows={3}
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                      placeholder="Brief tribute explaining how they sponsor Team Vortex"
                      value={adminModalFields.desc || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, desc: e.target.value })}
                    />
                  </div>
                </>
              )}

              {adminModalType === 'roster' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. John Doe"
                      value={adminModalFields.name || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Role title</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. Drivetrain Lead / Technical Advisor"
                      value={adminModalFields.role || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, role: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Division/Department</label>
                    <select 
                      className="bg-[#1e1e24] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      value={adminModalFields.department || 'Mechanical'}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, department: e.target.value })}
                    >
                      <option value="Mechanical">Mechanical</option>
                      <option value="Software">Software</option>
                      <option value="Design & Outreach">Design & Outreach</option>
                      <option value="All-Rounder">All-Rounder</option>
                      <option value="Mentors">Advisory / Mentors</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Biographical Summary</label>
                    <textarea 
                      rows={3}
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                      placeholder="Enter a brief, engaging biography explaining this crew member's specialty"
                      value={adminModalFields.bio || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, bio: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Years of FIRST Experience</label>
                    <input 
                      type="number" 
                      min={0}
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      value={adminModalFields.yearsExperience === undefined ? 1 : adminModalFields.yearsExperience}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, yearsExperience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Portrait Image URL (Optional)</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. /assets/images/portraits/person_6.png"
                      value={adminModalFields.photo || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, photo: e.target.value })}
                    />
                  </div>
                </>
              )}

              {adminModalType === 'resource' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Resource Type/Classification</label>
                    <select 
                      className="bg-[#1e1e24] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      value={adminModalFields.category || 'shared'}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, category: e.target.value })}
                    >
                      <option value="shared">Shared Asset / Interactive Tool</option>
                      <option value="pedro">Pedro Pathing Spec / Trajectory Guide</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Resource Name</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. Center of Mass Calculator"
                      value={adminModalFields.name || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Lucide Icon name</label>
                    <select 
                      className="bg-[#1e1e24] border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      value={adminModalFields.icon || 'Compass'}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, icon: e.target.value })}
                    >
                      <option value="Compass">Compass (Navigation)</option>
                      <option value="Wrench">Wrench (Tools)</option>
                      <option value="Cpu">Cpu (Program / Logic)</option>
                      <option value="Box">Box (OnShape CAD / Models)</option>
                      <option value="BookOpen">BookOpen (Archive / Portfolio)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Short teaser description</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. Simulation of center of gravity offsets on a virtual chassis mesh in 3D."
                      value={adminModalFields.desc || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, desc: e.target.value })}
                    />
                  </div>
                  {adminModalFields.category === 'shared' && (
                    <div className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id="isToolCheckbox"
                        className="accent-[var(--accent)] h-4 w-4"
                        checked={!!adminModalFields.isTool}
                        onChange={(e) => setAdminModalFields({ ...adminModalFields, isTool: e.target.checked })}
                      />
                      <label htmlFor="isToolCheckbox" className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] select-none cursor-pointer">
                        Is Special Interactive Tool (loads custom route target)
                      </label>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Target link URL or Custom target identifier</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. https://github.org or 'bom' / 'com-calc' (if interactive tool is checked)"
                      value={adminModalFields.target || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, target: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">CTA Action Text</label>
                    <input 
                      type="text" 
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)]"
                      placeholder="e.g. ACCESS DOCUMENT / LAUNCH PLANNER"
                      value={adminModalFields.cta || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, cta: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Detailed Documentation explanation (Markdown/Plaintext)</label>
                    <textarea 
                      rows={4}
                      className="bg-black/40 border border-[var(--border)] text-stone-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[var(--accent)] resize-none"
                      placeholder="Detail what this resource offers when clicked..."
                      value={adminModalFields.details || ''}
                      onChange={(e) => setAdminModalFields({ ...adminModalFields, details: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setAdminModalType(null)}
                className="px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
              >
                Discard Change
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    if (adminModalType === 'gallery') {
                      const completeFields = {
                        id: adminModalEditId !== null ? adminModalEditId : `gal_${Date.now()}`,
                        src: adminModalFields.src || 'https://picsum.photos/800/600',
                        title: adminModalFields.title || 'Vortex Gallery Photo',
                        category: adminModalFields.category || 'Competitions',
                        description: adminModalFields.description || ''
                      };
                      if (adminModalEditId !== null) {
                        const updated = gallery.map((item: any) => item.id === adminModalEditId ? completeFields : item);
                        updateGallery(updated);
                      } else {
                        updateGallery([...gallery, completeFields]);
                      }
                    }

                    else if (adminModalType === 'sponsor') {
                      const completeFields = {
                        name: adminModalFields.name || 'Champion Partner',
                        logo: adminModalFields.logo || 'https://picsum.photos/300/150',
                        tier: adminModalFields.tier || 'Gold Partner',
                        desc: adminModalFields.desc || 'Proud sponsor of FTC robotics innovation of Vortex.'
                      };
                      if (adminModalEditId !== null) {
                        const updated = sponsorsState.map((item: any, idx: number) => idx === adminModalEditId ? completeFields : item);
                        updateSponsors(updated);
                      } else {
                        updateSponsors([...sponsorsState, completeFields]);
                      }
                    }

                    else if (adminModalType === 'roster') {
                      const completeFields = {
                        id: adminModalEditId !== null ? adminModalEditId : `ros_${Date.now()}`,
                        name: adminModalFields.name || 'Active Member',
                        role: adminModalFields.role || 'FTC Engineering Specialist',
                        department: adminModalFields.department || 'Mechanical',
                        bio: adminModalFields.bio || '',
                        yearsExperience: adminModalFields.yearsExperience === undefined ? 1 : adminModalFields.yearsExperience,
                        photo: adminModalFields.photo || ''
                      };
                      if (adminModalEditId !== null) {
                        const updated = roster.map((item: any) => item.id === adminModalEditId ? completeFields : item);
                        updateRoster(updated);
                      } else {
                        updateRoster([...roster, completeFields]);
                      }
                    }

                    else if (adminModalType === 'resource') {
                      const isPedroCategory = adminModalFields.category === 'pedro';
                      const completeFields = {
                        id: adminModalEditId !== null ? (isPedroCategory ? (pedroPathing[adminModalEditId]?.id || `ped_${Date.now()}`) : `res_${Date.now()}`) : `res_${Date.now()}`,
                        name: adminModalFields.name || 'FTC Asset Spec',
                        icon: adminModalFields.icon || (isPedroCategory ? 'Compass' : 'Wrench'),
                        desc: adminModalFields.desc || '',
                        isTool: !isPedroCategory && !!adminModalFields.isTool,
                        target: adminModalFields.target || '',
                        cta: adminModalFields.cta || (isPedroCategory ? 'ACCESS DOCUMENT' : 'DOWNLOAD ASSET'),
                        details: adminModalFields.details || ''
                      };

                      if (isPedroCategory) {
                        if (adminModalEditId !== null) {
                          const updated = pedroPathing.map((item: any, idx: number) => idx === adminModalEditId ? completeFields : item);
                          updatePedroPathing(updated);
                        } else {
                          updatePedroPathing([...pedroPathing, completeFields]);
                        }
                      } else {
                        if (adminModalEditId !== null) {
                          const updated = sharedAssets.map((item: any, idx: number) => idx === adminModalEditId ? completeFields : item);
                          updateSharedAssets(updated);
                        } else {
                          updateSharedAssets([...sharedAssets, completeFields]);
                        }
                      }
                    }

                    setAdminModalType(null);
                  } catch (e) {
                    console.error("Save failed:", e);
                    alert("A hardware state mismatch occurred, please verify input format.");
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-black text-xs font-black uppercase tracking-wider hover:brightness-105 active:scale-95 transition cursor-pointer flex items-center justify-center font-mono"
              >
                Deploy Configuration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

