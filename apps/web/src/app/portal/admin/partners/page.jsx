"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import {
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  Copy,
  CheckCircle,
  Calendar,
  Percent,
  Award,
} from "lucide-react";

export default function PartnerPerformancePage() {
  const { data: user, loading: userLoading } = useUser();
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
    if (!userLoading && user && !user.is_admin) {
      window.location.href = "/portal/dashboard";
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (user && user.is_admin) {
      fetchPartnerPerformance();
    }
  }, [user, selectedPartner, startDate, endDate]);

  const fetchPartnerPerformance = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (selectedPartner) params.append("partnerId", selectedPartner);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `/api/admin/partner-performance?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch partner performance data");
      }

      const data = await response.json();
      setPartners(data.partners || []);
      setStats(data.stats || stats);
      setTopPartners(data.topPartners || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load partner performance data");
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

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-[#525252] dark:text-white dark:text-opacity-70 font-medium">
            Loading partner performance data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/admin/partners" />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Partner Performance & Earnings
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Monitor all partners, their onboarded creators, and commission
            earnings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
            <p className="font-inter text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <p className="font-inter text-sm text-blue-700 dark:text-blue-300 mb-1">
              Total Partners
            </p>
            <p className="font-plus-jakarta-sans font-bold text-3xl text-blue-900 dark:text-blue-100">
              {stats.total_partners}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-600 dark:bg-purple-500 p-3 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <p className="font-inter text-sm text-purple-700 dark:text-purple-300 mb-1">
              Onboarded Creators
            </p>
            <p className="font-plus-jakarta-sans font-bold text-3xl text-purple-900 dark:text-purple-100">
              {stats.total_onboarded_creators}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-600 dark:bg-green-500 p-3 rounded-lg">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
            <p className="font-inter text-sm text-green-700 dark:text-green-300 mb-1">
              Total Creator Earnings
            </p>
            <p className="font-plus-jakarta-sans font-bold text-3xl text-green-900 dark:text-green-100">
              {formatCurrency(stats.total_earnings)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-600 dark:bg-orange-500 p-3 rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
            <p className="font-inter text-sm text-orange-700 dark:text-orange-300 mb-1">
              Total Partner Commissions
            </p>
            <p className="font-plus-jakarta-sans font-bold text-3xl text-orange-900 dark:text-orange-100">
              {formatCurrency(stats.total_commissions)}
            </p>
          </div>
        </div>

        {/* Top Performers */}
        {topPartners.length > 0 && (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-yellow-500" />
              <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
                Top Performing Partners
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-500 text-white font-bold text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span className="font-inter text-xs text-yellow-700 dark:text-yellow-300">
                      {partner.creators_count} creators
                    </span>
                  </div>
                  <p className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-1">
                    {partner.name}
                  </p>
                  <p className="font-plus-jakarta-sans font-bold text-lg text-yellow-700 dark:text-yellow-300">
                    {formatCurrency(partner.total_commission)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-[#726BFF] dark:text-[#6366FF]" />
            <h2 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
              Filter Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Partner
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
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
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
              />
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111111] dark:text-white font-inter text-sm rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Partners Table */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
              All Partners
            </h2>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mt-1">
              Complete overview of partner performance and earnings
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Onboarded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Creator Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Avg Commission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Partner Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1E1E1E] divide-y divide-gray-200 dark:divide-gray-800">
                {partners.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No partners found
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-inter font-semibold text-sm text-[#111111] dark:text-white">
                            {partner.name}
                          </div>
                          <div className="font-inter text-xs text-gray-500 dark:text-gray-400">
                            {partner.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-[#111111] dark:text-white">
                            {partner.referral_code}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(partner.referral_link, partner.id)
                            }
                            className="text-[#726BFF] dark:text-[#6366FF] hover:text-[#5651D6] dark:hover:text-[#5856FF] transition-colors"
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          <Users size={12} className="mr-1" />
                          {partner.onboarded_creators_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-inter font-semibold text-sm text-[#111111] dark:text-white">
                          {formatCurrency(partner.total_creator_earnings)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-inter font-semibold text-sm text-blue-600 dark:text-blue-400">
                          {parseFloat(
                            partner.avg_contract_percentage || 0,
                          ).toFixed(1)}
                          %
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-inter font-bold text-sm text-green-600 dark:text-green-400">
                          {formatCurrency(partner.total_partner_commission)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-inter text-xs text-gray-600 dark:text-gray-400">
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
