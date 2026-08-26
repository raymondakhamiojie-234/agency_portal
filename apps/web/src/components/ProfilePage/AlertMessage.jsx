export function AlertMessage({ type, message }) {
  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "bg-green-50 dark:bg-green-900/20"
    : "bg-red-50 dark:bg-red-900/20";
  const borderColor = isSuccess
    ? "border-green-200 dark:border-green-800"
    : "border-red-200 dark:border-red-800";
  const iconBgColor = isSuccess
    ? "bg-green-100 dark:bg-green-900/30"
    : "bg-red-100 dark:bg-red-900/30";
  const iconColor = isSuccess
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const textColor = isSuccess
    ? "text-green-800 dark:text-green-300"
    : "text-red-800 dark:text-red-300";
  const icon = isSuccess ? "✓" : "✕";

  return (
    <div className={`mb-6 ${bgColor} border ${borderColor} rounded-xl p-5`}>
      <div className="flex items-center space-x-3">
        <div
          className={`w-5 h-5 ${iconBgColor} rounded-full flex items-center justify-center`}
        >
          <span className={`${iconColor} text-xs`}>{icon}</span>
        </div>
        <p className={`font-inter text-sm ${textColor}`}>{message}</p>
      </div>
    </div>
  );
}
