"use client";

import { useState } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { LoadingState } from "@/components/AdminDashboard/LoadingState";
import { AlertMessages } from "@/components/AdminDashboard/AlertMessages";
import { StatsGrid } from "@/components/AdminDashboard/StatsGrid";
import { ContractSettings } from "@/components/AdminDashboard/ContractSettings";
import { EarningsUpload } from "@/components/AdminDashboard/EarningsUpload";
import { RecentUploads } from "@/components/AdminDashboard/RecentUploads";
import { ExportData } from "@/components/AdminDashboard/ExportData";
import { CreatorsTable } from "@/components/AdminDashboard/CreatorsTable";

export default function AdminDashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const {
    stats,
    creators,
    settings,
    loading,
    error,
    recentUploads,
    fetchAdminData,
    setError,
  } = useAdminData();
  const [success, setSuccess] = useState("");

  useAdminAuth(user, userLoading, fetchAdminData);

  const handleUpdateCreatorStatus = async (creatorId, newStatus) => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/creators", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          accountStatus: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update creator status");
      }

      setSuccess("Creator status updated successfully!");
      fetchAdminData();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update creator status");
    }
  };

  const handleUpdateCreatorPercentage = async (creatorId, percentage) => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/creators", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          revenueSharePercentage: percentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update creator percentage");
      }

      setSuccess("Creator contract percentage updated successfully!");
      fetchAdminData();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update creator percentage");
    }
  };

  const handleSettingsUpdate = (message) => {
    setSuccess(message);
    fetchAdminData();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleUploadSuccess = (message) => {
    setSuccess(message);
    fetchAdminData();
    setTimeout(() => setSuccess(""), 5000);
  };

  const handleExportSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleExportError = (message) => {
    setError(message);
  };

  if (userLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/admin" />

      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Manage creators, contracts, and platform settings
          </p>
        </div>

        {/* Success/Error Messages */}
        <AlertMessages success={success} error={error} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ContractSettings
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
          <EarningsUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Recent Uploads & Export Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RecentUploads recentUploads={recentUploads} />
          <ExportData
            onExportSuccess={handleExportSuccess}
            onExportError={handleExportError}
          />
        </div>

        {/* All Creators Table */}
        <CreatorsTable
          creators={creators}
          onUpdateStatus={handleUpdateCreatorStatus}
          onUpdatePercentage={handleUpdateCreatorPercentage}
        />
      </main>
    </div>
  );
}
