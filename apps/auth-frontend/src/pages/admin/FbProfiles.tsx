import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Link as LinkIcon, ExternalLink, Plus, Loader2, X } from 'lucide-react';

export default function FbProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '' });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get('/api/admin/fb-sheet', { withCredentials: true });
      // The new endpoint returns an array of { name: 'Profile', pages: [{name, url}] }
      const profilesData = res.data || [];
      
      // Ensure each profile has a unique ID for React keys
      const formattedProfiles = profilesData.map((p: any, index: number) => ({
        id: `prof_${index}`,
        name: p.name,
        url: '', // Tabs don't have URLs natively
        pages: (p.pages || []).map((page: any, pIndex: number) => ({
          id: `page_${index}_${pIndex}`,
          name: page.name,
          url: page.url
        }))
      }));
      
      setProfiles(formattedProfiles);
    } catch (err) {
      console.error('Failed to fetch FB profiles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/admin/fb-profiles', formData, { withCredentials: true });
      setIsModalOpen(false);
      setFormData({ name: '', url: '' });
      fetchProfiles();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-primary" /> FB Profiles
          </h1>
          <p className="text-gray-400 mt-2">Manage Facebook Profiles and the Pages they control.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <a 
            href="https://docs.google.com/spreadsheets/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" /> Google Sheet
          </a>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> New FB Profile
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-semibold">Profile Name</th>
                <th className="px-6 py-5 font-semibold">Profile URL</th>
                <th className="px-6 py-5 font-semibold">Managed Pages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></td></tr>
              ) : profiles.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No profiles found.</td></tr>
              ) : (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-base">{p.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center">
                          <LinkIcon className="h-3 w-3 mr-1" /> View Profile
                        </a>
                      ) : <span className="text-gray-500 text-xs">No URL</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {p.pages && p.pages.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {p.pages.map((page: any) => (
                              <div key={page.id} className="text-xs text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                                {page.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">No pages assigned</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create FB Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Profile Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Profile URL (Optional)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
