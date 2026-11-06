"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is the Happy December Best Kids’ Apps Challenge?",
      answer:
        "The Happy December Best Kids’ Apps Challenge is an exciting holiday technology and creativity event organised by ThinkUp Innovation Services. Children pitch their mobile apps, web tools, educational games, or concept ideas, compete for cash prizes, and celebrate the festive season with fun activities including a bouncing castle, movies, and games.",
    },
    {
      question: "Who can participate?",
      answer:
        "All children and teenagers aged 2 to 19 years old are eligible! There are four tailored age divisions: Ages 2–5 (Playground & Bouncing Castle), Ages 6–8 (Movies & Games), Ages 9–12 (Junior Category), and Ages 13–19 (Senior Category).",
    },
    {
      question: "How do I register my child?",
      answer:
        "Simply fill out the online registration form on this website with the parent/guardian details, child's age and school, and a short summary of their app idea. Once submitted, an instant confirmation reference code is generated and stored in our database.",
    },
    {
      question: "What are the prizes?",
      answer:
        "Cash prizes are awarded in each category: ₦10,000 for Ages 2–5; ₦15,000 for Ages 6–8; ₦20,000 for Ages 9–12 (Junior); and ₦25,000 for Ages 13–19 (Senior). Certificates of excellence and holiday gift bags will also be presented.",
    },
    {
      question: "Where and when will the event take place?",
      answer:
        "The event holds on Saturday, December 12, 2026, from 10:00 AM to 5:00 PM at ThinkUp Innovation Hub: 2nd Floor, Purpose Mall, 23 Awolowo Avenue, Opposite GTCO/Cloud 7, Old Bodija, Ibadan, Oyo State.",
    },
    {
      question: "What should participants prepare?",
      answer:
        "Participants should prepare a 2 to 3-minute explanation of their app idea. They may bring drawings, paper mockups, PowerPoint slides, Figma designs, or working code on a tablet or laptop. (For toddlers in Ages 2–5, simple oral explanation or creative drawings are sufficient).",
    },
    {
      question: "Is there a registration fee to participate?",
      answer:
        "Yes, the participant registration fee is ₦5,000 NGN. This covers the child's entry badge, access to all hackathon pitch sessions, full access to fun activities (bouncing castle, games, movies), event materials, and eligibility for the category cash prizes (up to ₦25,000). Payment is completed securely online.",
    },
    {
      question: "How can I contact ThinkUp Innovation Services?",
      answer:
        "You can reach the team directly by phone or WhatsApp at 0806 755 7709 and 0706 520 2865, or connect on Instagram & TikTok via @thinkupinnovationhub.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200 uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Find answers to common questions about the challenge, schedule, and participation guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-slate-900 hover:text-red-600 font-bold text-base transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-red-100 text-red-600" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in-50 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick contact prompt */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-900 text-base">Still have questions?</h4>
            <p className="text-xs text-slate-500">We are always ready to assist parents and guardians.</p>
          </div>
          <a
            href="https://wa.me/2348067557709"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

