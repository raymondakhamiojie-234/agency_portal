"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function AdminMarketplacePage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (activeTab === "listings") {
      fetchListings();
    } else if (activeTab === "sellers") {
      fetchSellers();
    } else if (activeTab === "conversations") {
      fetchConversations();
    }
  }, [activeTab, filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/api/admin/marketplace/listings"
          : `/api/admin/marketplace/listings?status=${filter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setListings(data.listings || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/marketplace/sellers");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSellers(data.sellers || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/marketplace/conversations");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleListingAction = async (listingId, action) => {
    if (!confirm(`Are you sure you want to ${action} this listing?`)) return;

    try {
      const response = await fetch(
        `/api/admin/marketplace/listings/${listingId}/${action}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) throw new Error(`Failed to ${action}`);

      alert(`Listing ${action}d successfully`);
      fetchListings();
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to ${action} listing`);
    }
  };

  const handleContractAction = async (sellerId, role, action) => {
    if (!confirm(`Are you sure you want to ${action} seller contract?`)) return;

    try {
      const response = await fetch(
        `/api/admin/marketplace/sellers/${sellerId}/contract`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, action }),
        },
      );

      if (!response.ok) throw new Error(`Failed to ${action}`);

      alert(`Contract ${action}d successfully`);
      fetchSellers();
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to ${action} contract`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      suspended: "bg-gray-100 text-gray-800",
      sold: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketplace Management
          </h1>
          <p className="text-gray-600">
            Manage listings, sellers, and conversations
          </p>
        </div>

        {/* Stats Grid */}
        {stats.total !== undefined && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.sold}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Ban className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.suspended}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "listings"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="inline mr-2" size={18} />
                Listings
              </button>
              <button
                onClick={() => setActiveTab("sellers")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "sellers"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="inline mr-2" size={18} />
                Sellers
              </button>
              <button
                onClick={() => setActiveTab("conversations")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "conversations"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="inline mr-2" size={18} />
                Conversations
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "listings" && (
              <div>
                {/* Filter */}
                <div className="mb-6">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Listings</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Listings Table */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No listings found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Platform
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Followers
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listings.map((listing) => (
                          <tr key={listing.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {listing.account_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {listing.seller_role}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {listing.platform}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${listing.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {listing.followers_count.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(listing.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                {listing.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleListingAction(
                                          listing.id,
                                          "approve",
                                        )
                                      }
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <CheckCircle size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleListingAction(
                                          listing.id,
                                          "reject",
                                        )
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  </>
                                )}
                                {listing.status === "approved" && (
                                  <button
                                    onClick={() =>
                                      handleListingAction(listing.id, "suspend")
                                    }
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <Ban size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "sellers" && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : sellers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No sellers found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Listings
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contract Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sellers.map((seller) => (
                          <tr key={`${seller.role}-${seller.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {seller.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {seller.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                {seller.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {seller.listing_count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {seller.seller_contract_revoked ? (
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                  Revoked
                                </span>
                              ) : seller.seller_contract_signed ? (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded flex items-center gap-1 w-fit">
                                  <Shield size={12} />
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                  Not Signed
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {seller.seller_contract_revoked ? (
                                <button
                                  onClick={() =>
                                    handleContractAction(
                                      seller.id,
                                      seller.role,
                                      "approve",
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900 font-medium"
                                >
                                  Restore
                                </button>
                              ) : seller.seller_contract_signed ? (
                                <button
                                  onClick={() =>
                                    handleContractAction(
                                      seller.id,
                                      seller.role,
                                      "revoke",
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900 font-medium"
                                >
                                  Revoke
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleContractAction(
                                      seller.id,
                                      seller.role,
                                      "approve",
                                    )
                                  }
                                  className="text-purple-600 hover:text-purple-900 font-medium"
                                >
                                  Approve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "conversations" && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div
                        key={conv.listing_id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {conv.listing_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {conv.platform} • {conv.seller_role}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {conv.message_count} messages
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                conv.last_message_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
