import { Edit, Send, Trash2, FileText, ExternalLink } from "lucide-react";
import { platformIcons, statusColors } from "@/constants/platformConstants";
import { Edit as EditIcon, Clock, CheckCircle, XCircle } from "lucide-react";

const statusIcons = {
  Draft: <EditIcon size={14} />,
  Pending: <Clock size={14} />,
  Signed: <CheckCircle size={14} />,
  Rejected: <XCircle size={14} />,
};

export function ContractCard({ contract, onEdit, onDelete, onSubmit }) {
  return (
    <div className="p-6 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#726BFF] dark:hover:border-[#6366FF] transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{platformIcons[contract.platform]}</span>
            <h3 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
              {contract.account_name}
            </h3>
            <span
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-inter text-xs font-semibold ${statusColors[contract.status]}`}
            >
              {statusIcons[contract.status]}
              <span>{contract.status}</span>
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              <span className="font-semibold">Platform:</span>{" "}
              {contract.platform}
            </p>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              <span className="font-semibold">Followers:</span>{" "}
              {contract.followers_count.toLocaleString()}
            </p>
            <a
              href={contract.account_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 font-inter text-sm text-[#726BFF] dark:text-[#6366FF] hover:underline"
            >
              <span>{contract.account_url}</span>
              <ExternalLink size={14} />
            </a>
            {contract.rejection_reason && (
              <p className="font-inter text-sm text-red-600 dark:text-red-400 mt-2">
                <span className="font-semibold">Rejection Reason:</span>{" "}
                {contract.rejection_reason}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {contract.status === "Draft" && (
            <>
              <button
                onClick={() => onEdit(contract)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-[#111111] dark:text-white rounded-lg font-inter text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onSubmit(contract)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg font-inter text-sm hover:bg-[#5f59e6] dark:hover:bg-[#5558e6] transition-all duration-200"
              >
                <Send size={16} />
                <span>Submit</span>
              </button>
              <button
                onClick={() => onDelete(contract.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-inter text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
          {contract.contract_file_url && (
            <a
              href={contract.contract_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-inter text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
            >
              <FileText size={16} />
              <span>View Contract</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
