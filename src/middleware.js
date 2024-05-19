// // middleware.js
// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
//
// export default withAuth(
//     async function middleware(req) {
//         const token = req.nextauth.token;
//
//         // Log user access
//         console.log("Middleware - token:", token);
//
//         if (req.nextUrl.pathname.startsWith("/admin")) {
//             if (!token || !token.isAdmin) {
//                 return NextResponse.redirect(new URL("/", req.url));
//             }
//         }
//     },
//     {
//         callbacks: {
//             authorized: ({ token }) => {
//                 // Only allow if user is authenticated
//                 return !!token;
//             },
//         },
//     }
// );
//
// export const config = {
//     matcher: ["/", "/admin", "/faq", "/media", "/assetsGraph"],
// };


// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';

// Internationalization middleware
const intlMiddleware = createMiddleware({
    locales: ['en', 'de'],
    defaultLocale: 'en'
});

export default async function middleware(req) {
    // Run the internationalization middleware
    const intlResponse = intlMiddleware(req);
    if (intlResponse) {
        return intlResponse;
    }

    // Log user access (debugging purpose)
    console.log("Middleware - before auth");

    // Authentication handling
    const authMiddleware = withAuth(
        async function middleware(req) {
            const token = req.nextauth.token;

            // Log user access
            console.log("Middleware - token:", token);

            if (req.nextUrl.pathname.startsWith("/admin")) {
                if (!token || !token.isAdmin) {
                    return NextResponse.redirect(new URL("/", req.url));
                }
            }
            return NextResponse.next();
        },
        {
            callbacks: {
                authorized: ({ token }) => {
                    // Only allow if user is authenticated
                    return !!token;
                },
            },
        }
    );

    return authMiddleware(req);
}

// Combine matchers from both middlewares
export const config = {
    matcher: [
        '/',
        '/(de|en)/:path*',
        '/admin',
        '/faq',
        '/media',
        '/assetsGraph'
    ],
};
