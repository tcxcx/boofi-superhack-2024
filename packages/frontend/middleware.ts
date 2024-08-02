import { NextFetchEvent } from "next/server";
import createMiddleware from "next-intl/middleware";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

// Define the i18n middleware
const i18nMiddleware = createMiddleware({
  locales: ["en", "es", "pt"],
  defaultLocale: "en",
});

// Define the NextAuth middleware
const authMiddleware = withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
      }
      return !!token;
    },
  },
});

// Combined middleware function
export default async function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent
) {
  // Apply the i18n middleware
  const i18nResponse = i18nMiddleware(req);
  if (i18nResponse) return i18nResponse;

  // Apply the NextAuth middleware
  const authResponse = await authMiddleware(req, event);
  return authResponse;
}

// Define the matcher for both middlewares
export const config = {
  matcher: ["/", "/(es|en|pt)/:path*", "/admin", "/me"],
};
