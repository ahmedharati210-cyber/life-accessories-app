const { MongoClient } = require('mongodb');

async function setupStockTracking() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DATABASE || 'life-accessories');
    
    // Create stockHistory collection with indexes
    const stockHistoryCollection = db.collection('stockHistory');
    
    // Create indexes for better performance
    await stockHistoryCollection.createIndex({ productId: 1 });
    await stockHistoryCollection.createIndex({ timestamp: -1 });
    await stockHistoryCollection.createIndex({ changeType: 1 });
    await stockHistoryCollection.createIndex({ productId: 1, timestamp: -1 });
    
    console.log('✅ Stock history collection and indexes created');
    
    // Update existing products to have stock field if missing
    const productsCollection = db.collection('products');
    const updateResult = await productsCollection.updateMany(
      { stock: { $exists: false } },
      { 
        $set: { 
          stock: 0,
          inStock: false 
        } 
      }
    );
    
    console.log(`✅ Updated ${updateResult.modifiedCount} products with stock field`);
    
    // Check if we have any products and set some sample stock
    const productCount = await productsCollection.countDocuments();
    if (productCount > 0) {
      // Set random stock for existing products (1-50 items)
      const products = await productsCollection.find({}).toArray();
      for (const product of products) {
        const randomStock = Math.floor(Math.random() * 50) + 1;
        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              stock: randomStock,
              inStock: randomStock > 0 
            } 
          }
        );
      }
      console.log(`✅ Set sample stock quantities for ${products.length} products`);
    }
    
    console.log('🎉 Stock tracking setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up stock tracking:', error);
  } finally {
    await client.close();
  }
}

// Run the setup
setupStockTracking();
