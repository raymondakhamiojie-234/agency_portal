import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, Download, FileSignature } from 'lucide-react';

export default function AdminContracts() {
  const [masterContracts, setMasterContracts] = useState<any[]>([]);
  const [platformContracts, setPlatformContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'master' | 'platform'>('master');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('/api/admin/contracts', { withCredentials: true });
      setMasterContracts(res.data.master);
      setPlatformContracts(res.data.platform);
    } catch (err) {
      console.error('Failed to fetch contracts', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-gray-400">Loading contracts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <FileSignature className="h-8 w-8 mr-3 text-primary" /> Contracts
        </h1>
        <p className="text-gray-400 mt-2">View all signed creator and platform contracts.</p>
      </div>

      <div className="flex space-x-4 border-b border-border">
        <button
          onClick={() => setActiveTab('master')}
          className={pb-4 text-sm font-medium transition-colors relative }
        >
          Master Agreements
          {activeTab === 'master' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('platform')}
          className={pb-4 text-sm font-medium transition-colors relative }
        >
          Platform Contracts
          {activeTab === 'platform' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'master' ? (
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Creator</th>
                  <th className="px-6 py-4 font-semibold">Rev Share</th>
                  <th className="px-6 py-4 font-semibold">Duration</th>
                  <th className="px-6 py-4 font-semibold">Signed By</th>
                  <th className="px-6 py-4 font-semibold">Date Signed</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {masterContracts.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No master contracts found</td></tr>
                ) : (
                  masterContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{c.creator_name}</div>
                        <div className="text-xs text-gray-500">{c.creator_email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-medium">{c.revenue_share_percentage}%</td>
                      <td className="px-6 py-4 text-gray-300 font-medium">{c.duration_years} Year(s)</td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{c.signature_name}</div>
                        <div className="text-xs text-gray-500">IP: {c.signature_ip}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(c.signed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Creator</th>
                  <th className="px-6 py-4 font-semibold">Platform</th>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-6 py-4 font-semibold">Followers</th>
                  <th className="px-6 py-4 font-semibold">Date Signed</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {platformContracts.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No platform contracts found</td></tr>
                ) : (
                  platformContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{c.creator_name}</div>
                        <div className="text-xs text-gray-500">{c.creator_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          {c.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{c.account_name}</div>
                        {c.account_url && (
                          <a href={c.account_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                            View Account
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-medium">
                        {(c.followers_count || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(c.signed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> {c.status}
                        </span>
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
