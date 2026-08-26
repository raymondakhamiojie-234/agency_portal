"use client";

import { useState, useEffect } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Music,
  CheckCircle,
} from "lucide-react";

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedServices, setSelectedServices] = useState({});

  const whatsappNumber = "+2349035250086";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleServiceRequest = (platform, service) => {
    const message = encodeURIComponent(
      `🎯 SERVICE REQUEST\n\nPlatform: ${platform}\nService: ${service}\n\nI would like to request this service. Please provide more information and pricing.`,
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section with Scroll Effect */}
      <section className="relative bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 opacity-0 animate-fade-in-up">
          <h1 className="font-plus-jakarta-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Premium Social Media Services
          </h1>
          <p className="font-inter text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Boost your social media presence with our expert services. From
            account management to growth strategies, we've got you covered.
          </p>
        </div>
      </section>

      <main
        className={`max-w-[1240px] mx-auto px-6 py-16 ${mounted ? "page-enter-active" : "page-enter"}`}
      >
        {/* Why Choose Our Services Section */}
        <div
          className="mb-16 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="text-center mb-12">
            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              Why Choose Our Services
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-3xl mx-auto">
              Professional, reliable, and results-driven social media solutions
              for your growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Verified & Authentic",
                description:
                  "All services use genuine, organic growth methods that comply with platform policies",
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                description:
                  "Track record of helping thousands of accounts grow and monetize successfully",
              },
              {
                icon: MessageCircle,
                title: "24/7 Support",
                description:
                  "Direct WhatsApp support for all your questions and service requests",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* YouTube Services */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              YouTube
            </h3>
            <div className="space-y-2 mb-4">
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Select Service
              </label>
              <select
                value={selectedServices.youtube || ""}
                onChange={(e) =>
                  setSelectedServices({
                    ...selectedServices,
                    youtube: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-red-500"
              >
                <option value="">Choose a service...</option>
                <option value="Buy YouTube Channel">Buy YouTube Channel</option>
                <option value="Buy Watch Hours">Buy Watch Hours</option>
                <option value="Buy Subscribers">Buy Subscribers</option>
              </select>
              {selectedServices.youtube && (
                <button
                  onClick={() =>
                    handleServiceRequest("YouTube", selectedServices.youtube)
                  }
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-inter text-sm font-medium"
                >
                  <span>Request Service</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Facebook Services */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              Facebook
            </h3>
            <div className="space-y-2 mb-4">
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Select Service
              </label>
              <select
                value={selectedServices.facebook || ""}
                onChange={(e) =>
                  setSelectedServices({
                    ...selectedServices,
                    facebook: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a service...</option>
                <option value="Buy a Page">Buy a Page</option>
                <option value="Buy Followers">Buy Followers</option>
                <option value="Buy Views">Buy Views</option>
                <option value="Buy Comments">Buy Comments</option>
                <option value="Verify Your Profile">Verify Your Profile</option>
              </select>
              {selectedServices.facebook && (
                <button
                  onClick={() =>
                    handleServiceRequest("Facebook", selectedServices.facebook)
                  }
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-inter text-sm font-medium"
                >
                  <span>Request Service</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* TikTok Services */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
              <Music className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              TikTok
            </h3>
            <div className="space-y-2 mb-4">
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Select Service
              </label>
              <select
                value={selectedServices.tiktok || ""}
                onChange={(e) =>
                  setSelectedServices({
                    ...selectedServices,
                    tiktok: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-pink-500"
              >
                <option value="">Choose a service...</option>
                <option value="Buy UK TikTok Account">
                  Buy UK TikTok Account
                </option>
                <option value="Buy Likes">Buy Likes</option>
              </select>
              {selectedServices.tiktok && (
                <button
                  onClick={() =>
                    handleServiceRequest("TikTok", selectedServices.tiktok)
                  }
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-200 font-inter text-sm font-medium"
                >
                  <span>Request Service</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Instagram Services */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              Instagram
            </h3>
            <div className="space-y-2 mb-4">
              <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
                Select Service
              </label>
              <select
                value={selectedServices.instagram || ""}
                onChange={(e) =>
                  setSelectedServices({
                    ...selectedServices,
                    instagram: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-[#111111] dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose a service...</option>
                <option value="Buy an Instagram Account">
                  Buy an Instagram Account
                </option>
                <option value="Buy Instagram Followers">
                  Buy Instagram Followers
                </option>
                <option value="Buy Instagram Likes">Buy Instagram Likes</option>
                <option value="Buy Instagram Comments">
                  Buy Instagram Comments
                </option>
              </select>
              {selectedServices.instagram && (
                <button
                  onClick={() =>
                    handleServiceRequest(
                      "Instagram",
                      selectedServices.instagram,
                    )
                  }
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-inter text-sm font-medium"
                >
                  <span>Request Service</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* WhatsApp API */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              WhatsApp API
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
              Link our WhatsApp API to your Business WhatsApp for automated
              messaging and customer engagement.
            </p>
            <button
              onClick={() =>
                handleServiceRequest("WhatsApp API", "Link Business WhatsApp")
              }
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-inter font-medium"
            >
              <span>Request Integration</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Page Promotion */}
          <div
            className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-200 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-4">
              Page Promotion
            </h3>
            <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
              Order professional promotion services for your page. Increase
              visibility, engagement, and reach across all platforms.
            </p>
            <button
              onClick={() =>
                handleServiceRequest("Page Promotion", "Promote My Page")
              }
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#726BFF] dark:bg-[#6366FF] text-white rounded-lg hover:bg-[#5E55E5] dark:hover:bg-[#5558E3] transition-all duration-200 font-inter font-medium"
            >
              <span>Request Promotion</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-xl p-8 text-white opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl mb-3">
              Need Custom Services?
            </h2>
            <p className="font-inter text-sm text-white/90 mb-6">
              Don't see what you're looking for? Contact us on WhatsApp and
              we'll create a custom solution tailored to your needs.
            </p>
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hi! I need information about custom services for my social media accounts.`,
                );
                window.open(
                  `https://wa.me/${whatsappNumber}?text=${message}`,
                  "_blank",
                );
              }}
              className="inline-flex items-center justify-center space-x-2 bg-white text-[#726BFF] dark:text-[#6366FF] font-plus-jakarta-sans font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <MessageCircle size={18} />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

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

      <FalcusFooter />
    </div>
  );
}
