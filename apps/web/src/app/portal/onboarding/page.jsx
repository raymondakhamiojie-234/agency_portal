"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ArrowRight, User } from "lucide-react";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    // Check if profile already exists - if so, redirect to dashboard
    if (!userLoading && user) {
      checkProfileAndRedirect();
    }
  }, [user, userLoading]);

  const checkProfileAndRedirect = async () => {
    try {
      const response = await fetch("/api/creator-profile");
      const data = await response.json();

      if (data.profile) {
        console.log("Profile already exists, redirecting to dashboard");
        window.location.href = "/portal/dashboard";
      } else {
        console.log(
          "No profile found - user needs to complete onboarding manually",
        );
        setError(
          "Your profile was not created during signup. Please contact support.",
        );
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setError("Unable to verify your profile. Please contact support.");
    }
  };

  const createProfile = async (profileData) => {
    setLoading(true);
    setError("");

    console.log("Creating profile with data:", profileData);

    try {
      const response = await fetch("/api/creator-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      console.log("Profile creation response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error("Profile creation failed:", data);
        throw new Error(
          data.message || data.error || "Failed to create profile",
        );
      }

      const data = await response.json();
      console.log("Profile created successfully:", data);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/portal/dashboard";
      }, 1500);
    } catch (err) {
      console.error("Create profile error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            {loading ? "Creating your profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
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
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-lg">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-400 text-3xl">
                  ✓
                </span>
              </div>
              <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-2">
                Profile Created Successfully!
              </h2>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 dark:text-red-400 text-3xl">
                  ✕
                </span>
              </div>
              <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-2">
                Something Went Wrong
              </h2>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
                {error}
              </p>
              <a
                href="/portal/dashboard"
                className="inline-flex items-center justify-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200"
              >
                <span>Go to Dashboard</span>
              </a>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
