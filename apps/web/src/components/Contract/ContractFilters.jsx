import { Plus } from "lucide-react";

export function ContractFilters({
  filterPlatform,
  setFilterPlatform,
  filterStatus,
  setFilterStatus,
  showForm,
  onAddContract,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] text-[#111111] dark:text-white font-inter text-sm"
        >
          <option value="">All Platforms</option>
          <option value="Facebook">Facebook</option>
          <option value="YouTube">YouTube</option>
          <option value="TikTok">TikTok</option>
          <option value="Instagram">Instagram</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] text-[#111111] dark:text-white font-inter text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Signed">Signed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {!showForm && (
        <button
          onClick={onAddContract}
          className="flex items-center space-x-2 px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
        >
          <Plus size={18} />
          <span>Add Platform Contract</span>
        </button>
      )}
    </div>
  );
}
