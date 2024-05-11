// import {NextResponse} from "next/server";
// import {connectToDb} from "@/lib/utils";
// import {importPortfolio} from "@/lib/data";
// import cryptoData from "@/v1_sql/output";
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