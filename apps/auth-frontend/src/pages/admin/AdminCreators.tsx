import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, ExternalLink, TrendingUp, Filter, Users as UsersIcon, X, Globe, Phone, MapPin } from 'lucide-react';

export default function AdminCreators() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('ALL');
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

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
                        <button 
                          onClick={() => setSelectedCreator(creator)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:text-primary text-gray-400 hover:text-white"
                          title="View Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <a 
                          href={`mailto:${creator.email}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                          title="Email Creator"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creator Details Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCreator(null)}
          />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                  {selectedCreator.brand_name ? selectedCreator.brand_name.charAt(0).toUpperCase() : selectedCreator.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {selectedCreator.brand_name || selectedCreator.name}
                  </h2>
                  <p className="text-gray-400">{selectedCreator.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCreator(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Earnings</p>
                  <p className="text-lg font-bold text-green-400">{formatCurrency(parseFloat(selectedCreator.total_earnings))}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Followers</p>
                  <p className="text-lg font-bold text-white">{(selectedCreator.follower_count / 1000).toFixed(1)}k</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Platform</p>
                  <p className="text-sm font-bold text-white capitalize mt-1">{selectedCreator.primary_platform || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Joined Date</p>
                  <p className="text-sm font-bold text-white mt-1">
                    {new Date(selectedCreator.joined_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">Contact Info</h3>
                  
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-300">{selectedCreator.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-300">{selectedCreator.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-0.5" />
                    <span className="text-gray-300">
                      {selectedCreator.home_address ? (
                        <>
                          {selectedCreator.home_address}<br />
                          {selectedCreator.country}
                        </>
                      ) : (
                        selectedCreator.country || 'Not provided'
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">Contract Details</h3>
                  
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Percentage:</span>
                    <span className="text-gray-300 font-medium">
                      {selectedCreator.contract_percentage ? `${selectedCreator.contract_percentage}%` : 'Not signed'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Signed Date:</span>
                    <span className="text-gray-300 font-medium">
                      {selectedCreator.contract_signed_at 
                        ? new Date(selectedCreator.contract_signed_at).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">Bank Details</h3>
                  
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Bank Name:</span>
                    <span className="text-gray-300 font-medium">{selectedCreator.bank_name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Account Name:</span>
                    <span className="text-gray-300 font-medium">{selectedCreator.account_name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Account No:</span>
                    <span className="text-gray-300 font-medium">{selectedCreator.bank_account_number || 'Not provided'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">Social Profiles</h3>
                  
                  {selectedCreator.page_name && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-24">Page Name:</span>
                      <span className="text-gray-300 font-medium">{selectedCreator.page_name}</span>
                    </div>
                  )}
                  
                  {selectedCreator.page_urls && selectedCreator.page_urls.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-gray-500 text-sm block">Links:</span>
                      {selectedCreator.page_urls.map((url: string, i: number) => (
                        <a 
                          key={i} 
                          href={url.startsWith('http') ? url : `https://${url}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary hover:text-primary-light transition-colors p-2 bg-primary/5 rounded-lg border border-primary/10"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          <span className="truncate">{url}</span>
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No links provided</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
              <a 
                href={`mailto:${selectedCreator.email}`}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium transition-all mr-3 flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Creator
              </a>
              <button 
                onClick={() => setSelectedCreator(null)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(99,102,255,0.3)] hover:shadow-[0_0_25px_rgba(99,102,255,0.5)]"
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
