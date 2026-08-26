"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import {
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Percent,
  Calendar,
  Mail,
  DollarSign,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    default_revenue_share: "",
    default_contract_duration: "",
    withholding_tax_rate: "",
    advance_fee_percentage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();

      // Transform settings array to object
      const settingsObj = {};
      (data.settings || []).forEach((setting) => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setSettings({
        default_revenue_share: settingsObj.default_revenue_share || "25",
        default_contract_duration: settingsObj.default_contract_duration || "2",
        withholding_tax_rate: settingsObj.withholding_tax_rate || "10",
        advance_fee_percentage: settingsObj.advance_fee_percentage || "15",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      default_revenue_share: "25",
      default_contract_duration: "2",
      withholding_tax_rate: "10",
      advance_fee_percentage: "15",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminNav activePage="/admin/settings" />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="text-purple-400" size={32} />
            Platform Settings
          </h1>
          <p className="text-gray-400">
            Configure default values and platform-wide settings
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-0.5" size={20} />
            <p className="text-sm text-green-300">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Contract Defaults */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="text-purple-400" size={20} />
              Contract Defaults
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Revenue Share */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Percent size={16} />
                  Default Revenue Share (Agency %)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.default_revenue_share}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      default_revenue_share: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Percentage the agency keeps from creator earnings
                </p>
              </div>

              {/* Default Contract Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Default Contract Duration (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.default_contract_duration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      default_contract_duration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Standard contract length for new creators
                </p>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <DollarSign className="text-green-400" size={20} />
              Financial Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Withholding Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withholding Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.withholding_tax_rate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      withholding_tax_rate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tax withheld from creator earnings
                </p>
              </div>

              {/* Advance Fee Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Advance Payout Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.advance_fee_percentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      advance_fee_percentage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Fee charged for early payout requests
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-400 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">
                  Important Notes
                </h3>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>
                    • Changes to these settings will only affect new contracts
                    and transactions
                  </li>
                  <li>
                    • Existing contracts will maintain their original terms
                  </li>
                  <li>
                    • Revenue share is calculated from net earnings (after tax)
                  </li>
                  <li>
                    • All percentage values should be whole numbers (e.g., 25
                    for 25%)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={18} />
              Reset to Defaults
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>

        {/* Current Values Summary */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Configuration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Revenue Share</p>
              <p className="text-2xl font-bold text-purple-400">
                {settings.default_revenue_share}%
              </p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Contract Duration</p>
              <p className="text-2xl font-bold text-blue-400">
                {settings.default_contract_duration} yr
              </p>
            </div>
            <div className="text-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Withholding Tax</p>
              <p className="text-2xl font-bold text-orange-400">
                {settings.withholding_tax_rate}%
              </p>
            </div>
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Advance Fee</p>
              <p className="text-2xl font-bold text-green-400">
                {settings.advance_fee_percentage}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
