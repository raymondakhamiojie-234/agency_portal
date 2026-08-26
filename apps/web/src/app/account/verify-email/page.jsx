"use client";

import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setError("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to verify email");
          return;
        }

        setMessage(data.message);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = "/portal/dashboard";
        }, 3000);
      } catch (err) {
        setError("Failed to verify email. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {message && (
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Email Verified!
                </h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Verification Failed
                </h3>
                <p className="mt-2 text-sm text-red-600">{error}</p>
              </div>
              <div className="mt-6 text-center space-y-2">
                <div>
                  <a
                    href="/account/resend-verification"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Resend verification email
                  </a>
                </div>
                <div>
                  <a
                    href="/portal/dashboard"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Go to dashboard
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
