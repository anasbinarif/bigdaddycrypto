import { Portfolio } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { portfolioId, CoinGeckoID } = await req.json();
    try {
        const userPortfolio = await Portfolio.findById(portfolioId);
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