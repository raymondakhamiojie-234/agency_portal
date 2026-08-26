"use client";

import { useState } from "react";
import FalcusHeader from "@/components/FalcusHeader";
import FalcusFooter from "@/components/FalcusFooter";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Target,
  Zap,
  Award,
  Lock,
  RefreshCw,
  BarChart3,
  Video,
  MessageCircle,
  Search,
  Filter,
} from "lucide-react";

const CASE_STUDIES = [
  {
    id: 1,
    title: "Account Restoration After Permanent Suspension",
    category: "Account Recovery",
    challenge:
      "An influencer's Facebook page was permanently suspended after a user report, losing all monetization privileges.",
    solution:
      "Escalated via Meta's agency portal, audited violations, and submitted a detailed appeal highlighting enforcement errors.",
    result: "Page fully restored, violations cleared, monetization reinstated.",
    metrics: { restoration: "100%", timeline: "14 days", revenue: "Full" },
    icon: RefreshCw,
  },
  {
    id: 2,
    title: "Demonetization & Payout Restriction Recovery",
    category: "Monetization",
    challenge:
      "Page demonetized due to connected entity issues, permanently restricting payouts.",
    solution:
      "Used Meta Agency Management Tool to execute revenue linking and compliance handshake.",
    result: "Monetization restored and revenue secured.",
    metrics: { restored: "₦2.5M", timeline: "21 days", success: "100%" },
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Viral Reach Expansion",
    category: "Growth",
    challenge: "Growth plateau at 50,000 followers with low engagement.",
    solution:
      "Audience analysis and cross-promotion with high-engagement pages.",
    result: "1,000,000 reach achieved; follower growth increased by 35%.",
    metrics: { reach: "+950K", followers: "+35%", engagement: "+120%" },
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Content Violation Clearance",
    category: "Compliance",
    challenge: "Multiple content strikes limiting monetization.",
    solution: "Compliance audit and appeals via Meta support portal.",
    result: "All violations cleared and monetization restored.",
    metrics: { strikes: "5 cleared", timeline: "10 days", status: "Clean" },
    icon: Shield,
  },
  {
    id: 5,
    title: "Brand Partnership Recovery",
    category: "Business",
    challenge: "Content restriction delayed major Nigerian brand deal.",
    solution: "Escalated issue to Meta with compliance evidence.",
    result: "Restrictions lifted within 72 hours.",
    metrics: { timeline: "72 hours", deal: "₦5M", impact: "Secured" },
    icon: Award,
  },
  {
    id: 6,
    title: "Monetization Policy Upgrade",
    category: "Monetization",
    challenge: "YouTube channel denied ad revenue approval.",
    solution: "Optimized metadata, descriptions, and engagement strategy.",
    result: "Monetization approved; revenue grew 300% in one quarter.",
    metrics: { revenue: "+300%", timeline: "90 days", approval: "Granted" },
    icon: DollarSign,
  },
  {
    id: 7,
    title: "Viral Campaign Activation",
    category: "Growth",
    challenge: "New content series lacked traction.",
    solution: "Content seeding with micro-influencers and niche communities.",
    result: "Engagement rose 500%; follower base grew 40%.",
    metrics: { engagement: "+500%", followers: "+40%", reach: "2M+" },
    icon: Zap,
  },
  {
    id: 8,
    title: "Hacked Account Restoration",
    category: "Security",
    challenge: "Account hacked and content deleted.",
    solution: "Worked with Meta Security Team to recover and secure account.",
    result: "Content restored; 80% of followers recovered.",
    metrics: { recovery: "80%", security: "Enhanced", timeline: "7 days" },
    icon: Lock,
  },
  {
    id: 9,
    title: "Community Engagement Boost",
    category: "Engagement",
    challenge: "Low interaction despite views.",
    solution: "Polls, live Q&As, and reward-based engagement.",
    result: "Engagement increased 250%.",
    metrics: { engagement: "+250%", comments: "+400%", shares: "+180%" },
    icon: MessageCircle,
  },
  {
    id: 10,
    title: "Video Optimization for Monetization",
    category: "Monetization",
    challenge: "Videos failed monetization thresholds.",
    solution: "Improved retention, thumbnails, and storytelling hooks.",
    result: "Monetization achieved within one month.",
    metrics: { retention: "+65%", ctr: "+85%", revenue: "Enabled" },
    icon: Video,
  },
  {
    id: 11,
    title: "Instagram Verification Success",
    category: "Growth",
    challenge: "Creator struggled to obtain Instagram verification badge.",
    solution:
      "Built authentic media presence, documented notable achievements, and submitted comprehensive verification application.",
    result: "Blue verification badge obtained, credibility increased.",
    metrics: { verification: "Granted", followers: "+25%", deals: "+3" },
    icon: CheckCircle,
  },
  {
    id: 12,
    title: "Copyright Strike Resolution",
    category: "Compliance",
    challenge: "Three copyright strikes threatened channel deletion.",
    solution:
      "Negotiated with rights holders, submitted counter-notices, and implemented content screening system.",
    result: "All strikes removed, channel protected.",
    metrics: { strikes: "3 removed", timeline: "28 days", status: "Clear" },
    icon: Shield,
  },
  {
    id: 13,
    title: "Multi-Platform Revenue Diversification",
    category: "Monetization",
    challenge: "Over-reliance on single platform for income.",
    solution:
      "Developed cross-platform content strategy across Facebook, YouTube, and Instagram.",
    result: "Revenue streams diversified, total income increased 180%.",
    metrics: { platforms: "3", revenue: "+180%", stability: "High" },
    icon: BarChart3,
  },
  {
    id: 14,
    title: "Audience Demographics Optimization",
    category: "Growth",
    challenge: "Mismatch between content and audience interests.",
    solution:
      "Conducted deep audience analysis and realigned content strategy to match viewer preferences.",
    result: "Watch time increased 220%, subscriber retention improved 45%.",
    metrics: { watchtime: "+220%", retention: "+45%", subs: "+18K" },
    icon: Users,
  },
  {
    id: 15,
    title: "Ad Revenue Optimization",
    category: "Monetization",
    challenge: "Low RPM (Revenue Per Mille) despite high views.",
    solution:
      "Optimized video length, ad placement timing, and viewer retention strategies.",
    result: "RPM increased from ₦450 to ₦1,850.",
    metrics: { rpm: "+311%", revenue: "+₦680K", cpm: "+245%" },
    icon: DollarSign,
  },
  {
    id: 16,
    title: "Content Strategy Pivot for Virality",
    category: "Growth",
    challenge: "Stagnant growth with traditional content format.",
    solution:
      "Analyzed trending formats, implemented short-form vertical video strategy aligned with Nigerian audience preferences.",
    result:
      "Viral breakthrough with 15M views in one month, 85K new followers.",
    metrics: { views: "15M", followers: "+85K", engagement: "+420%" },
    icon: Target,
  },
  {
    id: 17,
    title: "Monetization Eligibility Acceleration",
    category: "Monetization",
    challenge:
      "New creator struggling to meet 1,000 subscribers and 4,000 watch hours.",
    solution:
      "Implemented targeted content series, community building tactics, and strategic collaborations.",
    result:
      "Monetization requirements met in 4 months (industry average: 12-18 months).",
    metrics: { subs: "1,245", hours: "5,200", timeline: "4 months" },
    icon: Zap,
  },
  {
    id: 18,
    title: "Brand Safety Audit & Compliance",
    category: "Compliance",
    challenge:
      "Content flagged as unsuitable for advertisers, limiting revenue.",
    solution:
      "Comprehensive content audit, removal of problematic elements, and adherence to advertiser-friendly guidelines.",
    result: "100% of content deemed brand-safe, full monetization restored.",
    metrics: { compliance: "100%", revenue: "Restored", rating: "Green" },
    icon: Shield,
  },
  {
    id: 19,
    title: "Influencer Partnership Network Expansion",
    category: "Business",
    challenge:
      "Limited brand partnership opportunities despite strong following.",
    solution:
      "Built media kit, connected with Nigerian brands, and positioned creator for sponsored content deals.",
    result: "Secured 12 brand partnerships worth ₦8.4M in 6 months.",
    metrics: { deals: "12", value: "₦8.4M", retention: "9 renewed" },
    icon: Award,
  },
  {
    id: 20,
    title: "Community Guidelines Strike Appeal",
    category: "Compliance",
    challenge:
      "Unjust community guidelines strike threatening account standing.",
    solution:
      "Documented evidence of compliance, submitted detailed appeal with context and policy references.",
    result: "Strike overturned, account standing restored to good.",
    metrics: { appeal: "Approved", timeline: "12 days", status: "Good" },
    icon: CheckCircle,
  },
  {
    id: 21,
    title: "Algorithm Optimization for Discoverability",
    category: "Growth",
    challenge:
      "Quality content not reaching new audiences due to algorithm suppression.",
    solution:
      "Optimized posting times, hashtag strategy, thumbnail design, and initial engagement velocity.",
    result: "Impressions increased 340%, reach expanded to 2.8M monthly.",
    metrics: { impressions: "+340%", reach: "2.8M", discovery: "+285%" },
    icon: Search,
  },
  {
    id: 22,
    title: "Revenue Recovery After Policy Change",
    category: "Monetization",
    challenge: "Platform policy update caused sudden revenue drop of 70%.",
    solution:
      "Rapid content format adaptation, compliance alignment, and monetization strategy adjustment.",
    result: "Revenue recovered to 95% of pre-change levels within 6 weeks.",
    metrics: { recovery: "95%", timeline: "6 weeks", adaptation: "Complete" },
    icon: RefreshCw,
  },
  {
    id: 23,
    title: "Crisis Management: Reputation Recovery",
    category: "Business",
    challenge:
      "Viral controversy threatened creator's brand partnerships and follower trust.",
    solution:
      "Strategic communication plan, transparent response, and community engagement to rebuild trust.",
    result:
      "Retained 92% of followers, secured new brand deals within 3 months.",
    metrics: { retention: "92%", deals: "5 new", sentiment: "Positive" },
    icon: AlertCircle,
  },
  {
    id: 24,
    title: "Cross-Platform Audience Migration",
    category: "Growth",
    challenge:
      "Platform dependency risk with 90% of audience on single platform.",
    solution:
      "Strategic cross-promotion campaign to build presence on secondary platforms.",
    result:
      "Successfully established 45K Instagram following and 28K YouTube subscribers.",
    metrics: { instagram: "45K", youtube: "28K", diversity: "Achieved" },
    icon: Users,
  },
  {
    id: 25,
    title: "Long-Form Content Monetization Strategy",
    category: "Monetization",
    challenge: "Short-form content limiting revenue potential.",
    solution:
      "Developed complementary long-form content strategy with in-depth storytelling and higher ad placement opportunities.",
    result: "Average revenue per video increased from ₦8,500 to ₦34,200.",
    metrics: { revenue: "+302%", watch: "+180%", rpm: "+245%" },
    icon: Video,
  },
];

