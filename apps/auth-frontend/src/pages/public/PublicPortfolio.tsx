import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  Send, 
  X
} from 'lucide-react';

import StorytellerTemplate from '../../components/portfolio-templates/StorytellerTemplate';
import CodeCraftTemplate from '../../components/portfolio-templates/CodeCraftTemplate';
import EditorialTemplate from '../../components/portfolio-templates/EditorialTemplate';
import BrutalistTemplate from '../../components/portfolio-templates/BrutalistTemplate';
import RaycastTemplate from '../../components/portfolio-templates/RaycastTemplate';

// Niche & Style Profile Interface
interface NicheProfile {
  category: 'social_media' | 'tech_hub' | 'gaming' | 'lifestyle' | 'developer' | 'general_creator';
  brandEmblem: string;
  roleBadge: string;
  headlineAccent: string;
  bioFallback: string;
  cardBadge: string;
  cardVarName: string;
  cardNiche: string;
  aboutBadge: string;
  aboutTitle1: string;
  aboutTitleHighlight: string;
  aboutP1: string;
  aboutP2: string;
  stats: [
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' }
  ];
  skillsTitle: string;
  skillsSubtitle: string;
  skills: Array<{ name: string; pct: number; color: string }>;
  defaultProjects: Array<{ title: string; desc: string; image: string; tag: string; url: string }>;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  ctaTag: string;
  ctaTitle: string;
  ctaDesc: string;
  packageFallbackDesc: string;
}

