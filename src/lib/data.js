import { Assets, PastBuyAndSell, User } from "../lib/models";
import { connectToDb } from "./utils";
// const fs = require('fs').promises;
import { useSearchParams } from "next/navigation";

const fetchExchangeRates = async () => {
  const response = await fetch(
    "https://api.exchangerate-api.com/v4/latest/EUR"
  ); // Replace with your preferred API
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
  if (price >= 0.01) return parseFloat(price) * rates[currency];
  else {
    let formattedNum = parseFloat(price) * rates[currency];
    console.log(parseFloat(formattedNum));

    return parseFloat(formattedNum);
  }
};

export const categoryColors = {
  AI: "#FFD700", // Gold
  "Web3/Anonymität": "#DC143C", // Crimson
  "Web3/Anonymity": "#DC143C", // Crimson
  DeFi: "#1155bb", // Dark Blue
  "Grüne Coins": "#00aa66", // Green
  "Green Coins": "#00aa66", // Green
  "Gaming/Metaverse": "#00BFFF", // Deep Sky Blue
  "BTC-Zusammenhang": "#FF9900", // Orange
  "BTC-Context": "#FF9900", // Orange
  "CBDC-Netzwerk": "#667788", // Dark Gray
  "CBDC Network": "#667788", // Dark Gray
  ECommerce: "#8833bb", // Dark Magenta
  "E-Commerce": "#8833bb", // Dark Magenta
  "Tokenisierung/RWA": "#ff5aac", // Pink
  "Tokenization/RWA": "#ff5aac", // Pink
  Favourite: "#2E8B57", // Sea Green
  Favorites: "#2E8B57", // Sea Green
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
  USD: "$",
  EUR: "€",
};

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

const BATCH_SIZE = 5000; // Adjust batch size based on performance and timeout constraints

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
    cache: "no-store",
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
        cache: "no-store",
      });
    }

    if (!response.ok) {
      // throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    // console.log(`Fetched assets for category: ${category}`, data);
    return data;
  } catch (error) {
    // console.error("Error fetching assets:", error);
    // throw error;
  }
};

