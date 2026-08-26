"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Upload,
  Download,
  DollarSign,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";

export default function AdminEarningsPage() {
  const [earnings, setEarnings] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadErrors, setUploadErrors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [earningsRes, uploadsRes] = await Promise.all([
        fetch("/api/admin/creators"),
        fetch("/api/admin/earnings/recent"),
      ]);

      if (earningsRes.ok) {
        const data = await earningsRes.json();
        setEarnings(data.creators || []);
      }

      if (uploadsRes.ok) {
        const data = await uploadsRes.json();
        setRecentUploads(data.uploads || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setUploadErrors([]);

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch("/api/admin/earnings/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.errors && data.errors.length > 0) {
        setUploadErrors(data.errors);
      }

      if (data.recordsCreated > 0) {
        setUploadSuccess(
          data.message ||
            `Successfully uploaded ${data.recordsCreated} earnings records`,
        );
        setUploadFile(null);

        // ✅ Refresh data to update stats
        await fetchData();

        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess("");
          setUploadErrors([]);
        }, 3000);
      } else {
        setUploadError(
          data.message || "No records were created. Check errors below.",
        );
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/earnings/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earnings-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "page_name,amount,earning_date,withholding_tax\nJohns Channel,1500.00,2024-01-15,150.00\nJanes Page,2500.00,2024-01-15,250.00\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "earnings_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav activePage="/admin/earnings" />
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
            style={{
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style jsx global>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav activePage="/admin/earnings" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Mobile-Responsive Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Earnings Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Upload, manage, and track creator earnings
            </p>
          </div>

          {/* ✅ Mobile-Responsive Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Template</span>
              <span className="sm:hidden">CSV Template</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Upload Earnings</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* ✅ Mobile-Responsive Recent Uploads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-purple-600" />
            Recent Uploads
          </h2>

          {recentUploads.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-gray-500">
                No uploads yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUploads.slice(0, 5).map((upload, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-purple-600" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {upload.filename || "Earnings Upload"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {upload.records_count} records •{" "}
                        {new Date(upload.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-sm font-medium text-green-600">
                      ${parseFloat(upload.total_amount || 0).toLocaleString()}
                    </span>
                    <CheckCircle className="text-green-600" size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Updated Instructions - ONLY page_name format */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-blue-600 mt-0.5 flex-shrink-0"
              size={20}
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                CSV Upload Format
              </h3>
              <p className="text-xs sm:text-sm text-blue-800 mb-2">
                <strong>Required columns (in order):</strong>
              </p>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm font-mono text-gray-700 mb-3 overflow-x-auto">
                page_name,amount,earning_date,withholding_tax
              </div>
              <p className="text-xs sm:text-sm text-blue-700 mb-3">
                <strong>Example:</strong>
              </p>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm font-mono text-gray-700 mb-3 overflow-x-auto">
                Johns Channel,1500.00,2024-01-15,150.00
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-blue-700">
                <p>
                  • <strong>page_name</strong>: Creator's page name (must match
                  exactly)
                </p>
                <p>
                  • <strong>amount</strong>: Earnings amount (e.g., 1500.00)
                </p>
                <p>
                  • <strong>earning_date</strong>: Date in YYYY-MM-DD format
                </p>
                <p>
                  • <strong>withholding_tax</strong>: Tax amount (e.g., 150.00)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Mobile-Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">
                Total Earnings
              </span>
              <DollarSign className="text-green-600" size={18} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              $
              {recentUploads
                .reduce((sum, u) => sum + parseFloat(u.total_amount || 0), 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">
                Total Uploads
              </span>
              <Upload className="text-purple-600" size={18} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {recentUploads.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">
                Records Processed
              </span>
              <FileText className="text-blue-600" size={18} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {recentUploads.reduce(
                (sum, u) => sum + (u.records_count || 0),
                0,
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">
                Last Upload
              </span>
              <Clock className="text-orange-600" size={18} />
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {recentUploads.length > 0
                ? new Date(recentUploads[0].uploaded_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                Upload Earnings
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError("");
                  setUploadErrors([]);
                  setUploadSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="p-6">
              {uploadSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    {uploadSuccess}
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    {uploadError}
                  </p>
                </div>
              )}

              {uploadErrors.length > 0 && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">
                    Upload Errors ({uploadErrors.length}):
                  </p>
                  <ul className="space-y-1">
                    {uploadErrors.map((err, idx) => (
                      <li key={idx} className="text-xs text-yellow-700">
                        • {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                {uploadFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                    setUploadErrors([]);
                    setUploadSuccess("");
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        style={{
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      Uploading...
                      <style jsx>{`
                        @keyframes spin {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                      `}</style>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
