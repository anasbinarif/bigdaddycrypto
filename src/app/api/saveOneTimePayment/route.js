import { Payments } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId, price, status } = await req.json();
        console.log("saveOneTimePaymentsaveOneTimePayment", userId, price, status);

        if (typeof price !== 'number' || price <= 0) {
            return NextResponse.json({ message: "Invalid price value." }, { status: 400 });
        }

        // Find the user payment record or create a new one
        let paymentRecord = await Payments.findOne({ userId });

        if (!paymentRecord) {
            paymentRecord = new Payments({ userId, oneTimePayment: [] });
        }
        const onePay = {
            date: new Date(),
            price,
            status
        }

        console.log("onePayonePay", onePay);

        // Add the new payment
        paymentRecord.oneTimePayment.push(onePay);

        await paymentRecord.save();

        return NextResponse.json({ message: "oneTimePayment added." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: `Error updating portfolio: ${error.message}` }, { status: 500 });
    }
}
