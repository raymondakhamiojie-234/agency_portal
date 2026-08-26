import { DollarSign } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/utils/loanHelpers";

export function LoanHistory({ loans }) {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 animate-fade-in-up"
      style={{ animationDelay: "0.4s" }}
    >
      <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-6">
        Loan History
      </h2>

      {loans.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            No loan history yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="border border-gray-100 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#726BFF]/10 dark:bg-[#6366FF]/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#726BFF] dark:text-[#6366FF]" />
                  </div>
                  <div>
                    <h3 className="font-plus-jakarta-sans font-semibold text-base text-[#111111] dark:text-white">
                      Loan Request
                    </h3>
                    <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                      {new Date(loan.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full font-inter text-xs font-medium ${getStatusColor(loan.status)}`}
                >
                  {getStatusIcon(loan.status)}
                  <span>{loan.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
                    Requested Amount
                  </p>
                  <p className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                    ${parseFloat(loan.requested_amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
                    Fee (15%)
                  </p>
                  <p className="font-plus-jakarta-sans font-semibold text-sm text-red-600 dark:text-red-400">
                    -${parseFloat(loan.fee_amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
                    Net Amount
                  </p>
                  <p className="font-plus-jakarta-sans font-semibold text-sm text-green-600 dark:text-green-400">
                    ${parseFloat(loan.net_amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 mb-1">
                    Repayment
                  </p>
                  <p className="font-plus-jakarta-sans font-semibold text-sm text-[#111111] dark:text-white">
                    {parseFloat(loan.repayment_progress || 0).toFixed(0)}%
                  </p>
                </div>
              </div>

              {loan.outstanding_balance &&
                parseFloat(loan.outstanding_balance) > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                        Outstanding Balance
                      </p>
                      <p className="font-plus-jakarta-sans font-semibold text-sm text-red-600 dark:text-red-400">
                        ${parseFloat(loan.outstanding_balance).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
