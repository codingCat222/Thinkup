import React from "react";
import { Phone, MessageCircle, MapPin, Instagram, Video, ExternalLink, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3.5 py-1 rounded-full border border-red-200">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Contact ThinkUp Innovation Services
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Have questions about the event, registration, or your child&apos;s app idea? We are here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Phone Line 1 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Phone & Inquiries
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                0806 755 7709
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                General inquiries and event registration help.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2">
              <a
                href="tel:08067557709"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Call Line 1
              </a>
              <a
                href="https://wa.me/2348067557709"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                title="WhatsApp 08067557709"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Phone Line 2 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Support Line
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                0706 520 2865
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Technical coordination and event logistics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2">
              <a
                href="tel:07065202865"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Call Line 2
              </a>
              <a
                href="https://wa.me/2347065202865"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                title="WhatsApp 07065202865"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 3: Social Channels */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Social Media
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                @thinkupinnovationhub
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow updates, event videos & announcements.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2">
              <a
                href="https://instagram.com/thinkupinnovationhub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@thinkupinnovationhub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                title="TikTok @thinkupinnovationhub"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 4: Venue Physical Hub */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Visit Us
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                Purpose Mall, Old Bodija
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                2nd Floor, 23 Awolowo Ave, Ibadan.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Purpose+Mall+23+Awolowo+Avenue+Old+Bodija+Ibadan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                <span>Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

