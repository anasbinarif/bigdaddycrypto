import { Payments } from "../../../lib/models";
import { connectToDb } from "../../../lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to the database
        await connectToDb();

        // Define the allowed time window
        const allowedStartDate = new Date('2024-07-07T21:00:00+02:00'); // 9 PM, 7th July 2024, Germany time (CEST)
        const allowedEndDate = new Date('2024-07-07T21:15:00+02:00'); // 9:15 PM, 7th July 2024, Germany time (CEST)

        // Get the current date and time in Germany time zone
        const currentDate = new Date();
        const germanyDateFormat = new Intl.DateTimeFormat('de-DE', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const [{ value: day },,{ value: month },,{ value: year },,{ value: hour },,{ value: minute }] = germanyDateFormat.formatToParts(currentDate);
        const currentGermanyDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+02:00`);

        // Log the current Germany date and time for testing
        console.log(`Current Germany Date and Time: ${currentGermanyDate.toISOString()}`);

        // Check if the current time is within the allowed window
        if (currentGermanyDate >= allowedStartDate && currentGermanyDate <= allowedEndDate) {
            const updateResult = await Payments.updateMany(
                {
                    $or: [
                        { Subscription: { $exists: false } },
                        { "Subscription.plan": { $in: [null, ""] } }
                    ]
                },
                { $set: { Subscription: { plan: "free+" } } }
            );

            return NextResponse.json({
                updatedCount: updateResult.modifiedCount
            });
            return NextResponse.json({
                updatedCount: 0
            });
        } else {
            return NextResponse.json({
                message: "Updates are only allowed between 9 PM to 9:15 PM on Sunday, 7th July 2024, Germany time."
            }, { status: 403 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
