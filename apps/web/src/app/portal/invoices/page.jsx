"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  Search,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Receipt,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmt(n) {
  return parseFloat(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function periodLabel(month, year) {
  return `${MONTHS[month] || month} ${year}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CreatorInvoicesPage() {
  const { data: user, loading: userLoading } = useUser();

  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    count: 0,
    totalGross: 0,
    totalNet: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Filters
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Download state
  const [downloading, setDownloading] = useState({});
  const [downloadMsg, setDownloadMsg] = useState({});

  // Expanded breakdown
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
    if (!userLoading && user) {
      fetchInvoices();
    }
  }, [user, userLoading, filterMonth, filterYear]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterMonth) params.set("month", filterMonth);
      if (filterYear) params.set("year", filterYear);

      const res = await fetch(`/api/creator/invoices?${params}`);
      if (!res.ok) throw new Error("Failed to load invoices");

      const data = await res.json();
      setInvoices(data.invoices || []);
      setSummary(data.summary || { count: 0, totalGross: 0, totalNet: 0 });
    } catch (err) {
      console.error(err);
      setError("Failed to load your invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice) => {
    setDownloading((p) => ({ ...p, [invoice.id]: true }));
    setDownloadMsg((p) => ({ ...p, [invoice.id]: null }));
    try {
      const res = await fetch(`/api/creator/invoices/${invoice.id}/download`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadMsg((p) => ({
        ...p,
        [invoice.id]: { type: "success", text: "Downloaded!" },
      }));
    } catch (err) {
      console.error(err);
      setDownloadMsg((p) => ({
        ...p,
        [invoice.id]: { type: "error", text: "Download failed. Try again." },
      }));
    } finally {
      setDownloading((p) => ({ ...p, [invoice.id]: false }));
      setTimeout(
        () => setDownloadMsg((p) => ({ ...p, [invoice.id]: null })),
        4000,
      );
    }
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const yearOptions = Array.from(
    { length: 5 },
    (_, k) => new Date().getFullYear() - k,
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (userLoading || (loading && invoices.length === 0)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/invoices" />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
              Loading your invoices…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/invoices" />

      <main
        className={`max-w-[1240px] mx-auto px-4 sm:px-6 py-8 ${mounted ? "page-enter-active" : "page-enter"}`}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <h1 className="font-plus-jakarta-sans font-bold text-2xl sm:text-3xl text-[#111111] dark:text-white mb-2">
            My Invoices
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            View and download your earnings invoices
          </p>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {[
            {
              label: "Total Invoices",
              value: summary.count,
              icon: FileText,
              iconBg: "bg-purple-100 dark:bg-purple-900/30",
              iconColor: "text-purple-600 dark:text-purple-400",
              isNumber: true,
            },
            {
              label: "Gross Earnings",
              value: `$${fmt(summary.totalGross)}`,
              icon: DollarSign,
              iconBg: "bg-green-100 dark:bg-green-900/30",
              iconColor: "text-green-600 dark:text-green-400",
              isNumber: false,
            },
            {
              label: "Net Payable",
              value: `$${fmt(summary.totalNet)}`,
              icon: Receipt,
              iconBg: "bg-blue-100 dark:bg-blue-900/30",
              iconColor: "text-blue-600 dark:text-blue-400",
              isNumber: false,
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              </div>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
                {label}
              </p>
              <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div
          className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-[#525252] dark:text-white dark:text-opacity-70">
              <Search size={16} />
              <span className="font-inter text-sm font-medium">Filter:</span>
            </div>

            {/* Month filter */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF]"
            >
              <option value="">All Months</option>
              {MONTHS.slice(1).map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            {/* Year filter */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF]"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Clear */}
            {(filterMonth || filterYear) && (
              <button
                onClick={() => {
                  setFilterMonth("");
                  setFilterYear("");
                }}
                className="px-3 py-2 font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
              >
                Clear filters
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={fetchInvoices}
              disabled={loading}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 font-inter text-sm text-[#726BFF] dark:text-[#6366FF] border border-[#726BFF] dark:border-[#6366FF] rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle
              className="text-red-600 dark:text-red-400 flex-shrink-0"
              size={18}
            />
            <p className="font-inter text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* ── Invoices List ─────────────────────────────────────────────────── */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {invoices.length === 0 && !loading ? (
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-2">
                No invoices yet
              </h3>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 text-sm">
                Invoices are automatically generated and emailed when your
                earnings are uploaded.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv, idx) => {
                const isExpanded = expanded[inv.id];
                const breakdown = Array.isArray(inv.earnings_breakdown)
                  ? inv.earnings_breakdown
                  : [];

                return (
                  <div
                    key={inv.id}
                    className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${0.25 + idx * 0.04}s` }}
                  >
                    {/* Main row */}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Invoice icon + number */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-inter text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded inline-block mb-1">
                              {inv.invoice_number}
                            </p>
                            <p className="font-plus-jakarta-sans font-semibold text-[#111111] dark:text-white text-sm">
                              {periodLabel(inv.month, inv.year)}
                            </p>
                            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50">
                              Generated{" "}
                              {new Date(inv.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Amounts */}
                        <div className="flex gap-6 sm:gap-8">
                          <div className="text-center sm:text-right">
                            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50 mb-0.5">
                              Gross
                            </p>
                            <p className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                              ${fmt(inv.total_amount)}
                            </p>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50 mb-0.5">
                              Net
                            </p>
                            <p className="font-plus-jakarta-sans font-bold text-sm text-[#726BFF] dark:text-[#6366FF]">
                              ${fmt(inv.net_amount)}
                            </p>
                          </div>
                        </div>

                        {/* Email status badge */}
                        <div className="flex items-center gap-2">
                          {inv.email_sent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              <CheckCircle size={11} /> Emailed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                              <Clock size={11} /> Pending
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Breakdown toggle */}
                          {breakdown.length > 0 && (
                            <button
                              onClick={() => toggleExpand(inv.id)}
                              className="flex items-center gap-1 px-3 py-2 font-inter text-xs font-medium text-[#525252] dark:text-white dark:text-opacity-70 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                            >
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                              {isExpanded ? "Hide" : "Details"}
                            </button>
                          )}

                          {/* Download PDF */}
                          <button
                            onClick={() => handleDownload(inv)}
                            disabled={downloading[inv.id]}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-inter text-xs font-semibold rounded-lg hover:bg-[#5b57e8] dark:hover:bg-[#4f46e5] disabled:opacity-50 transition-colors"
                          >
                            {downloading[inv.id] ? (
                              <RefreshCw size={13} className="animate-spin" />
                            ) : (
                              <Download size={13} />
                            )}
                            PDF
                          </button>
                        </div>
                      </div>

                      {/* Download message */}
                      {downloadMsg[inv.id] && (
                        <p
                          className={`font-inter text-xs mt-2 ${downloadMsg[inv.id].type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                        >
                          {downloadMsg[inv.id].text}
                        </p>
                      )}
                    </div>

                    {/* ── Expanded Breakdown ──────────────────────────────────── */}
                    {isExpanded && breakdown.length > 0 && (
                      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] px-4 sm:px-5 py-4">
                        <p className="font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-50 uppercase tracking-wide mb-3">
                          Earnings Breakdown —{" "}
                          {periodLabel(inv.month, inv.year)}
                        </p>

                        {/* Mobile cards */}
                        <div className="sm:hidden space-y-2">
                          {breakdown.map((e, i) => (
                            <div
                              key={i}
                              className="bg-white dark:bg-[#1E1E1E] rounded-lg p-3 border border-gray-100 dark:border-gray-800"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-inter text-sm font-medium text-[#111111] dark:text-white">
                                  {e.platform || "—"}
                                </span>
                                <span className="font-plus-jakarta-sans font-bold text-sm text-green-600 dark:text-green-400">
                                  ${fmt(e.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50">
                                  {e.earning_date || "—"}
                                </span>
                                <span className="font-inter text-xs text-red-500 dark:text-red-400">
                                  Tax: -${fmt(e.withholding_tax)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                {[
                                  "Date",
                                  "Platform",
                                  "Amount",
                                  "Withholding Tax",
                                  "Net",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="pb-2 font-inter text-xs font-semibold text-[#525252] dark:text-white dark:text-opacity-50 uppercase tracking-wide"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {breakdown.map((e, i) => {
                                const net =
                                  parseFloat(e.amount || 0) -
                                  parseFloat(e.withholding_tax || 0);
                                return (
                                  <tr key={i}>
                                    <td className="py-2 font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 whitespace-nowrap">
                                      {e.earning_date || "—"}
                                    </td>
                                    <td className="py-2 font-inter text-sm text-[#111111] dark:text-white">
                                      {e.platform || "—"}
                                    </td>
                                    <td className="py-2 font-plus-jakarta-sans font-semibold text-sm text-green-600 dark:text-green-400">
                                      ${fmt(e.amount)}
                                    </td>
                                    <td className="py-2 font-inter text-sm text-red-500 dark:text-red-400">
                                      -${fmt(e.withholding_tax)}
                                    </td>
                                    <td className="py-2 font-plus-jakarta-sans font-bold text-sm text-[#726BFF] dark:text-[#6366FF]">
                                      ${fmt(net)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Totals row */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-end gap-4 sm:gap-8">
                          <div className="flex justify-between sm:gap-2 sm:flex-col sm:text-right">
                            <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50">
                              Gross Earnings
                            </span>
                            <span className="font-plus-jakarta-sans font-semibold text-sm text-green-600 dark:text-green-400">
                              ${fmt(inv.total_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between sm:gap-2 sm:flex-col sm:text-right">
                            <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50">
                              Withholding Tax
                            </span>
                            <span className="font-plus-jakarta-sans font-semibold text-sm text-red-500 dark:text-red-400">
                              -${fmt(inv.withholding_tax)}
                            </span>
                          </div>
                          <div className="flex justify-between sm:gap-2 sm:flex-col sm:text-right">
                            <span className="font-inter text-xs font-semibold text-[#111111] dark:text-white">
                              Net Payable
                            </span>
                            <span className="font-plus-jakarta-sans font-bold text-base text-[#726BFF] dark:text-[#6366FF]">
                              ${fmt(inv.net_amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Info Banner ───────────────────────────────────────────────────── */}
        {invoices.length > 0 && (
          <div
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <AlertCircle
              className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="font-inter text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                About Your Invoices
              </p>
              <p className="font-inter text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Invoices are automatically generated and emailed to you each
                time your earnings are updated. Payments are typically processed
                between the <strong>25th–30th</strong> of each month. Questions?
                Contact us at{" "}
                <a
                  href="mailto:support@falcusmediaagency.com"
                  className="underline font-medium"
                >
                  support@falcusmediaagency.com
                </a>
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.55s ease-out forwards;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        .page-enter { opacity: 0; }
        .page-enter-active { opacity: 1; transition: opacity 0.3s ease-in; }
      `}</style>
    </div>
  );
}
