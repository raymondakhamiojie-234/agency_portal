"use client";

import { useState, useEffect } from "react";

export default function AdminDebugPage() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/debug");
      const data = await response.json();
      setDiagnostics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusColor = (status) => {
    if (status?.includes("✅")) return "text-green-600";
    if (status?.includes("❌")) return "text-red-600";
    return "text-yellow-600";
  };

  const getStatusBg = (status) => {
    if (status?.includes("✅")) return "bg-green-50 border-green-200";
    if (status?.includes("❌")) return "bg-red-50 border-red-200";
    return "bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🔍 Admin System Diagnostics
              </h1>
              <p className="text-gray-600 mt-1">
                Detailed error analysis and system health check
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Running..." : "Rerun Tests"}
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Running diagnostics...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">
                ❌ Critical Error
              </h3>
              <pre className="text-sm text-red-700 overflow-auto">{error}</pre>
            </div>
          )}

          {diagnostics && !loading && (
            <div className="space-y-4">
              {/* Timestamp */}
              <div className="text-sm text-gray-500 mb-4">
                <strong>Test Run:</strong> {diagnostics.timestamp}
              </div>

              {/* Critical Error (if any) */}
              {diagnostics.criticalError && (
                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-red-800 mb-4">
                    ⚠️ Critical System Error
                  </h2>
                  <div className="space-y-2">
                    <p className="text-red-700">
                      <strong>Error Type:</strong>{" "}
                      {diagnostics.criticalError.name}
                    </p>
                    <p className="text-red-700">
                      <strong>Message:</strong>{" "}
                      {diagnostics.criticalError.message}
                    </p>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-red-700 font-semibold hover:text-red-800">
                        View Stack Trace
                      </summary>
                      <pre className="mt-2 p-4 bg-red-50 rounded text-xs overflow-auto max-h-64">
                        {diagnostics.criticalError.stack}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Individual Checks */}
              <div className="grid gap-4">
                {diagnostics.checks?.map((check, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 ${getStatusBg(check.status)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {check.name}
                      </h3>
                      <span
                        className={`text-xl font-bold ${getStatusColor(check.status)}`}
                      >
                        {check.status}
                      </span>
                    </div>

                    {/* Success Details */}
                    {check.status?.includes("✅") && (
                      <div className="space-y-2">
                        {check.rowCount !== undefined && (
                          <p className="text-sm text-gray-700">
                            <strong>Rows returned:</strong> {check.rowCount}
                          </p>
                        )}
                        {check.result && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                              View Result Data
                            </summary>
                            <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(check.result, null, 2)}
                            </pre>
                          </details>
                        )}
                        {check.sample && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                              View Sample Data
                            </summary>
                            <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(check.sample, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Error Details */}
                    {check.status?.includes("❌") && (
                      <div className="space-y-2">
                        {check.error && (
                          <div className="p-3 bg-white rounded">
                            <p className="text-sm font-semibold text-red-800 mb-1">
                              Error Message:
                            </p>
                            <p className="text-sm text-red-700">
                              {check.error}
                            </p>
                          </div>
                        )}
                        {check.stack && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-semibold text-red-700 hover:text-red-800">
                              View Full Stack Trace
                            </summary>
                            <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-48">
                              {check.stack}
                            </pre>
                          </details>
                        )}
                        {check.cookies && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-semibold text-red-700 hover:text-red-800">
                              View Available Cookies
                            </summary>
                            <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(check.cookies, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Full Raw Data */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 p-3 rounded">
                  📋 View Complete Diagnostic Data (JSON)
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-auto max-h-96 border border-gray-200">
                  {JSON.stringify(diagnostics, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📚 How to Use This Page
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • <strong>Green (✅)</strong> - Component is working correctly
            </li>
            <li>
              • <strong>Red (❌)</strong> - Error detected, expand for details
            </li>
            <li>• Click "Rerun Tests" to refresh the diagnostics</li>
            <li>
              • Expand sections to view detailed error messages and stack traces
            </li>
            <li>• Share the complete JSON output with support if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
