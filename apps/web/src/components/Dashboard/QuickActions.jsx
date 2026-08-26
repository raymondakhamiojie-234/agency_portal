export function QuickActions({ stats }) {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.8s" }}
    >
      <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        <a
          href="/portal/profile"
          className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors duration-200"
        >
          <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
            View Profile
          </p>
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mt-0.5">
            Update your personal information
          </p>
        </a>
        <a
          href="/portal/services"
          className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors duration-200"
        >
          <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
            View Services
          </p>
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mt-0.5">
            Manage your active services
          </p>
        </a>
        <a
          href="/portal/advance"
          className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors duration-200"
        >
          <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
            Request Advance
          </p>
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mt-0.5">
            Get early access to earnings
          </p>
        </a>
        <a
          href="/portal/finance"
          className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors duration-200"
        >
          <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
            View Finances
          </p>
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mt-0.5">
            Check earnings & payouts
          </p>
        </a>
        <a
          href="/portal/support"
          className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors duration-200"
        >
          <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
            Get Support
          </p>
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mt-0.5">
            Contact your account manager
          </p>
        </a>
      </div>

      {/* Pending Advance Notice */}
      {stats?.pendingAdvance > 0 && (
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="font-inter text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">
            Outstanding Advance
          </p>
          <p className="font-plus-jakarta-sans font-bold text-lg text-orange-900 dark:text-orange-200">
            ${stats.pendingAdvance.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
