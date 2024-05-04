import { Portfolio, User } from "@/lib/models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const { userId, coin } = await req.json();
    console.log("debug price", coin);

    try {
        const userPortfolio = await Portfolio.findOne({ userId: userId });

        if (!userPortfolio) {
            // If no portfolio exists, create one
            const newPortfolio = new Portfolio({
                userId: objectId,
                assets: [coin]
            });
            await newPortfolio.save();
            return NextResponse.json({ message: "Portfolio created and coin added." }, { status: 201 });
        } else {
            // Check if the coin already exists
            const index = userPortfolio.assets.findIndex(c => c.CoinGeckoID === coin.CoinGeckoID);
            if (index > -1) {
                // Coin exists, remove it
                userPortfolio.assets.splice(index, 1);
            } else {
                // Coin does not exist, add it
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
