import { NextResponse } from "next/server";
import { UserPortfolio } from "../../../lib/models";

export async function POST(req) {
    try {
        const { userID, data } = await req.json();

        // Validate the request data
        if (!userID || !Array.isArray(data)) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        // Fetch the user portfolio
        const userPortfolio = await UserPortfolio.findOne({ userId: userID });

        if (!userPortfolio) {
            return NextResponse.json({ message: "User portfolio not found" }, { status: 404 });
        }

        // Update the portfolio with new buy and sell data
        data.forEach(coinData => {
            const { CoinGeckoID, buyAndSell } = coinData;
            const asset = userPortfolio.assets.find(asset => asset.CoinGeckoID === CoinGeckoID);
            if (asset) {
                asset.buyAndSell = asset.buyAndSell.concat(buyAndSell);
            }
        });

        // Save the updated portfolio
        await userPortfolio.save();

        return NextResponse.json({ message: "Buy and sell data successfully imported" }, { status: 200 });
    } catch (error) {
        console.error("Error importing buy and sell data:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
