const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function checkData() {
    try {
        await client.connect();
        const database = client.db('your_database_name'); // Replace with your database name
        const collection = database.collection('your_collection_name'); // Replace with your collection name
        
        const data = await collection.find({}).toArray();
        console.log('Data in collection:', data);
    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await client.close();
    }
}

checkData();
