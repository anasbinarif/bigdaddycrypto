import { connectToDb } from "../../../lib/utils";
import { Payments, UserPortfolio } from "../../../lib/models";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDb();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const skip = (page - 1) * limit;

  try {
    const payments = await Payments.find()
        .populate("userId", "email username")
        .lean();

    // Flatten one-time payments and add user details to each payment
    const allPayments = payments.flatMap(payment => {
      if (payment.userId && payment.userId.email && payment.oneTimePayment && payment.oneTimePayment.length > 0) {
        return payment.oneTimePayment.map(oneTimePayment => ({
          userEmail: payment.userId.email,
          userId: payment.userId._id,
          username: payment.userId.username,
          oneTimePayment: {
            date: oneTimePayment.date,
            price: oneTimePayment.price,
            status: oneTimePayment.status,
          },
          notizen: payment.notizen || "",
        }));
      }
      return [];
    });

    // Sort by payment date
    const sortedPayments = allPayments.sort((a, b) => new Date(b.oneTimePayment.date) - new Date(a.oneTimePayment.date));

    // Paginate the payments
    const paginatedPayments = sortedPayments.slice(skip, skip + limit);

    return NextResponse.json(
        { success: true, data: paginatedPayments, total: sortedPayments.length },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" } }
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
        { success: false, error: error.message },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" } }
    );
  }
}
