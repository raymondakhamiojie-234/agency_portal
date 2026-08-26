import {
  DollarSign,
  TrendingUp,
  Calendar,
  Shield,
  Receipt,
  Percent,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import { StatsCard } from "./StatsCard";

export function StatsGrid({ stats }) {
  const healthScore = stats?.accountHealth?.health_score || 100;
  const riskLevel = stats?.accountHealth?.risk_level || "Low";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Monthly Earnings */}
      <StatsCard
        icon={
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        title="Monthly Earnings"
        value={`$${stats?.monthlyEarnings?.toLocaleString() || "0.00"}`}
        badge={
          <>
            <ArrowUpRight
              size={16}
              className="text-green-600 dark:text-green-400"
            />
            <span className="text-green-600 dark:text-green-400">
              This month
            </span>
          </>
        }
        delay="0.3s"
      />

      {/* Withholding Tax */}
      <StatsCard
        icon={
          <Receipt className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        }
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        title="Withholding Tax"
        value={`$${stats?.withholdingTax?.toLocaleString() || "0.00"}`}
        badge={
          <>
            <ArrowDownRight
              size={16}
              className="text-orange-600 dark:text-orange-400"
            />
            <span className="text-orange-600 dark:text-orange-400">
              Deducted
            </span>
          </>
        }
        delay="0.35s"
      />

      {/* Contract Percentage */}
      <StatsCard
        icon={<Percent className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        title="Revenue Share"
        value={
          stats?.contractPercentage !== null
            ? `${stats.contractPercentage}%`
            : "—"
        }
        badge={
          <>
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400">Contract</span>
          </>
        }
        delay="0.4s"
      />

      {/* Contract Years */}
      <StatsCard
        icon={
          <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        }
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        title="Contract Period"
        value={
          stats?.contractYears !== null
            ? `${stats.contractYears} ${stats.contractYears === 1 ? "Year" : "Years"}`
            : "—"
        }
        delay="0.5s"
      />

      {/* Follower Count */}
      <StatsCard
        icon={<Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />}
        iconBgColor="bg-pink-100 dark:bg-pink-900/30"
        title="Followers/Subscribers"
        value={
          stats?.followerCount !== null
            ? stats.followerCount.toLocaleString()
            : "—"
        }
        badge={
          <>
            <TrendingUp
              size={16}
              className="text-pink-600 dark:text-pink-400"
            />
            <span className="text-pink-600 dark:text-pink-400">Audience</span>
          </>
        }
        delay="0.55s"
      />

      {/* Account Health */}
      <div
        className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              riskLevel === "Low"
                ? "bg-green-100 dark:bg-green-900/30"
                : riskLevel === "Medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
            }`}
          >
            <Shield
              className={`w-6 h-6 ${
                riskLevel === "Low"
                  ? "text-green-600 dark:text-green-400"
                  : riskLevel === "Medium"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            />
          </div>
          <span
            className={`font-inter text-xs font-medium px-2 py-1 rounded ${
              riskLevel === "Low"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : riskLevel === "Medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {riskLevel}
          </span>
        </div>
        <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
          Account Health
        </h3>
        <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
          {healthScore}/100
        </p>
      </div>
    </div>
  );
}
