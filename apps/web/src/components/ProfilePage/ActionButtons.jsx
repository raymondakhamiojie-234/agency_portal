import { Save, X } from "lucide-react";

export function ActionButtons({ saving, onCancel }) {
  return (
    <div className="mt-6 flex items-center justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="inline-flex items-center space-x-2 bg-white dark:bg-[#0A0A0A] text-[#525252] dark:text-white border border-gray-200 dark:border-gray-700 font-plus-jakarta-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X size={16} />
        <span>Cancel</span>
      </button>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={16} />
        <span>{saving ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  );
}
