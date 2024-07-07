import { DateTime } from "luxon";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { User } from "../../../lib/models";
import mongoose from "mongoose";

export async function POST(req) {
  const tokenVerificationResponse = await verifyToken(req);
  if (tokenVerificationResponse) {
    return tokenVerificationResponse;
  }

  try {
    const { userID } = await req.json();
    // useerID = new mongoose.Types.ObjectId(userID);

    // console.log(userID);
    const user = await User.findOne({ _id: userID }).then((res) => res?._doc);
    console.log(user);
    if (!user) throw new Error("Invalid user");

    if (!user?.CookiesPrompt) throw new Error("Cookies not accepted");

    return NextResponse.json({ message: "Cookies accepted" }, { status: 200 });
  } catch (e) {
    console.log("Error during cookie check:", e);
    return NextResponse.json(
      { message: "Error occurred while checking status or cookies unaccepted" },
      { status: 500 }
    );
  }
}