function getCreatorNicheProfile(portfolio: any, socialLinks: any[] = []): NicheProfile {
  const tagline = (portfolio?.tagline || '').toLowerCase();
  const name = (portfolio?.display_name || '').toLowerCase();
  const pageName = (portfolio?.page_name || '').toLowerCase();
  const creatorName = portfolio?.page_name || (portfolio?.display_name !== 'Falcus Media Ltd' ? portfolio?.display_name : null) || portfolio?.page_name || portfolio?.display_name || 'Creator';

  let formattedReach = '100K+ Reach';
  if (portfolio?.follower_count && Number(portfolio.follower_count) > 0) {
    const count = Number(portfolio.follower_count);
    if (count >= 1000000) {
      formattedReach = `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+ Reach`;
    } else if (count >= 1000) {
      formattedReach = `${(count / 1000).toFixed(0)}K+ Reach`;
    } else {
      formattedReach = `${count.toLocaleString()}+ Reach`;
    }
  } else if (socialLinks && socialLinks.length > 0) {
    const match = socialLinks.find((s: any) => s.followers && s.followers.trim());
    if (match) {
      formattedReach = `${match.followers} Reach`;
    }
  }

  // 1. Comedy, Entertainment
  if (
    tagline.includes('comic') || tagline.includes('comedy') || tagline.includes('skit') ||
    tagline.includes('entertainment') || name.includes('comic') || name.includes('comedy') ||
    pageName.includes('comic') || pageName.includes('comedy')
  ) {
    return {
      category: 'general_creator',
      brandEmblem: '🎭',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'COMEDY & ENTERTAINMENT CREATOR',
      headlineAccent: 'I create viral comedy, relatable skits & engaging stories.',
      bioFallback: 'Digital creator and entertainer delivering viral sketches, original comedy, and high-impact brand integrations that connect with audiences worldwide.',
      cardBadge: 'CREATOR PROFILE',
      cardVarName: 'entertainer',
      cardNiche: portfolio?.tagline || 'Comedy & Entertainment',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'Dedicated to bringing',
      aboutTitleHighlight: 'humor, joy & authentic entertainment',
      aboutP1: 'With a passionate community and millions of impressions across social channels, I create original comedic content, relatable characters, and memorable sketches.',
      aboutP2: 'Collaborating with forward-thinking brands to craft natural, hilarious, and high-converting product integrations that resonate with viewers.',
      stats: [
        { value: '4+', label: 'Years Entertaining', icon: 'calendar' },
        { value: '250+', label: 'Sketches & Releases', icon: 'sparkles' },
        { value: formattedReach, label: 'Fanbase & Reach', icon: 'smile' },
        { value: '99%', label: 'Audience Satisfaction', icon: 'trophy' }
      ],
      skillsTitle: 'Creative Capabilities & Reach',
      skillsSubtitle: 'Core entertainment strengths delivering viral watch-time and massive organic shares.',
      skills: [
        { name: 'Viral Comedy & Skit Production', pct: 96, color: 'from-amber-500 to-yellow-500' },
        { name: 'Organic Brand Integrations', pct: 94, color: 'from-purple-500 to-indigo-500' },
        { name: 'Character Acting & Storytelling', pct: 92, color: 'from-pink-500 to-rose-500' },
        { name: 'Shorts & Reels Production', pct: 95, color: 'from-cyan-500 to-blue-500' },
        { name: 'Community Engagement & Viral Shares', pct: 97, color: 'from-emerald-500 to-teal-500' },
        { name: 'Audience Retention & Watch-Time', pct: 90, color: 'from-rose-500 to-orange-500' }
      ],
      defaultProjects: [
        {
          title: 'Viral Relatable Comedy Skit',
          desc: 'High-production comedic sketch generating over 1M+ views and thousands of organic comments.',
          tag: 'Comedy Sketch',
          image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Seamless Brand Integration Skit',
          desc: 'Natural comedic integration weaving product benefits directly into a hilarious character storyline.',
          tag: 'Brand Collaboration',
          image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Multi-Platform Short-Form Blitz',
          desc: 'Synchronized release across Facebook Reels, YouTube Shorts, and TikTok driving maximum shares.',
          tag: 'Social Growth',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `Working with ${creatorName} was an absolute blast. Their skit brought our product to life with genuine laughs and phenomenal engagement!`,
      testimonialAuthor: 'Amanda Cole',
      testimonialRole: 'Head of Brand Marketing, Peak Viral Media',
      ctaTag: "LET'S WORK TOGETHER",
      ctaTitle: 'Ready to entertain your audience?',
      ctaDesc: "I'm always open to discussing new brand deals, comedic sponsorships, and custom product placements.",
      packageFallbackDesc: 'Full custom skit production, organic brand placement, revisions, and multi-platform promotional usage.'
    };
  }

  // Default: General Storyteller & Creator
  return {
    category: 'general_creator',
    brandEmblem: '✦',
    roleBadge: portfolio?.tagline?.toUpperCase() || 'CONTENT CREATOR & STORYTELLER',
    headlineAccent: 'I craft stories that connect and inspire audiences.',
    bioFallback: 'Dedicated to creating memorable digital content that entertains, inspires, and connects with audiences on an authentic level.',
    cardBadge: 'CREATOR PROFILE',
    cardVarName: 'creator',
    cardNiche: portfolio?.tagline || 'Content Creation',
    aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
    aboutTitle1: 'Passionate about',
    aboutTitleHighlight: 'creative storytelling & community connection',
    aboutP1: 'Dedicated to creating memorable digital content that entertains, inspires, and connects with audiences on an authentic level.',
    aboutP2: 'Partnering with progressive brands to craft organic sponsor integrations and high-converting marketing campaigns.',
    stats: [
      { value: '4+', label: 'Years Creating', icon: 'calendar' },
      { value: '120+', label: 'Productions & Releases', icon: 'sparkles' },
      { value: formattedReach, label: 'Audience & Community', icon: 'smile' },
      { value: '99%', label: 'Brand Satisfaction', icon: 'trophy' }
    ],
    skillsTitle: 'Creative Capabilities & Distribution',
    skillsSubtitle: 'Core production and media distribution strengths delivering high audience retention.',
    skills: [
      { name: 'High-Definition Video Production', pct: 95, color: 'from-indigo-500 to-purple-500' },
      { name: 'Brand Sponsorships & Integration', pct: 92, color: 'from-amber-500 to-rose-500' },
      { name: 'Audience Engagement & Storytelling', pct: 94, color: 'from-pink-500 to-purple-500' },
      { name: 'Multi-Platform Distribution', pct: 90, color: 'from-cyan-500 to-blue-500' },
      { name: 'Creative Direction & Concepts', pct: 88, color: 'from-emerald-500 to-teal-500' },
      { name: 'Campaign ROI & Conversion', pct: 91, color: 'from-sky-500 to-indigo-500' }
    ],
    defaultProjects: [
      {
        title: 'Viral Brand Collaboration',
        desc: 'High-production brand feature driving record organic reach and community engagement.',
        tag: 'Sponsored Video',
        image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
        url: '#'
      },
      {
        title: 'Multi-Platform Audience Launch',
        desc: 'Strategic cross-network content rollout maximizing brand awareness, saves, and shares.',
        tag: 'Social Growth',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
        url: '#'
      },
      {
        title: 'Exclusive Product Feature',
        desc: 'Full dedicated showcase highlighting product value proposition and call-to-action.',
        tag: 'Dedicated Feature',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        url: '#'
      }
    ],
    testimonialQuote: `Working with ${creatorName} was an absolute game changer for our campaign. Their audience connection and creative execution drove remarkable results.`,
    testimonialAuthor: 'Elena Rostova',
    testimonialRole: 'Senior Marketing Director, Nova Media',
    ctaTag: "LET'S WORK TOGETHER",
    ctaTitle: 'Have a campaign or project in mind?',
    ctaDesc: "I'm always open to discussing new brand deals, sponsorships, and creative concepts. Let's create something extraordinary together!",
    packageFallbackDesc: 'Full content delivery, brand exclusivity, revisions, and multi-platform promotional usage.'
  };
}

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry Form State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [budget, setBudget] = useState('Flexible / Open to Quote');
  const [campaignDetails, setCampaignDetails] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Video Preview Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Active slug
  const activeSlug = slug || window.location.pathname.replace(/^\/(?:p\/)?/, '').split('/')[0];

  // Dynamically set page title
  useEffect(() => {
    if (portfolio) {
      const pageTitle = portfolio.page_name || (portfolio.display_name !== 'Falcus Media Ltd' ? portfolio.display_name : null) || portfolio.page_name || portfolio.display_name || 'Creator Portfolio';
      document.title = pageTitle;
    } else if (activeSlug) {
      const formattedSlug = activeSlug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = formattedSlug;
    }
    return () => {
      document.title = 'Falcus Media Agency';
    };
  }, [portfolio, activeSlug]);

  useEffect(() => {
    if (activeSlug) {
      fetchPublicPortfolio(activeSlug);
    } else {
      setError('No portfolio identifier provided in URL.');
      setLoading(false);
    }
  }, [activeSlug]);

  const fetchPublicPortfolio = async (portfolioSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/portfolio/public/${portfolioSlug}`);
      if (res.data && res.data.portfolio) {
        setPortfolio(res.data.portfolio);
      } else {
        setError('Portfolio not found.');
      }
    } catch (err: any) {
      console.error('Failed to load portfolio:', err);
      setError(err.response?.data?.error || 'Unable to retrieve public portfolio.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !contactEmail || !campaignDetails) {
      setInquiryError('Please complete all required fields.');
      return;
    }

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
      setBudget('Flexible / Open to Quote');
      setCampaignDetails('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setInquiryError(err.response?.data?.error || 'Failed to submit proposal. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const openInquiryModal = (serviceTitle?: string) => {
    if (serviceTitle) {
      setCampaignDetails((prev) => 
        prev ? `${prev}\nInterested In: ${serviceTitle}` : `Interested In: ${serviceTitle}`
      );
    }
    setInquiryModalOpen(true);
  };

  const playVideo = (url: string) => {
    if (!url) return;
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    setActiveVideoUrl(embedUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center text-[#141414]">
        <div className="w-12 h-12 rounded-full border-3 border-[#E84A27] border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#E84A27] font-bold">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center text-[#141414] px-4">
        <div className="max-w-md w-full bg-white border border-[#E5E0D8] p-10 rounded-3xl shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E84A27]/10 text-[#E84A27] flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#141414]">Portfolio Unavailable</h1>
          <p className="text-[#666] text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-[#141414] hover:bg-[#E84A27] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
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

  const creatorName = portfolio.page_name || (portfolio.display_name !== 'Falcus Media Ltd' ? portfolio.display_name : null) || portfolio.page_name || portfolio.display_name || 'Creator';
  const avatarUrl = portfolio.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const nicheProfile = getCreatorNicheProfile(portfolio, socialLinks);
  const roleTitle = portfolio.tagline ? portfolio.tagline.toUpperCase() : nicheProfile.roleBadge;
  const primaryPlatform = portfolio.primary_platform || (socialLinks[0]?.platform) || 'Facebook';

  // Determine active template: URL query parameter overrides portfolio default for instant preview
  const queryTemplate = searchParams.get('template');
  const activeTemplate = queryTemplate || portfolio.template_id || 'storyteller';

  // Badges for codecraft hero
  const heroBadges = [
    { label: primaryPlatform, color: 'hover:border-indigo-500/50 text-indigo-400' },
    { label: 'Video Production', color: 'hover:border-purple-500/50 text-purple-400' },
    { label: 'Brand Integrations', color: 'hover:border-amber-500/50 text-amber-400' },
    { label: 'Short-Form Reels', color: 'hover:border-cyan-500/50 text-cyan-400' }
  ];

  return (
    <>
      {/* Template View Switcher */}
      {activeTemplate === 'storyteller' && (
        <StorytellerTemplate
          portfolio={portfolio}
          socialLinks={socialLinks}
          featuredMedia={featuredMedia}
          services={services}
          creatorName={creatorName}
          avatarUrl={avatarUrl}
          roleTitle={roleTitle}
          nicheProfile={nicheProfile}
          primaryPlatform={primaryPlatform}
          onOpenInquiry={openInquiryModal}
          onPlayVideo={playVideo}
        />
      )}

      {activeTemplate === 'editorial' && (
        <EditorialTemplate
          portfolio={portfolio}
          socialLinks={socialLinks}
          featuredMedia={featuredMedia}
          services={services}
          creatorName={creatorName}
          avatarUrl={avatarUrl}
          roleTitle={roleTitle}
          nicheProfile={nicheProfile}
          primaryPlatform={primaryPlatform}
          onOpenInquiry={openInquiryModal}
          onPlayVideo={playVideo}
        />
      )}

      {activeTemplate === 'brutalist' && (
        <BrutalistTemplate
          portfolio={portfolio}
          socialLinks={socialLinks}
          featuredMedia={featuredMedia}
          services={services}
          creatorName={creatorName}
          avatarUrl={avatarUrl}
          roleTitle={roleTitle}
          nicheProfile={nicheProfile}
          primaryPlatform={primaryPlatform}
          onOpenInquiry={openInquiryModal}
          onPlayVideo={playVideo}
        />
      )}

      {activeTemplate === 'codecraft' && (
        <CodeCraftTemplate
          portfolio={portfolio}
          socialLinks={socialLinks}
          featuredMedia={featuredMedia}
          services={services}
          creatorName={creatorName}
          avatarUrl={avatarUrl}
          roleTitle={roleTitle}
          nicheProfile={nicheProfile}
          primaryPlatform={primaryPlatform}
          heroBadges={heroBadges}
          onOpenInquiry={openInquiryModal}
          onPlayVideo={playVideo}
          scrollToSection={(id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {activeTemplate === 'raycast' && (
        <RaycastTemplate
          portfolio={portfolio}
          socialLinks={socialLinks}
          featuredMedia={featuredMedia}
          services={services}
          creatorName={creatorName}
          avatarUrl={avatarUrl}
          roleTitle={roleTitle}
          nicheProfile={nicheProfile}
          primaryPlatform={primaryPlatform}
          onOpenInquiry={openInquiryModal}
          onPlayVideo={playVideo}
        />
      )}

      {/* Universal Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#FFFDF9] text-[#141414] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#E84A27]">
                  OFFICIAL INQUIRY FORM
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-[#141414]">
                  Work with {creatorName}
                </h3>
              </div>
              <button 
                onClick={() => setInquiryModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#ECE7DC] hover:bg-[#E84A27] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-[#E84A27] mx-auto animate-bounce" />
                <h4 className="font-bold text-xl text-[#141414]">Proposal Submitted Successfully!</h4>
                <p className="text-xs text-[#666] max-w-md mx-auto">
                  Thank you! Your campaign proposal has been delivered to {creatorName} and agency management. We will follow up shortly.
                </p>
                <button
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 mt-6">
                {inquiryError && (
                  <div className="p-3 rounded-xl bg-red-100 text-red-700 text-xs font-semibold">
                    {inquiryError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#555] font-bold mb-1">
                      Brand / Organization *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Patagonia"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#ECE7DC]/60 border border-[#DDD] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#E84A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#555] font-bold mb-1">
                      Contact Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jane Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#ECE7DC]/60 border border-[#DDD] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#E84A27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#555] font-bold mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#ECE7DC]/60 border border-[#DDD] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#E84A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#555] font-bold mb-1">
                      Estimated Budget *
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-[#ECE7DC]/60 border border-[#DDD] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#E84A27]"
                    >
                      <option value="Under $500">Under $500</option>
                      <option value="$500 - $1,500">$500 - $1,500</option>
                      <option value="$1,500 - $3,500">$1,500 - $3,500</option>
                      <option value="$3,500+">$3,500+ (Flagship Campaign)</option>
                      <option value="Flexible / Open to Quote">Flexible / Open to Quote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#555] font-bold mb-1">
                    Campaign Scope & Deliverables *
                  </label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us about your brand, campaign timeline, and desired deliverables..."
                    value={campaignDetails}
                    onChange={(e) => setCampaignDetails(e.target.value)}
                    className="w-full bg-[#ECE7DC]/60 border border-[#DDD] rounded-xl p-3 text-xs text-[#141414] focus:outline-none focus:border-[#E84A27]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3.5 bg-[#E84A27] hover:bg-[#d03d1c] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingInquiry ? 'Submitting...' : 'Send Campaign Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E84A27] font-bold">
                Reel / Project Preview
              </span>
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideoUrl}
                title="Project Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
