/**
 * Admin Cancellations Dashboard
 *
 * Shows all cancellation reasons, mentor call requests, and re-engagement opt-ins.
 * Accessible only to admin users.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Heart,
  AlertCircle,
  Calendar,
  User,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  too_expensive: "Too expensive",
  need_more_time: "Needs more time",
  not_using_enough: "Not using enough",
  feel_overwhelmed: "Feels overwhelmed",
  unsure_if_ready: "Unsure if ready",
  got_the_job: "Got the job 🎉",
  struggling_with_interviews: "Struggling with interviews",
  need_career_advice: "Needs career advice",
  other: "Other",
};

const REASON_COLORS: Record<string, string> = {
  too_expensive: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  need_more_time: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  not_using_enough: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  feel_overwhelmed: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  unsure_if_ready: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  got_the_job: "bg-green-500/10 text-green-300 border-green-500/20",
  struggling_with_interviews: "bg-red-500/10 text-red-300 border-red-500/20",
  need_career_advice: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  other: "bg-white/5 text-white/50 border-white/10",
};

type Tab = "reasons" | "mentor" | "reengagement";

export default function AdminCancellations() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("reasons");

  const { data: reasons, isLoading: loadingReasons } = trpc.cancellation.getAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: mentorRequests, isLoading: loadingMentor } = trpc.cancellation.getMentorRequests.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: optIns, isLoading: loadingOptIns } = trpc.cancellation.getReEngagementOptIns.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-white/50 mb-6">This page is restricted to admin users.</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-cyan-500 text-black font-bold">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Compute summary stats
  const reasonCounts = reasons?.reduce((acc, r) => {
    acc[r.reason] = (acc[r.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  const pendingMentorCount = mentorRequests?.filter((m) => m.status === "pending").length ?? 0;
  const optInCount = optIns?.filter((o) => o.optedIn).length ?? 0;

  const tabs: { id: Tab; label: string; count: number; icon: typeof Phone }[] = [
    { id: "reasons", label: "Cancellation Reasons", count: reasons?.length ?? 0, icon: AlertCircle },
    { id: "mentor", label: "Mentor Requests", count: mentorRequests?.length ?? 0, icon: Phone },
    { id: "reengagement", label: "Re-Engagement Opt-Ins", count: optIns?.length ?? 0, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-black">Cancellation Intelligence</h1>
              <p className="text-white/40 text-xs">Understanding why users leave — and how to support them</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {pendingMentorCount > 0 && (
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
                <Phone className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">{pendingMentorCount} pending mentor call{pendingMentorCount !== 1 ? "s" : ""}</span>
              </div>
            )}
            {optInCount > 0 && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3 py-1">
                <Heart className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-rose-300 font-semibold">{optInCount} re-engagement opt-in{optInCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Cancellations</p>
            <p className="text-3xl font-black">{reasons?.length ?? 0}</p>
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-4">
            <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-1">Mentor Requests</p>
            <p className="text-3xl font-black text-cyan-300">{mentorRequests?.length ?? 0}</p>
            {pendingMentorCount > 0 && (
              <p className="text-xs text-cyan-400/60 mt-1">{pendingMentorCount} pending action</p>
            )}
          </div>
          <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-4">
            <p className="text-rose-400/60 text-xs uppercase tracking-widest mb-1">Re-Engagement Opt-Ins</p>
            <p className="text-3xl font-black text-rose-300">{optInCount}</p>
          </div>
          <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
            <p className="text-green-400/60 text-xs uppercase tracking-widest mb-1">Got the Job</p>
            <p className="text-3xl font-black text-green-300">{reasonCounts["got_the_job"] ?? 0}</p>
          </div>
        </div>

        {/* Top Reasons Summary */}
        {Object.keys(reasonCounts).length > 0 && (
          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Reason Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reasonCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([reason, count]) => (
                  <div
                    key={reason}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${REASON_COLORS[reason] ?? "bg-white/5 text-white/50 border-white/10"}`}
                  >
                    <span>{REASON_LABELS[reason] ?? reason}</span>
                    <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1 mb-6 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === tab.id ? "bg-white/20" : "bg-white/5"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab: Cancellation Reasons */}
        {activeTab === "reasons" && (
          <div className="space-y-3">
            {loadingReasons ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-white/30" />
              </div>
            ) : reasons?.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No cancellations yet.</p>
              </div>
            ) : (
              reasons?.map((r) => (
                <div key={r.id} className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${REASON_COLORS[r.reason] ?? ""}`}>
                          {REASON_LABELS[r.reason] ?? r.reason}
                        </span>
                        <span className="text-white/30 text-xs">
                          {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
                        <span className="text-sm text-white/70">{r.userName || "Unknown"}</span>
                        {r.userEmail && <span className="text-xs text-white/30">({r.userEmail})</span>}
                      </div>
                      {(r.currentIndustry || r.targetRole) && (
                        <div className="flex items-center gap-4 text-xs text-white/40 mb-2">
                          {r.currentIndustry && <span>From: {r.currentIndustry}</span>}
                          {r.targetRole && <span>→ {r.targetRole}</span>}
                        </div>
                      )}
                      {r.customReason && (
                        <p className="text-sm text-white/50 italic mt-2">"{r.customReason}"</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-white/30 flex-shrink-0">
                      {r.readinessScore != null && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{r.readinessScore}% readiness</span>
                        </div>
                      )}
                      {r.levelsCompleted != null && (
                        <span>{r.levelsCompleted} levels completed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Mentor Requests */}
        {activeTab === "mentor" && (
          <div className="space-y-4">
            {loadingMentor ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-white/30" />
              </div>
            ) : mentorRequests?.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Phone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No mentor requests yet.</p>
              </div>
            ) : (
              mentorRequests?.map((req) => (
                <div key={req.id} className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${
                          req.status === "pending"
                            ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
                            : req.status === "scheduled"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                            : req.status === "completed"
                            ? "bg-green-500/10 text-green-300 border-green-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-white/30 text-xs">
                          {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-white/30" />
                        <span className="text-sm text-white/70">{req.userName || "Unknown"}</span>
                        {req.userEmail && <span className="text-xs text-white/30">({req.userEmail})</span>}
                      </div>
                      {(req.userIndustry || req.userTargetRole) && (
                        <div className="flex items-center gap-4 text-xs text-white/40 mt-1">
                          {req.userIndustry && <span>From: {req.userIndustry}</span>}
                          {req.userTargetRole && <span>→ {req.userTargetRole}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {req.helpTopics && (
                    <div className="mb-3">
                      <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Help topics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {req.helpTopics.split(", ").map((topic) => (
                          <span key={topic} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-300">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/[0.03] border border-white/8 rounded-lg p-4 mb-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Main question</p>
                        <p className="text-sm text-white/80 leading-relaxed">"{req.mainQuestion}"</p>
                      </div>
                    </div>
                  </div>

                  {req.currentSituation && (
                    <div className="mb-3">
                      <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Current situation</p>
                      <p className="text-sm text-white/60 leading-relaxed">{req.currentSituation}</p>
                    </div>
                  )}

                  {req.desiredOutcome && (
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Desired outcome</p>
                      <p className="text-sm text-white/60 leading-relaxed">{req.desiredOutcome}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Re-Engagement Opt-Ins */}
        {activeTab === "reengagement" && (
          <div className="space-y-3">
            {loadingOptIns ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-white/30" />
              </div>
            ) : optIns?.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No re-engagement opt-ins yet.</p>
              </div>
            ) : (
              optIns?.map((opt) => (
                <div key={opt.id} className={`border rounded-xl p-5 ${
                  opt.optedIn
                    ? "bg-rose-500/[0.03] border-rose-500/15"
                    : "bg-white/[0.02] border-white/8"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {opt.optedIn ? (
                        <CheckCircle2 className="h-5 w-5 text-rose-400" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-white/20" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white/80">{opt.userName || "Unknown"}</span>
                          {opt.userEmail && <span className="text-xs text-white/30">({opt.userEmail})</span>}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {opt.optedIn ? "Opted in to 3-month check-in" : "Preferred not to be contacted"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/30">
                      {opt.optedIn && opt.checkInDate && (
                        <div className="flex items-center gap-1 text-rose-400/70 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Check in: {new Date(opt.checkInDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      )}
                      {opt.checkInSent && (
                        <div className="flex items-center gap-1 text-green-400/70">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Check-in sent</span>
                        </div>
                      )}
                      {opt.optedIn && !opt.checkInSent && (
                        <div className="flex items-center gap-1 text-orange-400/70">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </div>
                      )}
                      <p className="mt-1">
                        Cancelled: {new Date(opt.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
