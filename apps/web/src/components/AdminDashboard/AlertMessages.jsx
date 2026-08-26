import { CheckCircle, AlertCircle } from "lucide-react";

export function AlertMessages({ success, error }) {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="font-inter text-sm text-green-800 dark:text-green-300">
              {success}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="font-inter text-sm text-red-800 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
