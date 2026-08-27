import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminLoans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get('/api/admin/loans', { withCredentials: true });
      setLoans(res.data);
    } catch (err) {
      console.error("Failed to load loans", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, curr: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: curr }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUpdateStatus = async (id: string, status: string, requestedAmount: number) => {
    setProcessing(id);
    try {
      await axios.put(`/api/admin/loans/${id}/status`, { 
        status, 
        approved_amount: requestedAmount 
      }, { withCredentials: true });
      fetchLoans();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Loan Management</h1>
        <p className="text-gray-400 mt-1">Review and approve creator loan requests.</p>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-white">All Loan Applications</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Requested</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No loans found.</td></tr>
              ) : (
                loans.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{l.creator_name}</div>
                      <div className="text-xs text-gray-500">{l.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(l.request_date)}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(l.requested_amount)}</td>
                    <td className="px-6 py-4 text-gray-300">{formatCurrency(l.remaining_balance)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        l.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 
                        l.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                        l.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {l.status === 'PENDING' ? (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleUpdateStatus(l.id, 'REJECTED', l.requested_amount)}
                            disabled={processing === l.id}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(l.id, 'ACTIVE', l.requested_amount)}
                            disabled={processing === l.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">Processed</span>
                      )}
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
