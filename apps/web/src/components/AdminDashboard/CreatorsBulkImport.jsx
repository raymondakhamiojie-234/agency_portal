import { useState } from "react";
import { UserPlus, Download } from "lucide-react";

export function CreatorsBulkImport({ onImportSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [importErrors, setImportErrors] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    setImportErrors([]);
    setUploading(true);

    if (!file) {
      setError("Please select a file to upload");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/creators/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import creators");
      }

      // Reset file input
      setFile(null);
      setFileInputKey(Date.now());

      // Show errors if any
      if (data.errors && data.errors.length > 0) {
        setImportErrors(data.errors);
      }

      if (onImportSuccess && data.creatorsAdded > 0) {
        onImportSuccess(data.message);
      } else if (data.creatorsAdded === 0) {
        setError(data.message || "No creators were added.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "page_name,email,full_name,primary_platform,phone_number,country\n" +
      "GeorginaTVcomedy,georgina@example.com,Georgina TV,Facebook,,Nigeria\n" +
      "Oyiza comedy,oyiza@example.com,Oyiza Comedy,Facebook,,Nigeria\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creators_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <UserPlus className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Bulk Import Creators
        </h2>
      </div>
      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
        Import multiple creators at once via CSV. They'll be created with
        temporary passwords.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="font-inter text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {importErrors.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto">
          <p className="font-inter text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
            Import Errors ({importErrors.length}):
          </p>
          <ul className="space-y-1">
            {importErrors.map((err, idx) => (
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

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <input
            key={fileInputKey}
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            onClick={(e) => {
              e.target.value = null;
            }}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#726BFF] file:text-white hover:file:bg-[#5E55FF] file:cursor-pointer"
          />
          {file && (
            <p className="mt-2 font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={uploading || !file}
            className="flex-1 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#5E55FF] dark:hover:bg-[#5558FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Importing..." : "Import Creators"}
          </button>
          <button
            type="button"
            onClick={downloadTemplate}
            className="bg-gray-200 dark:bg-gray-700 text-[#111111] dark:text-white font-plus-jakarta-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Template</span>
          </button>
        </div>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-60 mb-2">
          <strong>Required CSV Format:</strong>
        </p>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2">
          <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70 font-mono">
            page_name,email,full_name,primary_platform,phone_number,country
          </p>
        </div>
        <ul className="mt-3 space-y-1 font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-60">
          <li>
            • <strong>page_name</strong> and <strong>email</strong> are required
          </li>
          <li>
            • Other fields are optional (will use defaults if not provided)
          </li>
          <li>
            • Creators will be created with temporary password:{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
              TempPassword123!
            </code>
          </li>
          <li>• They'll need to reset their password on first login</li>
        </ul>
      </div>
    </div>
  );
}
