import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const { email } = await req.json();
        console.log("Received email:", email);  // Logging the email to ensure it is received

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const verifyUrl = `${process.env.NEXT_PUBLIC_URI}/verify?token=${token}&email=${email}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Email Verification",
            text: `Please use the following link to verify your email: ${verifyUrl}`,
            html: verificationHtml(verifyUrl),
        };

        console.log("Sending mail with options:", mailOptions);  // Logging the mail options

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Verification link sent' }, { status: 200 });
    } catch (error) {
        console.error("Error occurred while sending verification email:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function verificationHtml(verifyUrl) {
    return `
        <body style="background: #f9f9f9;">
            <table width="100%" border="0" cellspacing="20" cellpadding="0"
                style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                <tr>
                    <td align="center"
                        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
                        Email Verification
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                                    <a href="${verifyUrl}"
                                        target="_blank"
                                        style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid blue; display: inline-block; font-weight: bold;">
                                        Verify Email
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