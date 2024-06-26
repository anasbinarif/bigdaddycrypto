import { connectToDb } from "../../../lib/utils";
import { PastUsers, PastPortfolio, Assets, PastBuyAndSell, User, UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { EditPIN, Name, userID } = await req.json();
    console.log("Import start", { EditPIN, Name });

    try {
        await connectToDb();

        const user = await User.findById(userID).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.pastUserCheck) {
            return NextResponse.json({ message: "You can't import previous user data, contact admin for details" }, { status: 403 });
        }

        const pastUser = await PastUsers.findOne({ Name }).exec();
        if (!pastUser) {
            return NextResponse.json({ message: "Past user not found" }, { status: 404 });
        }

        const isMatch = EditPIN === pastUser.EditPIN;
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid PIN" }, { status: 401 });
        }

        if (pastUser.ImportedSuccessfully) {
            return NextResponse.json({ message: "This User is already Imported" }, { status: 401 });
        }

        const userPortfolio = await UserPortfolio.findOne({ userId: userID });
        if (userPortfolio) {
            return NextResponse.json({ message: "User already has portfolios" }, { status: 404 });
        }

        const portfolios = await PastPortfolio.find({ PortfolioID: pastUser.Name }).exec();
        if (!portfolios.length) {
            return NextResponse.json({ message: "No portfolios found for this past user" }, { status: 404 });
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

            // getting past data from past buy&sell
            const transactions = buyAndSellMap[portfolio.ID] || [];
            const totalCoins = transactions.reduce((acc, curr) => {
                if (curr.Type === "buy") {
                    return acc + curr.Coins;
                } else if (curr.Type === "sell") {
                    return acc - curr.Coins;
                }
                return acc;
            }, 0);
            const totalInvested = transactions
                .reduce((acc, row) => {
                    if (row.Type === "buy") {
                        return acc + parseFloat(row.Betrag);
                    }
                    return acc;
                }, 0)
                .toFixed(2);

            const realizedProfit = transactions
                .reduce((acc, row) => {
                    if (row.Type === "sell") {
                        return acc + parseFloat(row.Betrag);
                    }
                    return acc;
                }, 0)
                .toFixed(2);
            // const totalHoldingsValue = (totalCoins * parseFloat(coin?.Price)).toFixed(
            //     2
            // );

            const adjustedTransactions = transactions.map(transaction => ({
                ...transaction,
                Type: transaction.Type === "buy" ? "Kauf" : (transaction.Type === "sell" ? "Verkauf" : transaction.Type)
            }));

            const adjustedDCA = portfolio.DCA !== "" ? Number(portfolio.DCA) + 1 : 0;
            const adjustedGewichtung = portfolio.Gewichtung !== "" ? Number(portfolio.Gewichtung) + 1 : 0;
            const adjustedRelevanz = portfolio.Relevanz !== "" ? Number(portfolio.Relevanz) + 1 : 0;



            const assets = [{
                CoinGeckoID: assetMap[portfolio.AssetID] ? assetMap[portfolio.AssetID].CoinGeckoID : null,
                Holdings: portfolio.Holdings,
                DCA: portfolio.avgPrice,
                DCA_0: adjustedDCA,
                Gewichtung: adjustedGewichtung,
                Relevanz: adjustedRelevanz,
                totalInvest: totalInvested,
                totalSold: realizedProfit,
                totalCoins: totalCoins,
                buyAndSell: adjustedTransactions
            }];

            return assets.every(asset => asset.CoinGeckoID !== null) ? {
                userId: user._id,
                assets: assets
            } : null;
        }).filter(portfolio => portfolio !== null);

        const newUserPortfolio = new UserPortfolio({
            userId: user._id,
            Notizen: {
                UserComment: pastUser.UserComment,
                MissingCoins: pastUser.MissingCoins
            },
            assets: userPortfolios.map(portfolio => portfolio.assets).flat()
        });

        try {
            await newUserPortfolio.save();
            user.pastUser = pastUser.Name;
            user.pastUserCheck = true;
            user.pastUserAccessTime = new Date();
            user.pastUserAccess = true;
            pastUser.ImportedSuccessfully = true;
            await pastUser.save()
            await user.save();
            return NextResponse.json({ userPortfolios }, { status: 200 });
        } catch (e) {
            console.log("Error during data import:", e);
            return NextResponse.json({ message: "Error occurred while saving the data" }, { status: 500 });
        }
    } catch (e) {
        console.log("Error during data import:", e);
        return NextResponse.json({ message: "Error occurred while fetching the data" }, { status: 500 });
    }
}
