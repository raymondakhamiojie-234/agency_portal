import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, Clock, AlertCircle, Plus, X, Download } from 'lucide-react';

export default function CreatorContracts() {
  const [masterContracts, setMasterContracts] = useState<any[]>([]);
  const [platformContracts, setPlatformContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  
  // Master Contract Sign State
  const [signatureName, setSignatureName] = useState('');
  const [signingMaster, setSigningMaster] = useState(false);
  
  // Platform Contract Form State
  const [platform, setPlatform] = useState('YouTube');
  const [accountName, setAccountName] = useState('');
  const [accountUrl, setAccountUrl] = useState('');
  const [followersCount, setFollowersCount] = useState('');
  const [signingPlatform, setSigningPlatform] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('/api/creator/contracts', { withCredentials: true });
      setMasterContracts(res.data.master);
      setPlatformContracts(res.data.platform);
    } catch (err) {
      console.error('Failed to fetch contracts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningMaster(true);
    try {
      await axios.post('/api/creator/contracts/master', { signature_name: signatureName }, { withCredentials: true });
      fetchContracts();
    } catch (err) {
      console.error('Failed to sign master contract', err);
    } finally {
      setSigningMaster(false);
    }
  };

  const handleSignPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningPlatform(true);
    try {
      await axios.post('/api/creator/contracts/platform', {
        platform,
        account_name: accountName,
        account_url: accountUrl,
        followers_count: parseInt(followersCount) || 0
      }, { withCredentials: true });
      setShowPlatformModal(false);
      setAccountName('');
      setAccountUrl('');
      setFollowersCount('');
      fetchContracts();
    } catch (err) {
      console.error('Failed to sign platform contract', err);
    } finally {
      setSigningPlatform(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-gray-400">Loading contracts...</div>
      </div>
    );
  }

  // If no master contract exists, show the Master Contract signing view
  if (masterContracts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Creator Agreement</h1>
          <p className="text-gray-400">Please review and sign your master revenue share agreement to proceed.</p>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Exclusive Partnership Agreement</h2>
              <p className="text-sm text-gray-400">Falcus Media Ltd & Creator</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-sm text-gray-300 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <p><strong>1. Revenue Share:</strong> 70% to Creator, 30% to Falcus Media Ltd.</p>
            <p><strong>2. Term:</strong> 1 Year from date of signature, auto-renewing unless cancelled 30 days prior.</p>
            <p><strong>3. Exclusivity:</strong> Creator agrees to exclusively manage listed platforms through Falcus Media.</p>
            <p><strong>4. Payments:</strong> Paid monthly via bank transfer or selected payout method.</p>
            <p><em>(This is a binding legal agreement. By typing your name below, you electronically sign this document.)</em></p>
          </div>

          <form onSubmit={handleSignMaster} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Electronic Signature (Type Full Name)</label>
              <input
                type="text"
                required
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full bg-black/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <button
              type="submit"
              disabled={signingMaster || !signatureName}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,255,0.3)]"
            >
              {signingMaster ? 'Signing...' : 'Sign & Agree'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">My Contracts</h1>
          <p className="text-gray-400">Manage your master agreement and platform integrations.</p>
        </div>
        <button 
          onClick={() => setShowPlatformModal(true)}
          className="flex items-center text-sm font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,255,0.2)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Contract Card */}
        <div className="lg:col-span-1 bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-lg font-bold text-white">Master Agreement</h2>
            <div className="px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Active
            </div>
          </div>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue Share</p>
              <p className="text-2xl font-bold text-white">{masterContracts[0].revenue_share_percentage}%</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Signed On</p>
                <p className="text-sm text-gray-300 font-medium">
                  {new Date(masterContracts[0].signed_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Term</p>
                <p className="text-sm text-gray-300 font-medium">{masterContracts[0].duration_years} Year(s)</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Signed By</p>
              <p className="text-sm text-gray-300">{masterContracts[0].signature_name}</p>
            </div>
          </div>

          {masterContracts[0].pdf_url && (
            <div className="mt-6 pt-6 border-t border-border relative z-10">
              <a 
                href={masterContracts[0].pdf_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </a>
            </div>
          )}
        </div>

        {/* Platform Contracts List */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Platform Integrations</h2>
          </div>
          
          {platformContracts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-400 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No Platforms Added</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                You haven't integrated any social media platforms yet. Click "Add Platform" to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {platformContracts.map(p => (
                <div key={p.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium text-lg">{p.platform}</h3>
                    <div className="flex items-center text-sm mt-1">
                      <span className="text-gray-400 mr-3">{p.account_name}</span>
                      <span className="text-gray-500">
                        {new Intl.NumberFormat('en-US').format(p.followers_count || 0)} followers
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      {p.status === 'ACTIVE' || p.status === 'APPROVED' ? (
                        <span className="text-green-400 text-sm font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> {p.status}
                        </span>
                      ) : p.status === 'PENDING' ? (
                        <span className="text-yellow-400 text-sm font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> PENDING
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {p.status}
                        </span>
                      )}
                    </div>
                    {p.contract_file_url && (
                      <a href={p.contract_file_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Platform Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPlatformModal(false)} />
          <div className="relative bg-[#0a0a0a] border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold text-white">Add Platform</h3>
              <button onClick={() => setShowPlatformModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSignPlatform} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option>YouTube</option>
                  <option>Facebook</option>
                  <option>Snapchat</option>
                  <option>TikTok</option>
                  <option>Instagram</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Name / Handle</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Account URL</label>
                <input
                  type="url"
                  required
                  value={accountUrl}
                  onChange={(e) => setAccountUrl(e.target.value)}
                  className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Followers/Subscribers</label>
                <input
                  type="number"
                  required
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g. 150000"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={signingPlatform}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  {signingPlatform ? 'Submitting...' : 'Agree & Submit Integration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
