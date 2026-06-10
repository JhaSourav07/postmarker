"use client";

import React, { useState, useEffect } from "react";
import { Server, Send, Inbox, RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceStatus {
  status: boolean;
  activeThreads?: number;
  activeMessages?: number;
  error?: string | null;
}

interface StatusData {
  timestamp: string;
  services: {
    database: ServiceStatus;
    smtp: ServiceStatus;
    imap: ServiceStatus;
  };
}

export default function StatusDashboardClient() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/status");
      if (!response.ok) {
        throw new Error("Failed to fetch system status.");
      }
      const json = await response.json();
      setData(json);
      setLastChecked(new Date());
      setSecondsAgo(0);
    } catch (err: any) {
      setError(err.message || "An error occurred while checking systems.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!lastChecked) return;
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastChecked.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  // Overall system indicator status
  const getOverallStatus = () => {
    if (loading && !data) return { text: "Checking systems...", color: "text-neutral-400", bg: "bg-neutral-500" };
    if (error) return { text: "Monitoring Offline", color: "text-red-400", bg: "bg-red-500" };
    if (!data) return { text: "Unknown", color: "text-neutral-400", bg: "bg-neutral-500" };

    const { database, smtp, imap } = data.services;
    const allOk = database.status && smtp.status && imap.status;
    const allFailed = !database.status && !smtp.status && !imap.status;

    if (allOk) {
      return { text: "All Systems Operational", color: "text-emerald-400", bg: "bg-emerald-500" };
    } else if (allFailed) {
      return { text: "Major System Outage", color: "text-red-400", bg: "bg-red-500" };
    } else {
      return { text: "Partial Service Outage", color: "text-amber-400", bg: "bg-amber-500" };
    }
  };

  const overall = getOverallStatus();

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 border-b border-[rgba(255,255,255,0.06)] pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F8F8F8] mb-2">
              System Status
            </h1>
            <p className="text-xs text-[#A2A8B3]">
              Real-time monitoring of Postmarker database and mail server interfaces.
            </p>
          </div>
          
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center justify-center gap-2 text-xs bg-[#111418] hover:bg-[#161A20] border border-[rgba(255,255,255,0.08)] px-4 py-2.5 rounded-lg transition-colors font-semibold uppercase tracking-wider text-neutral-200 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Check Status"}</span>
          </button>
        </div>

        {/* Global Operational Banner */}
        <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 mb-8 backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
          
          <div className="flex items-center gap-4">
            <span className="relative flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${overall.bg} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${overall.bg}`}></span>
            </span>
            <div>
              <h2 className={`text-lg font-bold tracking-tight ${overall.color}`}>
                {overall.text}
              </h2>
              {lastChecked && (
                <span className="text-[10px] text-[#A2A8B3] flex items-center gap-1 mt-0.5 animate-fade-in">
                  <Clock className="w-3 h-3" />
                  Checked {secondsAgo === 0 ? "just now" : `${secondsAgo}s ago`}
                </span>
              )}
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#A2A8B3]">
            Type: Dynamic Health check
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Grid Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Database */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between min-h-[220px]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Server className="w-5 h-5" />
                </span>
                
                {loading ? (
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
                ) : data?.services.database.status ? (
                  <span className="text-[10px] font-mono font-semibold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-semibold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Offline
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#F8F8F8] mb-1">Database Cluster</h3>
              <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                Stores transient threads, metadata indices, and message envelopes with automated TTL sweeps.
              </p>
            </div>

            <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-4 flex items-center justify-between text-xs font-mono text-[#A2A8B3]">
              <div>
                <span className="block text-[#F8F8F8] font-bold text-sm">
                  {loading ? "..." : data?.services.database.activeThreads ?? 0}
                </span>
                <span>Active Alias Threads</span>
              </div>
              <div className="text-right">
                <span className="block text-[#F8F8F8] font-bold text-sm">
                  {loading ? "..." : data?.services.database.activeMessages ?? 0}
                </span>
                <span>Messages Stored</span>
              </div>
            </div>
          </div>

          {/* Card 2: SMTP server */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between min-h-[220px]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                  <Send className="w-5 h-5" />
                </span>
                
                {loading ? (
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
                ) : data?.services.smtp.status ? (
                  <span className="text-[10px] font-mono font-semibold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-semibold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Outage
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#F8F8F8] mb-1">SMTP Outbound</h3>
              <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                Nodemailer gateway responsible for dispatching anonymous outbound messages with custom header IDs.
              </p>
            </div>

            <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-4 text-[10px] font-mono text-[#A2A8B3]">
              {loading ? (
                <span>Verifying relay socket...</span>
              ) : data?.services.smtp.status ? (
                <span className="text-emerald-400">SMTP relay verified & active.</span>
              ) : (
                <span className="text-red-400 block truncate">
                  Error: {data?.services.smtp.error || "Failed connection."}
                </span>
              )}
            </div>
          </div>

          {/* Card 3: IMAP server */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between min-h-[220px]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                  <Inbox className="w-5 h-5" />
                </span>
                
                {loading ? (
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
                ) : data?.services.imap.status ? (
                  <span className="text-[10px] font-mono font-semibold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-semibold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Outage
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#F8F8F8] mb-1">IMAP Inbound Sync</h3>
              <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                Listens to Gmail server via IMAPFlow, matches thread tokens, and ingests genuine conversations.
              </p>
            </div>

            <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-4 text-[10px] font-mono text-[#A2A8B3]">
              {loading ? (
                <span>Checking IMAP flow...</span>
              ) : data?.services.imap.status ? (
                <span className="text-emerald-400">IMAP connection active.</span>
              ) : (
                <span className="text-red-400 block truncate">
                  Error: {data?.services.imap.error || "Failed connection."}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notice Info */}
        <div className="mt-12 text-center text-xs text-[#A2A8B3] border-t border-[rgba(255,255,255,0.06)] pt-8">
          All connection tests are performed live. We never cache system health states to guarantee accurate diagnostics.
        </div>
      </motion.div>
    </div>
  );
}
