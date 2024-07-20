// pages/api/updateUserSubscriptions.js
import { NextResponse } from 'next/server';
import { connectToDb } from '../../../lib/utils'; // Adjust the path based on your project structure
import { User, Payments } from '../../../lib/models'; // Adjust the path based on your project structure

// const usersToUpdate = [
//     { email: 'fleurdesel@me.com', plan: 'Pro', billingCycle: 'yearly' },
//     // { email: 'timsondermann@gmx.ch', plan: 'Pro', billingCycle: 'monthly' }
// ];
const usersToUpdate = [
];

export async function GET(req) {
    try {
        await connectToDb();

        const results = [];
        for (const { email, plan, billingCycle } of usersToUpdate) {
            const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
            if (!user) {
                results.push({ email, error: 'User not found' });
                continue;
            }

            const nextBillingDate = new Date();
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

            let paymentRecord = await Payments.findOne({ userId: user._id });

            paymentRecord.Subscription = {
                plan,
                planId: 'manual_update',
                billingCycle,
                status: "active",
                paymentMethod: "copecart",
                subscriptionId: 'manual_update',
                nextBilledAt: nextBillingDate.getTime(),
                endDate: null,
            };

            await paymentRecord.save();
            console.log(`Stored/Updated subscription payment details for ${email}:`, paymentRecord);

            user.subscribed = true;
            user.currentSubscription = paymentRecord._id;
            user.activated = true;
            await user.save();
            console.log(`User subscription updated for ${email}:`, user.email);

            results.push({ email, payments: paymentRecord });
        }

        return NextResponse.json(
            { message: 'User subscription updates completed', results },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating subscriptions:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}