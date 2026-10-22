import { useState } from 'react';
import { 
  Play, 
  ArrowUpRight, 
  Download, 
  User, 
  Calendar, 
  Code2, 
  Smile, 
  Trophy, 
  Sparkles, 
  Menu, 
  X 
} from 'lucide-react';

interface CodeCraftTemplateProps {
  portfolio: any;
  socialLinks: any[];
  featuredMedia: any[];
  services: any[];
  creatorName: string;
  avatarUrl: string;
  roleTitle: string;
  nicheProfile: any;
  primaryPlatform: string;
  heroBadges: any[];
  onOpenInquiry: (serviceTitle?: string) => void;
  onPlayVideo: (url: string) => void;
  scrollToSection: (id: string, packageTitle?: string) => void;
}

export default function CodeCraftTemplate({
  portfolio,
  socialLinks,
  featuredMedia,
  services,
  creatorName,
  avatarUrl,
  roleTitle,
  nicheProfile,
  primaryPlatform,
  heroBadges,
  onOpenInquiry,
  onPlayVideo,
  scrollToSection
}: CodeCraftTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const projectsToDisplay = featuredMedia.length > 0 ? featuredMedia : nicheProfile.defaultProjects;
  const firstName = creatorName;

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

  return (
    <div className="min-h-screen bg-[#07070d] text-gray-200 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070d]/85 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight group cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="text-indigo-400 font-mono text-xl font-extrabold group-hover:scale-110 transition-transform">
              {nicheProfile.brandEmblem}
            </span>
            <span className="tracking-tight">{creatorName}</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-white transition-colors">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">Projects</button>
            <button onClick={() => scrollToSection('packages')} className="hover:text-white transition-colors">Rates</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onOpenInquiry()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center cursor-pointer"
            >
              <span>Work With Me</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-400 hover:text-white p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0d16] border-b border-white/10 px-6 py-4 space-y-3 font-medium text-sm">
            <button onClick={() => { scrollToSection('hero'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">Home</button>
            <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">About</button>
            <button onClick={() => { scrollToSection('skills'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">Skills</button>
            <button onClick={() => { scrollToSection('projects'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">Projects</button>
            <button onClick={() => { scrollToSection('packages'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">Rates</button>
            <button onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }} className="block w-full text-left py-1 text-gray-300">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              <span className="uppercase tracking-wider">{roleTitle}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Hi, I’m{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {firstName}
              </span> <br />
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-300">
                {nicheProfile.headlineAccent}
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
              {portfolio.bio || nicheProfile.bioFallback}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>
              <button
                onClick={() => onOpenInquiry()}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Download Media Kit</span>
              </button>
            </div>

            <div className="pt-6 space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">
                Active Platforms & Capabilities
              </span>
              <div className="flex flex-wrap items-center gap-3 text-gray-400">
                {heroBadges.map((badge, bIdx) => (
                  <div 
                    key={bIdx}
                    className={`h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center space-x-2 ${badge.color}`}
                  >
                    {badge.icon && <span>{badge.icon}</span>}
                    <span className="font-mono text-xs font-bold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 p-1 shadow-[0_0_90px_rgba(124,58,237,0.45)] flex items-end justify-center overflow-hidden">
              <img 
                src={avatarUrl} 
                alt={creatorName}
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent opacity-40" />
            </div>

            {/* Floating Glassmorphic Code Card */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 w-64 sm:w-80 bg-[#0c0d18]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl font-mono text-[11px] space-y-2 select-none pointer-events-none transform rotate-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-gray-500 text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-indigo-400 font-semibold">{nicheProfile.cardBadge}</span>
              </div>
              <div className="text-gray-300 leading-relaxed font-mono">
                <span className="text-pink-400">const</span> <span className="text-yellow-300">{nicheProfile.cardVarName}</span> = {'{'}<br />
                &nbsp;&nbsp;<span className="text-indigo-300">name</span>: <span className="text-emerald-300">"{creatorName}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">niche</span>: <span className="text-emerald-300">"{nicheProfile.cardNiche}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">platform</span>: <span className="text-emerald-300">"{primaryPlatform}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">reach</span>: <span className="text-emerald-300">"{nicheProfile.stats[2].value}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">status</span>: <span className="text-emerald-300">"Available for Booking"</span><br />
                {'};'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Stats Grid */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
              {nicheProfile.aboutBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {nicheProfile.aboutTitle1} <br />
              <span className="text-indigo-400">{nicheProfile.aboutTitleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{nicheProfile.aboutP1}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{nicheProfile.aboutP2}</p>
            <button 
              onClick={() => onOpenInquiry()}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center cursor-pointer"
            >
              <User className="w-4 h-4 mr-2 text-indigo-400" />
              <span>Learn More About Me</span>
            </button>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {nicheProfile.stats.map((st: any, sIdx: number) => (
              <div key={sIdx} className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl hover:border-indigo-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 bg-indigo-600/20 text-indigo-400 border-indigo-500/30">
                  {st.icon === 'calendar' ? <Calendar className="w-6 h-6" /> :
                   st.icon === 'code' ? <Code2 className="w-6 h-6" /> :
                   st.icon === 'smile' ? <Smile className="w-6 h-6" /> :
                   st.icon === 'trophy' ? <Trophy className="w-6 h-6" /> :
                   <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{st.value}</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">{st.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Progress */}
      <section id="skills" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            CAPABILITIES & METRICS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">{nicheProfile.skillsTitle}</h2>
          <p className="text-gray-400 text-sm">{nicheProfile.skillsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nicheProfile.skills.map((skill: any, index: number) => (
            <div key={index} className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{skill.name}</span>
                <span className="font-mono text-xs font-bold text-indigo-400">{skill.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${skill.color}`} style={{ width: `${skill.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            FEATURED PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Featured Work & Campaigns</h2>
          <p className="text-gray-400 text-sm">Explore recent productions, campaigns, and high-impact deliverables.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsToDisplay.map((project: any, idx: number) => {
            const embed = getEmbedUrl(project.url);
            const num = String(idx + 1).padStart(2, '0');
            return (
              <div key={idx} className="bg-[#0c0d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                <div>
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img 
                      src={project.thumbnail_url || project.image || nicheProfile.defaultProjects[idx % 3].image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 text-[11px] font-mono font-bold text-indigo-400 border border-white/10">
                      {num}
                    </div>
                    {embed && (
                      <div 
                        onClick={() => onPlayVideo(embed)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20"
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-950/60 text-indigo-400 text-[10px] font-mono uppercase tracking-wider border border-indigo-500/20">
                      {project.tag || 'Featured Campaign'}
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{project.desc || project.description}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between">
                  <button
                    onClick={() => embed ? onPlayVideo(embed) : onOpenInquiry(project.title)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Packages / Services */}
      <section id="packages" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            PACKAGES & RATES
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Collaboration Packages</h2>
          <p className="text-gray-400 text-sm">Transparent pricing for brand partnerships and sponsored content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services.length > 0 ? services : [
            { title: 'Standard Integration', description: '60s natural product feature in prime content release.', price: '$500' },
            { title: 'Dedicated Showcase', description: 'Full dedicated video spotlight with pinned link.', price: '$1,200' },
            { title: 'Multi-Channel Blitz', description: 'Synchronized cross-platform short-form campaign.', price: '$2,500' }
          ]).map((pkg: any, idx: number) => (
            <div key={idx} className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:border-indigo-500/40 transition-all">
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-white">{pkg.title}</h3>
                <div className="text-3xl font-extrabold text-indigo-400">{pkg.price}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{pkg.description}</p>
              </div>
              <button
                onClick={() => onOpenInquiry(pkg.title)}
                className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Book Package
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5 text-center space-y-6">
        <div className="text-indigo-400 text-4xl font-serif">“</div>
        <blockquote className="text-xl sm:text-2xl text-gray-200 font-medium leading-relaxed italic">
          {nicheProfile.testimonialQuote}
        </blockquote>
        <div>
          <div className="font-bold text-white">{nicheProfile.testimonialAuthor}</div>
          <div className="text-xs text-indigo-400 mt-1">{nicheProfile.testimonialRole}</div>
        </div>
      </section>

      {/* Contact CTA Banner */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900/40 via-[#0c0d18] to-purple-900/30 border border-indigo-500/30 p-10 md:p-16 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
            {nicheProfile.ctaTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {nicheProfile.ctaTitle}
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            {nicheProfile.ctaDesc}
          </p>
          <button
            onClick={() => onOpenInquiry()}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/40 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 max-w-7xl mx-auto text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {creatorName}. Managed by Falcus Media Ltd.</p>
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center space-x-4 font-mono">
            {socialLinks.map((s: any, idx: number) => (
              <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                {s.platform}
              </a>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-6">
          <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors cursor-pointer">Back to top</button>
          <a href="/login" className="hover:text-white transition-colors">Portal Login</a>
        </div>
      </footer>

    </div>
  );
}
