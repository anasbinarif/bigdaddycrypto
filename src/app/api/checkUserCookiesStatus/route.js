
import { connectToDb } from "../../../lib/utils";
import { User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {

    connectToDb();

    const { userID } = await req.json();

    const user = await User.findById(userID).exec();
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
        { CookiesPrompt: user.CookiesPrompt },
        { status: 200 }
    );
}
