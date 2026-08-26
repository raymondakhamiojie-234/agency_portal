import { DollarSign } from "lucide-react";

export function RecentEarnings({ stats }) {
  return (
    <div
      className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.7s" }}
    >
      <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
        Recent Earnings by Platform
      </h2>
      {stats?.recentEarnings && stats.recentEarnings.length > 0 ? (
        <div className="space-y-4">
          {stats.recentEarnings.map((earning, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg animate-slide-in-left"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {earning.platform.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-inter font-medium text-[#111111] dark:text-white">
                    {earning.platform}
                  </p>
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                    {earning.count} transaction
                    {earning.count !== 1 ? "s" : ""} (Last 7 days)
                  </p>
                </div>
              </div>
              <p className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
                ${parseFloat(earning.total).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
            No earnings recorded in the last 7 days
          </p>
        </div>
      )}
    </div>
  );
}
