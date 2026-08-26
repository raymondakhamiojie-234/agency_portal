"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Percent,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  MessageCircle,
  Info,
} from "lucide-react";

export default function FinancePage() {
  const { data: user, loading: userLoading } = useUser();
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("earnings");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      fetchFinanceData();
    }
  }, [user, userLoading]);

  const fetchFinanceData = async () => {
    try {
      const response = await fetch("/api/finance");
      if (!response.ok) throw new Error("Failed to fetch finance data");
      const result = await response.json();
      setFinanceData(result.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load financial data");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: CheckCircle,
      },
      Pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: Clock,
      },
      "Loan Refunded": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: RefreshCw,
      },
      Completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        <span>{status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMonthName = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/finance" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
              Loading financial data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/finance" />
        <div className="max-w-[1240px] mx-auto px-6 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <p className="font-inter text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { totals, earnings, payouts, contract, remark } = financeData;
  const percentageChange = parseFloat(totals.percentageChange);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/finance" />

      <main
        className={`max-w-[1240px] mx-auto px-6 py-8 ${mounted ? "page-enter-active" : "page-enter"}`}
      >
        {/* Header */}
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Financial Overview
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Track your earnings, taxes, and payment history
          </p>
        </div>

        {/* Yearly Performance Section */}
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Yearly Earnings */}
            <div className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="font-inter text-xs font-medium opacity-90">
                  {new Date().getFullYear()}
                </span>
              </div>
              <h3 className="font-inter text-sm opacity-90 mb-1">
                Your Yearly Earnings
              </h3>
              <p className="font-plus-jakarta-sans font-bold text-3xl mb-1">
                ${parseFloat(totals.yearlyClientEarnings).toLocaleString()}
              </p>
              <p className="font-inter text-xs opacity-75">
                After {totals.revenueSharePercentage}% revenue share
              </p>
            </div>

            {/* Month Comparison */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
              <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
                Monthly Comparison
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                    {getMonthName(-1)}
                  </span>
                  <span className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                    $
                    {parseFloat(
                      totals.previousMonthClientEarnings,
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                    {getMonthName(0)}
                  </span>
                  <span className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                    $
                    {parseFloat(
                      totals.currentMonthClientEarnings,
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs font-medium text-[#525252] dark:text-white dark:text-opacity-70">
                      Change
                    </span>
                    <div className="flex items-center space-x-1">
                      {percentageChange > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : percentageChange < 0 ? (
                        <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                      <span
                        className={`font-plus-jakarta-sans font-bold text-sm ${
                          percentageChange > 0
                            ? "text-green-600 dark:text-green-400"
                            : percentageChange < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-[#525252] dark:text-white dark:text-opacity-70"
                        }`}
                      >
                        {percentageChange > 0 ? "+" : ""}
                        {percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Remark */}
            <div
              className={`rounded-xl p-6 border ${
                remark.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : remark.type === "warning"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                {remark.type === "success" ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : remark.type === "warning" ? (
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-plus-jakarta-sans font-semibold text-sm mb-2 ${
                      remark.type === "success"
                        ? "text-green-900 dark:text-green-300"
                        : remark.type === "warning"
                          ? "text-red-900 dark:text-red-300"
                          : "text-blue-900 dark:text-blue-300"
                    }`}
                  >
                    Performance Update
                  </h3>
                  <p
                    className={`font-inter text-sm mb-3 ${
                      remark.type === "success"
                        ? "text-green-800 dark:text-green-400"
                        : remark.type === "warning"
                          ? "text-red-800 dark:text-red-400"
                          : "text-blue-800 dark:text-blue-400"
                    }`}
                  >
                    {remark.message}
                  </p>
                  {remark.shouldContactSupport && (
                    <a
                      href="/portal/support"
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-inter text-xs font-medium transition-all duration-200 ${
                        remark.type === "warning"
                          ? "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600"
                          : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                      }`}
                    >
                      <MessageCircle size={14} />
                      <span>Contact Support</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Your Earnings */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
              Your Earnings
            </h3>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              ${parseFloat(totals.clientEarnings).toLocaleString()}
            </p>
            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50 mt-1">
              After revenue share
            </p>
          </div>

          {/* Withholding Tax */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
              Withholding Tax
            </h3>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              ${parseFloat(totals.totalWithholdingTax).toLocaleString()}
            </p>
          </div>

          {/* Agency Share */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Percent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
              Agency Share
            </h3>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              ${parseFloat(totals.agencyShare).toLocaleString()}
            </p>
            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50 mt-1">
              {totals.revenueSharePercentage}% of net
            </p>
          </div>

          {/* Revenue Share Rate */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
              Your Share Rate
            </h3>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              {totals.clientPercentage}%
            </p>
            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50 mt-1">
              Of net earnings
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex space-x-2 mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-6 py-3 rounded-lg font-inter font-medium text-sm transition-all duration-200 ${
              activeTab === "earnings"
                ? "bg-[#726BFF] dark:bg-[#6366FF] text-white shadow-md"
                : "bg-gray-100 dark:bg-[#1E1E1E] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
            }`}
          >
            Earnings History
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-6 py-3 rounded-lg font-inter font-medium text-sm transition-all duration-200 ${
              activeTab === "payouts"
                ? "bg-[#726BFF] dark:bg-[#6366FF] text-white shadow-md"
                : "bg-gray-100 dark:bg-[#1E1E1E] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
            }`}
          >
            Payment History
          </button>
        </div>

        {/* Earnings History Tab */}
        {activeTab === "earnings" && (
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
                Earnings History
              </h2>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mt-1">
                All recorded earnings across platforms
              </p>
            </div>

            {earnings && earnings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#0A0A0A]">
                    <tr>
                      <th className="px-6 py-4 text-left font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-4 text-right font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Tax
                      </th>
                      <th className="px-6 py-4 text-center font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {earnings.map((earning, index) => (
                      <tr
                        key={earning.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors duration-150 animate-slide-in-left"
                        style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-[#525252] dark:text-white dark:text-opacity-70" />
                            <span className="font-inter text-sm text-[#111111] dark:text-white">
                              {formatDate(earning.earning_date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-inter text-sm font-medium text-[#111111] dark:text-white">
                            {earning.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-plus-jakarta-sans font-semibold text-sm text-green-600 dark:text-green-400">
                            ${parseFloat(earning.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-inter text-sm text-orange-600 dark:text-orange-400">
                            -$
                            {parseFloat(
                              earning.withholding_tax || 0,
                            ).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(earning.payout_status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                  No earnings recorded yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "payouts" && (
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
                Payment History
              </h2>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mt-1">
                All completed and pending payouts
              </p>
            </div>

            {payouts && payouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#0A0A0A]">
                    <tr>
                      <th className="px-6 py-4 text-left font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Payout Date
                      </th>
                      <th className="px-6 py-4 text-right font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-70 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {payouts.map((payout, index) => (
                      <tr
                        key={payout.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors duration-150 animate-slide-in-left"
                        style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-[#525252] dark:text-white dark:text-opacity-70" />
                            <span className="font-inter text-sm text-[#111111] dark:text-white">
                              {formatDate(payout.payout_date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-plus-jakarta-sans font-bold text-sm text-[#111111] dark:text-white">
                            ${parseFloat(payout.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(payout.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                            {payout.notes || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Wallet className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                  No payouts recorded yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Summary Footer */}
        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-inter font-semibold text-green-900 dark:text-green-300">
                Total Paid Out
              </h3>
            </div>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-green-900 dark:text-green-200">
              ${parseFloat(totals.totalPaid).toLocaleString()}
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-inter font-semibold text-yellow-900 dark:text-yellow-300">
                Pending Earnings
              </h3>
            </div>
            <p className="font-plus-jakarta-sans font-bold text-2xl text-yellow-900 dark:text-yellow-200">
              ${parseFloat(totals.totalPending).toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-inter font-semibold text-purple-900 dark:text-purple-300">
                Contract Terms
              </h3>
            </div>
            <p className="font-inter text-sm text-purple-800 dark:text-purple-300">
              {contract?.revenue_share_percentage
                ? `${contract.revenue_share_percentage}% revenue share for ${contract.duration_years} ${contract.duration_years === 1 ? "year" : "years"}`
                : "No contract signed yet"}
            </p>
          </div>
        </div>

        {/* Animation Styles */}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-slide-in-left {
            opacity: 0;
            animation: slideInLeft 0.5s ease-out forwards;
          }

          .page-enter {
            opacity: 0;
          }

          .page-enter-active {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }
        `}</style>
      </main>
    </div>
  );
}
