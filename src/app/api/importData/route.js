import {NextResponse} from "next/server";
import {connectToDb} from "@/lib/utils";
import {importCryptoData} from "@/lib/data";
import cryptoData from "@/v1_sql/output";

export async function POST(req) {
    try{
        await connectToDb();
        console.log('Connected to database.');
        // importCryptoData(cryptoData).then(() => {
        //     console.log('Data import complete.');
        // }).catch((error) => {
        //     console.error('Failed to import data:', error);
        // });
    } catch (e) {
        console.error("Error importing crypto data:", e);
        return NextResponse.json({ error: "Error occurred while importing crypto data", details: e.message }, { status: 500 });
    }
}