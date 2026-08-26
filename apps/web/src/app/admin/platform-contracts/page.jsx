"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  ThumbsUp,
  ThumbsDown,
  Users,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Calendar,
  Activity,
} from "lucide-react";

const platformIcons = {
  Facebook: "👥",
  YouTube: "▶️",
  TikTok: "🎵",
  Instagram: "📸",
};

const statusColors = {
  Draft: "bg-gray-100 text-gray-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Signed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const statusIcons = {
  Draft: <FileText size={14} />,
  Pending: <Clock size={14} />,
  Signed: <CheckCircle size={14} />,
  Rejected: <XCircle size={14} />,
};

export default function AdminPlatformContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [followerStats, setFollowerStats] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchContracts();
    fetchAuditLog();
  }, [platformFilter, statusFilter]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (platformFilter) params.append("platform", platformFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/admin/platform-contracts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch contracts");

      const data = await response.json();
      setContracts(data.contracts || []);
      setFollowerStats(data.followerStats || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setErrorMessage("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const response = await fetch(
        "/api/admin/marketplace/audit-log?target_type=platform_contract",
      );
      if (response.ok) {
        const data = await response.json();
        setAuditLog(data.logs || []);
      }
    } catch (error) {
      console.error("Error fetching audit log:", error);
    }
  };

  const handleApprove = async (contractId) => {
    if (!confirm("Are you sure you want to approve and sign this contract?"))
      return;

    setProcessing(true);
    try {
      const response = await fetch(
        `/api/admin/platform-contracts/${contractId}/approve`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve contract");
      }

      setSuccessMessage("Contract approved and signed successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);

      await fetchContracts();
      await fetchAuditLog();
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error approving contract:", error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setErrorMessage("Please provide a rejection reason");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `/api/admin/platform-contracts/${selectedContract.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectionReason }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject contract");
      }

      setSuccessMessage("Contract rejected successfully");
      setTimeout(() => setSuccessMessage(""), 5000);

      await fetchContracts();
      await fetchAuditLog();
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting contract:", error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.creator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.account_url?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === "Draft").length,
    pending: contracts.filter((c) => c.status === "Pending").length,
    signed: contracts.filter((c) => c.status === "Signed").length,
    rejected: contracts.filter((c) => c.status === "Rejected").length,
  };

  const totalFollowersAcrossAll = followerStats.reduce(
    (sum, stat) => sum + parseInt(stat.total_followers || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading platform contracts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav activePage="/admin/platform-contracts" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Platform Contract Management
            </h1>
            <p className="text-gray-400">
              Manage creator social media platform contracts
            </p>
          </div>
          <button
            onClick={() => setShowAuditLog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            <Activity size={18} />
            <span>Audit Log</span>
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <CheckCircle
              className="text-green-400 mt-0.5 flex-shrink-0"
              size={20}
            />
            <p className="text-sm text-green-300 flex-1">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-400 hover:text-green-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle
              className="text-red-400 mt-0.5 flex-shrink-0"
              size={20}
            />
            <p className="text-sm text-red-300 flex-1">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Contracts</span>
              <FileText className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Pending</span>
              <Clock className="text-yellow-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.pending}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Signed</span>
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.signed}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Rejected</span>
              <XCircle className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-300">Total Followers</span>
              <Users className="text-purple-300" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {totalFollowersAcrossAll.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Platform Follower Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {followerStats.map((stat) => (
            <div
              key={stat.platform}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {platformIcons[stat.platform]}
                  </span>
                  <span className="text-sm font-medium text-gray-300">
                    {stat.platform}
                  </span>
                </div>
                <TrendingUp className="text-blue-400" size={16} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {parseInt(stat.total_followers || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {stat.contract_count} signed{" "}
                {stat.contract_count === 1 ? "contract" : "contracts"}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by creator, account name, or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Signed">Signed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Followers
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No contracts found</p>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="hover:bg-gray-700/30 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {platformIcons[contract.platform]}
                          </span>
                          <span className="font-medium text-white">
                            {contract.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">
                          {contract.creator_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">
                          {contract.account_name}
                        </p>
                        <a
                          href={contract.account_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1"
                        >
                          <span className="truncate max-w-[200px]">
                            {contract.account_url}
                          </span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-lg font-bold text-white">
                          {contract.followers_count.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[contract.status]}`}
                        >
                          {statusIcons[contract.status]}
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar size={14} />
                          {new Date(contract.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedContract(contract);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {contract.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(contract.id)}
                                disabled={processing}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                                title="Approve Contract"
                              >
                                <ThumbsUp size={14} />
                                <span className="text-xs font-medium">
                                  Approve
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowRejectModal(true);
                                }}
                                disabled={processing}
                                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                                title="Reject Contract"
                              >
                                <ThumbsDown size={14} />
                                <span className="text-xs font-medium">
                                  Reject
                                </span>
                              </button>
                            </>
                          )}
                          {contract.contract_file_url && (
                            <a
                              href={contract.contract_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                              title="Download Contract"
                            >
                              <Download size={16} />
                            </a>
                          )}
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

      {/* Contract Details Modal */}
      {showDetailsModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Contract Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Contract Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Platform</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl">
                      {platformIcons[selectedContract.platform]}
                    </span>
                    <span className="font-bold text-xl text-gray-900">
                      {selectedContract.platform}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[selectedContract.status]}`}
                    >
                      {statusIcons[selectedContract.status]}
                      {selectedContract.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Creator</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedContract.creator_name}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Account Name</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedContract.account_name}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">
                    Followers/Subscribers
                  </p>
                  <p className="font-bold text-2xl text-blue-900">
                    {selectedContract.followers_count.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Account URL</p>
                  <a
                    href={selectedContract.account_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm mt-1"
                  >
                    <span className="truncate">View Account</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Created On</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedContract.created_at).toLocaleDateString()}
                  </p>
                </div>

                {selectedContract.signed_at && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Signed On</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        selectedContract.signed_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedContract.rejection_reason && (
                  <div className="col-span-2 bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-gray-900">
                      {selectedContract.rejection_reason}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex gap-3">
                {selectedContract.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedContract.id)}
                      disabled={processing}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                      <ThumbsUp size={18} />
                      {processing ? "Processing..." : "Approve & Sign Contract"}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={processing}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      <ThumbsDown size={18} />
                      Reject Contract
                    </button>
                  </>
                )}
                {selectedContract.contract_file_url && (
                  <a
                    href={selectedContract.contract_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Download size={18} />
                    Download Contract File
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Contract
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this contract. This will be
              visible to the creator.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
              >
                {processing ? "Rejecting..." : "Reject Contract"}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
              <button
                onClick={() => setShowAuditLog(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {auditLog.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No audit entries found</p>
                  </div>
                ) : (
                  auditLog.map((log, index) => (
                    <div
                      key={log.id || index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-purple-600" />
                          <span className="font-semibold text-gray-900">
                            {log.action_type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.details && (
                        <pre className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
