// import { User, UserPortfolio, Payments } from "../../../lib/models";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDb } from "../../../lib/utils";
//
// mongoose.set('bufferCommands', false);
// mongoose.set('bufferTimeoutMS', 30000); // Increase the timeout to 30 seconds
//
// export async function GET(req) {
//     await connectToDb();
//
//     const excludeEmails = [
//         "hinazeko@physicalcloud.co",
//         "saad.b.javaid22@gmail.com",
//         "mapofcrypto1@gmail.com",
//         "gtevuy@mailto.plus",
//         "dideupreigrozu-1667@yopmail.com",
//         "u2021572@giki.edu.pk"
//     ];
//
//     try {
//         // Ensure the email field is indexed for faster querying
//         await User.createIndexes({ email: 1 });
//
//         const usersToExclude = await User.find({ email: { $in: excludeEmails } });
//         const excludeUserIds = usersToExclude.map(user => user._id);
//
//         const usersToDelete = await User.find({ _id: { $nin: excludeUserIds } });
//
//         const userIdsToDelete = usersToDelete.map(user => user._id);
//
//         await UserPortfolio.deleteMany({ userId: { $in: userIdsToDelete } });
//
//         await Payments.deleteMany({ userId: { $in: userIdsToDelete } });
//
//         await User.deleteMany({ _id: { $in: userIdsToDelete } });
//
//         return NextResponse.json(
//             {
//                 message: "All users except the specified ones and their associated data deleted successfully.",
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         return NextResponse.json(
//             { message: `Error deleting users and associated data: ${error.message}` },
//             { status: 500 }
//         );
//     }
// }