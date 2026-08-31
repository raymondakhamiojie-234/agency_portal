import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, ExternalLink, MoreVertical, TrendingUp, Filter, Users as UsersIcon } from 'lucide-react';

export default function AdminCreators() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('ALL');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await axios.get('/api/admin/creators/details', { withCredentials: true });
      setCreators(res.data);
    } catch (err) {
      console.error('Failed to fetch creators', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(c => {
    const matchesSearch = 
      (c.name?.toLowerCase().includes(search.toLowerCase())) ||
      (c.email?.toLowerCase().includes(search.toLowerCase())) ||
      (c.brand_name?.toLowerCase().includes(search.toLowerCase()));
    
    const matchesPlatform = filterPlatform === 'ALL' || c.primary_platform?.toLowerCase() === filterPlatform.toLowerCase();
    
    return matchesSearch && matchesPlatform;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getPlatformColor = (platform: string) => {
    switch(platform?.toLowerCase()) {
      case 'youtube': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'tiktok': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'instagram': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'facebook': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'twitch': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-primary" /> Creator Management
          </h1>
          <p className="text-gray-400 mt-2">View and manage all registered creators on the platform.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or brand..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary w-64 md:w-80 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary appearance-none transition-colors cursor-pointer"
            >
              <option value="ALL">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-semibold">Creator</th>
                <th className="px-6 py-5 font-semibold">Platform & Scale</th>
                <th className="px-6 py-5 font-semibold">Location</th>
                <th className="px-6 py-5 font-semibold">Total Earnings</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    <p className="mt-2 text-gray-400">Loading creators...</p>
                  </td>
                </tr>
              ) : filteredCreators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <UsersIcon className="h-10 w-10 text-white/10 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No creators found.</p>
                  </td>
                </tr>
              ) : (
                filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 mr-4 flex-shrink-0">
                          {creator.brand_name ? creator.brand_name.charAt(0).toUpperCase() : creator.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white truncate max-w-[200px]" title={creator.brand_name || creator.name}>
                            {creator.brand_name || creator.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {creator.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {creator.primary_platform ? (
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPlatformColor(creator.primary_platform)}`}>
                            {creator.primary_platform}
                          </span>
                          {creator.follower_count > 0 && (
                            <div className="text-xs text-gray-400 mt-2 font-medium">
                              {(creator.follower_count / 1000).toFixed(1)}k followers
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs italic">Unspecified</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-300 font-medium">
                        {creator.country || <span className="text-gray-600 italic text-xs">Unknown</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-white font-semibold">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                        {formatCurrency(parseFloat(creator.total_earnings))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:text-primary text-gray-500">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
