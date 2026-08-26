import { Info } from "lucide-react";

export function LoanAgreement() {
  return (
    <div className="lg:col-span-2">
      <div
        className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-6">
          Loan Agreement
        </h2>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
            At Falcus Media, we go beyond social media management by providing
            our clients with opportunities for financial growth. As part of our
            commitment to supporting creators and businesses under our
            management, we now offer access to loans directly through our
            company.
          </p>

          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
            This initiative is designed to help our clients scale their content,
            invest in their platforms, and achieve their business goals without
            financial constraints. By offering this financial support, we ensure
            that our partners have the resources they need to thrive in the
            ever-evolving digital landscape.
          </p>

          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
            Falcus Media remains dedicated to fostering success, innovation, and
            long-term growth for all our clients.
          </p>

          <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4 mt-8">
            Terms & Requirements
          </h3>

          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
            At Falcus Media, we are committed to supporting the financial growth
            of our clients. To further assist creators and businesses under our
            management, we offer a structured loan program designed to provide
            financial flexibility while ensuring responsible repayment. Below
            are the detailed terms and requirements for eligibility and loan
            repayment.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="font-inter text-sm font-semibold text-yellow-800 dark:text-yellow-400">
              All Terms & Requirements must be fulfilled before any loan can be
              given or granted.
            </p>
          </div>

          <h4 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white mb-3 mt-6">
            Eligibility Criteria
          </h4>

          <div className="space-y-4 mb-6">
            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Must Be Under Falcus Media's Management:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  To qualify for a loan, you must be an active client under the
                  management of Falcus Media.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  This means you should have an ongoing contract with us,
                  actively working on monetized content, and benefiting from our
                  services.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Clients who are not yet under our management will not be
                  considered for loans.
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Accurate and Up-to-Date Information is Required:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  When applying for a loan, all details provided must be
                  correct, verified, and updated.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Any discrepancies, false information, or outdated records may
                  lead to disqualification from receiving a loan.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Falcus Media reserves the right to conduct due diligence on
                  the provided information before approving the loan request.
                </li>
              </ul>
            </div>
          </div>

          <h4 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white mb-3 mt-6">
            Loan Terms and Conditions
          </h4>

          <div className="space-y-4 mb-6">
            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Fixed Interest Rate:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  The interest rate applied to any approved loan is 15% of the
                  loan amount.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  This interest is fixed and must be repaid along with the
                  principal amount within the stipulated period.
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Loan Limit Based on Earnings:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  The maximum loan amount you can request is capped at 50% of
                  your total earnings from Falcus Media.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  This ensures responsible lending and prevents excessive
                  financial burden on the client.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  The loan will be deducted directly from your next payment
                  cycle, meaning your future earnings will be used for
                  repayment.
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Loan Repayment Period:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  All loans granted must be repaid in the next payment cycle
                  following the loan disbursement.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  This means that once you receive your next scheduled payment
                  from Falcus Media, the loan amount along with the interest
                  will be deducted automatically.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Failure to repay within this period will lead to additional
                  penalties.
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                No Existing Payout or Monetization Issues:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Clients who have unresolved payout issues or content
                  monetization violations will not be eligible for a loan.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  A clean financial record with Falcus Media is required to
                  qualify for financial assistance.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  If any violation or issue arises after loan approval but
                  before repayment, the loan may be subject to stricter
                  repayment terms.
                </li>
              </ul>
            </div>
          </div>

          <h4 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white mb-3 mt-6">
            Late Payment Penalties
          </h4>

          <div className="space-y-4 mb-6">
            <div>
              <h5 className="font-inter font-semibold text-sm text-[#111111] dark:text-white mb-2">
                Additional Interest for Late Repayments:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  If the loan is not repaid within 30 days after the due date,
                  an additional interest rate of 0.5% per day will be applied to
                  the outstanding amount.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  This penalty will continue accumulating daily until the full
                  amount is cleared.
                </li>
                <li className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  Clients are strongly encouraged to repay on time to avoid
                  extra financial obligations.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Info
                size={20}
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              />
              <p className="font-inter text-sm text-blue-800 dark:text-blue-400">
                By submitting a loan request, you acknowledge that you have
                read, understood, and agreed to all the terms and conditions
                outlined in this Loan Agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
