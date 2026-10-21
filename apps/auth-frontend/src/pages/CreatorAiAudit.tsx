import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  Globe, 
  Layers,
  ChevronRight,
  Target,
  Clock
} from 'lucide-react';

interface AuditData {
  id: number;
  page_url: string;
  platform: string;
  page_name: string;
  status: string;
  health_score: number;
  engagement_score: number;
  monetization_score: number;
  virality_score: number;
  estimated_sponsorship_rate: string;
  executive_summary: string;
  strengths: Array<{ title: string; description: string }> | string[];
  weaknesses: Array<{ title: string; description: string }> | string[];
  recommendations: Array<{ title: string; description: string; priority?: string }> | string[];
  content_breakdown: any;
  monetization_opportunities: Array<{ category: string; pricing: string; fit?: string; potential?: string }>;
  source: string;
  created_at: string;
}

interface CreatorLink {
  url: string;
  platform: string;
  page_name: string;
  followers: number | string;
  source: string;
}

export default function CreatorAiAudit() {
  const [links, setLinks] = useState<CreatorLink[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [pageName, setPageName] = useState('');
  
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [currentAudit, setCurrentAudit] = useState<AuditData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'monetization' | 'history'>('overview');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [linksRes, auditsRes] = await Promise.all([
        axios.get('/api/ai/creator-links', { withCredentials: true }).catch(() => ({ data: [] })),
        axios.get('/api/ai/audits', { withCredentials: true }).catch(() => ({ data: [] }))
      ]);

      setLinks(linksRes.data || []);
      const auditList = auditsRes.data || [];
      setAudits(auditList);
      
      if (auditList.length > 0) {
        setCurrentAudit(auditList[0]);
      }

      if (linksRes.data && linksRes.data.length > 0) {
        setSelectedUrl(linksRes.data[0].url);
        setPlatform(linksRes.data[0].platform || 'Facebook');
        setPageName(linksRes.data[0].page_name || '');
      }
    } catch (err: any) {
      console.error('Failed to load AI audit data:', err);
      setErrorMsg('Failed to initialize AI Page Auditor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLink = (url: string) => {
    setSelectedUrl(url);
    const match = links.find(l => l.url === url);
    if (match) {
      setPlatform(match.platform || 'Facebook');
      setPageName(match.page_name || '');
    }
    setCustomUrl('');
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = customUrl.trim() || selectedUrl.trim();
    if (!targetUrl) {
      setErrorMsg('Please select or provide a creator page URL to analyze.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await axios.post('/api/ai/audits/analyze', {
        page_url: targetUrl,
        platform,
        page_name: pageName || undefined
      }, { withCredentials: true });

      if (res.data && res.data.audit) {
        setCurrentAudit(res.data.audit);
        setAudits(prev => [res.data.audit, ...prev]);
        setSuccessMsg('AI Page Analysis completed successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to complete page analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-gray-400 text-sm">Connecting to AI Analysis Engine...</p>
      </div>
    );
  }

  // Parse arrays safely (if postgres returned JSON strings)
  const parseList = (item: any) => {
    if (!item) return [];
    if (Array.isArray(item)) return item;
    try {
      return JSON.parse(item);
    } catch {
      return [];
    }
  };

  const strengths = parseList(currentAudit?.strengths);
  const weaknesses = parseList(currentAudit?.weaknesses);
  const recommendations = parseList(currentAudit?.recommendations);
  const monetizationOpps = parseList(currentAudit?.monetization_opportunities);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* =========================================================================
          TOP BANNER: AI AUDITOR HEADER
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/15 via-purple-600/10 to-transparent p-6 sm:p-8 rounded-3xl border border-primary/20 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Page Auditor & Intelligence
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
              External AI Webhook Ready
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Creator Page Analysis
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Continuous AI auditing of your social media pages, virality signals, retention bottlenecks, and commercial monetization valuation.
          </p>
        </div>

        {currentAudit && (
          <div className="relative z-10 flex items-center bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 text-right">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Page Health Score</p>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-0.5">
                {currentAudit.health_score}/100
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                Grade: {currentAudit.health_score >= 90 ? 'A+ Elite Virality' : currentAudit.health_score >= 80 ? 'A Strong Reach' : 'B Growth Mode'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center shadow-lg">
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center shadow-lg">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: PAGE SELECTION & RUN AUDIT CONTROLLER
         ========================================================================= */}
      <div className="bg-black/40 backdrop-blur-md border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary" /> Target Creator Page for Analysis
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Select one of your registered channel links or enter a new public social profile URL.
            </p>
          </div>
          {currentAudit && (
            <span className="text-xs text-gray-500">
              Last Audited: {new Date(currentAudit.created_at).toLocaleDateString()} via {currentAudit.source === 'external_ai' ? 'External AI Bot' : 'On-Demand Engine'}
            </span>
          )}
        </div>

        <form onSubmit={handleRunAnalysis} className="space-y-6">
          
          {/* Quick Select Buttons from Creator's Linked Profiles */}
          {links.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                Your Linked Pages ({links.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {links.map((link, idx) => {
                  const isSelected = selectedUrl === link.url && !customUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLink(link.url)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between ${
                        isSelected 
                          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 text-white' 
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-xs font-bold text-primary">{link.platform}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-mono">• {link.source}</span>
                        </div>
                        <p className="font-semibold text-sm truncate text-white">{link.page_name}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5 font-mono">{link.url}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Or Provide Custom Link */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Or Custom Social Page Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage or https://youtube.com/@handle"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    if (e.target.value) setSelectedUrl('');
                  }}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder:text-gray-600 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Facebook">Facebook Page</option>
                <option value="YouTube">YouTube Channel</option>
                <option value="TikTok">TikTok Profile</option>
                <option value="Instagram">Instagram Account</option>
                <option value="X (Twitter)">X / Twitter</option>
                <option value="General">Other / Website</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3 px-5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Analyzing Page...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1.5 text-yellow-300 fill-yellow-300" />
                    <span>Analyze Page with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* =========================================================================
          ANALYSIS IN PROGRESS BANNER
         ========================================================================= */}
      {analyzing && (
        <div className="bg-[#0b0c14] border border-primary/30 rounded-3xl p-8 text-center space-y-4 animate-pulse shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Deep Scan in Progress</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mt-1">
              Inspecting content cadence, engagement hooks, thumbnail contrast, viewer sentiment, and brand sponsorship valuation...
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: AUDIT RESULTS DISPLAY
         ========================================================================= */}
      {currentAudit && !analyzing && (
        <div className="space-y-8">
          
          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider">Virality Potential</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {currentAudit.virality_score}%
              </div>
              <p className="text-xs text-amber-400 mt-1 font-medium">
                High Hook & Share Velocity
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider">Engagement Quality</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {currentAudit.engagement_score}%
              </div>
              <p className="text-xs text-cyan-400 mt-1 font-medium">
                Active Comment Resonance
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider">Monetization Ready</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {currentAudit.monetization_score}%
              </div>
              <p className="text-xs text-emerald-400 mt-1 font-medium">
                Prime Brand Deal Fit
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider">Estimated Sponsorship</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white truncate">
                {currentAudit.estimated_sponsorship_rate}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Per integrated campaign
              </p>
            </div>

          </div>

          {/* Navigation Tabs for Audit Details */}
          <div className="flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Overview & Diagnosis</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'recommendations'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Tactical Recommendations ({recommendations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('monetization')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'monetization'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Monetization Blueprint</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Audit History ({audits.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & DIAGNOSIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Executive Summary */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4" />
                  <span>Executive AI Summary</span>
                </div>
                <p className="text-gray-200 text-base leading-relaxed">
                  {currentAudit.executive_summary}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                  <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                    Platform: {currentAudit.platform}
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                    Channel: {currentAudit.page_name}
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                    Audited: {new Date(currentAudit.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Key Strengths */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" /> Key Algorithmic Strengths
                  </h3>
                  <div className="space-y-3">
                    {strengths.map((s: any, idx: number) => {
                      const title = typeof s === 'string' ? s : s.title;
                      const desc = typeof s === 'string' ? '' : s.description;
                      return (
                        <div key={idx} className="p-3.5 bg-black/40 border border-emerald-500/15 rounded-2xl">
                          <p className="font-semibold text-sm text-emerald-300">{title}</p>
                          {desc && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Growth Bottlenecks */}
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-bold text-rose-400 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" /> Growth & Retention Bottlenecks
                  </h3>
                  <div className="space-y-3">
                    {weaknesses.map((w: any, idx: number) => {
                      const title = typeof w === 'string' ? w : w.title;
                      const desc = typeof w === 'string' ? '' : w.description;
                      return (
                        <div key={idx} className="p-3.5 bg-black/40 border border-rose-500/15 rounded-2xl">
                          <p className="font-semibold text-sm text-rose-300">{title}</p>
                          {desc && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TACTICAL RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary" /> Actionable Growth Blueprint
                  </h3>
                  <span className="text-xs text-gray-400">Ranked by Expected Reach Impact</span>
                </div>
                
                <div className="divide-y divide-white/5">
                  {recommendations.map((rec: any, idx: number) => {
                    const title = typeof rec === 'string' ? rec : rec.title;
                    const desc = typeof rec === 'string' ? '' : rec.description;
                    const priority = rec.priority || (idx === 0 ? 'High' : 'Medium');

                    return (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start space-x-4">
                        <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-bold text-white">{title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-primary/20 text-primary'
                            }`}>
                              {priority} Priority
                            </span>
                          </div>
                          {desc && (
                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{desc}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONETIZATION BLUEPRINT */}
          {activeTab === 'monetization' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {monetizationOpps.map((opp: any, idx: number) => (
                  <div key={idx} className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        {opp.potential || 'High Potential'}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-3">{opp.category}</h4>
                      <p className="text-xs text-gray-400 mt-1">{opp.fit}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <span className="text-xs text-gray-500 uppercase block">Suggested Pricing</span>
                      <span className="text-xl font-extrabold text-emerald-400">{opp.pricing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-4">Past Audits Archive</h3>
              <div className="divide-y divide-white/5">
                {audits.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => setCurrentAudit(a)}
                    className={`py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] px-3 rounded-xl transition-colors ${
                      currentAudit.id === a.id ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{a.page_name}</span>
                        <span className="text-xs text-primary font-mono">({a.platform})</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-sm sm:max-w-md">{a.page_url}</p>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <span className="text-lg font-bold text-emerald-400">{a.health_score}/100</span>
                        <p className="text-[10px] text-gray-500">{new Date(a.created_at).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          SECTION 3: HOW EXTERNAL AI INTEGRATION WORKS (EXPLANATION BANNER)
         ========================================================================= */}
      <div className="bg-[#080910] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">External AI Bot Synchronization</h3>
              <p className="text-xs text-gray-400">Our system hosts an open Webhook API allowing external AI agents to crawl and analyze your pages.</p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Integration
          </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Whenever you update or add a social link in your profile, our external AI crawlers can automatically pull the link from our queue, calculate virality scores, and stream the updated recommendations straight back into this dashboard.
        </p>
      </div>

    </div>
  );
}
