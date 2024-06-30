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
          // console.log(path);
          if (
            path === "/en/shared" ||
            path === "/de/shared" ||
            path === "/en/policy/datenschutz" ||
            path === "/de/policy/datenschutz" ||
            path === "/en/policy/widerrufsbelehrung" ||
            path === "/de/policy/widerrufsbelehrung" ||
            path === "/en/policy/agb" ||
            path === "/de/policy/agb" ||
            path === "/en/policy/impressum" ||
            path === "/de/policy/impressum"
          ) {
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
