const { MongoClient } = require('mongodb');

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://anasarifamazon:AJy3V461deLCXopA@cryptodaddy.cluwbt9.mongodb.net/?retryWrites=true&w=majority&appName=cryptodaddy";
const client = new MongoClient(uri);

async function migrateCategories() {
    try {
        await client.connect();
        const database = client.db('test'); // Use the correct database name
        const assets = database.collection('assets');

        // Log to verify connection
        console.log("Connected to database:", database.databaseName);
        console.log("assetsassetsassets", assets)

        // Find documents where Category is an object
        const query = { Category: { $type: "object" } };
        const update = {
            $set: {
                Category: [] // Set Category to an empty array
            }
        };

        const result = await assets.updateMany(query, update);
        console.log(`${result.matchedCount} documents matched the filter, updated ${result.modifiedCount} documents`);
    } catch (error) {
        console.error(`Error converting Category fields to arrays: ${error}`);
    } finally {
        await client.close();
    }
}

migrateCategories().catch(console.error);
