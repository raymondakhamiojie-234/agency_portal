import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle, Clock, Trash2, Plus, Zap, Loader2, RefreshCw } from 'lucide-react';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  
  // Create Form State
  const [creatorId, setCreatorId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState('');
  const [tax, setTax] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchCreators();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('/api/admin/invoices', { withCredentials: true });
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await axios.get('/api/admin/support/creators', { withCredentials: true });
      setCreators(res.data);
    } catch (err) {
      console.error("Failed to load creators", err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/admin/invoices', {
        creator_id: creatorId,
        month,
        year,
        total_amount: amount,
        withholding_tax: tax || 0
      }, { withCredentials: true });
      
      setShowCreateModal(false);
      setCreatorId(''); setAmount(''); setTax('');
      fetchInvoices();
    } catch (err) {
      alert('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/admin/invoices/auto', {
        month, year
      }, { withCredentials: true });
      
      alert(`Auto-generation complete: ${res.data.created} created, ${res.data.skipped} skipped (already existed).`);
      setShowAutoModal(false);
      fetchInvoices();
    } catch (err) {
      alert('Failed to auto-generate invoices');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/admin/invoices/${id}/status`, { status }, { withCredentials: true });
      fetchInvoices();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(`/api/admin/invoices/${id}`, { withCredentials: true });
      fetchInvoices();
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  const formatCurrency = (val: number | string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(val as string) || 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-gray-400 mt-1">Manage and generate creator invoices.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAutoModal(true)}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
          >
            <Zap className="h-4 w-4 mr-2 text-yellow-400" /> Auto-Generate
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,255,0.3)]"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-400" /> All Invoices
          </h2>
          <button onClick={fetchInvoices} className="text-gray-400 hover:text-white transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium text-right">Net Amount</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices found.</td></tr>
              ) : (
                invoices.map((i) => (
                  <tr key={i.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{i.invoice_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{i.user_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{i.user_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{i.month}/{i.year}</td>
                    <td className="px-6 py-4 font-medium text-white text-right">
                      {formatCurrency(i.net_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => updateStatus(i.id, i.status === 'PAID' ? 'UNPAID' : 'PAID')}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          i.status === 'PAID' 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        {i.status === 'PAID' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {i.status === 'PAID' ? 'Paid' : 'Unpaid'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={`${import.meta.env.VITE_API_URL || ''}/api/invoices/${i.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button 
                          onClick={() => deleteInvoice(i.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Manual Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-border rounded-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Create Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Creator</label>
                <select 
                  required 
                  value={creatorId} 
                  onChange={e => setCreatorId(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled className="bg-gray-900">Select a creator...</option>
                  {creators.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-900">{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Month (1-12)</label>
                  <input 
                    type="number" min="1" max="12" required
                    value={month} onChange={e => setMonth(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                  <input 
                    type="number" min="2020" required
                    value={year} onChange={e => setYear(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Earnings ($)</label>
                <input 
                  type="number" step="0.01" required
                  value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Withholding Tax ($) - Optional</label>
                <input 
                  type="number" step="0.01"
                  value={tax} onChange={e => setTax(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-white hover:bg-white/5 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium transition-colors disabled:opacity-50 flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto Generate Modal */}
      {showAutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-border rounded-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-yellow-500/10 to-transparent">
              <h3 className="text-lg font-semibold text-white flex items-center"><Zap className="h-5 w-5 mr-2 text-yellow-400" /> Auto-Generate</h3>
              <button onClick={() => setShowAutoModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-300">
                This will automatically scan all earnings for the specified month and year, and generate an invoice for each creator containing the sum of their earnings and taxes.
              </p>
              <form onSubmit={handleAutoGenerate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Month (1-12)</label>
                    <input 
                      type="number" min="1" max="12" required
                      value={month} onChange={e => setMonth(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                    <input 
                      type="number" min="2020" required
                      value={year} onChange={e => setYear(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowAutoModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-white hover:bg-white/5 font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 font-medium transition-colors disabled:opacity-50 flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Run Generator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
