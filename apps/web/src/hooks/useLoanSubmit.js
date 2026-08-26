import { useState } from "react";

export function useLoanSubmit(
  requestedAmount,
  maxLoan,
  interestRate,
  feeAmount,
  netAmount,
  agreedToTerms,
  outstandingLoan,
  onSuccess,
) {
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmitLoan = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setSubmitStatus({
        type: "error",
        message: "You must agree to the terms and conditions to proceed.",
      });
      return;
    }

    if (outstandingLoan) {
      setSubmitStatus({
        type: "error",
        message:
          "You have an outstanding loan. Please clear it before requesting a new one.",
      });
      return;
    }

    if (requestedAmount > maxLoan) {
      setSubmitStatus({
        type: "error",
        message: `Loan amount cannot exceed 50% of your yearly earnings ($${maxLoan.toFixed(2)}).`,
      });
      return;
    }

    if (requestedAmount <= 0) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid loan amount.",
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/advance-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_amount: requestedAmount,
          fee_percentage: interestRate * 100,
          fee_amount: feeAmount,
          net_amount: netAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request loan");
      }

      setSubmitStatus({
        type: "success",
        message:
          "Loan request submitted successfully! Our team will review and process it shortly.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        type: "error",
        message:
          err.message || "Failed to submit loan request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    submitStatus,
    handleSubmitLoan,
    setSubmitStatus,
  };
}
