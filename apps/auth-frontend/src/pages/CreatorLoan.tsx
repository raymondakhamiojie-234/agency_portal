import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Info } from 'lucide-react';

export default function CreatorLoan() {
  const [eligibility, setEligibility] = useState({
    totalEarnings: 0,
    outstandingLoan: 0,
    availableLoan: 0
  });
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Application State
  const [amount, setAmount] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eligibilityRes, loansRes] = await Promise.all([
        axios.get('/api/loans/eligibility', { withCredentials: true }),
        axios.get('/api/loans', { withCredentials: true })
      ]);
      setEligibility(eligibilityRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      console.error("Failed to load loan data", err);
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

  const interestRate = 0.15; // 15%
  const requestedAmount = typeof amount === 'number' ? amount : 0;
  const calculatedInterest = requestedAmount * interestRate;
  const totalRepayment = requestedAmount + calculatedInterest;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    setSubmitting(true);
    setError(null);
    try {
      await axios.post('/api/loans/apply', { amount }, { withCredentials: true });
      setAmount('');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Loan Application</h1>
        <p className="text-gray-400 mt-1">Request an advance on your eligible verified earnings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Application Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-xl font-semibold text-white mb-6">Apply for an Advance</h2>
            
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Requested Amount (NGN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || '')}
                    max={eligibility.availableLoan}
                    className="w-full bg-black/20 border border-border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum available: <span className="font-semibold text-primary">{formatCurrency(eligibility.availableLoan)}</span>
                </p>
              </div>

              {/* Loan Terms Preview */}
              <div className="bg-white/[0.02] border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" /> Loan Terms Preview
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Principal Amount:</span>
                    <span className="text-white font-medium">{formatCurrency(requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Platform Interest (15%):</span>
                    <span className="text-yellow-400 font-medium">{formatCurrency(calculatedInterest)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
                    <span className="font-medium text-white">Total Repayment:</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(totalRepayment)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || requestedAmount <= 0 || requestedAmount > eligibility.availableLoan}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,255,0.3)] disabled:opacity-50 disabled:shadow-none flex justify-center items-center"
              >
                {submitting ? 'Submitting Application...' : 'Submit Loan Application'}
              </button>
            </form>
          </div>
        </div>

        {/* Eligibility Status Sidebar */}
        <div className="space-y-6">
          <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Eligibility</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Total Verified Earnings</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(eligibility.totalEarnings)}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-gray-400">Active Outstanding Loans</p>
                <p className="text-xl font-medium text-yellow-400">{formatCurrency(eligibility.outstandingLoan)}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-gray-400">Max Loan Limit (50% of Earnings)</p>
                <p className="text-xl font-medium text-green-400">{formatCurrency(eligibility.totalEarnings * 0.5)}</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
              <p className="text-xs text-primary font-medium leading-relaxed">
                You are eligible to request an advance of up to 50% of your total verified platform earnings, minus any currently outstanding loans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-white">Loan History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Requested</th>
                <th className="px-6 py-4 font-medium">Interest</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No loan history found.</td></tr>
              ) : (
                loans.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-gray-300">{formatDate(l.request_date)}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(l.requested_amount)}</td>
                    <td className="px-6 py-4 text-yellow-400">{formatCurrency(l.interest)}</td>
                    <td className="px-6 py-4 text-white font-medium">{formatCurrency(l.remaining_balance)}</td>
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
