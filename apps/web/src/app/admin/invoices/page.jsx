"use client";

import { useState, useEffect, useCallback } from "react";
import AdminNav from "@/components/AdminNav";
import {
  FileText,
  Send,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  AlertCircle,
  Zap,
  X,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

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
  return `${MONTHS[month]} ${year}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminInvoicesPage() {
  // list state
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterEmailSent, setFilterEmailSent] = useState("");
  const [page, setPage] = useState(1);

  // modal: invoice detail
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // modal: generate invoices
  const [showGenModal, setShowGenModal] = useState(false);
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genCreatorId, setGenCreatorId] = useState("");
  const [genForce, setGenForce] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);

  // per-invoice action state
  const [actionLoading, setActionLoading] = useState({});
  const [actionMsg, setActionMsg] = useState({});

  // ── data fetching ──────────────────────────────────────────────────────────
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      if (filterMonth) params.set("month", filterMonth);
      if (filterYear) params.set("year", filterYear);
      if (filterEmailSent !== "") params.set("email_sent", filterEmailSent);

      const res = await fetch(`/api/admin/invoices?${params}`);
      if (!res.ok) throw new Error("Failed to load invoices");
      const data = await res.json();
      setInvoices(data.invoices || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterMonth, filterYear, filterEmailSent]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // ── detail modal ───────────────────────────────────────────────────────────
  const openDetail = async (inv) => {
    setDetailLoading(true);
    setSelectedInvoice(inv); // show basic info immediately
    try {
      const res = await fetch(`/api/admin/invoices/${inv.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedInvoice(data.invoice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── per-invoice actions ────────────────────────────────────────────────────
  const invoiceAction = async (id, endpoint, label) => {
    setActionLoading((p) => ({ ...p, [id]: label }));
    setActionMsg((p) => ({ ...p, [id]: null }));
    try {
      const res = await fetch(`/api/admin/invoices/${id}/${endpoint}`, {
        method: endpoint === "download" ? "GET" : "POST",
      });

      if (endpoint === "download") {
        if (!res.ok) throw new Error("Download failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setActionMsg((p) => ({
          ...p,
          [id]: { type: "success", text: "Downloaded!" },
        }));
      } else {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Action failed");
        setActionMsg((p) => ({
          ...p,
          [id]: { type: "success", text: data.message || "Done!" },
        }));
        fetchInvoices();
        // If detail modal is open for this invoice, refresh it
        if (selectedInvoice?.id === id) {
          const refreshed = await fetch(`/api/admin/invoices/${id}`);
          if (refreshed.ok) {
            const rd = await refreshed.json();
            setSelectedInvoice(rd.invoice);
          }
        }
      }
    } catch (err) {
      setActionMsg((p) => ({
        ...p,
        [id]: { type: "error", text: err.message },
      }));
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
      setTimeout(() => setActionMsg((p) => ({ ...p, [id]: null })), 4000);
    }
  };

  // ── generate invoices ──────────────────────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setGenResult(null);
    try {
      const body = {
        month: parseInt(genMonth),
        year: parseInt(genYear),
        force: genForce,
      };
      if (genCreatorId) body.creator_id = parseInt(genCreatorId);
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setGenResult({ success: true, data });
      fetchInvoices();
    } catch (err) {
      setGenResult({ success: false, error: err.message });
    } finally {
      setGenLoading(false);
    }
  };

  // ── stats summary ──────────────────────────────────────────────────────────
  const totalInvoices = pagination.total;
  const sentCount = invoices.filter((i) => i.email_sent).length;
  const failCount = invoices.filter(
    (i) => !i.email_sent && i.email_error,
  ).length;

  // ── years for filter ───────────────────────────────────────────────────────
  const yearOptions = Array.from(
    { length: 5 },
    (_, k) => new Date().getFullYear() - k,
  );

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav activePage="/admin/invoices" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Invoices
            </h1>
            <p className="text-sm text-gray-500">
              Auto-generated & emailed whenever earnings are updated
            </p>
          </div>
          <button
            onClick={() => {
              setShowGenModal(true);
              setGenResult(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Zap size={16} />
            Generate Invoices
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Invoices",
              value: totalInvoices,
              icon: FileText,
              color: "text-purple-600",
            },
            {
              label: "Emails Sent",
              value: sentCount,
              icon: CheckCircle,
              color: "text-green-600",
            },
            {
              label: "Email Failed",
              value: failCount,
              icon: XCircle,
              color: "text-red-600",
            },
            {
              label: "This Page",
              value: invoices.length,
              icon: Eye,
              color: "text-blue-600",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{label}</span>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search name, email, invoice #..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {/* Month */}
            <select
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Months</option>
              {MONTHS.slice(1).map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            {/* Year */}
            <select
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {/* Email sent */}
            <select
              value={filterEmailSent}
              onChange={(e) => {
                setFilterEmailSent(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="true">Email Sent</option>
              <option value="false">Email Pending</option>
            </select>
            {/* Clear */}
            {(search ||
              filterMonth ||
              filterYear ||
              filterEmailSent !== "") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterMonth("");
                  setFilterYear("");
                  setFilterEmailSent("");
                  setPage(1);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No invoices found</p>
              <p className="text-gray-400 text-sm mt-1">
                Invoices are auto-generated when earnings are uploaded
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "Invoice #",
                      "Creator",
                      "Period",
                      "Gross",
                      "Net",
                      "Email",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Invoice # */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          {inv.invoice_number}
                        </span>
                      </td>
                      {/* Creator */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {inv.creator_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">
                          {inv.creator_email}
                        </p>
                      </td>
                      {/* Period */}
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {periodLabel(inv.month, inv.year)}
                      </td>
                      {/* Gross */}
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                        ${fmt(inv.total_amount)}
                      </td>
                      {/* Net */}
                      <td className="px-4 py-3 text-sm font-semibold text-purple-700 whitespace-nowrap">
                        ${fmt(inv.net_amount)}
                      </td>
                      {/* Email status */}
                      <td className="px-4 py-3">
                        {inv.email_sent ? (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle size={14} />
                            <span className="text-xs font-medium">Sent</span>
                          </div>
                        ) : inv.email_error ? (
                          <div
                            className="flex items-center gap-1.5 text-red-500"
                            title={inv.email_error}
                          >
                            <XCircle size={14} />
                            <span className="text-xs font-medium">Failed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500">
                            <Clock size={14} />
                            <span className="text-xs font-medium">Pending</span>
                          </div>
                        )}
                        {/* per-row action message */}
                        {actionMsg[inv.id] && (
                          <p
                            className={`text-xs mt-1 ${actionMsg[inv.id].type === "success" ? "text-green-600" : "text-red-500"}`}
                          >
                            {actionMsg[inv.id].text}
                          </p>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => openDetail(inv)}
                            title="View details"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          {/* Download */}
                          <button
                            onClick={() =>
                              invoiceAction(inv.id, "download", "download")
                            }
                            disabled={!!actionLoading[inv.id]}
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
                          >
                            {actionLoading[inv.id] === "download" ? (
                              <RefreshCw size={15} className="animate-spin" />
                            ) : (
                              <Download size={15} />
                            )}
                          </button>
                          {/* Resend */}
                          <button
                            onClick={() =>
                              invoiceAction(inv.id, "resend", "resend")
                            }
                            disabled={!!actionLoading[inv.id]}
                            title="Resend email"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                          >
                            {actionLoading[inv.id] === "resend" ? (
                              <RefreshCw size={15} className="animate-spin" />
                            ) : (
                              <Send size={15} />
                            )}
                          </button>
                          {/* Regenerate */}
                          <button
                            onClick={() =>
                              invoiceAction(inv.id, "regenerate", "regenerate")
                            }
                            disabled={!!actionLoading[inv.id]}
                            title="Force regenerate"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-40"
                          >
                            {actionLoading[inv.id] === "regenerate" ? (
                              <RefreshCw size={15} className="animate-spin" />
                            ) : (
                              <RefreshCw size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing page {pagination.page} of {pagination.pages} (
                {pagination.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page >= pagination.pages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Invoice Detail
                </h2>
                <p className="text-sm font-mono text-purple-600">
                  {selectedInvoice.invoice_number}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {detailLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Creator info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <User size={12} /> Creator
                  </div>
                  <p className="font-semibold text-gray-900">
                    {selectedInvoice.creator_name}
                  </p>
                  <p className="text-sm text-gray-500 break-all">
                    {selectedInvoice.creator_email}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <Calendar size={12} /> Period
                  </div>
                  <p className="font-semibold text-gray-900">
                    {periodLabel(selectedInvoice.month, selectedInvoice.year)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated{" "}
                    {new Date(selectedInvoice.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Financials */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                  <DollarSign size={12} /> Financials
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gross Earnings</span>
                    <span className="font-medium">
                      ${fmt(selectedInvoice.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Withholding Tax</span>
                    <span className="font-medium text-red-500">
                      -${fmt(selectedInvoice.withholding_tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
                    <span className="text-purple-700">Net Payable</span>
                    <span className="text-purple-700">
                      ${fmt(selectedInvoice.net_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email status */}
              <div
                className={`rounded-xl p-4 border ${selectedInvoice.email_sent ? "bg-green-50 border-green-200" : selectedInvoice.email_error ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}
              >
                <div className="flex items-center gap-2">
                  {selectedInvoice.email_sent ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Email sent on{" "}
                        {new Date(
                          selectedInvoice.email_sent_at,
                        ).toLocaleString()}
                      </span>
                    </>
                  ) : selectedInvoice.email_error ? (
                    <>
                      <XCircle size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        Email failed: {selectedInvoice.email_error}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        Email not yet sent
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Earnings breakdown */}
              {selectedInvoice.earnings_breakdown &&
                selectedInvoice.earnings_breakdown.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Earnings Breakdown
                    </p>
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {["Date", "Platform", "Amount", "Tax"].map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2 text-left text-xs font-semibold text-gray-500"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedInvoice.earnings_breakdown.map((e, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                                {e.earning_date || "—"}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {e.platform || "—"}
                              </td>
                              <td className="px-3 py-2 font-medium text-gray-900">
                                ${fmt(e.amount)}
                              </td>
                              <td className="px-3 py-2 text-red-500">
                                -${fmt(e.withholding_tax)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() =>
                    invoiceAction(selectedInvoice.id, "download", "download")
                  }
                  disabled={!!actionLoading[selectedInvoice.id]}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading[selectedInvoice.id] === "download" ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  Download PDF
                </button>
                <button
                  onClick={() =>
                    invoiceAction(selectedInvoice.id, "resend", "resend")
                  }
                  disabled={!!actionLoading[selectedInvoice.id]}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading[selectedInvoice.id] === "resend" ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Resend Email
                </button>
                <button
                  onClick={() =>
                    invoiceAction(
                      selectedInvoice.id,
                      "regenerate",
                      "regenerate",
                    )
                  }
                  disabled={!!actionLoading[selectedInvoice.id]}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {actionLoading[selectedInvoice.id] === "regenerate" ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Force Regenerate
                </button>
              </div>
              {actionMsg[selectedInvoice.id] && (
                <p
                  className={`text-sm ${actionMsg[selectedInvoice.id].type === "success" ? "text-green-600" : "text-red-500"}`}
                >
                  {actionMsg[selectedInvoice.id].text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Generate Modal ───────────────────────────────────────────────────── */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Generate Invoices
              </h2>
              <button
                onClick={() => {
                  setShowGenModal(false);
                  setGenResult(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Manually trigger invoice generation for a specific month.
                Invoices are also auto-generated on each CSV upload.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={genMonth}
                    onChange={(e) => setGenMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {MONTHS.slice(1).map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={genYear}
                    onChange={(e) => setGenYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Creator ID{" "}
                  <span className="text-gray-400 font-normal">
                    (optional — leave blank for all)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={genCreatorId}
                  onChange={(e) => setGenCreatorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={genForce}
                  onChange={(e) => setGenForce(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                <span className="text-sm text-gray-700">
                  Force regenerate (overwrite existing invoices)
                </span>
              </label>

              {genResult && (
                <div
                  className={`rounded-xl p-4 ${genResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  {genResult.success ? (
                    <>
                      <p className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle size={14} /> Done!
                      </p>
                      <p className="text-xs text-green-700">
                        {genResult.data.summary.sent} sent ·{" "}
                        {genResult.data.summary.skipped} skipped ·{" "}
                        {genResult.data.summary.errors} errors
                      </p>
                      {/* Show error details if any */}
                      {genResult.data.summary.errors > 0 &&
                        genResult.data.results && (
                          <div className="mt-3 space-y-1.5">
                            <p className="text-xs font-semibold text-red-700">
                              Error details:
                            </p>
                            {genResult.data.results
                              .filter((r) => r.status === "error")
                              .map((r, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                                >
                                  <span className="font-medium">
                                    Creator #{r.creatorId}:
                                  </span>{" "}
                                  {r.error}
                                </div>
                              ))}
                          </div>
                        )}
                      {/* Show sent details */}
                      {genResult.data.summary.sent > 0 &&
                        genResult.data.results && (
                          <div className="mt-2 space-y-1">
                            {genResult.data.results
                              .filter((r) => r.status === "sent")
                              .map((r, i) => (
                                <div key={i} className="text-xs text-green-600">
                                  ✓ Creator #{r.creatorId} — Invoice #
                                  {r.invoiceId} sent
                                </div>
                              ))}
                          </div>
                        )}
                    </>
                  ) : (
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} /> {genResult.error}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGenModal(false);
                    setGenResult(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={genLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {genLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={14} /> Generate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
