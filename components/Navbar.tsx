"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Menu, X, ArrowRight, Sparkles, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "The Challenge", href: "#challenge" },
    { name: "Age Categories", href: "#categories" },
    { name: "Event Details", href: "#details" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100/60 py-3"
          : "bg-white/80 backdrop-blur-sm py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with 4 Pillars */}
          <a href="#hero" className="flex items-center group">
            <Logo withPillars={true} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/2348067557709?text=Hello%20ThinkUp,%20I%20would%20like%20to%20inquire%20about%20the%20Happy%20December%20Kids%20Apps%20Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Register & Pay</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-red-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 shadow-xl px-5 pt-3 pb-6 animate-in slide-in-from-top-3">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-800 hover:text-red-600 py-2 border-b border-slate-50 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register & Pay Online</span>
              </a>

              <a
                href="https://wa.me/2348067557709"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp (0806 755 7709)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

