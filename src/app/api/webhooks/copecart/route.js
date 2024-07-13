// app/api/webhooks/copecart/route.js
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDb } from '../../../../lib/utils';
import { User, Payments } from '../../../../lib/models';

const COPECART_SECRET_KEY = "wbQ6MU5Q@4i%c!8MaQyL";

const validateCopeCartSignature = (req, rawBody) => {
    const copecartSignature = req.headers.get('x-copecart-signature');
    const generatedSignature = crypto.createHmac('sha256', COPECART_SECRET_KEY).update(rawBody).digest('base64');
    return generatedSignature === copecartSignature;
};

const updateSubscriptionStatus = async (event) => {
    const { event_type: eventType, buyer_email: buyerEmail, product_id: productId, product_name: productName, frequency, payment_status, transaction_id, transaction_amount, transaction_date, payment_plan } = event;

    console.log("[INFO] Event type:", eventType);
    console.log("[INFO] Buyer email:", buyerEmail);
    console.log("[INFO] Product ID:", productId);
    console.log("[INFO] Product name:", productName);
    console.log("[INFO] Payment plan:", payment_plan);
    console.log("[INFO] Payment status:", payment_status);

    const user = await User.findOne({ email: buyerEmail });

    if (!user) {
        console.error("[ERROR] User not found for email:", buyerEmail);
        return;
    }

    console.log("[INFO] User found:", user.email);

    // Map product names to plan
    const planMapping = {
        "Pro Abonnement": "Pro",
        "Premium Abonnement": "Premium"
    };

    const plan = planMapping[productName];

    switch (eventType) {
        case 'payment.made':
            if (plan && payment_plan === 'abonement') {
                const nextBillingDate = new Date(transaction_date);
                if (frequency === 'monthly') {
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                } else if (frequency === 'yearly') {
                    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                }

                const payment = new Payments({
                    userId: user._id,
                    Subscription: {
                        plan: plan,
                        planId: productId,
                        billingCycle: frequency,
                        status: payment_status,
                        subscriptionId: transaction_id,
                        nextBilledAt: nextBillingDate.getTime(),
                        endDate: null,
                    },
                });
                await payment.save();
                console.log("[INFO] Stored subscription payment details:", payment._id);

                user.subscribed = true;
                user.currentSubscription = payment._id;
                user.activated = true;
                await user.save();
                console.log("[INFO] User subscription updated:", user.email);
            } else if (payment_plan !== 'abonement') {
                const paymentRecord = await Payments.findOne({ userId: user._id }) || new Payments({ userId: user._id, oneTimePayment: [] });
                const oneTimePayment = {
                    date: new Date(transaction_date),
                    price: transaction_amount,
                    status: payment_status === 'paid' ? 'Paid' : 'Pending'
                };

                paymentRecord.oneTimePayment.push(oneTimePayment);
                await paymentRecord.save();
                console.log("[INFO] Stored one-time payment details:", paymentRecord._id);
            }
            break;

        case 'payment.failed':
            user.subscribed = false;
            user.currentSubscription = null;
            await user.save();
            console.log("[INFO] User subscription failed:", user.email);
            break;

        // Handle other events as necessary

        default:
            console.log("[INFO] Unhandled event type:", eventType);
    }
};

export async function POST(req) {
    const rawBody = await req.text();
    const webhookEvent = JSON.parse(rawBody);

    console.log("[INFO] Received webhook event:", webhookEvent);

    try {
        if (!validateCopeCartSignature(req, rawBody)) {
            console.error("[ERROR] Invalid signature");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        console.log("[INFO] Valid signature");

        await connectToDb();
        await updateSubscriptionStatus(webhookEvent);
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
        console.error("[ERROR] Error processing webhook:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Route segment config
// export const runtime = 'nodejs';
// export const preferredRegion = 'auto';
