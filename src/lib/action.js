"use server";

import {connectToDb} from "../lib/utils";
import {Assets, Payments, User} from "../lib/models";
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

export const calculateScore = (portfolioData) => {
    const totalCategories = 9;
    const maxAssetsCount = 20;
    let selectedAssetsCount = 0;
    let categoryCounts = {};

    // Count the occurrences of each category in the portfolio
    portfolioData.forEach((item) => {
        item.Category.forEach((category) => {
            if (!categoryCounts[category]) {
                categoryCounts[category] = 0;
            }
            categoryCounts[category]++;
        });
        selectedAssetsCount++;
    });

    let score = 0;
    let scoreFactor_Category = 0;
    let scoreFactor_CategoryTwice = 0;
    let scoreFactor_Allocation = 0;
    let scoreFactor_CoinCount = 0;
    let scoreFactor_CategoryMissing = 0;
    let maxCategoryPercentage = 0;
    let totalCategoryPercentage = 0;

    Object.keys(categoryCounts).forEach((category) => {
        let assetCount = categoryCounts[category];
        let categoryPercentage = (assetCount / selectedAssetsCount) * 100;
        totalCategoryPercentage += categoryPercentage;

        if (categoryPercentage > maxCategoryPercentage) {
            maxCategoryPercentage = categoryPercentage;
        }

        if (assetCount >= 2) {
            score += (100 / totalCategories) * 0.9;
            scoreFactor_CategoryTwice += (100 / totalCategories) * 0.1;
            scoreFactor_Category += (100 / totalCategories) * 0.1;
        } else {
            score += (100 / totalCategories) * 0.8;
            scoreFactor_Category += (100 / totalCategories) * 0.1;
        }
    });

    score += Math.min(maxAssetsCount, selectedAssetsCount) * (10 / maxAssetsCount);
    scoreFactor_CoinCount = Math.min(maxAssetsCount, selectedAssetsCount) * (10 / maxAssetsCount);

    let averageCategoryAllocation = 100 / Object.keys(categoryCounts).length;
    let maxCategoryAllocation = 0;
    let minCategoryAllocation = 100;

    for (let category in categoryCounts) {
        let allocation = (categoryCounts[category] / selectedAssetsCount) * 100;
        if (allocation > maxCategoryAllocation) {
            maxCategoryAllocation = allocation;
        }
        if (allocation < minCategoryAllocation) {
            minCategoryAllocation = allocation;
        }
    }

    let alloScore = Math.min(10, Math.max(0, 15 - (maxCategoryAllocation - averageCategoryAllocation) / 2.5));
    let alloFactor = ((80 + (alloScore * 2)) / 100);

    let maxCategoryAllocationDiff = 100 / averageCategoryAllocation * maxCategoryAllocation;
    let maxSF = Math.min(1, Math.max(0.8945, 1 - (maxCategoryAllocationDiff - 200) / (600 - 200) * 0.1));
    let minCategoryAllocationDiff = 100 / averageCategoryAllocation * (averageCategoryAllocation - minCategoryAllocation);
    let minSF = Math.min(1, Math.max(0.8945, 1 - (minCategoryAllocationDiff - 50) / (75 - 50) * 0.1));

    scoreFactor_Allocation = (minSF * maxSF) * 50 - 40;

    // BTC FIX
    let totalAmount = 0;
    portfolioData.forEach((item) => {
        let value = parseFloat(item.amount);
        if (!isNaN(value)) {
            totalAmount += value;
        }
    });

    let btcAmount = portfolioData.find(item => item.coin === 'BTC')?.amount || 0;
    let btcAllo = 100 / totalAmount * btcAmount;

    if (btcAllo >= maxCategoryAllocation * 0.8) {
        maxSF = (maxSF + 1.5) / 2.5;
        minSF = (minSF + 1.5) / 2.5;
    }

    score = score * maxSF * minSF;
    score = Math.min(100, score);

    if (totalCategories > Object.keys(categoryCounts).length) {
        score = score * 0.9;
        scoreFactor_CategoryMissing = 0;
    } else {
        scoreFactor_CategoryMissing = 10;
    }

    if (isNaN(score)) {
        score = 0;
    }

    return score.toFixed(1);
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
        return 999;
    }
    const assetRanges = {
        '1-15': [
            { range: ['10.000 - 25.000 €', '25.000 - 50.000 €', '50.000 - 100.000 €'], price: 999 },
            { range: ['100.000 - 200.000 €'], price: 1299 },
            { range: ['200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'], price: 1499 },
        ],
        '16-25': [
            { range: ['10.000 - 25.000 €'], price: 999 },
            { range: ['25.000 - 50.000 €'], price: 1199 },
            { range: ['50.000 - 100.000 €'], price: 1299 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €'], price: 1499 },
            { range: ['400.000 - 750.000 €', '750.000+'], price: 1699 },
        ],
        '26-35': [
            { range: ['10.000 - 25.000 €'], price: 1199 },
            { range: ['25.000 - 50.000 €'], price: 1299 },
            { range: ['50.000 - 100.000 €'], price: 1499 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €'], price: 1699 },
            { range: ['400.000 - 750.000 €', '750.000+'], price: 1899 },
        ],
        '36+': [
            { range: ['10.000 - 25.000 €'], price: 1299 },
            { range: ['25.000 - 50.000 €'], price: 1499 },
            { range: ['50.000 - 100.000 €'], price: 1699 },
            { range: ['100.000 - 200.000 €', '200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'], price: 1899 },
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


export const generateShortId = async (id) => {
    const intId = parseInt(id.slice(0, 8), 16);
    const shortId = hashids.encode(intId);

    return shortId;
}

export async function calculatePotential(portfolio1) {
    let totalPotential = 0;
    let totalAssets = 0;
    let totalSecurity = 0;
    let pMinX = 0;
    let pMaxX = 0;
    let pMinXClean = 0;
    let pMaxXClean = 0;
    let totalAssetsAmount = 0;
    var sAvg = 0;

    portfolio1?.forEach(function(asset) {
        let dataSecurity = parseFloat(asset.Sicherheit);
        let dataPotential = parseFloat(asset.Potential);
        let dataBottom = parseFloat(asset.Bottom);
        let dataEK = parseFloat(asset?.EK);
        if (!dataEK) { dataEK = dataBottom; }
        if (!dataEK) { dataEK = 1; }
        if (!dataBottom) { dataBottom = 1; }

        let assetAmount = parseFloat(asset?.Price || 0);

        if (dataPotential) {
            totalPotential += dataPotential;
            totalSecurity += (parseFloat(dataSecurity) * assetAmount);
            totalAssets += 1;
            totalAssetsAmount += parseFloat(assetAmount);

            if (isNaN(dataSecurity) || isNaN(dataPotential)) {
                pMinX += (1 * assetAmount);
                pMaxX += (10 * assetAmount);
                pMinXClean += (1 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (10 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential >= 9) {
                pMinX += (100 * assetAmount);
                pMaxX += (200 * assetAmount);
                pMinXClean += (100 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (200 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential > 8.5) {
                pMinX += (75 * assetAmount);
                pMaxX += (100 * assetAmount);
                pMinXClean += (75 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (100 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential > 8) {
                pMinX += (50 * assetAmount);
                pMaxX += (75 * assetAmount);
                pMinXClean += (50 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (75 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential > 7.5) {
                pMinX += (30 * assetAmount);
                pMaxX += (50 * assetAmount);
                pMinXClean += (30 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (50 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential > 7) {
                pMinX += (15 * assetAmount);
                pMaxX += (30 * assetAmount);
                pMinXClean += (15 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (30 * assetAmount) / dataEK * dataBottom;
            } else if (dataPotential > 6.7) {
                pMinX += (10 * assetAmount);
                pMaxX += (15 * assetAmount);
                pMinXClean += (10 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (15 * assetAmount) / dataEK * dataBottom;
            } else {
                pMinX += (1 * assetAmount);
                pMaxX += (10 * assetAmount);
                pMinXClean += (1 * assetAmount) / dataEK * dataBottom;
                pMaxXClean += (10 * assetAmount) / dataEK * dataBottom;
            }
        }
    });

    console.log("pMinXClean:", pMinXClean);
    console.log("pMaxXClean:", pMaxXClean);

    return {
        pMinXClean: pMinXClean,
        pMaxXClean: pMaxXClean
    };
}


//
// import { promises as fs } from 'fs';
// import {Assets} from "../lib/models";
//
// const BATCH_SIZE = 50;
//
// export const importAssetsRisk = async () => {
//     try {
//         console.log("starting.............");
//         const dataBuffer = await fs.readFile(
//             "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Assets.json"
//         );
//         const dataString = dataBuffer.toString();
//         const jsonData = JSON.parse(dataString);
//         console.log("jsonData length:", jsonData[2].data.length);
//
//         let index = 0;
//         while (index < jsonData[2].data.length) {
//             const batchData = jsonData[2].data
//                 .slice(index, index + BATCH_SIZE)
//                 .map((item) => ({
//                     ID: item.ID,
//                     Risk: item.Risk || "",
//                 }));
//
//             for (const asset of batchData) {
//                 await Assets.updateOne(
//                     { ID: asset.ID },
//                     { $set: { Risk: asset.Risk } },
//                     { upsert: true }
//                 );
//             }
//
//             console.log(`Batch ${index / BATCH_SIZE + 1} imported successfully`);
//             index += BATCH_SIZE;
//         }
//
//         console.log("Data import complete.");
//     } catch (e) {
//         console.log("Error importing data:", e);
//         throw e;
//     }
// };
//
