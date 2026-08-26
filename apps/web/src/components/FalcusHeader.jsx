"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function FalcusHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <img
              src="https://ucarecdn.com/cbcb9867-212c-4227-ae74-97d9067b6bad/-/format/auto/"
              alt="Falcus Media"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="/about"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              About
            </a>
            <a
              href="/services"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              Services
            </a>
            <a
              href="/blog"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              Blog
            </a>
            <a
              href="/case-studies"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              Case Studies
            </a>
            <a
              href="/contact"
              className="font-inter text-sm text-white text-opacity-70 hover:text-[#6366FF] transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/portal/login"
              className="font-inter text-sm text-[#6366FF] hover:underline transition-all duration-200"
            >
              Client Login
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-[20px] font-inter font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6366FF] focus:ring-opacity-30 bg-[#6366FF] text-white hover:bg-[#5856FF]"
            >
              Book Free Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a
                href="/"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/about"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/services"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="/blog"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </a>
              <a
                href="/case-studies"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Studies
              </a>
              <a
                href="/contact"
                className="font-inter text-sm text-white text-opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a
                href="/portal/login"
                className="font-inter text-sm text-[#6366FF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Client Login
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
