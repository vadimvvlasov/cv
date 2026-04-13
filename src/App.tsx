import { useState, useEffect, useRef, useCallback, createContext, useContext, type ReactNode } from 'react';

/* ================================================================
   DATA
   ================================================================ */

interface Achievement {
  metric: string;
  animTarget: number;
  prefix: string;
  suffix: string;
  icon: string;
  desc: string;
  color: string;
}

const achievements: Achievement[] = [
  {
    metric: 'MCC = 0.91',
    animTarget: 0.91,
    prefix: 'MCC = ',
    suffix: '',
    icon: '🎯',
    desc: 'Global field-boundary segmentation model (ResUNet-A) trained on 16.9 GB of auto-collected Sentinel-2 data across 5+ continents — zero manual labelling.',
    color: 'emerald',
  },
  {
    metric: '35,000+ EOPatches',
    animTarget: 35000,
    prefix: '',
    suffix: '+',
    icon: '🛰️',
    desc: 'Production ML pipeline on Apache Airflow + AWS processing satellite imagery across 11 Brazilian states (~12 M km²) with fully automated STAC-based ingestion.',
    color: 'blue',
  },
  {
    metric: '33 h → 20 h',
    animTarget: 20,
    prefix: '33 h → ',
    suffix: ' h',
    icon: '⚡',
    desc: 'Eliminated OOM crashes via memray profiling, malloc_trim, in-place ops, ESRGAN session cleanup, and multiprocessing zonemerge with lazy loading.',
    color: 'amber',
  },
  {
    metric: '0.77 → 0.89 MCC',
    animTarget: 0.89,
    prefix: '0.77 → ',
    suffix: '',
    icon: '📈',
    desc: 'Transfer-learning fine-tuning: adapted global model to Brazil (0.77 → 0.89) and Argentina (MCC = 0.87) in a single training pass.',
    color: 'violet',
  },
];

const experience = [
  {
    title: 'ML Engineer / Geospatial Computer Vision Engineer',
    company: 'Agromon',
    period: '2023 – 2026',
    bullets: [
      'Built global field-boundary segmentation model (ResUNet-A, MCC = 0.91) on Sentinel-2 L2A data for 5+ countries — 16.9 GB of training data collected automatically, 5-fold CV, AdamW.',
      'Fine-tuned local models via transfer learning: Brazil MCC 0.77 → 0.89, Argentina MCC = 0.87, each in a single training pass.',
      'Designed and operated production ML pipeline on Apache Airflow + AWS (EC2, S3, Batch) processing 35,000+ EOPatches across 11 Brazilian states (~12 M km²) — STAC ingestion → ResUNet-A + ESRGAN prediction → vectorisation → GeoPackage deliverables.',
      'Eliminated OOM crashes in vectorisation (9,439 patches) via memray profiling, malloc_trim, in-place tensor ops, ESRGAN session cleanup; multiprocessing zonemerge reduced São Paulo post-processing from 33 h to ~20 h.',
      'Developed crop-classification system (Transformer Encoder, PyTorch) with two-season corn detection (safra / safrinha), validated against Brazilian government statistics (CONAB / SIDRA).',
      'Delivered client-facing POCs for Brazil, Romania, and Russia: GeoPackage deliverables with field boundaries, crop types, farm-cadastre integration (SIGEF / SNCI), QGIS projects.',
      'Researched SOTA models for geospatial ML — Prithvi-EO-2.0 (IBM / NASA), Swin UNETR, SITSMamba — informed architecture decisions for the production pipeline.',
    ],
  },
];

