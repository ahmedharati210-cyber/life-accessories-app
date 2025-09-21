#!/usr/bin/env node

/**
 * Test Elegant Category Images Script
 * 
 * This script tests the new elegant category images
 * to ensure they're properly accessible and display correctly.
 */

const fs = require('fs');
const path = require('path');

const imageFiles = [
  'salasil-elegant.svg',
  'khawatim-elegant.svg', 
  'accessories-elegant.svg',
  'atqam-elegant.svg'
];

const categoriesDir = path.join(__dirname, '..', 'public', 'images', 'categories');

function testImageFiles() {
  console.log('🔍 Testing Elegant Category Images...\n');
  
  let allFilesExist = true;
  
  imageFiles.forEach(filename => {
    const filePath = path.join(categoriesDir, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      
      console.log(`✅ ${filename}`);
      console.log(`   Size: ${fileSizeKB} KB`);
      console.log(`   Path: ${filePath}`);
      
      // Check if it's a valid SVG
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<svg') && content.includes('</svg>')) {
        console.log(`   Status: Valid SVG ✅`);
      } else {
        console.log(`   Status: Invalid SVG ❌`);
        allFilesExist = false;
      }
    } else {
      console.log(`❌ ${filename} - File not found`);
      allFilesExist = false;
    }
    
    console.log('');
  });
  
  if (allFilesExist) {
    console.log('🎉 All elegant category images are ready!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database update script:');
    console.log('   node scripts/update-category-images.js');
    console.log('2. Clear your browser cache');
    console.log('3. Visit your categories page to see the new images');
  } else {
    console.log('❌ Some images are missing or invalid. Please check the files.');
  }
}

// Run the test
testImageFiles();


