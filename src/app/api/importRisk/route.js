// import { connectToDb } from '../../../lib/utils';
// import { NextResponse } from "next/server";
// import {Assets} from "../../../lib/models";
// import {importAssetsRisk} from "../../../lib/action";
//
// export async function GET() {
//     try {
//         await connectToDb();
//
//         // Update existing assets to include the Risk field with a default value of ""
//         await importAssetsRisk()
//
//         return new NextResponse('Data import complete.', { status: 200 });
//     } catch (error) {
//         console.error("Error importing data:", error);
//         return new NextResponse('Error importing data.', { status: 500 });
//     }
// }