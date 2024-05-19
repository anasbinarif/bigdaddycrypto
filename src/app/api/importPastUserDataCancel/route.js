import { User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userID } = await req.json();

    const user = await User.findById(userID).exec();
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.pastUserCheck = true;
    await user.save();

    return NextResponse.json({ message: "cant import past user data anymore" }, { status: 200 });
}