import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminLogin from "../../components/admin/AdminLogin";
import AdminDashboardClient from "../../components/admin/AdminDashboardClient";
import { connectToDatabase } from "../../lib/mongodb";
import Feedback from "../../models/Feedback";

export default async function AdminPage() {
  // Check auth session
  const session = await getServerSession(authOptions);

  // If no valid session, show login component
  if (!session) {
    return <AdminLogin />;
  }

  // If valid, fetch data server-side
  await connectToDatabase();
  const rawFeedbacks = await Feedback.find().sort({ createdAt: -1 });

  // Serialize to plain JS objects to render safely in React Client Component
  const feedbacks: any[] = rawFeedbacks.map((fb) => ({
    id: fb._id.toString(),
    type: fb.type,
    name: fb.name || "Anonymous",
    email: fb.email || "No email provided",
    message: fb.message,
    status: fb.status,
    createdAt: fb.createdAt.toLocaleString(),
  }));

  const adminName = session.user?.name || session.user?.email || "Admin";

  return <AdminDashboardClient initialFeedbacks={feedbacks} adminName={adminName} />;
}
