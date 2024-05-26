"use server";

import {connectToDb} from "../lib/utils";
import {Payments, User} from "../lib/models";

export const getUsers = async () => {
    try {
        await connectToDb();
        return await User.find();
    } catch (e) {
        console.log(e);
    }
};

export const saveSubscriptionDetails = async (data, userId, plan, planId, billingCycle) => {
    try {
        await connectToDb();
        const currentDate = new Date();

        let payment = await Payments.findOne({ userId: userId });

        if (payment) {
            payment.Subscription = {
                plan: plan,
                planId: planId,
                billingCycle: billingCycle,
                status: "active",
                subscriptionId: data.subscriptionID,
                nextBilledAt: currentDate.setMonth(currentDate.getMonth() + (billingCycle === "monthly" ? 1 : 12)),
                endDate: null
            };
        } else {
            payment = new Payments({
                userId: userId,
                Subscription: {
                    plan: plan,
                    planId: planId,
                    billingCycle: billingCycle,
                    status: "active",
                    subscriptionId: data.subscriptionID,
                    nextBilledAt: currentDate.setMonth(currentDate.getMonth() + (billingCycle === "monthly" ? 1 : 12)),
                    endDate: null
                },
                oneTimePayment: []
            });
        }

        await payment.save();

        // Update the user's subscription status
        await User.findByIdAndUpdate(userId, {
            subscribed: true,
            currentSubscription: payment._id
        });

        console.log('Subscription details saved successfully.');
    } catch (error) {
        console.error('Error saving subscription details:', error);
    }
};


//
// import { promises as fs } from 'fs';
// import {Assets} from "../lib/models";
//
// const BATCH_SIZE = 50;
//
// export const importAssetsRisk = async () => {
//     try {
//         console.log("starting.............");
//         const dataBuffer = await fs.readFile(
//             "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Assets.json"
//         );
//         const dataString = dataBuffer.toString();
//         const jsonData = JSON.parse(dataString);
//         console.log("jsonData length:", jsonData[2].data.length);
//
//         let index = 0;
//         while (index < jsonData[2].data.length) {
//             const batchData = jsonData[2].data
//                 .slice(index, index + BATCH_SIZE)
//                 .map((item) => ({
//                     ID: item.ID,
//                     Risk: item.Risk || "",
//                 }));
//
//             for (const asset of batchData) {
//                 await Assets.updateOne(
//                     { ID: asset.ID },
//                     { $set: { Risk: asset.Risk } },
//                     { upsert: true }
//                 );
//             }
//
//             console.log(`Batch ${index / BATCH_SIZE + 1} imported successfully`);
//             index += BATCH_SIZE;
//         }
//
//         console.log("Data import complete.");
//     } catch (e) {
//         console.log("Error importing data:", e);
//         throw e;
//     }
// };
//
