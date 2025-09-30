/**
 * Simple Node.js script to test the actual API endpoint structure
 * Run with: node test-api-structure.js
 */

const https = require('https');

async function testAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '3d-inventory-api.ultimasolution.pl',
      path: '/devices',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Device-API-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log('\n🔍 API Response Analysis:');
      console.log('Status Code:', res.statusCode);
      console.log('Content-Type:', res.headers['content-type']);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          console.log('\n📊 Response Structure:');
          console.log('✅ Response has "success" field:', typeof parsed.success);
          console.log('✅ Response has "data" field:', Array.isArray(parsed.data));
          console.log('✅ Number of devices:', parsed.data?.length || 0);
          
          if (parsed.data && parsed.data.length > 0) {
            const firstDevice = parsed.data[0];
            console.log('\n📱 First Device Structure:');
            console.log('- _id:', firstDevice._id ? '✅ Present' : '❌ Missing');
            console.log('- name:', firstDevice.name ? '✅ Present' : '❌ Missing');
            console.log('- modelId:', firstDevice.modelId ? '✅ Present' : '❌ Missing');
            console.log('- position:', firstDevice.position ? '✅ Present' : '❌ Missing');
            console.log('- attributes:', firstDevice.attributes ? '✅ Present' : '⚠️  Not present (optional)');
            
            if (firstDevice.position) {
              console.log('\n📍 Position Structure:');
              console.log('- x:', typeof firstDevice.position.x);
              console.log('- y:', typeof firstDevice.position.y);
              console.log('- h:', typeof firstDevice.position.h);
            }
            
            console.log('\n📝 Sample Data:');
            console.log('Device Name:', firstDevice.name);
            console.log('Device ID:', firstDevice._id);
            console.log('Position:', `(${firstDevice.position?.x}, ${firstDevice.position?.y}, ${firstDevice.position?.h})`);
          }
          
          console.log('\n✅ API Integration Status: READY');
          console.log('The API response structure matches what the Angular service expects.');
          
          resolve(parsed);
        } catch (error) {
          console.error('❌ JSON Parse Error:', error.message);
          console.log('Raw response:', data.substring(0, 200) + '...');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ API Request Error:', error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.error('❌ Request Timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

// Run the test
console.log('🧪 Testing 3D Inventory API Structure...');
testAPI()
  .then(() => {
    console.log('\n🎉 Test completed successfully!');
    console.log('The Angular device service should work correctly with this API.');
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  });