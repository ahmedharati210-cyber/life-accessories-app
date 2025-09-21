#!/usr/bin/env node

/**
 * Update Category Images Script
 * 
 * This script updates the category images in the database
 * to use the new elegant SVG images.
 */

const { MongoClient } = require('mongodb');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lifeaccessories:lifeaccessories123@cluster0.8qjqj.mongodb.net/lifeaccessories?retryWrites=true&w=majority';

// Category image mappings
const categoryImageMappings = {
  'سلاسل': '/images/categories/salasil-elegant.svg',
  'salasil': '/images/categories/salasil-elegant.svg',
  'خواتم': '/images/categories/khawatim-elegant.svg',
  'khawatim': '/images/categories/khawatim-elegant.svg',
  'اكسسوارات': '/images/categories/accessories-elegant.svg',
  'accessories': '/images/categories/accessories-elegant.svg',
  'أطقم': '/images/categories/atqam-elegant.svg',
  'atqam': '/images/categories/atqam-elegant.svg',
  'مجوهرات': '/images/categories/salasil-elegant.svg', // Default to chains for general jewelry
  'jewelry': '/images/categories/salasil-elegant.svg',
  'ساعات': '/images/categories/accessories-elegant.svg', // Default to accessories for watches
  'watches': '/images/categories/accessories-elegant.svg',
  'حقائب': '/images/categories/atqam-elegant.svg', // Default to sets for bags
  'bags': '/images/categories/atqam-elegant.svg',
  'أحذية': '/images/categories/atqam-elegant.svg', // Default to sets for shoes
  'shoes': '/images/categories/atqam-elegant.svg'
};

async function updateCategoryImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully');
    
    const db = client.db('lifeaccessories');
    const categories = db.collection('categories');
    
    // Get all categories
    console.log('📋 Fetching categories...');
    const allCategories = await categories.find({}).toArray();
    console.log(`Found ${allCategories.length} categories`);
    
    let updatedCount = 0;
    
    for (const category of allCategories) {
      const categoryName = category.name || '';
      const categorySlug = category.slug || '';
      
      // Find matching image
      let newImage = null;
      
      // Try to match by name first
      if (categoryImageMappings[categoryName]) {
        newImage = categoryImageMappings[categoryName];
      }
      // Try to match by slug
      else if (categoryImageMappings[categorySlug]) {
        newImage = categoryImageMappings[categorySlug];
      }
      // Try partial matches
      else {
        for (const [key, image] of Object.entries(categoryImageMappings)) {
          if (categoryName.toLowerCase().includes(key.toLowerCase()) || 
              categorySlug.toLowerCase().includes(key.toLowerCase())) {
            newImage = image;
            break;
          }
        }
      }
      
      if (newImage) {
        console.log(`🔄 Updating ${categoryName} (${categorySlug}) -> ${newImage}`);
        
        await categories.updateOne(
          { _id: category._id },
          { 
            $set: { 
              image: newImage,
              updatedAt: new Date()
            } 
          }
        );
        
        updatedCount++;
      } else {
        console.log(`⚠️  No image mapping found for: ${categoryName} (${categorySlug})`);
      }
    }
    
    console.log(`\n✅ Update complete! Updated ${updatedCount} categories`);
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const updatedCategories = await categories.find({}).toArray();
    
    console.log('\n📋 Updated category images:');
    updatedCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}): ${cat.image}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating category images:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the update
updateCategoryImages();


