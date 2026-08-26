"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import {
  Bell,
  BellOff,
  CheckCheck,
  Filter,
  Building2,
  FileText,
  Newspaper,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, agency, update, blog
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      fetchNotifications();
    }
  }, [user, userLoading, filter, showUnreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("type", filter);
      }
      if (showUnreadOnly) {
        params.append("unread", "true");
      }

      const response = await fetch(`/api/notifications?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "agency":
        return <Building2 className="w-5 h-5" />;
      case "update":
        return <FileText className="w-5 h-5" />;
      case "blog":
        return <Newspaper className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "agency":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
          badge:
            "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
        };
      case "update":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          badge:
            "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        };
      case "blog":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
          badge:
            "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          badge:
            "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
        };
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/notifications" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/notifications" />

      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
                Notifications
              </h1>
              <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#726BFF] dark:text-[#6366FF] mb-2">
                Updates from Falcus Media Limited
              </h3>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                Stay updated with agency news, page updates, and blog posts
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200"
              >
                <CheckCheck size={16} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="font-inter text-sm text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-[#525252] dark:text-white dark:text-opacity-70" />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                    filter === "all"
                      ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                      : "bg-gray-100 dark:bg-[#0A0A0A] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("agency")}
                  className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                    filter === "agency"
                      ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                      : "bg-gray-100 dark:bg-[#0A0A0A] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
                  }`}
                >
                  Agency
                </button>
                <button
                  onClick={() => setFilter("update")}
                  className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                    filter === "update"
                      ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                      : "bg-gray-100 dark:bg-[#0A0A0A] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
                  }`}
                >
                  Updates
                </button>
                <button
                  onClick={() => setFilter("blog")}
                  className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                    filter === "blog"
                      ? "bg-[#726BFF] dark:bg-[#6366FF] text-white"
                      : "bg-gray-100 dark:bg-[#0A0A0A] text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-200 dark:hover:bg-[#262626]"
                  }`}
                >
                  Blog
                </button>
              </div>
            </div>

            {/* Unread Toggle */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#726BFF] focus:ring-[#726BFF]"
              />
              <span className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                Show unread only ({unreadCount})
              </span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
            <BellOff className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-2">
              No notifications
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              {showUnreadOnly
                ? "You have no unread notifications"
                : "You'll see updates from Falcus Media Limited here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const colors = getNotificationColor(
                notification.notification_type,
              );
              return (
                <div
                  key={notification.id}
                  onClick={() =>
                    !notification.is_read && markAsRead(notification.id)
                  }
                  className={`bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 transition-all duration-200 ${
                    !notification.is_read
                      ? "hover:shadow-lg cursor-pointer border-l-4 border-l-[#726BFF] dark:border-l-[#6366FF]"
                      : "opacity-75"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 ${colors.text}`}
                    >
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <span className="px-2 py-1 bg-[#726BFF] dark:bg-[#6366FF] text-white text-xs font-inter font-medium rounded">
                              NEW
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${colors.badge}`}
                        >
                          {notification.notification_type
                            .charAt(0)
                            .toUpperCase() +
                            notification.notification_type.slice(1)}
                        </span>
                      </div>
                      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-3 whitespace-pre-line">
                        {notification.message}
                      </p>
                      <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-50">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
