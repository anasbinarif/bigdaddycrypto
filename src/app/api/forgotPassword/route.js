// pages/api/forgot-password.js
import { connectToDb } from "../../../lib/utils";
import { User } from "../../../lib/models";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { email } = await req.json();

  try {
    await connectToDb();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_URI}/resetPassword?token=${token}&email=${email}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password: ${resetUrl}`,
      html: html(resetUrl),
    });

    return NextResponse.json({ message: "Reset link sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function html(resetUrl) {
  return `
        <body style="background: #f9f9f9;">
            <table width="100%" border="0" cellspacing="20" cellpadding="0"
                style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                <tr>
                    <td align="center"
                        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
                        Password Reset Request
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                                    <a href="${resetUrl}"
                                        target="_blank"
                                        style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid blue; display: inline-block; font-weight: bold;">
                                        Reset Password
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center"
                        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
                        If you did not request this email, you can safely ignore it.
                    </td>
                </tr>
            </table>
        </body>
    `;
}
