import { notFound } from "next/navigation";
import ReplySimulatorClient from "../../../components/conversation/ReplySimulatorClient";

/**
 * This page is intentionally restricted to the development environment.
 * It exposes an unauthenticated endpoint that can inject messages into any
 * thread — exposing it in production would be a serious security vulnerability.
 */
export default function ReplySimulatorPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center">
      <ReplySimulatorClient />
    </div>
  );
}
