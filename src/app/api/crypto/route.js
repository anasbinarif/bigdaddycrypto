import { NextResponse } from "next/server";
import { Assets, UserPortfolio } from "../../../lib/models";
// import { updateCoinDetails } from "../../../lib/action";

export async function POST(req) {
  const { userId } = await req.json();
  try {
    const apiKey = "CG-XAPzMYbZ8Q8KoqGdwscqrr6f";
    const urlPing = `https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`;
    const responsePing = await fetch(urlPing);
    if (responsePing.ok) {
      const portfolio = await UserPortfolio.findOne({ userId: userId });
      const coinGeckoIDs = portfolio?.assets?.map((asset) => asset.CoinGeckoID);
      // const promises = coinGeckoIDs?.map((coinGeckoID) =>
      //   updateCoinDetails(coinGeckoID).catch((error) =>
      //     console.error(
      //       `Failed to update details for ${coinGeckoID}: ${error.message}`
      //     )
      //   )
      // );
      // await Promise.allSettled(promises);
      console.log("All coin details updated successfully.");
      return new NextResponse(
        JSON.stringify({ message: "All coin details updated successfully" }),
        { status: 200 }
      );
    } else {
      console.error("Failed to ping CoinGecko API");
      return new NextResponse(
        JSON.stringify({ message: "Failed to ping CoinGecko API" }),
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Error in POST function:", e);
    return new NextResponse(
      JSON.stringify({
        message: `Error occurred updating coin data ${e.message}`,
      }),
      { status: 500 }
    );
  }
}
