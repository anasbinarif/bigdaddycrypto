import {NextResponse} from "next/server";
import {UserPortfolio} from "@/lib/models";

export async function POST(req) {
    const { userID, CoinGeckoID, rowVals } = await req.json();
    console.log("debug add buy and sell", CoinGeckoID, userID, rowVals);
    try {
        const result = await UserPortfolio.findOneAndUpdate(
            { userId: userID, 'assets.CoinGeckoID': CoinGeckoID },
            {
                $set: {
                    'assets.$.buyAndSell': rowVals
                }
            },
            { new: true }  // Returns the updated document
        );

        if (!result) {
            return NextResponse.json({ message: 'Portfolio not found or update failed' }, { status: 500 });
        }

        // Return the updated portfolio data
        return new NextResponse(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error in POST API:', error.message);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}