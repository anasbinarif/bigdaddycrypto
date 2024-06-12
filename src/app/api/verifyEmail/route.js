import { connectToDb } from "../../../lib/utils";
import { User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function GET(req) {
    // const { token } = req.query;
    const { searchParams } = req.nextUrl;
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    try {
        await connectToDb();

        const user = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
        }

        user.activated = true;
        // user.verificationToken = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: 'Email verified successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, message: 'Error verifying email' }, { status: 500 });
    }
}
