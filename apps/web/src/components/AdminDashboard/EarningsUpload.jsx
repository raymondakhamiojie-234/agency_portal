import { useState } from "react";
import { Upload, Download } from "lucide-react";

export function EarningsUpload({ onUploadSuccess }) {
  const [uploadingEarnings, setUploadingEarnings] = useState(false);
  const [earningsFile, setEarningsFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadErrors, setUploadErrors] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleEarningsUpload = async (e) => {
    e.preventDefault();
    setError("");
    setUploadErrors([]);
    setUploadingEarnings(true);

    if (!earningsFile) {
      setError("Please select a file to upload");
      setUploadingEarnings(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", earningsFile);

      const response = await fetch("/api/admin/earnings/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload earnings");
      }

      // Reset the file input completely
      setEarningsFile(null);
      setFileInputKey(Date.now());

      // Show errors if any
      if (data.errors && data.errors.length > 0) {
        setUploadErrors(data.errors);
      }

      if (onUploadSuccess && data.recordsCreated > 0) {
        onUploadSuccess(
          data.message ||
            `Successfully uploaded ${data.recordsCreated} earnings records!`,
        );
      } else if (data.recordsCreated === 0) {
        setError(
          data.message ||
            "No records were created. Please check the errors below and your CSV format.",
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploadingEarnings(false);
    }
  };

  const downloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      // Fetch real creators from the database
      const response = await fetch("/api/admin/creators");
      const data = await response.json();

      let csvContent = "page_name,amount,earning_date,withholding_tax\n";

      if (data.creators && data.creators.length > 0) {
        // Use real creator page names as examples
        data.creators.slice(0, 3).forEach((creator) => {
          csvContent += `${creator.page_name},0.00,2024-01-15,0.00\n`;
        });
      } else {
        // Fallback if no creators exist
        csvContent += "Example Page Name,1500.00,2024-01-15,150.00\n";
      }

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "earnings_template.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate template:", err);
      setError("Failed to download template. Please try again.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Upload className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Upload Earnings
        </h2>
      </div>
      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
        Upload earnings data via CSV file using creator page names.
      </p>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="font-inter text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}
      {uploadErrors.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto">
          <p className="font-inter text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
            Upload Errors ({uploadErrors.length}):
          </p>
          <ul className="space-y-1">
            {uploadErrors.map((err, idx) => (
              <li
                key={idx}
                className="font-inter text-xs text-yellow-700 dark:text-yellow-400"
              >
                • {err}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleEarningsUpload} className="space-y-4">
        <div>
          <input
            key={fileInputKey}
            type="file"
            id="earnings-upload"
            accept=".csv"
            onChange={(e) => setEarningsFile(e.target.files[0])}
            onClick={(e) => {
              e.target.value = null;
            }}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#726BFF] file:text-white hover:file:bg-[#5E55FF] file:cursor-pointer"
          />
          {earningsFile && (
            <p className="mt-2 font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
              Selected: {earningsFile.name}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={uploadingEarnings || !earningsFile}
            className="flex-1 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingEarnings ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={downloadTemplate}
            disabled={downloadingTemplate}
            className="bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>{downloadingTemplate ? "Loading..." : "Template"}</span>
          </button>
        </div>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-60 mb-2">
          <strong>Required CSV Format:</strong>
        </p>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2">
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 font-mono">
            page_name,amount,earning_date,withholding_tax
          </p>
        </div>
        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-60 mt-2">
          <strong>Note:</strong> Template now includes your actual creator page
          names. Replace the amounts and dates with real data.
        </p>
      </div>
    </div>
  );
}
