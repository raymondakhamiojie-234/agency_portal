import { useState } from "react";
import {
  Users,
  Search,
  Edit2,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function CreatorsTable({
  creators,
  onUpdateStatus,
  onUpdatePercentage,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCreator, setEditingCreator] = useState(null);

  const filteredCreators = creators.filter(
    (creator) =>
      creator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.page_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUpdatePercentage = (creatorId) => {
    const input = document.getElementById(`creator-percentage-${creatorId}`);
    if (onUpdatePercentage) {
      onUpdatePercentage(creatorId, input.value);
    }
    setEditingCreator(null);
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          All Creators ({creators.length})
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search creators..."
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Creator
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Contact
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Platform
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Followers
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Contract %
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Status
              </th>
              <th className="text-left pb-3 font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCreators.map((creator) => (
              <tr
                key={creator.id}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="py-4">
                  <div>
                    <p className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                      {creator.full_name}
                    </p>
                    {creator.brand_name && (
                      <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                        {creator.brand_name}
                      </p>
                    )}
                    {creator.page_name && (
                      <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                        @{creator.page_name}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="space-y-1">
                    {creator.email && (
                      <div className="flex items-center space-x-2">
                        <Mail size={12} className="text-gray-400" />
                        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                          {creator.email}
                        </p>
                      </div>
                    )}
                    {creator.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone size={12} className="text-gray-400" />
                        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                          {creator.phone_number}
                        </p>
                      </div>
                    )}
                    {creator.country && (
                      <div className="flex items-center space-x-2">
                        <Globe size={12} className="text-gray-400" />
                        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                          {creator.country}
                        </p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <p className="font-inter text-sm text-[#111111] dark:text-white">
                    {creator.primary_platform || "N/A"}
                  </p>
                </td>
                <td className="py-4">
                  <p className="font-inter text-sm text-[#111111] dark:text-white">
                    {creator.follower_count
                      ? creator.follower_count.toLocaleString()
                      : "N/A"}
                  </p>
                </td>
                <td className="py-4">
                  {editingCreator === creator.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        defaultValue={creator.revenue_share_percentage || ""}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdatePercentage(creator.id);
                          }
                        }}
                        className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                        placeholder="%"
                        id={`creator-percentage-${creator.id}`}
                      />
                      <button
                        onClick={() => handleUpdatePercentage(creator.id)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => setEditingCreator(null)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-inter text-sm text-[#111111] dark:text-white">
                        {creator.revenue_share_percentage
                          ? `${creator.revenue_share_percentage}%`
                          : "N/A"}
                      </span>
                      <button
                        onClick={() => setEditingCreator(creator.id)}
                        className="text-[#726BFF] dark:text-[#6366FF] hover:text-[#5E55FF] dark:hover:text-[#5558FF]"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-4">
                  <select
                    value={creator.account_status}
                    onChange={(e) => {
                      if (onUpdateStatus) {
                        onUpdateStatus(creator.id, e.target.value);
                      }
                    }}
                    className={`font-inter text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer ${
                      creator.account_status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : creator.account_status === "Under Review"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          : creator.account_status === "Suspended"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="py-4">
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                    {new Date(creator.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
            {searchTerm
              ? "No creators found matching your search"
              : "No creators registered yet"}
          </p>
        </div>
      )}
    </div>
  );
}
