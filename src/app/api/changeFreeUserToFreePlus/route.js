import { Payments } from "../../../lib/models";
import { connectToDb } from "../../../lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();

        // const updateResult = await Payments.updateMany(
        //     { Subscription: { $exists: false } },
        //     { $set: { "Subscription.plan": "free+" }, $setOnInsert: { Subscription: { plan: "free+" } } },
        //     { upsert: true }
        // );
        //
        // return NextResponse.json({
        //     updatedCount: updateResult.modifiedCount
        // });

        return NextResponse.json({
            updatedCount: []
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
