import { AlertTriangle } from "lucide-react";

export function OutstandingLoanAlert({ loan }) {
  if (!loan) return null;

  return (
    <div
      className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 animate-fade-in-up"
      style={{ animationDelay: "0.15s" }}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-plus-jakarta-sans font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-2">
            Outstanding Loan
          </h3>
          <p className="font-inter text-sm text-yellow-700 dark:text-yellow-400 mb-3">
            You have an outstanding loan of $
            {parseFloat(
              loan.outstanding_balance || loan.requested_amount,
            ).toLocaleString()}
            . Please clear this before requesting a new loan.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-inter text-yellow-600 dark:text-yellow-500">
                Loan Amount
              </p>
              <p className="font-plus-jakarta-sans font-semibold text-yellow-800 dark:text-yellow-300">
                ${parseFloat(loan.requested_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-inter text-yellow-600 dark:text-yellow-500">
                Fee (15%)
              </p>
              <p className="font-plus-jakarta-sans font-semibold text-yellow-800 dark:text-yellow-300">
                ${parseFloat(loan.fee_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-inter text-yellow-600 dark:text-yellow-500">
                You Received
              </p>
              <p className="font-plus-jakarta-sans font-semibold text-yellow-800 dark:text-yellow-300">
                ${parseFloat(loan.net_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-inter text-yellow-600 dark:text-yellow-500">
                Repayment
              </p>
              <p className="font-plus-jakarta-sans font-semibold text-yellow-800 dark:text-yellow-300">
                {parseFloat(loan.repayment_progress || 0).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
