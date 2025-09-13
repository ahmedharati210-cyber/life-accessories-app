const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://xpunisherco_db_user:z29NjLs0kU88lAfI@life-accessories.y7gccnx.mongodb.net/?retryWrites=true&w=majority&appName=Life-accessories';

async function checkProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('life-accessories');
    const products = db.collection('products');
    
    const count = await products.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    const sampleProducts = await products.find({}, { projection: { slug: 1, name: 1, _id: 0 } }).limit(10).toArray();
    console.log('Sample product slugs:');
    console.log(sampleProducts.map(p => `- ${p.slug} (${p.name})`).join('\n'));
    
  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    await client.close();
  }
}

checkProducts();
