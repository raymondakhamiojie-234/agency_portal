import { XCircle } from "lucide-react";

export function ErrorAlert({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
      <XCircle
        className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
        size={20}
      />
      <div className="flex-1">
        <p className="font-inter text-red-900 dark:text-red-300 text-sm">
          {error}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
      >
        ×
      </button>
    </div>
  );
}
