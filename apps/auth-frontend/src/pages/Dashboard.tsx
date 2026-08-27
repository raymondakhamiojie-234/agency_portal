import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Wallet, TrendingUp, CreditCard, Landmark, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import AdminDashboard from './admin/AdminDashboard';

export default function Dashboard() {
  const { user, role } = useOutletContext<{ user: any, role: string }>();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === 'CREATOR') {
      fetchCreatorStats();
    } else if (role === 'ADMIN') {
      setLoading(false);
    }
  }, [role]);

  const fetchCreatorStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/creator', { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (loading || !stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Creator Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back. Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value={formatCurrency(stats.totalEarnings)} 
          icon={<TrendingUp className="h-6 w-6 text-primary" />} 
          trend="+12%"
        />
        <StatCard 
          title="Unpaid Balance" 
          value={formatCurrency(stats.currentEarnings)} 
          icon={<Wallet className="h-6 w-6 text-green-400" />} 
        />
        <StatCard 
          title="Outstanding Loan" 
          value={formatCurrency(stats.outstandingLoan)} 
          icon={<Landmark className="h-6 w-6 text-yellow-400" />} 
        />
        <StatCard 
          title="Available Advance" 
          value={formatCurrency(stats.availableLoan)} 
          icon={<CreditCard className="h-6 w-6 text-blue-400" />} 
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 h-96 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="flex items-start p-4 bg-white/[0.02] border border-border rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Payment Completed</p>
                <p className="text-xs text-gray-400 mt-1">A payout has been successfully sent to your bank account.</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">Recently</span>
            </div>
            
            <div className="flex items-start p-4 bg-white/[0.02] border border-border rounded-xl">
              <Clock className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">New Earnings Verified</p>
                <p className="text-xs text-gray-400 mt-1">Your recent earnings have been verified by Falcus Media.</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">Recently</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-border transition-colors group flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">Request Loan Advance</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-border transition-colors group flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">Update Bank Details</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-border transition-colors group flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">View Active Contracts</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
