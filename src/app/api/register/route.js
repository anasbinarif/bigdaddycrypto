import { connectToDb } from "../../../lib/utils";
import bcrypt from "bcryptjs";
import { User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userName, pin, userEmail } = await req.json();
  try {
    await connectToDb();

    const getUser = await User.findOne({ email: userEmail });
    if (getUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 500 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pin, salt);
    const newUser = new User({
      username: userName,
      email: userEmail,
      password: hashedPassword,
    });

    await newUser?.save();
    console.log("saved to db");
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error occur while registering the user" },
      { status: 500 }
    );
  }
}
