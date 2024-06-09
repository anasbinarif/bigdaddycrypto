import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";
import { updateCoinDetails } from "../../../lib/action";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
    const tokenVerificationResponse = await verifyToken(req);
    if (tokenVerificationResponse) {
        return tokenVerificationResponse;
    }

    const { userId, coin } = await req.json();

    try {
        await updateCoinDetails(coin.CoinGeckoID);
        const userPortfolio = await UserPortfolio.findOne({ userId });

        if (!userPortfolio) {
            const newPortfolio = new UserPortfolio({
                userId,
                assets: [coin],
            });
            await newPortfolio.save();
            return NextResponse.json({ message: "Portfolio created and coin added." }, { status: 201 });
        } else {
            const index = userPortfolio.assets.findIndex(c => c.CoinGeckoID === coin.CoinGeckoID);
            if (index > -1) {
                userPortfolio.assets.splice(index, 1);
            } else {
                userPortfolio.assets.push(coin);
            }
            await userPortfolio.save();
            return NextResponse.json({
                message: index > -1 ? "Coin removed from portfolio." : "Coin added to portfolio."
            }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: `Error updating portfolio: ${error.message}` }, { status: 500 });
    }
}
