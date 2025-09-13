const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function cleanDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }

  console.log('🔄 Cleaning database...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('life-accessories');
    console.log('✅ Connected to MongoDB Atlas');
    
    // Delete all products (keep categories)
    const productsResult = await db.collection('products').deleteMany({});
    console.log(`🗑️  Deleted ${productsResult.deletedCount} products`);
    
    // Delete all orders
    const ordersResult = await db.collection('orders').deleteMany({});
    console.log(`🗑️  Deleted ${ordersResult.deletedCount} orders`);
    
    // Delete all users
    const usersResult = await db.collection('users').deleteMany({});
    console.log(`🗑️  Deleted ${usersResult.deletedCount} users`);
    
    // Keep categories - they are your real business categories
    console.log('✅ Kept categories (your real business data)');
    
    // Show current collections status
    const collections = await db.listCollections().toArray();
    console.log('📊 Current collections:', collections.map(c => c.name));
    
    // Show counts
    const productCount = await db.collection('products').countDocuments();
    const categoryCount = await db.collection('categories').countDocuments();
    const orderCount = await db.collection('orders').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    
    console.log('\n📈 Database Status:');
    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Orders: ${orderCount}`);
    console.log(`   Users: ${userCount}`);
    
    await client.close();
    console.log('🎉 Database cleaned successfully!');
    console.log('✨ You can now start adding your real products!');
    
  } catch (error) {
    console.error('❌ Clean failed:', error.message);
  }
}

cleanDatabase();
