import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postmarker | Email without identity",
  description: "Send anonymous emails and access replies using a secret token.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#0B0D10] text-[#F8F8F8] flex flex-col font-sans selection:bg-[#F8F8F8]/10 selection:text-[#F8F8F8]">
        {/* Minimalist Navbar */}
        <header className="w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0B0D10]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg tracking-tight hover:text-[#F8F8F8]/85 transition-colors">
              Postmarker
            </a>
            <a 
              href="/inbox" 
              className="text-sm font-medium text-[#A2A8B3] hover:text-[#F8F8F8] transition-colors"
            >
              Inbox
            </a>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="w-full border-t border-[rgba(255,255,255,0.08)] bg-[#0B0D10] py-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2A8B3]">
            <div className="font-semibold text-[#F8F8F8]">
              Postmarker
            </div>
            <div>
              Email without identity.
            </div>
          </div>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
