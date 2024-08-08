import { NextResponse } from "next/server";
import { UserPortfolio } from "../../../lib/models";
import Decimal from "decimal.js";

export async function POST(req) {
  try {
    const { userID, data, prices } = await req.json();

    // Validate the request data
    if (!userID || !prices || !Array.isArray(data)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Fetch the user portfolio
    const userPortfolio = await UserPortfolio.findOne({ userId: userID });
    console.log(userPortfolio._doc.assets);

    if (!userPortfolio) {
      return NextResponse.json(
        { message: "User portfolio not found" },
        { status: 404 }
      );
    }

    // Update the portfolio with new buy and sell data
    data.forEach((coinData) => {
      console.log(data);
      const { CoinGeckoID, buyAndSell } = coinData;
      const asset = userPortfolio.assets.find(
        (asset) => asset.CoinGeckoID === CoinGeckoID
      );
      if (asset) {
        // console.log(buyAndSell);
        // console.log(asset._doc);
        const totalInvested = buyAndSell
          .reduce((acc, row) => {
            if (row?.Type === "Kauf") {
              return acc + parseFloat(row.Betrag);
            }
            return acc;
          }, 0)
          .toFixed(2);
        const realizedProfit = buyAndSell
          .reduce((acc, row) => {
            if (row.Type === "Verkauf") {
              return acc + parseFloat(row.Betrag);
            }
            return acc;
          }, 0)
          .toFixed(2);
        let totalCoins = buyAndSell?.reduce((acc, row) => {
          const coinsValue = new Decimal(row.Coins || 0);
          return row.Type === "Kauf"
            ? acc.plus(coinsValue)
            : acc.minus(coinsValue);
        }, new Decimal(0));
        totalCoins = parseFloat(totalCoins.toString());
        const totalHoldingsValue = (
          totalCoins *
          parseFloat(prices?.find((asset) => asset.id === CoinGeckoID)?.price)
        ).toFixed(2);
        const avgPurchasePrice = isNaN(
          totalInvested /
            buyAndSell.reduce((acc, row) => {
              if (row.Type === "Kauf") {
                return acc + parseFloat(row.Coins);
              }
              return acc;
            }, 0)
        )
          ? 0
          : totalInvested /
            buyAndSell.reduce((acc, row) => {
              if (row.Type === "Kauf") {
                return acc + parseFloat(row.Coins);
              }
              return acc;
            }, 0);

        // console.log(
        //   totalInvested,
        //   realizedProfit,
        //   totalCoins,
        //   totalHoldingsValue,
        //   avgPurchasePrice
        // );
        asset.totalInvest += parseFloat(totalInvested);
        asset.totalSold += parseFloat(realizedProfit);
        asset.totalCoins += parseFloat(totalCoins);
        asset.Holdings += parseFloat(totalHoldingsValue);
        asset.DCA += parseFloat(avgPurchasePrice);
        asset.buyAndSell = asset.buyAndSell.concat(buyAndSell);
      }
    });

    // Save the updated portfolio
    await userPortfolio.save();

    return NextResponse.json(
      { message: "Buy and sell data successfully imported" },
      { status: 200 }
    );
  } catch (error) {
    // console.log(error);
    console.error("Error importing buy and sell data:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
