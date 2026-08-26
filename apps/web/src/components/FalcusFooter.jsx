import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function FalcusFooter() {
  return (
    <footer className="w-full py-16 md:py-20 px-6 bg-[#02042E] dark:bg-[#0A0A0A]">
      <div className="max-w-[1240px] mx-auto">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1 - Brand Details */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/cbcb9867-212c-4227-ae74-97d9067b6bad/-/format/auto/"
                alt="Falcus Media"
                className="h-6 w-auto"
              />
            </div>

            {/* Company description */}
            <div className="space-y-2 font-inter text-sm text-white/70">
              <div>Growth-focused digital marketing</div>
              <div>and social media agency</div>
              <a
                href="mailto:info@falcusmedia.com"
                className="hover:text-white hover:underline transition-all duration-200 inline-block mt-2 text-white/70"
              >
                info@falcusmedia.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              {[
                {
                  icon: Facebook,
                  label: "Visit us on Facebook",
                  href: "https://web.facebook.com/p/Falcus-Media-Ltd-100080158770131/",
                },
                { icon: Instagram, label: "Visit us on Instagram", href: "#" },
                { icon: Twitter, label: "Visit us on Twitter", href: "#" },
                { icon: Youtube, label: "Visit us on YouTube", href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C1C8FF] dark:focus:ring-[#6366FF] bg-[#02042E] dark:bg-[#1E1E1E] border border-[#22305F] dark:border-gray-700 text-white/80 hover:bg-[#22305F] dark:hover:bg-[#262626] hover:text-white"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Services */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-sm text-white">
              Services
            </h3>
            <div className="space-y-3">
              {[
                "Social Media Management",
                "Paid Ads",
                "Content Strategy",
                "WhatsApp Automation",
                "Influencer Marketing",
              ].map((link, index) => (
                <a
                  key={index}
                  href="/services"
                  className="block font-inter text-sm transition-all duration-200 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#C1C8FF] dark:focus:ring-[#6366FF] rounded text-white/70"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 - Company */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-sm text-white">
              Company
            </h3>
            <div className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Case Studies", href: "/case-studies" },
                { label: "Contact", href: "/contact" },
                { label: "Client Portal", href: "/portal/login" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block font-inter text-sm transition-all duration-200 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#C1C8FF] dark:focus:ring-[#6366FF] rounded text-white/70"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 - Legal */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-sm text-white">
              Legal
            </h3>
            <div className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block font-inter text-sm transition-all duration-200 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#C1C8FF] dark:focus:ring-[#6366FF] rounded text-white/70"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="pt-8 text-center border-t border-[#22305F] dark:border-gray-800">
          <p className="font-inter text-xs text-white/50">
            © 2025 Falcus Media Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