interface SkillGroup {
  label: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    label: 'Deep Learning & Computer Vision',
    skills: ['PyTorch', 'TensorFlow 2.15', 'ResUNet-A', 'Transformer Encoder', 'ESRGAN', 'U-Net', 'Semantic Segmentation', 'Transfer Learning', 'Data Augmentation', 'Cross-Validation'],
  },
  {
    label: 'Geospatial & Remote Sensing',
    skills: ['eo-flow', 'eo-learn', 'GDAL', 'Rasterio', 'GeoPandas', 'Shapely', 'Higra Watershed', 'OpenCV', 'STAC', 'Sentinel-2 L2A', 'HLS (NASA)', 'MapBiomas', 'GeoTIFF', 'GeoPackage'],
  },
  {
    label: 'Infrastructure & MLOps',
    skills: ['Apache Airflow 2.10', 'AWS (EC2, S3, Batch)', 'Docker', 'GitLab CI', 'TensorBoard', 'memray', 'Memory Profiling & Optimisation', 'Multiprocessing'],
  },
  {
    label: 'Data & General',
    skills: ['Python', 'SQL', 'Git', 'Linux', 'CI/CD', 'Feature Engineering', 'EDA', 'Flask', 'Django', 'Agricultural Data Analytics', 'English'],
  },
];

const skillLevels: Record<string, number> = {
  'PyTorch': 90,
  'TensorFlow 2.15': 85,
  'Semantic Segmentation': 92,
  'Transfer Learning': 88,
  'Data Augmentation': 80,
  'Apache Airflow 2.10': 85,
  'AWS (EC2, S3, Batch)': 80,
  'Docker': 75,
  'memray': 70,
  'Memory Profiling & Optimisation': 72,
};

const projects = [
  {
    title: 'Global Field-Boundary Segmentation (ResUNet-A)',
    desc: 'Single model for 5+ continents — MCC = 0.91, extent accuracy = 0.913, Strict IoU = 0.917. 16.9 GB of auto-collected Sentinel-2 data, 5-fold CV, AdamW, multi-head output (extent / boundary / distance maps).',
    tags: ['ResUNet-A', 'Sentinel-2', 'TensorFlow'],
    color: 'emerald',
  },
  {
    title: 'Production Pipeline — Brazil (Airflow + AWS)',
    desc: 'End-to-end automated processing of 11 Brazilian states: STAC download → ResUNet-A + ESRGAN prediction → vectorisation → merge → zonemerge → GeoPackage. 35,000+ EOPatches, ~12 M km². Full cycles from 1 to 8 days per state.',
    tags: ['Airflow', 'AWS', 'STAC'],
    color: 'blue',
  },
  {
    title: 'Crop Classification — Transformer Encoder (PyTorch)',
    desc: 'Two-season corn detection (safra / safrinha) using hybrid approach: Transformer Encoder (5 layers, 2 attention heads) + MapBiomas logic + validation against CONAB / SIDRA statistics. WorldCereal baseline MCC = 85.8%.',
    tags: ['PyTorch', 'Transformer', 'Classification'],
    color: 'violet',
  },
  {
    title: 'Memory & Performance Optimisation',
    desc: 'OOM fix at 9,439 EOPatches vectorisation: memray profiling, malloc_trim, in-place ops, ESRGAN session cleanup, multiprocessing zonemerge with lazy loading. São Paulo post-processing reduced from 33 h to ~20 h (1.5 M polygons).',
    tags: ['memray', 'Python', 'Optimisation'],
    color: 'amber',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; ring: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/30', ring: 'ring-emerald-400/20', bar: 'bg-emerald-400' },
  blue: { bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/30', ring: 'ring-blue-400/20', bar: 'bg-blue-400' },
  violet: { bg: 'bg-violet-400/10', text: 'text-violet-400', border: 'border-violet-400/30', ring: 'ring-violet-400/20', bar: 'bg-violet-400' },
  amber: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/30', ring: 'ring-amber-400/20', bar: 'bg-amber-400' },
  teal: { bg: 'bg-teal-400/10', text: 'text-teal-400', border: 'border-teal-400/30', ring: 'ring-teal-400/20', bar: 'bg-teal-400' },
};

/* ================================================================
   HOOKS
   ================================================================ */

// TASK 2: useInView hook
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// TASK 5: useAnimatedCounter hook
function useAnimatedCounter(end: number, duration = 1500, start = false) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCurrent(easeOutCubic(progress) * end);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);

  return current;
}

