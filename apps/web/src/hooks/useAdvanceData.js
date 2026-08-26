import { useState, useEffect } from "react";

export function useAdvanceData(user, userLoading) {
  const [profile, setProfile] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanHistory, setLoanHistory] = useState([]);
  const [outstandingLoan, setOutstandingLoan] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      fetchData();
    }
  }, [user, userLoading]);

  const fetchData = async () => {
    try {
      const profileResponse = await fetch("/api/creator-profile");
      if (!profileResponse.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileResponse.json();
      setProfile(profileData.profile);

      const financeResponse = await fetch("/api/finance");
      if (!financeResponse.ok) throw new Error("Failed to fetch finance data");
      const financeResult = await financeResponse.json();
      setFinanceData(financeResult.data);

      const loanResponse = await fetch("/api/advance-payout");
      if (loanResponse.ok) {
        const loanData = await loanResponse.json();
        setLoanHistory(loanData.loans || []);

        const outstanding = loanData.loans.find(
          (loan) => loan.status === "Pending" || loan.status === "Approved",
        );
        setOutstandingLoan(outstanding || null);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return {
    profile,
    financeData,
    loading,
    loanHistory,
    outstandingLoan,
    refetchData: fetchData,
  };
}
