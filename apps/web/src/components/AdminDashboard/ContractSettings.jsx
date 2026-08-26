import { useState } from "react";
import { Settings, Edit2 } from "lucide-react";

export function ContractSettings({ settings, onUpdate }) {
  const [editingPercentage, setEditingPercentage] = useState(false);
  const [newPercentage, setNewPercentage] = useState(
    settings?.default_contract_percentage?.value || "20",
  );
  const [error, setError] = useState("");

  const handleUpdatePercentage = async () => {
    setError("");

    const percentage = parseFloat(newPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setError("Please enter a valid percentage between 0 and 100");
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settingKey: "default_contract_percentage",
          settingValue: newPercentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update percentage");
      }

      setEditingPercentage(false);
      if (onUpdate) {
        onUpdate("Default contract percentage updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update percentage");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Settings className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Contract Settings
        </h2>
      </div>
      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
        Set the default revenue share percentage for new contracts
      </p>
      {error && (
        <p className="font-inter text-sm text-red-600 dark:text-red-400 mb-2">
          {error}
        </p>
      )}
      <div className="flex items-center space-x-4">
        {editingPercentage ? (
          <>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={newPercentage}
              onChange={(e) => setNewPercentage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
              placeholder="Enter percentage"
            />
            <button
              onClick={handleUpdatePercentage}
              className="bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingPercentage(false);
                setNewPercentage(
                  settings?.default_contract_percentage?.value || "20",
                );
                setError("");
              }}
              className="bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg px-4 py-3">
              <span className="font-plus-jakarta-sans font-bold text-2xl text-[#726BFF] dark:text-[#6366FF]">
                {settings?.default_contract_percentage?.value || "20"}%
              </span>
            </div>
            <button
              onClick={() => setEditingPercentage(true)}
              className="bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200 flex items-center space-x-2"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
