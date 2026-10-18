import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  ExternalLink, 
  Send, 
  Play, 
  ShieldCheck, 
  ArrowRight, 
  Eye,
  Compass,
  ChevronRight
} from 'lucide-react';

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry Form State
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [budget, setBudget] = useState('Flexible / Open to Quote');
  const [campaignDetails, setCampaignDetails] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Determine active slug from params or pathname
  const activeSlug = slug || window.location.pathname.replace(/^\/(?:p\/)?/, '').split('/')[0];

  useEffect(() => {
    if (activeSlug) {
      fetchPublicPortfolio(activeSlug);
    } else {
      setError('Creator not found');
      setLoading(false);
    }
  }, [activeSlug]);

  const fetchPublicPortfolio = async (creatorSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/portfolio/public/${creatorSlug}`);
      setPortfolio(res.data.portfolio);
    } catch (err: any) {
      console.error('Failed to load creator portfolio:', err);
      setError(err.response?.data?.error || 'Creator portfolio not found or currently in draft mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryError('');
    setInquirySuccess(false);

    try {
      await axios.post(`/api/portfolio/public/${activeSlug}/inquiry`, {
        brand_name: brandName,
        contact_name: contactName,
        contact_email: contactEmail,
        budget,
        campaign_details: campaignDetails
      });

      setInquirySuccess(true);
      setBrandName('');
      setContactName('');
      setContactEmail('');
      setCampaignDetails('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setInquiryError(err.response?.data?.error || 'Failed to submit proposal. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const scrollToSection = (id: string, packageTitle?: string) => {
    if (packageTitle) {
      setCampaignDetails((prev) => 
        prev ? `${prev}\nInterested Package: ${packageTitle}` : `Interested Package: ${packageTitle}`
      );
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e7e7e8] flex flex-col items-center justify-center text-black">
        <div className="w-12 h-12 rounded-full border-2 border-black border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-gray-600">Loading Media Kit...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#e7e7e8] flex flex-col items-center justify-center text-black px-4">
        <div className="max-w-md w-full bg-white border border-black/10 p-10 rounded-3xl shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Portfolio Unavailable</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = Array.isArray(portfolio.social_links)
    ? portfolio.social_links
    : typeof portfolio.social_links === 'string'
    ? JSON.parse(portfolio.social_links || '[]')
    : [];

  const featuredMedia = Array.isArray(portfolio.featured_media)
    ? portfolio.featured_media
    : typeof portfolio.featured_media === 'string'
    ? JSON.parse(portfolio.featured_media || '[]')
    : [];

  const services = Array.isArray(portfolio.services)
    ? portfolio.services
    : typeof portfolio.services === 'string'
    ? JSON.parse(portfolio.services || '[]')
    : [];

  const accentColor = portfolio.theme_color || '#e63946';

  return (
    <div className="min-h-screen bg-[#e7e7e8] text-black selection:bg-[#e63946] selection:text-white font-sans overflow-x-hidden">
      
      {/* Top Agency Status Ribbon */}
      <div className="w-full bg-[#dddddf] border-b border-black/10 px-6 py-2.5 text-xs flex items-center justify-between font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-neutral-800">Falcus Media Verified Creator</span>
        </div>
        <div className="flex items-center space-x-6 text-gray-600">
          <span className="hidden sm:inline">OFFICIAL MEDIA KIT // {portfolio.slug?.toUpperCase()}</span>
          <button 
            onClick={() => scrollToSection('inquiry-section')}
            className="font-bold text-black hover:text-[#e63946] transition-colors underline uppercase"
          >
            Book Creator &rarr;
          </button>
        </div>
      </div>

      {/* =========================================================================
          HERO POSTER SECTION (Matches Reference Image Exactly)
         ========================================================================= */}
      <section className="relative w-full pt-12 pb-24 md:pb-36 px-4 md:px-12 flex flex-col items-center justify-center overflow-hidden border-b border-black/10">
        
        {/* Subtle Architectural Grid Crosshairs (+) */}
        <div className="absolute top-8 left-8 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>
        <div className="absolute top-8 left-1/3 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>
        <div className="absolute top-8 right-1/3 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>
        <div className="absolute top-8 right-8 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>
        <div className="absolute top-1/2 left-8 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>
        <div className="absolute top-1/2 right-8 text-gray-400 font-mono text-sm pointer-events-none select-none">+</div>

        {/* Directional Chevrons (▶ and ◀) on edges */}
        <div className="absolute left-6 top-1/3 text-black text-xs font-mono pointer-events-none select-none">▶</div>
        <div className="absolute right-6 top-1/3 text-black text-xs font-mono pointer-events-none select-none">◀</div>

        {/* Central Vertical Red Accent Block (Drops from top behind title) */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-36 h-80 md:h-96 z-0 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Top Header Row */}
        <div className="w-full max-w-5xl flex items-start justify-between z-10 mb-8 sm:mb-12">
          {/* Top Left: WELCOME TO MY */}
          <div className="text-left font-black tracking-tight leading-none text-black">
            <span className="block text-xs sm:text-sm md:text-base font-extrabold tracking-wider font-mono uppercase">
              WELCOME
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-extrabold tracking-wider font-mono uppercase">
              TO MY
            </span>
          </div>

          {/* Top Right: Minimalist Graphic Eye Badge */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border-2 border-black flex items-center justify-center bg-[#e7e7e8] shadow-sm">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-black" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Centerpiece Title: Double-Layered "PORTFOLIO" */}
        <div className="relative w-full max-w-5xl text-center select-none z-10 my-2 sm:my-4">
          
          {/* Wireframe Outline Echo Layer (Offset behind) */}
          <div 
            aria-hidden="true"
            className="absolute -top-4 sm:-top-7 md:-top-10 left-1/2 -translate-x-1/2 w-full text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter uppercase pointer-events-none opacity-80"
            style={{
              WebkitTextStroke: '1.5px black',
              color: 'transparent',
              letterSpacing: '-0.04em'
            }}
          >
            PORTFOLIO
          </div>

          {/* Solid Heavy Black Layer (Front) */}
          <h1 
            className="relative text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter uppercase text-black"
            style={{ letterSpacing: '-0.04em' }}
          >
            PORTFOLIO
          </h1>

          {/* Sub-Headline: Creator Name (Left) and Role/Niche (Right) */}
          <div className="w-full max-w-5xl flex items-center justify-between text-[11px] sm:text-xs md:text-sm font-bold tracking-wider font-mono uppercase text-black mt-6 px-2 sm:px-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 font-mono">+</span>
              <span>{portfolio.display_name || 'CREATOR'}</span>
            </div>

            <div className="hidden sm:block text-gray-400 font-mono">+</div>

            <div className="flex items-center space-x-2">
              <span>{portfolio.tagline || `${portfolio.primary_platform || 'DIGITAL'} CREATOR`}</span>
              <span className="text-gray-400 font-mono">+</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FAN OF CARDS (5 Tilted Interactive Cards)
           ========================================================================= */}
        <div className="relative w-full max-w-5xl mt-12 sm:mt-16 pt-4 flex justify-center items-center">
          
          {/* Base Circular Dial / Radar Graphic */}
          <div className="absolute -bottom-16 sm:-bottom-24 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full border-2 border-dashed border-black/20 pointer-events-none flex flex-col items-center justify-start pt-3">
            <div className="text-[10px] font-mono font-bold tracking-widest text-black flex items-center">
              ▲ ME
            </div>
            <div className="w-48 sm:w-72 h-48 sm:h-72 rounded-full border border-black/15 mt-2 flex items-center justify-center">
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-gray-500 select-none">
                PORTFOLIO &bull; PORTFOLIO &bull; PORTFOLIO
              </span>
            </div>
          </div>

          {/* 5-Card Fanned Deck Container */}
          <div className="relative flex items-center justify-center h-72 sm:h-96 w-full px-4">

            {/* CARD 1 (Far Left -24deg): About / Bio Card */}
            <div 
              onClick={() => scrollToSection('about-section')}
              className="absolute w-44 sm:w-56 h-64 sm:h-80 bg-black text-white rounded-3xl p-5 shadow-2xl border border-white/20 cursor-pointer transition-all duration-300 transform -rotate-[22deg] -translate-x-32 sm:-translate-x-52 translate-y-4 hover:rotate-0 hover:-translate-y-6 hover:scale-110 z-10 hover:z-40 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-gray-400">
                <span>01 // BIO</span>
                <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
              </div>
              <div className="my-auto">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white line-clamp-3">
                  {portfolio.bio ? portfolio.bio.slice(0, 90) + '...' : 'Official creator portfolio and brand collaboration media kit.'}
                </div>
              </div>
              <div className="text-[10px] font-mono uppercase text-gray-400 group-hover:text-white flex items-center justify-between border-t border-white/10 pt-3">
                <span>READ STORY</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* CARD 2 (Mid Left -11deg): Emblem Graphic Card (Red) */}
            <div 
              onClick={() => scrollToSection('stats-section')}
              className="absolute w-44 sm:w-56 h-64 sm:h-80 text-black rounded-3xl p-5 shadow-2xl border border-black/10 cursor-pointer transition-all duration-300 transform -rotate-[10deg] -translate-x-16 sm:-translate-x-28 translate-y-2 hover:rotate-0 hover:-translate-y-6 hover:scale-110 z-20 hover:z-40 flex flex-col justify-between group"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-black/70">
                <span>02 // REACH</span>
                <span>▼</span>
              </div>
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-black flex items-center justify-center bg-black/10 group-hover:rotate-45 transition-transform duration-500">
                  <Eye className="w-9 h-9 sm:w-11 sm:h-11 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-mono font-black text-xs sm:text-sm mt-3 uppercase tracking-wider text-black">
                  {portfolio.follower_count > 0 ? `${(portfolio.follower_count).toLocaleString()} AUDIENCE` : 'VERIFIED METRICS'}
                </span>
              </div>
              <div className="text-[10px] font-mono font-bold uppercase text-black/80 flex items-center justify-between border-t border-black/20 pt-3">
                <span>VIEW STATS</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* CARD 3 (Center 0deg): Creator Portrait Card */}
            <div 
              onClick={() => scrollToSection('about-section')}
              className="relative w-48 sm:w-64 h-72 sm:h-88 bg-white text-black rounded-3xl p-4 shadow-2xl border-2 border-black/10 cursor-pointer transition-all duration-300 transform rotate-0 -translate-y-2 hover:-translate-y-8 hover:scale-105 z-30 hover:z-40 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-gray-500 pb-2">
                <span className="flex items-center text-black">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#e63946]" /> VERIFIED
                </span>
                <span>DVS // X2X4</span>
              </div>
              
              {/* Image Container */}
              <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-neutral-900 border border-black/10 relative">
                {portfolio.avatar_url ? (
                  <img 
                    src={portfolio.avatar_url} 
                    alt={portfolio.display_name}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-white font-mono text-center p-4">
                    <span className="text-3xl font-black mb-1">{portfolio.display_name?.charAt(0) || 'C'}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{portfolio.display_name}</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider">
                  {portfolio.primary_platform || 'Talent'}
                </div>
              </div>

              <div className="pt-2 text-center">
                <div className="font-black text-sm sm:text-base uppercase tracking-tight text-black truncate">
                  {portfolio.display_name}
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider truncate">
                  {portfolio.tagline || 'Creator Portfolio'}
                </div>
              </div>
            </div>

            {/* CARD 4 (Mid Right +12deg): Featured Production Card */}
            <div 
              onClick={() => scrollToSection('works-section')}
              className="absolute w-44 sm:w-56 h-64 sm:h-80 bg-white text-black rounded-3xl p-5 shadow-2xl border border-black/10 cursor-pointer transition-all duration-300 transform rotate-[12deg] translate-x-16 sm:translate-x-28 translate-y-2 hover:rotate-0 hover:-translate-y-6 hover:scale-110 z-20 hover:z-40 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-gray-400">
                <span>03 // WORK</span>
                <span>1:1</span>
              </div>
              <div className="my-auto text-center">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </div>
                <div className="font-black text-xs sm:text-sm uppercase tracking-tight text-black line-clamp-2">
                  {featuredMedia.length > 0 ? featuredMedia[0].title : 'Top Production Showcase'}
                </div>
                <span className="inline-block mt-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded text-gray-700">
                  {featuredMedia.length} Videos Available
                </span>
              </div>
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500 group-hover:text-black flex items-center justify-between border-t border-black/10 pt-3">
                <span>PLAY REEL</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* CARD 5 (Far Right +24deg): Sponsorship / Collab Card */}
            <div 
              onClick={() => scrollToSection('packages-section')}
              className="absolute w-44 sm:w-56 h-64 sm:h-80 bg-neutral-900 text-white rounded-3xl p-5 shadow-2xl border border-white/20 cursor-pointer transition-all duration-300 transform rotate-[24deg] translate-x-32 sm:translate-x-52 translate-y-4 hover:rotate-0 hover:-translate-y-6 hover:scale-110 z-10 hover:z-40 flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-gray-400">
                <span>04 // RATES</span>
                <span className="text-[#e63946] font-bold">&bull; LIVE</span>
              </div>
              <div className="my-auto">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">PACKAGES</div>
                <div className="font-black text-sm sm:text-base uppercase tracking-tight text-white">
                  Brand Deals & Collabs
                </div>
                <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 font-mono">
                  {services.length > 0 ? `${services.length} custom sponsorship options ready to book.` : 'Dedicated videos, integrations, & campaigns.'}
                </p>
              </div>
              <div className="text-[10px] font-mono uppercase text-gray-400 group-hover:text-white flex items-center justify-between border-t border-white/10 pt-3">
                <span>VIEW RATES</span>
                <span>&rarr;</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 1: AUDIENCE METRICS & CHANNELS (BRUTALIST EDITORIAL STYLE)
         ========================================================================= */}
      <section id="stats-section" className="max-w-6xl mx-auto px-6 py-20 border-b border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-black">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
              // SECTION 01 &bull; REACH
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Audience & Channels
            </h2>
          </div>
          <p className="font-mono text-xs text-gray-600 mt-2 md:mt-0 uppercase tracking-wider">
            Verified across social networks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Verified Aggregate Metric Card */}
          <div className="md:col-span-1 bg-white border-2 border-black rounded-3xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase text-gray-500">
                <span>TOTAL REACH</span>
                <span>+</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-black tracking-tight mt-6">
                {portfolio.follower_count > 0 ? (portfolio.follower_count).toLocaleString() : '100K+'}
              </div>
              <p className="text-xs font-mono text-gray-600 mt-2 uppercase">
                Active community members
              </p>
            </div>
            <div className="pt-8 border-t border-black/10 flex items-center text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#e63946]" /> FALCUS MEDIA AUDITED
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.length === 0 ? (
              <div className="col-span-full bg-white border border-black/10 rounded-3xl p-10 text-center font-mono text-xs text-gray-500 uppercase">
                No social channels linked yet.
              </div>
            ) : (
              socialLinks.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-neutral-50 border-2 border-black rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-gray-500">
                    <span className="group-hover:text-black transition-colors">{link.platform}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <div className="my-6">
                    <div className="text-3xl font-black text-black tracking-tight">
                      {link.followers || 'Follow'}
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                      Followers / Subscribers
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-black flex items-center justify-between border-t border-black/10 pt-3">
                    <span>VISIT CHANNEL</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT / BIO (EDITORIAL BRUTALIST)
         ========================================================================= */}
      {portfolio.bio && (
        <section id="about-section" className="max-w-6xl mx-auto px-6 py-20 border-b border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                // SECTION 02 &bull; ABOUT
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
                Creator <br />Identity
              </h2>
              <div className="w-12 h-1 bg-[#e63946] mt-4" />
            </div>

            <div className="md:col-span-8 bg-white border-2 border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-base md:text-lg leading-relaxed text-neutral-800 font-medium whitespace-pre-wrap">
                {portfolio.bio}
              </p>
              
              <div className="mt-8 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <span className="text-gray-500 uppercase">OFFICIAL TALENT PROFILE // FALCUS MEDIA</span>
                <button 
                  onClick={() => scrollToSection('inquiry-section')}
                  className="px-4 py-2 bg-black text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#e63946] transition-colors"
                >
                  Work With Me &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: FEATURED VIDEO PRODUCTIONS
         ========================================================================= */}
      {featuredMedia.length > 0 && (
        <section id="works-section" className="max-w-6xl mx-auto px-6 py-20 border-b border-black/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                // SECTION 03 &bull; SHOWCASE
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                Featured Works
              </h2>
            </div>
            <p className="font-mono text-xs text-gray-600 mt-2 md:mt-0 uppercase tracking-wider">
              High-impact productions & viral content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredMedia.map((media: any, i: number) => {
              const embedUrl = getEmbedUrl(media.url);
              return (
                <div 
                  key={i}
                  className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col group"
                >
                  <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={media.title || 'Video Player'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="p-8 text-center">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#e63946] hover:text-white transition-colors"
                        >
                          <Play className="w-4 h-4 mr-2 fill-current" /> Watch Video on External Platform
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 bg-white flex items-center justify-between border-t-2 border-black">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-gray-500 block">PROJECT 0{i + 1}</span>
                      <h3 className="font-black text-lg text-black uppercase tracking-tight mt-0.5">{media.title || 'Featured Content'}</h3>
                    </div>
                    {media.url && (
                      <a 
                        href={media.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-black/20 hover:bg-black hover:text-white transition-colors"
                        title="Open Direct Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: COLLABORATION PACKAGES & RATES
         ========================================================================= */}
      {services.length > 0 && (
        <section id="packages-section" className="max-w-6xl mx-auto px-6 py-20 border-b border-black/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                // SECTION 04 &bull; COMMERCE
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                Sponsorship Rates
              </h2>
            </div>
            <p className="font-mono text-xs text-gray-600 mt-2 md:mt-0 uppercase tracking-wider">
              Standard collaboration packages & deliverables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc: any, i: number) => (
              <div 
                key={i}
                className="bg-white border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold uppercase text-gray-500">PACKAGE 0{i + 1}</span>
                    {svc.price && (
                      <span className="font-mono font-black text-base px-3 py-1 bg-black text-white rounded-lg">
                        {svc.price}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-xl uppercase tracking-tight text-black mt-4">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-3">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => scrollToSection('inquiry-section', svc.title)}
                    className="w-full py-3.5 bg-black hover:bg-[#e63946] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center"
                  >
                    Select Package <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: DIRECT BRAND INQUIRY FORM (TERMINAL)
         ========================================================================= */}
      <section id="inquiry-section" className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-14 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e63946] block mb-1">
              // SECTION 05 &bull; BOOKING
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
              Work With {portfolio.display_name}
            </h2>
            <p className="text-gray-600 text-sm font-medium mt-2 leading-relaxed">
              Submit your campaign requirements, deliverables, and budget. Our dedicated management team at Falcus Media will review and respond within 24 hours.
            </p>
          </div>

          {inquirySuccess ? (
            <div className="bg-[#f0fff4] border-2 border-black p-8 rounded-2xl text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <h3 className="text-2xl font-black uppercase text-black">Proposal Received!</h3>
              <p className="text-xs font-mono text-gray-700 max-w-md mx-auto leading-relaxed">
                Thank you! Your campaign proposal has been recorded and dispatched to {portfolio.display_name} and our talent management board.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setInquirySuccess(false)}
                  className="px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#e63946] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              {inquiryError && (
                <div className="bg-red-50 border-2 border-red-500 text-red-600 p-4 rounded-xl text-xs font-mono font-bold">
                  {inquiryError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
                    Brand / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Red Bull, Sony, TechCorp"
                    className="w-full bg-[#f4f4f6] border-2 border-black rounded-xl px-4 py-3 text-black text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full bg-[#f4f4f6] border-2 border-black rounded-xl px-4 py-3 text-black text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jordan@company.com"
                    className="w-full bg-[#f4f4f6] border-2 border-black rounded-xl px-4 py-3 text-black text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
                    Campaign Budget Range
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#f4f4f6] border-2 border-black rounded-xl px-4 py-3 text-black text-sm font-mono font-medium focus:outline-none focus:bg-white transition-colors"
                  >
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                    <option value="Flexible / Open to Quote">Flexible / Open to Quote</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
                    Campaign Scope & Deliverables *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={campaignDetails}
                    onChange={(e) => setCampaignDetails(e.target.value)}
                    placeholder="Describe your product, required channels (YouTube, TikTok, Facebook), timeline, and goals..."
                    className="w-full bg-[#f4f4f6] border-2 border-black rounded-xl px-4 py-3 text-black text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="px-10 py-4 bg-[#e63946] hover:bg-black text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submittingInquiry ? 'SENDING PROPOSAL...' : 'DISPATCH PROPOSAL'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-[#dddddf] py-10 px-6 text-xs font-mono text-gray-700">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-black uppercase">{portfolio.display_name}</span>
            <span>&bull;</span>
            <span>REPRESENTED BY FALCUS MEDIA AGENCY</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-black font-bold uppercase underline">Portal Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
