import { connectToDb } from "./utils";
import { User } from "./models";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import { clientPromise } from "./mongodb";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer, { createTransport } from "nodemailer";
import {NextResponse} from "next/server";

const login = async (credentials) => {
  try {
    await connectToDb();
    const user = await User.findOne({ email: { $regex: new RegExp(`^${credentials.email.toLowerCase()}$`, 'i') } });

    if (!user) throw new Error("Wrong email!");

    const isPasswordCorrect = await bcrypt.compare(
        credentials.password,
        user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong password!");

    if(!user.activated) throw new Error("Kindly Verify Your Account from the your email or Reregister!");

    return user;
  } catch (err) {
    console.log(err);
    throw err;
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
            const accessToken = await jwt.sign(
                { userId: user._id, email: user.email, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            return { ...user, accessToken };
          }
          return null;
        } catch (err) {
          console.log(err);
          // throw new Error("Failed to Login");s
          throw new Error(err.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 2 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'credentials') {
        // Additional checks can be performed here
        return true;
      } else if (account.provider === 'email') {
        // Additional checks can be performed for email provider
        console.log("checking 101", user, account, profile, email, credentials);
        return true;
      }
      return false;
    },
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
        token.pastUser = user_0.pastUser;
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
        session.user.pastUser = token.pastUser;
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
