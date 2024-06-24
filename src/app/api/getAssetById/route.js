import { Assets } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    try {
        const asset = await Assets.find({ CoinGeckoID: id });
        return NextResponse.json({ asset: asset }, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { message: `Error getting Asset from DB ${e}` },
            { status: 500 }
        );
    }
}