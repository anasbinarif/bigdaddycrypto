import { NextResponse } from 'next/server';
import cron from 'node-cron';

let cronJob;
let isCronJobRunning = false;

export async function POST(req) {
    const { userID } = await req.json();
    try {
        // If a cron job is already running, do not create a new one
        if (isCronJobRunning) {
            console.log('Cron job is already running');
            return NextResponse.json({ message: 'Cron job is already running' });
        }

        // Schedule the cron job to run every 3 hours
        cronJob = cron.schedule('0 */3 * * *', async () => {
            try {
                const response = await fetch(`${process.env.BASE_URL}/api/scheduler`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userID }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            } catch (error) {
                console.log('Error calling Scheduler API:', error);
            }
        });

        isCronJobRunning = true;
        console.log('Cron job scheduled to run every 3 hours');
        return NextResponse.json({ message: 'Cron job scheduled successfully' });
    } catch (error) {
        console.error('Error setting up cron job:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        if (cronJob) {
            cronJob.stop();
            cronJob = null;
            isCronJobRunning = false;
            console.log('Cron job stopped');
        }
        return NextResponse.json({ message: 'Cron job stopped successfully' });
    } catch (error) {
        console.error('Error stopping cron job:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
