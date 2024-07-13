// app/api/webhooks/copecart/route.js
import { connectToDb } from '../../../../lib/utils';
import { User, Payments } from '../../../../lib/models';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const COPECART_SECRET_KEY = "wbQ6MU5Q@4i%c!8MaQyL";

export async function POST(req) {
    await connectToDb();
    console.log("[INFO] Received IPN request");

    const rawBody = await req.text();
    const copecartSignature = req.headers.get('x-copecart-signature');

    console.log("[DEBUG] Raw body:", rawBody);
    console.log("[DEBUG] CopeCart Signature:", copecartSignature);

    const generateSignature = (data, secret) => {
        return crypto.createHmac('sha256', secret).update(data).digest('base64');
    };

    const isValidSignature = (body, signature, secret) => {
        const generatedSignature = generateSignature(body, secret);
        console.log("[DEBUG] Generated Signature:", generatedSignature);
        return generatedSignature === signature;
    };

    if (!isValidSignature(rawBody, copecartSignature, COPECART_SECRET_KEY)) {
        console.error("[ERROR] Invalid signature");
        return NextResponse.json({ error: 'Invalid signature copecart' }, { status: 400 });
    }

    try {
        const { event, data } = JSON.parse(rawBody);

        console.log("[INFO] Event type:", event);

        if (event === 'payment.made') {
            console.log("[INFO] Processing payment.made event", data);
            const userId = data.custom_fields?.user_id;
            const planId = data.product_id;
            const billingCycle = data.frequency;
            const paymentStatus = data.payment_status;
            const transactionId = data.transaction_id;
            const transactionAmount = data.transaction_amount;
            const transactionDate = data.transaction_date;

            if (!userId || !planId || !transactionId) {
                console.error("[ERROR] Missing user ID, plan ID, or transaction ID");
                return NextResponse.json({ error: 'Missing user ID, plan ID, or transaction ID' }, { status: 400 });
            }

            const user = await User.findById(userId);
            if (!user) {
                console.error("[ERROR] User not found:", userId);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Update user subscription status
            user.subscribed = true;
            user.currentSubscription = planId;
            user.activated = true;
            // await user.save();
            console.log("[INFO] Updated user subscription status:", userId);

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
            console.log("[INFO] Stored payment details:", payment._id);

            return NextResponse.json({ message: 'Subscription updated successfully' }, { status: 200 });
        }

        console.log("[INFO] Event not handled:", event);
        return NextResponse.json({ message: 'Event received but not handled' }, { status: 200 });
    } catch (error) {
        console.error("[ERROR] Error processing webhook:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
