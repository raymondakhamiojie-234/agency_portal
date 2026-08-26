"use client";

import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  Target,
  Eye,
  Heart,
  TrendingUp,
  Shield,
  Lightbulb,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-20 lg:py-24">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-plus-jakarta-sans font-bold text-[#111111] dark:text-white leading-[1.15] text-4xl md:text-5xl lg:text-[54px]">
              About{" "}
              <span className="text-[#726BFF] dark:text-[#6366FF]">
                Falcus Media Ltd
              </span>
            </h1>
            <p className="font-plus-jakarta-sans text-[#525252] dark:text-white dark:text-opacity-70 text-lg leading-[1.6]">
              A modern digital marketing agency built for brands that want
              measurable growth—not vanity metrics. We combine creativity, data,
              and platform expertise to deliver scalable results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-6 bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-8">
              <div className="w-12 h-12 rounded-full bg-[#F4F5FF] dark:bg-[#6366FF]/20 flex items-center justify-center mb-6">
                <Target
                  size={24}
                  className="text-[#726BFF] dark:text-[#6366FF]"
                />
              </div>
              <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
                To help businesses grow sustainably through ethical, data-backed
                digital marketing strategies that deliver real, measurable
                results.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-8">
              <div className="w-12 h-12 rounded-full bg-[#F4F5FF] dark:bg-[#6366FF]/20 flex items-center justify-center mb-6">
                <Eye size={24} className="text-[#726BFF] dark:text-[#6366FF]" />
              </div>
              <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
                To become a trusted growth partner for brands across Africa and
                beyond, empowering businesses to scale profitably and
                sustainably.
              </p>
            </div>

            {/* Values Preview */}
            <div className="bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] rounded-xl p-8 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Heart size={24} className="text-white" />
              </div>
              <h2 className="font-plus-jakarta-sans font-bold text-2xl mb-4">
                Our Core Values
              </h2>
              <p className="text-white/90 leading-relaxed">
                Integrity, Performance, Transparency, and Innovation guide
                everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Detailed */}
      <section className="py-20 px-6 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-2xl mx-auto">
              These principles shape our work, our relationships with clients,
              and our approach to digital marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Integrity",
                description:
                  "We operate with honesty and transparency, always putting our clients' best interests first.",
              },
              {
                icon: TrendingUp,
                title: "Performance",
                description:
                  "Results matter. We're obsessed with delivering measurable growth and ROI for every client.",
              },
              {
                icon: Shield,
                title: "Transparency",
                description:
                  "Clear communication, honest reporting, and full visibility into what we're doing and why.",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description:
                  "We stay ahead of platform changes and industry trends to give clients a competitive edge.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-6 hover:border-[#726BFF] dark:hover:border-[#6366FF] hover:shadow-lg transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#F4F5FF] dark:bg-[#6366FF]/20 flex items-center justify-center mb-4">
                  <value.icon
                    size={20}
                    className="text-[#726BFF] dark:text-[#6366FF]"
                  />
                </div>
                <h3 className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision for Africa's Creator Economy */}
      <section className="py-20 px-6 bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#1E1E1E] rounded-full border border-[#726BFF] dark:border-[#6366FF] mb-6">
                <Eye
                  size={14}
                  className="mr-2 text-[#726BFF] dark:text-[#6366FF]"
                />
                <span className="font-inter font-semibold text-xs text-[#726BFF] dark:text-[#6366FF]">
                  Our Vision
                </span>
              </div>

              <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-6">
                Empowering Africa's Creator Economy
              </h2>
              <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
                Our vision is to give creators across Africa the biggest and
                easiest path to fame and wealth through social media earnings.
              </p>
              <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
                Falcus Media Ltd exists to turn talent into sustainable digital
                businesses. We believe creators deserve protection,
                monetization, and systems—not punishment, guesswork, or luck.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Protection, not punishment",
                  description:
                    "Safeguarding creators from platform strikes and account issues.",
                },
                {
                  title: "Monetization, not guesswork",
                  description:
                    "Clear pathways to unlock earnings and maximize revenue potential.",
                },
                {
                  title: "Systems, not luck",
                  description:
                    "Proven frameworks for sustainable growth and long-term success.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-6"
                >
                  <h3 className="font-inter font-semibold text-[#111111] dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-6 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-plus-jakarta-sans font-bold text-3xl md:text-4xl text-[#111111] dark:text-white mb-4">
              Industries We Serve
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 max-w-2xl mx-auto">
              We work with businesses across various sectors, helping them
              achieve sustainable growth through tailored digital marketing
              strategies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "E-commerce",
              "Beauty & Fashion",
              "Real Estate",
              "Education",
              "SMEs & Startups",
              "Service-based",
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-4 text-center hover:border-[#726BFF] dark:hover:border-[#6366FF] transition-all duration-200"
              >
                <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
                  {industry}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FalcusFooter />
    </div>
  );
}
