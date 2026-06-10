"use client";

import React, { useState } from "react";
import { ArrowLeft, Trash2, Calendar, Download, AlertTriangle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  receivedAt: string;
}

interface ThreadSettingsClientProps {
  thread: {
    threadId: string;
    tempEmail: string;
    expiresAt: string;
    createdAt: string;
  };
  messages: Message[];
  token: string;
}

export default function ThreadSettingsClient({
  thread,
  messages,
  token,
}: ThreadSettingsClientProps) {
  const router = useRouter();
  
  // State for live expiry display
  const [expiresAt, setExpiresAt] = useState(thread.expiresAt);
  const [isExtending, setIsExtending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper to format remaining time
  const formatExpiry = (isoString: string) => {
    const expiry = new Date(isoString);
    const diffMs = expiry.getTime() - Date.now();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return "Expired";
    if (diffHours < 24) return `Expires in ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Expires in ${diffDays}d ${diffHours % 24}h`;
  };

  // Helper to check if maximum extension limit (14 days from creation) is reached
  const isMaxExtended = () => {
    const created = new Date(thread.createdAt);
    const currentExpiry = new Date(expiresAt);
    const maxExpiry = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
    // If current expiry is within 5 minutes of max expiry or exceeds it, consider it maxed out
    return currentExpiry.getTime() >= maxExpiry.getTime() - 5 * 60 * 1000;
  };

  // Handle Thread Extension (PATCH)
  const handleExtend = async () => {
    if (isMaxExtended()) return;
    setIsExtending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`/api/inbox?token=${encodeURIComponent(token)}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to extend thread.");
      }

      const data = await response.json();
      setExpiresAt(data.expiresAt);
      setSuccessMsg("Thread lifespan extended successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsExtending(false);
    }
  };

  // Handle Thread Self-Destruct (DELETE)
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`/api/inbox?token=${encodeURIComponent(token)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete thread.");
      }

      // Successful deletion. Redirect to home page with confirmation query param
      router.push("/?deleted=true");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to self-destruct thread.");
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Handle Transcript Export
  const handleExport = () => {
    const header = `# Postmarker Conversation Transcript\n` +
      `- **Temporary Email Alias**: ${thread.tempEmail}\n` +
      `- **Thread ID**: ${thread.threadId}\n` +
      `- **Exported At**: ${new Date().toLocaleString()}\n` +
      `- **Lifespan**: Created on ${new Date(thread.createdAt).toLocaleString()}, expires on ${new Date(expiresAt).toLocaleString()}\n\n` +
      `========================================================================\n\n`;

    const messageContent = messages.length === 0
      ? "*No messages in this thread yet.*"
      : messages
          .map((msg, index) => {
            return `## Message ${index + 1}: ${msg.subject}\n` +
              `- **From**: ${msg.from}\n` +
              `- **To**: ${msg.to}\n` +
              `- **Date**: ${new Date(msg.receivedAt).toLocaleString()}\n\n` +
              `${msg.bodyText || "(No plain-text body available)"}\n\n` +
              `------------------------------------------------------------------------\n\n`;
          })
          .join("");

    const blob = new Blob([header + messageContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `postmarker-transcript-${thread.threadId}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/inbox/${token}`)}
            className="flex items-center gap-2 text-xs font-semibold text-[#A2A8B3] hover:text-[#F8F8F8] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inbox</span>
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 bg-[#161A20] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.04)]">
              {formatExpiry(expiresAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#F8F8F8] mb-2">
            Thread Lifecycle Management
          </h1>
          <p className="text-xs text-[#A2A8B3]">
            Configure lifespan settings and manage transient data for your anonymous inbox.
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            {successMsg}
          </div>
        )}

        <div className="space-y-6">
          {/* Card 1: Extend Lifespan */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-[#F8F8F8] mb-1">
                  Extend Thread Lifespan
                </h3>
                <p className="text-xs text-[#A2A8B3] leading-relaxed mb-4">
                  Keep this conversation active. Extending resets the expiry to 7 days from now. 
                  To prevent abuse, total thread life is capped at a maximum of 14 days from creation.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs font-mono">
                    <span className="text-[#A2A8B3]">Created: </span>
                    <span className="text-neutral-200">{new Date(thread.createdAt).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleExtend}
                    disabled={isExtending || isMaxExtended()}
                    className="bg-[#F8F8F8] text-[#0B0D10] font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    {isExtending 
                      ? "Extending..." 
                      : isMaxExtended() 
                        ? "Maximum Extension Reached" 
                        : "Extend +7 Days"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Export Transcript */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-[#F8F8F8] mb-1">
                  Export Conversation Transcript
                </h3>
                <p className="text-xs text-[#A2A8B3] leading-relaxed mb-4">
                  Download a copy of this thread. The transcript contains the temporary email details, timestamps, 
                  and all messages formatted in standard Markdown. Executed locally on your machine.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs font-mono">
                    <span className="text-[#A2A8B3]">Total Messages: </span>
                    <span className="text-neutral-200">{messages.length}</span>
                  </div>

                  <button
                    onClick={handleExport}
                    className="bg-[#111418] hover:bg-[#161A20] text-neutral-200 border border-[rgba(255,255,255,0.08)] font-semibold px-4 py-2 rounded-lg transition-colors text-xs cursor-pointer"
                  >
                    Export as Markdown
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Danger Zone - Self-Destruct */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-red-400 mb-1">
                  Danger Zone: Self-Destruct Thread
                </h3>
                <p className="text-xs text-[#A2A8B3] leading-relaxed mb-4">
                  Instantly purge this conversation. This will permanently delete the thread alias, 
                  access tokens, and all email messages from our database immediately.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-red-500/10 pt-4 mt-2">
                  <span className="text-[10px] text-red-400/80 font-medium">
                    {confirmDelete ? "⚠️ Click button again to permanently delete." : "This operation is irreversible."}
                  </span>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`font-semibold px-4 py-2 rounded-lg transition-all text-xs cursor-pointer ${
                      confirmDelete 
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
                        : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {isDeleting 
                      ? "Purging Records..." 
                      : confirmDelete 
                        ? "Confirm Immediate Destruction" 
                        : "Self-Destruct Thread Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
