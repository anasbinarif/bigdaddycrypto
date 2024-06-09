import { connectToDb } from "../lib/utils";
import { User } from "../lib/models";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const login = async (credentials) => {
  try {
    connectToDb();
    const user = await User.findOne({ email: credentials.email });
    // console.log("userrrrrr", user, credentials);

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
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          if (user) {
            console.log("user found 1: ", user);
            const accessToken = await jwt.sign(
              { userId: user._id, email: user.email, isAdmin: user.isAdmin },
              process.env.JWT_SECRET,
              { expiresIn: "2h" }
            );
            console.log("user found 2: ", user);

            return { ...user, accessToken };
          }
          return null;
        } catch (err) {
          console.log(err);
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
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 2 * 60 * 60, // 2 hours in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const user_0 = user._doc;
        token.id = user_0._id;
        token.isAdmin = user_0.isAdmin;
        token.username = user_0.username;
        token.email = user_0.email;
        token.pastUserCheck = user_0.pastUserCheck;
        token.subscribed = user_0.subscribed;
        token.accessToken = user.accessToken;
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
        session.user.subscribed = token.subscribed;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export const verifyToken = async (req) => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Access Token Required" }),
      { status: 401 }
    );
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return null;
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: "Invalid Token" }), {
      status: 403,
    });
  }
};
