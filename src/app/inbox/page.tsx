"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TokenAccessForm from "../../components/inbox/TokenAccessForm";

export default function InboxLandingPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [isAccessing, setIsAccessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setIsAccessing(true);
    router.push(`/inbox/${tokenInput.trim()}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-6 py-12 overflow-hidden">
      <TokenAccessForm
        tokenInput={tokenInput}
        setTokenInput={setTokenInput}
        isAccessing={isAccessing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
