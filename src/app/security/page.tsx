import type { Metadata } from "next";
import SecurityClientView from "../../components/security/SecurityClientView";

export const metadata: Metadata = {
  title: "Security & Privacy Center | Postmarker",
  description: "Learn about Postmarker's zero-knowledge cryptography, SHA-256 token hashing, transient mail lifecycles, and IP origin masking.",
};

export default function SecurityPage() {
  return <SecurityClientView />;
}
