"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

export default function ProfileCompletion({ profile }) {
  const [completionStatus, setCompletionStatus] = useState({
    percentage: 0,
    completed: [],
    missing: [],
  });

  useEffect(() => {
    if (profile) {
      calculateCompletion();
    }
  }, [profile]);

  const calculateCompletion = () => {
    const fields = [
      { name: "Full Name", value: profile.full_name, field: "full_name" },
      {
        name: "Phone Number",
        value: profile.phone_number,
        field: "phone_number",
      },
      { name: "Country", value: profile.country, field: "country" },
      {
        name: "Primary Platform",
        value: profile.primary_platform,
        field: "primary_platform",
      },
      { name: "Page Name", value: profile.page_name, field: "page_name" },
      {
        name: "Page URLs",
        value: profile.page_urls?.length > 0,
        field: "page_urls",
      },
      {
        name: "Date of Birth",
        value: profile.date_of_birth,
        field: "date_of_birth",
      },
      {
        name: "Home Address",
        value: profile.home_address,
        field: "home_address",
      },
      { name: "Bank Name", value: profile.bank_name, field: "bank_name" },
      {
        name: "Account Number",
        value: profile.bank_account_number,
        field: "bank_account_number",
      },
      {
        name: "Account Holder Name",
        value: profile.account_name,
        field: "account_name",
      },
    ];

    const completed = fields.filter((f) => f.value && f.value !== "");
    const missing = fields.filter((f) => !f.value || f.value === "");
    const percentage = Math.round((completed.length / fields.length) * 100);

    setCompletionStatus({ percentage, completed, missing });
  };

  if (!profile) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Profile Completion</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            {completionStatus.percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionStatus.percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {completionStatus.completed.length} of{" "}
          {completionStatus.completed.length + completionStatus.missing.length}{" "}
          fields completed
        </p>
      </div>

      {/* Status Message */}
      {completionStatus.percentage === 100 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle
            size={20}
            className="text-green-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-green-900">
              Profile Complete!
            </p>
            <p className="text-xs text-green-700 mt-1">
              All required information has been provided.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle
              size={20}
              className="text-orange-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-orange-900">
                {completionStatus.missing.length} field(s) remaining
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Complete your profile to unlock full access
              </p>
            </div>
          </div>

          {/* Missing Fields List */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {completionStatus.missing.slice(0, 6).map((field) => (
              <div
                key={field.field}
                className="flex items-center gap-2 text-xs text-gray-700"
              >
                <Circle size={12} className="text-orange-400" />
                <span>{field.name}</span>
              </div>
            ))}
          </div>

          {completionStatus.missing.length > 6 && (
            <p className="text-xs text-gray-500 mt-2 italic">
              +{completionStatus.missing.length - 6} more fields
            </p>
          )}
        </div>
      )}
    </div>
  );
}
