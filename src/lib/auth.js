import { connectToDb } from "./utils";
import { User } from "./models";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "./mongodb";  // Assuming you have a mongodb.js that exports a client promise

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer, { createTransport } from "nodemailer";
import {NextResponse} from "next/server";

const login = async (credentials) => {
  try {
    await connectToDb();
    const user = await User.findOne({ email: credentials.email });

    if (!user) throw new Error("Wrong email!");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong password!");

    if(!user.activated) throw new Error("Kindly Verify Your Account from the your email!");

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const sendVerificationRequest = async (params) => {
  const { identifier, url, provider, theme, token } = params
  const { host } = new URL(url)
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme, token, identifier}),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
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
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
      maxAge: 60 * 30,
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
      return false; // Return false to disallow sign in
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

const text = ({ url, site }) => `Sign in to ${site}\n${url}\n\n`;
function html(params) {
  const { url, host, theme, token, identifier } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = theme.brandColor || "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }

  return `
        <body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${process.env.NEXT_PUBLIC_URI}/verify?token=${token}&email=${identifier}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid blue; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

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
