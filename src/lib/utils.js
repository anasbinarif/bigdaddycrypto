import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const connection = {};

export const connectToDb = async () => {
    if (connection.isConnected) {
        // console.log("Using existing connection");
        return;
    }

    try {
        const db= await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected");

        // Reset the cron job status
        // await CronJobStatus.updateOne({}, { isRunning: false });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Error connecting to MongoDB");
    }
};

export const authorize = async (token) => {
    if (!token) return null;
    try {
        return await jwt.verify(token, 'secret');
    } catch (err) {
        console.error(err);
        return null;
    }
};
