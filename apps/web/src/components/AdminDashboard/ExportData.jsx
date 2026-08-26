import { useState } from "react";
import { Download } from "lucide-react";

export function ExportData({ onExportSuccess, onExportError }) {
  const [exportingData, setExportingData] = useState(false);

  const handleExportEarnings = async () => {
    setExportingData(true);

    try {
      const response = await fetch("/api/admin/earnings/export");

      if (!response.ok) {
        throw new Error("Failed to export earnings");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earnings_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      if (onExportSuccess) {
        onExportSuccess("Earnings data exported successfully!");
      }
    } catch (err) {
      console.error(err);
      if (onExportError) {
        onExportError("Failed to export earnings data");
      }
    } finally {
      setExportingData(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Download className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Export Data
        </h2>
      </div>
      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
        Download all earnings data as a CSV file for your records or analysis.
      </p>
      <button
        onClick={handleExportEarnings}
        disabled={exportingData}
        className="w-full bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-3 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Download size={16} />
        <span>{exportingData ? "Exporting..." : "Export All Earnings"}</span>
      </button>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="font-inter text-xs text-blue-800 dark:text-blue-300">
          💡 The export includes all earnings with creator details, platforms,
          amounts, and dates.
        </p>
      </div>
    </div>
  );
}
