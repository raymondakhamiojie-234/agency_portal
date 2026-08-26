"use client";

import { useEffect } from "react";

export default function PortalLoginRedirect() {
  useEffect(() => {
    window.location.href = "/account/signin?callbackUrl=/portal/dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
          Redirecting to sign in...
        </p>
      </div>
    </div>
  );
}
