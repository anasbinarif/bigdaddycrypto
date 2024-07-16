import { connectToDb } from "../../../lib/utils";
import { Payments, User } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    await connectToDb();
    const user = await User.findById(userId).exec();

    const payment = await Payments.findOne({ userId: userId }).populate(
      "userId"
    );

    if (!payment?.Subscription && user?.pastUser !== "") {
      return NextResponse.json({ plan: 'free+', payment: null });
    }

    if (!payment || !payment?.Subscription) {
      return NextResponse.json({ plan: 'free', payment: null });
    }
    if (!payment.Subscription) {
      return NextResponse.json({ plan: 'free', payment: payment });
    }

    if (payment?.Subscription.paymentMethod === "coinbase" && payment.Subscription.status === "active") {
      const currentTime = Date.now();
      const nextBilledAt = payment.Subscription.nextBilledAt;
      const isPastDue = currentTime > nextBilledAt + 48 * 60 * 60 * 1000;

      if (isPastDue) {
        payment.Subscription.status = "pastDue";
        payment.Subscription.plan = "free+";
        await payment.save();

        user.subscribed = false;
        // user.currentSubscription = null;
        await user.save();

        return NextResponse.json({ plan: 'free+', payment: payment });
      } else if (currentTime > nextBilledAt){
        const tempTime = nextBilledAt + 48 * 60 * 60 * 1000 - currentTime;
        return NextResponse.json({ plan: payment.Subscription.plan || "free+", payment, paymentPending: tempTime});
      }
    }

    return NextResponse.json({ plan: payment.Subscription.plan || "free+", payment });
  } catch (error) {
    console.error('Error fetching user subscription plan:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
