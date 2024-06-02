import {Assets, PastBuyAndSell, User} from "../lib/models";
import {connectToDb} from "./utils";
// const fs = require('fs').promises;
import { useSearchParams } from "next/navigation";

const fetchExchangeRates = async () => {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/EUR"); // Replace with your preferred API
    if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
    }
    return response.json();
};

export const getCurrencyAndRates = async () => {
    const rates = await fetchExchangeRates();

    return { rates: rates.rates };
};

export const convertPrice = (price, currency, rates) => {
    if (!rates || !rates[currency]) {
        return parseFloat(price); // Ensure price is a number
    }
    return (parseFloat(price) * rates[currency]).toFixed(2);
};


export const categoryColors = {
  AI: "#FFD700", // Gold
  "Web3/Anonymität": "#DC143C", // Crimson
  DeFi: "#1155bb", // Dark Blue
  "Grüne Coins": "#00aa66", // Green
  "Gaming/Metaverse": "#00BFFF", // Deep Sky Blue
  "BTC-Zusammenhang": "#FF9900", // Orange
  "CBDC-Netzwerke": "#667788", // Dark Gray
  ECommerce: "#8833bb", // Dark Magenta
  "Tokenisierung/RWA": "#ff5aac", // Pink
  Favourite: "#2E8B57", // Sea Green
};

export const categoryColorsNew = {
  ai: "#FFD700", // Gold
  web3: "#DC143C", // Crimson
  defi: "#1155bb", // Dark Blue
  green: "#00aa66", // Green
  metaverse: "#00BFFF", // Deep Sky Blue
  btc: "#FF9900", // Orange
  cbdc: "#667788", // Dark Gray
  ecommerce: "#8833bb", // Dark Magenta
  nft: "#ff5aac", // Pink
  Favourite: "#2E8B57", // Sea Green
  none: "#00BFFF",
};

export const currencySign = {
    "USD": "$",
    "EUR": "€"
}

export const getUser = async (id) => {
  try {
    await connectToDb();
    return await User.findById(id);
  } catch (e) {
    console.log(e);
  }
};

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
          PricePerCoin: parseFloat(item.PricePerCoin),
          Betrag: parseFloat(item.Betrag),
          Coins: parseFloat(item.Coins),
        }));

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

export const getAllTickers = async () => {
  try {
    // Assuming 'Category' is the field name where categories are stored in your database
    const assets = await Assets.find(
      {},
      "CoinGeckoID Category cgImageURL Name Ticker Potential Sicherheit -_id"
    );
    return assets.map((asset) => [
      asset.Category,
      asset.CoinGeckoID,
      asset.cgImageURL,
      asset.Name,
      asset.Ticker,
      asset.Potential,
      asset.Sicherheit,
    ]);
  } catch (error) {
    console.error("Failed to fetch CoinGeckoIDs and Categories:", error);
    throw error;
  }
};

