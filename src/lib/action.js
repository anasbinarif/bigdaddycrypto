"use server";

import { connectToDb } from "../lib/utils";
import { Assets, Payments, User, PastUsers, PastPortfolio, PastBuyAndSell } from "../lib/models";
import Hashids from 'hashids';
const hashids = new Hashids('this is my salt', 6);

export const getUsers = async () => {
    try {
        await connectToDb();
        return await User.find();
    } catch (e) {
        console.log(e);
    }
};

export const saveSubscriptionDetails = async (data, userId, plan, planId, billingCycle) => {
    try {
        await connectToDb();
        const currentDate = new Date();

        let payment = await Payments.findOne({ userId: userId });

        if (payment) {
            payment.Subscription = {
                plan: plan,
                planId: planId,
                billingCycle: billingCycle,
                status: "active",
                subscriptionId: data.subscriptionID,
                nextBilledAt: currentDate.setMonth(currentDate.getMonth() + (billingCycle === "monthly" ? 1 : 12)),
                endDate: null
            };
        } else {
            payment = new Payments({
                userId: userId,
                Subscription: {
                    plan: plan,
                    planId: planId,
                    billingCycle: billingCycle,
                    status: "active",
                    subscriptionId: data.subscriptionID,
                    nextBilledAt: currentDate.setMonth(currentDate.getMonth() + (billingCycle === "monthly" ? 1 : 12)),
                    endDate: null
                },
                oneTimePayment: []
            });
        }

        await payment.save();

        // Update the user's subscription status
        await User.findByIdAndUpdate(userId, {
            subscribed: true,
            currentSubscription: payment._id
        });

        console.log('Subscription details saved successfully.');
    } catch (error) {
        console.error('Error saving subscription details:', error);
    }
};

