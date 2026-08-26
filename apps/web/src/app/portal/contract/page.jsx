"use client";

import { useState } from "react";
import { useTheme } from "@/utils/ThemeProvider";
import PortalNav from "@/components/PortalNav";
import useUser from "@/utils/useUser";
import { useMasterContract } from "@/hooks/useMasterContract";
import { usePlatformContracts } from "@/hooks/usePlatformContracts";
import { useContractForm } from "@/hooks/useContractForm";
import { MasterContractSection } from "@/components/Contract/MasterContractSection";
import { SignModal } from "@/components/Contract/SignModal";
import { ConfirmModal } from "@/components/Contract/ConfirmModal";
import { ErrorAlert } from "@/components/Contract/ErrorAlert";
import { PlatformContractsSection } from "@/components/Contract/PlatformContractsSection";

export default function PlatformContractsPage() {
  const { theme } = useTheme();
  const { data: user } = useUser();

  const {
    masterContract,
    loadingMasterContract,
    generatingContract,
    signingContract,
    masterContractSigned,
    error: masterError,
    setError: setMasterError,
    handleGenerateContract,
    handleSignContract,
    fetchMasterContract,
  } = useMasterContract();

  const {
    contracts,
    loading,
    error: contractsError,
    setError: setContractsError,
    fetchContracts,
    handleDelete,
    handleSubmitForReview,
    totalFollowers,
    signedCount,
  } = usePlatformContracts();

  const {
    showForm,
    setShowForm,
    editingContract,
    formData,
    setFormData,
    error: formError,
    setError: setFormError,
    handleSubmit,
    editContract,
    resetForm,
  } = useContractForm(masterContractSigned, async () => {
    await fetchContracts();
    await fetchMasterContract();
  });

  const [showSignModal, setShowSignModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contractToSubmit, setContractToSubmit] = useState(null);

  const error = masterError || contractsError || formError;
  const setError = (err) => {
    setMasterError(err);
    setContractsError(err);
    setFormError(err);
  };

  const handleSignContractWrapper = async (signatureName) => {
    const success = await handleSignContract(signatureName);
    if (success) {
      await fetchContracts();
    }
    return success;
  };

  const handleSubmitContract = async () => {
    if (!contractToSubmit) return;

    const success = await handleSubmitForReview(contractToSubmit.id);
    if (success) {
      setShowConfirmModal(false);
      setContractToSubmit(null);
    }
  };

  const handleSubmitClick = (contract) => {
    setContractToSubmit(contract);
    setShowConfirmModal(true);
  };

  if (loadingMasterContract) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <PortalNav activePage="/portal/contract" />
        <div className="max-w-[1240px] mx-auto px-6 py-12">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <PortalNav activePage="/portal/contract" />

      <div className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Contracts
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Manage your contracts with Falcus Media
          </p>
        </div>

        <ErrorAlert error={error} onClose={() => setError(null)} />

        <MasterContractSection
          masterContract={masterContract}
          generatingContract={generatingContract}
          onGenerateContract={handleGenerateContract}
          onShowSignModal={() => setShowSignModal(true)}
        />

        {masterContractSigned && (
          <PlatformContractsSection
            contracts={contracts}
            totalFollowers={totalFollowers}
            signedCount={signedCount}
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            setFormData={setFormData}
            editingContract={editingContract}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onEdit={editContract}
            onDelete={handleDelete}
            onSubmitForReview={handleSubmitClick}
            masterContractSigned={masterContractSigned}
          />
        )}

        {showSignModal && (
          <SignModal
            onSign={handleSignContractWrapper}
            onClose={() => setShowSignModal(false)}
            signingContract={signingContract}
          />
        )}

        {showConfirmModal && (
          <ConfirmModal
            onConfirm={handleSubmitContract}
            onClose={() => {
              setShowConfirmModal(false);
              setContractToSubmit(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