export const storeUserPortfolioCoin = async (userId, coin, token) => {
  // const coinData = setCoinObject(coin);
  const newCoin = {
    CoinGeckoID: coin.CoinGeckoID,
  };
  return fetch("/api/addToPortfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, coin: newCoin }),
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

  // const msg = await res.json();
  // console.log(userId, msg);
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
  if (data1.message == "No portfolio found") {
    return null;
  }
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

  const totalInvestment = data?.assetsCalculations?.assets.reduce(
    (acc, curr) => acc + curr.totalInvest,
    0
  );
  const categoryInvestments = {
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

  data?.assetsCalculations?.assets.forEach((asset) => {
    const { totalInvest } = asset;
    const { Category: categories } = data?.assets.find(
      (asset1) => asset1.CoinGeckoID === asset.CoinGeckoID
    );
    const investmentPerCategory = totalInvest / categories.length;
    console.log(totalInvest, categories);
    categories.forEach((category) => {
      if (!categoryInvestments[category]) {
        categoryInvestments[category] = 0;
      }
      categoryInvestments[category] += investmentPerCategory;
    });
  });

  // console.log(categoryInvestments);

  const categoryShares = {};

  Object.keys(categoryInvestments).forEach((category) => {
    const investment = categoryInvestments[category];
    const percentageShare = (investment / totalInvestment) * 100;
    categoryShares[category] = percentageShare;
  });

  const totalPercentage = Object.values(categoryShares).reduce(
    (sum, percentage) => sum + parseFloat(percentage),
    0
  );
  const factor = 100 / totalPercentage;

  Object.keys(categoryShares).forEach((category) => {
    categoryShares[category] =
      categoryShares[category] * factor > 0.09
        ? (categoryShares[category] * factor).toFixed(2)
        : (categoryShares[category] * factor).toPrecision(2);
  });

  // console.log(categoryShares);

  // console.log(data.assets);
  // console.log(data?.assetsCalculations);
  // console.log(totalInvestment);
  // console.log(categories);
  // console.log(totalCategoryCount);

  // Calculate the total count of assets
  const totalCount = data.assets.length;

  // Calculate initial percentages
  const rawPercentages = {};
  for (const category in categories) {
    rawPercentages[category] =
      (categories[category] / totalCategoryCount) * 100;
  }

  console.log(rawPercentages);

  // Normalize percentages to ensure they sum to 100%
  const normalizedPercentages = {};
  const sumOfRawPercentages = Object.values(rawPercentages).reduce(
    (acc, val) => acc + val,
    0
  );
  for (const category in rawPercentages) {
    normalizedPercentages[category] =
      ((rawPercentages[category] / sumOfRawPercentages) * 100).toFixed(1) + "%";
  }

  return {
    data,
    calculation: {
      counts: categories,
      percentages: normalizedPercentages,
      categoryPercentages: categoryShares,
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
    {
      von: 0,
      bis: 5,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.11 },
        { Wort: worte[1], von: 1.11, bis: 1.33 },
        { Wort: worte[2], von: 1.33, bis: 1.55 },
        { Wort: worte[3], von: 1.55, bis: 1.77 },
        { Wort: worte[4], von: 1.77, bis: 9999 },
      ],
    },
    {
      von: 6,
      bis: 10,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.12 },
        { Wort: worte[1], von: 1.12, bis: 1.38 },
        { Wort: worte[2], von: 1.38, bis: 1.63 },
        { Wort: worte[3], von: 1.63, bis: 1.9 },
        { Wort: worte[4], von: 1.9, bis: 9999 },
      ],
    },
    {
      von: 11,
      bis: 17,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.15 },
        { Wort: worte[1], von: 1.15, bis: 1.46 },
        { Wort: worte[2], von: 1.46, bis: 1.78 },
        { Wort: worte[3], von: 1.78, bis: 2.13 },
        { Wort: worte[4], von: 2.13, bis: 9999 },
      ],
    },
    {
      von: 17,
      bis: 24,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.16 },
        { Wort: worte[1], von: 1.16, bis: 1.51 },
        { Wort: worte[2], von: 1.51, bis: 1.89 },
        { Wort: worte[3], von: 1.89, bis: 2.3 },
        { Wort: worte[4], von: 2.3, bis: 9999 },
      ],
    },
    {
      von: 25,
      bis: 40,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.18 },
        { Wort: worte[1], von: 1.18, bis: 1.56 },
        { Wort: worte[2], von: 1.56, bis: 1.99 },
        { Wort: worte[3], von: 1.99, bis: 2.45 },
        { Wort: worte[4], von: 2.45, bis: 9999 },
      ],
    },
    {
      von: 40,
      bis: 65,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.19 },
        { Wort: worte[1], von: 1.19, bis: 1.61 },
        { Wort: worte[2], von: 1.61, bis: 2.07 },
        { Wort: worte[3], von: 2.07, bis: 2.6 },
        { Wort: worte[4], von: 2.6, bis: 9999 },
      ],
    },
    {
      von: 66,
      bis: 85,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.2 },
        { Wort: worte[1], von: 1.2, bis: 1.67 },
        { Wort: worte[2], von: 1.67, bis: 2.18 },
        { Wort: worte[3], von: 2.18, bis: 2.78 },
        { Wort: worte[4], von: 2.78, bis: 9999 },
      ],
    },
    {
      von: 86,
      bis: 119,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.22 },
        { Wort: worte[1], von: 1.22, bis: 1.72 },
        { Wort: worte[2], von: 1.72, bis: 2.29 },
        { Wort: worte[3], von: 2.29, bis: 2.95 },
        { Wort: worte[4], von: 2.95, bis: 9999 },
      ],
    },
    {
      von: 120,
      bis: 179,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.25 },
        { Wort: worte[1], von: 1.25, bis: 1.84 },
        { Wort: worte[2], von: 1.84, bis: 2.54 },
        { Wort: worte[3], von: 2.54, bis: 3.38 },
        { Wort: worte[4], von: 3.38, bis: 9999 },
      ],
    },
    {
      von: 180,
      bis: 249,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.29 },
        { Wort: worte[1], von: 1.29, bis: 2.03 },
        { Wort: worte[2], von: 2.03, bis: 2.95 },
        { Wort: worte[3], von: 2.95, bis: 4.11 },
        { Wort: worte[4], von: 4.11, bis: 9999 },
      ],
    },
    {
      von: 250,
      bis: 349,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.4 },
        { Wort: worte[1], von: 1.4, bis: 2.53 },
        { Wort: worte[2], von: 2.53, bis: 4.16 },
        { Wort: worte[3], von: 4.16, bis: 6.44 },
        { Wort: worte[4], von: 6.44, bis: 9999 },
      ],
    },
    {
      von: 350,
      bis: 499,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.47 },
        { Wort: worte[1], von: 1.47, bis: 2.86 },
        { Wort: worte[2], von: 2.86, bis: 4.99 },
        { Wort: worte[3], von: 4.99, bis: 8.19 },
        { Wort: worte[4], von: 8.19, bis: 9999 },
      ],
    },
    {
      von: 500,
      bis: 20000,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.6 },
        { Wort: worte[1], von: 1.6, bis: 3.65 },
        { Wort: worte[2], von: 3.65, bis: 7.26 },
        { Wort: worte[3], von: 7.26, bis: 13.36 },
        { Wort: worte[4], von: 13.36, bis: 9999 },
      ],
    },
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
    {
      von: 0,
      bis: 5,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.11 },
        { Wort: worte[1], von: 1.11, bis: 1.28 },
        { Wort: worte[2], von: 1.28, bis: 1.45 },
        { Wort: worte[3], von: 1.45, bis: 1.75 },
        { Wort: worte[4], von: 1.75, bis: 9999 },
      ],
    },
    {
      von: 6,
      bis: 10,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.14 },
        { Wort: worte[1], von: 1.14, bis: 1.3 },
        { Wort: worte[2], von: 1.3, bis: 1.5 },
        { Wort: worte[3], von: 1.5, bis: 1.77 },
        { Wort: worte[4], von: 1.77, bis: 9999 },
      ],
    },
    {
      von: 11,
      bis: 17,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.15 },
        { Wort: worte[1], von: 1.15, bis: 1.31 },
        { Wort: worte[2], von: 1.31, bis: 1.52 },
        { Wort: worte[3], von: 1.52, bis: 1.79 },
        { Wort: worte[4], von: 1.79, bis: 9999 },
      ],
    },
    {
      von: 17,
      bis: 24,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.16 },
        { Wort: worte[1], von: 1.16, bis: 1.32 },
        { Wort: worte[2], von: 1.32, bis: 1.53 },
        { Wort: worte[3], von: 1.53, bis: 1.8 },
        { Wort: worte[4], von: 1.8, bis: 9999 },
      ],
    },
    {
      von: 25,
      bis: 40,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.17 },
        { Wort: worte[1], von: 1.17, bis: 1.33 },
        { Wort: worte[2], von: 1.33, bis: 1.54 },
        { Wort: worte[3], von: 1.54, bis: 1.81 },
        { Wort: worte[4], von: 1.81, bis: 9999 },
      ],
    },
    {
      von: 40,
      bis: 65,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.18 },
        { Wort: worte[1], von: 1.18, bis: 1.34 },
        { Wort: worte[2], von: 1.34, bis: 1.55 },
        { Wort: worte[3], von: 1.55, bis: 1.82 },
        { Wort: worte[4], von: 1.82, bis: 9999 },
      ],
    },
    {
      von: 66,
      bis: 85,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.19 },
        { Wort: worte[1], von: 1.19, bis: 1.35 },
        { Wort: worte[2], von: 1.35, bis: 1.56 },
        { Wort: worte[3], von: 1.56, bis: 1.83 },
        { Wort: worte[4], von: 1.83, bis: 9999 },
      ],
    },
    {
      von: 86,
      bis: 119,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.2 },
        { Wort: worte[1], von: 1.2, bis: 1.36 },
        { Wort: worte[2], von: 1.36, bis: 1.57 },
        { Wort: worte[3], von: 1.57, bis: 1.84 },
        { Wort: worte[4], von: 1.84, bis: 9999 },
      ],
    },
    {
      von: 120,
      bis: 179,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.21 },
        { Wort: worte[1], von: 1.21, bis: 1.37 },
        { Wort: worte[2], von: 1.37, bis: 1.58 },
        { Wort: worte[3], von: 1.58, bis: 1.85 },
        { Wort: worte[4], von: 1.85, bis: 9999 },
      ],
    },
    {
      von: 180,
      bis: 249,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.22 },
        { Wort: worte[1], von: 1.22, bis: 1.38 },
        { Wort: worte[2], von: 1.38, bis: 1.59 },
        { Wort: worte[3], von: 1.59, bis: 1.86 },
        { Wort: worte[4], von: 1.86, bis: 9999 },
      ],
    },
    {
      von: 250,
      bis: 349,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.23 },
        { Wort: worte[1], von: 1.23, bis: 1.39 },
        { Wort: worte[2], von: 1.39, bis: 1.6 },
        { Wort: worte[3], von: 1.6, bis: 1.87 },
        { Wort: worte[4], von: 1.87, bis: 9999 },
      ],
    },
    {
      von: 350,
      bis: 499,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.24 },
        { Wort: worte[1], von: 1.24, bis: 1.4 },
        { Wort: worte[2], von: 1.4, bis: 1.61 },
        { Wort: worte[3], von: 1.61, bis: 1.88 },
        { Wort: worte[4], von: 1.88, bis: 9999 },
      ],
    },
    {
      von: 500,
      bis: 20000,
      Werte: [
        { Wort: worte[0], von: 1, bis: 1.25 },
        { Wort: worte[1], von: 1.25, bis: 1.4 },
        { Wort: worte[2], von: 1.4, bis: 1.61 },
        { Wort: worte[3], von: 1.61, bis: 1.88 },
        { Wort: worte[4], von: 1.88, bis: 9999 },
      ],
    },
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
    const response = await fetch("/api/getUserSubscriptionPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.error || "Failed to fetch subscription plan");
    }

    const respData = await response.json();
    console.log(respData);
    return respData;
  } catch (error) {
    console.error("Error in fetchUserSubscriptionPlan:", error);
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
  none: "none",
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
  AI: "ai",
  "Web3/ Anonymität": "web3",
  DeFi: "defi",
  "Grüne Coins": "green",
  "Gaming/ Metaverse": "metaverse",
  "BTC- Zusammenhang": "btc",
  "CBDC- Netzwerke": "cbdc",
  eCommerce: "ecommerce",
  "Tokenisierung/ RWA": "nft",
};

