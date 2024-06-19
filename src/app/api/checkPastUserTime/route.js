import { connectToDb } from "../../../lib/utils";
import { User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userID } = await req.json();
    const baseURL = process.env.NEXT_PUBLIC_URI;

    try {
        await connectToDb();

        const user = await User.findById(userID).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.pastUserAccessTime || !user.pastUser) {
            return NextResponse.json({ message: "User does not have past user" }, { status: 200 });
        }

        const now = new Date();
        const pastUserAccessTime = new Date(user.pastUserAccessTime);
        const timeDifference = now - pastUserAccessTime;

        const hoursPassed = timeDifference / (1000 * 60 * 60);
        if (hoursPassed > 48) {
            // user.pastUserCheck = false;
            // user.pastUserCheckTime = null;
            // await user.save();
            const response = await fetch(`${baseURL}/api/getUserSubscriptionPlan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userID }),
            });
            const userPlan = await response.json();
            console.log("what scene g", userPlan);
            if (userPlan?.plan == "free") {
                
            }
            return NextResponse.json({ message: "Past user access has expired", hoursRemaining: 0 }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Past user access is still valid", hoursRemaining: 48 - hoursPassed }, { status: 200 });
        }
    } catch (e) {
        console.log("Error during time check:", e);
        return NextResponse.json({ message: "Error occurred while checking the time" }, { status: 500 });
    }
}