/* ================================================================
   THEME CONTEXT (TASK 6)
   ================================================================ */

interface ThemeCtx {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ dark: true, toggle: () => {} });

function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('cv-theme');
      return stored !== 'light';
    } catch {
      return true;
    }
  });

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      try { localStorage.setItem('cv-theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  return useContext(ThemeContext);
}

/* ================================================================
   COMPONENTS
   ================================================================ */

// SectionHeader
function SectionHeader({ label, title }: { label: string; title: string }) {
  const { dark } = useTheme();
  return (
    <div className="mb-12 text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-emerald-400">{label}</span>
      <h2 className={`mt-2 text-3xl font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h2>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
    </div>
  );
}

// TASK 4: Toast
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

// AnimatedCounter component for metrics (TASK 5)
function AnimatedMetric({ achievement }: { achievement: Achievement }) {
  const { ref, inView } = useInView(0.3);
  const value = useAnimatedCounter(achievement.animTarget, 1500, inView);
  const c = colorMap[achievement.color] ?? colorMap.emerald;
  const { dark } = useTheme();

  // Determine formatting based on metric type
  const isDecimal = achievement.animTarget < 1;
  const formattedValue = isDecimal ? value.toFixed(2) : Math.round(value).toLocaleString();

  // Reconstruct the display string
  let displayMetric: string;
  if (achievement.metric.startsWith('MCC')) {
    displayMetric = `MCC = ${formattedValue}`;
  } else if (achievement.metric.includes('EOPatches')) {
    displayMetric = `${formattedValue}+`;
  } else if (achievement.metric.includes('→') && achievement.metric.includes('h')) {
    displayMetric = `33 h → ${formattedValue} h`;
  } else if (achievement.metric.includes('→') && achievement.metric.includes('MCC')) {
    displayMetric = `0.77 → ${formattedValue}`;
  } else {
    displayMetric = `${achievement.prefix}${formattedValue}${achievement.suffix}`;
  }

  return (
    <div ref={ref} className={`rounded-2xl border p-6 transition-all duration-300 hover:border-opacity-50 ${
      dark ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'
    }`} aria-label={`Achievement: ${achievement.metric}`}>
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${c.bg} ${c.text} text-lg`}>
        {achievement.icon}
      </div>
      <div className={`font-mono text-2xl font-bold ${c.text}`}>{displayMetric}</div>
      <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{achievement.desc}</p>
    </div>
  );
}

// Skill group with progress bars (TASK 3)
function SkillGroupCard({ group, index }: { group: SkillGroup; index: number }) {
  const { ref, inView } = useInView(0.15);
  const { dark } = useTheme();
  const isDL = group.label.includes('Deep Learning');
  const isInfra = group.label.includes('Infrastructure');
  const showBars = isDL || isInfra;
  const barColor = isDL ? 'bg-emerald-400' : 'bg-violet-400';

  const skillsWithLevels = group.skills.filter((s) => skillLevels[s] !== undefined);
  const skillsWithoutLevels = group.skills.filter((s) => skillLevels[s] === undefined);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border p-6 opacity-0 transition-all duration-700 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6'
      } ${dark ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}
      style={{ transitionDelay: inView ? `${index * 100}ms` : '0ms' }}
    >
      <h3 className={`mb-4 text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{group.label}</h3>

      {showBars && skillsWithLevels.length > 0 && (
        <div className="mb-4 space-y-3">
          {skillsWithLevels.map((skill) => {
            const level = skillLevels[skill];
            return (
              <div key={skill} className="flex items-center gap-3">
                <span className={`w-44 text-xs ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{skill}</span>
                <div className={`flex-1 overflow-hidden rounded-full ${dark ? 'bg-white/5' : 'bg-slate-200'}`} style={{ height: '6px' }}>
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-1000`}
                    style={{ width: inView ? `${level}%` : '0%' }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[10px] text-slate-500">{level}%</span>
              </div>
            );
          })}
        </div>
      )}

      <ul className="flex flex-wrap gap-2" role="list" aria-label={`${group.label} skills`}>
        {skillsWithoutLevels.map((skill) => (
          <li key={skill}>
            <span className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              dark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
              {skill}
            </span>
          </li>
        ))}
        {showBars && skillsWithLevels.map((skill) => (
          <li key={skill}>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              dark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ================================================================
// MAIN APP
// ================================================================

const NAV_ITEMS = ['About', 'Achievements', 'Experience', 'Skills', 'Projects', 'Education'];

function App() {
  const { dark, toggle } = useTheme();

  // ---- State ----
  const [activeSection, setActiveSection] = useState('About');
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // ---- TASK 1: Scroll-spy via IntersectionObserver ----
  useEffect(() => {
    const sections = NAV_ITEMS.map((id) => document.getElementById(id.toLowerCase())).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const label = NAV_ITEMS.find((n) => n.toLowerCase() === entry.target.id);
            if (label) setActiveSection(label);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ---- TASK 9: Inject glow-pulse keyframe ----
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        50%       { box-shadow: 0 0 12px 4px rgba(52, 211, 153, 0.25); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ---- TASK 4: Copy email ----
  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText('vadimvvlasov@gmail.com').then(() => {
      setEmailCopied(true);
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => setEmailCopied(false), 300);
      }, 2500);
    });
  }, []);

  // ---- TASK 7: Print ----
  const handlePrint = useCallback(() => {
    const style = document.createElement('style');
    style.id = 'print-override';
    style.innerHTML = `
      @media print {
        nav, footer, .animate-bounce, .fixed, button, .gradient-orb { display: none !important; }
        body { background: white !important; color: black !important; }
        section { page-break-inside: avoid; }
        .print-show { display: block !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.getElementById('print-override')?.remove(), 1000);
  }, []);

  // ---- Smooth scroll ----
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  // ---- Theme classes ----
  const bgMain = dark ? 'bg-[#0a0f1e]' : 'bg-white';
  const textMain = dark ? 'text-slate-200' : 'text-slate-800';
  const navBg = dark ? 'bg-[#0a0f1e]/90' : 'bg-white/90';
  const navBorder = dark ? 'border-white/5' : 'border-slate-200';
  const footerBg = dark ? 'bg-[#080d1a] border-white/5' : 'bg-slate-50 border-slate-200';
  const cardBg = dark ? 'bg-[#111827]' : 'bg-white';
  const cardBorder = dark ? 'border-white/10' : 'border-slate-200';
  const mutedText = dark ? 'text-slate-400' : 'text-slate-600';
  const subMutedText = dark ? 'text-slate-500' : 'text-slate-400';
  const heroSubBg = dark ? 'bg-[#080d1a]' : 'bg-slate-50';

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`} role="main">
      {/* ---- NAVBAR ---- */}
      <nav className={`fixed top-0 z-40 w-full backdrop-blur-lg ${navBg} border-b ${navBorder}`} aria-label="Main navigation">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-semibold text-emerald-400 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-emerald-400 rounded">
            VV
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`text-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 py-0.5 ${
                  activeSection === item
                    ? 'text-emerald-400'
                    : `${mutedText} hover:text-emerald-400`
                }`}
                aria-current={activeSection === item ? 'true' : undefined}
              >
                {item}
              </button>
            ))}

            {/* TASK 6: Theme toggle */}
            <button
              onClick={toggle}
              className={`rounded-lg p-2 text-lg transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400 ${mutedText}`}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* TASK 7: Print button */}
            <button
              onClick={handlePrint}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400 ${cardBorder} ${subMutedText}`}
              aria-label="Download CV as PDF"
            >
              ↓ PDF
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className={`border-t ${navBorder} px-6 py-4 md:hidden`}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`block w-full py-2 text-left text-sm transition-colors ${
                  activeSection === item ? 'text-emerald-400' : mutedText
                }`}
              >
                {item}
              </button>
            ))}
            <div className="mt-2 flex gap-3">
              <button onClick={toggle} className={`text-lg ${mutedText}`} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={handlePrint} className={`text-sm ${mutedText}`} aria-label="Download CV as PDF">
                ↓ PDF
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ---- HERO ---- */}
      <section id="about" className={`relative flex min-h-screen items-center justify-center overflow-hidden pt-24 ${dark ? 'bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#0a1628]' : 'bg-gradient-to-br from-white via-slate-50 to-blue-50'}`}>
        {/* Gradient orbs */}
        <div className="gradient-orb pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="gradient-orb pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
            {/* Avatar card */}
            <div className={`flex-shrink-0 rounded-2xl border p-3 ${cardBg} ${cardBorder}`}>
              <img
                src="/cv/vadim_vlasov.png"
                alt="Vadim Vlasov"
                className="h-48 w-48 rounded-xl object-cover"
              />
            </div>

            {/* Text content */}
            <div className="text-center md:text-left">
              {/* TASK 9: Animated badge */}
              <div className="mb-4 flex justify-center md:justify-start">
                <span
                  className="glow-pulse inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open to Work — Remote Worldwide
                </span>
              </div>

              <h1 className={`text-5xl font-bold tracking-tight md:text-6xl ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                Vadim Vlasov
              </h1>
              <p className="mt-3 font-mono text-sm text-emerald-400">
                ML Engineer <span className={subMutedText}>|</span> Computer Vision <span className={subMutedText}>|</span> Geospatial ML
              </p>
              <p className={`mt-4 max-w-lg text-lg leading-relaxed ${mutedText}`}>
                ML Engineer specialising in end-to-end geospatial computer vision pipelines for satellite imagery —
                from raw Sentinel-2 / HLS data to production-grade field boundary segmentation, crop classification,
                and cadastral data integration.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                {/* TASK 4: Copy Email */}
                <button
                  onClick={handleCopyEmail}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    emailCopied
                      ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400'
                      : `${cardBorder} ${dark ? 'bg-white/5 text-slate-200 hover:border-emerald-400/30 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:border-emerald-400/30 hover:bg-slate-100'}`
                  }`}
                  aria-label="Copy email address"
                >
                  {emailCopied ? (
                    <>
                      <span>✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <span>✉</span>
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                {/* TASK 7: Download PDF */}
                <button
                  onClick={handlePrint}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400 ${cardBorder} ${dark ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  aria-label="Download CV as PDF"
                >
                  <span>↓</span>
                  <span>Download CV</span>
                </button>

                <a
                  href="https://www.linkedin.com/in/vadim-vlasov-181503b6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400 ${cardBorder} ${dark ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  aria-label="View LinkedIn profile"
                >
                  <span>in</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex justify-center">
            <div className="animate-bounce text-2xl text-emerald-400">↓</div>
          </div>
        </div>
      </section>

      {/* ---- ACHIEVEMENTS (TASK 5: animated counters) ---- */}
      <section id="achievements" className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeader label="Results" title="Key Achievements" />
        <div className="grid gap-6 sm:grid-cols-2">
          {achievements.map((a) => (
            <AnimatedMetric key={a.metric} achievement={a} />
          ))}
        </div>
      </section>

      {/* ---- EXPERIENCE (TASK 8: timeline layout) ---- */}
      <section id="experience" className={`mx-auto max-w-5xl px-6 py-24 ${heroSubBg}`}>
        <SectionHeader label="Career" title="Experience" />
        {experience.map((job) => (
          <div key={job.company} className={`mx-auto max-w-3xl rounded-2xl border p-8 ${cardBg} ${cardBorder}`}>
            {/* Timeline */}
            <div className="relative pl-12">
              {/* Vertical line */}
              <div className={`absolute left-5 top-0 h-full w-px bg-gradient-to-b from-emerald-400/50 to-transparent`} />

              {/* Timeline dot */}
              <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-lg ring-2 ring-emerald-400/50">
                💼
              </div>

              {/* Content */}
              <div className="ml-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={`text-xl font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{job.title}</h3>
                  <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${dark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    {job.period}
                  </span>
                </div>
                <p className={`mt-1 font-medium ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>{job.company}</p>
                <ul className="mt-4 space-y-3" role="list" aria-label={`${job.company} achievements`}>
                  {job.bullets.map((b, i) => (
                    <li key={i} className={`flex gap-3 text-sm leading-relaxed ${mutedText}`}>
                      <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ---- SKILLS (TASK 3: progress bars) ---- */}
      <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeader label="Toolkit" title="Skills" />
        <div className="grid gap-6 md:grid-cols-2">
          {skillGroups.map((g, i) => (
            <SkillGroupCard key={g.label} group={g} index={i} />
          ))}
        </div>
      </section>

      {/* ---- PROJECTS ---- */}
      <section id="projects" className={`mx-auto max-w-5xl px-6 py-24 ${heroSubBg}`}>
        <SectionHeader label="Portfolio" title="Selected Projects" />
        <ProjectGrid />
      </section>

      {/* ---- EDUCATION ---- */}
      <section id="education" className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeader label="Background" title="Education" />
        <EducationSection />
      </section>

      {/* ---- FOOTER ---- */}
      <footer className={`border-t ${footerBg}`} role="contentinfo">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12">
          <h3 className={`text-lg font-semibold ${dark ? 'text-slate-200' : 'text-slate-900'}`}>Get In Touch</h3>
          <p className={`text-center text-sm ${mutedText}`}>
            Open to remote-worldwide ML Engineer / Computer Vision / Geospatial ML positions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleCopyEmail}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 ${cardBorder} ${dark ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              aria-label="Copy email address"
            >
              ✉ {emailCopied ? 'Copied!' : 'vadimvvlasov@gmail.com'}
            </button>
            <a href="https://www.linkedin.com/in/vadim-vlasov-181503b6/" target="_blank" rel="noopener noreferrer" className={`rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 ${mutedText} hover:text-emerald-400`}>LinkedIn</a>
            <a href="https://github.com/vadimvvlasov" target="_blank" rel="noopener noreferrer" className={`rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 ${mutedText} hover:text-emerald-400`}>GitHub</a>
            <a href="https://career.habr.com/vadimv-v-vlasov" target="_blank" rel="noopener noreferrer" className={`rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 ${mutedText} hover:text-emerald-400`}>Habr Career</a>
          </div>
          <p className={`mt-4 text-xs ${subMutedText}`}>© 2026 Vadim Vlasov.</p>
        </div>
      </footer>

      {/* Toast */}
      <Toast message="Email copied!" visible={toastVisible} />
    </div>
  );
}

// ProjectGrid with animation (TASK 2)
function ProjectGrid() {
  const { ref, inView } = useInView(0.1);
  const { dark } = useTheme();

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2">
      {projects.map((p, i) => {
        const c = colorMap[p.color] ?? colorMap.emerald;
        return (
          <div
            key={p.title}
            className={`rounded-2xl border p-6 opacity-0 transition-all duration-700 hover:border-opacity-50 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6'
            } ${dark ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}
            style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
          >
            <h3 className={`mb-2 text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{p.title}</h3>
            <p className={`mb-4 text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{p.desc}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className={`rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Education section with animation (TASK 2)
function EducationSection() {
  const { ref, inView } = useInView(0.15);
  const { dark } = useTheme();

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-2xl rounded-2xl border p-8 opacity-0 transition-all duration-700 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6'
      } ${dark ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-2xl">
          🎓
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>Ural Federal University (UrFU), Yekaterinburg</h3>
          <p className={`mt-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Postgraduate studies (Aspirantura) — Pipeline transport, diagnostics & modelling</p>
          <p className={`mt-1 text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>MSc in Engineering</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   EXPORT WITH THEME PROVIDER
   ================================================================ */

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
