"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { registrationSchema, type RegistrationFormData, AGE_CATEGORIES } from "@/lib/validations";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  X,
  CreditCard,
  Lock,
  MessageCircle,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

// Native lightweight Zod resolver for react-hook-form
const customZodResolver = (values: any) => {
  const result = registrationSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  const formErrors: any = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path[0] as string;
    if (!formErrors[fieldName]) {
      formErrors[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }
  }
  return { values: {}, errors: formErrors };
};

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fee state fetched from server config
  const [feeNgn, setFeeNgn] = useState<number>(5000);
  const [currency, setCurrency] = useState<string>("NGN");

  // Gateway status modal / state
  const [gatewayPendingData, setGatewayPendingData] = useState<{
    registrationCode: string;
    amountNgn: number;
    childName: string;
  } | null>(null);

  // Dev mock simulation modal
  const [devMockData, setDevMockData] = useState<{
    reference: string;
    authorizationUrl: string;
    registrationCode: string;
  } | null>(null);

  // Fetch server-configured fee on mount
  useEffect(() => {
    fetch("/api/register")
      .then((res) => res.json())
      .then((data) => {
        if (data.feeNgn) setFeeNgn(data.feeNgn);
        if (data.currency) setCurrency(data.currency);
      })
      .catch((err) => console.warn("Could not fetch server fee config:", err));
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: customZodResolver,
    defaultValues: {
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      childName: "",
      dateOfBirth: "",
      schoolName: "",
      ageCategory: "",
      projectDescription: "",
      consentGiven: true,
      privacyAgreed: true,
    },
  });

  const watchedAge = watch("age");

  // Auto-suggest category when parent enters age
  useEffect(() => {
    if (watchedAge) {
      const ageNum = Number(watchedAge);
      if (ageNum >= 2 && ageNum <= 5) {
        setValue("ageCategory", AGE_CATEGORIES[0]);
      } else if (ageNum >= 6 && ageNum <= 8) {
        setValue("ageCategory", AGE_CATEGORIES[1]);
      } else if (ageNum >= 9 && ageNum <= 12) {
        setValue("ageCategory", AGE_CATEGORIES[2]);
      } else if (ageNum >= 13 && ageNum <= 19) {
        setValue("ageCategory", AGE_CATEGORIES[3]);
      }
    }
  }, [watchedAge, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15MB limit. Please choose a smaller file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setGatewayPendingData(null);
    setDevMockData(null);

    try {
      // Step 1: Submit and store pending registration in SQLite
      const formData = new FormData();
      formData.append("parentName", data.parentName);
      formData.append("parentPhone", data.parentPhone);
      formData.append("parentEmail", data.parentEmail);
      formData.append("childName", data.childName);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("age", String(data.age));
      formData.append("schoolName", data.schoolName);
      formData.append("ageCategory", data.ageCategory);
      formData.append("projectDescription", data.projectDescription);
      formData.append("consentGiven", String(data.consentGiven));
      formData.append("privacyAgreed", String(data.privacyAgreed));

      if (selectedFile) {
        formData.append("projectFile", selectedFile);
      }

      const regRes = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const regJson = await regRes.json();

      if (!regRes.ok || !regJson.success) {
        throw new Error(regJson.error || "Failed to record registration draft.");
      }

      const registrationCode = regJson.registrationCode;

      // Step 2: Initialize payment session with server
      const payRes = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationCode }),
      });

      const payJson = await payRes.json();

      // Case A: Paystack keys pending / not configured
      if (payJson.error === "PAYSTACK_NOT_CONFIGURED") {
        setGatewayPendingData({
          registrationCode,
          amountNgn: payJson.amountNgn || feeNgn,
          childName: data.childName,
        });
        reset();
        setSelectedFile(null);
        return;
      }

      // Case B: Dev mock simulation allowed in staging
      if (payJson.isMock && payJson.authorizationUrl) {
        setDevMockData({
          reference: payJson.reference,
          authorizationUrl: payJson.authorizationUrl,
          registrationCode,
        });
        reset();
        setSelectedFile(null);
        return;
      }

      // Case C: Real Paystack session initialized
      if (payJson.success && payJson.authorizationUrl) {
        // Redirect to Paystack secure checkout
        window.location.href = payJson.authorizationUrl;
        return;
      }

      throw new Error(payJson.message || "Unable to proceed to payment gateway.");
    } catch (err: any) {
      console.error("Submission error:", err);
      setServerError(err.message || "An unexpected error occurred. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section id="register" className="py-20 bg-gradient-to-b from-white via-rose-50/30 to-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-red-700 bg-red-100/70 border border-red-200 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Hackathon Registration & Entry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Register & Secure Your Spot
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto font-normal">
            Complete participant details and proceed to secure checkout. Limited capacity available per age category.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>Programme Entry Fee: ₦{feeNgn.toLocaleString()} NGN</span>
            <span className="text-slate-400 font-normal">• All activities & prizes included</span>
          </div>
        </div>

        {/* State 1: Payment Gateway Pending Notice (Honest Paystack Readiness State) */}
        {gatewayPendingData && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-400 shadow-xl animate-in zoom-in-95">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Registration Recorded • Payment Gateway Activation Notice
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Spot Saved for {gatewayPendingData.childName}!
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Your registration draft is securely saved in our database. The automated Paystack payment card gateway is scheduled to be activated before Monday. You may confirm your reservation directly with our organizing team via WhatsApp or phone.
                </p>

                {/* Ticket Reference Code */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Saved Reference Code
                    </span>
                    <p className="text-xl font-mono font-black text-red-600 tracking-wider">
                      {gatewayPendingData.registrationCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(gatewayPendingData.registrationCode)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied!" : "Copy Reference"}</span>
                  </button>
                </div>

                {/* Contact Organizers CTA */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/2348067557709?text=${encodeURIComponent(
                      `Hello ThinkUp! I registered ${gatewayPendingData.childName} with reference ${gatewayPendingData.registrationCode}. How do I finalize the ₦${gatewayPendingData.amountNgn.toLocaleString()} registration fee?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Spot via WhatsApp (0806 755 7709)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setGatewayPendingData(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2"
                  >
                    Register Another Participant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Development Mock Simulation Notice */}
        {devMockData && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-amber-50/80 border-2 border-amber-300 shadow-xl animate-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  [DEV ONLY] Mock Payment Simulation Active
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Simulate Verified Checkout
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Paystack API keys are pending configuration before Monday. A local development mock is active to test the verification screen, database persistence, and email triggers without real charges.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={devMockData.authorizationUrl}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Proceed with Mock Verification &rarr;</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setDevMockData(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Registration Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl relative">
          {serverError && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-bold">Unable to proceed</p>
                <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Parent/Guardian Details */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Parent / Guardian Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Parent / Guardian Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Adeola Johnson"
                      {...register("parentName")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.parentName ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.parentName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.parentName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Phone Number (WhatsApp Preferred) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 0806 755 7709"
                      {...register("parentPhone")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.parentPhone ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.parentPhone && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.parentPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Email Address (For Confirmation) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. adeola@example.com"
                      {...register("parentEmail")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.parentEmail ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.parentEmail && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.parentEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Child / Participant Details */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Child / Participant Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Child&apos;s Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. David Johnson"
                      {...register("childName")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.childName ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.childName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.childName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.dateOfBirth ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Age (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="19"
                    placeholder="e.g. 10"
                    {...register("age")}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                      errors.age ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                    }`}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. International School Ibadan"
                      {...register("schoolName")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        errors.schoolName ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {errors.schoolName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.schoolName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Age Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ageCategory"
                    {...register("ageCategory")}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                      errors.ageCategory ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                    }`}
                  >
                    <option value="">-- Select Age Category --</option>
                    {AGE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.ageCategory && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.ageCategory.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: App Idea / Project Details */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  App Idea / Project Pitch
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Describe Your Child&apos;s App Idea or Concept <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what the app does, who it helps, or what problem it solves. (e.g. 'An interactive quiz game that teaches Nigerian history', or 'A smart recycling reminder tool')."
                  {...register("projectDescription")}
                  className={`w-full p-4 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                    errors.projectDescription ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-red-500"
                  }`}
                />
                {errors.projectDescription && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.projectDescription.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Optional Project Document, Slides, or Mockup (Max 15MB)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl p-4 text-center transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx,.zip"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-800 font-semibold">
                      <FileText className="w-5 h-5 text-red-600" />
                      <span className="truncate max-w-xs">{selectedFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">
                        Click or drag to attach slides, diagrams, or notes
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PDF, PowerPoint, Word, PNG, or JPEG
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Consent & Terms */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("consentGiven")}
                  className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Parent / Guardian Consent:</strong> I confirm that I am the parent or legal guardian of the participant and hereby grant consent for their participation in the Happy December Kids&apos; Apps Challenge on Dec 12, 2026.
                </span>
              </label>
              {errors.consentGiven && (
                <p className="text-xs text-red-500 font-medium pl-7">{errors.consentGiven.message}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("privacyAgreed")}
                  className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Privacy Policy:</strong> I agree to the processing of the submitted details by ThinkUp Innovation Services exclusively for the administration and logistics of this event.
                </span>
              </label>
              {errors.privacyAgreed && (
                <p className="text-xs text-red-500 font-medium pl-7">{errors.privacyAgreed.message}</p>
              )}
            </div>

            {/* Submit & Pay Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 opacity-90" />
                    <span>Register & Pay ₦{feeNgn.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Paystack checkout • We never store card details</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
