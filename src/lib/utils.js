import mongoose from "mongoose";
import { CronJobStatus } from "./models";

const connection = {};

export const connectToDb = async () => {
    try {
        if (connection.isConnected) {
            console.log("Using existing connection");
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected");

        // Reset the cron job status
        await CronJobStatus.updateOne({}, { isRunning: false });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const authorize = async (token) => {
    if (!token) return null;
    try {
        const info = await jwt.verify(token, 'secret');
        return info;
    } catch (err) {
        console.error(err);
        return null;
    }
};
