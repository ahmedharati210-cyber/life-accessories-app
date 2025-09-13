const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }

  console.log('🔄 Testing MongoDB Atlas connection...');
  
  try {
    const client = new MongoClient(uri, {
      // MongoDB Atlas connection options
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database and collections
    const db = client.db('life-accessories');
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
