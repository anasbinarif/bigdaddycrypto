import { Assets, PastBuyAndSell, PastPortfolio, User } from "../lib/models";
import { connectToDb } from "./utils";
// const fs = require('fs').promises;

export const categoryColors = {
    "AI": '#FFD700', // Gold
    "Web3/Anonymität": '#DC143C', // Crimson
    "DeFi": '#1155bb', // Dark Blue
    "Grüne Coins": '#00aa66', // Green
    "Gaming/Metaverse": '#00BFFF', // Deep Sky Blue
    "BTC-Zusammenhang": '#FF9900', // Orange
    "CBDC-Netzwerke": '#667788', // Dark Gray
    "ECommerce": '#8833bb', // Dark Magenta
    "Tokenisierung/RWA": '#ff5aac', // Pink
    "Favourite": '#2E8B57' // Sea Green
};

export const getUser = async (id) => {
    try {
        await connectToDb()
        return await User.findById(id)
    } catch (e) {
        console.log(e)
    }
}

export const getUsers = async () => {
    try {
        await connectToDb()
        return await User.find()
    } catch (e) {
        console.log(e)
    }
}

export const importCryptoData = async (cryptoData) => {
    try {
        await connectToDb();
        // Insert many entries to the database from an array of data
        // const result = await Assets.insertMany(cryptoData);
        console.log("Data imported successfully");
    } catch (e) {
        console.log("Error importing data:", e);
    }
};

const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};


const BATCH_SIZE = 5000; // Adjust batch size based on performance and timeout constraints

export const importPortfolio = async () => {
    try {
        console.log("starting.............");
        const dataBuffer = await fs.readFile('C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Portfolio_Assets_Transfer.json');
        const dataString = dataBuffer.toString();
        const jsonData = JSON.parse(dataString);
        console.log("jsonData length:", jsonData[2].data.length);

        let index = 0;
        while (index < jsonData[2].data.length) {
            const batchData = jsonData[2].data.slice(index, index + BATCH_SIZE).map(item => ({
                ID: parseInt(item.ID, 10),
                PortfolioAssetID: parseFloat(item.PortfolioAssetID),
                Type: item.Type,
                Date: isValidDate(item.Date) ? new Date(item.Date) : new Date(),
                PricePerCoin: parseFloat(item.PricePerCoin),
                Betrag: parseFloat(item.Betrag),
                Coins: parseFloat(item.Coins),
            }));

            const results = await PastBuyAndSell.insertMany(batchData);
            console.log(`Batch ${index / BATCH_SIZE + 1} imported successfully`);
            index += BATCH_SIZE;
        }

        console.log('Data import complete.');
    } catch (e) {
        console.log("Error importing data:", e);
        throw e;
    }
};


export const getAllTickers = async () => {
    try {
        // Assuming 'Category' is the field name where categories are stored in your database
        const assets = await Assets.find({}, 'CoinGeckoID Category cgImageURL Name Ticker Potential Sicherheit -_id');
        return assets.map(asset => [asset.Category, asset.CoinGeckoID, asset.cgImageURL, asset.Name, asset.Ticker, asset.Potential, asset.Sicherheit]);
    } catch (error) {
        console.error("Failed to fetch CoinGeckoIDs and Categories:", error);
        throw error;
    }
};

