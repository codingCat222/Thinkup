import React from "react";
import { UserCheck, Lightbulb, PartyPopper, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Register & Pay Online",
      desc: "Complete the online participant form and secure your child's entry fee via safe checkout to receive an instant verified ticket code.",
      icon: UserCheck,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      step: "02",
      title: "Prepare Your App Idea",
      desc: "Help your child sketch their idea on paper, create digital slides, build a prototype, or prepare a 2-minute spoken presentation.",
      icon: Lightbulb,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      step: "03",
      title: "Attend & Participate",
      desc: "Join us at the ThinkUp Innovation Hub on Saturday, Dec 12, 2026. Pitch, play games, win prizes, and enjoy the holiday celebration!",
      icon: PartyPopper,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Joining the Happy December challenge is easy, supportive, and open to all children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-slate-200 font-mono">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Step {index + 1} of 3</span>
                  {index < 2 && (
                    <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