export const calculateScore = (portfolioData, cals) => {
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

  // Calculate the score based on category distribution
  Object.keys(categoryCounts).forEach((category) => {
    if (category === "none") return; // Ignore the 'none' category

    let assetCount = categoryCounts[category];
    let categoryPercentage = (assetCount / selectedAssetsCount) * 100;
    totalCategoryPercentage += categoryPercentage;

    if (categoryPercentage > maxCategoryPercentage) {
      maxCategoryPercentage = categoryPercentage;
    }
  });

  // Adjust scoreFactor_CategoryTwice based on the rules using cals.counts
  let categoriesWithLessThan2Coins = 0;
  let categoriesWith0Coins = 0;

  Object.keys(cals.counts).forEach((category) => {
    if (category === "none") return; // Ignore the 'none' category

    let assetCount = cals.counts[category];
    if (assetCount < 2) {
      categoriesWithLessThan2Coins++;
      if (assetCount === 0) {
        categoriesWith0Coins++;
      }
    }
  });

  if (categoriesWith0Coins >= 2) {
    scoreFactor_CategoryTwice = 3; // If 2 or more categories have 0 coins
  } else if (categoriesWithLessThan2Coins > 0) {
    scoreFactor_CategoryTwice = 2; // If even one category has less than 2 coins
  } else {
    scoreFactor_CategoryTwice = 1; // If Min 2 coins added to portfolio from every coin category
  }

  // Adjust scoreFactor_CategoryMissing based on the rules using cals.counts
  let missingCategories = 0;

  Object.keys(cals.counts).forEach((category) => {
    if (category === "none") return; // Ignore the 'none' category

    let assetCount = cals.counts[category];
    if (assetCount === 0) {
      missingCategories++;
    }
  });

  if (missingCategories >= 2) {
    scoreFactor_CategoryMissing = 3; // If 2 or more categories are not selected
  } else if (missingCategories > 0) {
    scoreFactor_CategoryMissing = 2; // If even one category is not selected
  } else {
    scoreFactor_CategoryMissing = 1; // If coins from all categories are selected
  }

  score +=
    Math.min(maxAssetsCount, selectedAssetsCount) * (10 / maxAssetsCount);
  const totalAssets = portfolioData.length;

  if (totalAssets >= 20 && totalAssets <= 40) {
    scoreFactor_CoinCount = 1;
  } else if (totalAssets >= 15 && totalAssets < 20) {
    scoreFactor_CoinCount = 2;
  } else if (totalAssets >= 10 && totalAssets < 15) {
    scoreFactor_CoinCount = 3;
  } else {
    scoreFactor_CoinCount = 4;
  }

  // Calculate the scoreFactor_Allocation using cals.percentages
  let percentages = Object.entries(cals.percentages)
    .filter(([category, percentage]) => category !== "none")
    .map(([category, percentage]) => parseFloat(percentage.replace("%", "")));

  let maxPercentage = Math.max(...percentages);
  let minPercentage = Math.min(...percentages);

  let allocationDifference = maxPercentage - minPercentage;

  if (totalAssets == 0) {
    scoreFactor_Allocation = 1;
  } else if (allocationDifference >= 8) {
    scoreFactor_Allocation = 1;
  } else if (allocationDifference >= 5) {
    scoreFactor_Allocation = 2;
  } else {
    scoreFactor_Allocation = 3;
  }

  // Calculate the scoreFactor_Category using cals.percentages
  let lowestCategoryPercentage = Math.min(...percentages.filter((p) => p > 0));

  if (totalAssets == 0) {
    scoreFactor_Category = 4;
  } else if (percentages.every((percentage) => percentage === 0)) {
    scoreFactor_Category = 4; // No coin selected
  } else if (lowestCategoryPercentage > 10) {
    scoreFactor_Category = 1; // All categories >10%
  } else if (lowestCategoryPercentage >= 7) {
    scoreFactor_Category = 2; // 7% to 10%
  } else if (lowestCategoryPercentage >= 5) {
    scoreFactor_Category = 3; // 5% to 7%
  } else {
    scoreFactor_Category = 4; // <5%
  }

  // Calculate BTC allocation fix
  let totalAmount = 0;
  portfolioData.forEach((item) => {
    let value = parseFloat(item.amount);
    if (!isNaN(value)) {
      totalAmount += value;
    }
  });

  let btcAmount =
    portfolioData.find((item) => item.coin === "BTC")?.amount || 0;
  let btcAllo = (100 / totalAmount) * btcAmount;

  let maxSF = 1;
  let minSF = 1;

  if (btcAllo >= maxPercentage * 0.8) {
    maxSF = (maxSF + 1.5) / 2.5;
    minSF = (minSF + 1.5) / 2.5;
  }

  // Final score calculation
  score = score * maxSF * minSF;
  score = Math.min(100, score);

  if (isNaN(score)) {
    score = 0;
  }

  return {
    score: score.toFixed(1),
    scoreFactor_Category: scoreFactor_Category.toFixed(0),
    scoreFactor_CategoryTwice: scoreFactor_CategoryTwice.toFixed(0),
    scoreFactor_CategoryMissing: scoreFactor_CategoryMissing.toFixed(0),
    scoreFactor_Allocation: scoreFactor_Allocation.toFixed(0),
    scoreFactor_CoinCount: scoreFactor_CoinCount.toFixed(0),
  };
};