export const getCoinData = async () => {
  const res = await fetch(
    "/api/crypto",
    { next: { revalidate: 3600 } },
    { cache: "force-cache" }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export const getAssetTest = async () => {
  try {
    const res = await fetch("/api/assets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    // Filter assets with Sicherheit and Potential not null
    return data.filter(
      (asset) => asset.Sicherheit !== null && asset.Potential !== null
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllAssets = async () => {
  const res = await fetch(`/api/getAssets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return await data;
};

export const getAssets = async (category, userId) => {
  try {
    let response;

    if (category === "favourite") {
      response = await fetch("/api/getFavoritiesCoins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ userId }),
      });
    } else {
      response = await fetch(`/api/getAssets?category=${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log(`Fetched assets for category: ${category}`, data);
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};


export const storeUserPortfolioCoin = async (userId, coin) => {
  // const coinData = setCoinObject(coin);
  const newCoin = {
    CoinGeckoID: coin.CoinGeckoID,
  };
  console.log("ya raha coin", newCoin);
  return fetch("/api/addToPortfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, coin: newCoin }),
  });
};

export const UpdateCryptoCoins = async (userId) => {
  return await fetch("/api/crypto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
    cache: "no-store",
  });
};

export const getUserPortfolio = async (userId) => {
    const res = await fetch("/api/getUserPortfolio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        cache: "no-store",
    });

    if (!res.ok) {
        console.log("Failed to fetch data");
        return null;
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
        none: 0,
    };

    const data1 = await res.json();
    const data = {
        assets: data1?.data.assetDetails,
        assetsCalculations: data1?.data.portfolio,
    };

    let totalCategoryCount = 0;

    data.assets.forEach((asset) => {
        asset.Category.forEach((category) => {
            const lowerCategory = category.toLowerCase();
            if (categories.hasOwnProperty(lowerCategory)) {
                categories[lowerCategory]++;
                totalCategoryCount++;
            } else {
                console.log("category not found:", category);
            }
        });
    });

    // Calculate the total count of assets
    const totalCount = data.assets.length;

    // Calculate initial percentages
    const rawPercentages = {};
    for (const category in categories) {
        rawPercentages[category] =
            ((categories[category] / totalCategoryCount) * 100);
    }

    // Normalize percentages to ensure they sum to 100%
    const normalizedPercentages = {};
    const sumOfRawPercentages = Object.values(rawPercentages).reduce((acc, val) => acc + val, 0);
    for (const category in rawPercentages) {
        normalizedPercentages[category] =
            ((rawPercentages[category] / sumOfRawPercentages) * 100).toFixed(2) + "%";
    }

    return {
        data,
        calculation: {
            counts: categories,
            percentages: normalizedPercentages,
        },
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
    UserHolding: 0,
  };
};

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
    case "ai":
      return "#FFD700";
    case "metaverse":
      return "#00BFFF";
    case "defi":
      return "#1155bb";
    case "web3":
      return "#DC143C";
    case "green":
      return "#00aa66";
    case "btc":
      return "#FF9900";
    case "cbdc":
      return "#667788";
    case "ecommerce":
      return "#8833bb";
    case "nft":
      return "#ff5aac";
    case "none":
      return "#00BFFF";
    default:
      return "#ffffff";
  }
};

export const bewerteAssetExtremPessimistisch = (rank, xWert) => {
  const worte = ["Honey", "Gut", "OK", "Naja", "Teuer"];

  const gruppen = [
    { von: 0, bis: 5, Werte: [
        { Wort: worte[0], von: 1, bis: 1.11 },
        { Wort: worte[1], von: 1.11, bis: 1.33 },
        { Wort: worte[2], von: 1.33, bis: 1.55 },
        { Wort: worte[3], von: 1.55, bis: 1.77 },
        { Wort: worte[4], von: 1.77, bis: 9999 }
      ]
    },
    { von: 6, bis: 10, Werte: [
        { Wort: worte[0], von: 1, bis: 1.12 },
        { Wort: worte[1], von: 1.12, bis: 1.38 },
        { Wort: worte[2], von: 1.38, bis: 1.63 },
        { Wort: worte[3], von: 1.63, bis: 1.90 },
        { Wort: worte[4], von: 1.90, bis: 9999 }
      ]
    },
    { von: 11, bis: 17, Werte: [
        { Wort: worte[0], von: 1, bis: 1.15 },
        { Wort: worte[1], von: 1.15, bis: 1.46 },
        { Wort: worte[2], von: 1.46, bis: 1.78 },
        { Wort: worte[3], von: 1.78, bis: 2.13 },
        { Wort: worte[4], von: 2.13, bis: 9999 }
      ]
    },
    { von: 17, bis: 24, Werte: [
        { Wort: worte[0], von: 1, bis: 1.16 },
        { Wort: worte[1], von: 1.16, bis: 1.51 },
        { Wort: worte[2], von: 1.51, bis: 1.89 },
        { Wort: worte[3], von: 1.89, bis: 2.3 },
        { Wort: worte[4], von: 2.3, bis: 9999 }
      ]
    },
    { von: 25, bis: 40, Werte: [
        { Wort: worte[0], von: 1, bis: 1.18 },
        { Wort: worte[1], von: 1.18, bis: 1.56 },
        { Wort: worte[2], von: 1.56, bis: 1.99 },
        { Wort: worte[3], von: 1.99, bis: 2.45 },
        { Wort: worte[4], von: 2.45, bis: 9999 }
      ]
    },
    { von: 40, bis: 65, Werte: [
        { Wort: worte[0], von: 1, bis: 1.19 },
        { Wort: worte[1], von: 1.19, bis: 1.61 },
        { Wort: worte[2], von: 1.61, bis: 2.07 },
        { Wort: worte[3], von: 2.07, bis: 2.6 },
        { Wort: worte[4], von: 2.6, bis: 9999 }
      ]
    },
    { von: 66, bis: 85, Werte: [
        { Wort: worte[0], von: 1, bis: 1.20 },
        { Wort: worte[1], von: 1.20, bis: 1.67 },
        { Wort: worte[2], von: 1.67, bis: 2.18 },
        { Wort: worte[3], von: 2.18, bis: 2.78 },
        { Wort: worte[4], von: 2.78, bis: 9999 }
      ]
    },
    { von: 86, bis: 119, Werte: [
        { Wort: worte[0], von: 1, bis: 1.22 },
        { Wort: worte[1], von: 1.22, bis: 1.72 },
        { Wort: worte[2], von: 1.72, bis: 2.29 },
        { Wort: worte[3], von: 2.29, bis: 2.95 },
        { Wort: worte[4], von: 2.95, bis: 9999 }
      ]
    },
    { von: 120, bis: 179, Werte: [
        { Wort: worte[0], von: 1, bis: 1.25 },
        { Wort: worte[1], von: 1.25, bis: 1.84 },
        { Wort: worte[2], von: 1.84, bis: 2.54 },
        { Wort: worte[3], von: 2.54, bis: 3.38 },
        { Wort: worte[4], von: 3.38, bis: 9999 }
      ]
    },
    { von: 180, bis: 249, Werte: [
        { Wort: worte[0], von: 1, bis: 1.29 },
        { Wort: worte[1], von: 1.29, bis: 2.03 },
        { Wort: worte[2], von: 2.03, bis: 2.95 },
        { Wort: worte[3], von: 2.95, bis: 4.11 },
        { Wort: worte[4], von: 4.11, bis: 9999 }
      ]
    },
    { von: 250, bis: 349, Werte: [
        { Wort: worte[0], von: 1, bis: 1.40 },
        { Wort: worte[1], von: 1.40, bis: 2.53 },
        { Wort: worte[2], von: 2.53, bis: 4.16 },
        { Wort: worte[3], von: 4.16, bis: 6.44 },
        { Wort: worte[4], von: 6.44, bis: 9999 }
      ]
    },
    { von: 350, bis: 499, Werte: [
        { Wort: worte[0], von: 1, bis: 1.47 },
        { Wort: worte[1], von: 1.47, bis: 2.86 },
        { Wort: worte[2], von: 2.86, bis: 4.99 },
        { Wort: worte[3], von: 4.99, bis: 8.19 },
        { Wort: worte[4], von: 8.19, bis: 9999 }
      ]
    },
    { von: 500, bis: 20000, Werte: [
        { Wort: worte[0], von: 1, bis: 1.6 },
        { Wort: worte[1], von: 1.6, bis: 3.65 },
        { Wort: worte[2], von: 3.65, bis: 7.26 },
        { Wort: worte[3], von: 7.26, bis: 13.36 },
        { Wort: worte[4], von: 13.36, bis: 9999 }
      ]
    }
  ];

  for (let gruppe of gruppen) {
    if (rank >= gruppe.von && rank <= gruppe.bis) {
      for (let wert of gruppe.Werte) {
        if (xWert >= wert.von && xWert <= wert.bis) {
          const index = worte.indexOf(wert.Wort);
          return wert.Wort;
        }
      }
    }
  }

  return "N/A";
};

export const bewerteAssetSpaeteinsteiger = (rank, xWert) => {
  const worte = ["Honey", "Gut", "OK", "Naja", "Teuer"];

  const gruppen = [
    { von: 0, bis: 5, Werte: [
        { Wort: worte[0], von: 1, bis: 1.11 },
        { Wort: worte[1], von: 1.11, bis: 1.28 },
        { Wort: worte[2], von: 1.28, bis: 1.45 },
        { Wort: worte[3], von: 1.45, bis: 1.75 },
        { Wort: worte[4], von: 1.75, bis: 9999 }
      ]
    },
    { von: 6, bis: 10, Werte: [
        { Wort: worte[0], von: 1, bis: 1.14 },
        { Wort: worte[1], von: 1.14, bis: 1.3 },
        { Wort: worte[2], von: 1.3, bis: 1.5 },
        { Wort: worte[3], von: 1.5, bis: 1.77 },
        { Wort: worte[4], von: 1.77, bis: 9999 }
      ]
    },
    { von: 11, bis: 17, Werte: [
        { Wort: worte[0], von: 1, bis: 1.15 },
        { Wort: worte[1], von: 1.15, bis: 1.31 },
        { Wort: worte[2], von: 1.31, bis: 1.52 },
        { Wort: worte[3], von: 1.52, bis: 1.79 },
        { Wort: worte[4], von: 1.79, bis: 9999 }
      ]
    },
    { von: 17, bis: 24, Werte: [
        { Wort: worte[0], von: 1, bis: 1.16 },
        { Wort: worte[1], von: 1.16, bis: 1.32 },
        { Wort: worte[2], von: 1.32, bis: 1.53 },
        { Wort: worte[3], von: 1.53, bis: 1.8 },
        { Wort: worte[4], von: 1.8, bis: 9999 }
      ]
    },
    { von: 25, bis: 40, Werte: [
        { Wort: worte[0], von: 1, bis: 1.17 },
        { Wort: worte[1], von: 1.17, bis: 1.33 },
        { Wort: worte[2], von: 1.33, bis: 1.54 },
        { Wort: worte[3], von: 1.54, bis: 1.81 },
        { Wort: worte[4], von: 1.81, bis: 9999 }
      ]
    },
    { von: 40, bis: 65, Werte: [
        { Wort: worte[0], von: 1, bis: 1.18 },
        { Wort: worte[1], von: 1.18, bis: 1.34 },
        { Wort: worte[2], von: 1.34, bis: 1.55 },
        { Wort: worte[3], von: 1.55, bis: 1.82 },
        { Wort: worte[4], von: 1.82, bis: 9999 }
      ]
    },
    { von: 66, bis: 85, Werte: [
        { Wort: worte[0], von: 1, bis: 1.19 },
        { Wort: worte[1], von: 1.19, bis: 1.35 },
        { Wort: worte[2], von: 1.35, bis: 1.56 },
        { Wort: worte[3], von: 1.56, bis: 1.83 },
        { Wort: worte[4], von: 1.83, bis: 9999 }
      ]
    },
    { von: 86, bis: 119, Werte: [
        { Wort: worte[0], von: 1, bis: 1.2 },
        { Wort: worte[1], von: 1.2, bis: 1.36 },
        { Wort: worte[2], von: 1.36, bis: 1.57 },
        { Wort: worte[3], von: 1.57, bis: 1.84 },
        { Wort: worte[4], von: 1.84, bis: 9999 }
      ]
    },
    { von: 120, bis: 179, Werte: [
        { Wort: worte[0], von: 1, bis: 1.21 },
        { Wort: worte[1], von: 1.21, bis: 1.37 },
        { Wort: worte[2], von: 1.37, bis: 1.58 },
        { Wort: worte[3], von: 1.58, bis: 1.85 },
        { Wort: worte[4], von: 1.85, bis: 9999 }
      ]
    },
    { von: 180, bis: 249, Werte: [
        { Wort: worte[0], von: 1, bis: 1.22 },
        { Wort: worte[1], von: 1.22, bis: 1.38 },
        { Wort: worte[2], von: 1.38, bis: 1.59 },
        { Wort: worte[3], von: 1.59, bis: 1.86 },
        { Wort: worte[4], von: 1.86, bis: 9999 }
      ]
    },
    { von: 250, bis: 349, Werte: [
        { Wort: worte[0], von: 1, bis: 1.23 },
        { Wort: worte[1], von: 1.23, bis: 1.39 },
        { Wort: worte[2], von: 1.39, bis: 1.6 },
        { Wort: worte[3], von: 1.6, bis: 1.87 },
        { Wort: worte[4], von: 1.87, bis: 9999 }
      ]
    },
    { von: 350, bis: 499, Werte: [
        { Wort: worte[0], von: 1, bis: 1.24 },
        { Wort: worte[1], von: 1.24, bis: 1.4 },
        { Wort: worte[2], von: 1.4, bis: 1.61 },
        { Wort: worte[3], von: 1.61, bis: 1.88 },
        { Wort: worte[4], von: 1.88, bis: 9999 }
      ]
    },
    { von: 500, bis: 20000, Werte: [
        { Wort: worte[0], von: 1, bis: 1.25 },
        { Wort: worte[1], von: 1.25, bis: 1.4 },
        { Wort: worte[2], von: 1.4, bis: 1.61 },
        { Wort: worte[3], von: 1.61, bis: 1.88 },
        { Wort: worte[4], von: 1.88, bis: 9999 }
      ]
    }
  ];

  for (let gruppe of gruppen) {
    if (rank >= gruppe.von && rank <= gruppe.bis) {
      for (let wert of gruppe.Werte) {
        if (xWert >= wert.von && xWert <= wert.bis) {
          const index = worte.indexOf(wert.Wort);
          return wert.Wort;
        }
      }
    }
  }

  return "N/A";
};

export async function fetchUserSubscriptionPlan(userId) {
    try {
        const response = await fetch('/api/getUserSubscriptionPlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        console.log("fetchUserSubscriptionPlan");

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch subscription plan');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchUserSubscriptionPlan:', error);
        throw error;
    }
}




export const categoriesDisplay1 = {
  ai: "AI",
  web3: "Web3/Anonymität",
  defi: "DeFi",
  green: "Grüne Coins",
  metaverse: "Gaming/Metaverse",
  btc: "BTC-Zusammenhang",
  cbdc: "CBDC-Netzwerke",
  ecommerce: "eCommerce",
  nft: "Tokenisierung/RWA",
};

export const categoriesDisplay = {
  ai: "AI",
  web3: "Web3/ Anonymität",
  defi: "DeFi",
  green: "Grüne Coins",
  metaverse: "Gaming/ Metaverse",
  btc: "BTC- Zusammenhang",
  cbdc: "CBDC- Netzwerke",
  ecommerce: "eCommerce",
  nft: "Tokenisierung/ RWA",
};

export const reverseCategoriesDisplay = {
    "AI": "ai",
    "Web3/ Anonymität": "web3",
    "DeFi": "defi",
    "Grüne Coins": "green",
    "Gaming/ Metaverse": "metaverse",
    "BTC- Zusammenhang": "btc",
    "CBDC- Netzwerke": "cbdc",
    "eCommerce": "ecommerce",
    "Tokenisierung/ RWA": "nft",
};

