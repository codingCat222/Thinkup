import React from "react";
import Logo from "./Logo";
import { Phone, MessageCircle, MapPin, Instagram, Video, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info & Motto */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light={true} withPillars={false} />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              ThinkUp Innovation Services empowers the next generation of creative minds through high-impact technology education, app design, robotics, and creative problem solving.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/thinkupinnovationhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-rose-600 flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@thinkupinnovationhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-red-600 flex items-center justify-center transition-all"
                title="TikTok"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2348067557709"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-emerald-600 flex items-center justify-center transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About ThinkUp
                </a>
              </li>
              <li>
                <a href="#challenge" className="hover:text-white transition-colors">
                  The Challenge
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Age Categories & Prizes
                </a>
              </li>
              <li>
                <a href="#details" className="hover:text-white transition-colors">
                  Event Details & Venue
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Categories & Prizes */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Age Divisions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-300 font-medium">Ages 2–5:</span> ₦10,000 (Playground)
              </li>
              <li>
                <span className="text-slate-300 font-medium">Ages 6–8:</span> ₦15,000 (Movies & Games)
              </li>
              <li>
                <span className="text-slate-300 font-medium">Ages 9–12:</span> ₦20,000 (Junior)
              </li>
              <li>
                <span className="text-slate-300 font-medium">Ages 13–19:</span> ₦25,000 (Senior)
              </li>
              <li className="pt-2">
                <a
                  href="#register"
                  className="text-red-400 hover:text-red-300 font-bold underline underline-offset-4"
                >
                  Register Now &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Hub Location & Contacts */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Event Hub
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  2nd Floor, Purpose Mall, 23 Awolowo Avenue, Old Bodija, Ibadan.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0806 755 7709</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0706 520 2865</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} ThinkUp Innovation Services. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#register" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#register" className="hover:text-slate-400 transition-colors">
              Event Terms
            </a>
            <a href="/admin/login" className="hover:text-rose-400 transition-colors">
              Organiser Portal
            </a>
            <a
              href="#hero"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

