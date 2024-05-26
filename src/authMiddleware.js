// authMiddleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

function withAuthMiddleware(middleware) {
    const authMiddleware = withAuth(
        async (req, event, response) => {
            const token = req.nextauth.token;

            // Log user access
            console.log("Middleware - token:", token);
            console.log("Middleware - nextUrl:", req.nextUrl.pathname);

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
                authorized: ({ token }) => !!token,
            },
        }
    );

    return authMiddleware;
}

export { withAuthMiddleware };
