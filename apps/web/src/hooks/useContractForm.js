import { useState } from "react";

export function useContractForm(masterContractSigned, onSuccess) {
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    platform: "",
    account_name: "",
    account_url: "",
    followers_count: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!masterContractSigned) {
      setError(
        "You must complete your master contract with Falcus Media before creating platform contracts.",
      );
      return;
    }

    try {
      setError(null);
      const url = editingContract
        ? `/api/platform-contracts/${editingContract.id}`
        : "/api/platform-contracts";

      const method = editingContract ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          followers_count: parseInt(formData.followers_count),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save contract");
      }

      if (onSuccess) {
        await onSuccess();
      }
      resetForm();
    } catch (error) {
      console.error("Error saving contract:", error);
      setError(error.message);
    }
  };

  const editContract = (contract) => {
    setEditingContract(contract);
    setFormData({
      platform: contract.platform,
      account_name: contract.account_name,
      account_url: contract.account_url,
      followers_count: contract.followers_count.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      platform: "",
      account_name: "",
      account_url: "",
      followers_count: "",
    });
    setEditingContract(null);
    setShowForm(false);
  };

  return {
    showForm,
    setShowForm,
    editingContract,
    formData,
    setFormData,
    error,
    setError,
    handleSubmit,
    editContract,
    resetForm,
  };
}
