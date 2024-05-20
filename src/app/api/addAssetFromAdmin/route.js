import { Assets } from "../../../lib/models";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";

export async function POST(req) {
    const { data } = await req.json();

    try {
        await connectToDb();

        // Check if asset with provided coinGeckoID already exists
        const existingAsset = await Assets.findOne({ CoinGeckoID: data.coinGeckoID });

        if (existingAsset) {
            // Update the existing asset
            existingAsset.Name = data.name;
            existingAsset.Ticker = data.ticker;
            existingAsset.Bottom = data.bottom;
            existingAsset.BottomRanking = data.bottomRanking;
            existingAsset.cgPrice = data.cgPrice;
            existingAsset.cgImageURL = data.cgImageURL;
            existingAsset.Risk = data.risk;
            existingAsset.Potential = data.potential;
            existingAsset.Sicherheit = data.sicherheit;
            existingAsset.Category = data.categories;

            await existingAsset.save();

            return new NextResponse(
                JSON.stringify({
                    message: "Asset updated successfully",
                }),
                { status: 200 }
            );
        } else {
            // Create a new asset
            const newAsset = new Assets({
                ID: Date.now(), // Generate a unique ID based on the current timestamp
                Category: data.categories,
                Name: data.name,
                Ticker: data.ticker,
                Potential: data.potential,
                Sicherheit: data.sicherheit,
                Bottom: data.bottom,
                BottomRanking: data.bottomRanking,
                CoinGeckoID: data.coinGeckoID,
                cgPrice: data.cgPrice,
                cgImageURL: data.cgImageURL,
                Risk: data.risk,
            });

            await newAsset.save();

            return new NextResponse(
                JSON.stringify({
                    message: "Asset added successfully",
                }),
                { status: 201 }
            );
        }
    } catch (e) {
        return new NextResponse(
            JSON.stringify({
                message: `Error occurred adding asset: ${e.message}`,
            }),
            { status: 500 }
        );
    }
}
