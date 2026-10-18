import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  ExternalLink, 
  Send, 
  Play, 
  X, 
  Menu,
  Globe
} from 'lucide-react';

const YouTubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

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

  // Video Reel Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        prev ? `${prev}\nSelected Package: ${packageTitle}` : `Selected Package: ${packageTitle}`
      );
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
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
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-[#581c87]">
        <div className="w-12 h-12 rounded-full border-2 border-[#581c87] border-t-transparent animate-spin mb-4" />
        <p className="font-serif italic text-sm tracking-widest text-[#6b21a8]">Loading Media Kit...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-black px-4">
        <div className="max-w-md w-full bg-white border border-[#581c87]/15 p-10 rounded-3xl shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#581c87] text-white flex items-center justify-center mx-auto text-2xl font-serif">
            !
          </div>
          <h1 className="text-2xl font-serif italic text-[#581c87] tracking-tight">Portfolio Unavailable</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-[#581c87] hover:bg-[#6b21a8] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
              Creator Portal Login
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

  // Starting package rate for the circular sticker badge
  const startingRate = services.length > 0 && services[0]?.price 
    ? `$${services[0].price}` 
    : '$225';

  // High fashion fallback photos for the editorial collage & polaroids
  const fallbackPhotos = [
    portfolio.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  ];

  const creatorName = portfolio.display_name || 'Creator';
  const firstName = creatorName.split(' ')[0] || creatorName;
  const locationText = portfolio.location || 'NEW YORK / GLOBAL';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2b0938] selection:bg-[#581c87] selection:text-white font-sans overflow-x-hidden antialiased">

      {/* Top Falcus Media Agency Status Ribbon */}
      <div className="w-full bg-[#f3ede4] border-b border-[#581c87]/10 px-4 sm:px-8 py-2.5 text-xs flex items-center justify-between font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#7e14ff] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[#581c87]">Falcus Media Verified Creator</span>
        </div>
        <div className="flex items-center space-x-6 text-[#6b21a8]">
          <span className="hidden sm:inline font-mono tracking-widest text-[11px]">
            OFFICIAL MEDIA KIT // {portfolio.slug?.toUpperCase()}
          </span>
          <button 
            onClick={() => scrollToSection('inquiry-section')}
            className="font-bold text-[#581c87] hover:text-[#7e14ff] transition-colors underline uppercase text-[11px] tracking-wider"
          >
            Submit Proposal &rarr;
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: EDITORIAL HERO POSTER (Matches Reference Image Exactly)
         ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#e8e4dc] flex flex-col justify-between overflow-hidden border-b border-[#581c87]/15">
        
        {/* Background Editorial Photos Collage */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full flex flex-col md:flex-row">
            {/* Main Portrait Background */}
            <div className="relative w-full md:w-3/5 h-full overflow-hidden">
              <img 
                src={fallbackPhotos[0]} 
                alt={creatorName}
                className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 md:hidden" />
            </div>

            {/* Right Side Editorial Inset (Matches second pose in mockup) */}
            <div className="hidden md:block relative w-2/5 h-full overflow-hidden bg-[#ded8cd] border-l border-white/20">
              <img 
                src={fallbackPhotos[1]} 
                alt={`${creatorName} editorial`}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
          {/* Subtle Grain & Tone Overlay */}
          <div className="absolute inset-0 bg-[#581c87]/10 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Floating Circular Price Sticker Badge ($225 in Reference Image) */}
        <div className="absolute top-12 left-6 sm:top-16 sm:left-12 z-30">
          <div 
            onClick={() => scrollToSection('packages-section')}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#581c87]/20 shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 group"
          >
            <span className="text-xl sm:text-2xl font-serif text-[#2b0938] font-bold tracking-tight group-hover:text-[#6b21a8] transition-colors">
              {startingRate}
            </span>
            <span className="text-[9px] font-sans font-semibold uppercase tracking-widest text-[#6b21a8] mt-0.5">
              FROM / RATE
            </span>
          </div>
        </div>

        {/* Top Header Row: Slogan & Location & Hamburger Menu */}
        <header className="relative z-20 w-full px-6 sm:px-12 pt-8 sm:pt-10 flex items-start justify-between">
          {/* Top Left Tagline / Statement */}
          <div className="max-w-xs sm:max-w-sm pl-28 sm:pl-32">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white drop-shadow-md leading-relaxed font-sans">
              {portfolio.tagline ? portfolio.tagline.toUpperCase() : 'CREATE DROOL-WORTHY RESULTS THAT WILL TRANSFORM YOUR BUSINESS FOR BETTER'}
            </p>
          </div>

          {/* Center / Right: Location & Hamburger */}
          <div className="flex items-center space-x-6">
            <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/90 drop-shadow-md font-sans">
              BASED IN {locationText.toUpperCase()}
            </span>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-24 right-6 sm:right-12 z-40 bg-white/95 backdrop-blur-xl border border-[#581c87]/15 rounded-2xl p-5 shadow-2xl w-60 space-y-3 font-sans text-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6b21a8] pb-1 border-b border-[#581c87]/10">
              Quick Navigation
            </div>
            <button 
              onClick={() => scrollToSection('creativity-section')}
              className="block w-full text-left py-1.5 font-semibold text-[#2b0938] hover:text-[#7e14ff]"
            >
              About & Story
            </button>
            <button 
              onClick={() => scrollToSection('polaroid-section')}
              className="block w-full text-left py-1.5 font-semibold text-[#2b0938] hover:text-[#7e14ff]"
            >
              What We Do
            </button>
            <button 
              onClick={() => scrollToSection('stats-section')}
              className="block w-full text-left py-1.5 font-semibold text-[#2b0938] hover:text-[#7e14ff]"
            >
              Audience & Reach
            </button>
            <button 
              onClick={() => scrollToSection('works-section')}
              className="block w-full text-left py-1.5 font-semibold text-[#2b0938] hover:text-[#7e14ff]"
            >
              Featured Works
            </button>
            <button 
              onClick={() => scrollToSection('packages-section')}
              className="block w-full text-left py-1.5 font-semibold text-[#2b0938] hover:text-[#7e14ff]"
            >
              Sponsorship Packages
            </button>
            <button 
              onClick={() => scrollToSection('inquiry-section')}
              className="block w-full text-left py-2 px-3 bg-[#581c87] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] text-center"
            >
              Book Creator
            </button>
          </div>
        )}

        {/* Monumental Script Creator Title (Matches "Cherie" in Reference Image) */}
        <div className="relative z-20 w-full px-6 sm:px-12 pb-12 sm:pb-16 flex flex-col items-center sm:items-start select-none">
          <div className="relative max-w-full">
            <h1 
              className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] text-white italic tracking-tight leading-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)]"
              style={{ 
                fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                transform: 'rotate(-4deg)',
                transformOrigin: 'bottom left'
              }}
            >
              {firstName}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 text-white/90 drop-shadow-md text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase mt-2 sm:mt-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
            <span>{portfolio.display_name}</span>
            <span className="opacity-60">&bull;</span>
            <span>{portfolio.primary_platform || 'DIGITAL'} CREATOR</span>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: "WHERE CREATIVITY MEETS CONVERSION" (WARM ECRU / FALCUS PURPLE)
         ========================================================================= */}
      <section id="creativity-section" className="relative w-full bg-[#FAF7F2] py-24 sm:py-32 px-6 sm:px-12 md:px-20 border-b border-[#581c87]/15">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Left Column: Slogan, Stylized Headline, Mission Text & Pill Button */}
          <div className="md:col-span-7 space-y-8">
            {/* Tagline */}
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#6b21a8] font-sans">
              WE DON'T DO COOKIE CUTTER
            </span>

            {/* Stylized Editorial Headline with Script Swash */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#581c87] leading-[1.08] tracking-tight">
              Where <span className="font-serif italic font-normal">Creativity</span> <br />
              Meets{' '}
              <span 
                className="text-5xl sm:text-7xl lg:text-8xl italic font-normal text-[#6b21a8]"
                style={{ fontFamily: "'Pinyon Script', 'Alex Brush', cursive" }}
              >
                Conversion
              </span>
            </h2>

            {/* Creator Story / Bio */}
            <div className="text-sm sm:text-base text-[#4a1272]/85 leading-relaxed font-sans max-w-xl space-y-4">
              <p>
                {portfolio.bio || 
                  `${creatorName} creates captivating, high-retention storytelling across digital media. Blending high-fashion aesthetics with authentic community connection, every campaign is engineered to engage audiences and generate measurable brand momentum.`}
              </p>
              <p className="text-xs sm:text-sm text-[#6b21a8] font-medium italic">
                Represented in partnership with Falcus Media Creator Network.
              </p>
            </div>

            {/* Pill Button: LEARN MORE */}
            <div className="pt-2">
              <button
                onClick={() => scrollToSection('polaroid-section')}
                className="px-8 py-3.5 bg-[#581c87] hover:bg-[#6b21a8] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-sans"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Framed Vertical Editorial Photo */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#e8e4dc] group">
              <img 
                src={fallbackPhotos[2]} 
                alt={`${creatorName} editorial portrait`}
                className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#581c87]/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "ELEVATING IDEAS TO NEW HEIGHTS" (RICH FALCUS ROYAL PURPLE CANVAS)
          Surrounded by 4 Tilted Floating Polaroids
         ========================================================================= */}
      <section 
        id="polaroid-section" 
        className="relative w-full bg-[#581c87] text-white py-28 sm:py-36 px-6 sm:px-12 overflow-hidden border-b border-[#3b0764]"
      >
        
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#7e14ff]/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto flex flex-col items-center text-center">
          
          {/* Top Label in Brackets */}
          <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-[#DDD6FE] mb-6">
            [ WHAT WE DO ]
          </span>

          {/* Monumental Headline */}
          <div className="my-6 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-tight">
              Elevating <br />
              Ideas to New <br />
              <span 
                className="text-6xl sm:text-8xl md:text-9xl italic font-normal text-[#F3E8FF] inline-block mt-1"
                style={{ fontFamily: "'Pinyon Script', 'Alex Brush', cursive" }}
              >
                Heights
              </span>
            </h2>
          </div>

          {/* Pill Action Button */}
          <div className="mt-8 z-20">
            <button
              onClick={() => scrollToSection('packages-section')}
              className="px-8 py-3 bg-white/10 hover:bg-white text-white hover:text-[#581c87] border border-white/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl"
            >
              Explore Packages
            </button>
          </div>

          {/* 4 Orbiting Polaroid Cards (Tilted at angles, straighten on hover) */}
          <div className="w-full mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            
            {/* Polaroid 1 (Top Left): Tilted -6deg */}
            <div 
              onClick={() => scrollToSection('works-section')}
              className="w-40 sm:w-56 p-3 sm:p-4 bg-white rounded-xl shadow-2xl cursor-pointer transition-all duration-500 transform -rotate-6 hover:rotate-0 hover:scale-110 hover:z-30 group"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 rounded overflow-hidden">
                <img 
                  src={fallbackPhotos[1]} 
                  alt="Production shot"
                  className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="pt-3 pb-1 text-center font-serif text-[11px] sm:text-xs text-[#2b0938] font-bold tracking-wider uppercase">
                Content Production
              </div>
            </div>

            {/* Polaroid 2 (Top Right): Tilted +6deg */}
            <div 
              onClick={() => scrollToSection('works-section')}
              className="w-40 sm:w-56 p-3 sm:p-4 bg-white rounded-xl shadow-2xl cursor-pointer transition-all duration-500 transform rotate-6 hover:rotate-0 hover:scale-110 hover:z-30 group"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 rounded overflow-hidden">
                <img 
                  src={fallbackPhotos[3]} 
                  alt="Campaign portrait"
                  className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="pt-3 pb-1 text-center font-serif text-[11px] sm:text-xs text-[#2b0938] font-bold tracking-wider uppercase">
                Brand Integration
              </div>
            </div>

            {/* Polaroid 3 (Bottom Left): Tilted -3deg */}
            <div 
              onClick={() => scrollToSection('works-section')}
              className="w-40 sm:w-56 p-3 sm:p-4 bg-white rounded-xl shadow-2xl cursor-pointer transition-all duration-500 transform -rotate-3 hover:rotate-0 hover:scale-110 hover:z-30 group"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 rounded overflow-hidden">
                <img 
                  src={fallbackPhotos[0]} 
                  alt="Studio shot"
                  className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="pt-3 pb-1 text-center font-serif text-[11px] sm:text-xs text-[#2b0938] font-bold tracking-wider uppercase">
                Creative Direction
              </div>
            </div>

            {/* Polaroid 4 (Bottom Right): Tilted +8deg */}
            <div 
              onClick={() => scrollToSection('works-section')}
              className="w-40 sm:w-56 p-3 sm:p-4 bg-white rounded-xl shadow-2xl cursor-pointer transition-all duration-500 transform rotate-8 hover:rotate-0 hover:scale-110 hover:z-30 group"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 rounded overflow-hidden">
                <img 
                  src={fallbackPhotos[4]} 
                  alt="Editorial lifestyle"
                  className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="pt-3 pb-1 text-center font-serif text-[11px] sm:text-xs text-[#2b0938] font-bold tracking-wider uppercase">
                Community Reach
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: STUDIO / FALCUS MEDIA ACCENT STRIP & MARQUEE TICKER
         ========================================================================= */}
      <section className="w-full bg-[#1e0729] text-white border-y border-white/10 py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tilted Yellow Badge & Brand Title */}
          <div className="flex items-center space-x-3">
            <span 
              className="px-3 py-1 bg-[#FACC15] text-[#1e0729] rounded-full text-[10px] font-bold uppercase tracking-wider shadow"
              style={{ transform: 'rotate(-5deg)' }}
            >
              Verified Talent
            </span>
            <span className="font-serif text-xl sm:text-2xl italic tracking-wide text-white">
              Falcus Media Agency
            </span>
          </div>

          {/* Marquee Ticker */}
          <div className="text-[11px] font-mono tracking-widest uppercase text-white/70 overflow-hidden whitespace-nowrap">
            <span>DIFFERENTLY THAN THE REST ★ WE DO THINGS DIFFERENTLY ★ FALCUS MEDIA CREATOR ★ HIGH-IMPACT SPONSORSHIPS ★</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: AUDIENCE STATS & SOCIAL CHANNELS (EDITORIAL HIGH-FASHION)
         ========================================================================= */}
      <section id="stats-section" className="max-w-6xl mx-auto px-6 sm:px-12 py-24 border-b border-[#581c87]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#581c87]/20">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b21a8] block mb-1">
              // AUDIENCE ANALYTICS & REACH
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#581c87] tracking-tight">
              Verified Social Channels
            </h2>
          </div>
          <p className="font-sans text-xs text-[#6b21a8] mt-2 md:mt-0 uppercase tracking-wider font-semibold">
            Aggregated Live Network Reach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Total Audience Card */}
          <div className="md:col-span-1 bg-white border border-[#581c87]/15 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b21a8] font-bold block mb-2">
                TOTAL REACH
              </span>
              <div className="text-4xl sm:text-5xl font-serif font-bold text-[#581c87]">
                {portfolio.follower_count > 0 ? (portfolio.follower_count).toLocaleString() : '50,000+'}
              </div>
              <p className="text-xs text-gray-500 mt-2 font-sans">
                Active engaged audience across all primary platforms.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#581c87]/10 flex items-center justify-between text-xs font-mono text-[#581c87]">
              <span>TIER</span>
              <span className="font-bold uppercase">{portfolio.creator_tier || 'FLAGSHIP'}</span>
            </div>
          </div>

          {/* Social Links Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {socialLinks.length > 0 ? (
              socialLinks.map((link: any, idx: number) => {
                const platform = (link.platform || 'Channel').toLowerCase();
                return (
                  <a
                    key={idx}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-[#581c87]/15 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#581c87]/10 flex items-center justify-center text-[#581c87] group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                        {platform.includes('youtube') ? <YouTubeIcon /> :
                         platform.includes('instagram') ? <InstagramIcon /> :
                         platform.includes('twitter') || platform.includes('x') ? <TwitterIcon /> :
                         <Globe className="w-5 h-5" />}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#581c87] transition-colors" />
                    </div>

                    <div className="mt-6">
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-500">
                        {link.platform}
                      </div>
                      <div className="text-2xl font-serif font-bold text-[#581c87] mt-0.5">
                        {link.followers > 0 ? (link.followers).toLocaleString() : 'Active'}
                      </div>
                      <div className="text-[11px] text-[#6b21a8] truncate mt-1">
                        {link.handle || link.url || 'View Profile'}
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="col-span-3 bg-white border border-[#581c87]/15 rounded-3xl p-8 text-center text-gray-500">
                <p className="font-serif italic text-sm">Channels currently being synced with Falcus Media verification.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FEATURED PRODUCTIONS & VIDEO REEL
         ========================================================================= */}
      <section id="works-section" className="max-w-6xl mx-auto px-6 sm:px-12 py-24 border-b border-[#581c87]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#581c87]/20">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b21a8] block mb-1">
              // PRODUCTION SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#581c87] tracking-tight">
              Featured Campaigns
            </h2>
          </div>
          <p className="font-sans text-xs text-[#6b21a8] mt-2 md:mt-0 uppercase tracking-wider font-semibold">
            Watch Full Campaign Deliverables
          </p>
        </div>

        {featuredMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredMedia.map((media: any, idx: number) => {
              const embed = getEmbedUrl(media.url);
              return (
                <div 
                  key={idx}
                  className="bg-white border border-[#581c87]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer">
                    <img 
                      src={media.thumbnail_url || fallbackPhotos[idx % fallbackPhotos.length]} 
                      alt={media.title}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div 
                      onClick={() => embed && setActiveVideoUrl(embed)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-[#581c87] text-[#581c87] ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b21a8] font-bold">
                        {media.platform || 'Featured Work'}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#2b0938] mt-1 group-hover:text-[#581c87] transition-colors line-clamp-2">
                        {media.title || 'Official Production Campaign'}
                      </h3>
                      {media.views > 0 && (
                        <p className="text-xs text-gray-500 font-mono mt-2">
                          {(media.views).toLocaleString()} Views &bull; High Retention
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#581c87]/10 flex items-center justify-between">
                      <button
                        onClick={() => embed ? setActiveVideoUrl(embed) : window.open(media.url, '_blank')}
                        className="text-xs font-bold uppercase tracking-wider text-[#581c87] hover:text-[#7e14ff] flex items-center"
                      >
                        Watch Video &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#581c87]/15 rounded-3xl p-12 text-center text-gray-500">
            <p className="font-serif italic text-base">Video portfolio reels are currently being curated for this creator.</p>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 7: SPONSORSHIP PACKAGES & RATES
         ========================================================================= */}
      <section id="packages-section" className="max-w-6xl mx-auto px-6 sm:px-12 py-24 border-b border-[#581c87]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#581c87]/20">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b21a8] block mb-1">
              // COLLABORATION TIERS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#581c87] tracking-tight">
              Sponsorship Packages
            </h2>
          </div>
          <p className="font-sans text-xs text-[#6b21a8] mt-2 md:mt-0 uppercase tracking-wider font-semibold">
            Custom Deliverables & Production
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((srv: any, idx: number) => {
              const isPopular = idx === 1;
              return (
                <div 
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? 'bg-[#581c87] text-white shadow-2xl md:-translate-y-2' 
                      : 'bg-white text-[#2b0938] border border-[#581c87]/15 shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {isPopular && (
                      <span className="inline-block px-3 py-1 bg-[#FACC15] text-[#1e0729] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        Most Requested
                      </span>
                    )}
                    <h3 className="font-serif text-2xl font-bold tracking-tight">
                      {srv.title || 'Campaign Package'}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-serif font-bold">
                        {srv.price ? `$${srv.price}` : 'Custom'}
                      </span>
                      <span className={`ml-2 text-xs uppercase font-mono ${isPopular ? 'text-[#DDD6FE]' : 'text-gray-500'}`}>
                        / Deliverable
                      </span>
                    </div>
                    <p className={`mt-4 text-xs leading-relaxed ${isPopular ? 'text-white/80' : 'text-gray-600'}`}>
                      {srv.description || 'Full production, editing, creator review, and promotional post across official channels.'}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-current/15">
                    <button
                      onClick={() => scrollToSection('inquiry-section', srv.title)}
                      className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        isPopular
                          ? 'bg-white text-[#581c87] hover:bg-[#F3E8FF] shadow-lg'
                          : 'bg-[#581c87] text-white hover:bg-[#6b21a8] shadow-md'
                      }`}
                    >
                      Select Package &rarr;
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-white border border-[#581c87]/15 rounded-3xl p-10 text-center">
              <h3 className="font-serif text-2xl text-[#581c87] font-bold">Custom Brand Partnerships</h3>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                This creator accepts custom integrated campaigns, dedicated videos, and ambassador contracts. Submit a brief below.
              </p>
              <button
                onClick={() => scrollToSection('inquiry-section')}
                className="mt-6 px-8 py-3 bg-[#581c87] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Inquire for Rates
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: DIRECT BRAND BOOKING TERMINAL
         ========================================================================= */}
      <section id="inquiry-section" className="max-w-4xl mx-auto px-6 sm:px-12 py-24">
        <div className="bg-white border border-[#581c87]/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6b21a8]">
              OFFICIAL BOOKING INQUIRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#581c87] mt-2">
              Work with {firstName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 font-sans leading-relaxed">
              Submit your brand campaign brief directly to the creator and Falcus Media agency management. We typically respond within 24 business hours.
            </p>
          </div>

          {inquirySuccess && (
            <div className="mb-8 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg">Proposal Submitted Successfully!</h4>
              <p className="text-xs text-green-700">
                Thank you for your inquiry. Our talent team and {firstName} will review your campaign brief and be in touch shortly.
              </p>
            </div>
          )}

          {inquiryError && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {inquiryError}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#581c87] font-bold mb-2">
                  Brand / Organization *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Studio"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#581c87]/20 rounded-2xl px-4 py-3 text-sm text-[#2b0938] focus:outline-none focus:border-[#7e14ff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#581c87] font-bold mb-2">
                  Contact Person *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#581c87]/20 rounded-2xl px-4 py-3 text-sm text-[#2b0938] focus:outline-none focus:border-[#7e14ff] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#581c87] font-bold mb-2">
                  Work Email *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="sarah@brand.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#581c87]/20 rounded-2xl px-4 py-3 text-sm text-[#2b0938] focus:outline-none focus:border-[#7e14ff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#581c87] font-bold mb-2">
                  Estimated Budget *
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#581c87]/20 rounded-2xl px-4 py-3 text-sm text-[#2b0938] focus:outline-none focus:border-[#7e14ff] transition-colors"
                >
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,500">$500 - $1,500</option>
                  <option value="$1,500 - $5,000">$1,500 - $5,000</option>
                  <option value="$5,000+">$5,000+ (Flagship Campaign)</option>
                  <option value="Flexible / Open to Quote">Flexible / Open to Quote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#581c87] font-bold mb-2">
                Campaign Brief & Deliverable Requirements *
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Tell us about the product/brand, desired deliverables (YouTube integration, TikTok, Reel), target launch timeline, and key campaign objectives..."
                value={campaignDetails}
                onChange={(e) => setCampaignDetails(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#581c87]/20 rounded-2xl p-4 text-sm text-[#2b0938] focus:outline-none focus:border-[#7e14ff] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submittingInquiry}
              className="w-full py-4 bg-[#581c87] hover:bg-[#6b21a8] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submittingInquiry ? 'Sending Proposal...' : 'Send Campaign Inquiry'}</span>
            </button>
          </form>

        </div>
      </section>

      {/* =========================================================================
          FOOTER: FALCUS MEDIA AGENCY BRANDING
         ========================================================================= */}
      <footer className="w-full bg-[#1e0729] text-white py-12 px-6 sm:px-12 border-t border-white/10 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow" />
            <div>
              <span className="font-serif italic text-lg text-white">Falcus Media Agency</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a855f7] block">
                Official Creator Representation
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs text-white/60 space-y-1">
            <p>&copy; {new Date().getFullYear()} Falcus Media Ltd. All rights reserved.</p>
            <p className="text-[11px] font-mono text-white/40">
              Verified Creator Media Kit &bull; {portfolio.display_name}
            </p>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          VIDEO PLAYER MODAL
         ========================================================================= */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button 
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe 
                src={activeVideoUrl}
                title="Featured Video Reel"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
