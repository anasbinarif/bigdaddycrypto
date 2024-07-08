import { Payments, User } from "../../../lib/models";
import { connectToDb } from "../../../lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to the database
        // await connectToDb();

        // // Find all users
        // const allUsers = await User.find().select('_id email');

        // const emails = [];
        // for (const user of allUsers) {
        //     // Check if the payment record exists for the user
        //     let paymentRecord = await Payments.findOne({ userId: user._id });
            
        //     if (!paymentRecord) {
        //         // If no payment record exists, create a new one with "free+" subscription plan
        //         paymentRecord = new Payments({
        //             userId: user._id,
        //             Subscription: { plan: "free+" }
        //         });
        //         await paymentRecord.save();

        //         // Update user's currentSubscription field
        //         await User.updateOne({ _id: user._id }, { $set: { currentSubscription: paymentRecord._id } });
        //         emails.push(user.email);
        //     } else if (!paymentRecord.Subscription || paymentRecord.Subscription.plan !== "free+") {
        //         // Update the existing payment record if it does not have the "free+" plan
        //         await Payments.updateOne(
        //             { userId: user._id },
        //             { $set: { Subscription: { plan: "free+" } } }
        //         );

        //         // Update user's currentSubscription field
        //         await User.updateOne({ _id: user._id }, { $set: { currentSubscription: paymentRecord._id } });
        //         emails.push(user.email);
        //     }
        // }

        // return NextResponse.json({
        //     updatedCount: emails.length,
        //     emails: emails
        // });
        return NextResponse.json({
            updatedCount: 0,
            emails: []
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
