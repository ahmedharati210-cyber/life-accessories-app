const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

async function cleanOriginalPrice() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('life-accessories');
    const products = db.collection('products');
    
    // Find products with originalPrice: 0
    const productsWithZeroOriginalPrice = await products.find({ originalPrice: 0 }).toArray();
    console.log(`Found ${productsWithZeroOriginalPrice.length} products with originalPrice: 0`);
    
    if (productsWithZeroOriginalPrice.length > 0) {
      // Update all products with originalPrice: 0 to remove the field (set to null)
      const result = await products.updateMany(
        { originalPrice: 0 },
        { $unset: { originalPrice: "" } }
      );
      
      console.log(`Updated ${result.modifiedCount} products to remove originalPrice field`);
      
      // Verify the update
      const remainingProducts = await products.find({ originalPrice: 0 }).toArray();
      console.log(`Remaining products with originalPrice: 0: ${remainingProducts.length}`);
    } else {
      console.log('No products found with originalPrice: 0');
    }
    
  } catch (error) {
    console.error('Error cleaning originalPrice:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

cleanOriginalPrice();
