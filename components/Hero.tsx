"use client";

import React from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Megaphone,
  CheckCircle2,
  Trophy,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-white"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-red-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm">
                <Megaphone className="w-3.5 h-3.5 animate-bounce" />
                Limited Slots, Register Now!
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-red-800 border border-rose-200/80">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                Kids&apos; Apps... Happy Kids.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-3">
              Happy <span className="text-red-600 underline decoration-rose-400 decoration-wavy decoration-2">December!</span>
              <span className="block text-2xl sm:text-4xl lg:text-4xl font-extrabold text-slate-800 mt-2 bg-gradient-to-r from-slate-900 via-red-900 to-rose-700 bg-clip-text text-transparent">
                Best Kids&apos; Apps Challenge
              </span>
            </h1>

            {/* Intro paragraph */}
            <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed max-w-2xl font-normal">
              Kids pitch their app ideas and compete for cash prizes, tech recognition, and loads of fun in a creative, inspiring, and exciting holiday atmosphere!
            </p>

            {/* Key Event Badges Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8 p-3 bg-white/90 border border-rose-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                <div className="p-2 rounded-lg bg-red-100/80 text-red-600 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Sat, Dec 12, 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                <div className="p-2 rounded-lg bg-red-100/80 text-red-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Time</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">10:00 AM – 5:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                <div className="p-2 rounded-lg bg-red-100/80 text-red-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Venue</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate">Old Bodija, Ibadan</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-red-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register & Pay to Enter</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#challenge"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base px-6 py-3.5 rounded-full border border-slate-200 transition-colors shadow-sm"
              >
                <span>Learn More</span>
              </a>
            </div>

            {/* Trust bullet points */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ages 2 to 19 welcome
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Trophy className="w-4 h-4 text-amber-500" />
                Cash prizes for all categories
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Games, Bouncing Castle & Movies
              </span>
            </div>
          </div>

          {/* Right Column: High Fidelity Flyer Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Backing Red/Pink Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-2xl">
                <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full">
                  <Image
                    src="/images/flyer.jpg"
                    alt="ThinkUp Innovation Services - Happy December Best Kids Apps Challenge Flyer"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                </div>

                {/* Bottom Overlay Card Strip */}
                <div className="p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                      ThinkUp Innovation Hub
                    </p>
                    <p className="text-sm font-bold text-slate-100">
                      Purpose Mall, Old Bodija, Ibadan
                    </p>
                  </div>

                  <a
                    href="#register"
                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-lg transition-colors shrink-0"
                  >
                    Claim Slot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

