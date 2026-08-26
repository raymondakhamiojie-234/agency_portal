import { AlertCircle } from "lucide-react";
import PortalNav from "@/components/PortalNav";

export function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/dashboard" />
      <div className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <p className="font-inter text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    </div>
  );
}
