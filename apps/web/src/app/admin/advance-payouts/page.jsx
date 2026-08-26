"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Edit2,
  Trash2,
  Filter,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export default function AdminAdvancePayoutsPage() {
  const [admin, setAdmin] = useState(null);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingLoan, setEditingLoan] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchLoans();
    // Poll for new loans every 30 seconds
    const interval = setInterval(fetchLoans, 30000);
    return () => clearInterval(interval);
  }, [filterStatus]);

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

  const fetchLoans = async () => {
    try {
      const url =
        filterStatus === "all"
          ? "/api/admin/advance-payouts"
          : `/api/admin/advance-payouts?status=${filterStatus}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch loans");
      }
      const data = await response.json();
      setLoans(data.loans);
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      setError("Failed to load advance payouts");
      setLoading(false);
    }
  };

  const handleStatusChange = async (loanId, newStatus) => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/advance-payouts/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setSuccess(`Loan status updated to ${newStatus}`);
      fetchLoans();
    } catch (err) {
      console.error(err);
      setError("Failed to update loan status");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditLoan = (loan) => {
    setEditingLoan(loan.id);
    setEditForm({
      requested_amount: loan.requested_amount,
      fee_percentage: loan.fee_percentage,
      fee_amount: loan.fee_amount,
      net_amount: loan.net_amount,
      outstanding_balance: loan.outstanding_balance,
      repayment_progress: loan.repayment_progress,
      status: loan.status,
    });
  };

  const handleSaveEdit = async (loanId) => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/advance-payouts/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update loan");
      }

      setSuccess("Loan updated successfully");
      setEditingLoan(null);
      setEditForm({});
      fetchLoans();
    } catch (err) {
      console.error(err);
      setError("Failed to update loan");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!confirm("Are you sure you want to delete this loan request?")) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/advance-payouts/${loanId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete loan");
      }

      setSuccess("Loan deleted successfully");
      fetchLoans();
    } catch (err) {
      console.error(err);
      setError("Failed to delete loan");
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: Clock,
      },
      Approved: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
        icon: CheckCircle,
      },
      Disbursed: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/30",
        icon: CheckCircle,
      },
      Rejected: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: XCircle,
      },
      Completed: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/30",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading advance payouts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav
        activePage="/admin/advance-payouts"
        adminName={admin?.full_name || admin?.username}
        pendingAdvances={stats?.pending_count || 0}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Advance Payouts Management
            </h1>
            <p className="text-gray-400">
              View and manage all creator loan requests
            </p>
          </div>
          <button
            onClick={fetchLoans}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-0.5" size={20} />
            <p className="text-sm text-green-300">{success}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500/10 p-3 rounded-lg">
                  <Clock size={24} className="text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.pending_count}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Pending Requests</p>
              <p className="text-xs text-yellow-400 font-semibold">
                {formatCurrency(stats.pending_amount)}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <CheckCircle size={24} className="text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.approved_count}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Approved</p>
              <p className="text-xs text-blue-400 font-semibold">
                {formatCurrency(stats.approved_amount)}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <TrendingUp size={24} className="text-green-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.disbursed_count}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Disbursed</p>
              <p className="text-xs text-green-400 font-semibold">
                {formatCurrency(stats.disbursed_amount)}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <DollarSign size={24} className="text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(stats.total_outstanding)}
                </span>
              </div>
              <p className="text-sm text-gray-400">Total Outstanding</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <Filter size={20} className="text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "Pending",
              "Approved",
              "Disbursed",
              "Rejected",
              "Completed",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          {/* Table Header - Visible on mobile */}
          <div className="p-4 border-b border-gray-700 lg:hidden">
            <p className="text-sm text-gray-400">
              Scroll horizontally to view all columns →
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Creator
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Fee
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Net
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Outstanding
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <DollarSign
                        size={48}
                        className="text-gray-600 mx-auto mb-4"
                      />
                      <p className="text-gray-400">
                        No advance payout requests found
                      </p>
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-white">
                              {loan.creator_name || "Unknown"}
                            </p>
                            {loan.brand_name && (
                              <p className="text-xs text-gray-400">
                                {loan.brand_name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                              <User size={16} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {loan.creator_name || "Unknown"}
                              </p>
                              {loan.brand_name && (
                                <p className="text-xs text-gray-400">
                                  {loan.brand_name}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Mail size={12} />
                            <span>{loan.creator_email || "N/A"}</span>
                          </div>
                          {loan.phone_number && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Phone size={12} />
                              <span>{loan.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <input
                            type="number"
                            value={editForm.requested_amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                requested_amount: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(loan.requested_amount)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <input
                            type="number"
                            value={editForm.fee_amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fee_amount: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          />
                        ) : (
                          <div className="space-y-1">
                            <span className="text-sm text-gray-300">
                              {formatCurrency(loan.fee_amount)}
                            </span>
                            <p className="text-xs text-gray-500">
                              ({loan.fee_percentage}%)
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <input
                            type="number"
                            value={editForm.net_amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                net_amount: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-green-400">
                            {formatCurrency(loan.net_amount)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <input
                            type="number"
                            value={editForm.outstanding_balance}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                outstanding_balance: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          />
                        ) : (
                          <div className="space-y-1">
                            <span className="text-sm text-gray-300">
                              {formatCurrency(loan.outstanding_balance)}
                            </span>
                            {loan.repayment_progress > 0 && (
                              <div className="w-24">
                                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full transition-all"
                                    style={{
                                      width: `${loan.repayment_progress}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {loan.repayment_progress.toFixed(0)}% paid
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                status: e.target.value,
                              })
                            }
                            className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Disbursed">Disbursed</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          getStatusBadge(loan.status)
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar size={12} />
                          <span>{formatDate(loan.created_at)}</span>
                        </div>
                        {loan.disbursed_at && (
                          <p className="text-xs text-green-400 mt-1">
                            Disbursed: {formatDate(loan.disbursed_at)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editingLoan === loan.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(loan.id)}
                              disabled={processing}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-all disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingLoan(null);
                                setEditForm({});
                              }}
                              disabled={processing}
                              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {loan.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(loan.id, "Approved")
                                  }
                                  disabled={processing}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-all disabled:opacity-50"
                                  title="Approve"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(loan.id, "Rejected")
                                  }
                                  disabled={processing}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-all disabled:opacity-50"
                                  title="Reject"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {loan.status === "Approved" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(loan.id, "Disbursed")
                                }
                                disabled={processing}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-all disabled:opacity-50"
                                title="Mark as Disbursed"
                              >
                                Disburse
                              </button>
                            )}
                            <button
                              onClick={() => handleEditLoan(loan)}
                              disabled={processing}
                              className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded transition-all disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteLoan(loan.id)}
                              disabled={processing}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
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
