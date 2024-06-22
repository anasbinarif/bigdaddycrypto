import { connectToDb } from "../../../lib/utils";
import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
  const tokenVerificationResponse = await verifyToken(req);
  if (tokenVerificationResponse) {
    return tokenVerificationResponse;
  }

  await connectToDb();

  const { userId, CoinGeckoID } = await req.json();
  console.log("Received userId and CoinGeckoID:", userId, CoinGeckoID);

  try {
    // First, find the user's portfolio
    const portfolio = await UserPortfolio.findOne({ userId: userId });

    if (!portfolio) {
      console.log("No portfolio found for the given user:", userId);
      return new NextResponse(null, {
        status: 404,
        statusText: "Portfolio not found",
      });
    }

    // Check if the CoinGeckoID is already in the Favourite array
    const isFavourite = portfolio.Favourite.some(
      (fav) => fav.CoinGeckoID === CoinGeckoID
    );

    if (isFavourite) {
      // Remove the CoinGeckoID from the Favourite array
      portfolio.Favourite = portfolio.Favourite.filter(
        (fav) => fav.CoinGeckoID !== CoinGeckoID
      );
    } else {
      // Add the CoinGeckoID to the Favourite array
      portfolio.Favourite.push({ CoinGeckoID });
    }

    // Save the changes
    await portfolio.save();

    console.log("Asset favourite status toggled successfully.");
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Asset favourite status toggled successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating asset:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
