import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { connectToDb } from "../../../lib/utils";
import { Payments } from "../../../lib/models";

const payPalClient = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET
));

const getAccessToken = async () => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Accept-Language': 'en_US'
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        console.error("Error fetching access token from PayPal:", response.status, response.statusText);
        const errorDetails = await response.text();
        throw new Error(`Failed to get access token: ${errorDetails}`);
    }

    const data = await response.json();
    return data.access_token;
};

const validatePayPalSignature = async (req, rawBody) => {
    const transmissionId = req.headers.get('paypal-transmission-id');
    const transmissionTime = req.headers.get('paypal-transmission-time');
    const certUrl = req.headers.get('paypal-cert-url');
    const authAlgo = req.headers.get('paypal-auth-algo');
    const transmissionSig = req.headers.get('paypal-transmission-sig');
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    const webhookEvent = JSON.parse(rawBody);

    const requestBody = {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent
    };

    const accessToken = await getAccessToken();

    const response = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        console.error("Error verifying webhook signature:", response.status, response.statusText);
        const errorDetails = await response.json();
        throw new Error(`Failed to verify webhook signature: ${errorDetails.error_description}`);
    }

    const data = await response.json();
    return data.verification_status === 'SUCCESS';
};

const updateSubscriptionStatus = async (event) => {
    const { resource, event_type } = event;
    const { id: subscriptionId, status, billing_info } = resource;

    const payment = await Payments.findOne({ 'Subscription.subscriptionId': subscriptionId }).populate('userId');

    if (!payment) {
        console.error(`Payment not found for subscription ID: ${subscriptionId}`);
        return;
    }

    const user = payment.userId;

    switch (event_type) {
        case 'PAYMENT.SALE.COMPLETED':
            const lastPayment = new Date(billing_info.last_payment.time);
            const nextBillingDate = new Date(lastPayment);

            if (payment.Subscription.billingCycle === 'monthly') {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            } else if (payment.Subscription.billingCycle === 'yearly') {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
            }

            payment.Subscription.status = 'active';
            payment.Subscription.nextBilledAt = nextBillingDate.getTime();
            await payment.save();

            user.subscribed = true;
            user.currentSubscription = payment._id;
            await user.save();
            break;

        case 'BILLING.SUBSCRIPTION.CANCELLED':
        case 'BILLING.SUBSCRIPTION.EXPIRED':
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
            user.subscribed = false;
            user.currentSubscription = null;
            await user.save();
            break;

        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            payment.Subscription.status = 'pastDue';
            await payment.save();
            console.log(`Payment failed for subscription ID: ${subscriptionId}`);
            break;

        default:
            console.log(`Unhandled event type: ${event_type}`);
    }
};

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const webhookEvent = JSON.parse(rawBody);

    try {
        if (!(await validatePayPalSignature(req, rawBody))) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        await connectToDb();
        await updateSubscriptionStatus(webhookEvent);
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Route segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';