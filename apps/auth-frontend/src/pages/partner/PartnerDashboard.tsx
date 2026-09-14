import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, DollarSign, Percent, Loader2, Search } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function PartnerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/partner/dashboard', { withCredentials: true });
      setStats(res.data.stats);
      setCreators(res.data.referred_creators);
    } catch (err) {
      console.error('Failed to fetch partner dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const filteredCreators = creators.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Partner Overview</h1>
          <p className="text-gray-400 mt-1">Track your referred creators and revenue.</p>
        </div>
        {stats?.partner_id && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <span className="text-sm text-gray-400">Your Invite Link:</span>
            <code className="text-primary text-sm bg-black/40 px-2 py-1 rounded select-all">
              {window.location.origin}/signup?ref={stats.partner_id}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${stats.partner_id}`);
                alert('Invite link copied!');
              }}
              className="text-xs bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Referred Creators"
          value={String(stats?.total_creators || 0)}
          icon={<UsersIcon className="h-24 w-24" />}
          subtitle="Active creators in the agency"
        />
        <StatCard
          title="Your Revenue Share"
          value={`${stats?.partner_percentage || 0}%`}
          icon={<Percent className="h-24 w-24" />}
          subtitle="Of agency net earnings"
        />
        <StatCard
          title="Total Partner Earnings"
          value={formatCurrency(stats?.partner_earnings || 0)}
          icon={<DollarSign className="h-24 w-24" />}
          subtitle="All-time earnings generated"
        />
      </div>

      <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold text-white">Referred Creators</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search creators..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-semibold">Creator</th>
                <th className="px-6 py-5 font-semibold">Total Net Revenue (Agency)</th>
                <th className="px-6 py-5 font-semibold text-right">Your Cut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCreators.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No creators found.</td></tr>
              ) : (
                filteredCreators.map((c) => {
                  const net = parseFloat(c.total_net_earnings) || 0;
                  const cut = (net * (stats?.partner_percentage || 0)) / 100;
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white text-base">{c.name}</div>
                        <div className="text-gray-400 mt-0.5">{c.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">
                        {formatCurrency(net)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-400">
                        {formatCurrency(cut)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
