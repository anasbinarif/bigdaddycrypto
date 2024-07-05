import { DateTime } from "luxon";
import { NextResponse } from "next/server";

export async function POST(req) {
  const berlinTimeZone = "Europe/Berlin";
  const targetDate = DateTime.fromISO("2024-07-07T18:00:00", {
    zone: berlinTimeZone,
  });

  try {
    // Get the current time in Berlin
    const berlinNow = DateTime.now().setZone(berlinTimeZone);
    console.log(
      "berlinNow",
      berlinNow.toString(),
      "targetDate",
      targetDate.toString()
    );

    if (berlinNow < targetDate) {
      return NextResponse.json(
        {
          result: true,
          message: "It is before 6 pm Sunday 7 July 2024 (German time)",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          result: false,
          message: "It is past 6 pm Sunday 7 July 2024 (German time)",
        },
        { status: 200 }
      );
    }
  } catch (e) {
    console.log("Error during time check:", e);
    return NextResponse.json(
      { message: "Error occurred while checking the time" },
      { status: 500 }
    );
  }
}
