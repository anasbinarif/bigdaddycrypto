// app/api/webhooks/copecart/route.js
import { connectToDb } from '../../../../lib/utils';
import { User, Payments } from '../../../../lib/models';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const COPECART_SECRET_KEY = "wbQ6MU5Q@4i%c!8MaQyL";

export async function GET(req) {
    await connectToDb();
    console.log("app/api/webhooks/copecart/route.js");

    const rawBody = await req.text();
    const copecartSignature = req.headers.get('x-copecart-signature');

    const generateSignature = (data, secret) => {
        return crypto.createHmac('sha256', secret).update(data).digest('base64');
    };

    const isValidSignature = (body, signature, secret) => {
        const generatedSignature = generateSignature(body, secret);
        return generatedSignature === signature;
    };

    if (!isValidSignature(rawBody, copecartSignature, COPECART_SECRET_KEY)) {
        return NextResponse.json({ error: 'Invalid signature copecart' }, { status: 400 });
    }

    try {
        const { event, data } = JSON.parse(rawBody);

        if (event === 'payment.made') {
            console.log("app/api/webhooks/copecart/route.js", data);
            const userId = data.custom_fields?.user_id;
            const planId = data.product_id;
            const billingCycle = data.frequency;
            const paymentStatus = data.payment_status;
            const transactionId = data.transaction_id;
            const transactionAmount = data.transaction_amount;
            const transactionDate = data.transaction_date;

            if (!userId || !planId || !transactionId) {
                return NextResponse.json({ error: 'Missing user ID, plan ID, or transaction ID' }, { status: 400 });
            }

            const user = await User.findById(userId);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Update user subscription status
            user.subscribed = true;
            user.currentSubscription = planId;
            user.activated = true;
            // await user.save();

            // Store payment details
            const payment = new Payments({
                userId,
                Subscription: {
                    plan: planId,
                    billingCycle,
                    status: paymentStatus,
                    subscriptionId: transactionId,
                    nextBilledAt: new Date(transactionDate).getTime() + 30 * 24 * 60 * 60 * 1000, // assuming monthly billing
                    endDate: null,
                },
                oneTimePayment: [{
                    date: new Date(transactionDate),
                    price: transactionAmount,
                    status: paymentStatus === 'paid' ? 'Paid' : 'Pending',
                }],
            });
            // await payment.save();

            return NextResponse.json({ message: 'Subscription updated successfully' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Event received but not handled' }, { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
