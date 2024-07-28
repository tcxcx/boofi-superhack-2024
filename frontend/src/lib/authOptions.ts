import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateJWT } from "@/lib/authHelpers";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.NEXT_PUBLIC_WLD_APP_ID,
      clientSecret: process.env.NEXT_WLD_CLIENT_SECRET,
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
            sessionLevel: 1,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userRole = "admin";
      }

      if (account && account.provider === "worldcoin") {
        // WorldCoin device verification level gives is 2 sign in level - this could be changed in the future to use Orb instead
        token.sessionLevel = 2;
        token.worldcoinSub = user.id;
        if (typeof account.access_token === "string") {
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.userRole = token.userRole;
      session.sessionLevel = token.sessionLevel;
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        name: token.name,
        email: token.email,
        image: token.picture,
        worldcoinSub: token.worldcoinSub,
      };
      return session;
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
