// deleteallportfoliocoins
import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
    // console.log(req.headers.get("authorization"));
    const tokenVerificationResponse = await verifyToken(req);
    if (tokenVerificationResponse) {
        return tokenVerificationResponse;
    }

    const { userId } = await req.json();
    try {
        const userPortfolio = await UserPortfolio.findOne({ userId: userId });
        if (!userPortfolio) {
            return NextResponse.json(
                { message: "User portfolio not found." },
                { status: 404 }
            );
        }
        userPortfolio.assets = [];
        await userPortfolio.save();
        return NextResponse.json(
            {
                message: "Coins removed from the portfolio.",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `Error updating portfolio: ${error.message}` },
            { status: 500 }
        );
    }
}
