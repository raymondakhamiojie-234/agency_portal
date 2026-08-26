import { useState } from "react";

export function SignModal({ onSign, onClose, signingContract }) {
  const [signatureName, setSignatureName] = useState("");

  const handleSubmit = async () => {
    const success = await onSign(signatureName);
    if (success) {
      setSignatureName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-md w-full p-6">
        <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
          Sign Master Contract
        </h3>
        <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
          By signing this contract, you agree to the terms and conditions
          outlined in the master agreement.
        </p>
        <div className="mb-6">
          <label className="block font-inter font-medium text-sm text-[#111111] dark:text-white mb-2">
            Full Name (Signature) *
          </label>
          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white font-inter text-sm"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={signingContract || !signatureName.trim()}
            className="flex-1 px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200 disabled:opacity-50"
          >
            {signingContract ? "Signing..." : "Sign Contract"}
          </button>
          <button
            onClick={() => {
              setSignatureName("");
              onClose();
            }}
            className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white rounded-lg font-inter font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
