import { User } from "../../../lib/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { id, key } = await req.json();

  console.log(id, key, process.env.JWT_SECRET);

  try {
    const user = await User.findById(id);
    if (!user?._doc?.activated) throw new Error("User does not exist");

    const decodedUser = await jwt.verify(key, process.env.JWT_SECRET);
    console.log(decodedUser);

    if (decodedUser !== user._doc.username) throw new Error("User invalid");

    return NextResponse.json({ message: "authenticated" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Error verifying user ${err.message}` },
      { status: 500 }
    );
  }
}
