"use client";

import React, { useState } from "react";
import { LogOut, MessageSquare, Bug, Mail, Clock, LayoutDashboard, CheckCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedbackItem {
  id: string;
  type: "feedback" | "bug";
  name: string;
  email: string;
  message: string;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
}

interface AdminDashboardClientProps {
  initialFeedbacks: FeedbackItem[];
  adminName: string;
}

export default function AdminDashboardClient({ initialFeedbacks, adminName }: AdminDashboardClientProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  const totalBugs = feedbacks.filter((f) => f.type === "bug").length;
  const totalFeedback = feedbacks.filter((f) => f.type === "feedback").length;

  const handleResolve = async (id: string) => {
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "resolved" } : f))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to resolve", err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex flex-col items-center pt-24 pb-12 px-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-[#F8F8F8]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#F8F8F8]">Admin Dashboard</h1>
              <p className="text-[#A2A8B3] mt-1">Welcome back, {adminName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#111418] border border-[rgba(255,255,255,0.08)] px-4 py-2 rounded-lg flex items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageSquare className="w-4 h-4" /> {totalFeedback}
              </div>
              <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.1)]" />
              <div className="flex items-center gap-2 text-rose-400">
                <Bug className="w-4 h-4" /> {totalBugs}
              </div>
            </div>
            <a 
              href="/api/auth/signout" 
              className="p-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111418] text-[#A2A8B3] hover:text-[#F8F8F8] hover:bg-rose-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Data Table / Cards */}
        <div className="grid grid-cols-1 gap-4">
          {feedbacks.length === 0 ? (
            <div className="text-center py-24 bg-[#111418]/50 rounded-2xl border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#A2A8B3]">No feedback received yet.</p>
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className={`bg-[#111418]/80 backdrop-blur-sm border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all hover:bg-[#1A1D24] ${fb.status === 'resolved' ? 'opacity-60' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {fb.type === "bug" ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                        <Bug className="w-3.5 h-3.5" /> Bug
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        <MessageSquare className="w-3.5 h-3.5" /> Feedback
                      </span>
                    )}
                    <span className="text-[#F8F8F8] font-medium">{fb.name}</span>
                    {fb.status === "resolved" && (
                      <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Resolved</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#A2A8B3] mt-2 md:mt-0">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {fb.email}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {fb.createdAt}</span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2 md:mt-0 ml-0 md:ml-4 w-full md:w-auto justify-end">
                      {fb.status !== "resolved" && (
                        <button
                          onClick={() => handleResolve(fb.id)}
                          disabled={isProcessing === fb.id}
                          className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20 disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(fb.id)}
                        disabled={isProcessing === fb.id}
                        className="flex items-center gap-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors border border-rose-500/20 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#0B0D10] rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <p className="text-[#F8F8F8] whitespace-pre-wrap text-sm leading-relaxed">{fb.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
