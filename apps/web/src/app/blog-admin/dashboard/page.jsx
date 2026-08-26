"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  ExternalLink,
  BarChart3,
  Users,
  Newspaper,
  LogOut,
  Menu,
  X as XIcon,
} from "lucide-react";

export default function BlogAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log("📊 Fetching blog admin dashboard data...");

    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch("/api/blog-admin/stats", {
          credentials: "include", // Important: include cookies
        }),
        fetch("/api/blog?limit=5&status=all", {
          credentials: "include",
        }),
      ]);

      console.log("📡 Stats response status:", statsRes.status);
      console.log("📡 Posts response status:", postsRes.status);

      // Only redirect to login if unauthorized (401)
      if (statsRes.status === 401) {
        console.log("❌ Unauthorized - redirecting to login");
        window.location.href = "/blog-admin/login";
        return;
      }

      if (!statsRes.ok) {
        const errorData = await statsRes.json();
        console.error("❌ Stats fetch failed:", errorData);
        throw new Error("Failed to fetch stats");
      }

      if (!postsRes.ok) {
        const errorData = await postsRes.json();
        console.error("❌ Posts fetch failed:", errorData);
        throw new Error("Failed to fetch posts");
      }

      const statsData = await statsRes.json();
      const postsData = await postsRes.json();

      console.log("✅ Dashboard data loaded successfully");
      console.log("📊 Stats:", statsData);

      setStats(statsData);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);
      // Only redirect to login if it's an auth error
      // Otherwise just show the error in UI
      setStats(null);
      setPosts([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blog dashboard...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-xs text-gray-400">Content Management</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a
                href="/blog-admin/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
                className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
                  className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium"
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
          <h1 className="text-3xl font-bold text-white mb-2">Blog Dashboard</h1>
          <p className="text-gray-400">
            Manage your blog content and analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={stats?.totalPosts || 0}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Published"
            value={stats?.publishedPosts || 0}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Drafts"
            value={stats?.draftPosts || 0}
            color="yellow"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={(stats?.totalViews || 0).toLocaleString()}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Posts */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={24} className="text-green-400" />
              Top Performing Posts
            </h2>
            <div className="space-y-3">
              {stats?.topPosts?.slice(0, 5).map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Eye size={12} />
                      {post.view_count?.toLocaleString() || 0} views
                    </p>
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">
                  No posts published yet
                </p>
              )}
            </div>
          </div>

          {/* Pending News */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle size={24} className="text-yellow-400" />
                Pending Approval
              </h2>
              {stats?.pendingNews > 0 && (
                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm font-bold">
                  {stats.pendingNews}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {stats?.pendingNewsList?.slice(0, 5).map((news) => (
                <div
                  key={news.id}
                  className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
                >
                  <p className="text-white font-medium text-sm line-clamp-2 mb-2">
                    {news.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>From: {news.source_name}</span>
                    <span>
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <CheckCircle
                    size={40}
                    className="text-green-400 mx-auto mb-3"
                  />
                  <p className="text-gray-500">All caught up!</p>
                </div>
              )}
            </div>
            {stats?.pendingNews > 0 && (
              <a
                href="/blog-admin/news-approval"
                className="block mt-4 text-center py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Review All ({stats.pendingNews})
              </a>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar size={24} className="text-blue-400" />
              Recent Posts
            </h2>
            <a
              href="/blog-admin/posts/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              New Post
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <a
                          href={`/blog-admin/posts/${post.id}`}
                          className="text-white hover:text-blue-400 font-medium"
                        >
                          {post.title}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {post.status === "published" ? (
                          <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs flex items-center gap-1 w-fit">
                            <CheckCircle size={12} />
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs flex items-center gap-1 w-fit">
                            <Clock size={12} />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {post.view_count || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(
                          post.published_at || post.created_at,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No posts yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <a
              href="/blog-admin/posts"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              View All Posts →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "from-blue-600 to-blue-800",
    green: "from-green-600 to-green-800",
    yellow: "from-yellow-600 to-yellow-800",
    purple: "from-purple-600 to-purple-800",
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-600/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <div
          className={`w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
