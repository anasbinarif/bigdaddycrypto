import { connectToDb } from '../../../lib/utils';
import { Payments, User } from '../../../lib/models';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectToDb();

    try {
        const payments = await Payments.find()
            .populate('userId', 'email username')

        const paymentDetails = payments.flatMap(payment => 
            payment.oneTimePayment.map(oneTimePayment => ({
                userEmail: payment.userId.email,
                userId: payment.userId._id,
                username: payment.userId.username,
                oneTimePayment: {
                    date: oneTimePayment.date,
                    price: oneTimePayment.price,
                    status: oneTimePayment.status
                }
            }))
        );

        return NextResponse.json({ success: true, data: paymentDetails });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
