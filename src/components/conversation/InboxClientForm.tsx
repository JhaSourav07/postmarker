"use client";

import React, { useState } from "react";
import InboxHeader from "./InboxHeader";
import ThreadSidebar from "./ThreadSidebar";
import MessageViewer from "./MessageViewer";
import { parseApiResponse } from "../../lib/utils";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  receivedAt: string;
}

interface InboxClientFormProps {
  thread: {
    threadId: string;
    tempEmail: string;
    expiresAt: string;
  };
  initialMessages: Message[];
  token: string;
}

export default function InboxClientForm({
  thread,
  initialMessages,
  token,
}: InboxClientFormProps) {
  // Own message state — starts with server-fetched data, updated live by IMAP sync
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(
    initialMessages[0]?.id || null
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const selectedMessage = messages.find((m) => m.id === selectedMsgId) || null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(thread.tempEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calls /api/inbox which triggers IMAP sync THEN reads updated messages from DB
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncError(null);
    try {
      const response = await fetch(`/api/inbox?token=${encodeURIComponent(token)}`);
      const data = await parseApiResponse(response);

      // Update messages with freshly synced data from the API
      const freshMessages: Message[] = data.messages.map((msg: any) => ({
        id: msg.id,
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        bodyHtml: msg.bodyHtml,
        bodyText: msg.bodyText,
        receivedAt: msg.receivedAt,
      }));

      setMessages(freshMessages);

      // Auto-select first message if nothing is selected or it was removed
      if (freshMessages.length > 0 && !freshMessages.find((m) => m.id === selectedMsgId)) {
        setSelectedMsgId(freshMessages[0].id);
      }
    } catch (err: any) {
      setSyncError(err.message || "Sync failed. Please try again.");
      console.error("Inbox sync error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex flex-col max-w-6xl w-full mx-auto border-x border-[rgba(255,255,255,0.08)]">
      {/* 1. Desktop Style Header Bar */}
      <InboxHeader
        tempEmail={thread.tempEmail}
        expiresAt={thread.expiresAt}
        isCopied={isCopied}
        isRefreshing={isRefreshing}
        onCopyEmail={handleCopyEmail}
        onRefresh={handleRefresh}
        token={token}
      />

      {/* Sync Error Banner */}
      {syncError && (
        <div className="w-full px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 font-mono flex items-center justify-between">
          <span>⚠ {syncError}</span>
          <button onClick={() => setSyncError(null)} className="text-red-400/60 hover:text-red-400 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Workspace Panel: Left Sidebar + Right Mail Reader */}
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-176px)] overflow-hidden">
        {/* Thread Sidebar */}
        <ThreadSidebar
          messages={messages}
          selectedMsgId={selectedMsgId}
          onSelectMsg={setSelectedMsgId}
        />

        {/* Message Viewer Content Panel */}
        <MessageViewer selectedMessage={selectedMessage} />
      </div>
    </div>
  );
}
