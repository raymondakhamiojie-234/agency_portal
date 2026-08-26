import { useState, useEffect } from "react";

export function usePlatformContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/platform-contracts");
      if (!response.ok) throw new Error("Failed to fetch contracts");
      const data = await response.json();
      setContracts(data.contracts || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contract?")) return;

    try {
      const response = await fetch(`/api/platform-contracts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete contract");
      }

      await fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      setError(error.message);
    }
  };

  const handleSubmitForReview = async (contractId) => {
    try {
      const response = await fetch("/api/platform-contracts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_id: contractId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit contract");
      }

      await fetchContracts();
      return true;
    } catch (error) {
      console.error("Error submitting contract:", error);
      setError(error.message);
      return false;
    }
  };

  const totalFollowers = contracts.reduce((sum, contract) => {
    return contract.status === "Signed" ? sum + contract.followers_count : sum;
  }, 0);

  const signedCount = contracts.filter((c) => c.status === "Signed").length;

  return {
    contracts,
    loading,
    error,
    setError,
    fetchContracts,
    handleDelete,
    handleSubmitForReview,
    totalFollowers,
    signedCount,
  };
}
