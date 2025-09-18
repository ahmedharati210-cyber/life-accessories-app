#!/usr/bin/env node

/**
 * Facebook Sharing Test Script
 * 
 * This script helps test if your Open Graph meta tags are working correctly
 * for Facebook sharing. It checks the meta tags on your website and provides
 * debugging information.
 */

const https = require('https');
const { URL } = require('url');

const SITE_URL = 'https://life-accessories.vercel.app';

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

function extractMetaTags(html) {
  const metaTags = {};
  const ogTags = {};
  const twitterTags = {};
  
  // Extract all meta tags
  const metaRegex = /<meta[^>]+>/gi;
  const metaMatches = html.match(metaRegex) || [];
  
  metaMatches.forEach(tag => {
    const nameMatch = tag.match(/name=["']([^"']+)["']/i);
    const propertyMatch = tag.match(/property=["']([^"']+)["']/i);
    const contentMatch = tag.match(/content=["']([^"']+)["']/i);
    
    if (contentMatch) {
      const content = contentMatch[1];
      
      if (nameMatch) {
        const name = nameMatch[1];
        metaTags[name] = content;
      }
      
      if (propertyMatch) {
        const property = propertyMatch[1];
        if (property.startsWith('og:')) {
          ogTags[property] = content;
        }
      }
    }
  });
  
  return { metaTags, ogTags, twitterTags };
}

async function testFacebookSharing() {
  console.log('🔍 Testing Facebook Sharing Meta Tags...\n');
  
  try {
    console.log(`📡 Fetching: ${SITE_URL}`);
    const html = await fetchPage(SITE_URL);
    
    const { metaTags, ogTags } = extractMetaTags(html);
    
    console.log('\n📋 Required Open Graph Tags:');
    console.log('================================');
    
    const requiredOgTags = [
      'og:title',
      'og:description', 
      'og:image',
      'og:url',
      'og:type',
      'og:site_name'
    ];
    
    requiredOgTags.forEach(tag => {
      const value = ogTags[tag];
      const status = value ? '✅' : '❌';
      console.log(`${status} ${tag}: ${value || 'MISSING'}`);
    });
    
    console.log('\n📱 Twitter Card Tags:');
    console.log('=====================');
    
    const twitterCard = metaTags['twitter:card'];
    const twitterTitle = metaTags['twitter:title'];
    const twitterDescription = metaTags['twitter:description'];
    const twitterImage = metaTags['twitter:image'];
    
    console.log(`${twitterCard ? '✅' : '❌'} twitter:card: ${twitterCard || 'MISSING'}`);
    console.log(`${twitterTitle ? '✅' : '❌'} twitter:title: ${twitterTitle || 'MISSING'}`);
    console.log(`${twitterDescription ? '✅' : '❌'} twitter:description: ${twitterDescription || 'MISSING'}`);
    console.log(`${twitterImage ? '✅' : '❌'} twitter:image: ${twitterImage || 'MISSING'}`);
    
    console.log('\n🔧 Facebook Debugging Tools:');
    console.log('============================');
    console.log('1. Facebook Sharing Debugger:');
    console.log('   https://developers.facebook.com/tools/debug/');
    console.log('2. Enter your URL to test: ' + SITE_URL);
    console.log('3. Click "Debug" to see how Facebook sees your page');
    
    console.log('\n📝 Additional Recommendations:');
    console.log('==============================');
    
    if (!ogTags['og:image']) {
      console.log('❌ Add og:image tag with a 1200x630px image');
    }
    
    if (!ogTags['og:image:width'] || !ogTags['og:image:height']) {
      console.log('💡 Consider adding og:image:width and og:image:height');
    }
    
    if (!ogTags['og:image:alt']) {
      console.log('💡 Consider adding og:image:alt for accessibility');
    }
    
    console.log('\n✨ Test completed! Use the Facebook Debugger to verify your changes.');
    
  } catch (error) {
    console.error('❌ Error testing Facebook sharing:', error.message);
    console.log('\n💡 Make sure your website is deployed and accessible at:', SITE_URL);
  }
}

// Run the test
testFacebookSharing();
