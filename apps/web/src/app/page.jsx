"use client";

import { useEffect, useState } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  TrendingUp,
  Target,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

const HERO_SLIDES = [
  {
    title: "Turn Your Content Into Cash",
    subtitle:
      "Join thousands of creators earning $10K+ monthly through our proven monetization strategies",
    cta: "Start Earning Today",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "Scale Your Social Media Empire",
    subtitle:
      "Professional social media management that drives engagement, growth, and real business results",
    cta: "Grow Your Audience",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    title: "Maximize Your Sales Performance",
    subtitle:
      "Data-driven strategies that convert followers into paying customers and boost your revenue",
    cta: "Boost Your Sales",
    gradient: "from-green-600 to-emerald-600",
  },
  {
    title: "Monetize Your Influence",
    subtitle:
      "Transform your social presence into a profitable business with expert guidance and support",
    cta: "Get Started Now",
    gradient: "from-orange-600 to-red-600",
  },
];

const FEATURED_CASE_STUDIES = [
  {
    id: 1,
    title: "Account Restoration After Permanent Suspension",
    category: "Account Recovery",
    result: "Page fully restored, violations cleared, monetization reinstated.",
    metrics: { restoration: "100%", timeline: "14 days", revenue: "Full" },
    icon: RefreshCw,
  },
  {
    id: 2,
    title: "Demonetization & Payout Restriction Recovery",
    category: "Monetization",
    result: "Monetization restored and revenue secured.",
    metrics: { restored: "₦2.5M", timeline: "21 days", success: "100%" },
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Viral Reach Expansion",
    category: "Growth",
    result: "1,000,000 reach achieved; follower growth increased by 35%.",
    metrics: { reach: "+950K", followers: "+35%", engagement: "+120%" },
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Content Violation Clearance",
    category: "Compliance",
    result: "All violations cleared and monetization restored.",
    metrics: { strikes: "5 cleared", timeline: "10 days", status: "Clean" },
    icon: Shield,
  },
  {
    id: 5,
    title: "Brand Partnership Recovery",
    category: "Business",
    result: "Restrictions lifted within 72 hours.",
    metrics: { timeline: "72 hours", deal: "₦5M", impact: "Secured" },
    icon: CheckCircle,
  },
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section with Slideshow */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-[#121212]">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-20 transition-all duration-1000`}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="transition-all duration-700 ease-in-out">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              {slide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/portal/onboarding"
                className={`px-8 py-4 bg-gradient-to-r ${slide.gradient} text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-2xl hover:scale-105 text-lg`}
              >
                {slide.cta}
              </a>
              <a
                href="/about"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20 text-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </section>

      {/* Problem We Solve Section */}
      <section className="py-20 px-6 bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              The Problem We Solve
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-3xl mx-auto">
              Most businesses struggle with common challenges that prevent them
              from scaling. We fix this by building structured, data-backed
              growth systems that turn traffic into customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Low reach and poor engagement",
              "Ad spend with no measurable returns",
              "Inconsistent content that doesn't convert",
              "Missed leads and slow response times",
            ].map((problem, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-6 hover:border-[#726BFF] dark:hover:border-[#6366FF] transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      ✕
                    </span>
                  </div>
                  <p className="font-inter text-[#111111] dark:text-white">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative py-20 px-6 bg-white dark:bg-[#121212] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://raw.createusercontent.com/18c095c1-ad3a-4dfc-96f7-18a6be603ff3/)",
            opacity: 0.06,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/98 to-white/95 dark:from-[#121212]/95 dark:via-[#121212]/98 dark:to-[#121212]/95" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#1E1E1E] rounded-full border border-[#726BFF] dark:border-[#6366FF] mb-6">
              <Zap
                size={14}
                className="mr-2 text-[#726BFF] dark:text-[#6366FF]"
              />
              <span className="font-inter font-semibold text-xs text-[#726BFF] dark:text-[#6366FF]">
                What We Do
              </span>
            </div>

            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-6">
              Complete Growth Solutions
            </h2>

            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-3xl mx-auto">
              We help brands attract the right audience, convert attention into
              qualified leads, turn leads into paying customers, and scale
              sustainably with performance marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Social Media Management",
                description:
                  "Full-service social media management across all platforms with consistent content and community engagement.",
              },
              {
                title: "Paid Ads (Meta & Google)",
                description:
                  "Data-driven advertising campaigns optimized for conversions and maximum ROI on Meta and Google platforms.",
              },
              {
                title: "Content Strategy & Short-Form Video",
                description:
                  "Strategic content creation and short-form video production designed to capture attention and drive engagement.",
              },
              {
                title: "WhatsApp Business Automation",
                description:
                  "Automated WhatsApp business solutions to capture leads, nurture prospects, and close sales faster.",
              },
              {
                title: "Influencer & Campaign Management",
                description:
                  "End-to-end influencer partnerships and campaign management to amplify your brand reach.",
              },
              {
                title: "Performance Marketing",
                description:
                  "Results-driven marketing strategies focused on measurable growth, not vanity metrics.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-6 hover:border-[#726BFF] dark:hover:border-[#6366FF] hover:shadow-lg transition-all duration-200"
              >
                <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-6 bg-[#F9FAFB] dark:bg-[#0A0A0A] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://raw.createusercontent.com/9ded2858-96b0-4ce2-906f-13407dcb87b6/)",
            opacity: 0.05,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F9FAFB]/95 via-[#F9FAFB]/98 to-[#F9FAFB]/95 dark:from-[#0A0A0A]/95 dark:via-[#0A0A0A]/98 dark:to-[#0A0A0A]/95" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-6">
                Why Choose Falcus Media Ltd
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Strategy first — no guesswork, no hype",
                    description:
                      "We start with deep research and strategic planning before executing any campaign.",
                  },
                  {
                    title: "Data-driven decisions, not vanity metrics",
                    description:
                      "We focus on metrics that matter: conversions, revenue, and real business growth.",
                  },
                  {
                    title: "Clear communication & honest reporting",
                    description:
                      "Full transparency with regular reports showing exactly what's working and why.",
                  },
                  {
                    title: "Built for long-term growth, not quick wins",
                    description:
                      "We create sustainable systems that compound results over time.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 dark:text-green-400 text-sm font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-[#111111] dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
                  <Star size={14} className="mr-2" />
                  <span className="font-inter font-semibold text-xs">
                    Meta Tech Solution Provider
                  </span>
                </div>
                <h3 className="font-plus-jakarta-sans font-bold text-2xl">
                  Certified Meta & Google Partner
                </h3>
                <p className="font-inter text-sm leading-relaxed opacity-90">
                  As a Meta-verified agency and Google partner, we have direct
                  access to platform support, beta features, and advanced tools
                  to maximize your campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#1E1E1E] rounded-full border border-[#726BFF] dark:border-[#6366FF] mb-6">
              <Star
                size={14}
                className="mr-2 text-[#726BFF] dark:text-[#6366FF]"
              />
              <span className="font-inter font-semibold text-xs text-[#726BFF] dark:text-[#6366FF]">
                Testimonials
              </span>
            </div>

            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              Real Growth. Real Results.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "Falcus Media helped us turn social media from a branding tool into a real sales channel.",
                author: "Viral.",
                role: "Influencer",
              },
              {
                quote:
                  "Clear strategy, measurable results, and professional execution. Exactly what we needed.",
                author: "Michael O.",
                role: "Marketing Director",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-8 hover:border-[#726BFF] dark:hover:border-[#6366FF] transition-all duration-200"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#F9BE3D"
                      className="text-[#F9BE3D]"
                    />
                  ))}
                </div>
                <blockquote className="font-inter text-base mb-6 text-[#111111] dark:text-white leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-inter font-semibold text-sm text-[#111111] dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="font-inter text-xs text-[#6B7280] dark:text-white dark:text-opacity-60">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies Section */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#1E1E1E] rounded-full border border-[#6366FF] mb-6">
              <Star size={14} className="mr-2 text-[#6366FF]" />
              <span className="font-inter font-semibold text-xs text-[#6366FF]">
                Success Stories
              </span>
            </div>

            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-white mb-4">
              Real Results for Real Creators
            </h2>
            <p className="font-inter text-base text-white text-opacity-70 max-w-3xl mx-auto">
              See how we've helped Nigerian influencers resolve account issues,
              restore revenue, and achieve sustainable growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {FEATURED_CASE_STUDIES.slice(0, 3).map((study) => {
              const Icon = study.icon;
              return (
                <div
                  key={study.id}
                  className="bg-[#1E1E1E] rounded-xl border border-gray-700 p-6 hover:border-purple-600/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-semibold">
                        {study.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {study.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {study.result}
                  </p>
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    {Object.entries(study.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-green-400 font-bold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {FEATURED_CASE_STUDIES.slice(3, 5).map((study) => {
              const Icon = study.icon;
              return (
                <div
                  key={study.id}
                  className="bg-[#1E1E1E] rounded-xl border border-gray-700 p-6 hover:border-purple-600/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-semibold">
                        {study.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {study.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {study.result}
                  </p>
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    {Object.entries(study.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-green-400 font-bold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <a
              href="/case-studies"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-600/50"
            >
              View All 25+ Case Studies
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-16 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl bg-[#726BFF] dark:bg-[#6366FF]"
            style={{
              boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="relative py-20 px-8 text-center">
              <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-white mb-4">
                Ready to grow your business with a strategy that actually works?
              </h2>
              <p className="font-inter text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Get a free growth audit and discover exactly how we can help you
                scale profitably.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 bg-white text-[#726BFF] dark:text-[#6366FF] font-plus-jakarta-sans font-semibold text-base px-8 py-4 rounded-[20px] hover:bg-gray-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
              >
                <span>Get Your Free Growth Audit</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <FalcusFooter />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
