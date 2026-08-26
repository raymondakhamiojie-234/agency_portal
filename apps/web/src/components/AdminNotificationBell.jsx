"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Clock,
  DollarSign,
  AlertCircle,
  UserPlus,
  FileText,
  FileSignature,
  Handshake,
} from "lucide-react";

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const audioRef = useRef(null);
  const previousUnreadCount = useRef(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    // Click outside to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=20");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);

        // Play sound if new notification arrived
        if (
          data.unread_count > previousUnreadCount.current &&
          previousUnreadCount.current > 0
        ) {
          playNotificationSound();
        }

        previousUnreadCount.current = data.unread_count;
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notificationId }),
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_all_read: true }),
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navigate to related page based on notification type
    if (typeof window !== "undefined") {
      switch (notification.related_type) {
        case "advance_payout":
          window.location.href = "/admin/advance-payouts";
          break;
        case "creator":
          window.location.href = "/admin/creators";
          break;
        case "contract":
          window.location.href = "/admin/contracts";
          break;
        case "platform_contract":
          window.location.href = "/admin/platform-contracts";
          break;
        case "partner":
          window.location.href = "/admin/partners";
          break;
        default:
          // No navigation for generic notifications
          break;
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "loan_request":
        return <DollarSign size={18} className="text-yellow-400" />;
      case "new_creator":
        return <UserPlus size={18} className="text-green-400" />;
      case "new_contract":
        return <FileSignature size={18} className="text-blue-400" />;
      case "new_platform_contract":
        return <FileText size={18} className="text-purple-400" />;
      case "new_partner":
        return <Handshake size={18} className="text-cyan-400" />;
      case "info":
        return <AlertCircle size={18} className="text-blue-400" />;
      case "success":
        return <Check size={18} className="text-green-400" />;
      case "warning":
        return <AlertCircle size={18} className="text-orange-400" />;
      case "error":
        return <AlertCircle size={18} className="text-red-400" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,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"
      />

      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-purple-400" />
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700">
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Bell size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 cursor-pointer transition-all hover:bg-gray-800/50 ${
                      !notification.is_read ? "bg-purple-900/10" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.is_read
                                ? "text-white"
                                : "text-gray-300"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{formatTime(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Updated to show appropriate links */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700">
              <div className="flex gap-2 text-sm">
                <a
                  href="/admin/creators"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Creators
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/admin/partners"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Partners
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/admin/contracts"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Contracts
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
