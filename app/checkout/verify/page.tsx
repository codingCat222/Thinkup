"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Printer,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const isMock = searchParams.get("mock") === "true";

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registration, setRegistration] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setErrorMsg("No payment reference was provided in the return URL.");
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        setLoading(true);
        const res = await fetch(`/api/payment/verify?reference=${encodeURIComponent(reference!)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success && data.verified) {
          setVerified(true);
          setRegistration(data.registration);
        } else {
          setVerified(false);
          setErrorMsg(data.message || "Payment verification could not be confirmed.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setVerified(false);
        setErrorMsg(err.message || "Network error while verifying transaction.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [reference]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Verifying Payment with Server...
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please wait while we confirm your transaction securely with the payment processor.
        </p>
      </div>
    );
  }

  if (!verified || !registration) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Payment Verification Notice
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1 mb-3">
            Payment Not Confirmed
          </h2>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {errorMsg || "We could not verify the payment for this registration. If you were debited, please contact our organizers with your reference."}
          </p>

          {reference && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 mb-6 break-all">
              Reference: {reference}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href="/#register"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
            >
              Return to Registration
            </a>

            <a
              href="https://wa.me/2348067557709"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contact Organizers on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const feeFormatted = (registration.amountKobo / 100).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Development Mock Warning Banner if applicable */}
        {isMock && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider block">
                [DEV ONLY] Mock Payment Simulation Active
              </span>
              <span>
                This is a non-production test simulation enabled for local staging. Real cards are not processed.
              </span>
            </div>
          </div>
        )}

        {/* Main Verified Ticket Card */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl overflow-hidden print:border-none print:shadow-none">
          {/* Top Festive Header */}
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Participation Ticket
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-sm text-rose-100 mt-2 font-medium">
              Payment verified and spot secured for the Kids&apos; Apps Challenge
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Registration Code Showcase */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Registration Ticket Code
                </span>
                <p className="text-2xl sm:text-3xl font-mono font-black text-red-600 tracking-wider">
                  {registration.registrationCode}
                </p>
                <span className="text-xs text-slate-500">
                  Present this code upon arrival at check-in
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyCode(registration.registrationCode)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-xs font-bold text-slate-700 hover:bg-rose-50 transition-colors shadow-sm shrink-0"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? "Copied to Clipboard" : "Copy Code"}</span>
              </button>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wide">
                  Participant
                </span>
                <span className="font-bold text-slate-900 text-base">
                  {registration.childName}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Category: {registration.ageCategory}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wide">
                  Payment Status
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Paid (₦{feeFormatted} NGN)
                </span>
                <span className="text-xs text-slate-400 font-mono block mt-0.5 truncate">
                  Ref: {registration.paymentReference}
                </span>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Event Logistics</span>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-bold text-base text-white">
                  Saturday, December 12, 2026 • 10:00 AM – 5:00 PM
                </p>
                <p className="text-xs text-slate-300">
                  Registration check-in desk opens at 9:30 AM
                </p>
                <div className="flex items-start gap-2 pt-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>ThinkUp Innovation Hub</strong>, 2nd Floor, Purpose Mall, 23 Awolowo Avenue, Opposite GTCO/Cloud 7, Old Bodija, Ibadan.
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps for Parents */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                What to Prepare Before Saturday, Dec 12:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Help your child prepare a 2 to 3-minute explanation or demonstration of their app idea.</li>
                <li>Drawings, paper sketches, slides, Figma prototypes, or working code on a tablet/laptop are all welcome.</li>
                <li>A confirmation summary has been logged for <strong>{registration.parentEmail}</strong>.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>

              <a
                href={`https://wa.me/2348067557709?text=${encodeURIComponent(
                  `Hello ThinkUp Team! I have completed payment and registration for ${registration.childName} (Ticket: ${registration.registrationCode}, Ref: ${registration.paymentReference}). See you on Dec 12!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Confirmation</span>
              </a>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                <span>Back to Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

