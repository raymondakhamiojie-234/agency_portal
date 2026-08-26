"use client";

import useAuth from "@/utils/useAuth";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/cbcb9867-212c-4227-ae74-97d9067b6bad/-/format/auto/"
                alt="Falcus Media"
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] mb-4">
                <LogOut size={28} className="text-white" />
              </div>
              <h1 className="font-plus-jakarta-sans font-bold text-2xl md:text-3xl text-[#111111] dark:text-white mb-2">
                Sign Out
              </h1>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                Are you sure you want to sign out?
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] active:bg-[#5651D6] dark:active:bg-[#4F46E5] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60"
            >
              <span>Sign Out</span>
            </button>

            <div className="mt-4">
              <a
                href="/portal/dashboard"
                className="w-full inline-flex items-center justify-center space-x-2 bg-white dark:bg-[#0A0A0A] text-[#726BFF] dark:text-[#6366FF] font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg border-2 border-[#726BFF] dark:border-[#6366FF] hover:bg-[#F4F5FF] dark:hover:bg-[#262626] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60"
              >
                <span>Cancel</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
