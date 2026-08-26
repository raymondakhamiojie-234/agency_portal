import { Users, MessageSquare, DollarSign, FileText } from "lucide-react";

export function StatsGrid({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Users className="w-8 h-8 text-[#726BFF] dark:text-[#6366FF]" />
        </div>
        <h3 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-1">
          {stats.totalCreators}
        </h3>
        <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
          Total Creators
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <FileText className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-1">
          {stats.activeContracts}
        </h3>
        <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
          Active Contracts
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <MessageSquare className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-1">
          {stats.pendingTestimonials}
        </h3>
        <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
          Pending Testimonials
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-1">
          ${stats.totalEarningsPaid.toLocaleString()}
        </h3>
        <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
          Total Paid Out
        </p>
      </div>
    </div>
  );
}
