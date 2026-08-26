"use client";

import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import { Shield, Lock, AlertCircle, Eye } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <FalcusHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#726BFF] to-[#7B35FF] dark:from-[#6366FF] dark:to-[#8B5CF6] py-16 md:py-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="font-plus-jakarta-sans font-bold text-white text-4xl md:text-5xl">
              Privacy Policy
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
              Falcus Media ("Falcus Media," "we," "our," or "us") is committed
              to protecting the privacy, security, and integrity of personal
              data collected from users of our website, applications, platforms,
              products, and services (collectively, the "Services").
            </p>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              This Privacy Policy explains how we collect, use, store, share,
              and protect personal information when you interact with the Falcus
              Media website, mobile applications, tools, APIs, dashboards, and
              related digital services.
            </p>
            <div className="bg-[#F4F5FF] dark:bg-[#1E1E1E] border-l-4 border-[#726BFF] dark:border-[#6366FF] p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle
                  size={20}
                  className="text-[#726BFF] dark:text-[#6366FF] flex-shrink-0 mt-1"
                />
                <p className="font-inter text-sm text-[#111111] dark:text-white">
                  <strong>Important:</strong> By accessing or using our
                  Services, you acknowledge that you have read, understood, and
                  agreed to the practices described in this Privacy Policy.
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
                { num: "1", title: "Scope of This Privacy Policy" },
                { num: "2", title: "Information We Collect" },
                { num: "3", title: "How We Use Your Information" },
                { num: "4", title: "Legal Basis for Processing" },
                { num: "5", title: "Data Sharing and Disclosure" },
                { num: "6", title: "Data Retention" },
                { num: "7", title: "Data Security" },
                { num: "8", title: "User Rights and Choices" },
                { num: "9", title: "Cookies and Tracking Technologies" },
                { num: "10", title: "Children's Privacy" },
                { num: "11", title: "International Data Transfers" },
                { num: "12", title: "Third-Party Links and Services" },
                { num: "13", title: "Changes to This Privacy Policy" },
                { num: "14", title: "Contact Information" },
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

          {/* Section 1: Scope */}
          <div id="section-1" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              1. Scope of This Privacy Policy
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              This Privacy Policy applies to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>The Falcus Media website</li>
              <li>All Falcus Media mobile and web applications</li>
              <li>
                Digital tools, dashboards, and platforms operated by Falcus
                Media
              </li>
              <li>
                Services provided to clients, creators, advertisers, and
                partners
              </li>
              <li>
                Interactions through Meta platforms (Facebook, Instagram,
                WhatsApp, Messenger), where applicable
              </li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              This policy does not apply to third-party websites, services, or
              platforms that may be linked to or integrated with our Services.
              We encourage users to review the privacy policies of those third
              parties.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div id="section-2" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              We collect information to operate, improve, and secure our
              Services. The types of information we collect include:
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              2.1 Personal Information You Provide
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              You may voluntarily provide personal data when you:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Register an account</li>
              <li>Contact us</li>
              <li>Use our tools or dashboards</li>
              <li>Submit forms</li>
              <li>Request services</li>
              <li>Enter agreements or partnerships</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              This information may include:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business or brand information</li>
              <li>Social media account identifiers</li>
              <li>Payment or billing details (where applicable)</li>
              <li>Any information you choose to submit</li>
            </ul>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              When you access our Services, we may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>IP address</li>
              <li>Device type, operating system, and browser information</li>
              <li>Log files and usage data</li>
              <li>Pages viewed, features used, and interactions</li>
              <li>Time and date of access</li>
              <li>Referring URLs</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              This data helps us understand how users interact with our Services
              and improve functionality.
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              2.3 Data from Social Media and Third-Party Platforms
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              If you connect your account to third-party platforms such as
              Facebook, Instagram, WhatsApp, or Meta APIs, we may collect data
              permitted by those platforms and your privacy settings, including:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Page or account IDs</li>
              <li>Performance and analytics data</li>
              <li>Ad account data</li>
              <li>Messaging events (where authorized)</li>
              <li>Monetization insights (where permitted)</li>
            </ul>
            <p className="font-inter text-base text-[#111111] dark:text-white font-semibold">
              We only collect and process data that users or account owners have
              explicitly authorized.
            </p>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div id="section-3" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>To provide, operate, and maintain our Services</li>
              <li>To manage accounts, dashboards, and integrations</li>
              <li>To deliver advertising, media, and monetization services</li>
              <li>To analyze performance, analytics, and usage trends</li>
              <li>To communicate with users, clients, and partners</li>
              <li>To process transactions and payments (where applicable)</li>
              <li>To improve functionality, security, and user experience</li>
              <li>To comply with legal and regulatory obligations</li>
              <li>To prevent fraud, abuse, or unauthorized access</li>
            </ul>
            <p className="font-inter text-base text-[#111111] dark:text-white font-semibold">
              We do not sell personal data to third parties.
            </p>
          </div>

          {/* Section 4: Legal Basis */}
          <div id="section-4" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              4. Legal Basis for Processing (Where Applicable)
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Depending on jurisdiction, we process personal data based on:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              <li>User consent</li>
              <li>Contractual necessity</li>
              <li>Legitimate business interests</li>
              <li>Legal obligations</li>
              <li>Platform authorization (e.g., Meta permissions)</li>
            </ul>
          </div>

          {/* Section 5: Data Sharing */}
          <div id="section-5" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              We may share information only in the following circumstances:
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              5.1 Service Providers
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-2">
              We may share data with trusted third-party service providers who
              assist us in:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Hosting and infrastructure</li>
              <li>Analytics and reporting</li>
              <li>Payment processing</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              These providers are bound by confidentiality and data protection
              obligations.
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              5.2 Platform Integrations
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-6">
              When authorized, we share and receive data from platforms such as
              Meta (Facebook, Instagram, WhatsApp) strictly according to their
              policies and user permissions.
            </p>

            <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-3">
              5.3 Legal Requirements
            </h3>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              We may disclose information if required by law, court order,
              regulation, or governmental request, or to protect our legal
              rights and users' safety.
            </p>
          </div>

          {/* Section 6: Data Retention */}
          <div id="section-6" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              6. Data Retention
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              We retain personal data only for as long as necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Fulfill the purposes outlined in this Privacy Policy</li>
              <li>Meet legal, regulatory, and contractual requirements</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              When data is no longer required, it is securely deleted or
              anonymized.
            </p>
          </div>

          {/* Section 7: Data Security */}
          <div id="section-7" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              7. Data Security
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Falcus Media implements appropriate technical and organizational
              security measures to protect personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Secure servers and hosting environments</li>
              <li>Access controls and authentication</li>
              <li>Data encryption where applicable</li>
              <li>Regular monitoring and system updates</li>
            </ul>
            <div className="bg-[#FFF4E6] dark:bg-[#1E1E1E] border-l-4 border-orange-500 dark:border-orange-400 p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <Lock
                  size={20}
                  className="text-orange-500 dark:text-orange-400 flex-shrink-0 mt-1"
                />
                <p className="font-inter text-sm text-[#111111] dark:text-white">
                  While we strive to protect data, no system is completely
                  secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8: User Rights */}
          <div id="section-8" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              8. User Rights and Choices
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Withdraw consent</li>
              <li>Request data portability</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Requests can be made by contacting us using the details provided
              below.
            </p>
          </div>

          {/* Section 9: Cookies */}
          <div id="section-9" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              9. Cookies and Tracking Technologies
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
              <li>Improve website functionality</li>
              <li>Analyze traffic and usage</li>
              <li>Personalize user experience</li>
              <li>Maintain session security</li>
            </ul>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              You may control cookie preferences through your browser settings.
              Disabling cookies may affect certain features.
            </p>
          </div>

          {/* Section 10: Children's Privacy */}
          <div id="section-10" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              10. Children's Privacy
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Our Services are not intended for children under the age of 13 (or
              the minimum age required by law in your jurisdiction). We do not
              knowingly collect personal data from children. If we become aware
              of such data, we will take steps to delete it promptly.
            </p>
          </div>

          {/* Section 11: International Transfers */}
          <div id="section-11" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              11. International Data Transfers
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Your information may be processed or stored in countries outside
              your place of residence. Where applicable, we take steps to ensure
              adequate data protection safeguards are in place.
            </p>
          </div>

          {/* Section 12: Third-Party Links */}
          <div id="section-12" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              12. Third-Party Links and Services
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              Our Services may contain links to third-party websites or tools.
              We are not responsible for the privacy practices or content of
              those third parties.
            </p>
          </div>

          {/* Section 13: Changes */}
          <div id="section-13" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              13. Changes to This Privacy Policy
            </h2>
            <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed">
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a revised "Last Updated" date.
              Continued use of our Services after changes constitutes acceptance
              of the updated policy.
            </p>
          </div>

          {/* Section 14: Contact */}
          <div id="section-14" className="mb-12 scroll-mt-24">
            <h2 className="font-plus-jakarta-sans font-bold text-2xl text-[#111111] dark:text-white mb-4">
              14. Contact Information
            </h2>
            <div className="bg-[#F4F5FF] dark:bg-[#1E1E1E] rounded-lg p-6 border border-[#726BFF] dark:border-[#6366FF]">
              <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 leading-relaxed mb-4">
                If you have questions, requests, or concerns regarding this
                Privacy Policy or data practices, please contact us:
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

          {/* Privacy Commitment */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border-2 border-[#E5E7EB] dark:border-gray-700 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <Eye size={48} className="text-[#726BFF] dark:text-[#6366FF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white mb-3">
                  Your Privacy Matters to Us
                </h3>
                <p className="font-inter text-base text-[#525252] dark:text-white dark:text-opacity-70 mb-4">
                  We are committed to transparency and protecting your personal
                  information. If you have any questions about how we handle
                  your data, our team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-8 py-3 rounded-[20px] hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200"
                >
                  Contact Privacy Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FalcusFooter />
    </div>
  );
}
