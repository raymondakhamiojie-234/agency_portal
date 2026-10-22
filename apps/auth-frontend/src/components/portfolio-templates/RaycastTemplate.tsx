import { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Zap, 
  Cpu, 
  Terminal, 
  Radio, 
  Activity, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Film,
  TrendingUp,
  Eye,
  Clock,
  Camera,
  Mic,
  Award
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

// Subtle Tactile Audio Feedback for Keycaps & CTAs
function playTactileFeedback(type: 'click' | 'bottom' | 'space' = 'click') {
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.07);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (_e) {
    // Graceful fallback if audio blocked
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
  const [activeKeycap, setActiveKeycap] = useState<string>('⌘1');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'audience' | 'gear' | 'workflow'>('audience');

  const triggerClick = (type: 'click' | 'bottom' | 'space' = 'click') => {
    playTactileFeedback(type);
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

  // Primary featured video / showreel
  const heroVideo = featuredMedia && featuredMedia.length > 0 ? featuredMedia[0] : null;
  const heroVideoUrl = heroVideo?.url || heroVideo?.video_url || '';
  const heroThumbnail = heroVideo?.thumbnail_url || portfolio?.banner_url || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80';

  // Creator Shortcuts mapped to sponsorship deliverables
  const shortcuts = [
    { key: '⌘1', label: 'Sponsored Integration', desc: '60s natural narrative segment placed in prime content hook', serviceMatch: 'Sponsored Integration' },
    { key: '⌘2', label: 'Dedicated Showcase', desc: 'Full deep-dive video with hands-on testing and 30-day licensing', serviceMatch: 'Dedicated Promotion' },
    { key: '⌘3', label: 'Vertical Syndicate', desc: '3x viral vertical videos optimized for TikTok, Reels & Shorts', serviceMatch: 'Shorts & TikTok Syndicate' },
    { key: '⌘4', label: 'Keynote & Event', desc: 'Live hosting, conference keynote, or live stream collaboration', serviceMatch: 'Speaking & Event' },
    { key: 'HYPER', label: 'Quarterly Ambassador', desc: 'Multi-platform exclusive campaign with product co-development', serviceMatch: 'Brand Ambassador' }
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#EDEEF0] font-sans selection:bg-[#FF6363] selection:text-white relative overflow-x-hidden antialiased">
      
      {/* Background Micro Mesh & Vignette */}
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

      {/* TOP STATUS BAR */}
      <div className="relative z-20 border-b border-white/[0.06] bg-[#0A0C10]/80 backdrop-blur-md px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6363] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6363]"></span>
            </span>
            <span className="text-[#8A8F98] hidden sm:inline">OFFICIAL CREATOR MEDIA KIT & PORTFOLIO</span>
            <span className="text-[#555A65]">/</span>
            <span className="text-white font-semibold">{creatorName}</span>
          </div>

          <div className="flex items-center gap-4 text-[#8A8F98]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FF6363]" />
              <span>SPONSOR STATUS: <strong className="text-emerald-400 font-mono">OPEN</strong></span>
            </span>
            <span className="hidden sm:inline text-[#555A65]">|</span>
            <span className="hidden md:inline text-white font-mono">{formattedFollowers} VERIFIED REACH</span>
          </div>
        </div>
      </div>

      {/* FLOATING GLASS HEADER */}
      <header className="sticky top-0 z-40 bg-[#07080A]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Creator Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C1E24] to-[#121316] border border-white/10 p-0.5 shadow-lg flex items-center justify-center relative overflow-hidden group">
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
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8A8F98] truncate max-w-[200px] sm:max-w-none">
                {roleTitle || 'Digital Content Creator & Filmmaker'}
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
              Production Specs
            </a>
            <a 
              href="#bento" 
              onClick={() => triggerClick('click')}
              className="hover:text-white transition-colors"
            >
              Audience & Growth
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
              <span>Book Collaboration</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono border border-black/10">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10">

        {/* HERO SECTION: Content Creator Showreel Showcase */}
        <section id="overview" className="pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
          
          {/* Eyebrow Creator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141519] border border-white/10 text-xs font-mono text-[#8A8F98] mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#FF6363]" />
            <span>VERIFIED DIGITAL CONTENT CREATOR</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FF6363] font-semibold">{formattedFollowers} VERIFIED AUDIENCE</span>
          </div>

          {/* Hero Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
            High-Impact Content. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EDEEF0] to-[#8A8F98]">
              Precision by Design.
            </span>
          </h1>

          {/* Bio / Subtitle */}
          <p className="mt-6 sm:mt-8 text-base sm:text-xl text-[#8A8F98] max-w-2xl mx-auto font-normal leading-relaxed">
            {portfolio.tagline || nicheProfile?.ctaDesc || 'Collaborating with leading brands on high-retention video integrations, dedicated reviews, and cross-platform storytelling.'}
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

            {heroVideoUrl && (
              <button
                onClick={() => {
                  triggerClick('bottom');
                  onPlayVideo(heroVideoUrl);
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

          {/* CENTRAL CREATOR SHOWREEL / FEATURED VIDEO DISPLAY */}
          <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
            {/* Ambient Coral Underglow */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-b from-[#FF6363]/25 via-[#FF6363]/5 to-transparent rounded-[3rem] blur-3xl opacity-60 pointer-events-none" />

            {/* Cinematic Video Showcase Frame */}
            <div 
              onClick={() => {
                if (heroVideoUrl) {
                  triggerClick('bottom');
                  onPlayVideo(heroVideoUrl);
                }
              }}
              className={`relative rounded-3xl bg-[#0D0E12] border border-white/10 p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden group ${
                heroVideoUrl ? 'cursor-pointer' : ''
              }`}
            >
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#07080A] flex items-center justify-center border border-white/[0.04]">
                
                {/* Video Thumbnail */}
                <img 
                  src={heroThumbnail} 
                  alt={creatorName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

                {/* Centered Glowing Play Trigger */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6363] text-white flex items-center justify-center shadow-[0_0_40px_rgba(255,99,99,0.7)] group-hover:scale-110 transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                  </div>
                </div>

                {/* Overlaid Telemetry HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-[#FF6363] animate-pulse" />
                  <span>4K 60FPS • CINEMA RIG</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white">
                  <Film className="w-3.5 h-3.5 text-[#FF6363]" />
                  <span>OFFICIAL SHOWREEL</span>
                </div>

                {/* Bottom Video Meta Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-left px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-[#8A8F98]">
                  <div className="truncate max-w-[70%]">
                    <span className="text-white font-bold block truncate">
                      {heroVideo?.title || `${creatorName} // Commercial Showreel & Portfolio`}
                    </span>
                    <span className="text-[10px] text-[#8A8F98] hidden sm:inline">
                      Click to launch full high-definition video player
                    </span>
                  </div>
                  <span className="text-[#FF6363] font-bold text-[11px] shrink-0">
                    WATCH NOW [ SPACE ]
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Creator Performance Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'TOTAL AUDIENCE REACH', val: formattedFollowers, sub: 'Cross-platform total community' },
                { label: 'AVERAGE RETENTION', val: '74.2%', sub: 'High viewer watch-time' },
                { label: 'PRODUCTION RIG', val: 'Sony FX3', sub: '10-bit 4K 120fps Cinema Line' },
                { label: 'AVERAGE TURNAROUND', val: '48–72h', sub: 'From brief to final delivery' }
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

        {/* SECTION 1: SPONSORSHIP SHORTCUTS */}
        <section id="shortcuts" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>Instant Collaboration Shortcuts</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Deliverables in plain sight.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Click any shortcut key to inspect package deliverables, turnaround timelines, and instant proposal booking.
              </p>
            </div>

            {/* Interactive Keycap Deck */}
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
                      <span>SELECT TIER</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Shortcut Detail Inspector Bar */}
            <div className="mt-8 p-6 rounded-2xl bg-[#0D0E14] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1C1E26] border border-white/10 flex items-center justify-center font-mono font-black text-xl text-[#FF6363] shadow-inner shrink-0">
                  {activeKeycap}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#8A8F98]">ACTIVE CAMPAIGN TIER:</span>
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
                  <span>Book Package ({activeKeycap})</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PRODUCTION STANDARDS & SPEC SHEET */}
        <section id="specs" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#07080A] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>Production Standards</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Production Standards. Precision by design.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base">
                Every camera angle, lighting setup, audio track, and script outline is calibrated for commercial broadcast fidelity and high sponsor conversion.
              </p>

              {/* Spec Category Selector */}
              <div className="mt-8 inline-flex p-1 rounded-xl bg-[#121319] border border-white/10">
                {(['audience', 'gear', 'workflow'] as const).map((tab) => (
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
                {activeSpecTab === 'audience' && (
                  <div className="divide-y divide-white/[0.06]">
                    {[
                      { param: 'Total Audience Reach', spec: formattedFollowers, detail: 'Cross-platform verified subscribers and followers' },
                      { param: 'Average Turnaround', spec: '48 to 72 Hours', detail: 'From signed brief to full 4K draft delivery' },
                      { param: 'Engagement Rate', spec: '7.8% - 12.4%', detail: 'Industry-leading active community retention' },
                      { param: 'Primary Demographic', spec: 'Ages 18–35 (76%)', detail: 'Tech enthusiasts, engineers, builders, early adopters' },
                      { param: 'Direct Link Conversions', spec: 'High-Intent CTR', detail: 'Trackable UTM tags, dedicated discount codes' }
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

                {activeSpecTab === 'gear' && (
                  <div className="divide-y divide-white/[0.06]">
                    {[
                      { param: 'Cinema Camera Rig', spec: 'Sony FX3 Cinema Line', detail: 'Full-frame 4K 120p, 10-bit 4:2:2 S-Log3' },
                      { param: 'B-Roll & Macro', spec: 'Sony 90mm f/2.8 Macro', detail: 'Ultra-crisp product closeups & texture shots' },
                      { param: 'Broadcast Audio', spec: 'Shure SM7B + Cloudlifter', detail: 'Studio-grade vocal clarity & noise rejection' },
                      { param: 'Lighting Setup', spec: 'Aputure 300d II + Light Dome', detail: 'High CRI 96+ soft diffused daylight key' },
                      { param: 'Color Calibration', spec: 'DaVinci Resolve DCI-P3', detail: 'Accurate brand product color grading' }
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
                      { param: 'Phase 01: Brief Review', spec: 'Day 1: Alignment', detail: 'Script outline, talking points & positioning review' },
                      { param: 'Phase 02: Production Shoot', spec: 'Day 2-3: Shoot & Grade', detail: 'Multi-cam recording, B-roll captures, sound design' },
                      { param: 'Phase 03: Rough Cut Review', spec: 'Day 4: Frame.io Link', detail: 'Private link with timestamped brand feedback' },
                      { param: 'Phase 04: Live Release', spec: 'Day 5-6: Live Syndicate', detail: 'Coordinated publish time with pinned sponsor link' },
                      { param: 'Phase 05: Analytics Report', spec: 'Day 14: Performance Deck', detail: 'Impressions, reach, retention & conversion metrics' }
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

              {/* Bottom Spec Footer */}
              <div className="bg-[#121319] border-t border-white/[0.06] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-[#8A8F98]">All metrics verified across live client campaigns.</span>
                </div>
                <button
                  onClick={() => {
                    triggerClick('space');
                    onOpenInquiry();
                  }}
                  className="text-xs font-mono text-[#FF6363] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Request Custom Sponsorship Terms</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CREATOR BENTO GRID (AUDIENCE & PRODUCTION) */}
        <section id="bento" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>Audience & Production Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                High-Retention Storytelling.
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Tuned for fast narrative hook delivery, crystal-clear commercial audio, and authentic product endorsements.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: High Retention Graph */}
              <div className="md:col-span-2 rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10 max-w-md">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Audience Retention Curve</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Organic Integration. Zero Fluff.
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-3 leading-relaxed">
                    Custom integrations that seamlessly weave into natural video storylines. No jarring ad reads — authentic endorsements that protect viewer trust and convert.
                  </p>
                </div>

                {/* SVG Retention Graph Representation */}
                <div className="mt-8 relative z-10 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8A8F98] mb-2">
                    <span>VIDEO TIMELINE (0:00 - 10:00)</span>
                    <span className="text-[#FF6363] font-bold">94% HOOK RETENTION</span>
                  </div>
                  <div className="h-16 w-full rounded-xl bg-[#07080A] border border-white/5 p-2 flex items-end gap-1.5 overflow-hidden">
                    {[95, 93, 91, 88, 86, 84, 85, 87, 82, 80, 78, 77, 75, 74, 76, 73, 72, 70, 71, 69, 68].map((val, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${val}%` }} 
                        className={`flex-1 rounded-t transition-all ${
                          i >= 5 && i <= 8 ? 'bg-[#FF6363]' : 'bg-white/20'
                        }`}
                        title={`Segment ${i}: ${val}% retention`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#555A65] mt-2">
                    <span>Hook Window</span>
                    <span className="text-[#FF6363] font-bold">★ SPONSOR SEGMENT</span>
                    <span>Outro & CTA</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-6 relative z-10">
                  <div>
                    <span className="text-[11px] font-mono text-[#8A8F98]">AVERAGE WATCH TIME</span>
                    <p className="text-lg font-bold font-mono text-white">74.2%</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-[11px] font-mono text-[#8A8F98]">BRAND RECALL</span>
                    <p className="text-lg font-bold font-mono text-white">3.4x Industry Avg</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Modular Deliverables */}
              <div className="rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Flexible Formats</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Multi-Format Synergy
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-2 leading-relaxed">
                    Combine 16:9 widescreen YouTube integrations with high-velocity 9:16 vertical reels and community posts.
                  </p>
                </div>

                {/* Visual Format Preview */}
                <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#FF6363]" />
                      16:9 Landscape Video
                    </span>
                    <span className="text-[#8A8F98]">4K UHD</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF6363]" />
                      9:16 Vertical Reels
                    </span>
                    <span className="text-[#8A8F98]">1080x1920</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#FF6363]" />
                      Community & Link Pin
                    </span>
                    <span className="text-[#8A8F98]">Tracked</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Studio Cinema Quality */}
              <div className="rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Production Gear</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Cinema Production
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-2 leading-relaxed">
                    Broadcast lighting, calibrated color spaces, and dedicated macro lenses ensure your product looks stunning.
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs text-[#8A8F98]">
                  <div className="flex items-center gap-2 text-white">
                    <Camera className="w-3.5 h-3.5 text-[#FF6363]" />
                    <span>Sony FX3 Full-Frame 4K</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Mic className="w-3.5 h-3.5 text-[#FF6363]" />
                    <span>Shure SM7B Broadcast Vocal</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Multi-Channel Syndication */}
              <div className="md:col-span-2 rounded-3xl bg-[#0D0E14] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF6363] mb-6">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#8A8F98] uppercase">Cross-Platform Distribution</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Multi-Platform Distribution Syndicate
                  </h3>
                  <p className="text-sm text-[#8A8F98] mt-3 max-w-xl leading-relaxed">
                    One brief, seamless multi-channel broadcast across YouTube, X/Twitter, Instagram Reels, TikTok, and community newsletters.
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
                          <Radio className="w-3.5 h-3.5 text-[#FF6363]" />
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
                          <Radio className="w-3.5 h-3.5 text-[#FF6363]" />
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

        {/* SECTION 4: SHOWREEL & RECENT BRAND INTEGRATIONS */}
        {featuredMedia && featuredMedia.length > 0 && (
          <section id="media" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#07080A] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                    <Play className="w-3.5 h-3.5" />
                    <span>Selected Works & Integrations</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Showreel & Portfolio Clips
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#8A8F98]">
                  CLICK ANY VIDEO TO PLAY [ SPACE ]
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
                          {media.description || 'Verified production quality showcase with authentic brand integration.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: COMMAND PALETTE DELIVERABLES */}
        <section id="deliverables" className="py-20 md:py-28 border-t border-white/[0.06] bg-[#0A0B0E]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6363] uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>Rate Card & Deliverables</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Sponsorship Packages & Rates
              </h2>
              <p className="mt-4 text-[#8A8F98] text-base leading-relaxed">
                Clear deliverable milestones, dedicated licensing rights, and guaranteed publication dates.
              </p>
            </div>

            {/* Command Palette List Menu */}
            <div className="max-w-4xl mx-auto rounded-3xl bg-[#0C0D12] border border-white/10 overflow-hidden shadow-2xl">
              
              {/* Fake Command Search Header */}
              <div className="p-4 bg-[#121318] border-b border-white/[0.08] flex items-center justify-between gap-4 font-mono text-xs text-[#8A8F98]">
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-[#1C1E26] text-white border border-white/10 font-bold">
                    ⌘K
                  </kbd>
                  <span className="text-white font-medium">Select a sponsorship package to initiate proposal...</span>
                </div>
                <span className="hidden sm:inline text-[#555A65]">ENTER: [ ↵ ]</span>
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

        {/* SECTION 6: CALL TO ACTION FOOTER */}
        <section className="py-24 md:py-32 border-t border-white/[0.08] bg-[#07080A] relative overflow-hidden text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF6363]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF6363]/15 text-[#FF6363] border border-[#FF6363]/30 uppercase tracking-widest inline-block mb-6">
              PARTNERSHIP BRIEFING
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Ready to launch your next <br className="hidden sm:inline" />
              campaign with {creatorName}?
            </h2>

            <p className="mt-6 text-[#8A8F98] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Now accepting commercial sponsorships, dedicated reviews, keynote appearances, and long-term brand ambassador partnerships.
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
            <span>Command Deck Creator Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#8A8F98]">MANAGED BY</span>
            <span className="text-white font-semibold">FALCUS MEDIA LTD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