export const getCoinData = async () => {
    const res = await fetch('/api/crypto', { next: { revalidate: 3600 } }, { cache: 'force-cache' })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export const getAssets = async () => {
    const res = await fetch('/api/getAssets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    // console.log("yoo bro", data);
    return await data;
}

export const storeUserPortfolioCoin = async (userId, coin) => {
    // const coinData = setCoinObject(coin);
    const newCoin = {
        CoinGeckoID: coin.CoinGeckoID
    }
    console.log("ya raha coin", newCoin)
    return fetch('/api/addToPortfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, coin: newCoin })
    });
}

export const getUserPortfolio = async (userId) => {
    const res = await fetch('/api/getUserPortfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        cache: 'force-cache',
    });

    if (!res.ok) {
        // throw new Error('Failed to fetch data');
        console.log('Failed to fetch data')
    }
    const categories = {
        ai: 0,
        metaverse: 0,
        defi: 0,
        web3: 0,
        green: 0,
        btc: 0,
        cbdc: 0,
        ecommerce: 0,
        nft: 0,
        none: 0
    };
    const data1 = await res.json();
    const data = {
        assets: data1.data.assetDetails,
        assetsCalculations: data1.data.portfolio
    }
    console.log("data_testing_new_login", data1);
    let count = 0;
    await data.assets.forEach(asset => {
        const category = asset.Category.toLowerCase();
        count++;
        if (categories.hasOwnProperty(category)) {
            categories[category]++;
        } else {
            console.log("category not found");
        }
    });
    // console.log("countttttt", count);

    // Calculate the total count of assets
    const totalCount = data.assets.length;

    // Calculate percentages
    const percentages = {};
    for (const category in categories) {
        percentages[category] = (categories[category] / totalCount * 100).toFixed(2) + '%';
    }


    return {
        data,
        calculation: {
            counts: categories,
            percentages: percentages
        }
    };
};


export const setCoinObject = (coin) => {
    return {
        Name: coin["Name"],
        Ticker: coin["Ticker"],
        Category: coin["Category"],
        Potential: coin["Potential"],
        Sicherheit: coin["Sicherheit"],
        MarketCap: coin["Current Market Cap (EUR)"],
        Bottom: coin["Lowest Low"],
        TrueBottom: null,
        BottomDate: new Date(coin["Lowest Low Date"]),
        Top: coin["Highest High"],
        TopDate: new Date(coin["Highest High Date"]),
        BottomRanking: null,
        Price: coin["Current Price"],
        LastPriceUpdate: new Date(),
        CoinGeckoID: coin["CoinGeckoID"],
        cgPrice: coin["Current Price"],
        cgImageURL: coin["cgImageURL"],
        TrendPercentage: null,
        reflinkBitvavo: "",
        reflinkBitpanda: "",
        reflinkMexc: "",
        reflinkKucoin: "",
        UserHolding: 0
    };
}

// export const setCoinObject = (coin) => {
//     return {
//         Name: coin["Name"],
//         Ticker: coin["Ticker"],
//         Category: coin["Category"],
//         Potential: coin["Potential"],
//         Sicherheit: coin["Sicherheit"],
//         MarketCap: coin["Current Market Cap (EUR)"],
//         Bottom: coin["lowestLow24hr"],
//         Top: coin["highestHigh24hr"],
//         Price: coin["Current Price"],
//         LastPriceUpdate: new Date(),
//         CoinGeckoID: coin["CoinGeckoID"],
//         cgPrice: coin["Current Price"],
//         cgImageURL: coin["cgImageURL"],
//         TrendPercentage: null,
//         reflinkBitvavo: "",
//         reflinkBitpanda: "",
//         reflinkMexc: "",
//         reflinkKucoin: "",
//         UserHolding: 0
//     };
// }

export const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
        case 'ai': return '#FFD700';
        case 'metaverse': return '#00BFFF';
        case 'defi': return '#1155bb';
        case 'web3': return '#DC143C';
        case 'green': return '#00aa66';
        case 'btc': return '#FF9900';
        case 'cbdc': return '#667788';
        case 'ecommerce': return '#8833bb';
        case 'nft': return '#ff5aac';
        case 'none': return '#00BFFF';
        default: return '#ffffff';
    }
};

export const categoriesDisplay = {
    "ai": 'AI',
    "web3": 'Web3/ Anonymität',
    "defi": 'DeFi',
    "green": 'Grüne Coins',
    "metaverse": 'Gaming/ Metaverse',
    "btc": 'BTC- Zusammenhang',
    "cbdc": 'CBDC- Netzwerke',
    "ecommerce": 'eCommerce',
    "nft": 'Tokenisierung/ RWA',
};