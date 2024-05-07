import {Assets} from "@/lib/models";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const assets = await Assets.find();
        return NextResponse.json({ data: assets }, { status: 200 });
    }catch (e) {
        return NextResponse.json({ message: `Error getting Assets from DB ${e}` }, { status: 500 });
    }
}