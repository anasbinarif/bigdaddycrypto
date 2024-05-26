// pages/api/getUserSubscriptionPlan.js

import { connectToDb } from '../../../lib/utils';
import { Payments } from '../../../lib/models';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        await connectToDb();

        const payment = await Payments.findOne({ userId: userId }).populate('userId');

        if (!payment || !payment.Subscription) {
            return NextResponse.json({ plan: 'free', payment: null });
        }
        if (!payment.Subscription) {
            return NextResponse.json({ plan: 'free', payment: payment });
        }

        return NextResponse.json({ plan: payment.Subscription.plan, payment });
    } catch (error) {
        console.error('Error fetching user subscription plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
