"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function TestAuthPage() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    if (!userLoading && user) {
      fetchProfile();
      fetchSessionInfo();
    }
  }, [user, userLoading]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/creator-profile");
      const data = await response.json();
      setProfile(data.profile);
      setProfileLoading(false);
    } catch (err) {
      setProfileError(err.message);
      setProfileLoading(false);
    }
  };

  const fetchSessionInfo = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setSessionInfo(data);
    } catch (err) {
      console.error("Failed to fetch session:", err);
    }
  };

  const TestResult = ({ label, status, details }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="mt-0.5">
        {status === "success" && (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        )}
        {status === "error" && (
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        {status === "loading" && (
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
        )}
        {status === "warning" && (
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-inter font-medium text-sm text-[#111111] dark:text-white mb-1">
          {label}
        </p>
        {details && (
          <pre className="font-mono text-xs text-[#525252] dark:text-white dark:text-opacity-70 overflow-x-auto">
            {typeof details === "string"
              ? details
              : JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <header className="w-full py-4 px-6 bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
              Authentication Test Page
            </h1>
            <a
              href="/portal/dashboard"
              className="font-inter text-sm text-[#726BFF] dark:text-[#6366FF] hover:underline"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8">
          <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-6">
            Authentication Status
          </h2>

          <div className="space-y-4">
            {/* User Loading Status */}
            <TestResult
              label="User Hook Status"
              status={userLoading ? "loading" : user ? "success" : "error"}
              details={
                userLoading
                  ? "Loading user data..."
                  : user
                    ? `Logged in as: ${user.email}`
                    : "Not authenticated"
              }
            />

            {/* User Data */}
            {user && (
              <TestResult
                label="User Data"
                status="success"
                details={{
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                }}
              />
            )}

            {/* Session Info */}
            {sessionInfo && (
              <TestResult
                label="Session Info"
                status="success"
                details={sessionInfo}
              />
            )}

            {/* Profile Status */}
            <TestResult
              label="Creator Profile Status"
              status={
                profileLoading
                  ? "loading"
                  : profile
                    ? "success"
                    : profileError
                      ? "error"
                      : "warning"
              }
              details={
                profileLoading
                  ? "Loading profile..."
                  : profile
                    ? {
                        id: profile.id,
                        full_name: profile.full_name,
                        page_name: profile.page_name,
                        account_status: profile.account_status,
                      }
                    : profileError || "No profile found"
              }
            />

            {/* Cookie Check */}
            <TestResult
              label="Session Cookie"
              status={
                document.cookie.includes("authjs.session-token") ||
                document.cookie.includes("__Secure-authjs.session-token")
                  ? "success"
                  : "error"
              }
              details={
                document.cookie.includes("authjs.session-token") ||
                document.cookie.includes("__Secure-authjs.session-token")
                  ? "Session cookie found"
                  : "No session cookie found"
              }
            />

            {/* All Cookies */}
            <TestResult
              label="All Cookies"
              status="success"
              details={document.cookie || "No cookies"}
            />
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-4">
              Test Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-inter text-sm"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                      .replace(/^ +/, "")
                      .replace(
                        /=.*/,
                        "=;expires=" + new Date().toUTCString() + ";path=/",
                      );
                  });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-inter text-sm"
              >
                Clear All & Reload
              </button>
              <a
                href="/account/signin"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-inter text-sm"
              >
                Go to Sign In
              </a>
              <a
                href="/account/signup"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-inter text-sm"
              >
                Go to Sign Up
              </a>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-100 dark:bg-[#0A0A0A] rounded-lg">
            <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
              <strong>Debug Info:</strong> This page helps diagnose
              authentication issues. Check the browser console (F12) for
              detailed logs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
