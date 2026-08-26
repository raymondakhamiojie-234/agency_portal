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
  Calendar,
  Percent,
  User,
  Edit2,
  Save,
  X as XIcon,
  AlertCircle,
} from "lucide-react";

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [editDuration, setEditDuration] = useState("");
  const [editRevShare, setEditRevShare] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/admin/contracts");
      if (!response.ok) throw new Error("Failed to fetch contracts");
      const data = await response.json();
      setContracts(data.contracts || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.creator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.creator_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Signed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      "Pending Signature": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      Expired: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig["Pending Signature"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const stats = {
    total: contracts.length,
    signed: contracts.filter((c) => c.status === "Signed").length,
    pending: contracts.filter((c) => c.status === "Pending Signature").length,
    expired: contracts.filter((c) => c.status === "Expired").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading contracts...
          </p>
        </div>
      </div>
    );
  }

  const handleEditContract = (contract) => {
    setEditingContract(contract.id);
    setEditDuration(contract.duration_years.toString());
    setEditRevShare(contract.revenue_share_percentage.toString());
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSaveContract = async (contractId) => {
    const duration = parseInt(editDuration);
    const revShare = parseFloat(editRevShare);

    // Client-side validation
    if (isNaN(duration) || duration < 1 || duration > 10) {
      setErrorMessage("Duration must be between 1 and 10 years");
      return;
    }

    if (isNaN(revShare) || revShare < 0 || revShare > 100) {
      setErrorMessage("Revenue share must be between 0 and 100%");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/contracts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contractId,
          durationYears: duration,
          revenueSharePercentage: revShare,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update contract");
      }

      await fetchContracts();
      setEditingContract(null);
      setEditDuration("");
      setEditRevShare("");

      // Show success message
      setSuccessMessage(
        `✓ Contract updated! Duration: ${duration} ${duration === 1 ? "year" : "years"}, Revenue Share: ${revShare}%`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error updating contract:", error);
      setErrorMessage(error.message || "Failed to update contract");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingContract(null);
    setEditDuration("");
    setEditRevShare("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav activePage="/admin/contracts" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Contract Management
          </h1>
          <p className="text-gray-400">
            View and manage creator contracts and agreements
          </p>
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
              <XIcon size={16} />
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
              <XIcon size={16} />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Contracts</span>
              <FileText className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
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
              <span className="text-sm text-gray-400">Pending</span>
              <Clock className="text-yellow-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.pending}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Expired</span>
              <XCircle className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.expired}</p>
          </div>
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
                placeholder="Search by creator name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Signed">Signed</option>
                <option value="Pending Signature">Pending Signature</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          {/* Info Banner */}
          <div className="bg-blue-900/20 border-b border-blue-500/30 px-6 py-3 flex items-center gap-2">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={16} />
            <p className="text-sm text-blue-300">
              Click the{" "}
              <span className="inline-flex items-center gap-1 bg-blue-600 px-2 py-0.5 rounded text-xs">
                <Edit2 size={12} /> Edit
              </span>{" "}
              button to modify contract <strong>duration (years)</strong> and{" "}
              <strong>revenue share (%)</strong> for individual creators
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Revenue Share
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Duration (Years)
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
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No contracts found</p>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className={`transition-all ${
                        editingContract === contract.id
                          ? "bg-purple-900/20 border-l-4 border-purple-500"
                          : "hover:bg-gray-700/30"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {contract.creator_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {contract.creator_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingContract === contract.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={editRevShare}
                              onChange={(e) => setEditRevShare(e.target.value)}
                              className="w-20 px-3 py-1.5 bg-gray-900 border-2 border-purple-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
                              placeholder="%"
                            />
                            <Percent size={14} className="text-purple-400" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-purple-400">
                            <Percent size={14} />
                            <span className="font-semibold">
                              {contract.revenue_share_percentage}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingContract === contract.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={editDuration}
                              onChange={(e) => setEditDuration(e.target.value)}
                              className="w-20 px-3 py-1.5 bg-gray-900 border-2 border-purple-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
                              placeholder="Years"
                            />
                            <span className="text-purple-400 text-sm font-medium">
                              years
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-300">
                            <Calendar size={14} />
                            <span className="font-medium">
                              {contract.duration_years}{" "}
                              {contract.duration_years === 1 ? "year" : "years"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {new Date(contract.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingContract === contract.id ? (
                            <>
                              <button
                                onClick={() => handleSaveContract(contract.id)}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                title="Save Changes"
                              >
                                {saving ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save size={16} />
                                    <span>Save</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                title="Cancel"
                              >
                                <XIcon size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                                title="Edit Contract"
                              >
                                <Edit2 size={16} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDetails(true);
                                }}
                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </>
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
      {showDetails && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Contract Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contract Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Creator</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <User size={16} />
                    {selectedContract.creator_name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedContract.creator_email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedContract.status)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Revenue Share</p>
                  <p className="font-bold text-2xl text-purple-600">
                    {selectedContract.revenue_share_percentage}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Agency keeps this percentage
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-bold text-2xl text-gray-900">
                    {selectedContract.duration_years}{" "}
                    {selectedContract.duration_years === 1 ? "Year" : "Years"}
                  </p>
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
                    {selectedContract.signature_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        By: {selectedContract.signature_name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contract Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contract Terms
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 max-h-[400px] overflow-y-auto border border-gray-200">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedContract.contract_text}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedContract.status === "Signed" &&
                selectedContract.pdf_url && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={selectedContract.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={18} />
                      Download Signed Contract
                    </a>
                  </div>
                )}
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
