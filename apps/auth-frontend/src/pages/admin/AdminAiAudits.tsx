import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bot, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Play, 
  X, 
  Code2
} from 'lucide-react';

interface AdminAudit {
  id: number;
  creator_id: number;
  user_id: number;
  creator_name: string;
  creator_email: string;
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
  strengths: any;
  weaknesses: any;
  recommendations: any;
  content_breakdown: any;
  monetization_opportunities: any;
  source: string;
  created_at: string;
}

export default function AdminAiAudits() {
  const [audits, setAudits] = useState<AdminAudit[]>([]);
  const [credentials, setCredentials] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Test webhook state
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Selected audit for modal
  const [activeAudit, setActiveAudit] = useState<AdminAudit | null>(null);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [auditsRes, credsRes] = await Promise.all([
        axios.get('/api/ai/admin/audits', { withCredentials: true }),
        axios.get('/api/ai/admin/credentials', { withCredentials: true })
      ]);
      setAudits(auditsRes.data || []);
      setCredentials(credsRes.data || null);
    } catch (err) {
      console.error('Failed to load admin audits data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (credentials?.webhook_url) {
      navigator.clipboard.writeText(credentials.webhook_url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleCopyKey = () => {
    if (credentials?.api_key) {
      navigator.clipboard.writeText(credentials.api_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTestResult(null);
    try {
      const res = await axios.post('/api/ai/admin/test-webhook', {}, { withCredentials: true });
      if (res.data.success) {
        setTestResult('Webhook test successful! Simulated external AI audit ingested.');
        fetchData();
      }
    } catch (err: any) {
      setTestResult('Test failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setTestingWebhook(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const parseList = (item: any) => {
    if (!item) return [];
    if (Array.isArray(item)) return item;
    try {
      return JSON.parse(item);
    } catch {
      return [];
    }
  };

  const filteredAudits = audits.filter(a => {
    const matchSearch = (a.creator_name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.creator_email || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.page_name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.page_url || '').toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === 'ALL' || (a.platform || '').toLowerCase() === platformFilter.toLowerCase();
    return matchSearch && matchPlatform;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-gray-400 text-sm">Loading AI Page Audits...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-purple-600/10 to-transparent p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 flex items-center">
              <Bot className="h-3 w-3 mr-1" /> External AI Ingestion Hub
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              ● Webhook Active
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
            AI Page Audits Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor creator page audits, review virality metrics, and manage external AI webhook integration.
          </p>
        </div>

        <button
          onClick={handleTestWebhook}
          disabled={testingWebhook}
          className="flex items-center px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
          <span>{testingWebhook ? 'Testing...' : 'Send Test Webhook Ping'}</span>
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl text-sm flex items-center border ${
          testResult.includes('successful') 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {testResult.includes('successful') ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
          <span>{testResult}</span>
        </div>
      )}

      {/* External AI Connection Configuration Console */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Code2 className="w-5 h-5 mr-2 text-primary" /> External AI Webhook Credentials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Inbound Webhook URL (POST)
            </label>
            <div className="flex items-center bg-black/60 border border-white/10 rounded-xl overflow-hidden p-1.5">
              <input
                type="text"
                readOnly
                value={credentials?.webhook_url || ''}
                className="bg-transparent text-xs font-mono text-gray-300 px-2.5 flex-1 outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors flex items-center"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              External AI scripts or scrapers POST JSON audit payloads to this URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              API Secret Key (Header: x-ai-api-key)
            </label>
            <div className="flex items-center bg-black/60 border border-white/10 rounded-xl overflow-hidden p-1.5">
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={credentials?.api_key || ''}
                className="bg-transparent text-xs font-mono text-gray-300 px-2.5 flex-1 outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-2.5 py-1.5 text-gray-400 hover:text-white text-xs mr-1 transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={handleCopyKey}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors flex items-center"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Pass this key in the <code className="text-primary font-mono">x-ai-api-key</code> request header.
            </p>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search creator, channel, or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary placeholder:text-gray-600"
          />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Platforms</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-mono">
          Showing {filteredAudits.length} of {audits.length} Audits
        </span>
      </div>

      {/* Audits Directory Table */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Creator</th>
                <th className="px-6 py-4 font-semibold">Page / Channel</th>
                <th className="px-6 py-4 font-semibold text-center">Score</th>
                <th className="px-6 py-4 font-semibold">Virality / Rates</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No audits found. Click "Send Test Webhook Ping" to simulate one or have a creator run an analysis.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{a.creator_name}</div>
                      <div className="text-xs text-gray-500">{a.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <div className="flex items-center space-x-1.5 font-medium text-white">
                        <span>{a.page_name}</span>
                        <span className="text-xs font-mono text-primary font-bold">({a.platform})</span>
                      </div>
                      <a href={a.page_url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-primary truncate block font-mono">
                        {a.page_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        a.health_score >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        a.health_score >= 80 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {a.health_score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-emerald-400 font-semibold">{a.estimated_sponsorship_rate}</div>
                      <div className="text-[11px] text-gray-500">Virality: {a.virality_score}% • Eng: {a.engagement_score}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-gray-300">
                        {a.source === 'external_ai' ? 'External AI' : a.source === 'external_ai_test' ? 'Test Ping' : 'Instant AI'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActiveAudit(a)}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold transition-colors"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {activeAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setActiveAudit(null)} />
          <div className="relative bg-[#0b0c14] border border-white/15 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-primary font-mono">
                  {activeAudit.platform} Channel Audit
                </span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{activeAudit.page_name}</h3>
                <p className="text-xs text-gray-400">Creator: {activeAudit.creator_name} ({activeAudit.creator_email})</p>
              </div>
              <button 
                onClick={() => setActiveAudit(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scores Overview */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase">Health</span>
                <div className="text-2xl font-bold text-emerald-400">{activeAudit.health_score}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase">Virality</span>
                <div className="text-2xl font-bold text-amber-400">{activeAudit.virality_score}%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase">Engagement</span>
                <div className="text-2xl font-bold text-cyan-400">{activeAudit.engagement_score}%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase">Monetization</span>
                <div className="text-2xl font-bold text-purple-400">{activeAudit.monetization_score}%</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Executive AI Summary</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{activeAudit.executive_summary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 uppercase">Key Strengths</h5>
                <div className="space-y-2">
                  {parseList(activeAudit.strengths).map((s: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-300 bg-black/40 p-2.5 rounded-xl border border-emerald-500/10">
                      <p className="font-semibold text-emerald-300">{typeof s === 'string' ? s : s.title}</p>
                      {s.description && <p className="text-gray-400 mt-0.5">{s.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <h5 className="text-xs font-bold text-rose-400 uppercase">Growth Bottlenecks</h5>
                <div className="space-y-2">
                  {parseList(activeAudit.weaknesses).map((w: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-300 bg-black/40 p-2.5 rounded-xl border border-rose-500/10">
                      <p className="font-semibold text-rose-300">{typeof w === 'string' ? w : w.title}</p>
                      {w.description && <p className="text-gray-400 mt-0.5">{w.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Tactical Recommendations</h5>
              <div className="space-y-2">
                {parseList(activeAudit.recommendations).map((r: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{typeof r === 'string' ? r : r.title}</p>
                      {r.description && <p className="text-xs text-gray-400 mt-0.5">{r.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveAudit(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
