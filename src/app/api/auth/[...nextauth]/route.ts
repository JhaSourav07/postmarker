import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const adminUsername = process.env.ADMIN_GITHUB_USERNAME;
      
      if (!adminUsername) {
        console.error("ADMIN_GITHUB_USERNAME is not set in environment variables.");
        return false;
      }

      // Check if the logging in user's GitHub username matches the admin
      // profile.login is provided by the GitHub OAuth scope
      const githubProfile = profile as any;
      if (githubProfile?.login && githubProfile.login.toLowerCase() === adminUsername.toLowerCase()) {
        return true;
      }
      
      console.warn(`Unauthorized login attempt by GitHub user: ${githubProfile?.login}`);
      return false; // Reject anyone else
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin", // Redirect to admin page for sign in
    error: "/admin",  // Redirect back to admin on error
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
