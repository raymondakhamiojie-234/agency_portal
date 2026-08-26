import { AlertCircle } from "lucide-react";

export function AccountStatusBanner({ accountStatus }) {
  if (accountStatus !== "Under Review") {
    return null;
  }

  return (
    <div
      className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-plus-jakarta-sans font-semibold text-blue-900 dark:text-blue-300 mb-1">
            Application Under Review
          </h3>
          <p className="font-inter text-sm text-blue-800 dark:text-blue-400">
            Your creator application is currently being reviewed by our team.
            We'll notify you once approved!
          </p>
        </div>
      </div>
    </div>
  );
}