// export const calculateScore = (portfolioData) => {
//   const totalCategories = 9;
//   let selectedAssetsCount = 0;
//   let categoryCounts = {};
//   // Count the occurrences of each category in the portfolio
//   portfolioData.forEach((item) => {
//     item.Category.forEach((category) => {
//       if (!categoryCounts[category]) {
//         categoryCounts[category] = 0;
//       }
//       categoryCounts[category]++;
//     });
//     selectedAssetsCount++;
//   });
//   let scoreFactor_Category = 0;
//   let scoreFactor_CategoryTwice = 0;
//   let scoreFactor_Allocation = 0;
//   let scoreFactor_CoinCount = 0;
//   let scoreFactor_CategoryMissing = 0;
//   let maxCategoryPercentage = 0;
//   let totalCategoryPercentage = 0;
//   // Calculate the score based on category distribution
//   Object.keys(categoryCounts).forEach((category) => {
//     let assetCount = categoryCounts[category];
//     let categoryPercentage = (assetCount / selectedAssetsCount) * 100;
//     totalCategoryPercentage += categoryPercentage;
//     if (categoryPercentage > maxCategoryPercentage) {
//       maxCategoryPercentage = categoryPercentage;
//     }
//     if (assetCount >= 2) {
//       scoreFactor_Category += (100 / totalCategories) * 0.1;
//     } else {
//       scoreFactor_Category += (100 / totalCategories) * 0.1;
//     }
//   });
//   // Adjust scoreFactor_Category based on the rules
//   if (maxCategoryPercentage > 10) {
//     scoreFactor_Category = 10; // Green
//   } else if (maxCategoryPercentage >= 7) {
//     scoreFactor_Category = 7; // Orange
//   } else if (maxCategoryPercentage >= 5) {
//     scoreFactor_Category = 5; // Light Red
//   } else {
//     scoreFactor_Category = 4; // Dark Red
//   }
//   // Calculate scoreFactor_CategoryTwice based on double coverage
//   let categoryWithLessThan2Coins = 0;
//   let categoryWithZeroCoins = 0;
//   Object.keys(categoryCounts).forEach((category) => {
//     let assetCount = categoryCounts[category];
//     if (assetCount < 2) {
//       categoryWithLessThan2Coins++;
//     }
//     if (assetCount === 0) {
//       categoryWithZeroCoins++;
//     }
//   });
//   if (categoryWithZeroCoins >= 2) {
//     scoreFactor_CategoryTwice = 2; // Red
//   } else if (categoryWithLessThan2Coins > 0) {
//     scoreFactor_CategoryTwice = 7; // Orange
//   } else {
//     scoreFactor_CategoryTwice = 10; // Green
//   }
//   // Calculate scoreFactor_CategoryMissing based on missing categories
//   const missingCategoriesCount = totalCategories - Object.keys(categoryCounts).length;
//   if (missingCategoriesCount >= 2) {
//     scoreFactor_CategoryMissing = 2; // Red
//   } else if (missingCategoriesCount > 0) {
//     scoreFactor_CategoryMissing = 7; // Orange
//   } else {
//     scoreFactor_CategoryMissing = 10; // Green
//   }
//   // Calculate scoreFactor_CoinCount based on the number of coins
//   if (selectedAssetsCount < 10 || selectedAssetsCount > 40) {
//     scoreFactor_CoinCount = 2; // Red
//   } else if (selectedAssetsCount >= 10 && selectedAssetsCount < 15) {
//     scoreFactor_CoinCount = 7; // Orange
//   } else if (selectedAssetsCount >= 15 && selectedAssetsCount < 20) {
//     scoreFactor_CoinCount = 8; // Yellow
//   } else {
//     scoreFactor_CoinCount = 10; // Green
//   }
//   let averageCategoryAllocation = 100 / Object.keys(categoryCounts).length;
//   let maxCategoryAllocation = 0;
//   let minCategoryAllocation = 100;
//   for (let category in categoryCounts) {
//     let allocation = (categoryCounts[category] / selectedAssetsCount) * 100;
//     if (allocation > maxCategoryAllocation) {
//       maxCategoryAllocation = allocation;
//     }
//     if (allocation < minCategoryAllocation) {
//       minCategoryAllocation = allocation;
//     }
//   }
//   // Calculate scoreFactor_Allocation based on the difference in % share
//   let allocationDifference = maxCategoryAllocation - minCategoryAllocation;
//   if (allocationDifference >= 8) {
//     scoreFactor_Allocation = 2; // Red
//   } else if (allocationDifference >= 5) {
//     scoreFactor_Allocation = 7; // Orange
//   } else {
//     scoreFactor_Allocation = 10; // Green
//   }
//   // Calculate BTC allocation fix
//   let totalAmount = 0;
//   portfolioData.forEach((item) => {
//     let value = parseFloat(item.amount);
//     if (!isNaN(value)) {
//       totalAmount += value;
//     }
//   });
//   return {
//     // score: score.toFixed(1),
//     scoreFactor_Category: scoreFactor_Category.toFixed(0),
//     scoreFactor_CategoryTwice: scoreFactor_CategoryTwice.toFixed(0),
//     scoreFactor_CategoryMissing: scoreFactor_CategoryMissing.toFixed(0),
//     scoreFactor_Allocation: scoreFactor_Allocation.toFixed(0),
//     scoreFactor_CoinCount: scoreFactor_CoinCount.toFixed(0),
//   };
// };

