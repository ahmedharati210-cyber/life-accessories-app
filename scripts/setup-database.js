const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }

  console.log('🔄 Setting up database...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('life-accessories');
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create collections
    const collections = ['products', 'categories', 'orders', 'users', 'areas'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection already exists: ${collectionName}`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    // Load initial data
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    
    // Load categories
    try {
      const categoriesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
      const categoriesCollection = db.collection('categories');
      
      // Clear existing data
      await categoriesCollection.deleteMany({});
      
      // Insert new data
      const result = await categoriesCollection.insertMany(categoriesData);
      console.log(`✅ Inserted ${result.insertedCount} categories`);
    } catch (error) {
      console.error('❌ Error loading categories:', error.message);
    }
    
    // Load products
    try {
      const productsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
      const productsCollection = db.collection('products');
      
      // Clear existing data
      await productsCollection.deleteMany({});
      
      // Insert new data
      const result = await productsCollection.insertMany(productsData);
      console.log(`✅ Inserted ${result.insertedCount} products`);
    } catch (error) {
      console.error('❌ Error loading products:', error.message);
    }
    
    // Load areas
    try {
      const areasData = JSON.parse(fs.readFileSync(path.join(dataDir, 'areas.json'), 'utf8'));
      const areasCollection = db.collection('areas');
      
      // Clear existing data
      await areasCollection.deleteMany({});
      
      // Insert new data
      const result = await areasCollection.insertMany(areasData);
      console.log(`✅ Inserted ${result.insertedCount} areas`);
    } catch (error) {
      console.error('❌ Error loading areas:', error.message);
    }
    
    await client.close();
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupDatabase();
