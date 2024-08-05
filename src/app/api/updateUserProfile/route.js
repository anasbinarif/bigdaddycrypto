import { NextResponse } from 'next/server';
import {connectToDb} from "../../../lib/utils";
import {Payments, User} from "../../../lib/models";


export async function POST(req) {

    const { userID, paymentPlan, period } = await req.json();

    if (!userID || !paymentPlan || !period) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        await connectToDb();

        const user = await User.findOne({ username: userID });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        let paymentRecord = await Payments.findOne({ userId: user._id });

        if (paymentRecord?.Subscription && paymentRecord.Subscription?.plan) {
            return NextResponse.json({
                message: 'User already has an active subscription',
                subscription: paymentRecord.Subscription,
            });
        }

        const nextBillingDate = new Date();
        if (period === 'monthly') {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else if (period === 'yearly') {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        const newSubscription = {
            plan: paymentPlan,
            billingCycle: period,
            status: 'active',
            paymentMethod: 'admin',
            nextBilledAt: nextBillingDate.getTime(),
            endDate: null,
        };

        if (paymentRecord) {
            paymentRecord.Subscription = newSubscription;
        } else {
            paymentRecord = new Payments({
                userId: user._id,
                Subscription: newSubscription,
                oneTimePayment: [],
            });
        }

        await paymentRecord.save();

        user.subscribed = true;
        user.currentSubscription = paymentRecord._id;
        user.activated = true;
        await user.save();

        return NextResponse.json({ message: 'User profile updated successfully', subscription: newSubscription });
    } catch (error) {
        console.error('[ERROR-admin] Error updating user profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
