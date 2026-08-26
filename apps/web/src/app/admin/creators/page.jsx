"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X as XIcon,
  Percent,
} from "lucide-react";

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingContract, setEditingContract] = useState(false);
  const [newContractPercentage, setNewContractPercentage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const response = await fetch("/api/admin/creators");
      if (!response.ok) throw new Error("Failed to fetch creators");
      const data = await response.json();
      setCreators(data.creators || []);
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.page_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || creator.account_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      "Under Review": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      Suspended: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig["Under Review"];
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

  const getOnboardingBadge = (creator) => {
    if (creator.onboarding_completed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle size={12} />
          Complete
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-medium">
        <Clock size={12} />
        Incomplete
      </span>
    );
  };

  const stats = {
    total: creators.length,
    active: creators.filter((c) => c.account_status === "Active").length,
    underReview: creators.filter((c) => c.account_status === "Under Review")
      .length,
    suspended: creators.filter((c) => c.account_status === "Suspended").length,
  };

  const handleUpdateContract = async () => {
    if (!selectedCreator || !newContractPercentage) return;

    const percentage = parseFloat(newContractPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert("Please enter a valid percentage between 0 and 100");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/creators", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: selectedCreator.id,
          revenueSharePercentage: percentage,
        }),
      });

      if (!response.ok) throw new Error("Failed to update contract");

      // Refresh data
      await fetchCreators();

      // Update selected creator
      const updatedCreator = creators.find((c) => c.id === selectedCreator.id);
      if (updatedCreator) {
        setSelectedCreator({
          ...updatedCreator,
          revenue_share_percentage: percentage,
        });
      }

      setEditingContract(false);
      alert("Contract percentage updated successfully!");
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("Failed to update contract percentage");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading creators...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav activePage="/admin/creators" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Creator Management
          </h1>
          <p className="text-gray-400">
            Manage and monitor all creator accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Creators</span>
              <Users className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Active</span>
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.active}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Under Review</span>
              <Clock className="text-yellow-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.underReview}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Suspended</span>
              <XCircle className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.suspended}</p>
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
                placeholder="Search by name, email, or page name..."
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
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Creators Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          {/* Table Header - Visible on mobile */}
          <div className="p-4 border-b border-gray-700 lg:hidden">
            <p className="text-sm text-gray-400">
              Scroll horizontally to view all columns →
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Creator
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Platform
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Onboarding
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Followers
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No creators found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((creator) => (
                    <tr
                      key={creator.id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-white">
                            {creator.full_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {creator.email}
                          </p>
                          {creator.page_name && (
                            <p className="text-xs text-purple-400 mt-1">
                              {creator.page_name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                          {creator.primary_platform || "Not set"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(creator.account_status)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getOnboardingBadge(creator)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-300">
                          <TrendingUp size={14} />
                          <span className="font-medium">
                            {creator.follower_count?.toLocaleString() || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCreator(creator);
                            setShowDetails(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Creator Details Modal */}
      {showDetails && selectedCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Creator Details
              </h2>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setEditingContract(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-purple-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Mail size={14} />
                      {selectedCreator.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Phone size={14} />
                      {selectedCreator.phone_number || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin size={14} />
                      {selectedCreator.country || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.date_of_birth
                        ? new Date(
                            selectedCreator.date_of_birth,
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Home Address</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.home_address || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-purple-600" />
                  Platform Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600">Page Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.page_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Primary Platform</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.primary_platform || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.follower_count?.toLocaleString() || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p>{getStatusBadge(selectedCreator.account_status)}</p>
                  </div>
                </div>

                {selectedCreator.page_urls &&
                  selectedCreator.page_urls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Page URLs</p>
                      <div className="space-y-2">
                        {selectedCreator.page_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-purple-600 hover:underline"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Contract Management - NEW SECTION */}
              {selectedCreator.contract_id && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-purple-600" />
                    Contract Management
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Revenue Share Percentage
                        </p>
                        {!editingContract ? (
                          <p className="text-2xl font-bold text-purple-600 flex items-center gap-2 mt-1">
                            <Percent size={20} />
                            {selectedCreator.revenue_share_percentage || 0}%
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={newContractPercentage}
                              onChange={(e) =>
                                setNewContractPercentage(e.target.value)
                              }
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="0-100"
                            />
                            <span className="text-gray-600 font-medium">%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!editingContract ? (
                          <button
                            onClick={() => {
                              setEditingContract(true);
                              setNewContractPercentage(
                                selectedCreator.revenue_share_percentage || "",
                              );
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={handleUpdateContract}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <Save size={16} />
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingContract(false);
                                setNewContractPercentage("");
                              }}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <XIcon size={16} />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="font-semibold text-blue-900 mb-1">
                        ℹ️ Contract Information
                      </p>
                      <p>
                        Status:{" "}
                        <span className="font-medium">
                          {selectedCreator.contract_status || "No contract"}
                        </span>
                      </p>
                      {selectedCreator.signed_at && (
                        <p>
                          Signed:{" "}
                          {new Date(
                            selectedCreator.signed_at,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Banking Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-purple-600" />
                  Banking Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.bank_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.account_name || "—"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium text-gray-900">
                      {selectedCreator.bank_account_number || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Onboarding Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-purple-600" />
                  Onboarding Status
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Status</span>
                    {getOnboardingBadge(selectedCreator)}
                  </div>
                  {selectedCreator.onboarding_completed_at && (
                    <p className="text-sm text-gray-600">
                      Completed on{" "}
                      {new Date(
                        selectedCreator.onboarding_completed_at,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <a
                  href={`/admin/earnings?creator=${selectedCreator.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <DollarSign size={18} />
                  View Earnings
                </a>
                <a
                  href={`/admin/contracts?creator=${selectedCreator.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText size={18} />
                  View Contract
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
