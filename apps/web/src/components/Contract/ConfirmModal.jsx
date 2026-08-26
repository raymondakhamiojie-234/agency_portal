export function ConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-md w-full p-6">
        <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
          Submit Contract for Review?
        </h3>
        <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
          Once submitted, you won't be able to edit this contract until it's
          reviewed by our team.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
          >
            Yes, Submit
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white rounded-lg font-inter font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
