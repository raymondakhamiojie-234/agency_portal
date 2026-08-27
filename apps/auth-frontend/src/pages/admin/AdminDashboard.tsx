import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Wallet, CreditCard, Landmark, TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCreators: 0,
    totalActiveLoans: 0,
    totalPayments: 0,
    platformEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (loading) {
    return <div className="text-gray-400">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Overview</h1>
        <p className="text-gray-400 mt-1">Global statistics and performance metrics for Falcus Media.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Creators" 
          value={stats.totalCreators.toString()} 
          icon={<Users className="h-6 w-6 text-primary" />} 
        />
        <StatCard 
          title="Platform Earnings" 
          value={formatCurrency(stats.platformEarnings)} 
          icon={<Wallet className="h-6 w-6 text-green-400" />} 
        />
        <StatCard 
          title="Active Loans" 
          value={formatCurrency(stats.totalActiveLoans)} 
          icon={<Landmark className="h-6 w-6 text-yellow-400" />} 
        />
        <StatCard 
          title="Total Disbursed" 
          value={formatCurrency(stats.totalPayments)} 
          icon={<CreditCard className="h-6 w-6 text-blue-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-lg font-semibold text-white mb-6">Revenue Growth (Simulated)</h2>
          
          <div className="flex-1 flex items-end justify-between space-x-2 pt-10">
            {/* CSS Bar Chart Simulation */}
            {[40, 60, 45, 80, 65, 95, 110, 85, 120, 140, 100, 160].map((val, i) => (
              <div key={i} className="w-full bg-primary/20 hover:bg-primary/50 transition-colors rounded-t-sm relative group" style={{ height: `${(val / 160) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded shadow text-center">
                  +{val}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" /> Top Performing Platforms
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">YouTube</span>
                <span className="text-gray-400">45%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">TikTok</span>
                <span className="text-gray-400">30%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">Facebook</span>
                <span className="text-gray-400">15%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">Instagram</span>
                <span className="text-gray-400">10%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
