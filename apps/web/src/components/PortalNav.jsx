"use client";

import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  DollarSign,
  Wallet,
  MessageCircle,
  Bell,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  UserCog,
  TrendingUp,
  Users,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/utils/ThemeProvider";
import useUser from "@/utils/useUser";

export default function PortalNav({ activePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: user } = useUser();

  const navItems = [
    { name: "Dashboard", path: "/portal/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/portal/profile", icon: User },
    { name: "Services", path: "/portal/services", icon: Briefcase },
    { name: "Contract", path: "/portal/contract", icon: FileText },
    { name: "Advance Payouts", path: "/portal/advance", icon: DollarSign },
    { name: "Finance", path: "/portal/finance", icon: Wallet },
    { name: "Invoices", path: "/portal/invoices", icon: Receipt },
    { name: "Support", path: "/portal/support", icon: MessageCircle },
    { name: "Notifications", path: "/portal/notifications", icon: Bell },
  ];

  const adminItems = [
    { name: "Admin Dashboard", path: "/portal/admin", icon: Shield },
    {
      name: "Partner Performance",
      path: "/portal/admin/partners",
      icon: TrendingUp,
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/cbcb9867-212c-4227-ae74-97d9067b6bad/-/format/auto/"
                alt="Falcus Media"
                className="h-8 w-auto"
              />
            </a>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#1E1E1E] hover:bg-gray-200 dark:hover:bg-[#262626] transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon size={18} className="text-[#525252]" />
                ) : (
                  <Sun size={18} className="text-white text-opacity-70" />
                )}
              </button>

              {/* Menu Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#1E1E1E] hover:bg-gray-200 dark:hover:bg-[#262626] transition-all duration-200"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X size={20} className="text-[#525252] dark:text-white" />
                ) : (
                  <Menu size={20} className="text-[#525252] dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar Navigation */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#0A0A0A] border-l border-gray-100 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
              Navigation
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-all duration-200"
            >
              <X size={20} className="text-[#525252] dark:text-white" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-inter text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#726BFF] dark:bg-[#6366FF] text-white shadow-md"
                        : "text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Admin Section */}
            {user && user.is_admin && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="px-4 mb-3">
                  <p className="font-inter text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin Tools
                  </p>
                </div>
                <div className="space-y-2">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.path;
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-inter text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-orange-600 dark:bg-orange-500 text-white shadow-md"
                            : "text-[#525252] dark:text-white dark:text-opacity-70 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <a
              href="/account/logout"
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg font-inter text-sm font-medium text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
