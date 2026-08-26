"use client";

import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { ArrowRight, Lock } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInWithCredentials } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Starting signin for:", email);

      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/portal/dashboard",
        redirect: true,
      });

      console.log("Signin successful, redirecting...");
    } catch (err) {
      console.error("Signin error:", err);

      // Display the error message directly from the API
      setError(err.message || "Incorrect email or password. Please try again.");
      setLoading(false);
    }
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
            <a
              href="/account/signup"
              className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 hover:text-[#726BFF] dark:hover:text-[#6366FF] transition-colors duration-200"
            >
              Sign Up
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
                <Lock size={28} className="text-white" />
              </div>
              <h1 className="font-plus-jakarta-sans font-bold text-2xl md:text-3xl text-[#111111] dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                Sign in to your creator dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <div className="mt-2 text-right">
                  <a
                    href="/account/forgot-password"
                    className="font-inter text-sm text-[#726BFF] dark:text-[#6366FF] hover:text-[#6259E6] dark:hover:text-[#5856FF] transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="font-inter text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] active:bg-[#5651D6] dark:active:bg-[#4F46E5] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#1E1E1E] font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                  New to Falcus Media?
                </span>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/account/signup"
                className="inline-flex items-center justify-center space-x-2 w-full bg-white dark:bg-[#0A0A0A] text-[#726BFF] dark:text-[#6366FF] font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg border-2 border-[#726BFF] dark:border-[#6366FF] hover:bg-[#F4F5FF] dark:hover:bg-[#262626] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60"
              >
                <span>Create Account</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
