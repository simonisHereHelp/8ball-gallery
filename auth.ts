// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const {
  handlers,
  auth, // <-- we’ll use this on the server to read the session
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // optional: add Drive scope if you haven't already
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.file",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
         const enrichedToken = token as JWT & { accessToken?: string };
      // On first login, grab provider access token
      if (account?.access_token) {
        enrichedToken.accessToken= account.access_token;
      }
      return enrichedToken;
    },
    async session({ session, token }) {
      const enrichedSession = session as Session & { accessToken?: string };
      const enrichedToken = token as JWT & { accessToken?: string };
      // Expose accessToken to the client + server
      if (enrichedToken.accessToken) {
        enrichedSession.accessToken = enrichedToken.accessToken;
      }
      return enrichedSession;
    },
  },
});

export { auth };

// keep your existing style for the auth route
export const { GET, POST } = handlers;
