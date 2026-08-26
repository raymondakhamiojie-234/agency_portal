"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import { useAdvanceData } from "@/hooks/useAdvanceData";
import { useLoanSubmit } from "@/hooks/useLoanSubmit";
import { LoadingState } from "@/components/AdvancePayout/LoadingState";
import { OutstandingLoanAlert } from "@/components/AdvancePayout/OutstandingLoanAlert";
import { LoanRequestForm } from "@/components/AdvancePayout/LoanRequestForm";
import { LoanAgreement } from "@/components/AdvancePayout/LoanAgreement";
import { LoanHistory } from "@/components/AdvancePayout/LoanHistory";

export default function AdvancePayoutPage() {
  const { data: user, loading: userLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { financeData, loading, loanHistory, outstandingLoan, refetchData } =
    useAdvanceData(user, userLoading);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalClientEarnings = financeData?.totals?.yearlyClientEarnings || 0;
  const maxLoan = parseFloat(totalClientEarnings) * 0.5;
  const interestRate = 0.15;
  const requestedAmount = parseFloat(loanAmount) || 0;
  const feeAmount = requestedAmount * interestRate;
  const netAmount = requestedAmount - feeAmount;

  const handleSuccess = () => {
    setLoanAmount("");
    setAgreedToTerms(false);
    setTimeout(() => {
      refetchData();
    }, 2000);
  };

  const { submitting, submitStatus, handleSubmitLoan } = useLoanSubmit(
    requestedAmount,
    maxLoan,
    interestRate,
    feeAmount,
    netAmount,
    agreedToTerms,
    outstandingLoan,
    handleSuccess,
  );

  if (userLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/advance" />

      <main
        className={`max-w-[1240px] mx-auto px-6 py-8 ${mounted ? "page-enter-active" : "page-enter"}`}
      >
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Advance Payout
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Get up to 50% of your yearly earnings as an advance payment
          </p>
        </div>

        <OutstandingLoanAlert loan={outstandingLoan} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <LoanRequestForm
            totalClientEarnings={totalClientEarnings}
            maxLoan={maxLoan}
            revenueSharePercentage={
              financeData?.totals?.revenueSharePercentage || 0
            }
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            requestedAmount={requestedAmount}
            feeAmount={feeAmount}
            netAmount={netAmount}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            outstandingLoan={outstandingLoan}
            submitStatus={submitStatus}
            submitting={submitting}
            onSubmit={handleSubmitLoan}
          />

          <LoanAgreement />
        </div>

        <LoanHistory loans={loanHistory} />

        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .page-enter {
            opacity: 0;
          }

          .page-enter-active {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }
        `}</style>
      </main>
    </div>
  );
}
