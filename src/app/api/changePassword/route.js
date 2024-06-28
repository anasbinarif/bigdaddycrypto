import { connectToDb } from "../../../lib/utils";
import { User } from "../../../lib/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function POST(req, res) {
    const tokenVerificationResponse = await verifyToken(req);
    if (tokenVerificationResponse) {
        return tokenVerificationResponse;
    }

    if (req.method !== "POST") {
        return NextResponse.json({ error: "Request Not Allowed" }, { status: 405 });
    }

    const { email, newPassword, oldPassword } = await req.json();

    try {
        await connectToDb();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect old password" }, { status: 400 });
        }

        // Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
