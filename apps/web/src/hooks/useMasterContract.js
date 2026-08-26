import { useState, useEffect } from "react";

export function useMasterContract() {
  const [masterContract, setMasterContract] = useState(null);
  const [loadingMasterContract, setLoadingMasterContract] = useState(true);
  const [generatingContract, setGeneratingContract] = useState(false);
  const [signingContract, setSigningContract] = useState(false);
  const [masterContractSigned, setMasterContractSigned] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMasterContract();
  }, []);

  const fetchMasterContract = async () => {
    try {
      setLoadingMasterContract(true);
      const response = await fetch("/api/contract");
      if (response.ok) {
        const data = await response.json();
        setMasterContract(data.contract);
        setMasterContractSigned(data.contract?.status === "Signed");
      } else if (response.status === 404) {
        setMasterContract(null);
        setMasterContractSigned(false);
      }
    } catch (error) {
      console.error("Error fetching master contract:", error);
    } finally {
      setLoadingMasterContract(false);
    }
  };

  const handleGenerateContract = async () => {
    try {
      setGeneratingContract(true);
      setError(null);

      const response = await fetch("/api/contract/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate contract");
      }

      setMasterContract(data.contract);
      setError(null);
    } catch (error) {
      console.error("Error generating contract:", error);
      setError(error.message);
    } finally {
      setGeneratingContract(false);
    }
  };

  const handleSignContract = async (signatureName) => {
    if (!signatureName.trim()) {
      setError("Please enter your full name to sign");
      return false;
    }

    try {
      setSigningContract(true);
      setError(null);

      const response = await fetch("/api/contract/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureName: signatureName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign contract");
      }

      setMasterContract(data.contract);
      setMasterContractSigned(true);
      return true;
    } catch (error) {
      console.error("Error signing contract:", error);
      setError(error.message);
      return false;
    } finally {
      setSigningContract(false);
    }
  };

  return {
    masterContract,
    loadingMasterContract,
    generatingContract,
    signingContract,
    masterContractSigned,
    error,
    setError,
    handleGenerateContract,
    handleSignContract,
    fetchMasterContract,
  };
}
