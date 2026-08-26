export function StatsCard({
  icon,
  title,
  value,
  badge,
  delay,
  iconBgColor,
  iconColor,
}) {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
        >
          {icon}
        </div>
        {badge && (
          <div className="flex items-center space-x-1 text-xs font-medium">
            {badge}
          </div>
        )}
      </div>
      <h3 className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
        {title}
      </h3>
      <p className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
        {value}
      </p>
    </div>
  );
}
