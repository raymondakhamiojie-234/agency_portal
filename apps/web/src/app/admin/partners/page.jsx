"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  Copy,
  CheckCircle,
  Award,
  LogOut,
  AlertCircle,
} from "lucide-react";

export default function AdminPartnerPerformancePage() {
  const [admin, setAdmin] = useState(null);
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    total_partners: 0,
    total_onboarded_creators: 0,
    total_earnings: 0,
    total_commissions: 0,
  });
  const [topPartners, setTopPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  // Filter states
  const [selectedPartner, setSelectedPartner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Check admin authentication first
    fetchAdminAuth();
  }, []);

  const fetchAdminAuth = async () => {
    try {
      const response = await fetch("/api/admin-auth/me");
      if (!response.ok) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await response.json();
      setAdmin(data.admin);
      // Now fetch partner performance data
      fetchPartnerPerformance();
    } catch (err) {
      console.error("Admin auth failed:", err);
      window.location.href = "/admin/login";
    }
  };

  useEffect(() => {
    // Refetch when filters change
    if (admin && admin.is_admin) {
      fetchPartnerPerformance();
    }
  }, [selectedPartner, startDate, endDate]);

  const fetchPartnerPerformance = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (selectedPartner) params.append("partnerId", selectedPartner);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const url = `/api/admin/partner-performance${params.toString() ? "?" + params.toString() : ""}`;
      console.log("Fetching partner performance:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch partner performance data",
        );
      }

      const data = await response.json();
      console.log("Partner performance data:", data);

      setPartners(data.partners || []);
      setStats(data.stats || stats);
      setTopPartners(data.topPartners || []);
    } catch (err) {
      console.error("Error fetching partner performance:", err);
      setError(err.message || "Failed to load partner performance data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSelectedPartner("");
    setStartDate("");
    setEndDate("");
  };

  const handleLogout = () => {
    window.location.href = "/account/logout";
  };

  if (loading || !admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading partner performance data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav
        activePage="/admin/partners"
        adminName={admin?.full_name || admin?.username}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-300">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid - Update to dark theme */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Total Partners
                </p>
                <p className="text-3xl font-bold text-white">
                  {stats.total_partners}
                </p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-xl">
                <Users size={28} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Onboarded Creators
                </p>
                <p className="text-3xl font-bold text-white">
                  {stats.total_onboarded_creators}
                </p>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-xl">
                <Users size={28} className="text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Total Creator Earnings
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(stats.total_earnings)}
                </p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-xl">
                <DollarSign size={28} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Total Partner Commissions
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(stats.total_commissions)}
                </p>
              </div>
              <div className="bg-orange-500/10 p-4 rounded-xl">
                <TrendingUp size={28} className="text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers - Update to dark theme */}
        {topPartners.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-yellow-500" />
              <h2 className="text-xl font-bold text-white">
                Top Performing Partners
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-500 text-white font-bold text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-yellow-700">
                      {partner.creators_count} creators
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-white mb-1">
                    {partner.name}
                  </p>
                  <p className="font-bold text-lg text-yellow-700">
                    {formatCurrency(partner.total_commission)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters - Update to dark theme */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-white">Filter Partners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Partner
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Partners</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Partners Table - Update to dark theme */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gray-900/30">
            <h2 className="text-xl font-bold text-white">All Partners</h2>
            <p className="text-sm text-gray-400 mt-1">
              Complete overview of partner performance and earnings
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Onboarded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Creator Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Avg Commission %
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Partner Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                {partners.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No partners found
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {partner.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {partner.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-300 font-mono border border-gray-600">
                            {partner.referral_code}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(partner.referral_link, partner.id)
                            }
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copied === partner.id ? (
                              <CheckCircle size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <Users size={12} className="mr-1" />
                          {partner.onboarded_creators_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(partner.total_creator_earnings)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-400">
                          {parseFloat(
                            partner.avg_contract_percentage || 0,
                          ).toFixed(1)}
                          %
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-400">
                          {formatCurrency(partner.total_partner_commission)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-400">
                          {formatDate(partner.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
