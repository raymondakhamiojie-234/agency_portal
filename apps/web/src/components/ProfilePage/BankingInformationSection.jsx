import { CreditCard } from "lucide-react";

export function BankingInformationSection({
  editing,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  bankAccountNumber,
  setBankAccountNumber,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Banking Information
        </h2>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="font-inter text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Your banking information is encrypted and
          securely stored. This information is used for payouts only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Name */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Bank Name
          </label>
          {editing ? (
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
              placeholder="e.g., Chase Bank"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {bankName || "—"}
            </p>
          )}
        </div>

        {/* Account Name */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Account Name
          </label>
          {editing ? (
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
              placeholder="e.g., John Doe"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {accountName || "—"}
            </p>
          )}
        </div>

        {/* Bank Account Number */}
        <div className="md:col-span-2">
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Bank Account Number
          </label>
          {editing ? (
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
              placeholder="e.g., 1234567890"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {bankAccountNumber ? `••••••${bankAccountNumber.slice(-4)}` : "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
