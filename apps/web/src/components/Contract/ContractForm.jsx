import { platformLabels } from "@/constants/platformConstants";

export function ContractForm({
  formData,
  setFormData,
  editingContract,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="mb-8 p-6 bg-gray-50 dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800">
      <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-6">
        {editingContract ? "Edit Contract" : "Create New Contract"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block font-inter font-medium text-sm text-[#111111] dark:text-white mb-2">
            Platform *
          </label>
          <select
            required
            value={formData.platform}
            onChange={(e) =>
              setFormData({ ...formData, platform: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white font-inter text-sm"
          >
            <option value="">Select a platform</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        {formData.platform && (
          <>
            <div>
              <label className="block font-inter font-medium text-sm text-[#111111] dark:text-white mb-2">
                {platformLabels[formData.platform]} *
              </label>
              <input
                type="text"
                required
                value={formData.account_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    account_name: e.target.value,
                  })
                }
                placeholder={`Enter your ${platformLabels[formData.platform]}`}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white font-inter text-sm"
              />
            </div>

            <div>
              <label className="block font-inter font-medium text-sm text-[#111111] dark:text-white mb-2">
                Account URL *
              </label>
              <input
                type="url"
                required
                value={formData.account_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    account_url: e.target.value,
                  })
                }
                placeholder={`https://${formData.platform.toLowerCase()}.com/your-account`}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white font-inter text-sm"
              />
            </div>

            <div>
              <label className="block font-inter font-medium text-sm text-[#111111] dark:text-white mb-2">
                Current Follower/Subscriber Count *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.followers_count}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followers_count: e.target.value,
                  })
                }
                placeholder="Enter follower count"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white font-inter text-sm"
              />
            </div>
          </>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
          >
            {editingContract ? "Update Contract" : "Generate & Save Contract"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white rounded-lg font-inter font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
