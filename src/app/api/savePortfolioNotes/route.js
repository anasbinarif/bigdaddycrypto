import { connectToDb } from "../../../lib/utils";
import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { msg, userId } = await req.json();

    try {
        await connectToDb();

        const userPortfolio = await UserPortfolio.findOne({ userId: userId }).exec();
        if (!userPortfolio) {
            return NextResponse.json({ message: "User portfolio not found" }, { status: 404 });
        }

        userPortfolio.Notizen.UserComment = msg.UserComment;
        userPortfolio.Notizen.MissingCoins = msg.MissingCoins;

        await userPortfolio.save();

        return NextResponse.json({ message: "Notes updated successfully" }, { status: 200 });
    } catch (e) {
        console.error("Error updating notes:", e);
        return NextResponse.json({ message: "Error occurred while updating notes" }, { status: 500 });
    }
}
