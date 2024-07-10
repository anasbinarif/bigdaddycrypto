import { NextResponse } from "next/server";

export async function GET(req) {
    try{
        const { searchParams } = req.nextUrl;
        const coinGeckoID = searchParams.get("id");

        if (!coinGeckoID) {
            return NextResponse.json(
                { message: "Missing id parameter" },
                { status: 400 }
            );
        }else {
            const apiKey = "CG-XAPzMYbZ8Q8KoqGdwscqrr6f";
            const url = `https://pro-api.coingecko.com/api/v3/coins/${coinGeckoID}/market_chart`;
            const params = new URLSearchParams({
                vs_currency: "eur",
                days: "800",
                interval: "daily",
                x_cg_pro_api_key: apiKey,
            });
            const response = await fetch(`${url}?${params.toString()}`, {
                cache: "no-store",
            });
            if (response.ok) {
                const data = await response.json();
                const prices = data.prices;
                if (prices.length > 0) {
                    const lowestPrice = Math.min(...prices.map(price => price[1]));
                    const currentPrice = (prices[prices.length - 1][1]).toFixed(3);
                    const res = await fetch(`https://pro-api.coingecko.com/api/v3/coins/${coinGeckoID}?x_cg_pro_api_key=CG-XAPzMYbZ8Q8KoqGdwscqrr6f`);
                    const data = await res.json();
                    // const cgPrice = data?.market_data.current_price.eur;
                    const cgImageURL = data?.image.large;
                    return NextResponse.json({data: {cgImageURL, lowestPrice, currentPrice}}, {status: 200});


                }
            } else {
                return NextResponse.json(
                    { message: `Error getting Assets details from coingecko ${e}` },
                    { status: 500 }
                );
            }
        }
    }
    catch (e) {
        return NextResponse.json(
            { message: `Error getting Assets details from coingecko ${e}` },
            { status: 500 }
        );
    }
}