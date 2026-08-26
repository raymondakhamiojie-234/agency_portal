import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";

export function LoanRequestForm({
  totalClientEarnings,
  maxLoan,
  revenueSharePercentage,
  loanAmount,
  setLoanAmount,
  requestedAmount,
  feeAmount,
  netAmount,
  agreedToTerms,
  setAgreedToTerms,
  outstandingLoan,
  submitStatus,
  submitting,
  onSubmit,
}) {
  return (
    <div className="lg:col-span-1">
      <div
        className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
          Request Loan
        </h2>

        <div className="mb-6 p-4 bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-lg">
          <p className="font-inter text-xs text-white/70 mb-1">
            Your Yearly Earnings
          </p>
          <p className="font-plus-jakarta-sans font-bold text-2xl text-white">
            ${parseFloat(totalClientEarnings).toFixed(2)}
          </p>
          <p className="font-inter text-xs text-white/70 mt-2">
            Max Loan (50%)
          </p>
          <p className="font-plus-jakarta-sans font-semibold text-lg text-white">
            ${maxLoan.toFixed(2)}
          </p>
          <p className="font-inter text-xs text-white/60 mt-1">
            After {revenueSharePercentage}% revenue share
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
              Loan Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={maxLoan}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
                disabled={!!outstandingLoan}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-[#726BFF] dark:focus:border-[#6366FF] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <p className="mt-1 font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
              Maximum: ${maxLoan.toFixed(2)}
            </p>
          </div>

          {requestedAmount > 0 && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-[#262626] rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Requested Amount:
                </span>
                <span className="font-inter text-sm font-semibold text-[#111111] dark:text-white">
                  ${requestedAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Fee (15%):
                </span>
                <span className="font-inter text-sm font-semibold text-red-600 dark:text-red-400">
                  -${feeAmount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="font-inter text-sm font-semibold text-[#111111] dark:text-white">
                  You'll Receive:
                </span>
                <span className="font-plus-jakarta-sans text-base font-bold text-[#726BFF] dark:text-[#6366FF]">
                  ${netAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={!!outstandingLoan}
                className="mt-1 w-4 h-4 text-[#726BFF] dark:text-[#6366FF] border-gray-300 rounded focus:ring-[#726BFF] dark:focus:ring-[#6366FF] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                I have read and agree to the Loan Agreement terms and conditions
                below
              </span>
            </label>
          </div>

          {submitStatus && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start space-x-3 ${submitStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400"}`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <p className="font-inter text-sm">{submitStatus.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !!outstandingLoan ||
              !agreedToTerms ||
              requestedAmount <= 0 ||
              requestedAmount > maxLoan
            }
            className="w-full px-6 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] transition-all duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <DollarSign size={18} />
            <span>{submitting ? "Processing..." : "Request Loan"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
