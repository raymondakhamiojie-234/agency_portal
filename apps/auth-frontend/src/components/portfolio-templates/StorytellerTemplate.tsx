import { useState } from 'react';
import { 
  Play, 
  ArrowUpRight, 
  Menu, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface StorytellerTemplateProps {
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

export default function StorytellerTemplate({
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
}: StorytellerTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Format follower count
  let formattedFollowers = '248K+';
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

  // Smooth scroll
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Curated media projects
  const defaultStoryProjects = [
    {
      title: 'A summer booked somewhere.',
      tag: 'COMMERCIAL',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      desc: 'Narrative brand campaign exploring coastal living, slow mornings, and authentic lifestyle moments.',
      url: ''
    },
    {
      title: 'Take the long way home.',
      tag: '35MM FILM',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      desc: 'Cinematic travel piece capturing unexpected roadside encounters and mountain mist.',
      url: ''
    },
    {
      title: 'Small Batch Florals.',
      tag: 'EDITORIAL',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
      desc: 'Studio visual study emphasizing organic textures, natural daylight, and artisan craftsmanship.',
      url: ''
    },
    {
      title: '48 hours, no itinerary.',
      tag: 'TRAVEL SERIES',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      desc: 'Episodic vertical series generated over 1.2M organic views across European cityscapes.',
      url: ''
    }
  ];

  const displayProjects = featuredMedia.length > 0 ? featuredMedia : defaultStoryProjects;

  // Default services fallback matching the Figma design
  const defaultServicesList = [
    {
      title: 'Brand Campaigns & Creative Direction',
      description: 'Comprehensive campaign conceptualization, visual narrative treatments, on-location shooting, and organic rollout strategy.',
      price: '$1,500 - $3,500'
    },
    {
      title: 'Short-Form Video & Social Series',
      description: 'High-retention vertical reels, TikToks, and episodic storylines engineered with psychological hooks and high shareability.',
      price: '$800 - $1,800'
    },
    {
      title: '35mm & Editorial Photography',
      description: 'Authentic film aesthetic imagery, licensed hero assets for digital & print advertising, and high-res campaign stills.',
      price: '$650 - $1,200'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServicesList;

  // Hero landscape photo
  const heroImage = portfolio.banner_url || displayProjects[0]?.image || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#141414] font-sans selection:bg-[#E84A27] selection:text-white antialiased">
      
      {/* =========================================================================
          1. TOP NAVBAR (Matches Figma Header: Minimalist + Red Emblem + Pill CTA)
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Creator Name */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => scrollTo('top')}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E84A27] animate-pulse" />
            <span className="font-extrabold text-sm tracking-widest uppercase text-[#141414]">
              {creatorName}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-[#555]">
            <button onClick={() => scrollTo('work')} className="hover:text-[#E84A27] transition-colors">
              Work
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-[#E84A27] transition-colors">
              About
            </button>
            <button onClick={() => scrollTo('services')} className="hover:text-[#E84A27] transition-colors">
              Services
            </button>
            <button onClick={() => scrollTo('metrics')} className="hover:text-[#E84A27] transition-colors">
              Community
            </button>
            <button onClick={() => scrollTo('process')} className="hover:text-[#E84A27] transition-colors">
              Process
            </button>
          </nav>

          {/* Contact Pill CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenInquiry()}
              className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#E84A27] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              Get In Touch
            </button>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#141414] hover:text-[#E84A27]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F7F5F0] border-b border-[#E5E0D8] px-6 py-5 space-y-4">
            <button onClick={() => scrollTo('work')} className="block w-full text-left font-bold uppercase tracking-wider text-sm">
              Work
            </button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left font-bold uppercase tracking-wider text-sm">
              About
            </button>
            <button onClick={() => scrollTo('services')} className="block w-full text-left font-bold uppercase tracking-wider text-sm">
              Services
            </button>
            <button onClick={() => scrollTo('metrics')} className="block w-full text-left font-bold uppercase tracking-wider text-sm">
              Community
            </button>
            <button onClick={() => scrollTo('process')} className="block w-full text-left font-bold uppercase tracking-wider text-sm">
              Process
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenInquiry(); }}
              className="w-full py-3 rounded-full bg-[#E84A27] text-white text-xs font-bold tracking-wider uppercase text-center"
            >
              Work With Me
            </button>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION ("OUT THERE. ALL IN.")
         ========================================================================= */}
      <section id="top" className="pt-12 md:pt-16 pb-16 px-6 max-w-7xl mx-auto">
        
        {/* Top Tag & Big Title Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE7DC] text-[#444] text-[11px] font-mono tracking-widest uppercase mb-6">
              <span>●</span>
              <span>{roleTitle || 'VISUAL STORYTELLER / CREATIVE DIRECTOR'}</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.92] text-[#141414]">
              Out There.<br />
              <span className="text-[#141414]">All In.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-3 space-y-4">
            <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed">
              {portfolio.bio || "Capturing moments that make you stop scrolling and start feeling. Partnering with forward-thinking brands on authentic campaigns, cinematic short-form series, and visual storytelling."}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#888] uppercase tracking-wider">
              <span>Available for bookings</span>
              <span>—</span>
              <span className="text-[#E84A27] font-bold">Worldwide</span>
            </div>
          </div>
        </div>

        {/* Hero Widescreen Image Banner with Floating Play Button */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black group aspect-[16/9] md:aspect-[21/9]">
          <img 
            src={heroImage} 
            alt="Hero Visual Showcase"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-[0.95]"
          />

          {/* Floating Orange Accent / Play Button */}
          <button
            onClick={() => {
              const video = displayProjects.find((p: any) => p.url && (p.url.includes('youtube') || p.url.includes('youtu.be')));
              if (video) onPlayVideo(video.url);
              else onOpenInquiry();
            }}
            className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#E84A27] hover:bg-[#d03d1c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group-hover:rotate-12 cursor-pointer z-10"
            aria-label="Play Reel"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>

          {/* Bottom Left Location / Credit Badge */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <div className="backdrop-blur-md bg-black/60 text-white/90 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E84A27]" />
              <span>DIRECTED & SHOT ON LOCATION</span>
            </div>
          </div>
        </div>

        {/* Brand / Partner Logos Ticker */}
        <div className="mt-12 pt-8 border-t border-[#E5E0D8]">
          <p className="text-[11px] font-mono tracking-widest uppercase text-[#888] mb-5">
            Trusted By Global Brands & Agencies
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6 md:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all text-sm md:text-base font-black tracking-tight text-[#333]">
            <span className="hover:text-[#E84A27] transition-colors">Airbnb</span>
            <span className="hover:text-[#E84A27] transition-colors">Patagonia</span>
            <span className="hover:text-[#E84A27] transition-colors">Aesop</span>
            <span className="hover:text-[#E84A27] transition-colors">Rimowa</span>
            <span className="hover:text-[#E84A27] transition-colors">Kinfolk</span>
            <span className="hover:text-[#E84A27] transition-colors">Leica</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED WORKS ("Less scrolling. More feeling.")
         ========================================================================= */}
      <section id="work" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E5E0D8]">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-14">
          <div className="md:col-span-8">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E84A27] block mb-2">
              [ SELECTED REPERTOIRE ]
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414] leading-[0.95]">
              Less scrolling.<br />
              More feeling.
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm text-[#555] leading-relaxed">
              A curated selection of campaigns, short films, and visual stories created to stop thumbs and leave an imprint.
            </p>
          </div>
        </div>

        {/* Asymmetrical Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Project 1 (Large 7 cols) */}
          {displayProjects[0] && (
            <div 
              onClick={() => displayProjects[0].url ? onPlayVideo(displayProjects[0].url) : onOpenInquiry(displayProjects[0].title)}
              className="md:col-span-7 group cursor-pointer space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] shadow-md">
                <img 
                  src={displayProjects[0].image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} 
                  alt={displayProjects[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#141414] text-[10px] font-mono font-bold tracking-widest uppercase shadow">
                    {displayProjects[0].tag || 'COMMERCIAL'}
                  </span>
                </div>
                {displayProjects[0].url && (
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:bg-[#E84A27] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#E84A27] transition-colors">
                  {displayProjects[0].title}
                </h3>
                <p className="text-xs text-[#666] mt-1">{displayProjects[0].desc}</p>
              </div>
            </div>
          )}

          {/* Project 2 (5 cols) */}
          {displayProjects[1] && (
            <div 
              onClick={() => displayProjects[1].url ? onPlayVideo(displayProjects[1].url) : onOpenInquiry(displayProjects[1].title)}
              className="md:col-span-5 group cursor-pointer space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] shadow-md">
                <img 
                  src={displayProjects[1].image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                  alt={displayProjects[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#141414] text-[10px] font-mono font-bold tracking-widest uppercase shadow">
                    {displayProjects[1].tag || '35MM FILM'}
                  </span>
                </div>
                {displayProjects[1].url && (
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:bg-[#E84A27] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#E84A27] transition-colors">
                  {displayProjects[1].title}
                </h3>
                <p className="text-xs text-[#666] mt-1">{displayProjects[1].desc}</p>
              </div>
            </div>
          )}

          {/* Project 3 (5 cols) */}
          {displayProjects[2] && (
            <div 
              onClick={() => displayProjects[2].url ? onPlayVideo(displayProjects[2].url) : onOpenInquiry(displayProjects[2].title)}
              className="md:col-span-5 group cursor-pointer space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] shadow-md">
                <img 
                  src={displayProjects[2].image || 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80'} 
                  alt={displayProjects[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#141414] text-[10px] font-mono font-bold tracking-widest uppercase shadow">
                    {displayProjects[2].tag || 'EDITORIAL'}
                  </span>
                </div>
                {displayProjects[2].url && (
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:bg-[#E84A27] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#E84A27] transition-colors">
                  {displayProjects[2].title}
                </h3>
                <p className="text-xs text-[#666] mt-1">{displayProjects[2].desc}</p>
              </div>
            </div>
          )}

          {/* Project 4 (7 cols) */}
          {displayProjects[3] && (
            <div 
              onClick={() => displayProjects[3].url ? onPlayVideo(displayProjects[3].url) : onOpenInquiry(displayProjects[3].title)}
              className="md:col-span-7 group cursor-pointer space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] shadow-md">
                <img 
                  src={displayProjects[3].image || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80'} 
                  alt={displayProjects[3].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#141414] text-[10px] font-mono font-bold tracking-widest uppercase shadow">
                    {displayProjects[3].tag || 'TRAVEL SERIES'}
                  </span>
                </div>
                {displayProjects[3].url && (
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:bg-[#E84A27] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#E84A27] transition-colors">
                  {displayProjects[3].title}
                </h3>
                <p className="text-xs text-[#666] mt-1">{displayProjects[3].desc}</p>
              </div>
            </div>
          )}

        </div>

        {/* View All Work Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onOpenInquiry()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#141414] hover:bg-[#141414] hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Request Full Commercial Portfolio</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. ABOUT SECTION ("Big curiosity. Small ego.")
         ========================================================================= */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#E5E0D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Portrait with Taped Note Accent */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-xl max-w-md mx-auto">
              {/* Taped note accent */}
              <div className="absolute -top-3 left-10 z-10 bg-[#FFFDFA] border border-[#DDD] px-4 py-1 rotate-[-3deg] shadow-sm text-[11px] font-mono font-bold text-[#333]">
                hello world, I'm {creatorName}
              </div>

              <div className="rounded-xl overflow-hidden aspect-[4/5] bg-gray-200">
                <img 
                  src={avatarUrl} 
                  alt={creatorName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-mono text-[#777]">
                <span>CREATOR // DIRECTOR</span>
                <span className="flex items-center gap-1 text-[#E84A27]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VERIFIED TALENT
                </span>
              </div>
            </div>
          </div>

          {/* Right: Ethos & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E84A27] block">
              [ THE CREATOR BEHIND THE LENS ]
            </span>
            
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414] leading-[0.95]">
              Big curiosity.<br />
              <span className="font-serif italic lowercase font-normal text-3xl sm:text-5xl">Small ego.</span>
            </h2>

            <div className="space-y-4 text-sm md:text-base text-[#444] leading-relaxed">
              <p>
                {portfolio.bio || "I believe the most compelling content doesn't shout—it resonates. For over 4 years, I've spent my time behind lenses, keyboards, and editing timelines crafting work that honors the human experience."}
              </p>
              <p>
                Whether partnering with heritage brands on documentary short films or launching viral episodic series across TikTok and Facebook, every project starts with curiosity and ends with measurable cultural impact.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E5E0D8]">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#141414]">4+ Yrs</p>
                <p className="text-[11px] font-mono uppercase text-[#777]">Industry Experience</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#141414]">{formattedFollowers}</p>
                <p className="text-[11px] font-mono uppercase text-[#777]">Total Community</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#E84A27]">99%</p>
                <p className="text-[11px] font-mono uppercase text-[#777]">Brand Re-book Rate</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SERVICES ("Different subjects. Same soul.")
         ========================================================================= */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#E5E0D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E84A27] block">
              [ CREATIVE OFFERINGS ]
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414] leading-[0.95]">
              Different subjects.<br />
              Same soul.
            </h2>
            <p className="text-sm text-[#555] leading-relaxed pt-2">
              Every partnership is tailored from the ground up to captivate your audience without feeling like a generic interruption.
            </p>
          </div>

          <div className="lg:col-span-7 divide-y divide-[#E5E0D8]">
            {displayServices.map((service: any, index: number) => (
              <div 
                key={index}
                className="py-6 first:pt-0 last:pb-0 group cursor-pointer"
                onClick={() => onOpenInquiry(service.title)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-mono font-bold text-[#E84A27] pt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#E84A27] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#555] mt-1.5 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono font-bold text-[#141414] block">
                      {service.price}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E84A27] group-hover:underline flex items-center justify-end gap-1 mt-1">
                      <span>Inquire</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. AUDIENCE & COMMUNITY METRICS (Dark Charcoal Section in Figma)
         ========================================================================= */}
      <section id="metrics" className="bg-[#141414] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#E84A27] block mb-2">
                [ AUDIENCE ENGAGEMENT ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
                Not just an audience.<br />
                A community.
              </h2>
            </div>
            <div className="md:col-span-4">
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                High-trust, organic attention across verified digital channels. Audiences that comment, share, and act on recommendations.
              </p>
            </div>
          </div>

          {/* 3 Giant Metric Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-2">
              <p className="text-5xl sm:text-7xl font-black tracking-tight text-white">
                {formattedFollowers}
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-[#E84A27]">
                Total Social Reach
              </p>
              <p className="text-xs text-gray-400">
                Engaged followers across verified accounts.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-5xl sm:text-7xl font-black tracking-tight text-white">
                4.8%
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-[#E84A27]">
                Engagement Rate
              </p>
              <p className="text-xs text-gray-400">
                Over 3x higher than standard industry benchmarks.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-5xl sm:text-7xl font-black tracking-tight text-white">
                3.2M
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-[#E84A27]">
                Monthly Video Impressions
              </p>
              <p className="text-xs text-gray-400">
                Organic watch-time and algorithm recommendation velocity.
              </p>
            </div>
          </div>

          {/* Social Links Row */}
          {socialLinks.length > 0 && (
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-gray-400 uppercase tracking-widest">Connect on Social Channels:</span>
              <div className="flex flex-wrap items-center gap-4">
                {socialLinks.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-[#E84A27] text-white transition-all flex items-center gap-1.5"
                  >
                    <span>{link.platform}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          7. TESTIMONIAL / SOCIAL PROOF
         ========================================================================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <span className="text-6xl md:text-7xl font-serif text-[#E84A27] block leading-none select-none">
          “
        </span>
        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[#141414] leading-snug mt-2">
          {nicheProfile?.testimonialQuote || `"${creatorName} doesn't just capture a place. They capture how it feels to be there. The result was our most-saved creator activation of the year."`}
        </blockquote>
        <div className="mt-8 space-y-1">
          <p className="font-bold text-sm text-[#141414] uppercase tracking-wider">
            {nicheProfile?.testimonialAuthor || 'Sarah Jenkins'}
          </p>
          <p className="text-xs text-[#777] font-mono">
            {nicheProfile?.testimonialRole || 'VP of Marketing & Creator Strategy, Peak Collective'}
          </p>
        </div>
      </section>

      {/* =========================================================================
          8. PROCESS ("Good things start with a hello.")
         ========================================================================= */}
      <section id="process" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E5E0D8]">
        <div className="mb-14">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#E84A27] block mb-2">
            [ HOW WE WORK ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#141414]">
            Good things start with a hello.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#ECE7DC] space-y-3">
            <span className="text-xs font-mono font-bold text-[#E84A27]">01</span>
            <h3 className="text-xl font-bold text-[#141414]">Discovery & Concept</h3>
            <p className="text-xs text-[#555] leading-relaxed">
              We align on your campaign goals, brand ethos, target audience, and key performance deliverables.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#ECE7DC] space-y-3">
            <span className="text-xs font-mono font-bold text-[#E84A27]">02</span>
            <h3 className="text-xl font-bold text-[#141414]">Production & Storytelling</h3>
            <p className="text-xs text-[#555] leading-relaxed">
              On-location filming, high-fidelity visual styling, sound design, and retention-optimized editing.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#ECE7DC] space-y-3">
            <span className="text-xs font-mono font-bold text-[#E84A27]">03</span>
            <h3 className="text-xl font-bold text-[#141414]">Delivery & Launch</h3>
            <p className="text-xs text-[#555] leading-relaxed">
              Asset delivery with full usage rights, synchronized community release, and post-campaign analytics.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CAMERA ROLL (Candid 3-photo grid)
         ========================================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#E5E0D8]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#141414]">
            From the camera roll.
          </h2>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E84A27]">
            #BTS & Daily Life
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
              alt="BTS 1" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80" 
              alt="BTS 2" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80" 
              alt="BTS 3" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FOOTER CTA BANNER ("LET'S MAKE SOMETHING MATTER.")
         ========================================================================= */}
      <footer id="contact" className="bg-[#E84A27] text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="text-xs font-mono tracking-widest uppercase text-white/80 block mb-4">
                [ START A COLLABORATION ]
              </span>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-white">
                Let's make<br />
                something matter.
              </h2>
            </div>
            
            <div className="lg:col-span-4 lg:pb-2">
              <button
                onClick={() => onOpenInquiry()}
                className="w-full sm:w-auto px-8 py-5 rounded-full bg-[#141414] hover:bg-white hover:text-[#141414] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-xl inline-flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Send Campaign Proposal</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Contact Email Direct Link */}
          <div className="pt-10 border-t border-white/20">
            <p className="text-xs font-mono uppercase tracking-widest text-white/70 mb-2">
              Direct Partnership Inquiries:
            </p>
            <a 
              href={`mailto:${portfolio.contact_email || 'partnerships@falcusmedia.com'}`}
              className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold hover:underline break-all"
            >
              {portfolio.contact_email || 'partnerships@falcusmedia.com'}
            </a>
          </div>

          {/* Sub-footer Bar */}
          <div className="pt-12 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/75">
            <p>© {new Date().getFullYear()} {creatorName}. Managed by Falcus Media Ltd.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollTo('top')} className="hover:text-white transition-colors">
                Back To Top ↑
              </button>
              <a href="/login" className="hover:text-white transition-colors">
                Creator Portal
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
