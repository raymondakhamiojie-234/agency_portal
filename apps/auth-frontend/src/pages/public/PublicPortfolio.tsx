import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  ExternalLink, 
  Mail, 
  Send, 
  Sparkles, 
  Users, 
  Play, 
  ShieldCheck, 
  Tag, 
  ArrowRight
} from 'lucide-react';

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
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
      setAgency(res.data.agency);
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

  const scrollToInquiry = (serviceTitle?: string) => {
    if (serviceTitle) {
      setCampaignDetails((prev) => 
        prev ? `${prev}\nInterested Package: ${serviceTitle}` : `Interested Package: ${serviceTitle}`
      );
    }
    const elem = document.getElementById('inquiry-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // YouTube Watch URL -> Embed URL
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading creator media kit...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-[#111116] border border-white/10 p-8 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold">Portfolio Not Available</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
            >
              Go to Falcus Media Portal
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

  const themeColor = portfolio.theme_color || '#6366f1';

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-primary selection:text-white">
      {/* Top Agency Trust Bar */}
      <nav className="sticky top-0 z-50 bg-[#060608]/80 backdrop-blur-md border-b border-white/10 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/favicon.jpg" alt="Falcus Media" className="w-7 h-7 rounded-lg shadow-sm" />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white">Falcus Media</span>
              <span className="hidden sm:inline-block text-xs text-gray-500">&bull;</span>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold text-primary">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Official Creator Portfolio
              </span>
            </div>
          </div>
          <button
            onClick={() => scrollToInquiry()}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,255,0.25)] flex items-center"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Book Creator
          </button>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div className="relative">
        <div 
          className="h-56 md:h-80 w-full bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black relative overflow-hidden"
          style={{
            backgroundImage: portfolio.banner_url ? `url(${portfolio.banner_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060608]/50 to-[#060608]" />
        </div>

        {/* Profile Card Header */}
        <div className="max-w-6xl mx-auto px-6 -mt-20 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative">
                {portfolio.avatar_url ? (
                  <img
                    src={portfolio.avatar_url}
                    alt={portfolio.display_name}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-[#060608] shadow-2xl bg-black"
                  />
                ) : (
                  <div 
                    className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#060608] shadow-2xl flex items-center justify-center font-bold text-4xl text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {portfolio.display_name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                )}
                <div 
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-xl border border-white/20 shadow-md flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                  title="Verified Falcus Media Creator"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                    {portfolio.display_name}
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified Agency Creator
                  </span>
                </div>
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  {portfolio.tagline || `${portfolio.primary_platform || 'Digital'} Content Creator`}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                    {portfolio.primary_platform}
                  </span>
                  {agency?.name && (
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      Managed by {agency.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToInquiry()}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,255,0.3)] flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Request Sponsorship
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* Audience Stats & Social Channels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Total Reach Card */}
          <div className="md:col-span-1 bg-gradient-to-br from-primary/20 to-purple-800/10 p-6 rounded-2xl border border-primary/30 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-primary flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5" /> Total Audience
              </span>
              <div className="text-3xl md:text-4xl font-extrabold text-white mt-3">
                {portfolio.follower_count > 0 ? (portfolio.follower_count).toLocaleString() : '100K+'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Active followers across social media
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400">
              Agency Verified Metrics
            </div>
          </div>

          {/* Social Platforms Row */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialLinks.length === 0 ? (
              <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center text-gray-500 text-sm flex items-center justify-center">
                Social channels details coming soon.
              </div>
            ) : (
              socialLinks.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-primary/40 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                      {link.platform}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {link.followers || 'Follow'}
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                      View Official Channel &rarr;
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* About / Bio Section */}
        {portfolio.bio && (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              About The Creator
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {portfolio.bio}
            </p>
          </div>
        )}

        {/* Featured Content / Video Embeds */}
        {featuredMedia.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <Play className="w-5 h-5 mr-2 text-primary" /> Featured Content
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">Top-performing productions and campaign highlights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredMedia.map((media: any, i: number) => {
                const embedUrl = getEmbedUrl(media.url);
                return (
                  <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    {embedUrl ? (
                      <div className="aspect-video w-full">
                        <iframe
                          src={embedUrl}
                          title={media.title || 'Featured Content'}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-black/40 flex items-center justify-center p-6 text-center">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-primary hover:underline text-sm font-medium"
                        >
                          <Play className="w-4 h-4 mr-1.5" /> Watch on External Platform
                        </a>
                      </div>
                    )}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                      <h3 className="font-semibold text-sm text-white">{media.title || 'Featured Video'}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collaboration Packages / Services */}
        {services.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <Tag className="w-5 h-5 mr-2 text-primary" /> Sponsorship Packages
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">Standard collaboration options for brands & agencies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {services.map((svc: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/10 hover:border-primary/40 rounded-2xl p-6 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{svc.title}</h3>
                      {svc.price && (
                        <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                          {svc.price}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToInquiry(svc.title)}
                    className="mt-6 w-full py-2.5 bg-white/5 hover:bg-primary text-white text-xs font-semibold rounded-xl border border-white/10 hover:border-primary transition-all flex items-center justify-center"
                  >
                    Select Package <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Booking / Inquiry Form Section */}
        <div id="inquiry-section" className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 inline-flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Direct Brand Inquiry
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
              Partner with {portfolio.display_name}
            </h2>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
              Submit your campaign brief, budget, and deliverables. Our agency team at Falcus Media will review your proposal and get in touch within 24 hours.
            </p>
          </div>

          {inquirySuccess ? (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-green-400" />
              <h3 className="text-lg font-bold text-white">Inquiry Sent Successfully!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Thank you! Your proposal has been forwarded directly to {portfolio.display_name} and their agency management. We will reach out shortly.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setInquirySuccess(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/20 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              {inquiryError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs">
                  {inquiryError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Brand / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Nike, NordVPN, TechCorp"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Estimated Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Campaign Details & Deliverables *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={campaignDetails}
                    onChange={(e) => setCampaignDetails(e.target.value)}
                    placeholder="Provide details on your product, preferred platforms, timeline, and campaign goals..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,255,0.3)] flex items-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submittingInquiry ? 'Submitting Proposal...' : 'Submit Booking Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/favicon.jpg" alt="Logo" className="w-5 h-5 rounded" />
            <span>&copy; {new Date().getFullYear()} {portfolio.display_name}. Managed by Falcus Media Agency.</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://creators.falcusmedia.com" className="hover:text-white transition-colors">Creator Network</a>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
