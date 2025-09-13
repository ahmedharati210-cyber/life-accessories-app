const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://xpunisherco_db_user:z29NjLs0kU88lAfI@life-accessories.y7gccnx.mongodb.net/?retryWrites=true&w=majority&appName=Life-accessories';

async function addSampleProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('life-accessories');
    const products = db.collection('products');
    
    // Sample products for SET category (8 products, 100 LYD each)
    const setProducts = [
      {
        name: 'مجموعة إكسسوارات أنيقة',
        nameEn: 'Elegant Accessories Set',
        slug: 'elegant-accessories-set',
        description: 'مجموعة إكسسوارات أنيقة ومتناسقة للنساء العصريات',
        descriptionEn: 'Elegant and coordinated accessories set for modern women',
        price: 100,
        originalPrice: 120,
        category: 'set',
        featured: true,
        inStock: true,
        images: [],
        tags: ['مجموعة', 'أنيق', 'نسائي'],
        tagsEn: ['set', 'elegant', 'women'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'طقم ذهبي فاخر',
        nameEn: 'Luxury Gold Set',
        slug: 'luxury-gold-set',
        description: 'طقم ذهبي فاخر مع تصميمات عصرية',
        descriptionEn: 'Luxury gold set with modern designs',
        price: 100,
        originalPrice: 130,
        category: 'set',
        featured: false,
        inStock: true,
        images: [],
        tags: ['ذهبي', 'فاخر', 'طقم'],
        tagsEn: ['gold', 'luxury', 'set'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'مجموعة فضية كلاسيكية',
        nameEn: 'Classic Silver Set',
        slug: 'classic-silver-set',
        description: 'مجموعة فضية كلاسيكية بتصميمات تقليدية',
        descriptionEn: 'Classic silver set with traditional designs',
        price: 100,
        originalPrice: 110,
        category: 'set',
        featured: true,
        inStock: true,
        images: [],
        tags: ['فضي', 'كلاسيكي', 'تقليدي'],
        tagsEn: ['silver', 'classic', 'traditional'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'طقم مودرن للشباب',
        nameEn: 'Modern Youth Set',
        slug: 'modern-youth-set',
        description: 'طقم عصري مناسب للشباب والشابات',
        descriptionEn: 'Modern set suitable for young men and women',
        price: 100,
        originalPrice: 125,
        category: 'set',
        featured: false,
        inStock: true,
        images: [],
        tags: ['عصري', 'شباب', 'مودرن'],
        tagsEn: ['modern', 'youth', 'contemporary'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'مجموعة حفلات راقية',
        nameEn: 'Elegant Party Set',
        slug: 'elegant-party-set',
        description: 'مجموعة إكسسوارات مثالية للحفلات والمناسبات',
        descriptionEn: 'Perfect accessories set for parties and occasions',
        price: 100,
        originalPrice: 140,
        category: 'set',
        featured: true,
        inStock: true,
        images: [],
        tags: ['حفلات', 'راقي', 'مناسبات'],
        tagsEn: ['party', 'elegant', 'occasions'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'طقم يومي عملي',
        nameEn: 'Daily Practical Set',
        slug: 'daily-practical-set',
        description: 'طقم إكسسوارات عملي للاستخدام اليومي',
        descriptionEn: 'Practical accessories set for daily use',
        price: 100,
        originalPrice: 115,
        category: 'set',
        featured: false,
        inStock: true,
        images: [],
        tags: ['يومي', 'عملي', 'بسيط'],
        tagsEn: ['daily', 'practical', 'simple'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'مجموعة عروس فاخرة',
        nameEn: 'Luxury Bride Set',
        slug: 'luxury-bride-set',
        description: 'مجموعة إكسسوارات فاخرة للعروس',
        descriptionEn: 'Luxury accessories set for the bride',
        price: 100,
        originalPrice: 150,
        category: 'set',
        featured: true,
        inStock: true,
        images: [],
        tags: ['عروس', 'فاخر', 'زفاف'],
        tagsEn: ['bride', 'luxury', 'wedding'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'طقم هدايا مميز',
        nameEn: 'Special Gift Set',
        slug: 'special-gift-set',
        description: 'طقم إكسسوارات مميز مناسب كهدية',
        descriptionEn: 'Special accessories set perfect as a gift',
        price: 100,
        originalPrice: 120,
        category: 'set',
        featured: false,
        inStock: true,
        images: [],
        tags: ['هدية', 'مميز', 'تذكار'],
        tagsEn: ['gift', 'special', 'souvenir'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample products for RING category (6 products, 50 LYD each)
    const ringProducts = [
      {
        name: 'خاتم ذهبي أنيق',
        nameEn: 'Elegant Gold Ring',
        slug: 'elegant-gold-ring',
        description: 'خاتم ذهبي أنيق بتصميم عصري',
        descriptionEn: 'Elegant gold ring with modern design',
        price: 50,
        originalPrice: 60,
        category: 'ring',
        featured: true,
        inStock: true,
        images: [],
        tags: ['خاتم', 'ذهبي', 'أنيق'],
        tagsEn: ['ring', 'gold', 'elegant'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'خاتم فضة كلاسيكي',
        nameEn: 'Classic Silver Ring',
        slug: 'classic-silver-ring',
        description: 'خاتم فضة كلاسيكي بتصميم تقليدي',
        descriptionEn: 'Classic silver ring with traditional design',
        price: 50,
        originalPrice: 55,
        category: 'ring',
        featured: false,
        inStock: true,
        images: [],
        tags: ['خاتم', 'فضة', 'كلاسيكي'],
        tagsEn: ['ring', 'silver', 'classic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'خاتم مودرن للشباب',
        nameEn: 'Modern Youth Ring',
        slug: 'modern-youth-ring',
        description: 'خاتم عصري مناسب للشباب',
        descriptionEn: 'Modern ring suitable for youth',
        price: 50,
        originalPrice: 65,
        category: 'ring',
        featured: true,
        inStock: true,
        images: [],
        tags: ['خاتم', 'عصري', 'شباب'],
        tagsEn: ['ring', 'modern', 'youth'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'خاتم حفلات راقي',
        nameEn: 'Elegant Party Ring',
        slug: 'elegant-party-ring',
        description: 'خاتم راقي مثالي للحفلات',
        descriptionEn: 'Elegant ring perfect for parties',
        price: 50,
        originalPrice: 70,
        category: 'ring',
        featured: false,
        inStock: true,
        images: [],
        tags: ['خاتم', 'راقي', 'حفلات'],
        tagsEn: ['ring', 'elegant', 'party'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'خاتم يومي عملي',
        nameEn: 'Daily Practical Ring',
        slug: 'daily-practical-ring',
        description: 'خاتم عملي للاستخدام اليومي',
        descriptionEn: 'Practical ring for daily use',
        price: 50,
        originalPrice: 55,
        category: 'ring',
        featured: true,
        inStock: true,
        images: [],
        tags: ['خاتم', 'يومي', 'عملي'],
        tagsEn: ['ring', 'daily', 'practical'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'خاتم هدية مميز',
        nameEn: 'Special Gift Ring',
        slug: 'special-gift-ring',
        description: 'خاتم مميز مناسب كهدية',
        descriptionEn: 'Special ring perfect as a gift',
        price: 50,
        originalPrice: 60,
        category: 'ring',
        featured: false,
        inStock: true,
        images: [],
        tags: ['خاتم', 'هدية', 'مميز'],
        tagsEn: ['ring', 'gift', 'special'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Sample products for NECKLACES category (10 products, 50 LYD each)
    const necklaceProducts = [
      {
        name: 'قلادة ذهبية أنيقة',
        nameEn: 'Elegant Gold Necklace',
        slug: 'elegant-gold-necklace',
        description: 'قلادة ذهبية أنيقة بتصميم عصري',
        descriptionEn: 'Elegant gold necklace with modern design',
        price: 50,
        originalPrice: 60,
        category: 'necklaces',
        featured: true,
        inStock: true,
        images: [],
        tags: ['قلادة', 'ذهبية', 'أنيقة'],
        tagsEn: ['necklace', 'gold', 'elegant'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة فضة كلاسيكية',
        nameEn: 'Classic Silver Necklace',
        slug: 'classic-silver-necklace',
        description: 'قلادة فضة كلاسيكية بتصميم تقليدي',
        descriptionEn: 'Classic silver necklace with traditional design',
        price: 50,
        originalPrice: 55,
        category: 'necklaces',
        featured: false,
        inStock: true,
        images: [],
        tags: ['قلادة', 'فضة', 'كلاسيكية'],
        tagsEn: ['necklace', 'silver', 'classic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة مودرن للشباب',
        nameEn: 'Modern Youth Necklace',
        slug: 'modern-youth-necklace',
        description: 'قلادة عصري مناسب للشباب',
        descriptionEn: 'Modern necklace suitable for youth',
        price: 50,
        originalPrice: 65,
        category: 'necklaces',
        featured: true,
        inStock: true,
        images: [],
        tags: ['قلادة', 'عصري', 'شباب'],
        tagsEn: ['necklace', 'modern', 'youth'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة حفلات راقية',
        nameEn: 'Elegant Party Necklace',
        slug: 'elegant-party-necklace',
        description: 'قلادة راقية مثالية للحفلات',
        descriptionEn: 'Elegant necklace perfect for parties',
        price: 50,
        originalPrice: 70,
        category: 'necklaces',
        featured: false,
        inStock: true,
        images: [],
        tags: ['قلادة', 'راقية', 'حفلات'],
        tagsEn: ['necklace', 'elegant', 'party'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة يومية عملية',
        nameEn: 'Daily Practical Necklace',
        slug: 'daily-practical-necklace',
        description: 'قلادة عملية للاستخدام اليومي',
        descriptionEn: 'Practical necklace for daily use',
        price: 50,
        originalPrice: 55,
        category: 'necklaces',
        featured: true,
        inStock: true,
        images: [],
        tags: ['قلادة', 'يومية', 'عملية'],
        tagsEn: ['necklace', 'daily', 'practical'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة هدية مميزة',
        nameEn: 'Special Gift Necklace',
        slug: 'special-gift-necklace',
        description: 'قلادة مميزة مناسبة كهدية',
        descriptionEn: 'Special necklace perfect as a gift',
        price: 50,
        originalPrice: 60,
        category: 'necklaces',
        featured: false,
        inStock: true,
        images: [],
        tags: ['قلادة', 'هدية', 'مميزة'],
        tagsEn: ['necklace', 'gift', 'special'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة عروس فاخرة',
        nameEn: 'Luxury Bride Necklace',
        slug: 'luxury-bride-necklace',
        description: 'قلادة فاخرة للعروس',
        descriptionEn: 'Luxury necklace for the bride',
        price: 50,
        originalPrice: 75,
        category: 'necklaces',
        featured: true,
        inStock: true,
        images: [],
        tags: ['قلادة', 'عروس', 'فاخرة'],
        tagsEn: ['necklace', 'bride', 'luxury'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة طويلة أنيقة',
        nameEn: 'Elegant Long Necklace',
        slug: 'elegant-long-necklace',
        description: 'قلادة طويلة أنيقة بتصميم مميز',
        descriptionEn: 'Elegant long necklace with unique design',
        price: 50,
        originalPrice: 65,
        category: 'necklaces',
        featured: false,
        inStock: true,
        images: [],
        tags: ['قلادة', 'طويلة', 'أنيقة'],
        tagsEn: ['necklace', 'long', 'elegant'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة قصيرة مودرن',
        nameEn: 'Modern Short Necklace',
        slug: 'modern-short-necklace',
        description: 'قلادة قصيرة بتصميم عصري',
        descriptionEn: 'Short necklace with modern design',
        price: 50,
        originalPrice: 55,
        category: 'necklaces',
        featured: true,
        inStock: true,
        images: [],
        tags: ['قلادة', 'قصيرة', 'مودرن'],
        tagsEn: ['necklace', 'short', 'modern'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'قلادة متدرجة جميلة',
        nameEn: 'Beautiful Layered Necklace',
        slug: 'beautiful-layered-necklace',
        description: 'قلادة متدرجة بتصميم جميل',
        descriptionEn: 'Layered necklace with beautiful design',
        price: 50,
        originalPrice: 60,
        category: 'necklaces',
        featured: false,
        inStock: true,
        images: [],
        tags: ['قلادة', 'متدرجة', 'جميلة'],
        tagsEn: ['necklace', 'layered', 'beautiful'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Insert all products
    console.log('Adding SET products...');
    const setResult = await products.insertMany(setProducts);
    console.log(`✅ Added ${setResult.insertedCount} SET products`);

    console.log('Adding RING products...');
    const ringResult = await products.insertMany(ringProducts);
    console.log(`✅ Added ${ringResult.insertedCount} RING products`);

    console.log('Adding NECKLACES products...');
    const necklaceResult = await products.insertMany(necklaceProducts);
    console.log(`✅ Added ${necklaceResult.insertedCount} NECKLACES products`);

    console.log('\n🎉 Successfully added all products!');
    console.log(`Total products added: ${setResult.insertedCount + ringResult.insertedCount + necklaceResult.insertedCount}`);
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log(`- SET category: ${setResult.insertedCount} products (100 LYD each)`);
    console.log(`- RING category: ${ringResult.insertedCount} products (50 LYD each)`);
    console.log(`- NECKLACES category: ${necklaceResult.insertedCount} products (50 LYD each)`);

  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addSampleProducts();
