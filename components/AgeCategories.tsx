"use client";

import React from "react";
import {
  Sparkles,
  Gamepad2,
  Tv,
  Code2,
  Laptop,
  Trophy,
  ArrowRight,
  Baby,
} from "lucide-react";

export interface CategoryData {
  range: string;
  title: string;
  subtitle: string;
  prize: string;
  colorScheme: {
    badge: string;
    cardBorder: string;
    gradient: string;
    prizeBg: string;
    accentText: string;
    iconBg: string;
  };
  features: string[];
  icon: any;
}

export const CATEGORIES: CategoryData[] = [
  {
    range: "AGES 2 – 5",
    title: "Playground & Bouncing Castle",
    subtitle: "Early Learners & Tiny Innovators",
    prize: "₦10,000",
    colorScheme: {
      badge: "bg-amber-500 text-white",
      cardBorder: "border-amber-200 hover:border-amber-400",
      gradient: "from-amber-500/10 via-orange-500/5 to-white",
      prizeBg: "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600",
      accentText: "text-amber-700",
      iconBg: "bg-amber-500 text-white",
    },
    features: [
      "Access to safe Bouncing Castle",
      "Interactive Playground games",
      "Drawing, storytelling & creative apps",
      "₦10,000 Category Cash Prize",
    ],
    icon: Baby,
  },
  {
    range: "AGES 6 – 8",
    title: "Movies and Games",
    subtitle: "Creative Explorers",
    prize: "₦15,000",
    colorScheme: {
      badge: "bg-sky-500 text-white",
      cardBorder: "border-sky-200 hover:border-sky-400",
      gradient: "from-sky-500/10 via-blue-500/5 to-white",
      prizeBg: "bg-gradient-to-r from-red-600 via-rose-600 to-sky-600",
      accentText: "text-sky-700",
      iconBg: "bg-sky-500 text-white",
    },
    features: [
      "Exciting animated movie screenings",
      "Educational digital video games",
      "Basic app concepts & game pitch",
      "₦15,000 Category Cash Prize",
    ],
    icon: Tv,
  },
  {
    range: "AGES 9 – 12",
    title: "Junior Category",
    subtitle: "Young Coders & Problem Solvers",
    prize: "₦20,000",
    colorScheme: {
      badge: "bg-emerald-600 text-white",
      cardBorder: "border-emerald-200 hover:border-emerald-400",
      gradient: "from-emerald-500/10 via-teal-500/5 to-white",
      prizeBg: "bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600",
      accentText: "text-emerald-700",
      iconBg: "bg-emerald-600 text-white",
    },
    features: [
      "App ideas solving community challenges",
      "Visual coding / Scratch / Mobile concepts",
      "Stage pitch to judges and peers",
      "₦20,000 Category Cash Prize",
    ],
    icon: Code2,
  },
  {
    range: "AGES 13 – 19",
    title: "Senior Category",
    subtitle: "Teen Technologists & App Builders",
    prize: "₦25,000",
    colorScheme: {
      badge: "bg-purple-600 text-white",
      cardBorder: "border-purple-200 hover:border-purple-400",
      gradient: "from-purple-500/10 via-violet-500/5 to-white",
      prizeBg: "bg-gradient-to-r from-red-600 via-rose-600 to-purple-600",
      accentText: "text-purple-700",
      iconBg: "bg-purple-600 text-white",
    },
    features: [
      "Full app prototypes, UI/UX designs or code",
      "Business viability & scaling pitch",
      "Mentorship & networking at the Hub",
      "₦25,000 Category Cash Prize",
    ],
    icon: Laptop,
  },
];

export default function AgeCategories() {
  const handleSelectCategory = (rangeText: string) => {
    const categorySelect = document.getElementById("ageCategory") as HTMLSelectElement | null;
    if (categorySelect) {
      // Find matching option
      for (let i = 0; i < categorySelect.options.length; i++) {
        if (categorySelect.options[i].text.includes(rangeText)) {
          categorySelect.selectedIndex = i;
          categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
          break;
        }
      }
    }
    const formElement = document.getElementById("register");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="py-20 bg-slate-50/60 border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200 uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" />
            Categories & Prizes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored For Every Stage of Growth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether your child is taking their very first steps in creative play or coding high-tech apps, there is a dedicated category and cash prize for them.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className={`relative bg-gradient-to-b ${cat.colorScheme.gradient} rounded-3xl p-6 border ${cat.colorScheme.cardBorder} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${cat.colorScheme.badge}`}
                    >
                      {cat.range}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.colorScheme.iconBg} shadow-sm`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-5">
                    {cat.subtitle}
                  </p>

                  {/* Prize Ribbon Tag */}
                  <div className="mb-6 p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm text-center">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                      Cash Prize
                    </span>
                    <span className="text-2xl font-black text-red-600 tracking-tight">
                      {cat.prize}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {cat.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA to auto-select this category */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory(cat.range)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm group-hover:bg-red-600"
                >
                  <span>Select & Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

