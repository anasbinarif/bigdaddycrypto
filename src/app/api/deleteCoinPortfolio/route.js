import { UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function POST(req) {
  // console.log(req.headers.get("authorization"));
  const tokenVerificationResponse = await verifyToken(req);
  if (tokenVerificationResponse) {
    return tokenVerificationResponse;
  }

  const { userId, CoinGeckoID } = await req.json();
  try {
    const userPortfolio = await UserPortfolio.findOne({ userId: userId });
    const index = userPortfolio.assets.findIndex(
      (c) => c.CoinGeckoID === CoinGeckoID
    );
    userPortfolio.assets.splice(index, 1);
    await userPortfolio.save();
    return NextResponse.json(
      {
        message: "Coin removed from portfolioGenerator.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error updating portfolio: ${error.message}` },
      { status: 500 }
    );
  }
}
