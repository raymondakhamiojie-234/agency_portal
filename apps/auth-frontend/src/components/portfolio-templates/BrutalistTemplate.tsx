import { useState } from 'react';
import { 
  Menu, 
  X 
} from 'lucide-react';

interface BrutalistTemplateProps {
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

export default function BrutalistTemplate({
  portfolio,
  socialLinks,
  featuredMedia,
  services,
  creatorName,
  avatarUrl,
  roleTitle,
  onOpenInquiry,
  onPlayVideo
}: BrutalistTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultCards = [
    {
      title: 'Commercial Visuals',
      tag: '01 // PROD',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
      desc: 'Precision multimedia design and high-frame rate video.',
      url: ''
    },
    {
      title: 'Multimedia Series',
      tag: '02 // CAMPAIGN',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      desc: 'Synthetic brand worlds and organic viral distribution.',
      url: ''
    },
    {
      title: 'Identity & Stills',
      tag: '03 // STAGED',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      desc: 'Striking monochrome and high-saturation contrast photography.',
      url: ''
    }
  ];

  const displayCards = featuredMedia.length > 0 ? featuredMedia : defaultCards;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#ECEAE6] text-[#0A0A0A] font-mono selection:bg-[#E53E3E] selection:text-white antialiased">
      
      {/* Top Swiss Bar */}
      <header className="sticky top-0 z-40 bg-[#ECEAE6]/95 backdrop-blur-md border-b-2 border-[#0A0A0A] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('top')}>
            <span className="w-3.5 h-3.5 bg-[#E53E3E] inline-block" />
            <span className="font-black text-sm tracking-tighter uppercase text-[#0A0A0A]">
              {creatorName} // MEDIA
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => scrollTo('top')} className="hover:text-[#E53E3E]">01 Index</button>
            <button onClick={() => scrollTo('cards')} className="hover:text-[#E53E3E]">02 Cards</button>
            <button onClick={() => scrollTo('rates')} className="hover:text-[#E53E3E]">03 Rates</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#E53E3E]">04 Inquire</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry()}
              className="px-5 py-2 bg-[#0A0A0A] hover:bg-[#E53E3E] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Contact // Init
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#0A0A0A]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#ECEAE6] border-b-2 border-[#0A0A0A] px-6 py-4 space-y-3 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => scrollTo('top')} className="block w-full text-left">01 Index</button>
            <button onClick={() => scrollTo('cards')} className="block w-full text-left">02 Cards</button>
            <button onClick={() => scrollTo('rates')} className="block w-full text-left">03 Rates</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left">04 Inquire</button>
          </div>
        )}
      </header>

      {/* Hero Section: Card Deck Fanout (Matches Image) */}
      <section id="top" className="pt-16 pb-20 px-6 max-w-7xl mx-auto border-b-2 border-[#0A0A0A]">
        <div className="relative">
          {/* Top Plus Markers */}
          <div className="flex justify-between text-xs text-neutral-400 select-none mb-6">
            <span>+</span>
            <span>+</span>
            <span>+</span>
          </div>

          {/* Title Area with Red Accent Bar */}
          <div className="relative text-center my-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#E53E3E] opacity-90 -z-0" />
            <p className="text-xs uppercase tracking-widest text-[#0A0A0A] font-bold mb-2 relative z-10">
              Welcome To My
            </p>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-[#0A0A0A] relative z-10 select-none">
              Portfolio
            </h1>
            <p className="text-xs tracking-widest uppercase font-bold text-neutral-600 mt-2 relative z-10">
              {creatorName} // {roleTitle || 'MULTIMEDIA DESIGNER & CREATOR'}
            </p>
          </div>

          {/* Interactive Card Deck Fanout */}
          <div className="relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center my-12 overflow-hidden">
            
            {/* Card 1 (Left Rotated) */}
            <div className="absolute w-52 sm:w-64 aspect-[3/4] rounded-2xl bg-black text-white p-4 shadow-2xl transform -translate-x-24 sm:-translate-x-36 -rotate-12 hover:rotate-0 hover:z-20 transition-transform cursor-pointer border border-white/20">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img src={displayCards[0]?.image} alt="Card 1" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-[10px] uppercase font-bold">
                  {displayCards[0]?.tag || 'SERIES 01'}
                </div>
              </div>
            </div>

            {/* Card 2 (Center Hero Card - Creator Portrait) */}
            <div className="relative z-10 w-56 sm:w-72 aspect-[3/4] rounded-2xl bg-white text-black p-4 shadow-2xl transform hover:scale-105 transition-transform cursor-pointer border-2 border-[#0A0A0A]">
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-neutral-100">
                <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover grayscale contrast-125" />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#E53E3E] text-white text-[9px] font-bold uppercase">
                  VERIFIED
                </div>
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase">
                  <span>{creatorName}</span>
                </div>
              </div>
            </div>

            {/* Card 3 (Right Rotated) */}
            <div className="absolute w-52 sm:w-64 aspect-[3/4] rounded-2xl bg-[#E53E3E] text-white p-4 shadow-2xl transform translate-x-24 sm:translate-x-36 rotate-12 hover:rotate-0 hover:z-20 transition-transform cursor-pointer border-2 border-[#0A0A0A]">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img src={displayCards[1]?.image} alt="Card 2" className="w-full h-full object-cover contrast-110" />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-[10px] uppercase font-bold">
                  {displayCards[1]?.tag || 'SERIES 02'}
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-between text-xs text-neutral-400 select-none">
            <span>+</span>
            <span>+</span>
            <span>+</span>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section id="cards" className="py-20 px-6 max-w-7xl mx-auto border-b-2 border-[#0A0A0A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E53E3E]">
              // INDEX OF WORKS
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0A0A0A] mt-1">
              Select Productions
            </h2>
          </div>
          <button
            onClick={() => onOpenInquiry()}
            className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-[#E53E3E] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Commission Project →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCards.map((card: any, idx: number) => (
            <div 
              key={idx}
              onClick={() => card.url ? onPlayVideo(card.url) : onOpenInquiry(card.title)}
              className="bg-white border-2 border-[#0A0A0A] p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200 border border-[#0A0A0A]">
                <img src={card.image || card.thumbnail_url} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E53E3E]">{card.tag || `ITEM 0${idx + 1}`}</span>
                <h3 className="font-black text-lg uppercase text-[#0A0A0A] group-hover:text-[#E53E3E] transition-colors">{card.title}</h3>
                <p className="text-xs text-neutral-600 line-clamp-2">{card.desc || card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rates Section */}
      <section id="rates" className="py-20 px-6 max-w-7xl mx-auto border-b-2 border-[#0A0A0A]">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E53E3E]">// TARIFF & PACKAGES</span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0A0A0A] mt-1">Collaboration Tiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(services.length > 0 ? services : [
            { title: 'Sponsored Placement', description: '60s natural sponsor integration into primary social release.', price: '$600' },
            { title: 'Full Production Suite', description: 'Comprehensive video conceptualization, filming, and delivery.', price: '$1,400' },
            { title: 'Quarterly Campaign', description: 'Multi-post brand partnership with full organic optimization.', price: '$3,000' }
          ]).map((pkg: any, idx: number) => (
            <div key={idx} className="bg-white border-2 border-[#0A0A0A] p-6 flex flex-col justify-between hover:shadow-[6px_6px_0px_0px_#E53E3E] transition-all">
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-[#E53E3E] uppercase">// TIER 0{idx + 1}</div>
                <h3 className="font-black text-xl uppercase text-[#0A0A0A]">{pkg.title}</h3>
                <div className="text-3xl font-black text-[#0A0A0A]">{pkg.price}</div>
                <p className="text-xs text-neutral-600 leading-relaxed">{pkg.description}</p>
              </div>
              <button
                onClick={() => onOpenInquiry(pkg.title)}
                className="mt-6 w-full py-3 bg-[#0A0A0A] hover:bg-[#E53E3E] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Select Tier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-[#0A0A0A] pb-10">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[#0A0A0A]">
              Let's Build Something Loud.
            </h2>
            <p className="text-xs text-neutral-600 mt-2">
              Direct Agency & Creator Inquiries: {portfolio.contact_email || 'partnerships@falcusmedia.com'}
            </p>
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {socialLinks.map((s: any, idx: number) => (
                  <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="text-[11px] uppercase font-bold hover:text-[#E53E3E] underline">
                    [{s.platform}]
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenInquiry()}
            className="px-8 py-4 bg-[#E53E3E] hover:bg-[#0A0A0A] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Open Transmission →
          </button>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase text-neutral-500">
          <p>© {new Date().getFullYear()} {creatorName} // Managed by Falcus Media Ltd.</p>
          <button onClick={() => scrollTo('top')} className="hover:text-black cursor-pointer">
            Return to Top [↑]
          </button>
        </div>
      </footer>

    </div>
  );
}
