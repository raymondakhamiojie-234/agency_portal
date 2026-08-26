"use client";

import { useState, useEffect } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Calendar,
  Eye,
  ArrowLeft,
  ExternalLink,
  User,
  Share2,
} from "lucide-react";

export default function BlogPostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Extract slug from URL path
    const pathParts = window.location.pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    if (slug) {
      fetchPost(slug);
    }
  }, []);

  const fetchPost = async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) throw new Error("Post not found");

      const data = await response.json();
      setPost(data.post);

      // Fetch related posts
      if (data.post.category) {
        const relatedResponse = await fetch(
          `/api/blog?category=${data.post.category}&limit=3&status=published`,
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedPosts(
            relatedData.posts.filter((p) => p.id !== data.post.id).slice(0, 3),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <FalcusHeader />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <FalcusHeader />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">
            Post Not Found
          </h1>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <FalcusHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </a>

        {/* Article Header */}
        <article className="bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-800 mb-12">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="w-full h-96 bg-gray-800 overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Category & External Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`${getCategoryColor(post.category)} px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg`}
              >
                {post.category}
              </span>
              {post.is_external && (
                <span className="bg-gray-800 px-4 py-1.5 rounded-full text-sm font-medium text-gray-300 flex items-center gap-2 border border-gray-700">
                  <ExternalLink size={14} />
                  External Source
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">
              <span className="flex items-center gap-2">
                <User size={16} />
                {post.is_external ? post.source_name : post.author_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {post.view_count} views
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 ml-auto"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* External Source Link */}
            {post.is_external && post.source_url && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-400 mb-2">Original Source:</p>
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 break-all"
                >
                  {post.source_url}
                  <ExternalLink size={16} className="flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                prose-strong:text-white prose-strong:font-bold
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:text-gray-300
                prose-blockquote:border-l-purple-600 prose-blockquote:text-gray-400
                prose-code:text-purple-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                prose-img:rounded-xl prose-img:shadow-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-all"
                >
                  <div className="relative w-full h-48 bg-gray-800">
                    {relatedPost.featured_image ? (
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
                    )}
                  </div>
                  <div className="p-4">
                    <span
                      className={`${getCategoryColor(relatedPost.category)} px-2 py-1 rounded text-xs font-bold text-white`}
                    >
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <FalcusFooter />
    </div>
  );
}
