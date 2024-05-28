import { buffer } from 'micro';
import paypal from '@paypal/checkout-server-sdk';
import {Payments} from "../../../lib/models";
import {connectToDb} from "../../../lib/utils";

const payPalClient = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET
));

export const config = {
    api: {
        bodyParser: false,
    },
};

const validatePayPalSignature = async (req, rawBody) => {
    const transmissionId = req.headers['paypal-transmission-id'];
    const transmissionTime = req.headers['paypal-transmission-time'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];
    const transmissionSig = req.headers['paypal-transmission-sig'];
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    const webhookEvent = JSON.parse(rawBody);

    const expectedSignature = await payPalClient.verifyWebhookSignature({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent
    });

    return expectedSignature.verification_status === 'SUCCESS';
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
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1); // assuming monthly subscription

            payment.Subscription.status = 'active';
            payment.Subscription.nextBilledAt = nextBillingDate.getTime();
            await payment.save();

            user.subscribed = true;
            user.currentSubscription = payment._id;
            await user.save();
            break;

        // case 'BILLING.SUBSCRIPTION.CREATED':
        // case 'BILLING.SUBSCRIPTION.ACTIVATED':
        //     user.subscribed = true;
        //     user.currentSubscription = payment._id;
        //     await user.save();
        //     break;

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

export default async (req, res) => {
    const buf = await buffer(req);
    const rawBody = buf.toString('utf8');
    const webhookEvent = JSON.parse(rawBody);

    try {
        if (!(await validatePayPalSignature(req, rawBody))) {
            return res.status(400).send('Invalid signature');
        }

        await connectToDb();
        await updateSubscriptionStatus(webhookEvent);
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal Server Error');
    }
};
