import { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import { prisma } from "@/lib/prisma";

const providers: NextAuthOptions["providers"] = [];

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      authorization: {
        params: {
          scope: "openid profile email w_member_social",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.provider === "linkedin") {
        token.accessToken = account.access_token;
        token.linkedinId = account.providerAccountId;

        try {
          await prisma.linkedProfile.upsert({
            where: { linkedinId: account.providerAccountId },
            update: {
              name: token.name || "",
              email: token.email || "",
              profilePicUrl: token.picture || "",
              accessToken: account.access_token || "",
              tokenExpiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
            },
            create: {
              linkedinId: account.providerAccountId,
              name: token.name || "",
              email: token.email || "",
              profilePicUrl: token.picture || "",
              accessToken: account.access_token || "",
              tokenExpiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
            },
          });
        } catch (error) {
          console.error("Failed to upsert LinkedIn profile in database:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const s = session as { accessToken?: unknown; linkedinId?: unknown };
        s.accessToken = token.accessToken;
        s.linkedinId = token.linkedinId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "temp_secret_for_vercel_build",
  debug: true,
};

// Vercel redeploy trigger comment
