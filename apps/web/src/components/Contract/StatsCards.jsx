import { FileText, CheckCircle } from "lucide-react";

export function StatsCards({ totalContracts, signedCount, totalFollowers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-sm text-purple-700 dark:text-purple-300">
            Total Contracts
          </span>
          <FileText
            size={20}
            className="text-purple-600 dark:text-purple-400"
          />
        </div>
        <p className="font-plus-jakarta-sans font-bold text-3xl text-purple-900 dark:text-purple-100">
          {totalContracts}
        </p>
      </div>

      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-sm text-green-700 dark:text-green-300">
            Signed Contracts
          </span>
          <CheckCircle
            size={20}
            className="text-green-600 dark:text-green-400"
          />
        </div>
        <p className="font-plus-jakarta-sans font-bold text-3xl text-green-900 dark:text-green-100">
          {signedCount}
        </p>
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-sm text-blue-700 dark:text-blue-300">
            Total Followers
          </span>
          <span className="text-xl">👥</span>
        </div>
        <p className="font-plus-jakarta-sans font-bold text-3xl text-blue-900 dark:text-blue-100">
          {totalFollowers.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
