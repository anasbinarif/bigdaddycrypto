import { Assets } from "../../../lib/models";
import { NextResponse } from "next/server";
import {connectToDb} from "../../../lib/utils";

export async function GET() {
    connectToDb();
    const assets = await Assets.find();
    return NextResponse.json(assets);
}