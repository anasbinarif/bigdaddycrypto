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

  const { token, email, newPassword } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return NextResponse.json(
        { error: "Invalid token or email" },
        { status: 400 }
      );
    }

    await connectToDb();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { error: "Password reset successfully" },
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
