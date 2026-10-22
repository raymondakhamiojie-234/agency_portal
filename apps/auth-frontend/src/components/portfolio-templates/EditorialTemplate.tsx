import { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X 
} from 'lucide-react';

interface EditorialTemplateProps {
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

export default function EditorialTemplate({
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
}: EditorialTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultEditorialProjects = [
    {
      title: 'Where Creativity Meets Conversion',
      tag: 'CAMPAIGN',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      desc: 'High-concept visual styling blending haute couture sensibility with viral commercial appeal.',
      url: ''
    },
    {
      title: 'Elevating Ideas to New Heights',
      tag: 'LOOKBOOK',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      desc: 'Editorial fashion series capturing intimate textures and timeless silhouettes.',
      url: ''
    },
    {
      title: 'Drool-Worthy Visuals',
      tag: 'EDITORIAL',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      desc: 'Signature lifestyle campaign designed to elevate brand authority across social feeds.',
      url: ''
    }
  ];

  const displayProjects = featuredMedia.length > 0 ? featuredMedia : defaultEditorialProjects;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#221B1B] font-serif selection:bg-[#B82B2B] selection:text-white antialiased">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFD8] transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('top')}>
            <span className="font-serif italic text-2xl tracking-tight text-[#B82B2B] font-bold">
              {creatorName}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold uppercase tracking-widest text-[#665]">
            <button onClick={() => scrollTo('about')} className="hover:text-[#B82B2B] transition-colors">Philosophy</button>
            <button onClick={() => scrollTo('work')} className="hover:text-[#B82B2B] transition-colors">Portfolio</button>
            <button onClick={() => scrollTo('rates')} className="hover:text-[#B82B2B] transition-colors">Investments</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#B82B2B] transition-colors">Contact</button>
          </nav>

          <div className="flex items-center gap-4 font-sans">
            <button
              onClick={() => onOpenInquiry()}
              className="px-6 py-2.5 rounded-full bg-[#B82B2B] hover:bg-[#972222] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
            >
              Book Inquiries
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#221B1B]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#EADFD8] px-6 py-4 space-y-3 font-sans text-xs uppercase tracking-wider font-semibold">
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-1 text-[#443]">Philosophy</button>
            <button onClick={() => scrollTo('work')} className="block w-full text-left py-1 text-[#443]">Portfolio</button>
            <button onClick={() => scrollTo('rates')} className="block w-full text-left py-1 text-[#443]">Investments</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-1 text-[#443]">Contact</button>
          </div>
        )}
      </header>

      {/* Hero Section (Cherie Editorial Style) */}
      <section id="top" className="pt-16 pb-20 px-6 max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-[#B82B2B] text-white p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 font-sans text-[11px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{roleTitle || 'LUXURY & EDITORIAL CREATOR'}</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic tracking-tight leading-[0.95] text-white">
              {creatorName}
            </h1>

            <p className="font-sans text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {portfolio.bio || "We don't do cookie cutter. Where creativity meets conversion—crafting bespoke visual campaigns that transform your business for better."}
            </p>

            <div className="pt-4 font-sans flex flex-wrap gap-4">
              <button
                onClick={() => onOpenInquiry()}
                className="px-8 py-4 rounded-full bg-white text-[#B82B2B] hover:bg-[#FFFDF9] font-bold text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
              >
                Inquire For Season
              </button>
              <button
                onClick={() => scrollTo('work')}
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border border-white/20"
              >
                Explore Works
              </button>
            </div>
          </div>

          {/* Floating Polaroid Image in Hero */}
          <div className="hidden lg:block absolute right-12 bottom-10 w-72 bg-white p-4 pb-8 rounded-xl shadow-2xl rotate-6 transform hover:rotate-2 transition-transform">
            <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-100">
              <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
            </div>
            <p className="font-serif italic text-xs text-neutral-800 text-center mt-3">
              Official Media Profile
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Philosophy ("Where Creativity Meets Conversion") */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#EADFD8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#B82B2B] block">
              [ WE DON'T DO COOKIE CUTTER ]
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif text-[#221B1B] leading-tight">
              Where <span className="italic text-[#B82B2B]">Creativity</span> Meets Conversion.
            </h2>
            <div className="font-sans text-sm sm:text-base text-[#554] space-y-4 leading-relaxed">
              <p>
                Every brand has a story, but only the most deliberate aesthetic choices make people stop, look, and remember. We bring high-end editorial direction directly to modern social channels.
              </p>
              <p>
                From curated commercial lookbooks to seamless lifestyle video integrations, each piece of content is engineered for retention and elegance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Polaroid Accent Stack */}
            <div className="bg-white p-4 pb-10 rounded-2xl shadow-xl border border-[#EADFD8] -rotate-3 hover:rotate-0 transition-transform max-w-xs w-full">
              <div className="aspect-[4/5] rounded overflow-hidden bg-neutral-200">
                <img src={displayProjects[0]?.image} alt="Editorial Concept" className="w-full h-full object-cover" />
              </div>
              <p className="font-serif italic text-xs text-center text-[#554] mt-3">
                “Elevating ideas to new heights”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Polaroid Gallery ("Elevating Ideas to New Heights") */}
      <section id="work" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#EADFD8]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#B82B2B]">
            [ THE PORTFOLIO ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#221B1B]">
            Curated Visual Narratives
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project: any, idx: number) => (
            <div 
              key={idx}
              onClick={() => project.url ? onPlayVideo(project.url) : onOpenInquiry(project.title)}
              className="bg-white p-4 pb-8 rounded-2xl shadow-lg border border-[#EADFD8] hover:-translate-y-1.5 transition-all cursor-pointer group"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
                <img 
                  src={project.image || project.thumbnail_url} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-sans font-bold uppercase tracking-wider text-[#B82B2B]">
                  {project.tag || 'EDITORIAL'}
                </div>
              </div>
              <div className="mt-4 px-1 space-y-1 text-center">
                <h3 className="font-serif italic text-lg text-[#221B1B] group-hover:text-[#B82B2B] transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-xs text-[#776] line-clamp-2">
                  {project.desc || project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Packages */}
      <section id="rates" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EADFD8]">
        <div className="text-center mb-14">
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#B82B2B]">
            [ RATES & RESERVATIONS ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#221B1B] mt-2">
            Partnership Investments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
          {(services.length > 0 ? services : [
            { title: 'The Editorial Spotlight', description: 'Dedicated aesthetic feature with branded styling and high-res imagery.', price: '$850' },
            { title: 'The Video Narrative', description: 'Curated 60s cinematic story for Instagram Reels and TikTok.', price: '$1,600' },
            { title: 'The Complete Lookbook', description: 'Full seasonal campaign integration with licensed print & digital rights.', price: '$3,200' }
          ]).map((pkg: any, idx: number) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-[#EADFD8] shadow-md flex flex-col justify-between hover:border-[#B82B2B] transition-colors">
              <div className="space-y-4">
                <h3 className="font-serif italic text-2xl text-[#221B1B]">{pkg.title}</h3>
                <div className="text-3xl font-serif text-[#B82B2B]">{pkg.price}</div>
                <p className="text-xs text-[#665] leading-relaxed">{pkg.description}</p>
              </div>
              <button
                onClick={() => onOpenInquiry(pkg.title)}
                className="mt-8 w-full py-3 rounded-full bg-[#221B1B] hover:bg-[#B82B2B] text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Inquire For Date
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Quote */}
      {nicheProfile?.testimonialQuote && (
        <section className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-[#EADFD8]">
          <span className="text-5xl font-serif text-[#B82B2B] block leading-none select-none">“</span>
          <blockquote className="text-2xl sm:text-3xl font-serif italic text-[#221B1B] mt-2">
            {nicheProfile.testimonialQuote}
          </blockquote>
          <p className="font-sans font-bold text-xs uppercase tracking-widest text-[#B82B2B] mt-4">
            {nicheProfile.testimonialAuthor} — <span className="text-[#665]">{nicheProfile.testimonialRole}</span>
          </p>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className="bg-[#221B1B] text-white pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <h2 className="text-4xl sm:text-6xl font-serif italic">
            Designed for Distinction.
          </h2>
          <p className="font-sans text-sm text-white/70 max-w-xl mx-auto">
            Ready to elevate your next campaign? Let's discuss dates, deliverables, and custom creative direction.
          </p>
          <button
            onClick={() => onOpenInquiry()}
            className="px-10 py-4 rounded-full bg-[#B82B2B] hover:bg-[#972222] text-white font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-xl cursor-pointer"
          >
            Start Proposal
          </button>

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-sans text-xs tracking-widest uppercase">
              {socialLinks.map((s: any, idx: number) => (
                <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
                  {s.platform}
                </a>
              ))}
            </div>
          )}

          <div className="pt-12 border-t border-white/10 font-sans text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {creatorName}. Curated by Falcus Media Ltd.</p>
            <button onClick={() => scrollTo('top')} className="hover:text-white transition-colors cursor-pointer">
              Return to Top ↑
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
