import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, Clock, Plus, Search } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/admin/payments', { withCredentials: true });
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, curr: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payment Processing</h1>
          <p className="text-gray-400 mt-1">Manage and disburse creator payments.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" /> New Payment
        </button>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search creator or reference..." 
              className="bg-black/20 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-64"
            />
          </div>
          
          <div className="flex space-x-2">
            <select className="bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary">
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No payment history found.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{p.creator_name}</div>
                      <div className="text-xs text-gray-500">{p.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(p.payment_date)}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(p.amount, 'USD')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-300">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        {p.payment_method || 'Bank Transfer'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {p.reference_number || `PAY-${p.id}`}
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
