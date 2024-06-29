import { NextResponse } from "next/server";
import { UserPortfolio } from "../../../lib/models";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
  const tokenVerificationResponse = await verifyToken(req);
  console.log(tokenVerificationResponse);
  if (tokenVerificationResponse) {
    return tokenVerificationResponse;
  }

  const { userID, CoinGeckoID, rowVals, Portfolio_Assets } = await req.json();
  console.log("debug add buy and sell", Portfolio_Assets);
  try {
    const result = await UserPortfolio.findOneAndUpdate(
      { userId: userID, "assets.CoinGeckoID": CoinGeckoID },
      {
        $set: {
          "assets.$.buyAndSell": rowVals,
          "assets.$.totalInvest": Portfolio_Assets.totalInvest,
          "assets.$.totalSold": Portfolio_Assets.totalSold,
          "assets.$.totalCoins": Portfolio_Assets.totalCoins,
          "assets.$.Holdings": Portfolio_Assets.Holdings,
          "assets.$.DCA": Portfolio_Assets.DCA,
        },
      },
      { new: true } // Returns the updated document
    );

    if (!result) {
      return NextResponse.json(
        { message: "Portfolio not found or update failed" },
        { status: 500 }
      );
    }

    // Return the updated portfolio data
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in POST API:", error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
