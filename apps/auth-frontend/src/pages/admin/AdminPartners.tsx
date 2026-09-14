import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Search, Plus, X, Percent, Loader2, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    percentage: 10
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get('/api/admin/partners', { withCredentials: true });
      setPartners(res.data);
    } catch (err) {
      console.error('Failed to fetch partners', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPartnerId) {
        await axios.put(`/api/admin/partners/${editingPartnerId}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/admin/partners', formData, { withCredentials: true });
      }
      setIsModalOpen(false);
      setEditingPartnerId(null);
      setFormData({ name: '', email: '', password: '', percentage: 10 });
      fetchPartners();
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${editingPartnerId ? 'update' : 'create'} partner`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-primary" /> Partner Management
          </h1>
          <p className="text-gray-400 mt-2">Create and manage agency referral partners.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary w-64 transition-colors"
            />
          </div>
          <button 
            onClick={() => exportToCSV(filteredPartners, 'partners.csv')}
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
          <button 
            onClick={() => {
              setEditingPartnerId(null);
              setFormData({ name: '', email: '', password: '', percentage: 10 });
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> New Partner
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-semibold">Partner</th>
                <th className="px-6 py-5 font-semibold">Revenue Share</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></td></tr>
              ) : filteredPartners.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No partners found.</td></tr>
              ) : (
                filteredPartners.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-base">{p.name}</div>
                      <div className="text-gray-400 mt-0.5">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {p.partner_percentage}% of Net
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${p.id}`);
                            alert('Invite link copied!');
                          }}
                          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          Copy Link
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPartnerId(p.id);
                            setFormData({
                              name: p.name,
                              email: p.email,
                              password: '',
                              percentage: p.partner_percentage || 10
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Edit
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingPartnerId ? 'Edit Partner' : 'Create New Partner'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {editingPartnerId ? 'New Password (Optional)' : 'Temporary Password'}
                </label>
                <input
                  type="password"
                  required={!editingPartnerId}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Revenue Share % (Agency Net)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={formData.percentage}
                    onChange={e => setFormData({...formData, percentage: parseFloat(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : editingPartnerId ? 'Update Partner Account' : 'Create Partner Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
