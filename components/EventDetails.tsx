import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Navigation,
  Building,
  CheckCircle,
} from "lucide-react";

export default function EventDetails() {
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Purpose+Mall+23+Awolowo+Avenue+Old+Bodija+Ibadan";

  return (
    <section id="details" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff4d4f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-widest bg-rose-950/80 px-3.5 py-1 rounded-full border border-rose-800">
            Event Guide & Logistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Event Details & Venue
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Everything you need to know about the location, schedule, and facilities for the challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Cards: Time, Date, Address */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Saturday, Dec 12, 2026
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Full day holiday hack & pitch festival
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time</span>
                <h3 className="text-xl font-bold text-white mt-1">
                  10:00 AM – 5:00 PM
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Registration check-in starts at 9:30 AM
                </p>
              </div>
            </div>

            {/* Venue & Full Address Box */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Official Venue
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    ThinkUp Innovation Hub
                  </h3>
                  <div className="mt-3 text-slate-300 text-sm leading-relaxed space-y-1">
                    <p className="font-semibold text-white">
                      2nd Floor, Purpose Mall, 23 Awolowo Avenue
                    </p>
                    <p className="text-slate-400">
                      Opposite GTCO / Cloud 7, Old Bodija, Ibadan, Oyo State, Nigeria.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Secure parking available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Preview / Card */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-sm text-white">Interactive Location Map</span>
                </div>
                <span className="text-xs text-slate-400">Old Bodija, Ibadan</span>
              </div>

              {/* Embedded Google Maps iframe */}
              <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-700">
                <iframe
                  title="ThinkUp Innovation Hub Location Map"
                  src="https://maps.google.com/maps?q=Purpose+Mall,+23+Awolowo+Avenue,+Old+Bodija,+Ibadan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span>Landmark: Opposite GTCO Bank / Cloud 7 Lounge</span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                Get driving directions &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

