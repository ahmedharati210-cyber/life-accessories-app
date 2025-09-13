const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'life-accessories';

if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

async function migrateData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db(MONGODB_DATABASE);
    
    // Read existing data files
    const categoriesPath = path.join(__dirname, '../src/data/categories.json');
    const productsPath = path.join(__dirname, '../src/data/products.json');
    const areasPath = path.join(__dirname, '../src/data/areas.json');
    
    // Migrate categories
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      await db.collection('categories').insertMany(categories);
      console.log(`Migrated ${categories.length} categories`);
    }
    
    // Migrate products
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      await db.collection('products').insertMany(products);
      console.log(`Migrated ${products.length} products`);
    }
    
    // Migrate areas
    if (fs.existsSync(areasPath)) {
      const areas = JSON.parse(fs.readFileSync(areasPath, 'utf8'));
      await db.collection('areas').insertMany(areas);
      console.log(`Migrated ${areas.length} areas`);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateData();
