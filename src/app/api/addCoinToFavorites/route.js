import { connectToDb } from "../../../lib/utils";
import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDb();

    const { userId, CoinGeckoID } = await req.json();
    console.log("Received userId and CoinGeckoID:", userId, CoinGeckoID);

    try {
        // First, find the user's portfolio that contains the asset with the given CoinGeckoID
        const portfolio = await UserPortfolio.findOne({
            userId: userId,
            "assets.CoinGeckoID": CoinGeckoID
        });

        console.log("assets.CoinGeckoID", portfolio)

        if (!portfolio) {
            console.log("No portfolio found for the given user with CoinGeckoID:", CoinGeckoID);
            return new NextResponse(null, { status: 404, statusText: 'Portfolio or asset not found' });
        }

        // Find the asset to toggle the Favourite status
        const assetToToggle = portfolio.assets.find(asset => asset.CoinGeckoID === CoinGeckoID);

        // Perform the update to toggle the Favourite status
        const result = await UserPortfolio.updateOne(
            { _id: portfolio._id, "assets.CoinGeckoID": CoinGeckoID },
            { $set: { "assets.$.Favourite": !assetToToggle.Favourite } }
        );

        if (result.modifiedCount === 0) {
            console.log("Failed to update the favourite status for asset.");
            return new NextResponse(JSON.stringify({ success: false, message: "Failed to update favourite status" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        console.log("Asset favourite status toggled successfully.");
        return new NextResponse(JSON.stringify({ success: true, message: "Asset favourite status toggled successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Error updating asset:", error);
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
