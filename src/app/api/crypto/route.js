import { NextResponse } from "next/server";
import { Assets, UserPortfolio } from "../../../lib/models";

async function updateCoinDetails(coinGeckoID) {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const url = `https://pro-api.coingecko.com/api/v3/coins/${coinGeckoID}/market_chart`;
  const params = new URLSearchParams({
    vs_currency: "eur",
    days: "800",
    interval: "daily",
    x_cg_pro_api_key: apiKey,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      const prices = data.prices;
      if (prices.length > 0) {
        const lowestLow = prices.reduce(
          (min, p) => (p[1] < min[1] ? p : min),
          prices[0]
        );
        const highestHigh = prices.reduce(
          (max, p) => (p[1] > max[1] ? p : max),
          prices[0]
        );
        const lowestLowDate = new Date(lowestLow[0])
          .toISOString()
          .split("T")[0];
        const highestHighDate = new Date(highestHigh[0])
          .toISOString()
          .split("T")[0];
        const average200Days =
          prices.slice(-200).reduce((sum, p) => sum + p[1], 0) / 200;
        const currentPrice = prices[prices.length - 1][1];
        const ratioToAvg = currentPrice / average200Days;

        // Update the asset details in MongoDB
        await Assets.updateOne(
          { CoinGeckoID: coinGeckoID },
          {
            $set: {
              Price: currentPrice,
              cgPrice: currentPrice,
              LastPriceUpdate: new Date(),
            },
          }
        );
      }
    } else {
      console.error(
        `Error retrieving price data for ${coinGeckoID}. HTTP Status Code: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

export async function POST(req) {
  const { userId } = await req.json();
  try {
    const apiKey = "CG-XAPzMYbZ8Q8KoqGdwscqrr6f";
    const urlPing = `https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`;
    const responsePing = await fetch(urlPing);
    if (responsePing.ok) {
      const portfolio = await UserPortfolio.findOne({ userId: userId });
      const coinGeckoIDs = portfolio.assets.map((asset) => asset.CoinGeckoID);
      const promises = coinGeckoIDs.map((coinGeckoID) =>
        updateCoinDetails(coinGeckoID).catch((error) =>
          console.error(
            `Failed to update details for ${coinGeckoID}: ${error.message}`
          )
        )
      );
      await Promise.allSettled(promises);
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
    console.error("Error in GET function:", e);
    return new NextResponse(
      JSON.stringify({
        message: `Error occurred updating coin data ${e.message}`,
      }),
      { status: 500 }
    );
  }
}
