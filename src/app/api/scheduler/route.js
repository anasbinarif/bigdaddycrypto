import { NextResponse } from 'next/server';
import cron from 'node-cron';

export async function POST(req) {
    const { userID } = await req.json();
    console.log('######################################');
    console.log('# Running scheduler action           #');
    console.log('######################################');

    if (userID) {
        try {
            await fetch(`${process.env.BASE_URL}/api/crypto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userID }),
                cache: "no-store",
            });

            return NextResponse.json({ data: 'Success', status: 200 });
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'userID is undefined' }, { status: 400 });
    }
}
