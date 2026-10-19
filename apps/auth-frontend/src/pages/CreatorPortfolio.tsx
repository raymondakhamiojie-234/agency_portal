import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Globe, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Mail, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Inbox, 
  Layers,
  Palette
} from 'lucide-react';

export default function CreatorPortfolio() {
  const [activeTab, setActiveTab] = useState<'editor' | 'inquiries'>('editor');
  const [portfolio, setPortfolio] = useState<any>({
    slug: '',
    is_published: true,
    display_name: '',
    tagline: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    theme_color: '#6366f1',
    primary_platform: 'Facebook',
    follower_count: 0,
    social_links: [],
    featured_media: [],
    services: [],
    contact_email: ''
  });

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const publicBaseUrl = 'https://creators.falcusmedia.com';

  useEffect(() => {
    fetchPortfolio();
    fetchInquiries();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('/api/portfolio', { withCredentials: true });
      if (res.data.portfolio) {
        const p = res.data.portfolio;
        setPortfolio({
          ...p,
          social_links: Array.isArray(p.social_links) ? p.social_links : (typeof p.social_links === 'string' ? JSON.parse(p.social_links) : []),
          featured_media: Array.isArray(p.featured_media) ? p.featured_media : (typeof p.featured_media === 'string' ? JSON.parse(p.featured_media) : []),
          services: Array.isArray(p.services) ? p.services : (typeof p.services === 'string' ? JSON.parse(p.services) : [])
        });
      }
    } catch (err: any) {
      console.error('Failed to load portfolio', err);
      setErrorMessage(err.response?.data?.error || 'Failed to load portfolio data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await axios.get('/api/portfolio/inquiries', { withCredentials: true });
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    }
  };

  const handleCopyLink = () => {
    const url = `${publicBaseUrl}/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      const res = await axios.put('/api/portfolio', portfolio, { withCredentials: true });
      if (res.data.portfolio) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Failed to update portfolio', err);
      setErrorMessage(err.response?.data?.error || 'Failed to save portfolio changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/portfolio/inquiries/${id}/status`, { status }, { withCredentials: true });
      fetchInquiries();
    } catch (err) {
      console.error('Failed to update inquiry status', err);
    }
  };

  // Social Links Helpers
  const addSocialLink = () => {
    setPortfolio({
      ...portfolio,
      social_links: [...(portfolio.social_links || []), { platform: 'YouTube', url: '', followers: '' }]
    });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...portfolio.social_links];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio({ ...portfolio, social_links: updated });
  };

  const removeSocialLink = (index: number) => {
    const updated = portfolio.social_links.filter((_: any, i: number) => i !== index);
    setPortfolio({ ...portfolio, social_links: updated });
  };

  // Featured Media Helpers
  const addFeaturedMedia = () => {
    setPortfolio({
      ...portfolio,
      featured_media: [...(portfolio.featured_media || []), { title: '', url: '', type: 'video' }]
    });
  };

  const updateFeaturedMedia = (index: number, field: string, value: string) => {
    const updated = [...portfolio.featured_media];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio({ ...portfolio, featured_media: updated });
  };

  const removeFeaturedMedia = (index: number) => {
    const updated = portfolio.featured_media.filter((_: any, i: number) => i !== index);
    setPortfolio({ ...portfolio, featured_media: updated });
  };

  // Services Helpers
  const addService = () => {
    setPortfolio({
      ...portfolio,
      services: [...(portfolio.services || []), { title: '', description: '', price: '' }]
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...portfolio.services];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio({ ...portfolio, services: updated });
  };

  const removeService = (index: number) => {
    const updated = portfolio.services.filter((_: any, i: number) => i !== index);
    setPortfolio({ ...portfolio, services: updated });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-gray-400">Loading portfolio settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-purple-600/10 to-transparent p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" /> Public Media Kit
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${portfolio.is_published ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
              {portfolio.is_published ? '● Live' : '○ Draft'}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
            Creator Portfolio & Media Kit
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Showcase your audience, content, and sponsorship packages to brands worldwide.
          </p>
        </div>

        {/* Live URL & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            <span className="text-gray-500">creators.falcusmedia.com/</span>
            <span className="text-white font-medium ml-0.5">{portfolio.slug || 'yourname'}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 mr-1.5 text-green-400" /> : <Copy className="h-4 w-4 mr-1.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a
            href={`/p/${portfolio.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,255,0.2)]"
          >
            <Eye className="h-4 w-4 mr-1.5" /> Preview Live
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-border text-sm font-medium">
        <button
          onClick={() => setActiveTab('editor')}
          className={`pb-4 flex items-center transition-colors relative ${
            activeTab === 'editor' ? 'text-primary' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4 mr-2" /> Portfolio Builder
          {activeTab === 'editor' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-4 flex items-center transition-colors relative ${
            activeTab === 'inquiries' ? 'text-primary' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Inbox className="h-4 w-4 mr-2" /> Brand Inquiries
          {inquiries.filter(i => i.status === 'NEW').length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
              {inquiries.filter(i => i.status === 'NEW').length}
            </span>
          )}
          {activeTab === 'inquiries' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {/* Alert Messages */}
      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          Portfolio updated successfully! Changes are live on your public page.
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* TAB 1: PORTFOLIO BUILDER */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section: URL & Visibility */}
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary" /> Handle & Visibility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Public URL Handle (Slug)
                </label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-primary">
                  <span className="bg-white/5 text-gray-500 px-3 py-2.5 text-sm flex items-center border-r border-white/10">
                    creators.falcusmedia.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={portfolio.slug || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                    placeholder="pagename"
                    className="w-full bg-black/40 px-3 py-2.5 text-white text-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only lowercase letters, numbers, and dashes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Publishing Status
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={portfolio.is_published}
                      onChange={(e) => setPortfolio({ ...portfolio, is_published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-300">
                      {portfolio.is_published ? 'Published (Visible to Brands)' : 'Draft (Hidden)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Brand & Bio */}
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" /> Brand Profile & Bio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Creator Page Name / Brand Name</label>
                <input
                  type="text"
                  required
                  value={portfolio.display_name || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, display_name: e.target.value })}
                  placeholder="e.g. Falcus Comics"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tagline / Headline</label>
                <input
                  type="text"
                  value={portfolio.tagline || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, tagline: e.target.value })}
                  placeholder="e.g. Daily Comedy Skits & Entertainment"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Avatar / Profile Picture URL</label>
                <input
                  type="url"
                  value={portfolio.avatar_url || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, avatar_url: e.target.value })}
                  placeholder="https://... (Image link)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Banner Cover Image URL</label>
                <input
                  type="url"
                  value={portfolio.banner_url || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, banner_url: e.target.value })}
                  placeholder="https://... (Cover banner link)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Creator Bio / About</label>
                <textarea
                  rows={4}
                  value={portfolio.bio || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                  placeholder="Tell brands about your audience demographics, content niche, and why they should work with you..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Contact Email (for inquiries)</label>
                <input
                  type="email"
                  value={portfolio.contact_email || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, contact_email: e.target.value })}
                  placeholder="sponsorships@brand.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <Palette className="h-4 w-4 mr-1 text-primary" /> Accent Color Theme
                </label>
                <div className="flex items-center space-x-3 mt-1.5">
                  {['#6366f1', '#10b981', '#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPortfolio({ ...portfolio, theme_color: color })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${portfolio.theme_color === color ? 'border-white scale-125 shadow-lg' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Social Channels & Follower Counters */}
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Social Channels & Audience Stats</h2>
                <p className="text-xs text-gray-400 mt-0.5">Showcase your accounts and follower counts.</p>
              </div>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Channel
              </button>
            </div>

            <div className="space-y-3">
              {(portfolio.social_links || []).length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed border-white/10 rounded-xl text-sm">
                  No social channels added yet. Click &quot;Add Channel&quot; above to link your accounts.
                </div>
              ) : (
                portfolio.social_links.map((link: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div className="md:col-span-3">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="Facebook">Facebook</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">X / Twitter</option>
                        <option value="Twitch">Twitch</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-5">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Followers (e.g. 150K)"
                        value={link.followers}
                        onChange={(e) => updateSocialLink(index, 'followers', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Featured Videos & Media */}
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Featured Content & Top Videos</h2>
                <p className="text-xs text-gray-400 mt-0.5">Embed your best-performing videos (YouTube, Facebook, or TikTok).</p>
              </div>
              <button
                type="button"
                onClick={addFeaturedMedia}
                className="flex items-center px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Video
              </button>
            </div>

            <div className="space-y-3">
              {(portfolio.featured_media || []).length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed border-white/10 rounded-xl text-sm">
                  No featured videos added yet. Add links to show off your best work.
                </div>
              ) : (
                portfolio.featured_media.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div className="md:col-span-5">
                      <input
                        type="text"
                        placeholder="Video Title (e.g. 5M Views Viral Sketch)"
                        value={item.title}
                        onChange={(e) => updateFeaturedMedia(index, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <input
                        type="url"
                        placeholder="Video URL (e.g. https://www.youtube.com/watch?v=...)"
                        value={item.url}
                        onChange={(e) => updateFeaturedMedia(index, 'url', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeFeaturedMedia(index)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Collaboration Packages / Services */}
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Sponsorship Packages & Rates</h2>
                <p className="text-xs text-gray-400 mt-0.5">Define your offering and pricing for brand collaborations.</p>
              </div>
              <button
                type="button"
                onClick={addService}
                className="flex items-center px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Package
              </button>
            </div>

            <div className="space-y-3">
              {(portfolio.services || []).length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed border-white/10 rounded-xl text-sm">
                  No packages listed. Click &quot;Add Package&quot; to define your sponsorship offerings.
                </div>
              ) : (
                portfolio.services.map((svc: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        placeholder="Package Name (e.g. Dedicated Video)"
                        value={svc.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <input
                        type="text"
                        placeholder="Description (e.g. 60s integration + link in bio)"
                        value={svc.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Price (e.g. $500)"
                        value={svc.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sticky Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,255,0.3)] disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Saving Portfolio...' : 'Save & Publish Changes'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BRAND INQUIRIES INBOX */}
      {activeTab === 'inquiries' && (
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                <Inbox className="h-5 w-5 mr-2 text-primary" /> Brand Booking Inquiries
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Proposals submitted by sponsors via your public portfolio page.
              </p>
            </div>
            <span className="text-xs text-gray-500">
              Total: {inquiries.length} inquiries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Brand / Contact</th>
                  <th className="px-6 py-4 font-semibold">Budget</th>
                  <th className="px-6 py-4 font-semibold">Campaign Proposal</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No inquiries received yet. Share your portfolio link with sponsors to start receiving bookings!
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{inq.brand_name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center">
                          {inq.contact_name} &bull; <Mail className="h-3 w-3 ml-1.5 mr-1" />
                          <a href={`mailto:${inq.contact_email}?subject=Collaboration with ${portfolio.display_name}`} className="hover:text-primary underline">
                            {inq.contact_email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full text-xs">
                          {inq.budget || 'Flexible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                          {inq.campaign_details}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          inq.status === 'NEW' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : inq.status === 'CONTACTED'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {inq.status !== 'CONTACTED' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'CONTACTED')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white rounded-lg transition-colors border border-white/5"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {inq.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'ARCHIVED')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-white/5"
                          >
                            Archive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
