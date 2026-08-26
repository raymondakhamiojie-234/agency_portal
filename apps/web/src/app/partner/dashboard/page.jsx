"use client";

import { useState, useEffect } from "react";
import PartnerNav from "@/components/PartnerNav";
import {
  Copy,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Link as LinkIcon,
  DollarSign,
  Percent,
  Edit2,
  Save,
  X as XIcon,
} from "lucide-react";

export default function PartnerDashboardPage() {
  const [partner, setPartner] = useState(null);
  const [onboardedCreators, setOnboardedCreators] = useState([]);
  const [financialStats, setFinancialStats] = useState(null);
  const [onboardedStats, setOnboardedStats] = useState({
    total_creators: 0,
    total_creator_earnings: 0,
    total_partner_share: 0,
    average_contract_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [editPercentage, setEditPercentage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPartnerData();
    fetchOnboardedCreators();
    fetchFinancialStats();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const response = await fetch("/api/partner/me");
      if (!response.ok) {
        window.location.href = "/partner/login";
        return;
      }
      const data = await response.json();
      setPartner(data.partner);
    } catch (err) {
      setError("Failed to load partner information");
      console.error(err);
    }
  };

  const fetchOnboardedCreators = async () => {
    try {
      const response = await fetch("/api/partner/onboarded-creators");
      if (!response.ok) {
        throw new Error("Failed to load onboarded creators");
      }
      const data = await response.json();

      // Calculate partner commission based on contract percentage
      const creatorsWithCommission = (data.creators || []).map((creator) => {
        const contractPercent = parseFloat(creator.contract_percentage || 0);
        let partnerCommissionRate = 0;

        // Commission structure based on creator contract percentage
        if (contractPercent === 20) {
          partnerCommissionRate = 0; // 0% commission for 20% contracts
        } else if (contractPercent === 25) {
          partnerCommissionRate = 5; // 5% commission for 25% contracts
        } else if (contractPercent === 30) {
          partnerCommissionRate = 5; // 5% commission for 30% contracts (can be 5-7%)
        }

        const partnerEarnings =
          (parseFloat(creator.total_earnings || 0) * partnerCommissionRate) /
          100;

        return {
          ...creator,
          partner_commission_rate: partnerCommissionRate,
          partner_earnings: partnerEarnings,
        };
      });

      setOnboardedCreators(creatorsWithCommission);

      // Recalculate stats with new commission structure
      const totalPartnerShare = creatorsWithCommission.reduce(
        (sum, c) => sum + parseFloat(c.partner_earnings || 0),
        0,
      );

      setOnboardedStats({
        total_creators: creatorsWithCommission.length,
        total_creator_earnings: creatorsWithCommission.reduce(
          (sum, c) => sum + parseFloat(c.total_earnings || 0),
          0,
        ),
        total_partner_share: totalPartnerShare,
        average_contract_percentage:
          creatorsWithCommission.length > 0
            ? creatorsWithCommission.reduce(
                (sum, c) => sum + parseFloat(c.partner_commission_rate || 0),
                0,
              ) / creatorsWithCommission.length
            : 0,
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to load onboarded creators:", err);
      setLoading(false);
    }
  };

  const fetchFinancialStats = async () => {
    try {
      const response = await fetch("/api/partner/financial-stats");
      if (!response.ok) {
        throw new Error("Failed to load financial stats");
      }
      const data = await response.json();
      setFinancialStats(data);
    } catch (err) {
      console.error("Failed to load financial stats:", err);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handleEditContract = (creator) => {
    setEditingCreator(creator.id);
    setEditPercentage(creator.contract_percentage);
  };

  const handleSaveContract = async (creatorId) => {
    const percentage = parseFloat(editPercentage);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert("Please enter a valid percentage between 0 and 100");
      return;
    }

    // Only allow 20%, 25%, or 30%
    if (![20, 25, 30].includes(percentage)) {
      alert("Contract percentage must be 20%, 25%, or 30%");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/partner/onboarded-creators", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creatorId,
          contractPercentage: percentage,
        }),
      });

      if (!response.ok) throw new Error("Failed to update contract");

      await fetchOnboardedCreators();
      setEditingCreator(null);
      setEditPercentage("");
      alert("Contract updated successfully!");
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("Failed to update contract");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCreator(null);
    setEditPercentage("");
  };

  if (loading || !partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <PartnerNav activePage="/partner/dashboard" partnerName={partner.name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Financial Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md hover:shadow-lg hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Your Total Earnings
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(onboardedStats.total_partner_share)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                <DollarSign size={28} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <TrendingUp size={16} className="mr-1 text-green-400" />
              Your commission
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md hover:shadow-lg hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Onboarded Creators
                </p>
                <p className="text-3xl font-bold text-white">
                  {onboardedStats.total_creators}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <Users size={28} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <CheckCircle size={16} className="mr-1 text-green-400" />
              Active creators
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md hover:shadow-lg hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Creator Earnings
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(onboardedStats.total_creator_earnings)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <Calendar size={16} className="mr-1 text-gray-500" />
              Total generated
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md hover:shadow-lg hover:border-purple-500/50 transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Avg. Commission
                </p>
                <p className="text-3xl font-bold text-white">
                  {onboardedStats.average_contract_percentage?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                <Percent size={28} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <CheckCircle size={16} className="mr-1 text-gray-500" />
              Per creator
            </div>
          </div>
        </div>

        {/* Referral Information Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-lg">
              <LinkIcon size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Your Referral Information
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                Referral Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={partner.referral_code}
                  readOnly
                  className="flex-1 px-5 py-3 border-2 border-gray-600 rounded-lg bg-gray-900/50 font-mono text-lg font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={() => copyToClipboard(partner.referral_code, "code")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {copied === "code" ? (
                    <>
                      <CheckCircle size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                Referral Link
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={partner.referral_link}
                  readOnly
                  className="flex-1 px-5 py-3 border-2 border-gray-600 rounded-lg bg-gray-900/50 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={() => copyToClipboard(partner.referral_link, "link")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {copied === "link" ? (
                    <>
                      <CheckCircle size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-5 bg-blue-900/20 rounded-xl border border-blue-700/50">
            <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              How to use your referral code
            </h3>
            <ul className="text-sm text-blue-200 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 font-bold">•</span>
                Share your referral link with potential creators
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 font-bold">•</span>
                Or ask them to enter your code "
                <span className="font-mono font-bold bg-gray-900/50 px-2 py-0.5 rounded">
                  {partner.referral_code}
                </span>
                " when signing up
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 font-bold">•</span>
                Track all your referrals and earnings right here in your
                dashboard
              </li>
            </ul>
          </div>
        </div>

        {/* Commission Structure Info */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl shadow-md p-6 mb-8 border border-blue-700/50">
          <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
            <Percent size={20} />
            Your Commission Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/80 rounded-lg p-4 border-2 border-gray-600">
              <p className="text-sm text-gray-400 mb-1">
                Creator at 20% Contract
              </p>
              <p className="text-2xl font-bold text-white">0%</p>
              <p className="text-xs text-gray-500 mt-1">No commission</p>
            </div>
            <div className="bg-gray-800/80 rounded-lg p-4 border-2 border-green-600/50">
              <p className="text-sm text-gray-400 mb-1">
                Creator at 25% Contract
              </p>
              <p className="text-2xl font-bold text-green-400">5%</p>
              <p className="text-xs text-gray-500 mt-1">Commission earned</p>
            </div>
            <div className="bg-gray-800/80 rounded-lg p-4 border-2 border-blue-600/50">
              <p className="text-sm text-gray-400 mb-1">
                Creator at 30% Contract
              </p>
              <p className="text-2xl font-bold text-blue-400">5%</p>
              <p className="text-xs text-gray-500 mt-1">Commission earned</p>
            </div>
          </div>
        </div>

        {/* Onboarded Creators Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gray-900/30">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users size={24} className="text-blue-400" />
              Onboarded Creators
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Creators you've onboarded and their financial performance
            </p>
          </div>

          {onboardedCreators.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-gray-700/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-gray-500" />
              </div>
              <p className="text-gray-300 font-semibold text-lg mb-2">
                No onboarded creators yet
              </p>
              <p className="text-sm text-gray-500">
                Start sharing your referral link to onboard creators
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Total Earnings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Contract %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Your Rate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Your Earnings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {onboardedCreators.map((creator) => (
                    <tr
                      key={creator.id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-green-900/30 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <span className="text-green-400 font-bold text-sm">
                              {creator.creator_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {creator.creator_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {creator.creator_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-300 rounded border border-blue-700/50">
                          {creator.primary_platform || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          {formatCurrency(creator.total_earnings)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCreator === creator.id ? (
                          <select
                            value={editPercentage}
                            onChange={(e) => setEditPercentage(e.target.value)}
                            className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="20">20%</option>
                            <option value="25">25%</option>
                            <option value="30">30%</option>
                          </select>
                        ) : (
                          <div className="text-sm font-semibold text-blue-400">
                            {creator.contract_percentage}%
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-purple-400">
                          {creator.partner_commission_rate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-400">
                          {formatCurrency(creator.partner_earnings)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCreator === creator.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveContract(creator.id)}
                              disabled={saving}
                              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={saving}
                              className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                              title="Cancel"
                            >
                              <XIcon size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditContract(creator)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Edit Contract %"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
