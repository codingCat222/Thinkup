"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Mail,
  LogOut,
  ExternalLink,
  Eye,
  Send,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Calendar,
} from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Metrics & Config
  const [metrics, setMetrics] = useState<any>(null);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Registrations & Filters
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [emailStatus, setEmailStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected participant for modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Resending state
  const [resendingCode, setResendingCode] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setSystemConfig(data.config);
        setAdminUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }, [router]);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (paymentStatus !== "all") params.set("paymentStatus", paymentStatus);
      if (category !== "all") params.set("category", category);
      if (emailStatus !== "all") params.set("emailStatus", emailStatus);
      params.set("page", String(page));
      params.set("limit", "15");

      const res = await fetch(`/api/admin/registrations?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    } finally {
      setLoading(false);
    }
  }, [search, paymentStatus, category, emailStatus, page, router]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleResendEmail = async (registrationCode: string) => {
    try {
      setResendingCode(registrationCode);
      setActionNotice(null);

      const res = await fetch("/api/admin/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationCode }),
      });

      const data = await res.json();
      if (data.success) {
        setActionNotice(`✅ Confirmation email resent for ${registrationCode}`);
        fetchRegistrations();
        if (selectedItem?.registrationCode === registrationCode) {
          setSelectedItem({ ...selectedItem, emailStatus: "sent" });
        }
      } else {
        setActionNotice(`⚠️ Resend notice: ${data.message || data.error}`);
      }
    } catch (err: any) {
      setActionNotice(`❌ Error resending: ${err.message}`);
    } finally {
      setResendingCode(null);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo light={true} withPillars={false} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {adminUser && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">
                  {adminUser.fullName || adminUser.username}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {adminUser.role}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Gateway & Environment Status Strip */}
        {systemConfig && (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Paystack Gateway:</span>
                {systemConfig.isPaystackConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {systemConfig.isPaystackTestMode ? "Configured (Test Mode)" : "Configured (Live)"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Pending API Credentials (Expected before Monday)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Email Delivery:</span>
                {systemConfig.emailConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[11px]">
                    Connected ({systemConfig.emailProvider})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
                    Provider Not Configured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Per-Student Fee:</span>
                <span className="font-bold text-white font-mono">
                  ₦{systemConfig.feeNgn?.toLocaleString()} NGN
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                fetchMetrics();
                fetchRegistrations();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        )}

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white animate-in fade-in">
            {actionNotice}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Registrations */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {metrics ? metrics.totalRegistrations : "—"}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">All participant drafts</span>
          </div>

          {/* Card 2: Verified Paid */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Verified Paid</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {metrics ? metrics.paidRegistrations : "—"}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Confirmed spots</span>
          </div>

          {/* Card 3: Pending Payments */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Pay</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {metrics ? metrics.pendingRegistrations : "—"}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Awaiting checkout</span>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <CreditCard className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-white">
              ₦{metrics ? metrics.totalRevenueNgn.toLocaleString() : "0"}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Processed funds</span>
          </div>

          {/* Card 5: Unique Visitors (Distinguished from Registrations) */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Portal Visitors</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">
              {metrics ? metrics.totalVisitors : "0"}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Unique page visits (Separate)</span>
          </div>
        </div>

        {/* Search, Filter & Table Section */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Registered Participants</span>
                <span className="text-xs font-normal text-slate-400">({totalCount} records)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Search, inspect submissions, and verify fee settlements
              </p>
            </div>

            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, code, email, ref..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Payment Status Filter */}
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Age Category Filter */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">All Categories</option>
                <option value="2–5">Ages 2–5</option>
                <option value="6–8">Ages 6–8</option>
                <option value="9–12">Ages 9–12</option>
                <option value="13–19">Ages 13–19</option>
              </select>

              {/* Email Status Filter */}
              <select
                value={emailStatus}
                onChange={(e) => {
                  setEmailStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="all">All Email States</option>
                <option value="sent">Email Sent</option>
                <option value="failed">Email Failed</option>
                <option value="pending">Email Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Participant</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Parent & Contact</th>
                  <th className="py-3 px-3">Codes / Refs</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Enrolled</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading participants...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No registrations match the selected filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{row.childName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {row.age} yrs • {row.schoolName}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <span className="inline-block max-w-[140px] truncate" title={row.ageCategory}>
                          {row.ageCategory}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div className="font-medium text-slate-200">{row.parentName}</div>
                        <div className="text-[10px] text-slate-400">{row.parentPhone}</div>
                        <div className="text-[10px] text-slate-400">{row.parentEmail}</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-rose-400 font-bold">{row.registrationCode}</div>
                        {row.paymentReference ? (
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]" title={row.paymentReference}>
                            {row.paymentReference}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No payref</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {row.paymentStatus === "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid (₦{(row.amountKobo / 100).toLocaleString()})
                          </span>
                        ) : row.paymentStatus === "failed" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {row.emailStatus === "sent" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                            <Mail className="w-3 h-3" />
                            Sent
                          </span>
                        ) : row.emailStatus === "failed" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-400" title={row.emailError || "Delivery failed"}>
                            <AlertCircle className="w-3 h-3" />
                            Failed
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Pending</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(row.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(row)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {row.paymentStatus === "paid" && (
                            <button
                              type="button"
                              disabled={resendingCode === row.registrationCode}
                              onClick={() => handleResendEmail(row.registrationCode)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                              title="Resend Confirmation Email"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Participant Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  Registration Record
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedItem.childName}
                </h3>
                <span className="text-xs text-slate-400">
                  Ticket Code: <strong className="text-white font-mono">{selectedItem.registrationCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs border-t border-b border-slate-800 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Category:</span>
                  <span className="text-white font-semibold">{selectedItem.ageCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Age & School:</span>
                  <span className="text-white font-semibold">
                    {selectedItem.age} years • {selectedItem.schoolName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Parent / Guardian:</span>
                  <span className="text-white font-semibold">{selectedItem.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Parent Phone:</span>
                  <a href={`tel:${selectedItem.parentPhone}`} className="text-rose-400 underline">
                    {selectedItem.parentPhone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block">Parent Email:</span>
                <span className="text-white font-mono">{selectedItem.parentEmail}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">App Idea / Pitch Description:</span>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedItem.projectDescription}
                </div>
              </div>

              {selectedItem.projectFileName && (
                <div>
                  <span className="text-slate-400 block mb-1">Uploaded Attachment:</span>
                  <a
                    href={selectedItem.projectFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 underline font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Project File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 block">Payment Reference:</span>
                  <span className="text-white font-mono">{selectedItem.paymentReference || "None"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Status:</span>
                  <span className="text-white capitalize font-semibold">{selectedItem.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedItem.paymentStatus === "paid" && (
                <button
                  type="button"
                  onClick={() => handleResendEmail(selectedItem.registrationCode)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                >
                  Resend Confirmation Email
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

