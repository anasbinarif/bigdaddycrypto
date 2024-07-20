const mongoose = require('mongoose');

// MongoDB's connection string
const mongoUri = 'mongodb+srv://anasarifamazon:AJy3V461deLCXopA@cryptodaddy.cluwbt9.mongodb.net/?retryWrites=true&w=majority&appName=cryptodaddy'; // Replace with your actual MongoDB connection string

// Define a schema for CronJobStatus
const cronJobStatusSchema = new mongoose.Schema({
    isRunning: Boolean,
}, { collection: 'cronjobstatuses' });

// Create a model for CronJobStatus
const CronJobStatus = mongoose.model('CronJobStatus', cronJobStatusSchema);

const updateCronJobStatus = async () => {
    try {
        // Connect to your MongoDB database
        await mongoose.connect(mongoUri);

        console.log('Connected to the database');

        // Find the existing CronJobStatus document and update isRunning to true
        const updatedStatus = await CronJobStatus.findOneAndUpdate(
            {}, // Find any document
            { isRunning: false }, // Update operation
            { new: true } // Ensure the updated document is returned
        );

        // Log the updated document
        if (updatedStatus) {
            console.log('Updated CronJobStatus 3333333333333333333:', updatedStatus);
        } else {
            console.log('No CronJobStatus document found to update.');
        }

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error updating CronJobStatus:', error);
    }
};

updateCronJobStatus();
