"use client";

import { useState } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const contactInfo = {
    email: "support@falcusmedia.com",
    phone: "+2349035250086",
    whatsapp: "+2349035250086",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/support-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Contact Form: ${formData.company || "General Inquiry"}`,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"}\nCompany: ${formData.company || "N/A"}\n\nMessage:\n${formData.message}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus({
        type: "success",
        message:
          "Thank you for contacting us! We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message:
          "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in learning more about Falcus Media's services.`,
    );
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=${message}`,
      "_blank",
    );
  };

  const handleCall = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contactInfo.email}?subject=Inquiry from Website`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://raw.createusercontent.com/e9e6565a-7072-4687-8ea3-fb787b6d88a5/)",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-plus-jakarta-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Let's Grow Your Business Together
          </h1>
          <p className="font-inter text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Ready to transform your digital presence? Get in touch with us today
            and let's discuss how we can help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-16 px-6 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              Choose Your Preferred Contact Method
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-2xl mx-auto">
              We're here to help! Reach out through any of these channels and
              we'll respond as quickly as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* WhatsApp Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border-2 border-[#25D366] dark:border-[#25D366] rounded-2xl p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mb-6 mx-auto">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
                WhatsApp
              </h3>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6 text-center">
                Get instant responses via WhatsApp. Chat with our team in
                real-time.
              </p>
              <div className="text-center mb-6">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  className="font-inter text-base font-semibold text-[#25D366] hover:underline"
                >
                  {contactInfo.whatsapp}
                </a>
              </div>
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE57] transition-all duration-200 font-inter font-medium"
              >
                <MessageCircle size={18} />
                <span>Start Chat</span>
              </button>
            </div>

            {/* Phone Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border-2 border-[#726BFF] dark:border-[#6366FF] rounded-2xl p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center mb-6 mx-auto">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
                Call Us
              </h3>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6 text-center">
                Speak directly with our team. We're ready to answer your
                questions.
              </p>
              <div className="text-center mb-6">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="font-inter text-base font-semibold text-[#726BFF] dark:text-[#6366FF] hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <button
                onClick={handleCall}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] transition-all duration-200 font-inter font-medium"
              >
                <Phone size={18} />
                <span>Call Now</span>
              </button>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border-2 border-[#FF6B6B] rounded-2xl p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#EE5A6F] flex items-center justify-center mb-6 mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3 text-center">
                Email
              </h3>
              <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6 text-center">
                Send us a detailed email. We respond within 24 hours.
              </p>
              <div className="text-center mb-6">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="font-inter text-base font-semibold text-[#FF6B6B] hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
              <button
                onClick={handleEmail}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#EE5A6F] transition-all duration-200 font-inter font-medium"
              >
                <Mail size={18} />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6 bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-3">
                Send Us a Message
              </h2>
              <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your business and how we can help..."
                />
              </div>

              {status && (
                <div
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    status.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {status.type === "success" && (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p
                    className={`font-inter text-sm ${
                      status.type === "success"
                        ? "text-green-800 dark:text-green-400"
                        : "text-red-800 dark:text-red-400"
                    }`}
                  >
                    {status.message}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] active:scale-95 transition-all duration-200 font-plus-jakarta-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 px-6 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Hours */}
            <div className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-plus-jakarta-sans font-bold text-2xl">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3 font-inter">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-sm">
                  <strong>24/7 WhatsApp Support:</strong> For urgent inquiries,
                  message us on WhatsApp anytime!
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F4F5FF] dark:bg-[#6366FF]/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#726BFF] dark:text-[#6366FF]" />
                </div>
                <h3 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white">
                  Get in Touch
                </h3>
              </div>
              <div className="space-y-4 font-inter text-[#525252] dark:text-white dark:text-opacity-70">
                <p className="text-base leading-relaxed">
                  Whether you're looking to grow your social media presence,
                  launch a new campaign, or scale your digital marketing
                  efforts, we're here to help.
                </p>
                <p className="text-base leading-relaxed">
                  Our team of experts is ready to provide you with customized
                  solutions that drive real results. Let's start a conversation
                  about your goals!
                </p>
                <div className="pt-4">
                  <a
                    href="/portal/onboarding"
                    className="inline-flex items-center space-x-2 text-[#726BFF] dark:text-[#6366FF] font-semibold hover:underline"
                  >
                    <span>Apply for Creator Management</span>
                    <Send size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FalcusFooter />
    </div>
  );
}
