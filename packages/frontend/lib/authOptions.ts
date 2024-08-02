import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateJWT } from "@/lib/authHelpers";
import exp from "constants";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
    CredentialsProvider({
      name: "Dynamic",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token as string;
        if (!token) {
          throw new Error("Token is required");
        }
        const jwtPayload = await validateJWT(token);
        if (jwtPayload) {
          return {
            id: jwtPayload.sub || "",
            name: jwtPayload.name || "",
            email: jwtPayload.email || "",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userRole = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.userRole = token.userRole;
        session.user = {
          ...session.user,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }
      return session;
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
