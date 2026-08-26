"use client";

import { useState, useEffect } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  TrendingUp,
  ExternalLink,
  Calendar,
  Eye,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All", icon: TrendingUp },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "TikTok", label: "TikTok", icon: TrendingUp },
  { value: "YouTube", label: "YouTube", icon: Youtube },
  { value: "Meta", label: "Meta", icon: Facebook },
  { value: "X", label: "X", icon: Twitter },
  { value: "General", label: "General", icon: TrendingUp },
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, pagination.offset]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "published",
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/blog?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.posts || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Instagram: "bg-gradient-to-r from-purple-600 to-pink-600",
      TikTok: "bg-gradient-to-r from-cyan-500 to-pink-500",
      YouTube: "bg-red-600",
      Meta: "bg-blue-600",
      X: "bg-black",
      General: "bg-gray-700",
    };
    return colors[category] || colors.General;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <FalcusHeader />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-900/20 to-transparent pt-24 pb-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Falcus Media Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest social media news, platform updates,
              and industry insights
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter size={20} className="text-gray-400 flex-shrink-0" />
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setPagination((prev) => ({ ...prev, offset: 0 }));
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/50 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-64 bg-gray-800"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500">
              {selectedCategory === "all"
                ? "Check back soon for new content!"
                : `No posts in the ${selectedCategory} category yet.`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-all hover:shadow-2xl hover:shadow-purple-900/20 hover:scale-[1.02]"
                >
                  {/* Featured Image */}
                  <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                        <TrendingUp size={60} className="text-gray-700" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`${getCategoryColor(post.category)} px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg`}
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* External Source Badge */}
                    {post.is_external && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-300 flex items-center gap-1 border border-gray-700">
                          <ExternalLink size={12} />
                          External
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {post.view_count || 0}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        {post.is_external ? post.source_name : post.author_name}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Pagination */}
            {(pagination.hasMore || pagination.offset > 0) && (
              <div className="flex justify-center gap-4 mt-12">
                {pagination.offset > 0 && (
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: Math.max(0, prev.offset - prev.limit),
                      }))
                    }
                    className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {pagination.hasMore && (
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: prev.offset + prev.limit,
                      }))
                    }
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <FalcusFooter />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
