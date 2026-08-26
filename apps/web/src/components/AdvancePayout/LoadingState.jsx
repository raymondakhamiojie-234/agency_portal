import PortalNav from "@/components/PortalNav";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/advance" />
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Loading advance payout options...
          </p>
        </div>
      </div>
    </div>
  );
}
