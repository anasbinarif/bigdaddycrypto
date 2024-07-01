// pages/api/getUserSubscriptionPlan.js

import { connectToDb } from "../../../lib/utils";
import { Payments, User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const user = await User.findById(userId).exec();

    await connectToDb();

    const payment = await Payments.findOne({ userId: userId }).populate(
      "userId"
    );

    // console.log(payment.Subscription);

    if (!payment && user.pastUser !== "") {
      return NextResponse.json({ plan: "free+", payment: null });
    }
    // console.log(payment.Subscription);

    if (!payment || !payment.Subscription) {
      return NextResponse.json({ plan: "free", payment: null });
    }
    // console.log(payment.Subscription);

    if (!payment.Subscription) {
      return NextResponse.json({ plan: "free", payment: payment });
    }
    // console.log(payment.Subscription);

    return NextResponse.json({ plan: payment.Subscription.plan, payment });
  } catch (error) {
    console.error("Error fetching user subscription plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
