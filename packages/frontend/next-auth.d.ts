import "next-auth";
import "next-auth/jwt";
import "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    userRole?: "admin";
    sessionLevel?: number;
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      worldcoinSub?: string;
      verificationStatus?: {
        worldIdVerified: boolean;
        plaidConnected?: boolean;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userRole?: "admin";
    sessionLevel?: number;
    worldcoinSub?: string;
    accessToken?: string;
    verificationStatus?: {
      worldIdVerified: boolean;
      plaidConnected?: boolean;
    };
  }
}

declare module "jsonwebtoken";
