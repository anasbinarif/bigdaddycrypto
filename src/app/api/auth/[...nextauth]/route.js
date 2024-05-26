import NextAuth from "next-auth";
import {authOptions} from "../../../../lib/auth";

// const login = async (credentials) => {
//   try {
//     connectToDb();
//     const user = await User.findOne({ email: credentials.email });
//     // console.log("userrrrrr", user, credentials);
//
//     if (!user) throw new Error("Wrong email!");
//
//     const isPasswordCorrect = await bcrypt.compare(
//       credentials.password,
//       user.password
//     );
//
//     if (!isPasswordCorrect) throw new Error("Wrong password!");
//
//     return user;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to login!");
//   }
// };
// export const authOptions = {
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},
//       async authorize(credentials) {
//         try {
//           const user = await login(credentials);
//           return user;
//         } catch (err) {
//           throw new Error("Failed to Login");
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60, // 2 hours in seconds
//   },
//   jwt: {
//     secret: "jnjcndajcndicncsdjn8ncdncdc=", // Ensure you have a JWT_SECRET in your environment variables!
//     maxAge: 2 * 60 * 60, // 2 hours in seconds
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.isAdmin = user.isAdmin;
//         token.username = user.username;
//         token.email = user.email;
//         token.pastUserCheck = user.pastUserCheck;
//         console.log("calling again token");
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.isAdmin = token.isAdmin;
//         session.user.username = token.username;
//         session.user.email = token.email;
//         session.user.pastUserCheck = token.pastUserCheck;
//         console.log("calling again session");
//       }
//       return session;
//     },
//   },
// };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
