import { Shield, Award, Clock, CheckCircle } from "lucide-react";

export function MasterContractSection({
  masterContract,
  generatingContract,
  onGenerateContract,
  onShowSignModal,
}) {
  if (!masterContract) {
    return (
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              Master Agreement
            </h2>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              Your primary monetization agreement with Falcus Media
            </p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="text-center max-w-2xl mx-auto">
            <Award className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3">
              Generate Your Master Contract
            </h3>
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
              Start your journey with Falcus Media by generating your master
              monetization agreement. This contract establishes the foundation
              of our partnership.
            </p>
            <button
              onClick={onGenerateContract}
              disabled={generatingContract}
              className="px-8 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200 disabled:opacity-50"
            >
              {generatingContract
                ? "Generating..."
                : "Generate Master Contract"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (masterContract.status === "Pending Signature") {
    return (
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
              Master Agreement
            </h2>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              Your primary monetization agreement with Falcus Media
            </p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock
                  className="text-yellow-600 dark:text-yellow-400"
                  size={20}
                />
              </div>
              <div>
                <h3 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
                  Master Contract - Pending Your Signature
                </h3>
                <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Revenue Share: {100 - masterContract.revenue_share_percentage}
                  % to you, {masterContract.revenue_share_percentage}% to Falcus
                  Media
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-800 max-h-[400px] overflow-y-auto">
            <pre className="font-inter text-sm text-[#111111] dark:text-white whitespace-pre-wrap">
              {masterContract.contract_text}
            </pre>
          </div>

          <button
            onClick={onShowSignModal}
            className="px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
          >
            Sign Contract
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
            Master Agreement
          </h2>
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
            Your primary monetization agreement with Falcus Media
          </p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-3 mb-3">
          <CheckCircle
            className="text-green-600 dark:text-green-400"
            size={24}
          />
          <h3 className="font-plus-jakarta-sans font-bold text-lg text-green-900 dark:text-green-100">
            Master Contract Signed ✓
          </h3>
        </div>
        <p className="font-inter text-sm text-green-800 dark:text-green-200 mb-2">
          Signed on {new Date(masterContract.signed_at).toLocaleDateString()} by{" "}
          {masterContract.signature_name}
        </p>
        <p className="font-inter text-sm text-green-700 dark:text-green-300">
          Revenue Share: {100 - masterContract.revenue_share_percentage}% to
          you, {masterContract.revenue_share_percentage}% to Falcus Media
        </p>
      </div>
    </div>
  );
}
