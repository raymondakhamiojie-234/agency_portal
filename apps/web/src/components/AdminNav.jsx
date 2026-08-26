"use client";

import { useState, useEffect } from "react";
import AdminNotificationBell from "./AdminNotificationBell";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  FileText,
  DollarSign,
  Newspaper,
  Mail,
  CreditCard,
  Receipt,
} from "lucide-react";

export default function AdminNav({ activePage, adminName, pendingAdvances }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (pendingAdvances !== undefined) {
      setNotificationCount(pendingAdvances);
    } else {
      // Fetch pending advances count
      fetchPendingCount();
    }
  }, [pendingAdvances]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch("/api/admin/advance-payouts?status=Pending");
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.loans?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch pending advances:", err);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Partners", path: "/admin/partners", icon: Users },
    { name: "Creators", path: "/admin/creators", icon: TrendingUp },
    { name: "Earnings", path: "/admin/earnings", icon: DollarSign },
    { name: "Invoices", path: "/admin/invoices", icon: Receipt },
    { name: "Contracts", path: "/admin/contracts", icon: FileText },
    {
      name: "Platform Contracts",
      path: "/admin/platform-contracts",
      icon: FileText,
    },
    {
      name: "Advance Payouts",
      path: "/admin/advance-payouts",
      icon: CreditCard,
      badge: notificationCount > 0 ? notificationCount : null,
    },
    { name: "Blog", path: "/admin/blog", icon: Newspaper },
    { name: "Domain Setup", path: "/admin/domain-setup", icon: Mail },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <a href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                {adminName && (
                  <p className="text-xs text-gray-400">{adminName}</p>
                )}
              </div>
            </a>

            {/* Right Side Actions - All Screen Sizes */}
            <div className="flex items-center gap-2">
              <AdminNotificationBell />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay - All Screen Sizes */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Slide-out Sidebar - All Screen Sizes */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#0A0A0A] border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              {adminName && (
                <p className="text-xs text-gray-400">{adminName}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
          <div className="border-t border-gray-700 my-2"></div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}
