import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
    case "Completed":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    case "Pending":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    case "Rejected":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
    case "Completed":
      return <CheckCircle size={16} />;
    case "Pending":
      return <Clock size={16} />;
    case "Rejected":
      return <XCircle size={16} />;
    default:
      return <Clock size={16} />;
  }
};
