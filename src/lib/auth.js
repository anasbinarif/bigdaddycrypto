// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDb } from "./utils";
// import { User } from "./models";
// import bcrypt from "bcryptjs";
// import { authConfig } from "./auth.config";

// const login = async (credentials) => {
//     try {
//         connectToDb();
//         const user = await User.findOne({ email: credentials.username });
//         console.log("userrrrrr", user, credentials);

//         if (!user) throw new Error("Wrong email!");

//         const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//         );

//         if (!isPasswordCorrect) throw new Error("Wrong password!");

//         return user;
//     } catch (err) {
//         console.log(err);
//         throw new Error("Failed to login!");
//     }
// };

// export const {
//     handlers: { GET, POST },
//     auth,
//     signIn,
//     signOut,
// } = NextAuth({
//     ...authConfig,
//     providers: [
//         GitHub({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),
//         CredentialsProvider({
//             name: 'Credentials',
//             async authorize(credentials) {
//                 try {
//                     const user = await login(credentials);
//                     return user;
//                 } catch (err) {
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async signIn({ user, account, profile }) {
//             if (account.provider === "github") {
//                 connectToDb();
//                 try {
//                     const user = await User.findOne({ email: profile.email });

//                     if (!user) {
//                         const newUser = new User({
//                             username: profile.login,
//                             email: profile.email,
//                             image: profile.avatar_url,
//                         });

//                         await newUser.save();
//                     }
//                 } catch (err) {
//                     console.log(err);
//                     return false;
//                 }
//             }
//             return true;
//         },
//         ...authConfig.callbacks,
//     },
// });


import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    throw new Error("Failed to Login");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 hours in seconds
    },
    jwt: {
        secret: "jnjcndajcndicncsdjn8ncdncdc=", // Ensure you have a JWT_SECRET in your environment variables!
        maxAge: 2 * 60 * 60, // 2 hours in seconds
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
                token.username = user.username;
                token.email = user.email;
                token.pastUserCheck = user.pastUserCheck;
                console.log("calling again token");
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.pastUserCheck = token.pastUserCheck;
                console.log("calling again session");
            }
            return session;
        },
    },
};