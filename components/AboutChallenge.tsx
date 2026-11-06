import React from "react";
import {
  Sparkles,
  Trophy,
  Users,
  Presentation,
  Gamepad2,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export default function AboutChallenge() {
  const highlights = [
    {
      title: "Real Stage to Pitch Ideas",
      desc: "Kids gain invaluable confidence by standing up to share their app concepts, user stories, and interactive mockups before cheering audiences and judges.",
      icon: Presentation,
    },
    {
      title: "Cash Prizes & Celebrations",
      desc: "Every category awards substantial cash prizes (up to ₦25,000), certificates of participation, and special holiday recognition.",
      icon: Trophy,
    },
    {
      title: "Fun, Creative Holiday Environment",
      desc: "Beyond the challenge, kids enjoy playground sessions, a bouncy castle, holiday movies, digital games, and peer friendship.",
      icon: Gamepad2,
    },
    {
      title: "Mentorship & Guidance",
      desc: "Seasoned software engineers and educators at ThinkUp provide supportive feedback that inspires young innovators to keep building.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="challenge" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Comprehensive Challenge Description */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              The Programme
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              What is the Happy December Best Kids’ Apps Challenge?
            </h2>

            <p className="text-base sm:text-lg text-slate-600 mb-5 leading-relaxed">
              The <strong className="text-slate-900 font-semibold">Happy December – Best Kids’ Apps Challenge</strong> is ThinkUp Innovation Services’ marquee holiday innovation event designed to celebrate young creative talent.
            </p>

            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
              Rather than merely consuming technology, children from ages 2 to 19 are given the spotlight to imagine, design, and pitch their own mobile apps, web solutions, games, and digital stories. It creates a friendly, high-energy festival where technology meets festive holiday joy!
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong className="font-semibold text-slate-900">Who can participate:</strong> All children and teens aged 2 to 19. No advanced programming experience required — ideas, paper sketches, prototypes, and functioning apps are all warmly welcomed!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong className="font-semibold text-slate-900">Purpose:</strong> To build creative problem-solving skills, technological curiosity, and early public speaking confidence in our youth.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong className="font-semibold text-slate-900">Safe and engaging:</strong> Managed in a fully secure, air-conditioned innovation hub with dedicated facilitators and age-appropriate activity zones.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Highlight Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 hover:border-red-200 hover:bg-rose-50/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {h.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

