"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InboxHeader from "./InboxHeader";
import ThreadSidebar from "./ThreadSidebar";
import MessageViewer from "./MessageViewer";

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

  const selectedMessage = initialMessages.find((m) => m.id === selectedMsgId) || null;

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
      />

      {/* 2. Workspace Panel: Left Sidebar + Right Mail Reader */}
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-176px)] overflow-hidden">
        {/* Thread Sidebar */}
        <ThreadSidebar
          messages={initialMessages}
          selectedMsgId={selectedMsgId}
          onSelectMsg={setSelectedMsgId}
        />

        {/* Message Viewer Content Panel */}
        <MessageViewer selectedMessage={selectedMessage} />
      </div>
    </div>
  );
}
