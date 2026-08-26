"use client";

import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import { FileText, Shield, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] py-16 md:py-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="font-plus-jakarta-sans font-bold text-white text-4xl md:text-5xl">
              Terms of Service
            </h1>
            <p className="font-inter text-white/90 text-lg">
              Last Updated: January 21, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-12">
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              Welcome to Falcus Media. These Terms of Service ("Terms") govern
              your access to and use of the Falcus Media website, applications,
              platforms, tools, dashboards, APIs, and related services
              (collectively, the "Services").
            </p>
            <div className="bg-[#F4F5FF] dark:bg-[#1E1E1E] border-l-4 border-[#726BFF] dark:border-[#6366FF] p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle
                  size={20}
                  className="text-[#726BFF] dark:text-[#6366FF] flex-shrink-0 mt-1"
                />
                <p className="font-inter text-sm text-[#111111] dark:text-white">
                  <strong>Important:</strong> By accessing, registering, or
                  using our Services, you agree to be legally bound by these
                  Terms. If you do not agree, you must not use our Services.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-lg p-8">
            <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-6">
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { num: "1", title: "Definitions" },
                { num: "2", title: "Eligibility" },
                { num: "3", title: "Scope of Services" },
                {
                  num: "4",
                  title: "Account Registration and Responsibilities",
                },
                { num: "5", title: "Acceptable Use Policy" },
                { num: "6", title: "Third-Party Platform Integration" },
                { num: "7", title: "Data Usage and Privacy" },
                { num: "8", title: "Payments, Fees, and Billing" },
                { num: "9", title: "Intellectual Property Rights" },
                { num: "10", title: "User Content" },
                { num: "11", title: "Service Availability and Disclaimer" },
                { num: "12", title: "Limitation of Liability" },
                { num: "13", title: "Indemnification" },
                { num: "14", title: "Suspension and Termination" },
                { num: "15", title: "Governing Law and Jurisdiction" },
                { num: "16", title: "Changes to These Terms" },
                { num: "17", title: "Contact Information" },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="font-inter text-sm text-[#726BFF] dark:text-[#6366FF] hover:underline"
                >
                  {item.num}. {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Section 1: Definitions */}
          <div id="section-1" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              1. Definitions
            </h2>
            <ul className="space-y-3 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              <li>
                <strong className="text-[#111111] dark:text-white">
                  "Falcus Media," "we," "our," or "us"
                </strong>{" "}
                refers to Falcus Media and its affiliates.
              </li>
              <li>
                <strong className="text-[#111111] dark:text-white">
                  "User," "you," or "your"
                </strong>{" "}
                refers to any individual or entity accessing or using the
                Services.
              </li>
              <li>
                <strong className="text-[#111111] dark:text-white">
                  "Services"
                </strong>{" "}
                include all websites, applications, platforms, tools, content,
                and services provided by Falcus Media.
              </li>
              <li>
                <strong className="text-[#111111] dark:text-white">
                  "Third-Party Platforms"
                </strong>{" "}
                include Meta platforms (Facebook, Instagram, WhatsApp,
                Messenger) and any external services integrated with our
                Services.
              </li>
            </ul>
          </div>

          {/* Section 2: Eligibility */}
          <div id="section-2" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              2. Eligibility
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              To use our Services, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>
                Be at least 18 years old (or the legal age in your jurisdiction)
              </li>
              <li>Have the legal authority to enter into binding agreements</li>
              <li>
                Not be prohibited from using digital services under applicable
                laws
              </li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              By using the Services, you confirm that you meet these
              requirements.
            </p>
          </div>

          {/* Section 3: Scope of Services */}
          <div id="section-3" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              3. Scope of Services
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Falcus Media provides digital media, advertising, creator
              management, monetization support, analytics, automation tools, and
              technology-driven media solutions.
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              <li>Modify, suspend, or discontinue any part of the Services</li>
              <li>Add or remove features at our discretion</li>
              <li>
                Update systems to comply with platform or legal requirements
              </li>
            </ul>
          </div>

          {/* Section 4: Account Registration */}
          <div id="section-4" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              4. Account Registration and Responsibilities
            </h2>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              4.1 Account Creation
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              Some Services require account registration. You agree to provide
              accurate, complete, and current information.
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              4.2 Account Security
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Maintaining confidentiality of login credentials</li>
              <li>All activities occurring under your account</li>
              <li>Notifying us immediately of unauthorized access</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Falcus Media is not liable for losses resulting from compromised
              accounts due to user negligence.
            </p>
          </div>

          {/* Section 5: Acceptable Use Policy */}
          <div id="section-5" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              5. Acceptable Use Policy
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Violate any laws or regulations</li>
              <li>
                Breach Meta, Facebook, Instagram, or third-party platform
                policies
              </li>
              <li>Engage in fraud, impersonation, or deceptive practices</li>
              <li>Access data without authorization</li>
              <li>Interfere with system security or functionality</li>
              <li>Upload malicious code, malware, or harmful content</li>
              <li>Abuse APIs or scrape data unlawfully</li>
            </ul>
            <p className="font-inter text-base text-[#111111] dark:text-white font-semibold">
              We reserve the right to suspend or terminate accounts for
              violations.
            </p>
          </div>

          {/* Section 6: Third-Party Platform Integration */}
          <div id="section-6" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              6. Third-Party Platform Integration
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Our Services may integrate with third-party platforms, including
              Meta platforms.
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>
                Your use of those platforms is governed by their own terms and
                policies
              </li>
              <li>Falcus Media does not control third-party platforms</li>
              <li>
                Platform access may be limited, revoked, or changed by those
                platforms
              </li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Falcus Media is not responsible for outages, restrictions, or
              policy enforcement actions taken by third-party platforms.
            </p>
          </div>

          {/* Section 7: Data Usage and Privacy */}
          <div id="section-7" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              7. Data Usage and Privacy
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Your use of the Services is subject to our Privacy Policy, which
              explains how we collect, use, and protect data.
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              By using our Services, you consent to data processing as outlined
              in the Privacy Policy.
            </p>
          </div>

          {/* Section 8: Payments, Fees, and Billing */}
          <div id="section-8" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              8. Payments, Fees, and Billing (If Applicable)
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              Where applicable:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Fees are disclosed before purchase or agreement</li>
              <li>Payments must be made on time</li>
              <li>
                Failure to pay may result in service suspension or termination
              </li>
              <li>
                Fees are non-refundable unless stated otherwise in writing
              </li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Falcus Media reserves the right to change pricing with notice.
            </p>
          </div>

          {/* Section 9: Intellectual Property Rights */}
          <div id="section-9" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              9. Intellectual Property Rights
            </h2>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              9.1 Ownership
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              All content, software, systems, designs, trademarks, logos,
              dashboards, and tools provided by Falcus Media are owned by or
              licensed to Falcus Media.
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              9.2 License
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable license to
              use the Services solely for lawful purposes.
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              <li>
                Copy, modify, reverse engineer, or redistribute our systems
              </li>
              <li>Use our intellectual property without written permission</li>
            </ul>
          </div>

          {/* Section 10: User Content */}
          <div id="section-10" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              10. User Content
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              If you submit content to Falcus Media (including data, media, or
              materials), you:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Retain ownership of your content</li>
              <li>
                Grant Falcus Media a license to use it to provide Services
              </li>
              <li>Confirm you have rights to submit the content</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              You are responsible for ensuring your content does not violate
              laws or third-party rights.
            </p>
          </div>

          {/* Section 11: Service Availability */}
          <div id="section-11" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              11. Service Availability and Disclaimer
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              The Services are provided "as is" and "as available."
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Uninterrupted or error-free operation</li>
              <li>Specific performance results</li>
              <li>Platform approvals or monetization outcomes</li>
            </ul>
            <p className="font-inter text-base text-[#111111] dark:text-white font-semibold">
              Use of the Services is at your own risk.
            </p>
          </div>

          {/* Section 12: Limitation of Liability */}
          <div id="section-12" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              12. Limitation of Liability
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              To the maximum extent permitted by law, Falcus Media shall not be
              liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business</li>
              <li>Platform suspensions or account restrictions</li>
              <li>Third-party actions or policy enforcement</li>
            </ul>
            <p className="font-inter text-base text-[#111111] dark:text-white font-semibold">
              Our total liability shall not exceed the amount paid to us in the
              preceding 12 months, if any.
            </p>
          </div>

          {/* Section 13: Indemnification */}
          <div id="section-13" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              13. Indemnification
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              You agree to indemnify and hold harmless Falcus Media from any
              claims, damages, liabilities, or expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your breach of platform policies</li>
              <li>Your content or actions</li>
            </ul>
          </div>

          {/* Section 14: Suspension and Termination */}
          <div id="section-14" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              14. Suspension and Termination
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              We may suspend or terminate access:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>For violation of these Terms</li>
              <li>For legal or compliance reasons</li>
              <li>To protect system integrity or other users</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Termination does not waive accrued obligations.
            </p>
          </div>

          {/* Section 15: Governing Law */}
          <div id="section-15" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              15. Governing Law and Jurisdiction
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              These Terms shall be governed by the laws of Nigeria, without
              regard to conflict of law principles.
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Any disputes shall be resolved in the courts of that jurisdiction
              unless otherwise required by law.
            </p>
          </div>

          {/* Section 16: Changes to Terms */}
          <div id="section-16" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              16. Changes to These Terms
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              We may update these Terms at any time. Updates will be posted with
              a revised "Last Updated" date. Continued use of the Services
              constitutes acceptance of the updated Terms.
            </p>
          </div>

          {/* Section 17: Contact Information */}
          <div id="section-17" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              17. Contact Information
            </h2>
            <div className="bg-[#F4F5FF] dark:bg-[#1E1E1E] rounded-lg p-6 border border-[#726BFF] dark:border-[#6366FF]">
              <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
                For questions, concerns, or legal notices:
              </p>
              <div className="space-y-2">
                <p className="font-plus-jakarta-sans font-bold text-lg text-[#111111] dark:text-white">
                  Falcus Media
                </p>
                <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70">
                  📧 Email:{" "}
                  <a
                    href="mailto:support@falcusmedia.com"
                    className="text-[#726BFF] dark:text-[#6366FF] hover:underline"
                  >
                    support@falcusmedia.com
                  </a>
                </p>
                <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70">
                  🌐 Website:{" "}
                  <a
                    href="/"
                    className="text-[#726BFF] dark:text-[#6366FF] hover:underline"
                  >
                    www.falcusmedia.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border-2 border-[#E5E7EB] dark:border-gray-700 p-8 text-center">
            <Shield
              size={40}
              className="text-[#726BFF] dark:text-[#6366FF] mx-auto mb-4"
            />
            <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3">
              Questions About Our Terms?
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 mb-6">
              Our team is here to help clarify anything you need.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3 rounded-[20px] hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <FalcusFooter />
    </div>
  );
}
