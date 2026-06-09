"use client";

import React from "react";
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

interface ThreadSidebarProps {
  messages: Message[];
  selectedMsgId: string | null;
  onSelectMsg: (id: string) => void;
}

export default function ThreadSidebar({
  messages,
  selectedMsgId,
  onSelectMsg,
}: ThreadSidebarProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full md:w-80 border-r border-[rgba(255,255,255,0.08)] flex flex-col bg-[#111418]/20 h-full overflow-hidden select-none">
      {/* Sidebar Section Header */}
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between bg-[#161A20]/20">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A2A8B3]">
          Inbound Messages
        </span>
        <span className="text-[10px] font-mono font-bold text-neutral-400 bg-[#161A20] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.04)]">
          {messages.length} total
        </span>
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <span className="text-xs text-[#A2A8B3] leading-relaxed">
              Waiting for replies...
            </span>
            <span className="text-[10px] text-neutral-600 font-mono mt-2 uppercase tracking-widest">
              listening_imap
            </span>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="divide-y divide-[rgba(255,255,255,0.06)]"
          >
            {messages.map((msg) => (
              <motion.button
                key={msg.id}
                variants={{
                  hidden: { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectMsg(msg.id)}
                className={`w-full p-5 text-left flex flex-col gap-1.5 transition-all cursor-pointer border-l-2 ${
                  selectedMsgId === msg.id
                    ? "bg-[#111418]/60 border-neutral-300"
                    : "bg-transparent border-transparent hover:bg-[#111418]/25"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-semibold truncate text-[#F8F8F8] max-w-[70%]">
                    {msg.from.split("<")[0].trim() || msg.from}
                  </span>
                  <span className="text-[9px] font-mono text-[#A2A8B3]/80">
                    {formatTime(msg.receivedAt)}
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-200 truncate">
                  {msg.subject}
                </div>
                <div className="text-[11px] text-[#A2A8B3] truncate font-light leading-relaxed">
                  {msg.bodyText}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
