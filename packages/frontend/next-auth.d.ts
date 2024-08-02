import "next-auth";
import "next-auth/jwt";
import "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    userRole?: "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userRole?: "admin";
  }
}

declare module "jsonwebtoken";
