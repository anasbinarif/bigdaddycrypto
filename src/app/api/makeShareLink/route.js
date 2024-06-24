import { User } from "../../../lib/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { id } = await req.json();

  console.log(id, process.env.JWT_SECRET);

  try {
    const user = await User.findById(id);
    if (!user?._doc?.activated) throw new Error("User does not exist");

    console.log(user._doc);
    const encoding = await jwt.sign(user._doc.username, process.env.JWT_SECRET);
    console.log(encoding);

    return NextResponse.json({ data: encoding }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Error generating link ${err.message}` },
      { status: 500 }
    );
  }
}
