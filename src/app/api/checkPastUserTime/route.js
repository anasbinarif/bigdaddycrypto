import { DateTime } from "luxon";
import { NextResponse } from "next/server";

export async function POST(req) {
    const berlinTimeZone = "Europe/Berlin";
    const targetDateUTC = DateTime.fromISO("2024-07-01T18:45:00Z");

    try {
        // Get the current time in Berlin
        const berlinNow = DateTime.now().setZone(berlinTimeZone);
        console.log("berlinNow111", berlinNow.toString(), "targetDateUTC", targetDateUTC.toString());

        if (berlinNow < targetDateUTC) {
            return NextResponse.json({ result: false, message: "The target date has not started yet" }, { status: 200 });
        }

        const timeDifference = berlinNow.diff(targetDateUTC, 'hours').hours;
        const hoursPassed = timeDifference;
        const hoursRemaining = 48 - hoursPassed;
        console.log("hoursPassed", hoursPassed);

        if (hoursPassed > 48) {
            return NextResponse.json({ result: false }, { status: 200 });
        } else {
            return NextResponse.json({ result: true, hoursRemaining: hoursRemaining.toFixed(2) }, { status: 200 });
        }
    } catch (e) {
        console.log("Error during time check:", e);
        return NextResponse.json({ message: "Error occurred while checking the time" }, { status: 500 });
    }
}
