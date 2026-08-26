import { FileText } from "lucide-react";
import { ContractCard } from "./ContractCard";

export function ContractsList({
  contracts,
  masterContractSigned,
  showForm,
  onEdit,
  onDelete,
  onSubmit,
  onAddContract,
}) {
  if (contracts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800">
        <FileText
          size={48}
          className="mx-auto mb-4 text-gray-300 dark:text-gray-700"
        />
        <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
          No contracts found
        </p>
        {masterContractSigned && !showForm && (
          <button
            onClick={onAddContract}
            className="px-6 py-2.5 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter font-semibold text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
          >
            Create Your First Contract
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
}
