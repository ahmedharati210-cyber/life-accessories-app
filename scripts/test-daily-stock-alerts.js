/**
 * Test script for daily stock alerts
 * This simulates the daily cron job that should run once per day
 */

async function testDailyStockAlerts() {
  try {
    console.log('Testing daily stock alerts...');
    
    // Test the cron endpoint
    const response = await fetch('http://localhost:3000/api/cron', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Daily stock alerts test passed!');
      console.log(`📊 Checked ${result.alertsCount} stock alerts`);
    } else {
      console.log('❌ Daily stock alerts test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing daily stock alerts:', error.message);
  }
}

// Run the test
testDailyStockAlerts();
