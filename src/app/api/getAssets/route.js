import { Assets } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    let assets;
    if (category) {
      assets = await Assets.find({ Category: category });
    } else {
      assets = await Assets.find();
    }
    console.log(assets);
    return NextResponse.json({ data: assets }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: `Error getting Assets from DB ${e}` },
      { status: 500 }
    );
  }
}
