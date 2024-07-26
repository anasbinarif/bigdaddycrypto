// app/api/webhooks/coinbase/route.js
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDb } from '../../../../lib/utils';
import { User, Payments } from '../../../../lib/models';

const COINBASE_COMMERCE_WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

const validateCoinbaseSignature = (req, rawBody, secretKey) => {
    const coinbaseSignature = req.headers.get('x-cc-webhook-signature');
    const generatedSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
    return generatedSignature === coinbaseSignature;
};

const updateSubscriptionStatus = async (webhookEvent) => {
    // Ensure the event object and event.data exist
    if (!webhookEvent || !webhookEvent.event) {
        console.error("[ERROR-coinbase] Missing data object in event");
        return;
    }

    const { event } = webhookEvent;
    const { data } = event;
    const { type: eventType, id: transaction_id, metadata = {}, pricing, timeline, hosted_url, description, name } = data;
    const { user_id: userId, name: userName, email: userEmail } = metadata;

    if (!userId) {
        console.error("[ERROR-coinbase] Missing user ID in metadata");
        return;
    }

    console.log("[INFO-coinbase] Event type:", eventType);
    console.log("[INFO-coinbase] User ID:", userId);

    const user = await User.findById(userId);

    if (!user) {
        console.error("[ERROR-coinbase] User not found for ID:", userId);
        return;
    }

    console.log("[INFO-coinbase] User found:", user.email);
    let paymentRecord = await Payments.findOne({ userId: user._id });

    switch (eventType) {
        case 'charge:confirmed':
            const nextBillingDate = new Date();
            if (description.includes('monthly')) {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            } else if (description.includes('yearly')) {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
            }
            if (name === "One Time Payment") {
                const oneTimePayment = {
                    date: new Date(),
                    price: pricing.local.amount,
                    status: "Paid"
                };

                paymentRecord.oneTimePayment.push(oneTimePayment);
                await paymentRecord.save();
                console.log("[INFO-coinbase] Stored one-time payment details:", paymentRecord._id);
            } else {
                if (paymentRecord) {
                    console.log("[INFO-coinbase] Payment already exists for user:", user._id, "paymentRecord", paymentRecord);
                    paymentRecord.Subscription = {
                        plan: name,
                        planId: data.code,
                        billingCycle: description.includes('monthly') ? 'monthly' : 'yearly',
                        status: "active",
                        paymentMethod: "coinbase",
                        subscriptionId: transaction_id,
                        nextBilledAt: nextBillingDate.getTime(),
                        endDate: null,
                    };
                } else {
                    paymentRecord = new Payments({
                        userId: user._id,
                        Subscription: {
                            plan: name,
                            planId: data.code,
                            billingCycle: description.includes('monthly') ? 'monthly' : 'yearly',
                            status: "active",
                            paymentMethod: "coinbase",
                            subscriptionId: transaction_id,
                            nextBilledAt: nextBillingDate.getTime(),
                            endDate: null,
                        },
                        oneTimePayment: [],
                    });
                }

                await paymentRecord.save();
                console.log("[INFO-coinbase] Stored/Updated subscription payment details:", paymentRecord);

                user.subscribed = true;
                user.currentSubscription = paymentRecord._id;
                user.activated = true;
                await user.save();
                console.log("[INFO-coinbase] User subscription updated:", user.email);
            }
            break;

        case 'charge:failed':
            if (name === "One Time Payment") {
                console.log("[INFO-coinbase] One-time payment failed for user:", user.email);
            } else {
                user.subscribed = false;
                await user.save();
                paymentRecord.Subscription = {
                    plan: "free+",
                    status: "pastDue",
                };
                await paymentRecord.save();
                console.log("[INFO-coinbase] User subscription failed:", user.email);
            }
            break;

        default:
            console.log("[INFO-coinbase] Unhandled event type:", eventType);
    }
};


export async function POST(req) {
    const rawBody = await req.text();
    const webhookEvent = JSON.parse(rawBody);

    console.log("[INFO-coinbase] Received webhook event:", webhookEvent);

    try {
        if (!validateCoinbaseSignature(req, rawBody, COINBASE_COMMERCE_WEBHOOK_SECRET)) {
            console.error("[ERROR-coinbase] Invalid signature");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        console.log("[INFO-coinbase] Valid signature");

        await connectToDb();
        await updateSubscriptionStatus(webhookEvent);
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
        console.error("[ERROR-coinbase] Error processing webhook:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
