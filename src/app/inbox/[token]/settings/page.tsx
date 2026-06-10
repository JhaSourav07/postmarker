import { connectToDatabase } from "../../../../lib/mongodb";
import { hashToken } from "../../../../lib/crypto";
import Thread from "../../../../models/Thread";
import Message from "../../../../models/Message";
import ThreadSettingsClient from "../../../../components/conversation/ThreadSettingsClient";

interface SettingsPageProps {
  params: Promise<{ token: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { token } = await params;

  await connectToDatabase();
  const hashed = hashToken(token);

  // Find active, unexpired thread matching the hashed token
  const thread = await Thread.findOne({
    hashedToken: hashed,
    expiresAt: { $gt: new Date() },
  });

  if (!thread) {
    return (
      <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-3">
            Settings Unavailable
          </h2>
          <p className="text-sm text-[#A2A8B3] leading-relaxed mb-6">
            This temporary inbox is no longer active. All associated email
            messages and tokens have been permanently purged from our servers.
          </p>
          <a
            href="/"
            className="inline-block bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors text-sm"
          >
            Create New Inbox
          </a>
        </div>
      </div>
    );
  }

  // Retrieve messages for this thread, newest first
  const messages = await Message.find({ threadId: thread.threadId }).sort({
    receivedAt: -1,
  });

  // Serialize Mongoose docs to plain JS objects for Server-to-Client component transfer
  const serializedThread = {
    threadId: thread.threadId,
    tempEmail: thread.tempEmail,
    expiresAt: thread.expiresAt.toISOString(),
    createdAt: thread.createdAt.toISOString(),
  };

  const serializedMessages = messages.map((msg) => ({
    id: msg._id.toString(),
    from: msg.from,
    to: msg.to,
    subject: msg.subject,
    bodyHtml: msg.bodyHtml,
    bodyText: msg.bodyText,
    receivedAt: msg.receivedAt.toISOString(),
  }));

  return (
    <ThreadSettingsClient
      thread={serializedThread}
      messages={serializedMessages}
      token={token}
    />
  );
}
