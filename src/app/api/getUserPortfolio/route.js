import { Portfolio } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {userId} = await req.json();

    try {
        const portfolio = await Portfolio.findOne({userId: userId})
        // console.log("portfolioGenerator------", portfolio);
        return NextResponse.json({ data: portfolio }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error getting user portfolio ${e}` }, { status: 500 });
    }
}