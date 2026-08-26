"use client";

import { useState } from "react";
import {
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Save,
  ArrowRight,
} from "lucide-react";

export default function DomainSetupPage() {
  const [copied, setCopied] = useState({});
  const [step, setStep] = useState(1);
  const [dnsRecords, setDnsRecords] = useState({
    spf: "",
    dkim_name: "resend._domainkey",
    dkim_value: "",
    dmarc: "v=DMARC1; p=none; rua=mailto:dmarc@falcusmediaagency.com",
  });
  const [provider, setProvider] = useState("");
  const [saved, setSaved] = useState(false);

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [id]: true });
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 2000);
  };

  const handleSave = () => {
    localStorage.setItem("resend_dns_records", JSON.stringify(dnsRecords));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const providers = [
    {
      id: "cloudflare",
      name: "Cloudflare",
      url: "https://dash.cloudflare.com",
    },
    {
      id: "godaddy",
      name: "GoDaddy",
      url: "https://dcc.godaddy.com/manage/dns",
    },
    {
      id: "namecheap",
      name: "Namecheap",
      url: "https://ap.www.namecheap.com/domains/list/",
    },
    { id: "google", name: "Google Domains", url: "https://domains.google.com" },
    { id: "other", name: "Other Provider", url: "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Domain Setup for Resend
              </h1>
              <p className="text-gray-600">
                Configure <strong>falcusmediaagency.com</strong> to send emails
                through Resend
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step >= num
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`h-1 w-16 ${
                      step > num ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Get DNS Records from Resend */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Get DNS Records from Resend
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-2">
                      First, add your domain in Resend:
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to Resend Dashboard → Domains</li>
                      <li>Click "+ Add Domain"</li>
                      <li>
                        Enter:{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          falcusmediaagency.com
                        </code>
                      </li>
                      <li>Resend will show you DNS records to copy</li>
                    </ol>
                  </div>
                </div>
              </div>

              <a
                href="https://resend.com/domains"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Open Resend Dashboard
                <ExternalLink size={18} />
              </a>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Paste the DNS records that Resend gives you:
                </h3>

                {/* SPF Record */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SPF Record Value (TXT)
                  </label>
                  <input
                    type="text"
                    value={dnsRecords.spf}
                    onChange={(e) =>
                      setDnsRecords({ ...dnsRecords, spf: e.target.value })
                    }
                    placeholder="v=spf1 include:_spf.resend.com ~all"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usually starts with "v=spf1"
                  </p>
                </div>

                {/* DKIM Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DKIM Record Name
                  </label>
                  <input
                    type="text"
                    value={dnsRecords.dkim_name}
                    onChange={(e) =>
                      setDnsRecords({
                        ...dnsRecords,
                        dkim_name: e.target.value,
                      })
                    }
                    placeholder="resend._domainkey"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usually "resend._domainkey"
                  </p>
                </div>

                {/* DKIM Value */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DKIM Record Value (TXT)
                  </label>
                  <textarea
                    value={dnsRecords.dkim_value}
                    onChange={(e) =>
                      setDnsRecords({
                        ...dnsRecords,
                        dkim_value: e.target.value,
                      })
                    }
                    placeholder="p=MIGfMA0GCSqGSIb3DQEBA..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Long string starting with "p=" - Copy exactly from Resend
                  </p>
                </div>

                {/* DMARC (Optional) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DMARC Record Value (Optional)
                  </label>
                  <input
                    type="text"
                    value={dnsRecords.dmarc}
                    onChange={(e) =>
                      setDnsRecords({ ...dnsRecords, dmarc: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended for better deliverability
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Save size={18} />
                    {saved ? "Saved!" : "Save for Later"}
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!dnsRecords.spf || !dnsRecords.dkim_value}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next: Choose Provider
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Domain Provider */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Where is Your Domain Hosted?
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              Select your domain provider to get specific instructions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    provider === p.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  {p.url && (
                    <div className="text-xs text-gray-500 mt-1">{p.url}</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!provider}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Add DNS Records
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add to Domain Provider */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add DNS Records to{" "}
                  {providers.find((p) => p.id === provider)?.name}
                </h2>
              </div>

              {/* Provider-specific instructions */}
              {provider === "cloudflare" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Cloudflare Instructions:
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Log in to Cloudflare</li>
                    <li>
                      Select your domain: <strong>falcusmediaagency.com</strong>
                    </li>
                    <li>
                      Go to <strong>DNS → Records</strong>
                    </li>
                    <li>
                      Click <strong>"+ Add record"</strong>
                    </li>
                    <li>Add each record below</li>
                    <li>
                      Click <strong>Save</strong>
                    </li>
                  </ol>
                  <a
                    href="https://dash.cloudflare.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-800 font-medium"
                  >
                    Open Cloudflare Dashboard
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {provider === "godaddy" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    GoDaddy Instructions:
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Log in to GoDaddy</li>
                    <li>
                      Go to <strong>My Products → Domains</strong>
                    </li>
                    <li>
                      Click <strong>DNS</strong> next to your domain
                    </li>
                    <li>
                      Scroll to <strong>Records</strong> section
                    </li>
                    <li>
                      Click <strong>"Add"</strong> for each record type
                    </li>
                    <li>Save changes</li>
                  </ol>
                  <a
                    href="https://dcc.godaddy.com/manage/dns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-800 font-medium"
                  >
                    Open GoDaddy DNS
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {provider === "namecheap" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Namecheap Instructions:
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Log in to Namecheap</li>
                    <li>
                      Go to <strong>Domain List</strong>
                    </li>
                    <li>
                      Click <strong>"Manage"</strong> next to your domain
                    </li>
                    <li>
                      Go to <strong>Advanced DNS</strong> tab
                    </li>
                    <li>
                      Click <strong>"Add New Record"</strong>
                    </li>
                    <li>Add each record below</li>
                  </ol>
                  <a
                    href="https://ap.www.namecheap.com/domains/list/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-800 font-medium"
                  >
                    Open Namecheap Domains
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {provider === "other" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    Log in to your domain provider's control panel and look for{" "}
                    <strong>DNS Settings</strong>, <strong>DNS Records</strong>,
                    or <strong>Advanced DNS</strong>. Then add the records
                    below.
                  </p>
                </div>
              )}

              {/* DNS Records to Add */}
              <div className="space-y-4">
                {/* SPF Record */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                      TXT
                    </span>
                    <h3 className="font-semibold text-gray-900">SPF Record</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                        TXT
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Name/Host
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm flex items-center justify-between">
                        <span>@</span>
                        <button
                          onClick={() => copyToClipboard("spf-name", "@")}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {copied["spf-name"] ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TTL
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                        3600
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono flex items-center justify-between">
                      <span className="break-all">
                        {dnsRecords.spf ||
                          "v=spf1 include:_spf.resend.com ~all"}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard("spf-value", dnsRecords.spf)
                        }
                        className="text-purple-600 hover:text-purple-700 ml-2 flex-shrink-0"
                      >
                        {copied["spf-value"] ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* DKIM Record */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      TXT
                    </span>
                    <h3 className="font-semibold text-gray-900">DKIM Record</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                        TXT
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Name/Host
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm flex items-center justify-between font-mono">
                        <span className="break-all">
                          {dnsRecords.dkim_name}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard("dkim-name", dnsRecords.dkim_name)
                          }
                          className="text-purple-600 hover:text-purple-700 ml-2 flex-shrink-0"
                        >
                          {copied["dkim-name"] ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TTL
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                        3600
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono flex items-center justify-between">
                      <span className="break-all text-xs">
                        {dnsRecords.dkim_value}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard("dkim-value", dnsRecords.dkim_value)
                        }
                        className="text-purple-600 hover:text-purple-700 ml-2 flex-shrink-0"
                      >
                        {copied["dkim-value"] ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* DMARC Record */}
                {dnsRecords.dmarc && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                        TXT
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        DMARC Record (Optional)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          TXT
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name/Host
                        </label>
                        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm flex items-center justify-between">
                          <span>_dmarc</span>
                          <button
                            onClick={() =>
                              copyToClipboard("dmarc-name", "_dmarc")
                            }
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {copied["dmarc-name"] ? (
                              <CheckCircle size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          TTL
                        </label>
                        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          3600
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono flex items-center justify-between">
                        <span className="break-all">{dnsRecords.dmarc}</span>
                        <button
                          onClick={() =>
                            copyToClipboard("dmarc-value", dnsRecords.dmarc)
                          }
                          className="text-purple-600 hover:text-purple-700 ml-2 flex-shrink-0"
                        >
                          {copied["dmarc-value"] ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⏱️ DNS Propagation:</strong> Changes can take 5 minutes
                  to 48 hours. Usually 15-30 minutes.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Verify in Resend Dashboard
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            {/* Final Step: Environment Variable */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">🎉 Almost Done!</h2>
              <p className="mb-4">
                After Resend verifies your domain, add this environment
                variable:
              </p>
              <div className="bg-white/10 rounded-lg p-4 font-mono text-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <code>FROM_EMAIL=noreply@falcusmediaagency.com</code>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "env",
                        "FROM_EMAIL=noreply@falcusmediaagency.com",
                      )
                    }
                    className="text-white hover:text-gray-200"
                  >
                    {copied.env ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="/admin/test-email"
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Test Email Setup →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
