import { NextResponse } from 'next/server';
import cron from 'node-cron';
import { connectToDb } from '../../../lib/utils';
import { CronJobStatus } from '../../../lib/models';

let cronJob;
let dailyCronJob;

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

        // Schedule the cron job to run every 2 minutes
        cronJob = cron.schedule('*/2 * * * *', async () => {
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

        // Schedule the daily cron job to run once a day
        dailyCronJob = cron.schedule('0 0 * * *', async () => {
            try {
                const response = await fetch(`${process.env.BASE_URL}/api/bottomScheduler`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            } catch (error) {
                console.log('Error calling Bottom Scheduler API:', error);
            }
        });

        // Update the cron job status in the database
        cronJobStatus.isRunning = true;
        await cronJobStatus.save();

        console.log('Cron jobs scheduled successfully');
        return NextResponse.json({ message: 'Cron jobs scheduled successfully' });
    } catch (error) {
        console.error('Error setting up cron jobs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    await connectToDb();

    try {
        if (cronJob) {
            cronJob.stop();
            cronJob = null;
            console.log('2-minute cron job stopped');
        }

        if (dailyCronJob) {
            dailyCronJob.stop();
            dailyCronJob = null;
            console.log('Daily cron job stopped');
        }

        // Update the cron job status in the database
        await CronJobStatus.updateOne({}, { isRunning: false });

        return NextResponse.json({ message: 'Cron jobs stopped successfully' });
    } catch (error) {
        console.error('Error stopping cron jobs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
