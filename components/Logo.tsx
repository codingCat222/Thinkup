import React from "react";
import { BookOpen, Lightbulb, Rocket, TrendingUp } from "lucide-react";

interface LogoProps {
  className?: string;
  withPillars?: boolean;
  light?: boolean;
}

export default function Logo({ className = "", withPillars = false, light = false }: LogoProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 ${className}`}>
      {/* Brand Name Mark */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight font-extrabold text-2xl sm:text-3xl">
          <span className={light ? "text-white" : "text-slate-900"}>Think</span>
          <span className="text-red-600 font-black">UP</span>
          <span className="text-[10px] align-super ml-0.5 text-slate-400 font-bold">®</span>
        </div>
        <div className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-slate-500">
          INNOVATION SERVICES
        </div>
        <div className="text-[9px] italic text-slate-400 font-medium">
          Empowering Innovative Minds
        </div>
      </div>

      {/* 4 Core Pillars: Learn, Think, Innovate, Scale */}
      {withPillars && (
        <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-bold text-slate-600 uppercase mt-0.5 tracking-wider">Learn</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-bold text-slate-600 uppercase mt-0.5 tracking-wider">Think</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-bold text-slate-600 uppercase mt-0.5 tracking-wider">Innovate</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-bold text-slate-600 uppercase mt-0.5 tracking-wider">Scale</span>
          </div>
        </div>
      )}
    </div>
  );
}

