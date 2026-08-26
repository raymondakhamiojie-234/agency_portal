"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import { MessageCircle, Mail, Phone, ArrowRight, X } from "lucide-react";

export default function SupportPage() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const supportWhatsApp = "+2349035250086";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      fetchProfile();
    }
  }, [user, userLoading]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/creator-profile");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data.profile);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChatOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm ${profile?.full_name || user?.name} (${profile?.page_name || "Creator"}). I need support with my creator account.`,
    );
    window.open(`https://wa.me/${supportWhatsApp}?text=${message}`, "_blank");
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setEmailStatus(null);

    try {
      const response = await fetch("/api/support-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile?.full_name || user?.name,
          email: user?.email,
          page_name: profile?.page_name,
          subject: emailForm.subject,
          message: emailForm.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      setEmailStatus({
        type: "success",
        message: "Email sent successfully! We'll get back to you soon.",
      });
      setEmailForm({ subject: "", message: "" });
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailStatus(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setEmailStatus({
        type: "error",
        message: "Failed to send email. Please try again.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBookCall = () => {
    const message = encodeURIComponent(
      `📞 CALL BOOKING REQUEST\n\nName: ${profile?.full_name || user?.name}\nPage: ${profile?.page_name || "N/A"}\nPhone: ${profile?.phone_number || "N/A"}\nEmail: ${user?.email || "N/A"}\n\nI would like to book a call with the support team. Please call me back within 15 minutes to 4 hours. Thank you!`,
    );
    window.open(`https://wa.me/${supportWhatsApp}?text=${message}`, "_blank");
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <PortalNav activePage="/portal/support" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#726BFF] dark:border-[#6366FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
              Loading support options...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/support" />

      <main
        className={`max-w-[1240px] mx-auto px-6 py-8 ${mounted ? "page-enter-active" : "page-enter"}`}
      >
        {/* Header */}
        <div
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            Support Center
          </h1>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            Get help from our support team through multiple channels
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chat on WhatsApp */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-xl transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mb-6 mx-auto">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
              Chat on WhatsApp
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6 text-center">
              Get instant support through WhatsApp. Chat with our support team
              in real-time.
            </p>
            <button
              onClick={handleChatOnWhatsApp}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE57] transition-all duration-200 font-inter font-medium"
            >
              <span>Start Chat</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Send Email */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-xl transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center mb-6 mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
              Send an Email
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6 text-center">
              Send detailed inquiries and get email support from our team.
            </p>
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] transition-all duration-200 font-inter font-medium"
            >
              <span>Send Email</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Book a Call */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-xl transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#EE5A6F] flex items-center justify-center mb-6 mx-auto">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
              Book a Call
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-2 text-center">
              Schedule a phone call with our support team for personalized
              assistance.
            </p>
            <p className="font-inter text-xs text-[#726BFF] dark:text-[#6366FF] font-medium mb-6 text-center">
              📞 Call within 15 mins - 4 hours
            </p>
            <button
              onClick={handleBookCall}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#EE5A6F] transition-all duration-200 font-inter font-medium"
            >
              <span>Book Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div
          className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-xl p-8 text-white animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl mb-3">
              Need Help? We're Here for You!
            </h2>
            <p className="font-inter text-sm text-white/90 mb-6">
              Our dedicated support team is ready to assist you with any
              questions or concerns. Choose your preferred method of contact
              above, and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="font-inter text-sm">
                  24/7 WhatsApp Support
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="font-inter text-sm">
                  Email Response in 24hrs
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="font-inter text-sm">
                  Quick Call Scheduling
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className="mt-8 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-8 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-plus-jakarta-sans font-semibold text-base text-[#111111] dark:text-white mb-2">
                How quickly will I get a response?
              </h4>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                WhatsApp messages are typically answered within minutes. Email
                requests are responded to within 24 hours, and calls are
                scheduled within 15 minutes to 4 hours.
              </p>
            </div>
            <div>
              <h4 className="font-plus-jakarta-sans font-semibold text-base text-[#111111] dark:text-white mb-2">
                What issues can I get help with?
              </h4>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                We can assist with account issues, payment inquiries, contract
                questions, technical support, and any other concerns related to
                your creator account.
              </p>
            </div>
            <div>
              <h4 className="font-plus-jakarta-sans font-semibold text-base text-[#111111] dark:text-white mb-2">
                Is support available 24/7?
              </h4>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                WhatsApp support is available 24/7 for urgent matters. Phone
                calls are scheduled during business hours, and emails are
                answered within one business day.
              </p>
            </div>
            <div>
              <h4 className="font-plus-jakarta-sans font-semibold text-base text-[#111111] dark:text-white mb-2">
                Can I switch between support channels?
              </h4>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                Absolutely! You can start with WhatsApp and request a call or
                email follow-up. Our team will ensure continuity across all
                channels.
              </p>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-[#1E1E1E] border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between">
                <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
                  Send Email to Support
                </h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200"
                >
                  <X size={20} className="text-[#525252] dark:text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSendEmail} className="p-6">
                <div className="mb-4">
                  <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={profile?.full_name || user?.name || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#525252] dark:text-white dark:text-opacity-70"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#525252] dark:text-white dark:text-opacity-70"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-[#726BFF] dark:focus:border-[#6366FF]"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, message: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-[#726BFF] dark:focus:border-[#6366FF] resize-none"
                  />
                </div>

                {emailStatus && (
                  <div
                    className={`mb-4 p-4 rounded-lg ${emailStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400"}`}
                  >
                    <p className="font-inter text-sm">{emailStatus.message}</p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="flex-1 px-6 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] transition-all duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-[#262626] text-[#525252] dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#333333] transition-all duration-200 font-inter font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <p className="mt-4 text-center font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                  Email will be sent to:{" "}
                  <span className="font-semibold">support@falcusmedia.com</span>
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Animation Styles */}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .page-enter {
            opacity: 0;
          }

          .page-enter-active {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }
        `}</style>
      </main>
    </div>
  );
}
