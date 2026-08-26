import { Clock, Upload } from "lucide-react";

export function RecentUploads({ recentUploads }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
          <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
            Recent Uploads
          </h2>
        </div>
        <span className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
          Last 10 earnings
        </span>
      </div>

      {recentUploads.length === 0 ? (
        <div className="text-center py-8">
          <Upload className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
            No earnings uploaded yet
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentUploads.map((earning) => (
            <div
              key={earning.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                    ${parseFloat(earning.amount).toFixed(2)}
                  </p>
                  <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                    · {earning.platform}
                  </span>
                </div>
                <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                  {earning.full_name || earning.page_name || earning.email} ·{" "}
                  {new Date(earning.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`font-inter text-xs font-medium px-2 py-1 rounded-full ${
                  earning.payout_status === "Completed"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                }`}
              >
                {earning.payout_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
