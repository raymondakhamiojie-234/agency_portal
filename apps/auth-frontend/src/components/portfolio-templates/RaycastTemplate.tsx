import { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Zap, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Terminal, 
  Share2, 
  Radio, 
  Activity, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Disc,
  Globe
} from 'lucide-react';

interface RaycastTemplateProps {
  portfolio: any;
  socialLinks: any[];
  featuredMedia: any[];
  services: any[];
  creatorName: string;
  avatarUrl: string;
  roleTitle: string;
  nicheProfile: any;
  primaryPlatform: string;
  onOpenInquiry: (serviceTitle?: string) => void;
  onPlayVideo: (url: string) => void;
}

// Synthetic Web Audio Mechanical Click Synthesizer
function playMechanicalClick(type: 'click' | 'bottom' | 'space' = 'click') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const now = ctx.currentTime;

    if (type === 'space') {
      // Deeper thock for spacebar / big buttons
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'bottom') {
      // Crisp bottom-out clack
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Standard tactile mechanical switch click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (_e) {
    // Ignore audio restrictions
  }
}

export default function RaycastTemplate({
  portfolio,
  socialLinks,
  featuredMedia,
  services,
  creatorName,
  avatarUrl,
  roleTitle,
  nicheProfile,
  onOpenInquiry,
  onPlayVideo
}: RaycastTemplateProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeKeycap, setActiveKeycap] = useState<string>('⌘1');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'performance' | 'hardware' | 'workflow'>('performance');

  const triggerClick = (type: 'click' | 'bottom' | 'space' = 'click') => {
    if (soundEnabled) {
      playMechanicalClick(type);
    }
  };

  // Follower stats calculation
  let formattedFollowers = '280K+';
  if (portfolio.follower_count && Number(portfolio.follower_count) > 0) {
    const count = Number(portfolio.follower_count);
    if (count >= 1000000) {
      formattedFollowers = `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
    } else if (count >= 1000) {
      formattedFollowers = `${(count / 1000).toFixed(0)}K+`;
    } else {
      formattedFollowers = count.toLocaleString();
    }
  } else if (socialLinks.length > 0 && socialLinks[0]?.followers) {
    formattedFollowers = `${socialLinks[0].followers}`;
  }

  const handleCopyLink = () => {
    triggerClick('bottom');
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Preset Raycast Keycap Shortcuts mapped to creator actions
  const shortcuts = [
    { key: '⌘1', label: 'Hyper Sponsor', desc: 'Prime video integration with custom script', serviceMatch: 'Sponsored Integration' },
    { key: '⌘2', label: 'Dedicated Clip', desc: 'Full deep-dive showcase and distribution', serviceMatch: 'Dedicated Promotion' },
    { key: '⌘3', label: 'Tech Review', desc: 'Honest hands-on hardware & software benchmark', serviceMatch: 'Tech Review' },
    { key: '⌘4', label: 'Keynote & Panel', desc: 'Creator keynote, conference or live hosting', serviceMatch: 'Speaking & Event' },
    { key: 'HYPER', label: 'Full Campaign', desc: 'Multi-platform syndicate takeover', serviceMatch: 'Brand Ambassador' }
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#EDEEF0] font-sans selection:bg-[#FF6363] selection:text-white relative overflow-x-hidden antialiased">
      
      {/* Background Micro Mesh & Subtle Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(255, 99, 99, 0.12) 0%, transparent 55%),
            radial-gradient(circle at 80% 50%, rgba(255, 99, 99, 0.05) 0%, transparent 40%),
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* TOP NOTIFICATION / SYSTEM BAR */}
      <div className="relative z-20 border-b border-white/[0.06] bg-[#0A0C10]/80 backdrop-blur-md px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6363] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6363]"></span>
            </span>
            <span className="text-[#8A8F98] hidden sm:inline">OFFICIAL RAYCAST KEYBOARD EDITION</span>
            <span className="text-[#555A65]">/</span>
            <span className="text-white font-semibold">{creatorName}</span>
          </div>

          <div className="flex items-center gap-4 text-[#8A8F98]">
            <span className="hidden md:flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FF6363]" />
              <span>ENGAGEMENT: <strong className="text-white font-mono">HIGH</strong></span>
            </span>
            <span className="hidden sm:inline text-[#555A65]">|</span>
            {/* Audio switch toggle */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) playMechanicalClick('click');
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]"
              title="Toggle Mechanical Key Sounds"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#FF6363]" />
                  <span>CLICK FX: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#555A65]" />
                  <span>CLICK FX: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING GLASS HEADER */}
      <header className="sticky top-0 z-40 bg-[#07080A]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Creator Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C1E24] to-[#121316] border border-white/10 p-0.5 shadow-lg flex items-center justify-center relative overflow-hidden group">
              <img 
                src={avatarUrl} 
                alt={creatorName} 
                className="w-full h-full object-cover rounded-[10px]"
              />
              <div className="absolute inset-0 bg-[#FF6363]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">{creatorName}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FF6363]/15 text-[#FF6363] border border-[#FF6363]/30">
                  DECK v2.4
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8A8F98] truncate max-w-[200px] sm:max-w-none">
                {roleTitle || 'Hardware & Tech Creator'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#8A8F98]">
            <a 
              href="#overview" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Overview
            </a>
            <a 
              href="#shortcuts" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Shortcuts
            </a>
            <a 
              href="#specs" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Specs
            </a>
            <a 
              href="#bento" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Hardware
            </a>
            <a 
              href="#deliverables" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Deliverables
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8F98] hover:text-white border border-white/[0.08] transition-colors"
              title="Copy Portfolio Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                triggerClick('space');
                onOpenInquiry();
              }}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6363] hover:bg-[#FF4848] text-white font-medium text-xs tracking-wide shadow-[0_0_20px_rgba(255,99,99,0.35)] transition-all active:scale-[0.98]"
            >
              <span>Command Deck</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono border border-black/10">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10">

        {/* HERO SECTION: Tactile Control. Infinite Reach. */}
        <section id="overview" className="pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
          
          {/* Eyebrow Hardware Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141519] border border-white/10 text-xs font-mono text-[#8A8F98] mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#FF6363]" />
            <span>RAYCAST MECHANICAL HARDWARE EDITION</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FF6363] font-semibold">{formattedFollowers} VERIFIED REACH</span>
          </div>

          {/* Large Hero Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
            Tactile Control. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EDEEF0] to-[#8A8F98]">
              Precision by Design.
            </span>
          </h1>

          {/* Bio / Subtitle */}
          <p className="mt-6 sm:mt-8 text-base sm:text-xl text-[#8A8F98] max-w-2xl mx-auto font-normal leading-relaxed">
            {portfolio.tagline || nicheProfile?.ctaDesc || 'Every keycap, cut, and content frame engineered for high-velocity engagement and direct conversions.'}
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                triggerClick('space');
                onOpenInquiry();
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#FF6363] hover:bg-[#FF4848] text-white font-semibold text-sm shadow-[0_0_35px_rgba(255,99,99,0.45)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Cpu className="w-4 h-4" />
              <span>Initiate Partnership</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/25 text-[11px] font-mono border border-black/10">
                ↵
              </kbd>
            </button>

            {featuredMedia && featuredMedia.length > 0 && (
              <button
                onClick={() => {
                  triggerClick('bottom');
                  onPlayVideo(featuredMedia[0]?.url || featuredMedia[0]?.video_url || '');
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#141519] hover:bg-[#1C1E24] text-white font-semibold text-sm border border-white/10 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 text-[#FF6363] fill-[#FF6363]" />
                <span>Watch Showreel</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[11px] font-mono border border-white/5">
                  SPACE
                </kbd>
              </button>
            )}
          </div>

          {/* CENTRAL HARDWARE KEYBOARD DESK RENDER */}
          <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
            {/* Ambient Coral Underglow */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-b from-[#FF6363]/25 via-[#FF6363]/5 to-transparent rounded-[3rem] blur-3xl opacity-60 pointer-events-none" />

            {/* Hardware Keyboard Image / Visual Frame */}
            <div className="relative rounded-3xl bg-[#0D0E12] border border-white/10 p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden group">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#07080A] flex items-center justify-center border border-white/[0.04]">
                
                {/* Raycast Official Keyboard Image */}
                <img 
                  src="https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fimmutable%2Fmedia%2Fkeyboard.3roupfa132r28.png&w=1920&q=95" 
                  alt="Raycast Keyboard Hardware Deck"
                  className="w-full h-full object-contain object-center scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlaid Hardware Telemetry HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#8A8F98]">
                  <Disc className="w-3.5 h-3.5 text-[#FF6363] animate-spin" />
                  <span>SWITCH: GATERON OIL KING (LUBED)</span>
                </div>

                <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#8A8F98]">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2.4GHZ ULTRA LOW LATENCY</span>
                </div>
              </div>
            </div>

            {/* Quick Spec Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'OPERATING FORCE', val: '45gf Linear', sub: 'Instant content turnaround' },
                { label: 'BATTERY LIFETIME', val: '1,200 hrs', sub: 'High stamina production' },
                { label: 'CHASSIS', val: 'CNC Aluminum', sub: 'Anodized matte obsidian' },
                { label: 'POLLING RATE', val: '1,000 Hz', sub: 'Zero latency response' }
              ].map((m, idx) => (
                <div 
                  key={idx}
                  onClick={() => triggerClick('click')}
                  className="bg-[#0C0D12] border border-white/[0.07] hover:border-white/20 rounded-2xl p-4 text-left transition-all hover:bg-[#121318] cursor-default"
                >
                  <p className="text-[10px] font-mono text-[#8A8F98] tracking-wider uppercase">{m.label}</p>
                  <p className="text-xl font-bold font-mono text-white mt-1">{m.val}</p>
                  <p className="text-xs text-[#555A65] mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 1: SHORTCUTS IN PLAIN SIGHT */}
        <section id="shortcuts" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>Custom Keycap Shortcuts</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Your shortcuts in plain sight.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Click any keycap to inspect creator deliverables, instant sponsor integrations, and live collaboration specs.
              </p>
            </div>

            {/* Interactive Mechanical Keycap Deck */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {shortcuts.map((sc) => {
                const isActive = activeKeycap === sc.key;
                return (
                  <button
                    key={sc.key}
                    onClick={() => {
                      triggerClick('bottom');
                      setActiveKeycap(sc.key);
                    }}
                    className={`text-left p-5 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between min-h-[160px] ${
                      isActive 
                        ? 'bg-[#151720] border-[#FF6363] shadow-[0_0_25px_rgba(255,99,99,0.25)] -translate-y-1' 
                        : 'bg-[#0E0F14] border-white/10 hover:border-white/20 hover:bg-[#121319]'
                    }`}
                  >
                    {/* Keycap Badge Graphic */}
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm tracking-wider transition-all ${
                        isActive 
                          ? 'bg-[#FF6363] text-white shadow-md' 
                          : 'bg-[#1C1E26] text-[#EDEEF0] group-hover:bg-[#252834]'
                      }`}>
                        {sc.key}
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6363] animate-pulse" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white mt-4">{sc.label}</h3>
                      <p className="text-xs text-[#8A8F98] mt-1 line-clamp-2 leading-relaxed">{sc.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#FF6363]">
                      <span>SELECT KEY</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Keycap Detail Inspector Bar */}
            <div className="mt-8 p-6 rounded-2xl bg-[#0D0E14] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1C1E26] border border-white/10 flex items-center justify-center font-mono font-black text-xl text-[#FF6363] shadow-inner shrink-0">
                  {activeKeycap}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#8A8F98]">ASSIGNED WORKFLOW:</span>
                    <span className="text-sm font-bold text-white">
                      {shortcuts.find(s => s.key === activeKeycap)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8F98] mt-1">
                    {shortcuts.find(s => s.key === activeKeycap)?.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    triggerClick('space');
                    const match = shortcuts.find(s => s.key === activeKeycap)?.serviceMatch;
                    onOpenInquiry(match);
                  }}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6363] hover:bg-[#FF4848] text-white font-semibold text-xs tracking-wide transition-all shadow-md"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Execute Shortcut ({activeKeycap})</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TECHNICAL SPEC SHEET (MECHANICAL PRECISION) */}
        <section id="specs" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#07080A] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>Engineering Spec Sheet</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Mechanical feel. Precision by design.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base">
                Engineered from the ground up for reliable audience retention, clean production aesthetics, and high ROI partnerships.
              </p>

              {/* Spec Category Selector */}
              <div className="mt-8 inline-flex p-1 rounded-xl bg-[#121319] border border-white/10">
                {(['performance', 'hardware', 'workflow'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      triggerClick('click');
                      setActiveSpecTab(tab);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeSpecTab === tab
                        ? 'bg-[#FF6363] text-white shadow-md'
                        : 'text-[#8A8F98] hover:text-white'
                    }`}
                  >
                    {tab.toUpperCase()} SPECS
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Tables */}
            <div className="max-w-4xl mx-auto rounded-3xl bg-[#0C0D12] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-6 sm:p-8">
                {activeSpecTab === 'performance' && (
                  <div className="divide-y divide-white/[0.06]">
                    {[
                      { param: 'Audience Reach', spec: formattedFollowers, detail: 'Cross-platform total subscribers and followers' },
                      { param: 'Average Turnaround', spec: '48 to 72 Hours', detail: 'From signed brief to full 4K draft delivery' },
                      { param: 'Engagement Rate', spec: '7.8% - 12.4%', detail: 'Industry leading active audience retention' },
                      { param: 'Primary Demographic', spec: 'Ages 18–35 (74%)', detail: 'Tech enthusiasts, engineers, builders, creators' },
                      { param: 'Direct Link Conversions', spec: 'High-intent CTR', detail: 'Trackable UTM tags, dedicated discount codes' }
                    ].map((row, i) => (
                      <div key={i} className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="sm:w-1/3">
                          <span className="text-xs font-mono text-[#8A8F98] uppercase">{row.param}</span>
                        </div>
                        <div className="sm:w-1/3">
                          <span className="text-base font-bold font-mono text-white">{row.spec}</span>
                        </div>
                        <div className="sm:w-1/3 text-left sm:text-right">
                          <span className="text-xs text-[#555A65]">{row.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSpecTab === 'hardware' && (
                  <div className="divide-y divide-white/[0.06]">
                    {[
                      { param: 'Camera Rig', spec: 'Sony FX3 Cinema Line', detail: 'Full-frame 4K 120p, 10-bit 4:2:2 S-Log3' },
                      { param: 'Audio Capture', spec: 'Shure SM7B + Cloudlifter', detail: 'Broadcast-grade vocal clarity & noise rejection' },
                      { param: 'Studio Lighting', spec: 'Aputure 300d II + Light Dome', detail: 'High CRI 96+ soft diffused daylight key' },
                      { param: 'Editing Rig', spec: 'Apple M3 Max 128GB Unified', detail: 'Real-time DaVinci Resolve Studio color grading' },
                      { param: 'Color Space', spec: 'DCI-P3 & Rec.709 Calibrated', detail: 'Professional display-ready color fidelity' }
                    ].map((row, i) => (
                      <div key={i} className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="sm:w-1/3">
                          <span className="text-xs font-mono text-[#8A8F98] uppercase">{row.param}</span>
                        </div>
                        <div className="sm:w-1/3">
                          <span className="text-base font-bold font-mono text-white">{row.spec}</span>
                        </div>
                        <div className="sm:w-1/3 text-left sm:text-right">
                          <span className="text-xs text-[#555A65]">{row.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSpecTab === 'workflow' && (
                  <div className="divide-y divide-white/[0.06]">
                    {[
                      { param: 'Brief Review', spec: 'Day 1: Alignment', detail: 'Script outline, talking points & positioning review' },
                      { param: 'Production Phase', spec: 'Day 2-3: Shoot & Grade', detail: 'Multi-cam recording, B-roll captures, sound design' },
                      { param: 'Rough Cut Delivery', spec: 'Day 4: Internal Review', detail: 'Frame.io link with timestamped feedback comments' },
                      { param: 'Final Release', spec: 'Day 5-6: Live Syndicate', detail: 'Coordinated publish time with pinned sponsor link' },
                      { param: 'Analytics Report', spec: 'Day 14: Performance Deck', detail: 'Impressions, reach, retention & conversion metrics' }
                    ].map((row, i) => (
                      <div key={i} className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="sm:w-1/3">
                          <span className="text-xs font-mono text-[#8A8F98] uppercase">{row.param}</span>
                        </div>
                        <div className="sm:w-1/3">
                          <span className="text-base font-bold font-mono text-white">{row.spec}</span>
                        </div>
                        <div className="sm:w-1/3 text-left sm:text-right">
                          <span className="text-xs text-[#555A65]">{row.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Spec Footer with Interactive Audio Clack */}
              <div className="bg-[#121319] border-t border-white/[0.06] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-[#8A8F98]">All metrics verified across live client campaigns.</span>
                </div>
                <button
                  onClick={() => {
                    playMechanicalClick('space');
                    playMechanicalClick('bottom');
                  }}
                  className="text-xs font-mono text-[#FF6363] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test switch sound sample</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: RAYCAST BENTO GRID */}
        <section id="bento" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>Modular Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Remarkably slim. Big on features.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Every component is tuned for rapid integration, crystal clear clarity, and maximum sponsor ROI.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Rotary Dial / Reach */}
              <div className="md:col-span-2 rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10 max-w-md">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Tuning Dial</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Direct volume & audience tuning.
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-3 leading-relaxed">
                    Custom integrations that seamlessly blend into natural creator storytelling. No disruptive ad breaks — just genuine endorsements that drive clicks.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-6 relative z-10">
                  <div>
                    <span className="text-[11px] font-mono text-[#8A8F98]">ACCURACY</span>
                    <p className="text-lg font-bold font-mono text-white">99.4%</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-[11px] font-mono text-[#8A8F98]">BRAND RECALL</span>
                    <p className="text-lg font-bold font-mono text-white">3.4x Avg</p>
                  </div>
                </div>

                {/* Raycast Knob Graphic */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 pointer-events-none">
                  <img 
                    src="https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fimmutable%2Fmedia%2Fknob.3noqpufwegb8c.webp&w=1080&q=70" 
                    alt="Rotary knob"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Card 2: Hot-Swap Switches / Modular Packages */}
              <div className="rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Hot-Swappable</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Tailored Packages
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-2 leading-relaxed">
                    Swap between YouTube pre-rolls, dedicated reviews, TikTok carousels, or multi-week brand takeovers.
                  </p>
                </div>

                {/* Hot-swap Visual */}
                <div className="mt-6 h-36 relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                  <img 
                    src="https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fimmutable%2Fmedia%2Fhotswap.20fcxf59o5tc6.webp&w=1080&q=70" 
                    alt="Hot swap switch"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Card 3: Lightbar / Visual Quality */}
              <div className="rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Visual Accent</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Cinema Production
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-2 leading-relaxed">
                    10-bit color grading, macro lens detail shots, and custom motion graphics in every integration.
                  </p>
                </div>

                {/* Lightbar Image */}
                <div className="mt-6 h-36 relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                  <img 
                    src="https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fimmutable%2Fmedia%2Flightbar.3iufyg8ci49kk.webp&w=1080&q=70" 
                    alt="RGB Lightbar"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Card 4: Multi-Channel Syndication (Tri-mode) */}
              <div className="md:col-span-2 rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Tri-Mode Connectivity</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Multi-Platform Distribution Syndicate
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-3 max-w-xl leading-relaxed">
                    One brief, seamless multi-channel broadcast across YouTube, X/Twitter, Instagram Reels, and LinkedIn creator feeds.
                  </p>

                  {/* Connected channels pills */}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {socialLinks && socialLinks.length > 0 ? (
                      socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerClick('click')}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white transition-all hover:scale-105"
                        >
                          <Globe className="w-3.5 h-3.5 text-[#FF6363]" />
                          <span>{link.platform.toUpperCase()}</span>
                          {link.followers && (
                            <span className="text-[#8A8F98]">({link.followers})</span>
                          )}
                          <ExternalLink className="w-3 h-3 text-[#555A65]" />
                        </a>
                      ))
                    ) : (
                      ['YouTube', 'X (Twitter)', 'Instagram', 'TikTok'].map((plat, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                        >
                          <Globe className="w-3.5 h-3.5 text-[#FF6363]" />
                          <span>{plat}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SHOWREEL & FEATURED MEDIA */}
        {featuredMedia && featuredMedia.length > 0 && (
          <section id="media" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#07080A] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                    <Play className="w-3.5 h-3.5" />
                    <span>Selected Broadcasts</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Showreel & Portfolio Clips
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#8A8F98]">
                  CLICK ANY BROADCAST TO PLAY [ SPACE ]
                </span>
              </div>

              {/* Media Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMedia.map((media, idx) => {
                  const mediaUrl = media.url || media.video_url || '';
                  const mediaTitle = media.title || `Featured Integration #${idx + 1}`;
                  const mediaThumb = media.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        triggerClick('bottom');
                        if (mediaUrl) onPlayVideo(mediaUrl);
                      }}
                      className="group rounded-2xl bg-[#0D0E14] border border-white/10 hover:border-[#FF6363]/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img 
                          src={mediaThumb} 
                          alt={mediaTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#FF6363] group-hover:bg-[#FF4848] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Top corner badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
                          REC • 4K 60FPS
                        </div>
                      </div>

                      {/* Card Meta */}
                      <div className="p-5">
                        <h3 className="font-bold text-white text-base group-hover:text-[#FF6363] transition-colors line-clamp-1">
                          {mediaTitle}
                        </h3>
                        <p className="text-xs text-[#8A8F98] mt-1 line-clamp-2 leading-relaxed">
                          {media.description || 'Verified production quality showcase with genuine brand integration.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: COMMAND PALETTE & DELIVERABLES */}
        <section id="deliverables" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>Command Palette</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Creator Deliverables & Rates
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Clear deliverables, dedicated licensing rights, and guaranteed engagement timelines.
              </p>
            </div>

            {/* Raycast Style Command List Menu */}
            <div className="max-w-4xl mx-auto rounded-3xl bg-[#0C0D12] border border-white/10 overflow-hidden shadow-2xl">
              
              {/* Fake Command Search Header */}
              <div className="p-4 bg-[#121318] border-b border-white/[0.08] flex items-center justify-between gap-4 font-mono text-xs text-[#8A8F98]">
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-[#1C1E26] text-white border border-white/10 font-bold">
                    ⌘K
                  </kbd>
                  <span className="text-white font-medium">Select a sponsorship package to initiate proposal...</span>
                </div>
                <span className="hidden sm:inline text-[#555A65]">NAVIGATE: [ ↑ ↓ ] ENTER: [ ↵ ]</span>
              </div>

              {/* Service Rows */}
              <div className="divide-y divide-white/[0.06]">
                {(services && services.length > 0 ? services : [
                  { title: 'Sponsored Video Integration', description: '60s natural segment with pinned comment & tracked link', price: '$850' },
                  { title: 'Dedicated Product Review', description: 'Full deep-dive benchmark, script review, and 30-day rights', price: '$2,400' },
                  { title: 'Shorts & TikTok Syndicate', description: '3x viral vertical videos with sound design and hooks', price: '$1,200' },
                  { title: 'Annual Brand Ambassador', description: 'Exclusive quarterly campaign syndicate and event appearances', price: 'Custom' }
                ]).map((srv, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      triggerClick('space');
                      onOpenInquiry(srv.title);
                    }}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#14161F] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-[#FF6363] group-hover:bg-[#FF6363] group-hover:text-white transition-colors">
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-[#FF6363] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-[#8A8F98] mt-1 max-w-xl leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      {srv.price && (
                        <span className="text-sm font-mono font-bold text-white px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                          {srv.price}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerClick('space');
                          onOpenInquiry(srv.title);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF6363]/15 group-hover:bg-[#FF6363] text-[#FF6363] group-hover:text-white font-mono text-xs font-semibold transition-all border border-[#FF6363]/30"
                      >
                        <span>BOOK [ ↵ ]</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: DESK CALL TO ACTION FOOTER */}
        <section className="py-24 md:py-32 border-t border-white/[0.08] bg-[#07080A] relative overflow-hidden text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF6363]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF6363]/15 text-[#FF6363] border border-[#FF6363]/30 uppercase tracking-widest inline-block mb-6">
              READY FOR DEPLOYMENT
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Everything that you love about {creatorName}, <br className="hidden sm:inline" />
              now on your desk.
            </h2>

            <p className="mt-6 text-[#8A8F98] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Available for brand sponsorships, commercial hardware shoots, keynote demos, and affiliate partnerships.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  triggerClick('space');
                  onOpenInquiry();
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#FF6363] hover:bg-[#FF4848] text-white font-bold text-sm tracking-wide shadow-[0_0_40px_rgba(255,99,99,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
              >
                <Cpu className="w-4 h-4" />
                <span>Submit Campaign Brief [ ⌘K ]</span>
              </button>
            </div>

            {/* Verified Agency Guarantee Stamp */}
            <div className="mt-12 flex items-center justify-center gap-2 text-xs font-mono text-[#555A65]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL TALENT MANAGED BY FALCUS MEDIA LTD • FAST VERIFIED DISPATCH</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#050608] py-8 text-xs font-mono text-[#555A65]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#8A8F98]">
            <span>© {new Date().getFullYear()} {creatorName}</span>
            <span>•</span>
            <span>Raycast Keyboard Portfolio Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#8A8F98]">POWERED BY</span>
            <span className="text-white font-semibold">FALCUS MEDIA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
