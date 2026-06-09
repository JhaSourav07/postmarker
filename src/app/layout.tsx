import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PostMarker | Secure Temporary Email Inboxes",
  description: "Instantly create secure, disposable temporary email inboxes to protect your privacy and test inbound emails with absolute security.",
  keywords: ["temporary email", "disposable email", "spam protection", "developer tools", "inbox testing"],
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
      <body className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
        {/* Sleek Header */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">
                P
              </div>
              <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                PostMarker
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-neutral-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/create" className="hover:text-white transition-colors">Create Inbox</a>
              <a href="/inbox/reply-simulator" className="hover:text-white transition-colors">Simulator</a>
            </nav>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="border-t border-neutral-900 bg-neutral-950 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} PostMarker. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Secure. Temporary. Ephemeral.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

