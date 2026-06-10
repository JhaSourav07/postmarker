import type { Metadata } from "next";
import StatusDashboardClient from "../../components/status/StatusDashboardClient";

export const metadata: Metadata = {
  title: "System Status | Postmarker",
  description: "Check the live status and operational health of Postmarker databases, SMTP relays, and IMAP servers.",
};

export default function StatusPage() {
  return <StatusDashboardClient />;
}
