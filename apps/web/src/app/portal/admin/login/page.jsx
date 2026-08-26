"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithCredentials } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First verify this is an admin account
      const checkResponse = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || "Login failed");
        setLoading(false);
        return;
      }

      // Admin credentials verified, now sign in via NextAuth
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/portal/admin",
        redirect: true,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#726BFF] to-[#5E55FF] dark:from-[#6366FF] dark:to-[#5558FF] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-[#1E1E1E] rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-[#726BFF] dark:text-[#6366FF]" />
          </div>
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-white mb-2">
            Admin Portal
          </h1>
          <p className="font-inter text-white text-opacity-90">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-inter text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-base py-3 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Back to Portal */}
          <div className="mt-6 text-center">
            <a
              href="/portal/login"
              className="font-inter text-sm text-[#726BFF] dark:text-[#6366FF] hover:underline"
            >
              ← Back to Creator Portal
            </a>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="font-inter text-xs text-white text-opacity-75">
            🔒 This area is restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