const CATEGORIES = [
  "All",
  "Account Recovery",
  "Monetization",
  "Growth",
  "Compliance",
  "Business",
  "Security",
  "Engagement",
];

export default function CaseStudiesPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCases = CASE_STUDIES.filter((study) => {
    const matchesCategory =
      selectedCategory === "All" || study.category === selectedCategory;
    const matchesSearch =
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.challenge.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <FalcusHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full mb-6">
              <Award size={16} className="mr-2 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">
                Proven Track Record
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Falcus Media Ltd – Influencer Agency Case Studies
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Empowering Nigerian Influencers Through Expert Social Media
              Management
            </p>

            <div className="max-w-5xl mx-auto text-left bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed mb-4">
                Falcus Media Ltd has{" "}
                <span className="text-purple-400 font-semibold">
                  over 5 years of experience
                </span>{" "}
                supporting Nigerian content creators across Facebook, YouTube,
                and Instagram. Our expertise spans policy compliance, account
                recovery, revenue restoration, audience growth, and influencer
                monetization strategies.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We have achieved a{" "}
                <span className="text-green-400 font-semibold">
                  95% success rate
                </span>{" "}
                in resolving account issues, restored{" "}
                <span className="text-green-400 font-semibold">
                  millions of Naira
                </span>{" "}
                in lost revenue, and helped creators reach new milestones in
                reach, engagement, and earnings.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This portfolio presents real-world examples of complex
                influencer challenges solved by Falcus Media Ltd.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">5+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-sm text-gray-400">Case Studies</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">₦M+</div>
              <div className="text-sm text-gray-400">Revenue Restored</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <Filter size={20} className="text-gray-400 flex-shrink-0" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-400">
            Showing{" "}
            <span className="text-purple-400 font-semibold">
              {filteredCases.length}
            </span>{" "}
            case {filteredCases.length === 1 ? "study" : "studies"}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredCases.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle size={60} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No case studies found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((study) => {
                const Icon = study.icon;
                const isExpanded = expandedId === study.id;

                return (
                  <div
                    key={study.id}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-purple-600/50 transition-all duration-300"
                  >
                    {/* Card Header - Always Visible */}
                    <button
                      onClick={() => toggleExpand(study.id)}
                      className="w-full p-6 text-left hover:bg-gray-700/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Icon size={24} className="text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-bold">
                                Case #{study.id}
                              </span>
                              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-semibold">
                                {study.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {study.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {study.challenge}
                            </p>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp size={24} className="text-purple-400" />
                          ) : (
                            <ChevronDown size={24} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-700/50 pt-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Challenge */}
                          <div className="bg-red-900/10 border border-red-700/30 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle size={18} className="text-red-400" />
                              <h4 className="font-bold text-red-300 uppercase text-sm">
                                Challenge
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {study.challenge}
                            </p>
                          </div>

                          {/* Solution */}
                          <div className="bg-blue-900/10 border border-blue-700/30 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Target size={18} className="text-blue-400" />
                              <h4 className="font-bold text-blue-300 uppercase text-sm">
                                Solution
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {study.solution}
                            </p>
                          </div>

                          {/* Result */}
                          <div className="bg-green-900/10 border border-green-700/30 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle
                                size={18}
                                className="text-green-400"
                              />
                              <h4 className="font-bold text-green-300 uppercase text-sm">
                                Result
                              </h4>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                              {study.result}
                            </p>

                            {/* Metrics */}
                            <div className="space-y-2">
                              {Object.entries(study.metrics).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-gray-400 capitalize">
                                      {key}:
                                    </span>
                                    <span className="text-green-400 font-bold">
                                      {value}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of Nigerian influencers who have resolved account
            issues, restored revenue, and achieved sustainable growth with
            Falcus Media Ltd.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/portal/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-600/50"
            >
              Get Started Today
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>

      {/* SEO Footer Section */}
      <section className="py-12 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Our Expertise
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Influencer Management Nigeria</li>
                <li>• Social Media Account Recovery</li>
                <li>• Monetization & Content Compliance</li>
                <li>• Creator Revenue Optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Platforms We Support
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Facebook Creator Studio</li>
                <li>• YouTube Partner Program</li>
                <li>• Instagram Business Tools</li>
                <li>• Meta Agency Portal</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Account Recovery & Restoration</li>
                <li>• Policy Compliance Audits</li>
                <li>• Growth Strategy Development</li>
                <li>• Revenue Restoration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FalcusFooter />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
