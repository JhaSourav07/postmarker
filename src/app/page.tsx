import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-neutral-950 font-sans px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400 mb-6 animate-pulse">
          <span>✨ PostMarker MVP is Live</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8">
          <span className="block text-white">Ephemeral Email.</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Absolute Privacy.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-400 leading-relaxed mb-12">
          Instantly provision secure, disposable email inboxes on demand. Protect
          your real email address from spam, trackers, and third-party database breaches.
          All mailboxes auto-destruct in 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:translate-y-[-2px] text-center"
          >
            Create Temporary Inbox
          </Link>
          <Link
            href="/inbox/reply-simulator"
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-semibold rounded-xl transition-all hover:translate-y-[-2px] text-center"
          >
            Open Mail Simulator
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-neutral-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
          Designed for privacy, built for reliability
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xl mb-6">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-white mb-3">XSS Protection</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every incoming email passes through a high-security validation filter
              that strips unsafe HTML tags, scripts, and trackers, making inspection 100% safe.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xl mb-6">
              ⏱️
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Automatic Expiration</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Equipped with database-level TTL indices. Your temporary inbox, messages,
              and connection references are purged forever after 24 hours.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold text-xl mb-6">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Developer Simulator</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Test message ingestion immediately using our built-in simulator. Send
              mock emails to your temporary address and see them appear in real-time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

