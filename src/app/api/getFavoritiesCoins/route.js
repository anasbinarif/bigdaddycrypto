import { connectToDb } from "../../../lib/utils";
import { UserPortfolio, Assets } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectToDb();

    try {
        const { userId } = await request.json();

        // Find the user's portfolio
        const portfolio = await UserPortfolio.findOne({ userId: userId });

        if (!portfolio) {
            return new NextResponse(JSON.stringify({ success: false, message: "Portfolio not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // Extract the CoinGeckoIDs of the favorite assets
        const favoriteCoinGeckoIDs = portfolio.Favourite.map(fav => fav.CoinGeckoID);

        // Query the Assets collection to get the details of the favorite assets
        const favoriteAssets = await Assets.find({ CoinGeckoID: { $in: favoriteCoinGeckoIDs } });

        return new NextResponse(JSON.stringify({ success: true, data: favoriteAssets }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching favorite assets:", error);
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
