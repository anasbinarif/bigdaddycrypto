// pages/api/coinbase/create-one-time-checkout.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { price, userId } = await request.json();

    try {
        const response = await fetch('https://api.commerce.coinbase.com/charges', {
            method: 'POST',
            headers: {
                'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
                'X-CC-Version': '2018-03-22',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'One Time Payment',
                description: `Payment of ${price} EUR`,
                pricing_type: 'fixed_price',
                local_price: {
                    amount: price,
                    currency: 'EUR',
                },
                metadata: {
                    user_id: userId,
                },
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return NextResponse.json({ data }, { status: 200 });
        } else {
            return NextResponse.json(
                { message: data.error || 'Something went wrong' },
                { status: response.status }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { message: `Error creating Coinbase checkout ${e.message}` },
            { status: 500 }
        );
    }
}
