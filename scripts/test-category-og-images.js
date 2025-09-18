#!/usr/bin/env node

/**
 * Category Open Graph Images Test Script
 * 
 * This script tests the Open Graph images for each category
 * to ensure they're properly configured for Facebook sharing.
 */

const https = require('https');
const { URL } = require('url');

const SITE_URL = 'https://life-accessories.vercel.app';
const CATEGORIES = [
  { name: 'سلاسل', slug: 'salasil', expectedImage: 'salasil-og.jpg' },
  { name: 'خواتم', slug: 'khawatim', expectedImage: 'khawatim-og.jpg' },
  { name: 'اكسسوارات', slug: 'accessories', expectedImage: 'accessories-og.jpg' },
  { name: 'أطقم', slug: 'atqam', expectedImage: 'atqam-og.jpg' }
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractOgImage(html) {
  const ogImageRegex = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i;
  const match = html.match(ogImageRegex);
  return match ? match[1] : null;
}

function extractOgTitle(html) {
  const ogTitleRegex = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i;
  const match = html.match(ogTitleRegex);
  return match ? match[1] : null;
}

function extractOgDescription(html) {
  const ogDescRegex = /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i;
  const match = html.match(ogDescRegex);
  return match ? match[1] : null;
}

async function testCategoryOgImages() {
  console.log('🔍 Testing Category Open Graph Images...\n');
  
  for (const category of CATEGORIES) {
    const categoryUrl = `${SITE_URL}/category/${category.slug}`;
    console.log(`📱 Testing: ${category.name} (${category.slug})`);
    console.log(`🔗 URL: ${categoryUrl}`);
    
    try {
      const html = await fetchPage(categoryUrl);
      
      const ogImage = extractOgImage(html);
      const ogTitle = extractOgTitle(html);
      const ogDescription = extractOgDescription(html);
      
      console.log('📋 Open Graph Data:');
      console.log(`   Title: ${ogTitle || 'MISSING'}`);
      console.log(`   Description: ${ogDescription || 'MISSING'}`);
      console.log(`   Image: ${ogImage || 'MISSING'}`);
      
      // Check if the image contains the expected filename
      const hasCorrectImage = ogImage && ogImage.includes(category.expectedImage);
      const imageStatus = hasCorrectImage ? '✅' : '❌';
      console.log(`   Image Status: ${imageStatus} ${hasCorrectImage ? 'Correct' : 'Incorrect or Missing'}`);
      
      // Check if image URL is accessible
      if (ogImage) {
        try {
          const imageResponse = await fetchPage(ogImage);
          const imageStatus = imageResponse ? '✅ Accessible' : '❌ Not accessible';
          console.log(`   Image Access: ${imageStatus}`);
        } catch (error) {
          console.log(`   Image Access: ❌ Error - ${error.message}`);
        }
      }
      
      console.log('─'.repeat(60));
      
    } catch (error) {
      console.log(`❌ Error testing ${category.name}: ${error.message}`);
      console.log('─'.repeat(60));
    }
  }
  
  console.log('\n🔧 Facebook Debugging Tools:');
  console.log('============================');
  console.log('1. Facebook Sharing Debugger:');
  console.log('   https://developers.facebook.com/tools/debug/');
  console.log('2. Test each category URL:');
  CATEGORIES.forEach(category => {
    console.log(`   - ${category.name}: ${SITE_URL}/category/${category.slug}`);
  });
  
  console.log('\n✨ Test completed! Use the Facebook Debugger to verify your changes.');
}

// Run the test
testCategoryOgImages();
