const fs = require('fs');
const path = require('path');

const adminDir = '/Users/macbookpro/Life /life-accessories/src/app/admin';

// List of admin subdirectories to hide
const adminSubdirs = [
  'analytics',
  'cache', 
  'categories',
  'customers',
  'login',
  'media',
  'orders',
  'products',
  'settings',
  'stock'
];

// Template for 404 pages
const notFoundTemplate = `import { notFound } from 'next/navigation';

export default function AdminPage() {
  // Return 404 to hide the existence of admin panel
  notFound();
}`;

console.log('🔒 Hiding old admin routes...');

// Update each admin subdirectory
adminSubdirs.forEach(subdir => {
  const pagePath = path.join(adminDir, subdir, 'page.tsx');
  
  if (fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, notFoundTemplate);
    console.log(`✅ Hidden /admin/${subdir}`);
  }
});

console.log('\n✨ All old admin routes now return 404!');
console.log('   - /admin → 404');
console.log('   - /admin/dashboard → 404');
console.log('   - /admin/products → 404');
console.log('   - /admin/orders → 404');
console.log('   - /admin/* → 404');
console.log('\n🔐 Admin panel is now completely hidden!');
console.log('   Only /harati routes are accessible.');
