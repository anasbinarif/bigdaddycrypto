// import {NextResponse} from "next/server";
//
// export async function GET(req) {
//     // const data = await req.json();
//     try{
//         await connectToDb();
//         console.log('Connected to database.');
//         importPortfolio().then((data) => {
//             console.log('Data import completewtf.');
//             return NextResponse.json({ message: "Data imported successfully" }, {data: data});
//         }).catch((error) => {
//             console.error('Failed to import data:', error);
//             return NextResponse.json({ message: `Data imported failed ${error}` });
//         });
//     } catch (e) {
//         console.error("Error importing crypto data:", e);
//         return NextResponse.json({ error: "Error occurred while importing crypto data", details: e.message }, { status: 500 });
//     }
// }
//
// import {NextResponse} from "next/server";
// import {assetCategoryData} from "../../../v1_sql/Asset_Category";
// import {Assets} from "../../../lib/models";
//
// export async function GET(req) {
//     try {
//         // Run the migration script to convert Category fields to arrays
//
//         // Iterate through the asset category data and update corresponding assets
//         for (const item of assetCategoryData) {
//             const { AssetID, Category } = item;
//
//             // Find the asset by AssetID and update the Category array
//             await Assets.updateOne(
//                 { ID: AssetID },
//                 { $addToSet: { Category: Category } }
//             );
//         }
//
//         // Fetch all updated assets to verify the changes
//         const updatedAssets = await Assets.find();
//
//         return NextResponse.json({ data: updatedAssets }, { status: 200 });
//     } catch (e) {
//         return NextResponse.json(
//             { message: `Error updating Assets in DB: ${e}` },
//             { status: 500 }
//         );
//     }
// }