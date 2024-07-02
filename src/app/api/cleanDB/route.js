import { User, UserPortfolio, Payments } from "../../../lib/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDb } from "../../../lib/utils";

// mongoose.set('bufferCommands', false);
// mongoose.set('bufferTimeoutMS', 30000);

export async function GET(req) {
    // await connectToDb();
    //
    // const excludeEmails = [
    //     "hinazeko@physicalcloud.co",
    //     "saad.b.javaid22@gmail.com",
    //     "mapofcrypto1@gmail.com",
    //     "gtevuy@mailto.plus",
    //     "dideupreigrozu-1667@yopmail.com",
    //     "u2021572@giki.edu.pk"
    // ];
    //
    // try {
    //     // Ensure the email field is indexed for faster querying
    //     await User.createIndexes({ email: 1 });
    //
    //     // Find users to exclude
    //     const usersToExclude = await User.find({ email: { $in: excludeEmails } });
    //     const excludeUserIds = usersToExclude.map(user => user._id);
    //
    //     // Find users to delete
    //     const usersToDelete = await User.find({ _id: { $nin: excludeUserIds } });
    //     const userIdsToDelete = usersToDelete.map(user => user._id);
    //
    //     console.log(`Found ${userIdsToDelete.length} users to delete`);
    //
    //     if (userIdsToDelete.length === 0) {
    //         return NextResponse.json(
    //             {
    //                 message: "No users found to delete.",
    //             },
    //             { status: 200 }
    //         );
    //     }
    //
    //     // Find the details of users to delete (for returning them later)
    //     const deletedUsers = await User.find({ _id: { $in: userIdsToDelete } });
    //
    //     // Delete associated data and users
    //     const deletePortfolios = UserPortfolio.deleteMany({ userId: { $in: userIdsToDelete } });
    //     const deletePayments = Payments.deleteMany({ userId: { $in: userIdsToDelete } });
    //     const deleteUsers = User.deleteMany({ _id: { $in: userIdsToDelete } });
    //
    //     await Promise.all([deletePortfolios, deletePayments, deleteUsers]);
    //
    //     console.log(`Deleted ${userIdsToDelete.length} users and their associated data`);
    //
    //     return NextResponse.json(
    //         {
    //             message: "All users except the specified ones and their associated data deleted successfully.",
    //             deletedUsers: deletedUsers  // Return the details of deleted users
    //         },
    //         { status: 200 }
    //     );
    // } catch (error) {
    //     console.error(`Error deleting users and associated data: ${error.message}`);
    //     return NextResponse.json(
    //         { message: `Error deleting users and associated data: ${error.message}` },
    //         { status: 500 }
    //     );
    // }
}

