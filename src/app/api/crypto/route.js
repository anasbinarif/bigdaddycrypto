import { getAllTickers } from "@/lib/data";
import { NextResponse } from "next/server";
// import connection from "@/lib/database";

// async function testDatabaseConnection() {
//     try {
//         const [result] = connection.query("SELECT VERSION()");
//
//         console.log("Connection successful. MySQL version:", result[0]['VERSION()']);
//     } catch (error) {
//         console.error("Failed to connect to the database:", error.message);
//     } finally {
//         connection.end(); // This is important to close the connection when done testing
//     }
// }

// Utility functions
// async function calculateSMA(prices) {
//     const sum = prices.reduce((acc, price) => acc + price[1], 0);
//     return sum / prices.length;
// }
//
// async function calculateTrendPercentage(currentPrice, sma) {
//     return ((currentPrice - sma) / sma) * 100;
// }

// async function getCoinData(ticker) {
//     const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
//     const url = `https://pro-api.coingecko.com/api/v3/coins/${ticker}/market_chart`;
//     const params = new URLSearchParams({
//         vs_currency: 'eur',
//         days: 800,
//         interval: 'daily',
//         x_cg_pro_api_key: apiKey
//     });

//     try {
//         const response = await fetch(`${url}?${params}`);
//         const data = await response.json();

//         // console.log(`Data received for ${ticker}:`, data.prices);

//         if (data.prices && data.prices.length > 0) {
//             const prices = data.prices;
//             const currentPrice = prices[prices.length - 1][1];
//             const lowestLow = Math.min(...prices.map(price => price[1]));
//             const sma = await calculateSMA(prices);
//             const trendPercentage = await calculateTrendPercentage(currentPrice, sma);
//             await updateCoinData(ticker, lowestLow, currentPrice, trendPercentage);
//         }

//     } catch (error) {
//         console.error(`Error retrieving data for ${ticker}: ${error.message}`);
//     }
// }

// async function updateCoinData(ticker, bottom, cgPrice, trendPercentage) {
//     const sql = `UPDATE Assets SET Bottom = ?, cgPrice = ?, TrendPercentage = ? WHERE CoinGeckoID = ?;`;
//     await connection.query(sql, [bottom, cgPrice, trendPercentage, ticker]);
// }


async function getCoinBottom([category, ticker, cgImageURL, Name, Ticker, Potential, Sicherheit]) {
    const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
    const urlPing = `https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`;

    try {
        const responsePing = await fetch(urlPing);
        if (responsePing.status === 200) {
            const urlPriceData = `https://pro-api.coingecko.com/api/v3/coins/${ticker}/market_chart`;
            const paramsPriceData = new URLSearchParams({
                vs_currency: 'eur',
                days: '800',
                interval: 'daily',
                x_cg_pro_api_key: apiKey
            });

            const responsePriceData = await fetch(`${urlPriceData}?${paramsPriceData.toString()}`);
            if (responsePriceData.ok) {
                const dataPriceData = await responsePriceData.json();
                console.log("responsePriceData", ticker)
                const prices = dataPriceData.prices;

                if (prices && prices.length > 0) {
                    const lowestLow = prices.reduce((min, p) => p[1] < min[1] ? p : min, prices[0]);
                    const highestHigh = prices.reduce((max, p) => p[1] > max[1] ? p : max, prices[0]);

                    const lowestLowDate = new Date(lowestLow[0]).toISOString().split('T')[0];
                    const highestHighDate = new Date(highestHigh[0]).toISOString().split('T')[0];
                    const average200Days = prices.slice(-200).reduce((sum, p) => sum + p[1], 0) / 200;
                    const currentPrice = prices[prices.length - 1][1];
                    const ratioToAvg = currentPrice / average200Days;

                    const marketCapUrl = `https://pro-api.coingecko.com/api/v3/coins/${ticker}?x_cg_pro_api_key=${apiKey}`;
                    const responseMarketCap = await fetch(marketCapUrl);
                    if (responseMarketCap.ok) {
                        const dataMarketCap = await responseMarketCap.json();
                        const marketCap = dataMarketCap.market_data.market_cap.eur;

                        return {
                            "Name": Name,
                            "cgImageURL": cgImageURL,
                            "Ticker": Ticker,
                            "Category": category,
                            "Potential": Potential,
                            "Sicherheit": Sicherheit,
                            "CoinGeckoID": ticker,
                            "Lowest Low": lowestLow[1],
                            "Lowest Low Date": lowestLowDate,
                            "Highest High": highestHigh[1],
                            "Highest High Date": highestHighDate,
                            "200-Day Average Price": average200Days,
                            "Current Price": currentPrice,
                            "Ratio to 200-Day Average": ratioToAvg.toFixed(2),
                            "Current Market Cap (EUR)": marketCap
                        };
                    } else {
                        console.error(`Error retrieving market cap for ${ticker}. HTTP Status Code: ${responseMarketCap.status}`);
                    }
                }
            } else {
                console.error(`Error retrieving price data for ${ticker}. HTTP Status Code: ${responsePriceData.status}`);
            }
        } else {
            console.error(`Error pinging API status. HTTP Status Code: ${responsePing.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}


export async function GET() {
    try {
        const tickers = await getAllTickers();
        const promises = tickers.map(pair => getCoinBottom(pair));
        const data = await Promise.all(promises);
        return new NextResponse(JSON.stringify({ message: 'Data retrieved successfully', data: data, "Current Time": new Date().toISOString() }), { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: `Error occurred while getting coin data ${e}` }, { status: 500 });
    }
}