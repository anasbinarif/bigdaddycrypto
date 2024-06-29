import { connectToDb } from "../../../lib/utils";
import { Payments, UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDb();

  try {
    const payments = await Payments.find().populate("userId", "email username");

    const paymentDetailsPromises = payments.map(async (payment) => {
      if (!payment.userId) {
        return []; // Skip payments with no userId
      }

      const portfolio = await UserPortfolio.findOne({
        userId: payment.userId._id,
      });
      const notizen = portfolio ? portfolio.Notizen : null;

      return payment.oneTimePayment.map((oneTimePayment) => ({
        userEmail: payment.userId.email,
        userId: payment.userId._id,
        username: payment.userId.username,
        oneTimePayment: {
          date: oneTimePayment.date,
          price: oneTimePayment.price,
          status: oneTimePayment.status,
        },
        notizen,
      }));
    });

    const paymentDetailsArrays = await Promise.all(paymentDetailsPromises);
    const paymentDetails = paymentDetailsArrays.flat();

    return NextResponse.json({ success: true, data: paymentDetails });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
