"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  Clock,
  X as XIcon,
  Menu,
  LogOut,
  Newspaper,
} from "lucide-react";

const CATEGORIES = ["Instagram", "TikTok", "YouTube", "Meta", "X", "General"];

export default function BlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(`/api/blog?${params}`);
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/blog-admin/login";
          return;
        }
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete post");

      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-600/20 text-green-300",
      draft: "bg-yellow-600/20 text-yellow-300",
      archived: "bg-gray-600/20 text-gray-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}
      >
        {status === "published" && (
          <CheckCircle size={12} className="inline mr-1" />
        )}
        {status === "draft" && <Clock size={12} className="inline mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
                <p className="text-xs text-gray-400">All Posts</p>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
                  className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/blog-admin/posts"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              All Blog Posts
            </h1>
            <p className="text-gray-400">Manage and edit your blog content</p>
          </div>
          <a
            href="/blog-admin/posts/new"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            New Post
          </a>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Published
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{post.title}</p>
                      <p className="text-sm text-gray-400">{post.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {post.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </a>
                        <a
                          href={`/blog-admin/posts/${post.id}`}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
