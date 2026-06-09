"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(
    initialMessages[0]?.id || null
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedMessage = initialMessages.find((m) => m.id === selectedMsgId);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(thread.tempEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex flex-col md:flex-row max-w-6xl w-full mx-auto border-x border-[rgba(255,255,255,0.08)]">
      {/* Sidebar / Message List */}
      <div className="w-full md:w-80 border-r border-[rgba(255,255,255,0.08)] flex flex-col bg-[#111418]/20">
        {/* Inbox Info Headers */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="text-xs text-[#A2A8B3] mb-1">Temporary Address</div>
          <div className="font-mono text-sm font-semibold mb-3 select-all truncate text-neutral-100">
            {thread.tempEmail}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyEmail}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-[#111418] hover:bg-[#161A20] border border-[rgba(255,255,255,0.08)] transition-all font-medium cursor-pointer"
            >
              {isCopied ? "Copied" : "Copy Address"}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-lg bg-[#111418] hover:bg-[#161A20] border border-[rgba(255,255,255,0.08)] transition-all text-xs font-medium disabled:opacity-55 cursor-pointer"
            >
              {isRefreshing ? "..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Message Listing */}
        <div className="flex-grow overflow-y-auto divide-y divide-[rgba(255,255,255,0.06)]">
          {initialMessages.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#A2A8B3]">
              Waiting for replies...
            </div>
          ) : (
            initialMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMsgId(msg.id)}
                className={`w-full p-5 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  selectedMsgId === msg.id
                    ? "bg-[#111418]/60 border-l-2 border-neutral-300"
                    : "hover:bg-[#111418]/25"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-semibold truncate text-[#F8F8F8] max-w-[70%]">
                    {msg.from.split("<")[0] || msg.from}
                  </span>
                  <span className="text-[10px] text-[#A2A8B3]">
                    {formatTime(msg.receivedAt)}
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-200 truncate">
                  {msg.subject}
                </div>
                <div className="text-[11px] text-[#A2A8B3] truncate">
                  {msg.bodyText}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Mail Viewer Panel */}
      <div className="flex-grow flex flex-col bg-[#0B0D10]">
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col h-full"
            >
              {/* Message Header */}
              <div className="p-8 border-b border-[rgba(255,255,255,0.08)] flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-xl font-medium text-[#F8F8F8]">
                    {selectedMessage.subject}
                  </h1>
                  <span className="text-xs text-[#A2A8B3] whitespace-nowrap mt-1">
                    {new Date(selectedMessage.receivedAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-[#A2A8B3]">
                  <span>From: </span>
                  <strong className="text-neutral-300">
                    {selectedMessage.from}
                  </strong>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="flex-grow p-8 overflow-y-auto">
                {selectedMessage.bodyHtml ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedMessage.bodyHtml,
                    }}
                    className="prose prose-invert max-w-none text-sm leading-relaxed text-neutral-300"
                  />
                ) : (
                  <pre className="font-mono text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap">
                    {selectedMessage.bodyText}
                  </pre>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-center p-12 text-[#A2A8B3] text-sm">
              Select an email to view its content.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
