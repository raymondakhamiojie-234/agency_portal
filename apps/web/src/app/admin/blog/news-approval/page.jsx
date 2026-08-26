"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
} from "lucide-react";

const CATEGORIES = ["Instagram", "TikTok", "YouTube", "Meta", "X", "General"];

export default function NewsApprovalPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    source_url: "",
    source_name: "",
    category: "General",
    content: "",
    featured_image: "",
  });

  useEffect(() => {
    fetchNews();
  }, [statusFilter]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/blog/external-news?status=${statusFilter}`,
      );
      if (!response.ok) throw new Error("Failed to fetch news");

      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Approve this news item and publish it to the blog?")) return;

    try {
      const response = await fetch("/api/blog/external-news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });

      if (!response.ok) throw new Error("Failed to approve news");

      alert("News approved and published successfully!");
      fetchNews();
    } catch (error) {
      console.error("Error approving news:", error);
      alert("Failed to approve news");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this news item?")) return;

    try {
      const response = await fetch("/api/blog/external-news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      });

      if (!response.ok) throw new Error("Failed to reject news");

      alert("News rejected successfully!");
      fetchNews();
    } catch (error) {
      console.error("Error rejecting news:", error);
      alert("Failed to reject news");
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/blog/external-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add news");
      }

      alert("News added to queue successfully!");
      setShowAddForm(false);
      setFormData({
        title: "",
        source_url: "",
        source_name: "",
        category: "General",
        content: "",
        featured_image: "",
      });
      if (statusFilter === "pending") {
        fetchNews();
      }
    } catch (error) {
      console.error("Error adding news:", error);
      alert(error.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };
    const config = styles[status] || styles.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav activePage="/admin/blog/news-approval" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              External News Queue
            </h1>
            <p className="text-gray-400">
              Review and approve external news sources
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add News Manually
          </button>
        </div>

        {/* Status Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                statusFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                statusFilter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                statusFilter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-700 rounded flex-1"></div>
                  <div className="h-10 bg-gray-700 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No news items found
            </h3>
            <p className="text-gray-500">
              {statusFilter === "pending"
                ? "No news items awaiting approval"
                : `No ${statusFilter} news items`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-600/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                      {item.category || "General"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Featured Image */}
                {item.featured_image && (
                  <img
                    src={item.featured_image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                {/* Source */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">
                    Source: {item.source_name}
                  </p>
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 break-all"
                  >
                    <ExternalLink size={14} />
                    {item.source_url}
                  </a>
                </div>

                {/* Excerpt */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Actions */}
                {item.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}

                {/* Review Info */}
                {(item.status === "approved" || item.status === "rejected") &&
                  item.reviewer_name && (
                    <div className="pt-4 border-t border-gray-700 text-sm text-gray-400">
                      <p>
                        {item.status === "approved" ? "Approved" : "Rejected"}{" "}
                        by {item.reviewer_name}
                      </p>
                      {item.reviewed_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(item.reviewed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add News Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Add External News
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleAddNews} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Source Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.source_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          source_name: e.target.value,
                        })
                      }
                      placeholder="e.g., TechCrunch, The Verge"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Source URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.source_url}
                    onChange={(e) =>
                      setFormData({ ...formData, source_url: e.target.value })
                    }
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured_image: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content * (HTML supported)
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    placeholder="Enter the news content..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Content will be sanitized for security. Scripts and iframes
                    will be removed.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
