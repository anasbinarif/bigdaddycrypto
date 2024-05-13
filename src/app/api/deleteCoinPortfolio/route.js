import { UserPortfolio } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId, CoinGeckoID } = await req.json();
    try {
        const userPortfolio = await UserPortfolio.findOne({ userId: userId });
        const index = userPortfolio.assets.findIndex(c => c.CoinGeckoID === CoinGeckoID);
        userPortfolio.assets.splice(index, 1);
        await userPortfolio.save();
        return NextResponse.json({
            message: "Coin removed from portfolioGenerator."
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error updating portfolio: ${error.message}` }, { status: 500 });
    }
}