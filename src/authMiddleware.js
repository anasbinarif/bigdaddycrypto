// authMiddleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function withAuthMiddleware(middleware) {
  const authMiddleware = withAuth(
    async (req, event, response) => {
      const token = req.nextauth.token;

      const path = req.nextUrl.pathname;
      const adminRegex = /^\/(en|de)\/admin/;
      const assetsGraphRegex = /^\/(en|de)\/assetsGraph/;

      if (adminRegex.test(path)) {
        if (!token || !token.isAdmin) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      if (assetsGraphRegex.test(path)) {
        if (!token || !token.subscribed) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      return middleware(req, event, response);
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const path = req.nextUrl.pathname;
          if (path === "/en/shared" || path === "/de/shared") {
            return true;
          }
          return !!token;
        },
      },
    }
  );

  return authMiddleware;
}

export { withAuthMiddleware };
