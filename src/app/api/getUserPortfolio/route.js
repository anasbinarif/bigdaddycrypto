import { UserPortfolio, Assets } from "../../../lib/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  const { userId } = await req.json();
  const objectUserId = new mongoose.Types.ObjectId(userId);

  try {
    const portfolio = await UserPortfolio.findOne({ userId: objectUserId });
    if (!portfolio) {
      console.log("No portfolio found");
      return NextResponse.json(
        { message: "No portfolio found" },
        { status: 200 },
        { data: {} }
      );
    }

    // Fetch each asset's details from the Assets table based on CoinGeckoID
    const assetDetails = await Promise.all(
      portfolio.assets.map(async (asset) => {
        return Assets.findOne({ CoinGeckoID: asset.CoinGeckoID });
      })
    );

    // Log and return the full details
    // console.log("assetGenerator------", assetDetails);
    // console.log("portfolioGenerator------", portfolio);
    const data = { portfolio, assetDetails };
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.error("Error getting user portfolio:", error);
    return NextResponse.json(
      { message: `Error getting user portfolio ${error.message}` },
      { status: 500 }
    );
  }
}
