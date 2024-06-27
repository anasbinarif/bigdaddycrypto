import { NextResponse } from "next/server";

export async function POST(req) {
    const berlinTimeZone = "Europe/Berlin";
    const targetDate = new Date(Date.UTC(2024, 6, 10, 12, 0, 0)); // June 27, 2 PM in Berlin time zone (UTC+2 becomes UTC+0)

    try {
        const now = new Date();
        const berlinFormatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: berlinTimeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const berlinNowString = berlinFormatter.formatToParts(now);
        const berlinNow = new Date(
            `${berlinNowString.find(part => part.type === "year").value}-${berlinNowString.find(part => part.type === "month").value}-${berlinNowString.find(part => part.type === "day").value}T${berlinNowString.find(part => part.type === "hour").value}:${berlinNowString.find(part => part.type === "minute").value}:${berlinNowString.find(part => part.type === "second").value}+02:00`
        );

        if (berlinNow < targetDate) {
            return NextResponse.json({ result: false, message: "The target date has not started yet" }, { status: 200 });
        }

        const timeDifference = berlinNow - targetDate;
        const hoursPassed = timeDifference / (1000 * 60 * 60);
        const hoursRemaining = 48 - hoursPassed;

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
