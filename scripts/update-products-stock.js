const { MongoClient } = require('mongodb');

async function updateProductsStock() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DATABASE || 'life-accessories');
    const products = db.collection('products');
    
    // Update products that don't have stock field
    const updateResult = await products.updateMany(
      { stock: { $exists: false } },
      { 
        $set: { 
          stock: Math.floor(Math.random() * 50) + 1, // Random stock between 1-50
          inStock: true 
        } 
      }
    );
    
    console.log(`✅ Updated ${updateResult.modifiedCount} products with stock field`);
    
    // Also ensure inStock is set correctly based on stock
    const stockUpdateResult = await products.updateMany(
      { stock: { $gt: 0 } },
      { $set: { inStock: true } }
    );
    
    console.log(`✅ Updated ${stockUpdateResult.modifiedCount} products with inStock: true`);
    
    // Set inStock to false for products with 0 stock
    const outOfStockResult = await products.updateMany(
      { stock: 0 },
      { $set: { inStock: false } }
    );
    
    console.log(`✅ Updated ${outOfStockResult.modifiedCount} products with inStock: false`);
    
    // Show some sample products
    const sampleProducts = await products.find({}).limit(5).toArray();
    console.log('\n📦 Sample products with stock:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.stock} pieces (inStock: ${product.inStock})`);
    });
    
    console.log('\n🎉 Products stock update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating products stock:', error);
  } finally {
    await client.close();
  }
}

// Run the update
updateProductsStock();
