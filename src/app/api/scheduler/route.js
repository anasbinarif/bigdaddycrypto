import { NextResponse } from 'next/server';
import { UserPortfolio } from "../../../lib/models";
import { updateCoinDetailsCron } from "../../../lib/action";

export async function POST(req) {
    console.log('######################################');
    console.log('# Running scheduler action           #');
    console.log('######################################');

    try {
        // Fetch all user portfolios
        const portfolios = await UserPortfolio.find({});
        
        // Collect all unique CoinGeckoIDs
        const coinGeckoIDs = [...new Set(portfolios.flatMap(portfolio => portfolio.assets.map(asset => asset.CoinGeckoID)))];

        // Update coin details
        await updateCoinDetailsCron(coinGeckoIDs);

        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