export const calculateScore0 = (portfolioData) => {
  const scores = { Honey: 65, Gut: 50.75, OK: 36.5, Naja: 22.5, Teuer: 8 };
  const assets = portfolioData?.assets;
  const assetCalculations = portfolioData?.assetsCalculations?.assets;

  console.log(portfolioData);
  let score65 = 0;
  let score35 = 0;
  const coinsPercentages = [];

  const totalInvest = assetCalculations.reduce((acc, curr) => {
    console.log(curr.CoinGeckoID, curr.totalInvest);
    return acc + curr?.totalInvest;
  }, 0);
  console.log(totalInvest);

  const tags = {};
  assets.forEach((asset) => {
    const rank = asset?.BottomRanking;
    const xWert = +((1 / asset?.Bottom) * asset?.Price).toFixed(2);
    const filterTag = bewerteAssetExtremPessimistisch(rank, xWert);
    console.log(asset.Name, filterTag);
    tags[asset?.CoinGeckoID] = filterTag;
  });

  console.log(tags);

  assetCalculations.forEach((asset, index) => {
    let score =
      asset?.buyAndSell?.length > 0 ? asset.totalInvest / totalInvest : 0;
    coinsPercentages.push(score);
    console.log(score);
    score = score * scores[tags[asset.CoinGeckoID]];
    score65 += score;
    console.log(asset.CoinGeckoID, score);
  });

  console.log(score65);
  console.log(coinsPercentages);

  const categoryInvestments = {
    ai: 0,
    metaverse: 0,
    defi: 0,
    web3: 0,
    green: 0,
    btc: 0,
    cbdc: 0,
    ecommerce: 0,
    nft: 0,
  };

  assetCalculations.forEach((asset) => {
    const { totalInvest } = asset;
    const { Category: categories } = assets.find(
      (asset1) => asset1.CoinGeckoID === asset.CoinGeckoID
    );
    const investmentPerCategory = totalInvest / categories.length;
    console.log(totalInvest, categories);
    categories.forEach((category) => {
      if (!categoryInvestments[category]) {
        categoryInvestments[category] = 0;
      }
      categoryInvestments[category] += investmentPerCategory;
    });
  });

  console.log(categoryInvestments);

  const categoryShares = {};

  Object.keys(categoryInvestments).forEach((category) => {
    const investment = categoryInvestments[category];
    console.log(investment);
    const percentageShare = (investment / totalInvest) * 100;
    categoryShares[category] = percentageShare;
  });

  const totalPercentage = Object.values(categoryShares).reduce(
    (sum, percentage) => sum + parseFloat(percentage),
    0
  );
  const factor = 100 / totalPercentage;

  Object.keys(categoryShares).forEach((category) => {
    categoryShares[category] =
      categoryShares[category] * factor > 0.09
        ? (categoryShares[category] * factor).toFixed(2)
        : (categoryShares[category] * factor).toPrecision(2);
  });

  console.log(categoryShares);

  let leastVal = 100,
    mostVal = 0,
    above10 = 0,
    above8 = 0,
    above5 = 0;

  Object.values(categoryShares).forEach((val) => {
    if (leastVal > parseFloat(val)) leastVal = parseFloat(val);
    if (mostVal < parseFloat(val)) mostVal = parseFloat(val);
    if (parseFloat(val) >= 10) above10++;
    if (parseFloat(val) >= 8) above8++;
    if (parseFloat(val) >= 5) above5++;
  });

  if (leastVal === 100) leastVal = 0;
  const diff = mostVal - leastVal;

  console.log(diff, above10, above8, above5);

  score35 =
    above10 === 9 && diff <= 8
      ? 35
      : above10 === 9 && diff > 8
      ? 27
      : above8 === 9 && diff <= 10
      ? 20
      : above8 === 9 && diff > 10
      ? 15
      : above5 < 8 && above5 >= 1
      ? 10
      : 0;

  console.log(score35);

  return score65 + score35;

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

  // Calculate the score based on category distribution
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

  // Calculate the score based on the number of selected assets
  score +=
    Math.min(maxAssetsCount, selectedAssetsCount) * (10 / maxAssetsCount);
  scoreFactor_CoinCount =
    Math.min(maxAssetsCount, selectedAssetsCount) * (10 / maxAssetsCount);

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

  // Calculate allocation score
  let alloScore = Math.min(
    10,
    Math.max(0, 15 - (maxCategoryAllocation - averageCategoryAllocation) / 2.5)
  );
  let alloFactor = (80 + alloScore * 2) / 100;

  let maxCategoryAllocationDiff =
    (100 / averageCategoryAllocation) * maxCategoryAllocation;
  let maxSF = Math.min(
    1,
    Math.max(
      0.8945,
      1 - ((maxCategoryAllocationDiff - 200) / (600 - 200)) * 0.1
    )
  );
  let minCategoryAllocationDiff =
    (100 / averageCategoryAllocation) *
    (averageCategoryAllocation - minCategoryAllocation);
  let minSF = Math.min(
    1,
    Math.max(0.8945, 1 - ((minCategoryAllocationDiff - 50) / (75 - 50)) * 0.1)
  );

  scoreFactor_Allocation = minSF * maxSF * 50 - 40;

  // Calculate BTC allocation fix
  let totalAmount = 0;
  portfolioData.forEach((item) => {
    let value = parseFloat(item.amount);
    if (!isNaN(value)) {
      totalAmount += value;
    }
  });

  let btcAmount =
    portfolioData.find((item) => item.coin === "BTC")?.amount || 0;
  let btcAllo = (100 / totalAmount) * btcAmount;

  if (btcAllo >= maxCategoryAllocation * 0.8) {
    maxSF = (maxSF + 1.5) / 2.5;
    minSF = (minSF + 1.5) / 2.5;
  }

  // Final score calculation
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

  return {
    score: score.toFixed(1),
    // scoreFactor_Category: scoreFactor_Category.toFixed(0),
    // scoreFactor_CategoryTwice: scoreFactor_CategoryTwice.toFixed(0),
    // scoreFactor_CategoryMissing: scoreFactor_CategoryMissing.toFixed(0),
    // scoreFactor_Allocation: scoreFactor_Allocation.toFixed(0),
    // scoreFactor_CoinCount: scoreFactor_CoinCount.toFixed(0),
  };
};
