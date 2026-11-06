import React from "react";
import { BookOpen, Lightbulb, Rocket, TrendingUp, Sparkles, Check } from "lucide-react";

export default function AboutThinkUp() {
  const principles = [
    {
      title: "LEARN",
      icon: BookOpen,
      desc: "Nurturing fundamental digital literacy, computational reasoning, and hands-on discovery from the earliest formative years.",
      color: "from-blue-500 to-indigo-600",
      bgSoft: "bg-blue-50",
      border: "border-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "THINK",
      icon: Lightbulb,
      desc: "Cultivating critical thinking, creative ideation, problem framing, and curiosity so kids see challenges as opportunities to build solutions.",
      color: "from-amber-500 to-orange-600",
      bgSoft: "bg-amber-50",
      border: "border-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "INNOVATE",
      icon: Rocket,
      desc: "Empowering children and teens to design, prototype, and build practical software applications, digital games, and creative tools.",
      color: "from-rose-500 to-red-600",
      bgSoft: "bg-rose-50",
      border: "border-rose-100",
      textColor: "text-red-600",
    },
    {
      title: "SCALE",
      icon: TrendingUp,
      desc: "Providing mentorship, tech launchpads, and presentation platforms to take young creators' ideas from playground experiments to real impact.",
      color: "from-emerald-500 to-teal-600",
      bgSoft: "bg-emerald-50",
      border: "border-emerald-100",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/70 border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200/60 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ThinkUp Innovation Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We are dedicated to <strong className="text-slate-800 font-semibold">empowering innovative minds</strong> across Africa by mentoring future engineers, designers, and tech leaders from childhood through adolescence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bgSoft} ${item.textColor} flex items-center justify-center mb-5 border ${item.border}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-wide mb-2 flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-xs font-mono font-semibold text-slate-400">Pillar</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>ThinkUp Core Principle</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hub highlight note */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Based at the ThinkUp Innovation Hub in Ibadan
            </h4>
            <p className="text-sm text-slate-600">
              Our state-of-the-art innovation centre in Old Bodija offers immersive tech training, interactive workspaces, coding bootcamps, and high-energy pitch events for children of all ages.
            </p>
          </div>
          <a
            href="#details"
            className="shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            <span>Visit the Hub</span>
          </a>
        </div>
      </div>
    </section>
  );
}

