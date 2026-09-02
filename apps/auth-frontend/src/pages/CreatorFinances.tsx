import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Download, TrendingUp, AlertCircle } from 'lucide-react';

export default function CreatorFinances() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get('/api/earnings', { withCredentials: true });
      setEarnings(res.data);
    } catch (err) {
      console.error("Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, curr: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amount);
  };

  // Calculate totals
  const totalEarnings = earnings.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const pendingPayouts = earnings
    .filter(item => item.payment_status?.toLowerCase() === 'unpaid' || item.payment_status?.toLowerCase() === 'pending')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  
  // E.g. estimate 5% withholding tax or if the backend provides it
  const withholdingTax = earnings.reduce((sum, item) => sum + parseFloat(item.withholding_tax || 0), 0);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Hide this header when printing to PDF to keep it clean */}
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Financial Dashboard</h1>
          <p className="text-gray-400">Track your lifetime earnings, pending payouts, and financial history.</p>
        </div>
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-colors border border-border"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* PDF Only Header */}
      <div className="hidden print:flex items-center justify-between text-black mb-8 border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Financial Statement</h1>
          <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col items-end">
          <img src="/favicon.jpg" alt="Falcus Media" className="h-12 w-12 rounded-lg mb-2 object-cover" />
          <h2 className="text-lg font-bold text-black">Falcus Media Agency</h2>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden print:bg-white print:border-gray-300 print:text-black">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] print:hidden" />
          <div className="flex items-center mb-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center mr-3 print:bg-gray-100">
              <TrendingUp className="h-5 w-5 text-green-400 print:text-gray-800" />
            </div>
            <h2 className="text-sm font-medium text-gray-400 print:text-gray-600">Total Lifetime Earnings</h2>
          </div>
          <div className="text-3xl font-bold text-white relative z-10 print:text-black">
            {loading ? '...' : formatCurrency(totalEarnings)}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden print:bg-white print:border-gray-300 print:text-black">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] print:hidden" />
          <div className="flex items-center mb-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mr-3 print:bg-gray-100">
              <Clock className="h-5 w-5 text-yellow-400 print:text-gray-800" />
            </div>
            <h2 className="text-sm font-medium text-gray-400 print:text-gray-600">Pending Payouts</h2>
          </div>
          <div className="text-3xl font-bold text-white relative z-10 print:text-black">
            {loading ? '...' : formatCurrency(pendingPayouts)}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden print:bg-white print:border-gray-300 print:text-black">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] print:hidden" />
          <div className="flex items-center mb-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center mr-3 print:bg-gray-100">
              <AlertCircle className="h-5 w-5 text-red-400 print:text-gray-800" />
            </div>
            <h2 className="text-sm font-medium text-gray-400 print:text-gray-600">Withholding Tax</h2>
          </div>
          <div className="text-3xl font-bold text-white relative z-10 print:text-black">
            {loading ? '...' : formatCurrency(withholdingTax)}
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden print:border-none print:bg-transparent">
        <div className="px-6 py-5 border-b border-border print:border-gray-300">
          <h2 className="text-lg font-bold text-white print:text-black">Earnings History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left print:text-black">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border print:bg-gray-100 print:text-gray-600 print:border-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Tax Deducted</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border print:divide-gray-300">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : earnings.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No earnings history found.</td></tr>
              ) : (
                earnings.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors print:hover:bg-transparent">
                    <td className="px-6 py-4 text-gray-300 font-medium print:text-gray-800">{e.period}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-300 print:text-black">
                        {e.platform}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white print:text-black">{formatCurrency(e.amount, e.currency)}</td>
                    <td className="px-6 py-4 text-gray-400 print:text-gray-600">
                      {e.withholding_tax ? formatCurrency(e.withholding_tax, e.currency) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {e.status === 'VERIFIED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 print:text-black print:bg-transparent print:p-0">
                          <CheckCircle className="h-3 w-3 mr-1 print:hidden" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 print:text-black print:bg-transparent print:p-0">
                          <Clock className="h-3 w-3 mr-1 print:hidden" /> {e.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {e.payment_status === 'PAID' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 print:text-black print:bg-transparent print:p-0">
                          <CheckCircle className="h-3 w-3 mr-1 print:hidden" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 print:text-black print:bg-transparent print:p-0">
                          <Clock className="h-3 w-3 mr-1 print:hidden" /> Unpaid
                        </span>
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
