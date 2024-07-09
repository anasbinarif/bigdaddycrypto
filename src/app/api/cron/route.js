import { NextResponse } from 'next/server';
import cron from 'node-cron';
import { connectToDb } from '../../../lib/utils';
import { CronJobStatus } from '../../../lib/models';

let cronJob;

export async function POST(req) {
    await connectToDb();

    try {
        // Check the cron job status from the database
        let cronJobStatus = await CronJobStatus.findOne();
        if (!cronJobStatus) {
            cronJobStatus = new CronJobStatus();
        }

        // If a cron job is already running, do not create a new one
        if (cronJobStatus.isRunning) {
            console.log('Cron job is already running');
            return NextResponse.json({ message: 'Cron job is already running' });
        }

        // Schedule the cron job to run every 12 hours
        cronJob = cron.schedule('0 */12 * * *', async () => {
            try {
                const response = await fetch(`${process.env.BASE_URL}/api/scheduler`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            } catch (error) {
                console.log('Error calling Scheduler API:', error);
            }
        });

        // Update the cron job status in the database
        cronJobStatus.isRunning = true;
        await cronJobStatus.save();

        console.log('Cron job scheduled to run every 12 hours');
        return NextResponse.json({ message: 'Cron job scheduled successfully' });
    } catch (error) {
        console.error('Error setting up cron job:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    await connectToDb();

    try {
        if (cronJob) {
            cronJob.stop();
            cronJob = null;
            console.log('Cron job stopped');
        }

        // Update the cron job status in the database
        await CronJobStatus.updateOne({}, { isRunning: false });

        return NextResponse.json({ message: 'Cron job stopped successfully' });
    } catch (error) {
        console.error('Error stopping cron job:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
