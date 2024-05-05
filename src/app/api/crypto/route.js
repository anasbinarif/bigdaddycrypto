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


async function getCoinBottom123([category, ticker, cgImageURL, Name, Ticker, Potential, Sicherheit]){
    const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
    const marketCapUrl = `https://pro-api.coingecko.com/api/v3/coins/${ticker}?x_cg_pro_api_key=${apiKey}`;
    const res =  await fetch(marketCapUrl);

    const res_price = `https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=eur`
    const res_price_data = await fetch(res_price, { cache: 'no-store' });
    const price_data = await res_price_data.json();
    if (ticker === "bitcoin") console.log("bitcoin_wtf", price_data)
    if (res.ok){
        const data = await res.json();
        const currentPrice = data['market_data']['current_price']['eur'];
        const marketCapEUR = data.market_data.market_cap.eur;
        const volumeEUR = data.market_data.total_volume.eur;
        const lowestLow24hr = data.market_data.low_24h.eur;
        const highestHigh24hr = data.market_data.high_24h.eur;
        const price_change_percentage_200d_in_currency = data.market_data.price_change_percentage_200d_in_currency.eur;
        return {
            "Name": Name,
            "cgImageURL": cgImageURL,
            "Ticker": Ticker,
            "Category": category,
            "Potential": Potential,
            "Sicherheit": Sicherheit,
            "CoinGeckoID": ticker,
            "volumeEUR": volumeEUR,
            "lowestLow24hr": lowestLow24hr,
            "highestHigh24hr": highestHigh24hr,
            "price_change_percentage_200d_in_currency": price_change_percentage_200d_in_currency,
            "Current Price": currentPrice,
            "Current Market Cap (EUR)": marketCapEUR
        }
    }
}

async function getCoinBottom([category, ticker, cgImageURL, Name, Ticker, Potential, Sicherheit]) {
    const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
    const urlPing = `https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`;

    try {
        // const responsePing = await fetch(urlPing);
        if (true) {
            const urlPriceData = `https://pro-api.coingecko.com/api/v3/coins/${ticker}/market_chart`;
            const paramsPriceData = new URLSearchParams({
                vs_currency: 'eur',
                days: '800',
                interval: 'daily',
                x_cg_pro_api_key: apiKey
            });

            const responsePriceData = await fetch(`${urlPriceData}?${paramsPriceData.toString()}`, { cache: 'no-store' });
            if (responsePriceData.ok) {
                const dataPriceData = await responsePriceData.json();
                // console.log("responsePriceData", ticker)
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
                    // const responseMarketCap = await fetch(marketCapUrl, { cache: 'no-store' });
                    if (true) {
                        // const dataMarketCap = await responseMarketCap.json();
                        // const currentPrice = dataMarketCap['market_data']['current_price']['eur']
                        // const ratioToAvg = currentPrice / average200Days;
                        // const marketCap = dataMarketCap.market_data.market_cap.eur;
                        // if (ticker === "bitcoin") console.log("bitcoin-xxx1", currentPrice)
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
                            "Current Market Cap (EUR)": 0
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
        const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
        const urlPing = `https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`;
        const responsePing = await fetch(urlPing);
        if (responsePing.status === 200){
            const tickers = await getAllTickers();
            const promises = tickers.map(pair => getCoinBottom(pair).catch(error => ({ error, pair }))); // Handle errors individually
            const results = await Promise.allSettled(promises);
            const data = results.map(result => result.status === 'fulfilled' ? result.value : result.reason);

            // console.log("Results:", data);
            return new NextResponse(JSON.stringify({ message: 'Data retrieved successfully', data: data, "Current Time": new Date().toISOString() }), { status: 200 });
        }
    } catch (e) {
        console.error("Error in GET function:", e);
        return NextResponse.json({ message: `Error occurred while getting coin data ${e}` }, { status: 500 });
    }
}