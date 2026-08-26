"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import {
  Star,
  Check,
  X,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";

export default function AdminTestimonialsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("pending"); // 'all', 'pending', 'approved', 'rejected'

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      checkAdminAccess();
    }
  }, [user, userLoading]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/check");
      const data = await response.json();

      if (!response.ok || !data.isAdmin) {
        window.location.href = "/portal/admin/login";
        return;
      }

      fetchTestimonials();
    } catch (err) {
      console.error(err);
      window.location.href = "/portal/admin/login";
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();
      setTestimonials(data.testimonials || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load testimonials");
      setLoading(false);
    }
  };

  const handleApprove = async (testimonialId) => {
    setProcessingId(testimonialId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/testimonials/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonialId,
          isApproved: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve testimonial");
      }

      setSuccess("Testimonial approved successfully!");
      fetchTestimonials();
      setProcessingId(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to approve testimonial");
      setProcessingId(null);
    }
  };

  const handleReject = async (testimonialId) => {
    setProcessingId(testimonialId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/testimonials/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonialId,
          isApproved: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject testimonial");
      }

      setSuccess("Testimonial status updated successfully!");
      fetchTestimonials();
      setProcessingId(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update testimonial");
      setProcessingId(null);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (
      !confirm(
        "Are you sure you want to delete this testimonial? This action cannot be undone.",
      )
    ) {
      return;
    }

    setProcessingId(testimonialId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/testimonials/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete testimonial");
      }

      setSuccess("Testimonial deleted successfully!");
      fetchTestimonials();
      setProcessingId(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete testimonial");
      setProcessingId(null);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return t.is_approved === false;
    if (filter === "approved") return t.is_approved === true;
    return true;
  });

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/admin/testimonials" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
              Loading testimonials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/admin/testimonials" />

      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Testimonials Management
          </h1>
          <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#726BFF] dark:text-[#6366FF] mb-2">
            Admin Panel
          </h3>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Review and manage creator testimonials
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="font-inter text-sm text-green-800 dark:text-green-300">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="font-inter text-sm text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center space-x-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
              filter === "all"
                ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                : "text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-50 dark:hover:bg-[#0A0A0A]"
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
              filter === "pending"
                ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                : "text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-50 dark:hover:bg-[#0A0A0A]"
            }`}
          >
            Pending ({testimonials.filter((t) => !t.is_approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
              filter === "approved"
                ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                : "text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-50 dark:hover:bg-[#0A0A0A]"
            }`}
          >
            Approved ({testimonials.filter((t) => t.is_approved).length})
          </button>
        </div>

        {/* Testimonials List */}
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-2">
              No testimonials found
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              {filter === "pending"
                ? "There are no pending testimonials to review."
                : filter === "approved"
                  ? "No testimonials have been approved yet."
                  : "No testimonials have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Creator Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white">
                        {testimonial.full_name}
                      </h3>
                      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                        {testimonial.page_name} · {testimonial.primary_platform}
                      </p>
                      {testimonial.follower_count && (
                        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 flex items-center space-x-1 mt-1">
                          <Users size={12} />
                          <span>
                            {testimonial.follower_count.toLocaleString()}{" "}
                            followers
                          </span>
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                          {new Date(testimonial.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {testimonial.is_approved ? (
                      <span className="inline-flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-inter text-xs font-medium">
                        <CheckCircle size={14} />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full font-inter text-xs font-medium">
                        <Clock size={14} />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                    {testimonial.rating} out of 5
                  </span>
                </div>

                {/* Testimonial Text */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg">
                  <p className="font-inter text-sm text-[#111111] dark:text-white">
                    "{testimonial.testimonial_text}"
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {!testimonial.is_approved && (
                    <button
                      onClick={() => handleApprove(testimonial.id)}
                      disabled={processingId === testimonial.id}
                      className="inline-flex items-center space-x-2 bg-green-600 dark:bg-green-700 text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={16} />
                      <span>
                        {processingId === testimonial.id
                          ? "Processing..."
                          : "Approve"}
                      </span>
                    </button>
                  )}
                  {testimonial.is_approved && (
                    <button
                      onClick={() => handleReject(testimonial.id)}
                      disabled={processingId === testimonial.id}
                      className="inline-flex items-center space-x-2 bg-orange-600 dark:bg-orange-700 text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle size={16} />
                      <span>
                        {processingId === testimonial.id
                          ? "Processing..."
                          : "Unapprove"}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={processingId === testimonial.id}
                    className="inline-flex items-center space-x-2 bg-red-600 dark:bg-red-700 text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    <span>
                      {processingId === testimonial.id
                        ? "Deleting..."
                        : "Delete"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
