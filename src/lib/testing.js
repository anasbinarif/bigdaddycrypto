// pages/api/webhook.js
import { buffer } from 'micro';
import { connectToDatabase } from '../../utils/mongodb';
import { User } from '../../models/User';
import { Subscription } from '../../models/Subscription';

export const config = {
    api: {
        bodyParser: false,
    },
};

const validatePayPalSignature = (req) => {
    // Implement PayPal signature validation here
    // You can use PayPal SDK or your own implementation
    return true; // For illustration purposes, always return true
};

const updateSubscriptionStatus = async (event) => {
    const { resource, event_type } = event;
    const { id: subscriptionId, status, billing_info } = resource;
    const user = await User.findOne({ 'subscription.subscriptionId': subscriptionId }).populate('currentSubscription');

    if (!user) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
    }

    switch (event_type) {
        case 'PAYMENT.SALE.COMPLETED':
            // Subscription payment completed
            const lastPayment = billing_info.last_payment.time;
            const nextBillingDate = new Date(lastPayment);
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1); // assuming monthly subscription

            user.currentSubscription.validUntil = nextBillingDate;
            user.subscribed = true;
            await user.currentSubscription.save();
            await user.save();
            break;

        case 'BILLING.SUBSCRIPTION.CREATED':
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
            user.subscribed = true;
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
            // Handle payment failure (e.g., notify the user)
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

    if (!validatePayPalSignature(req)) {
        return res.status(400).send('Invalid signature');
    }

    try {
        await connectToDatabase();
        await updateSubscriptionStatus(webhookEvent);
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal Server Error');
    }
};



const resfrompaypal = {
    "orderID": "60X01743Y1161320F",
    "subscriptionID": "I-CN4URP34STCP",
    "facilitatorAccessToken": "A21AAKUAC7oqJIg4_Ghx1sB40n6r2wc4KUumAX7DhxmqSNB8KPWUIs08wEp2ZmBvIVDGGWG_Zc98oYUryTnQmsmEHulkDgeEA",
    "paymentSource": "paypal"
}
