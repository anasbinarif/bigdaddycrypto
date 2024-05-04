import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDb } from "@/lib/utils";
import { User } from "@/lib/models";

const login = async (credentials) => {
    try {
        connectToDb()
        const user = await User.findOne({ email: credentials.email });
        console.log("userrrrrr", user, credentials);

        if (!user) throw new Error("Wrong email!");

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) throw new Error("Wrong password!");

        return user;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to login!");
    }
};
export const authOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    throw new Error("Failed to Login")
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session;
        },
        authorized({ auth, request }) {
            const user = auth?.user;
            const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
            const isOnHomePage = request.nextUrl?.pathname.startsWith("/");
            const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");


            if (isOnAdminPanel && !user?.isAdmin) {
                return false;
            }


            if (isOnHomePage && !user) {
                return false;
            }


            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/", request.nextUrl));
            }

            return true
        },
    }
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
