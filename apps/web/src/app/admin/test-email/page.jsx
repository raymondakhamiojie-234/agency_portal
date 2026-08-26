"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState("test");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [config, setConfig] = useState(null);

  const checkConfig = async () => {
    try {
      const response = await fetch("/api/test-email");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Failed to check config:", error);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  const handleSendTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, type: emailType }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, data });
      } else {
        setResult({
          success: false,
          error: data.error || "Failed to send email",
          details: data,
        });
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Admin
          </a>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Mail size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Email Service Test
              </h1>
              <p className="text-gray-400">
                Test your Resend email configuration
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Status */}
        {config && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                Configuration Status
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={
                    config.configured ? "text-green-400" : "text-red-400"
                  }
                >
                  {config.configured ? "✅" : "❌"}
                </span>
                <span className="text-gray-300">
                  API Key: {config.config.apiKey}
                </span>
              </div>
              {config.configured && (
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✅</span>
                  <span className="text-gray-300">
                    From Email: {config.config.fromEmail}
                  </span>
                </div>
              )}
            </div>

            {!config.configured && config.instructions && (
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-3">
                  Setup Instructions:
                </h3>
                <ol className="space-y-2 text-sm text-gray-300">
                  {Object.entries(config.instructions).map(([key, value]) => (
                    <li key={key} className="flex gap-2">
                      <span className="text-yellow-400 font-mono">
                        {key.replace("step", "")}.
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Test Form */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Send size={24} className="text-blue-400" />
            Send Test Email
          </h2>

          <form onSubmit={handleSendTest} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Type
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="test">Test Email</option>
                <option value="password-reset">Password Reset</option>
                <option value="verification">Email Verification</option>
                <option value="welcome">Welcome Email</option>
              </select>
              <p className="mt-2 text-sm text-gray-400">
                {emailType === "test" &&
                  "Send a simple test email to verify configuration"}
                {emailType === "password-reset" &&
                  "Preview the password reset email template"}
                {emailType === "verification" &&
                  "Preview the email verification template"}
                {emailType === "welcome" &&
                  "Preview the welcome email template"}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !config?.configured}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Test Email
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`border rounded-xl p-6 ${
              result.success
                ? "bg-green-900/20 border-green-700/50"
                : "bg-red-900/20 border-red-700/50"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle
                  size={24}
                  className="text-green-400 flex-shrink-0 mt-1"
                />
              ) : (
                <AlertCircle
                  size={24}
                  className="text-red-400 flex-shrink-0 mt-1"
                />
              )}
              <div className="flex-1">
                <h3
                  className={`font-bold mb-2 ${
                    result.success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result.success ? "Email Sent Successfully!" : "Email Failed"}
                </h3>
                {result.success ? (
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>{result.data.message}</p>
                    {result.data.emailId && (
                      <p className="font-mono text-xs text-gray-400">
                        Email ID: {result.data.emailId}
                      </p>
                    )}
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">
                        Check your inbox at:
                      </p>
                      <p className="text-white font-semibold">{email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-red-300">
                    <p>{result.error}</p>
                    {result.details?.setup && (
                      <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                        <p className="text-xs font-semibold mb-2">
                          Setup Required:
                        </p>
                        <ul className="text-xs space-y-1">
                          {Object.entries(result.details.setup).map(
                            ([key, value]) => (
                              <li key={key}>• {value}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
