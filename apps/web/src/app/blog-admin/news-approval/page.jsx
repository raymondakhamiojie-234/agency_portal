"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  X as XIcon,
  Eye,
  ExternalLink,
  AlertCircle,
  Menu,
  LogOut,
  Newspaper,
  Clock,
} from "lucide-react";

export default function NewsApprovalPage() {
  const [newsQueue, setNewsQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchPendingNews();
  }, []);

  const fetchPendingNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/external-news");
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/blog-admin/login";
          return;
        }
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();
      setNewsQueue(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (newsId) => {
    try {
      const response = await fetch("/api/blog/external-news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newsId, action: "approve" }),
      });

      if (!response.ok) throw new Error("Failed to approve");

      alert("News approved and published!");
      setSelectedNews(null);
      fetchPendingNews();
    } catch (error) {
      console.error("Error approving:", error);
      alert("Failed to approve news");
    }
  };

  const handleReject = async (newsId) => {
    if (!confirm("Are you sure you want to reject this news item?")) return;

    try {
      const response = await fetch("/api/blog/external-news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newsId, action: "reject" }),
      });

      if (!response.ok) throw new Error("Failed to reject");

      alert("News rejected");
      setSelectedNews(null);
      fetchPendingNews();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Failed to reject news");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/blog-admin/logout", { method: "POST" });
      window.location.href = "/blog-admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Newspaper size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Blog Admin</h1>
                <p className="text-xs text-gray-400">News Approval Queue</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a
                href="/blog-admin/dashboard"
                className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/blog-admin/posts"
                className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                All Posts
              </a>
              <a
                href="/blog-admin/news-approval"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                News Queue
              </a>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <nav className="flex flex-col gap-2">
                <a
                  href="/blog-admin/dashboard"
                  className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/blog-admin/posts"
                  className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium"
                >
                  All Posts
                </a>
                <a
                  href="/blog-admin/news-approval"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                  News Queue
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg font-medium text-left"
                >
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              News Approval Queue
            </h1>
            {newsQueue.length > 0 && (
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm font-bold">
                {newsQueue.length} Pending
              </span>
            )}
          </div>
          <p className="text-gray-400">
            Review and approve external news articles for publication
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400">Loading news queue...</p>
          </div>
        ) : newsQueue.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle size={60} className="text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-500">No news items pending approval</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newsQueue.map((news) => (
              <div
                key={news.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-600/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                    <Clock size={12} />
                    Pending Review
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(news.created_at).toLocaleDateString()}
                  </span>
                </div>

                {news.featured_image && (
                  <img
                    src={news.featured_image}
                    alt={news.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-xl font-bold text-white mb-3">
                  {news.title}
                </h3>

                {news.category && (
                  <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium mb-3">
                    {news.category}
                  </span>
                )}

                {news.excerpt && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <span className="font-semibold">Source:</span>{" "}
                    {news.source_name}
                  </div>
                  {news.source_url && (
                    <a
                      href={news.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View Original
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedNews(news)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => handleApprove(news.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(news.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XIcon size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Preview Article</h2>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon size={24} />
              </button>
            </div>

            <div className="p-6">
              {selectedNews.featured_image && (
                <img
                  src={selectedNews.featured_image}
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <h1 className="text-3xl font-bold text-white mb-4">
                {selectedNews.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <span>From: {selectedNews.source_name}</span>
                <span>•</span>
                <span>
                  {new Date(selectedNews.created_at).toLocaleDateString()}
                </span>
                {selectedNews.category && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                      {selectedNews.category}
                    </span>
                  </>
                )}
              </div>

              {selectedNews.excerpt && (
                <p className="text-lg text-gray-300 mb-6 italic">
                  {selectedNews.excerpt}
                </p>
              )}

              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() => handleApprove(selectedNews.id)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={() => handleReject(selectedNews.id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
