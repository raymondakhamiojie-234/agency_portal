import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { UploadCloud, CheckCircle, AlertCircle, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminEarnings() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Modal State
  const [creators, setCreators] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', creator_id: '', platform: 'Instagram', amount: '', withholding_tax: '', earning_date: '', payout_status: 'UNPAID' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEarnings();
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await axios.get('/api/admin/support/creators', { withCredentials: true });
      setCreators(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await axios.get('/api/admin/earnings', { withCredentials: true });
      setEarnings(res.data);
    } catch (err) {
      console.error("Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const processCsv = () => {
    if (!csvFile) return;
    setImporting(true);
    setImportResult(null);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Send raw parsed records to backend for validation and insertion
          const res = await axios.post('/api/admin/earnings/import', {
            records: results.data
          }, { withCredentials: true });
          
          setImportResult(res.data);
          fetchEarnings(); // Refresh table
        } catch (err: any) {
          console.error("Import failed", err);
          setImportResult({ error: err.response?.data?.error || 'Import failed' });
        } finally {
          setImporting(false);
          setCsvFile(null); // Reset file
        }
      },
      error: (error) => {
        setImportResult({ error: error.message });
        setImporting(false);
      }
    });
  };

  const formatCurrency = (amount: number, curr: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amount);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/api/admin/earnings/${id}`, { withCredentials: true });
      fetchEarnings();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: '', creator_id: creators[0]?.id || '', platform: 'Instagram', amount: '', withholding_tax: '', earning_date: new Date().toISOString().split('T')[0], payout_status: 'UNPAID' });
    setShowModal(true);
  };

  const openEditModal = (record: any) => {
    setIsEditing(true);
    setFormData({
      id: record.id,
      creator_id: record.creator_id,
      platform: record.platform,
      amount: record.amount,
      withholding_tax: record.withholding_tax || '',
      earning_date: record.earning_date ? new Date(record.earning_date).toISOString().split('T')[0] : '',
      payout_status: record.payment_status === 'PAID' ? 'PAID' : 'UNPAID'
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await axios.put(`/api/admin/earnings/${formData.id}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/admin/earnings', formData, { withCredentials: true });
      }
      setShowModal(false);
      fetchEarnings();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Earnings Management</h1>
        <p className="text-gray-400 mt-1">Manage and import creator earnings data.</p>
      </div>

      {/* CSV Uploader */}
      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Bulk Import CSV</h2>
        
        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <UploadCloud className="h-10 w-10 text-primary mb-3" />
          <p className="text-sm text-gray-300 mb-1">Drag and drop your CSV file here, or click to browse</p>
          <p className="text-xs text-gray-500 mb-4">Headers required: email, platform, period, amount, currency, status</p>
          
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="csv-upload" 
          />
          <label 
            htmlFor="csv-upload" 
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium"
          >
            {csvFile ? csvFile.name : 'Select File'}
          </label>
        </div>

        {csvFile && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={processCsv}
              disabled={importing}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
            >
              {importing ? 'Processing...' : 'Start Import'}
            </button>
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className={`mt-4 p-4 rounded-xl border ${importResult.error ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
            {importResult.error ? (
              <div className="flex items-center"><AlertCircle className="h-5 w-5 mr-2" /> {importResult.error}</div>
            ) : (
              <div>
                <div className="flex items-center mb-2 text-white font-medium">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" /> Import Complete
                </div>
                <div className="text-sm">
                  Successfully imported <span className="font-bold text-white">{importResult.imported}</span> records.
                  {importResult.failed > 0 && (
                    <span className="text-red-400 ml-2">({importResult.failed} failed)</span>
                  )}
                </div>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-2 text-xs text-red-400 max-h-32 overflow-y-auto bg-black/40 p-2 rounded">
                    {importResult.errors.map((e: any, i: number) => (
                      <div key={i}>{e.email || 'Row'}: {e.error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Earnings Table */}
      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">All Earnings Records</h2>
          <button onClick={openAddModal} className="flex items-center text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4 mr-2" /> Add Record
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : earnings.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No earnings records found.</td></tr>
              ) : (
                earnings.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{e.creator_name}</div>
                      <div className="text-xs text-gray-500">{e.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{e.platform}</td>
                    <td className="px-6 py-4 text-gray-300">{e.period}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(e.amount, e.currency)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        e.status === 'VERIFIED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        e.payment_status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {e.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(e)} className="text-gray-400 hover:text-white transition-colors p-1">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Earning Record' : 'Add Earning Record'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Creator</label>
                  <select 
                    required 
                    value={formData.creator_id} 
                    onChange={e => setFormData({...formData, creator_id: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="" disabled>Select a creator</option>
                    {creators.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                <input 
                  type="text" 
                  required 
                  value={formData.platform} 
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Instagram, TikTok"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tax Deducted</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.withholding_tax} 
                    onChange={e => setFormData({...formData, withholding_tax: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Earning Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.earning_date} 
                    onChange={e => setFormData({...formData, earning_date: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payout Status</label>
                  <select 
                    value={formData.payout_status} 
                    onChange={e => setFormData({...formData, payout_status: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
