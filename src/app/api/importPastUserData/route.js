import { connectToDb } from "@/lib/utils";
import { PastUsers, PastPortfolio, Assets, PastBuyAndSell, UserPortfolio } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { EditPIN, Name } = await req.json();
    console.log("Import start", { EditPIN, Name });

    try {
        await connectToDb();

        const user = await PastUsers.findOne({ Name }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isMatch = EditPIN === user.EditPIN;
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid PIN" }, { status: 401 });
        }

        const portfolios = await PastPortfolio.find({ PortfolioID: user.Name }).exec();
        if (!portfolios.length) {
            return NextResponse.json({ message: "No portfolios found for this user" }, { status: 404 });
        }

        const assetIds = portfolios.map(p => p.AssetID);
        const assets = await Assets.find({ ID: { $in: assetIds } }).exec();
        const assetMap = assets.reduce((acc, asset) => {
            acc[asset.ID] = asset;
            return acc;
        }, {});

        const buyAndSellData = await PastBuyAndSell.find({ PortfolioAssetID: { $in: portfolios.map(p => p.ID) } }).exec();
        const buyAndSellMap = buyAndSellData.reduce((acc, item) => {
            if (!acc[item.PortfolioAssetID]) acc[item.PortfolioAssetID] = [];
            acc[item.PortfolioAssetID].push(item);
            return acc;
        }, {});

        const userPortfolios = portfolios.map(portfolio => {
            const transactions = buyAndSellMap[portfolio.ID] || [];
            const totalCoins = transactions.reduce((acc, curr) => curr.Type === "buy" ? acc + curr.Coins : acc - curr.Coins, 0);

            return {
                userId: user._id,
                assets: [{
                    CoinGeckoID: assetMap[portfolio.AssetID] ? assetMap[portfolio.AssetID].CoinGeckoID : null,
                    Holdings: portfolio.Holdings,
                    DCA: portfolio.DCA,
                    Gewichtung: portfolio.Gewichtung,
                    Relevanz: portfolio.Relevanz,
                    totalInvest: portfolio.totalInvest,
                    totalSold: portfolio.totalSold,
                    totalCoins: totalCoins,
                    buyAndSell: transactions
                }]
            };
        });

        return NextResponse.json({ userPortfolios }, { status: 200 });
    } catch (e) {
        console.log("Error during data import:", e);
        return NextResponse.json({ message: "Error occurred while fetching the data" }, { status: 500 });
    }
}
