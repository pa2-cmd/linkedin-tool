import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

const providers: NextAuthOptions["providers"] = [];

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push({
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    // Do NOT set idToken or issuer — avoids all OIDC iss validation
    checks: ["state"],
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      url: "https://www.linkedin.com/oauth/v2/authorization",
      params: {
        scope: "openid profile email w_member_social",
        response_type: "code",
      },
    },
    token: {
      url: "https://www.linkedin.com/oauth/v2/accessToken",
    },
    userinfo: {
      url: "https://api.linkedin.com/v2/userinfo",
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  });
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