export const calculatePrice = (portfolioData) => {
    const { assets, investment } = portfolioData;
    if (investment === 'Unter 10.000 €') {
        return 995;
    }
    const assetRanges = {
        '1-15': [
            { range: ['10.000 - 25.000 €', '25.000 - 50.000 €', '50.000 - 100.000 €'], price: 995 },
            { range: ['100.000 - 200.000 €'], price: 1295 },
            { range: ['200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'], price: 1495 },
        ],
        '16-25': [
            { range: ['10.000 - 25.000 €'], price: 995 },
            { range: ['25.000 - 50.000 €'], price: 1195 },
            { range: ['50.000 - 100.000 €'], price: 1295 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €'], price: 1495 },
            { range: ['400.000 - 750.000 €', '750.000+'], price: 1695 },
        ],
        '26-35': [
            { range: ['10.000 - 25.000 €'], price: 1195 },
            { range: ['25.000 - 50.000 €'], price: 1295 },
            { range: ['50.000 - 100.000 €'], price: 1495 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €'], price: 1695 },
            { range: ['400.000 - 750.000 €', '750.000+'], price: 1895 },
        ],
        '36+': [
            { range: ['10.000 - 25.000 €'], price: 1295 },
            { range: ['25.000 - 50.000 €'], price: 1495 },
            { range: ['50.000 - 100.000 €'], price: 1695 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'], price: 1895 },
        ],
    };

    for (let i = 0; i < assetRanges[assets].length; i++) {
        if (assetRanges[assets][i].range.includes(investment)) {
            return assetRanges[assets][i].price;
        }
    }

    return 0; // Default case if no match found
};

export async function updateCoinDetails(coinGeckoID) {
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
                // const lowestLow = prices.reduce(
                //     (min, p) => (p[1] < min[1] ? p : min),
                //     prices[0]
                // );
                const lowestPrice = Math.min(...prices.map(price => price[1]));
                // const highestHigh = prices.reduce(
                //     (max, p) => (p[1] > max[1] ? p : max),
                //     prices[0]
                // );
                // const lowestLowDate = new Date(lowestLow[0])
                //     .toISOString()
                //     .split("T")[0];
                // const highestHighDate = new Date(highestHigh[0])
                //     .toISOString()
                //     .split("T")[0];
                // const average200Days =
                //     prices.slice(-200).reduce((sum, p) => sum + p[1], 0) / 200;

                // Update the asset details in MongoDB
                await Assets.updateOne(
                    { CoinGeckoID: coinGeckoID },
                    {
                        $set: {
                            // Price: currentPrice,
                            // cgPrice: currentPrice,
                            // LastPriceUpdate: new Date(),
                            Bottom: lowestPrice,
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

export async function updateCoinDetailsCron(coinGeckoIDs) {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

    const getCurrentPrices = async (coinIds, currency, apiKey) => {
        const ids = coinIds.join(',');
        const url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}&x_cg_pro_api_key=${apiKey}`;
        try {
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("Rate limit exceeded. Please try again later or upgrade your plan.");
                } else {
                    throw new Error(`Error retrieving price data. HTTP Status Code: ${response.status}`);
                }
            }
            return await response.json();
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            throw error;
        }
    };

    try {
        const currentPrices = await getCurrentPrices(coinGeckoIDs, 'eur', apiKey);
        // console.log("currentPrices", currentPrices);

        const updatePromises = coinGeckoIDs.map((coinGeckoID) => {
            const currentPrice = currentPrices[coinGeckoID]?.eur;
            if (currentPrice !== undefined) {
                return Assets.updateOne(
                    { CoinGeckoID: coinGeckoID },
                    {
                        $set: {
                            Price: currentPrice,
                            cgPrice: currentPrice,
                            LastPriceUpdate: new Date(),
                        },
                    }
                );
            } else {
                console.warn(`No price data available for ${coinGeckoID}`);
                return Promise.resolve();
            }
        });

        await Promise.allSettled(updatePromises);

        console.log("All coin details updated successfully.");
    } catch (error) {
        console.error(`Failed to get current price or update asset: ${error.message}`);
    }
}


const BATCH_SIZE = 500;

export const importPortfolios = async () => {
    try {
        console.log("starting.............");
        await connectToDb();

        const dataBuffer = await fs.readFile(
            "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Portfolios.json"
        );
        const dataString = dataBuffer.toString();
        const jsonData = JSON.parse(dataString);

        const portfolios = jsonData.find(item => item.type === "table" && item.name === "Portfolios").data;

        // console.log("Total portfolios:", portfolios.length);

        for (let i = 0; i < portfolios.length; i += BATCH_SIZE) {
            const batch = portfolios.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
            console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
        }

        console.log("Data import complete.");
    } catch (e) {
        console.log("Error importing data:", e);
        throw e;
    }
};

const processBatch = async (batch) => {
    const operations = batch.map(async (portfolio) => {
        const existingUser = await PastUsers.findOne({ Name: portfolio.Name }).exec();
        if (!existingUser) {
            await PastUsers.create({
                EditPIN: portfolio.EditPIN,
                Name: portfolio.Name,
                Email: portfolio.Email,
                PremiumUntil: portfolio.PremiumUntil,
                Created: portfolio.Created,
                LastUpdate: portfolio.LastUpdate,
                UserComment: portfolio.UserComment,
                MissingCoins: portfolio.MissingCoins,
                Expectation: portfolio.Expectation,
                CommentRequested: portfolio.CommentRequested,
                RequestDate: portfolio.RequestDate
            });
        }
    });

    await Promise.all(operations);
};

export const importPortfolioAssets = async () => {
    try {
        console.log("Starting data import...");
        await connectToDb();

        const dataBuffer = await fs.readFile(
            "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Portfolio_Assets.json"
        );
        const dataString = dataBuffer.toString();
        const jsonData = JSON.parse(dataString);

        const portfolios = jsonData.find(item => item.type === "table" && item.name === "Portfolio_Assets").data;

        console.log("Total portfolios:", portfolios.length);

        for (let i = 0; i < portfolios.length; i += BATCH_SIZE) {
            const batch = portfolios.slice(i, i + BATCH_SIZE);
            await processBatch2(batch);
            console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
        }

        console.log("Data import complete.");
    } catch (e) {
        console.log("Error importing data:", e);
        throw e;
    }
};

const processBatch2 = async (batch) => {
    const operations = batch.map(async (portfolio) => {
        if (portfolio.PortfolioID && portfolio.ID && portfolio.AssetID) {
            const existingPortfolio = await PastPortfolio.findOne({ ID: portfolio.ID }).exec();
            if (!existingPortfolio) {
                await PastPortfolio.create({
                    ID: portfolio.ID,
                    PortfolioID: portfolio.PortfolioID,
                    AssetID: portfolio.AssetID,
                    Holdings: portfolio.Holdings || 0.0,
                    avgPrice: portfolio.avgPrice || 0.0,
                    totalInvest: portfolio.totalInvest || 0.0,
                    totalSold: portfolio.totalSold || 0.0,
                    Relevanz: portfolio.Relevanz || "",
                    RelevanzComment: portfolio.RelevanzComment || "",
                    DCA: portfolio.DCA || "",
                    DCAComment: portfolio.DCAComment || "",
                    Gewichtung: portfolio.Gewichtung || "",
                    GewichtungComment: portfolio.GewichtungComment || ""
                });
            }
        }
    });

    await Promise.all(operations);
};

const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

export const importPortfolioTransfer = async () => {
    try {
        console.log("starting.............transfer122");
        await connectToDb();

        const dataBuffer = await fs.readFile(
            "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Portfolio_Assets_Transfer.json"
        );
        const dataString = dataBuffer.toString();
        const jsonData = JSON.parse(dataString);
        console.log("jsonData length:", jsonData[2].data.length);

        let index = 0;
        while (index < jsonData[2].data.length) {
            const batchData = jsonData[2].data
                .slice(index, index + BATCH_SIZE)
                .map((item) => ({
                    ID: parseInt(item.ID, 10),
                    PortfolioAssetID: parseFloat(item.PortfolioAssetID),
                    Type: item.Type,
                    Date: isValidDate(item.Date) ? new Date(item.Date) : new Date(),
                    PricePerCoin: isNaN(parseFloat(item.PricePerCoin)) ? 0 : parseFloat(item.PricePerCoin),
                    Betrag: isNaN(parseFloat(item.Betrag)) ? 0 : parseFloat(item.Betrag),
                    Coins: isNaN(parseFloat(item.Coins)) ? 0 : parseFloat(item.Coins),
                }))
                .filter(item => item.Type !== null && item.Type !== '');

            const results = await PastBuyAndSell.insertMany(batchData);
            console.log(`Batch ${index / BATCH_SIZE + 1} imported successfully`);
            index += BATCH_SIZE;
        }

        console.log("Data import complete.");
    } catch (e) {
        console.log("Error importing data:", e);
        throw e;
    }
};



