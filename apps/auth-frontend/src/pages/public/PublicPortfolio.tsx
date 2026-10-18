import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  Send, 
  Play, 
  X, 
  Menu, 
  Calendar, 
  Code2, 
  Smile, 
  Trophy, 
  User, 
  Download, 
  ArrowUpRight, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';

// Tech & Social Brand SVGs (Resilient, zero-dependency)
const GithubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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

  // Video / Project Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active slug
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
        prev ? `${prev}\nInterested In: ${packageTitle}` : `Interested In: ${packageTitle}`
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
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-[#0d0e17] border border-white/10 p-10 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio Unavailable</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-600/30"
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

  const creatorName = portfolio.display_name || 'Alex';
  const firstName = creatorName.split(' ')[0] || creatorName;
  const avatarUrl = portfolio.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const roleTitle = portfolio.tagline || "I'M A DIGITAL CREATOR & DEVELOPER";

  // Default featured projects if none configured
  const defaultProjects = [
    {
      title: "E-Commerce Platform",
      desc: "Full-stack e-commerce solution with modern UI/UX and seamless checkout experience.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      tag: "Web & Fullstack",
      url: "#"
    },
    {
      title: "Task Management App",
      desc: "Collaborative task management application built for high-output creative teams.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      tag: "UI/UX & Mobile",
      url: "#"
    },
    {
      title: "Crypto Analytics Dashboard",
      desc: "Real-time cryptocurrency tracking dashboard with live interactive charts and telemetry.",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
      tag: "Fintech & Data",
      url: "#"
    }
  ];

  const projectsToDisplay = featuredMedia.length > 0 ? featuredMedia : defaultProjects;

  // Skills / Channels progress meters
  const skills = [
    { name: "HTML & Architecture", pct: 95, color: "from-orange-500 to-amber-500" },
    { name: "React.js & Next.js", pct: 85, color: "from-cyan-500 to-blue-500" },
    { name: "Node.js & Backend", pct: 80, color: "from-emerald-500 to-green-500" },
    { name: "CSS3 & Tailwind", pct: 90, color: "from-sky-500 to-indigo-500" },
    { name: "JavaScript / TypeScript", pct: 90, color: "from-yellow-500 to-amber-500" },
    { name: "Git & Version Control", pct: 85, color: "from-rose-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-[#07070d] text-gray-200 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* =========================================================================
          TOP NAVBAR (Matches CodeCraft Header in Reference)
         ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070d]/85 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo: </> CodeCraft / Name */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight group">
            <span className="text-indigo-400 font-mono text-xl font-extrabold group-hover:scale-110 transition-transform">
              &lt;/&gt;
            </span>
            <span className="tracking-tight">{creatorName}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-white transition-colors">
              Skills
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('packages')} className="hover:text-white transition-colors">
              Rates
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
          </div>

          {/* Hire Me CTA Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0d16] border-b border-white/10 px-6 py-4 space-y-3 font-medium text-sm">
            <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Home</button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">About</button>
            <button onClick={() => scrollToSection('skills')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Projects</button>
            <button onClick={() => scrollToSection('packages')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Rates</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Contact</button>
          </div>
        )}
      </nav>

      {/* =========================================================================
          SECTION 1: HERO SECTION WITH GLOWING PURPLE AURA & FLOATING CODE CARD
         ========================================================================= */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto overflow-hidden">
        
        {/* Ambient Background Radial Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              <span className="uppercase tracking-wider">{roleTitle}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Hi, I’m{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {firstName}
              </span> <br />
              I build things for the web.
            </h1>

            {/* Sub-paragraph */}
            <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
              {portfolio.bio || 
                "I'm a passionate web developer & creator specializing in building exceptional digital experiences with modern technologies."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center"
              >
                <Download className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Download CV / Media Kit</span>
              </button>
            </div>

            {/* Technologies I Work With Row */}
            <div className="pt-6 space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">
                Technologies & Platforms I Work With
              </span>
              <div className="flex items-center space-x-3.5 text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-orange-500/50 transition-all cursor-default" title="HTML5">
                  <span className="font-mono text-xs font-bold text-orange-400">H5</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-blue-500/50 transition-all cursor-default" title="CSS3">
                  <span className="font-mono text-xs font-bold text-blue-400">C3</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-yellow-500/50 transition-all cursor-default" title="JavaScript">
                  <span className="font-mono text-xs font-bold text-yellow-400">JS</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-blue-400/50 transition-all cursor-default" title="TypeScript">
                  <span className="font-mono text-xs font-bold text-blue-400">TS</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-cyan-400/50 transition-all cursor-default" title="React">
                  <span className="font-mono text-xs font-bold text-cyan-400">⚛</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-white/50 transition-all cursor-default" title="Next.js">
                  <span className="font-mono text-xs font-bold text-white">N</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-red-500/50 transition-all cursor-default" title="YouTube">
                  <YouTubeIcon />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:scale-110 hover:border-pink-500/50 transition-all cursor-default" title="Instagram">
                  <InstagramIcon />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Portrait in Glowing Circle + Floating Code Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* The Big Glowing Purple Orb */}
            <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 p-1 shadow-[0_0_90px_rgba(124,58,237,0.45)] flex items-end justify-center overflow-hidden">
              <img 
                src={avatarUrl} 
                alt={creatorName}
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent opacity-40" />
            </div>

            {/* Floating Glassmorphic Code Card (Matches Reference Image) */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 w-60 sm:w-72 bg-[#0c0d18]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl font-mono text-[11px] space-y-2 select-none pointer-events-none transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between pb-1 border-b border-white/10 text-gray-500 text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span>&lt;/&gt; Code</span>
              </div>
              <div className="text-gray-300 leading-relaxed">
                <span className="text-pink-400">const</span> <span className="text-yellow-300">developer</span> = {'{'}<br />
                &nbsp;&nbsp;<span className="text-indigo-300">name</span>: <span className="text-emerald-300">"{firstName}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">skills</span>: [<span className="text-emerald-300">"React"</span>, <span className="text-emerald-300">"Next.js"</span>],<br />
                &nbsp;&nbsp;<span className="text-indigo-300">passion</span>: <span className="text-emerald-300">"Digital solutions"</span><br />
                {'};'}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT ME & 2X2 METRICS GRID
         ========================================================================= */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
              ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              I’m passionate about <br />
              <span className="text-indigo-400">creating digital solutions</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              With extensive experience in modern web development and digital content creation, I help businesses, brands, and individuals bring their ideas to life through clean, scalable, and high-impact digital experiences.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every project is engineered with precision, from pixel-perfect responsiveness to robust backend architectures and conversion-driven engagement.
            </p>
            <div>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Learn More About Me</span>
              </button>
            </div>
          </div>

          {/* Right 2x2 Stats Grid (Matches Reference Image) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Stat 1: 4+ Years Experience */}
            <div className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">4+</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Years Experience</div>
              </div>
            </div>

            {/* Stat 2: 50+ Projects Completed */}
            <div className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">50+</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Projects Completed</div>
              </div>
            </div>

            {/* Stat 3: 30+ Happy Clients */}
            <div className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">
                  {portfolio.follower_count > 0 ? `${(portfolio.follower_count).toLocaleString()}+` : '30+'}
                </div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  {portfolio.follower_count > 0 ? 'Audience Reach' : 'Happy Clients'}
                </div>
              </div>
            </div>

            {/* Stat 4: 100% Satisfaction */}
            <div className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Client Satisfaction</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TECHNOLOGIES & SKILLS METERS (3-COLUMN PROGRESS GRID)
         ========================================================================= */}
      <section id="skills" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            MY SKILLS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Technologies I Master
          </h2>
          <p className="text-gray-400 text-sm">
            Core stack and platform capabilities honed through production deployments and campaign workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{skill.name}</span>
                <span className="font-mono text-xs font-bold text-indigo-400">{skill.pct}%</span>
              </div>
              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                  style={{ width: `${skill.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED PROJECTS / SOME OF MY RECENT WORK
         ========================================================================= */}
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            FEATURED PROJECTS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Some of My Recent Work
          </h2>
          <p className="text-gray-400 text-sm">
            Explore recent productions, full-stack builds, and brand campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsToDisplay.map((project: any, idx: number) => {
            const embed = getEmbedUrl(project.url);
            const num = String(idx + 1).padStart(2, '0');
            return (
              <div 
                key={idx}
                className="bg-[#0c0d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300"
              >
                <div>
                  {/* Image Container with Number Badge */}
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img 
                      src={project.thumbnail_url || project.image || defaultProjects[idx % 3].image} 
                      alt={project.title}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-indigo-400 border border-white/10">
                      {num}
                    </div>
                    {embed && (
                      <div 
                        onClick={() => setActiveVideoUrl(embed)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {project.desc || project.description || "High-performance digital project delivering seamless user engagement and conversion."}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0 flex items-center justify-between">
                  <button
                    onClick={() => embed ? setActiveVideoUrl(embed) : project.url && project.url !== '#' ? window.open(project.url, '_blank') : scrollToSection('contact')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: COLLABORATION PACKAGES & RATES
         ========================================================================= */}
      <section id="packages" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            RATES & PACKAGES
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-gray-400 text-sm">
            Choose a collaboration tier or request a custom quote tailored to your timeline.
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
                      ? 'bg-gradient-to-b from-indigo-950/80 to-[#0c0d18] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2' 
                      : 'bg-[#0c0d18] border border-white/10 shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {isPopular && (
                      <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {srv.title || 'Campaign Deliverable'}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-white">
                        {srv.price ? `$${srv.price}` : 'Custom'}
                      </span>
                      <span className="ml-2 text-xs uppercase font-mono text-gray-400">
                        / Deliverable
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                      {srv.description || 'Full development/content delivery, testing, revisions, and launch support.'}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => scrollToSection('contact', srv.title)}
                      className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      Select Package &rarr;
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-[#0c0d18] border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-2xl font-bold text-white">Custom Project Engagements</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                Currently booking select development contracts and brand partnerships. Get in touch below with your project requirements.
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all"
              >
                Inquire for Rates
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BOTTOM 3-COLUMN ROW (CTA + TESTIMONIAL + CONTACT)
          Matches Reference Bottom Bar Exactly
         ========================================================================= */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: LET'S WORK TOGETHER */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                LET'S WORK TOGETHER
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Have a project in mind?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                I'm always open to discussing new projects, creative ideas, and partnership opportunities. Let's create something amazing together!
              </p>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => scrollToSection('inquiry-form')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5"
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: TESTIMONIAL */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-serif text-2xl font-bold">
                “
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                "{firstName} is an exceptional developer and creator who delivers high-quality work on time. Attention to detail and problem-solving skills are outstanding."
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-3 pt-4 border-t border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                alt="Sarah Johnson" 
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <div className="text-xs font-bold text-white">Sarah Johnson</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">CEO, TechStart</div>
              </div>
            </div>
          </div>

          {/* Card 3: FOLLOW ME & DIRECT CONTACT */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-4">
                FOLLOW ME
              </span>
              
              {/* Social Icons Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-gray-400 mb-6">
                {socialLinks.length > 0 ? (
                  socialLinks.map((s: any, idx: number) => {
                    const platform = (s.platform || '').toLowerCase();
                    return (
                      <a 
                        key={idx} 
                        href={s.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-indigo-400/50 transition-all" 
                        title={s.platform || 'Social Link'}
                      >
                        {platform.includes('youtube') ? <YouTubeIcon /> :
                         platform.includes('instagram') ? <InstagramIcon /> :
                         platform.includes('twitter') || platform.includes('x') ? <TwitterIcon /> :
                         platform.includes('linkedin') ? <LinkedinIcon /> :
                         platform.includes('github') ? <GithubIcon /> :
                         <span className="font-mono text-xs font-bold">{s.platform?.charAt(0) || '✦'}</span>}
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a href={portfolio.github_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="GitHub">
                      <GithubIcon />
                    </a>
                    <a href={portfolio.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="LinkedIn">
                      <LinkedinIcon />
                    </a>
                    <a href={portfolio.twitter_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="Twitter / X">
                      <TwitterIcon />
                    </a>
                    <a href={portfolio.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="Instagram">
                      <InstagramIcon />
                    </a>
                  </>
                )}
              </div>

              {/* Direct Info */}
              <div className="space-y-3 text-xs text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-gray-300">{portfolio.contact_email || 'hello@falcusmedia.com'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span className="text-gray-300">{portfolio.phone_number || '+1 (555) 123-4567'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
              <span>STATUS</span>
              <span className="text-emerald-400 font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                Available for hire
              </span>
            </div>
          </div>

        </div>

        {/* Direct Campaign Inquiry Form Container */}
        <div id="inquiry-form" className="mt-16 bg-[#0c0d18] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              BOOKING & CONTACT INQUIRY
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              Send a Message to {firstName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Submit your project specifications or sponsorship brief directly to {firstName}. Responses are typically sent within 24 hours.
            </p>
          </div>

          {inquirySuccess && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-lg text-white">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-emerald-300">
                Thank you! Your project details have been delivered to {firstName} and management.
              </p>
            </div>
          )}

          {inquiryError && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
              {inquiryError}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Your Name / Organization *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Contact Person *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Estimated Budget *
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,500">$500 - $1,500</option>
                  <option value="$1,500 - $5,000">$1,500 - $5,000</option>
                  <option value="$5,000+">$5,000+ (Flagship Deliverable)</option>
                  <option value="Flexible / Open to Quote">Flexible / Open to Quote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Project Overview & Requirements *
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your project, deliverable goals, timeline, and any key technical or creative requirements..."
                value={campaignDetails}
                onChange={(e) => setCampaignDetails(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submittingInquiry}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submittingInquiry ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Matches CodeCraft Footer: © 2026 Alex. Made with ❤️ by Alex / Falcus)
         ========================================================================= */}
      <footer className="w-full bg-[#050509] border-t border-white/5 py-8 px-6 text-xs text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {creatorName}. All rights reserved.
          </div>
          <div>
            Made with <span className="text-rose-500">❤️</span> for <span className="text-gray-300">Falcus Media Agency</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          VIDEO / PROJECT PREVIEW MODAL
         ========================================================================= */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
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
                title="Project Video Preview"
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
