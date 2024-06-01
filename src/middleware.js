// middleware.js
import { NextResponse } from "next/server";
import { chain } from "./chain";
import { withIntlMiddleware } from "./intlMiddleware";
import { withAuthMiddleware } from "./authMiddleware";

export default function middleware(req, event) {
  const middlewareChain = chain([withAuthMiddleware, withIntlMiddleware]);

  const response = NextResponse.next();
  return middlewareChain(req, event, response);
}

// Combine matchers from both middlewares
export const config = {
  matcher: [
    "/",
    "/(de|en)/:path*",
    "/admin",
    "/faq",
    "/media",
    "/assetsGraph",
    "/pricingPlans",
    "/portfolioOverview",
    // "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
  ],
};
