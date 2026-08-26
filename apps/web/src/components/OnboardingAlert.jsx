"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
  FileText,
  User,
  TrendingUp,
} from "lucide-react";

export default function OnboardingAlert() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding-status");
      if (!response.ok) {
        throw new Error("Failed to fetch onboarding status");
      }
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status || status.isComplete || dismissed) {
    return null;
  }

  const {
    profileComplete,
    contractSigned,
    missingFields,
    completionPercentage,
  } = status;

  return (
    <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Complete Your Onboarding
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Finish setting up your account to start earning
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-orange-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Profile Completion */}
          <div
            className={`p-4 rounded-lg border-2 ${
              profileComplete
                ? "bg-green-50 border-green-300"
                : "bg-white border-orange-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User
                  size={20}
                  className={
                    profileComplete ? "text-green-600" : "text-orange-600"
                  }
                />
                <h4 className="font-semibold text-gray-900">
                  Complete Profile
                </h4>
              </div>
              {profileComplete ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {missingFields.length} missing
                </div>
              )}
            </div>

            {!profileComplete && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">Missing fields:</p>
                <div className="space-y-1">
                  {missingFields.slice(0, 3).map((field) => (
                    <div
                      key={field.field}
                      className="text-xs text-gray-700 flex items-center gap-1"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      {field.label}
                    </div>
                  ))}
                  {missingFields.length > 3 && (
                    <div className="text-xs text-gray-500 italic">
                      +{missingFields.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <a
              href="/portal/profile"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                profileComplete
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
              }`}
            >
              {profileComplete ? "View Profile" : "Complete Profile"}
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Contract Signing */}
          <div
            className={`p-4 rounded-lg border-2 ${
              contractSigned
                ? "bg-green-50 border-green-300"
                : "bg-white border-orange-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText
                  size={20}
                  className={
                    contractSigned ? "text-green-600" : "text-orange-600"
                  }
                />
                <h4 className="font-semibold text-gray-900">Sign Contract</h4>
              </div>
              {contractSigned ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Required
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 mb-3">
              {contractSigned
                ? "Your contract is signed and active"
                : "Sign your contract to start earning with us"}
            </p>

            <a
              href="/portal/contract"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                contractSigned
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-md"
              }`}
            >
              {contractSigned ? "View Contract" : "Sign Contract"}
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Alert */}
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 flex items-start gap-3">
          <TrendingUp
            size={20}
            className="text-orange-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Unlock Your Earnings
            </p>
            <p className="text-xs text-gray-700">
              Complete your profile and sign your contract to activate your
              account, view your earnings, and start receiving payouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
