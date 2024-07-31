import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = req.nextUrl;
        const coinGeckoID = searchParams.get("id");

        if (!coinGeckoID) {
            return NextResponse.json(
                { message: "Missing id parameter" },
                { status: 400 }
            );
        } else {
            const apiKey = "CG-GWJG7fZ6uzrBUGmEWmUVi6q4";
            const url = `https://pro-api.coingecko.com/api/v3/coins/${coinGeckoID}/market_chart`;
            const params = new URLSearchParams({
                vs_currency: "eur",
                days: "800",
                interval: "daily",
                x_cg_pro_api_key: apiKey,
            });

            // Log the URL for debugging
            console.log("Request URL:", `${url}?${params.toString()}`);

            const response = await fetch(`${url}?${params.toString()}`, {
                cache: "no-store",
            });

            if (response.status === 401) {
                return NextResponse.json(
                    { message: "Unauthorized: Invalid API key or insufficient permissions." },
                    { status: 401 }
                );
            }

            if (response.ok) {
                const data = await response.json();
                const prices = data?.prices;

                if (prices.length > 0) {
                    const lowestPrice = Math.min(...prices.map(price => price[1]));
                    return NextResponse.json(
                        { data: { lowestPrice } },
                        { status: 200 }
                    );
                } else {
                    return NextResponse.json(
                        { message: "No price data available." },
                        { status: 404 }
                    );
                }
            } else {
                return NextResponse.json(
                    { message: `Error getting assets details from CoinGecko. Status: ${response.status}` },
                    { status: response.status }
                );
            }
        }
    } catch (e) {
        return NextResponse.json(
            { message: `Error getting assets details from CoinGecko: ${e.message}` },
            { status: 500 }
        );
    }
}
