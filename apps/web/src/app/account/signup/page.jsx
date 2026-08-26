"use client";

import { useState, useEffect } from "react";
import { ArrowRight, User, CheckCircle, XCircle } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [pageName, setPageName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("Facebook");
  const [pageUrls, setPageUrls] = useState("");
  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Check for referral code in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  // Password validation helper
  const validatePassword = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(pwd),
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircle
          size={16}
          className="text-green-500 dark:text-green-400 flex-shrink-0"
        />
      ) : (
        <XCircle
          size={16}
          className="text-red-500 dark:text-red-400 flex-shrink-0"
        />
      )}
      <span
        className={`font-inter text-xs ${met ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
      >
        {text}
      </span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !email ||
      !password ||
      !fullName ||
      !pageName ||
      !phoneNumber ||
      !pageUrls ||
      !country
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate password
    if (!isPasswordValid) {
      setError(
        "Password does not meet all requirements. Please check the requirements below.",
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Starting signup process for:", email);

      // Step 1: Create user account and get session
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          referralCode, // Include referral code for tracking
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || "EmailCreateAccount");
      }

      console.log("User account created, now creating profile...");

      // Step 2: Create creator profile
      const profileResponse = await fetch("/api/creator-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          brandName,
          pageName,
          phoneNumber,
          primaryPlatform,
          pageUrls,
          country,
          referralCode,
        }),
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData.error || "Failed to create profile. Please try again.",
        );
      }

      console.log("Profile created successfully!");

      // Step 3: Redirect to dashboard
      window.location.href = "/portal/dashboard";
    } catch (err) {
      console.error("Signup error details:", {
        message: err.message,
        stack: err.stack,
        error: err,
      });

      // Display the error message directly from the API
      setError(err.message || "Failed to create account. Please try again.");
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
              href="/account/signin"
              className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 hover:text-[#726BFF] dark:hover:text-[#6366FF] transition-colors duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-10 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] mb-4">
                <User size={28} className="text-white" />
              </div>
              <h1 className="font-plus-jakarta-sans font-bold text-2xl md:text-3xl text-[#111111] dark:text-white mb-2">
                Apply for Management
              </h1>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                Join the Falcus Media ecosystem and grow your creator business
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Full Name / Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Brand Name */}
              <div>
                <label
                  htmlFor="brandName"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Brand Name (if different)
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="My Creative Brand"
                />
              </div>

              {/* Page Name */}
              <div>
                <label
                  htmlFor="pageName"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Page Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pageName"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., @yourpage or Your Page Name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="Create a secure password"
                />
                {showPasswordRequirements && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                    <p className="font-inter text-xs font-medium text-[#111111] dark:text-white mb-2">
                      Password must contain:
                    </p>
                    <PasswordRequirement
                      met={passwordValidation.length}
                      text="At least 8 characters"
                    />
                    <PasswordRequirement
                      met={passwordValidation.uppercase}
                      text="At least one uppercase letter (A-Z)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.lowercase}
                      text="At least one lowercase letter (a-z)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.number}
                      text="At least one number (0-9)"
                    />
                    <PasswordRequirement
                      met={passwordValidation.special}
                      text="At least one special character (!@#$%^&*...)"
                    />
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Phone Number (WhatsApp){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Primary Platform */}
              <div>
                <label
                  htmlFor="primaryPlatform"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Primary Platform <span className="text-red-500">*</span>
                </label>
                <select
                  id="primaryPlatform"
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              {/* Page URLs */}
              <div>
                <label
                  htmlFor="pageUrls"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Page or Channel URL(s) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="pageUrls"
                  value={pageUrls}
                  onChange={(e) => setPageUrls(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="https://facebook.com/yourpage&#10;https://instagram.com/yourprofile"
                />
                <p className="mt-1 font-inter text-xs text-[#6B7280] dark:text-white dark:text-opacity-50">
                  Enter one URL per line if you have multiple pages
                </p>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="United States"
                />
              </div>

              {/* Referral Code */}
              <div>
                <label
                  htmlFor="referralCode"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                  placeholder="FALCUS2024"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="font-inter text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="font-inter text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> All sign-ups are subject to review and
                  approval by our team.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] active:bg-[#5651D6] dark:active:bg-[#4F46E5] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {loading
                    ? "Submitting Application..."
                    : "Apply for Management"}
                </span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#1E1E1E] font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/account/signin"
                className="inline-flex items-center justify-center space-x-2 w-full bg-white dark:bg-[#0A0A0A] text-[#726BFF] dark:text-[#6366FF] font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg border-2 border-[#726BFF] dark:border-[#6366FF] hover:bg-[#F4F5FF] dark:hover:bg-[#262626] active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:ring-opacity-60"
              >
                <span>Sign In</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
