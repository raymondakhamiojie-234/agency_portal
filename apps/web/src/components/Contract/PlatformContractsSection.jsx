import { useState } from "react";
import { FileText } from "lucide-react";
import { StatsCards } from "./StatsCards";
import { ContractFilters } from "./ContractFilters";
import { ContractForm } from "./ContractForm";
import { ContractsList } from "./ContractsList";

export function PlatformContractsSection({
  contracts,
  totalFollowers,
  signedCount,
  showForm,
  setShowForm,
  formData,
  setFormData,
  editingContract,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  onSubmitForReview,
  masterContractSigned,
}) {
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredContracts = contracts.filter((contract) => {
    if (filterPlatform && contract.platform !== filterPlatform) return false;
    if (filterStatus && contract.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
            Platform Contracts
          </h2>
          <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
            Manage your individual social media platform contracts
          </p>
        </div>
      </div>

      <StatsCards
        totalContracts={contracts.length}
        signedCount={signedCount}
        totalFollowers={totalFollowers}
      />

      <ContractFilters
        filterPlatform={filterPlatform}
        setFilterPlatform={setFilterPlatform}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showForm={showForm}
        onAddContract={() => setShowForm(true)}
      />

      {showForm && (
        <ContractForm
          formData={formData}
          setFormData={setFormData}
          editingContract={editingContract}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}

      <ContractsList
        contracts={filteredContracts}
        masterContractSigned={masterContractSigned}
        showForm={showForm}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmitForReview}
        onAddContract={() => setShowForm(true)}
      />
    </div>
  );
}
