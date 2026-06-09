"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "../components/home/Hero";
import ComposerCard from "../components/home/ComposerCard";
import Features from "../components/home/Features";
import Workflow from "../components/home/Workflow";
import SuccessModal from "../components/home/SuccessModal";

export default function Home() {
  // Composer Form State
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Success Modal State
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Handle Live Send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !message) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      setGeneratedToken(data.token);
      setShowSuccess(true);
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Copy Token
  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#F8F8F8] overflow-x-hidden flex flex-col items-center pb-12">
      {/* Main Container */}
      <div className="w-full max-w-6xl px-6 relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <Hero />

        {/* Composer Card Section */}
        <ComposerCard
          to={to}
          setTo={setTo}
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          isSending={isSending}
          onSend={handleSend}
        />

        {/* Editorial Feature Grid */}
        <Features />

        {/* Workflow Lifecycle Grid */}
        <Workflow />
      </div>

      {/* Success Modal overlay */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            isOpen={showSuccess}
            token={generatedToken}
            isCopied={isCopied}
            onCopy={handleCopyToken}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
