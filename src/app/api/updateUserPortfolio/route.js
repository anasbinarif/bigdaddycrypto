import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
  const tokenVerificationResponse = await verifyToken(req);
  if (tokenVerificationResponse) {
    return tokenVerificationResponse;
  }

  const { userId, updatedAssets } = await req.json();
  console.log("userIdupdate", userId);

  try {
    const portfolio = await UserPortfolio.findOne({ userId: userId });
    if (!portfolio) {
      // console.log("No portfolio found");
      return NextResponse.json(
        { message: "No portfolio found" },
        { status: 404 }
      );
    }

    // Iterate through each updated asset and apply the update
    for (const updatedAsset of updatedAssets) {
      await UserPortfolio.updateOne(
        { userId: userId, "assets.CoinGeckoID": updatedAsset.CoinGeckoID },
        {
          $set: {
            "assets.$.Relevanz": updatedAsset.Relevanz,
            "assets.$.DCA_0": updatedAsset.DCA_0,
            "assets.$.Gewichtung": updatedAsset.Gewichtung,
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Portfolio updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user portfolio:", error);
    return NextResponse.json(
      { message: `Error updating user portfolio ${error.message}` },
      { status: 500 }
    );
  }
}
