import { connectToDb } from "@/lib/utils";
import {PastUsers, PastPortfolio, Assets, PastBuyAndSell, User, UserPortfolio} from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {userID} = await req.json();
    const user = await User.findById(userID).exec();
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ pastUserCheck: user.pastUserCheck }, { status: 200 });
}