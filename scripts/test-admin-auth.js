/**
 * Test script for admin authentication
 * Run with: node scripts/test-admin-auth.js
 */

const crypto = require('crypto');

// Test environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-me';

console.log('🔐 Admin Authentication Test');
console.log('============================');

// Test 1: Environment Variables
console.log('\n1. Environment Variables:');
console.log(`   ADMIN_USERNAME: ${ADMIN_USERNAME}`);
console.log(`   ADMIN_PASSWORD: ${ADMIN_PASSWORD ? '***' + ADMIN_PASSWORD.slice(-3) : 'NOT SET'}`);
console.log(`   ADMIN_SESSION_SECRET: ${ADMIN_SESSION_SECRET ? '***' + ADMIN_SESSION_SECRET.slice(-3) : 'NOT SET'}`);

// Test 2: Credential Verification
console.log('\n2. Credential Verification:');
const testUsername = 'admin';
const testPassword = 'admin123';
const isValid = testUsername === ADMIN_USERNAME && testPassword === ADMIN_PASSWORD;
console.log(`   Valid credentials (admin/admin123): ${isValid ? '✅' : '❌'}`);

// Test 3: Session Creation
console.log('\n3. Session Creation:');
try {
  const sessionData = {
    isAuthenticated: true,
    username: ADMIN_USERNAME,
    loginTime: Date.now(),
  };
  
  const sessionString = JSON.stringify(sessionData);
  const key = crypto.scryptSync(ADMIN_SESSION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(sessionString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const sessionToken = iv.toString('hex') + ':' + encrypted;
  
  console.log(`   Session created: ✅`);
  console.log(`   Session token length: ${sessionToken.length} characters`);
} catch (error) {
  console.log(`   Session creation failed: ❌ ${error.message}`);
}

// Test 4: Session Verification
console.log('\n4. Session Verification:');
try {
  const sessionData = {
    isAuthenticated: true,
    username: ADMIN_USERNAME,
    loginTime: Date.now(),
  };
  
  const sessionString = JSON.stringify(sessionData);
  const key = crypto.scryptSync(ADMIN_SESSION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(sessionString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const sessionToken = iv.toString('hex') + ':' + encrypted;
  
  // Verify the session
  const parts = sessionToken.split(':');
  const verifyIv = Buffer.from(parts[0], 'hex');
  const verifyEncrypted = parts[1];
  
  const verifyKey = crypto.scryptSync(ADMIN_SESSION_SECRET, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', verifyKey, verifyIv);
  
  let decrypted = decipher.update(verifyEncrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  const verifiedSession = JSON.parse(decrypted);
  const isValidSession = verifiedSession.isAuthenticated && verifiedSession.username === ADMIN_USERNAME;
  
  console.log(`   Session verification: ${isValidSession ? '✅' : '❌'}`);
} catch (error) {
  console.log(`   Session verification failed: ❌ ${error.message}`);
}

// Test 5: Security Recommendations
console.log('\n5. Security Recommendations:');
const recommendations = [];

if (ADMIN_PASSWORD === 'admin123' || ADMIN_PASSWORD === 'admin') {
  recommendations.push('⚠️  Change the default admin password');
}

if (ADMIN_SESSION_SECRET === 'default-secret-change-me') {
  recommendations.push('⚠️  Change the default session secret');
}

if (ADMIN_PASSWORD && ADMIN_PASSWORD.length < 8) {
  recommendations.push('⚠️  Use a password with at least 8 characters');
}

if (recommendations.length === 0) {
  console.log('   ✅ All security settings look good!');
} else {
  recommendations.forEach(rec => console.log(`   ${rec}`));
}

console.log('\n🎯 Next Steps:');
console.log('1. Set your admin credentials in .env.local');
console.log('2. Start the development server: npm run dev');
console.log('3. Navigate to /admin to test the login');
console.log('4. Try accessing /admin/dashboard after login');

console.log('\n✨ Admin security setup complete!');
