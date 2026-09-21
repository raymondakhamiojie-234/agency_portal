import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers as LayersIcon, Link as LinkIcon, Loader2, X, Share2 } from 'lucide-react';

export default function FbPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState({ name: '', url: '' });

  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedProfileId, setSelectedProfileId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, profilesRes] = await Promise.all([
        axios.get('/api/admin/fb-pages', { withCredentials: true }),
        axios.get('/api/admin/fb-sheet', { withCredentials: true })
      ]);
      setPages(pagesRes.data);
      setProfiles(profilesRes.data);
    } catch (err) {
      console.error('Failed to fetch FB data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post('/api/admin/fb-pages', createData, { withCredentials: true });
      setIsCreateModalOpen(false);
      setCreateData({ name: '', url: '' });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return alert("Please select a profile");
    setAssigning(true);
    try {
      await axios.put(`/api/admin/fb-pages/${selectedPage.id}/assign`, {
        profileName: selectedProfileId // we are storing the string name here now
      }, { withCredentials: true });
      setIsAssignModalOpen(false);
      setSelectedPage(null);
      setSelectedProfileId('');
      fetchData();
      alert("Page assigned successfully! Syncing to Google Sheets in background.");
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to assign page');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <LayersIcon className="h-8 w-8 mr-3 text-primary" /> FB Pages
          </h1>
          <p className="text-gray-400 mt-2">Manage Facebook Pages and assign them to Profiles.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Create Button Removed */}
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-semibold">Creator</th>
                <th className="px-6 py-5 font-semibold">Page Name</th>
                <th className="px-6 py-5 font-semibold">Page URL</th>
                <th className="px-6 py-5 font-semibold">Assigned Profile</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></td></tr>
              ) : pages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No pages found.</td></tr>
              ) : (
                pages.map((p) => {
                  const safeUrl = Array.isArray(p.url) && p.url.length > 0 ? p.url[0] : (typeof p.url === 'string' ? p.url : null);
                  return (
                  <tr key={p.user_id || p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-300">{p.creator_name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium text-base ${p.id ? 'text-white' : 'text-gray-500 italic'}`}>{p.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {safeUrl ? (
                        <a href={safeUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center">
                          <LinkIcon className="h-3 w-3 mr-1" /> View Page
                        </a>
                      ) : <span className="text-gray-500 text-xs">No URL</span>}
                    </td>
                    <td className="px-6 py-4">
                      {!p.id ? (
                        <span className="text-gray-600 text-xs">Waiting for creator...</span>
                      ) : p.profile_name ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          {p.profile_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.id && (
                        <button 
                          onClick={() => {
                            setSelectedPage(p);
                            setSelectedProfileId(p.profile_name || '');
                            setIsAssignModalOpen(true);
                          }}
                          className="text-xs bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium inline-flex items-center"
                        >
                          <Share2 className="h-3 w-3 mr-1.5" /> Assign Profile
                        </button>
                      )}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create FB Page</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Page Name</label>
                <input
                  type="text"
                  required
                  value={createData.name}
                  onChange={e => setCreateData({...createData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Agency Memes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Page URL (Optional)</label>
                <input
                  type="url"
                  value={createData.url}
                  onChange={e => setCreateData({...createData, url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {creating ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Assign Profile</h2>
            <p className="text-sm text-gray-400 mb-6">Select a profile to manage <strong>{selectedPage.name}</strong>. This will also sync to your Google Sheet.</p>
            
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Profile</label>
                <select
                  required
                  value={selectedProfileId}
                  onChange={e => setSelectedProfileId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>-- Choose a Profile --</option>
                  {profiles.map((p, index) => (
                    <option key={index} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={assigning}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {assigning ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save & Sync to Sheet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
