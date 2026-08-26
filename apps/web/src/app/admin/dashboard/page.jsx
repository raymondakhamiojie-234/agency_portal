"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Award,
  AlertCircle,
  Activity,
  Calendar,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    total_creators: 0,
    total_partners: 0,
    total_earnings: 0,
    total_payouts: 0,
    active_contracts: 0,
    pending_advances: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
    fetchDashboardStats();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin-auth/me");
      if (!response.ok) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await response.json();
      setAdmin(data.admin);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      window.location.href = "/admin/login";
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch from existing admin stats endpoint
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav
        activePage="/admin/dashboard"
        adminName={admin?.full_name || admin?.username}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {admin?.full_name || admin?.username}!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your platform today
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Creators */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Users size={24} className="text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.total_creators}
            </h3>
            <p className="text-sm text-gray-400">Total Creators</p>
          </div>

          {/* Total Partners */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Award size={24} className="text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                Partners
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.total_partners}
            </h3>
            <p className="text-sm text-gray-400">Registered Partners</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-400" />
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                Revenue
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(stats.total_earnings)}
            </h3>
            <p className="text-sm text-gray-400">Total Platform Earnings</p>
          </div>

          {/* Total Payouts */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/10 p-3 rounded-lg">
                <TrendingUp size={24} className="text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                Payouts
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(stats.total_payouts)}
            </h3>
            <p className="text-sm text-gray-400">Distributed to Creators</p>
          </div>

          {/* Active Contracts */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-500/10 p-3 rounded-lg">
                <FileText size={24} className="text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                Signed
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.active_contracts}
            </h3>
            <p className="text-sm text-gray-400">Active Contracts</p>
          </div>

          {/* Pending Advances */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <Activity size={24} className="text-yellow-400" />
              </div>
              <a
                href="/admin/advance-payouts"
                className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded hover:bg-yellow-400/20 transition-all"
              >
                View All
              </a>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.pending_advances}
            </h3>
            <p className="text-sm text-gray-400">Advance Requests</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Links */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-purple-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/admin/creators"
                className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all text-center"
              >
                <Users size={24} className="text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">View Creators</p>
              </a>
              <a
                href="/admin/partners"
                className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all text-center"
              >
                <Award size={24} className="text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">View Partners</p>
              </a>
              <a
                href="/admin/earnings"
                className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all text-center"
              >
                <DollarSign size={24} className="text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">
                  Manage Earnings
                </p>
              </a>
              <a
                href="/admin/contracts"
                className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all text-center"
              >
                <FileText size={24} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">View Contracts</p>
              </a>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-purple-400" />
              System Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <span className="text-sm text-gray-400">Platform Status</span>
                <span className="text-sm font-semibold text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <span className="text-sm text-gray-400">Your Role</span>
                <span className="text-sm font-semibold text-purple-400">
                  {admin?.role || "Admin"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <span className="text-sm text-gray-400">Last Login</span>
                <span className="text-sm font-semibold text-gray-300">
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Activity size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Welcome to the Admin Panel
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                You have full control over the platform. Use the navigation menu
                to manage creators, partners, earnings, and contracts. Monitor
                all platform activities and make data-driven decisions.
              </p>
              <div className="flex gap-3">
                <a
                  href="/admin/creators"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  View Creators
                </a>
                <a
                  href="/admin/partners"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                >
                  View Partners
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
