import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';

export default function AdminMonetization() {
  const [monetization, setMonetization] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [userId, setUserId] = useState('');
  const [platform, setPlatform] = useState('YOUTUBE');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState('');
  const [status, setStatus] = useState('IN_REVIEW');

  useEffect(() => {
    fetchMonetization();
  }, []);

  const fetchMonetization = async () => {
    try {
      const res = await axios.get('/api/admin/monetization', { withCredentials: true });
      setMonetization(res.data);
    } catch (err) {
      console.error("Failed to load monetization", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/monetization', {
        user_id: userId,
        platform,
        handle,
        current_followers: parseInt(followers, 10),
        status
      }, { withCredentials: true });
      fetchMonetization();
      // Reset form
      setUserId('');
      setHandle('');
      setFollowers('');
    } catch (err) {
      console.error("Failed to save monetization status", err);
      alert("Failed to save.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Monetization Tracker</h1>
        <p className="text-gray-400 mt-1">Manage creator platform eligibility and status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add / Update Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">User ID</label>
                <input 
                  type="text" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Platform</label>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Handle / Channel</label>
                <input 
                  type="text" 
                  value={handle} 
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Followers/Subs Count</label>
                <input 
                  type="number" 
                  value={followers} 
                  onChange={(e) => setFollowers(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="ELIGIBLE">Eligible</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="NOT_ELIGIBLE">Not Eligible</option>
                  <option value="DEMONETIZED">Demonetized</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Platform Roster</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Creator</th>
                    <th className="px-6 py-4 font-medium">Platform</th>
                    <th className="px-6 py-4 font-medium">Followers</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                  ) : monetization.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
                  ) : (
                    monetization.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{m.creator_name}</div>
                          <div className="text-xs text-gray-500">{m.creator_email} (ID: {m.user_id})</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white capitalize">{m.platform.toLowerCase()}</div>
                          <div className="text-xs text-gray-500">{m.handle}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {new Intl.NumberFormat().format(m.current_followers)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            m.status === 'ELIGIBLE' ? 'bg-green-500/10 text-green-400' : 
                            m.status === 'IN_REVIEW' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {m.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
