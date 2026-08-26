import { User } from "lucide-react";

export function PersonalDetailsSection({
  editing,
  fullName,
  setFullName,
  dateOfBirth,
  setDateOfBirth,
  homeAddress,
  setHomeAddress,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Personal Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {fullName || "—"}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Date of Birth
          </label>
          {editing ? (
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : "—"}
            </p>
          )}
        </div>

        {/* Home Address */}
        <div className="md:col-span-2">
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Home Address
          </label>
          {editing ? (
            <textarea
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
              placeholder="123 Main Street, Apartment 4B, City, State, ZIP"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3 whitespace-pre-line">
              {homeAddress || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
