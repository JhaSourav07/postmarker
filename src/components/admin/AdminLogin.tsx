"use client";

import { signIn } from "next-auth/react";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md bg-[#111418]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#1A1D24] rounded-2xl mx-auto flex items-center justify-center mb-6 border border-[rgba(255,255,255,0.06)]">
          <Shield className="w-8 h-8 text-[#F8F8F8]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Admin Portal</h1>
        <p className="text-[#A2A8B3] text-sm mb-8">
          Sign in with your authorized GitHub account to access the feedback dashboard.
        </p>
        
        <button
          onClick={() => signIn("github")}
          className="w-full bg-[#F8F8F8] text-[#0B0D10] font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
        >
          <Shield className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="mt-6 text-xs text-rose-500/80 bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
          Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
