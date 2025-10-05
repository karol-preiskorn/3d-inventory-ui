/**
 * Edit Device and Logging Verification Script
 * Tests the edit device functionality and log operations
 * Use this script in browser console at https://3d-inventory.ultimasolution.pl/
 */

console.log('🔧 Edit Device & Logging Verification Script')
console.log('===========================================')

// Test device ID from the URL
const DEVICE_ID = '68cfcae6dab0e8398f8f29f0'
const API_BASE = 'https://d-inventory-api-wzwe3odv7q-ew.a.run.app'

/**
 * Get authentication token from localStorage or prompt for login
 */
function getAuthToken() {
  const token = localStorage.getItem('3d-inventory-token')
  if (!token) {
    console.log('❌ No authentication token found')
    console.log('💡 Please login first using: quickLogin()')
    return null
  }
  return token
}

/**
 * Quick login function
 */
async function quickLogin() {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'carlo', password: 'carlo123!' })
    })

    const data = await response.json()
    if (data.token) {
      localStorage.setItem('3d-inventory-token', data.token)
      console.log('✅ Login successful! Token stored.')
      return data.token
    } else {
      console.log('❌ Login failed:', data)
      return null
    }
  } catch (error) {
    console.log('❌ Login error:', error)
    return null
  }
}

/**
 * Create authenticated headers
 */
function getAuthHeaders() {
  const token = getAuthToken()
  if (!token) return null

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Test 1: Fetch the device data
 */
async function testFetchDevice() {
  console.log('\n📋 Test 1: Fetching Device Data')
  console.log('--------------------------------')

  const headers = getAuthHeaders()
  if (!headers) return null

  try {
    const response = await fetch(`${API_BASE}/devices/${DEVICE_ID}`, {
      headers
    })

    if (response.ok) {
      const device = await response.json()
      console.log('✅ Device fetched successfully:')
      console.log(`   - ID: ${device.data._id}`)
      console.log(`   - Name: ${device.data.name}`)
      console.log(`   - Model ID: ${device.data.modelId}`)
      console.log(`   - Position: x=${device.data.position.x}, y=${device.data.position.y}, h=${device.data.position.h}`)
      return device.data
    } else {
      const error = await response.json()
      console.log('❌ Failed to fetch device:', error)
      return null
    }
  } catch (error) {
    console.log('❌ Error fetching device:', error)
    return null
  }
}

/**
 * Test 2: Create a log entry for device edit
 */
async function testCreateLog(device) {
  console.log('\n📝 Test 2: Creating Log Entry')
  console.log('------------------------------')

  const headers = getAuthHeaders()
  if (!headers) return null

  const logData = {
    operation: 'Update',
    component: 'devices',
    objectId: device._id,
    message: {
      ...device,
      testTimestamp: new Date().toISOString(),
      testSource: 'verification-script'
    }
  }

  try {
    const response = await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(logData)
    })

    if (response.ok) {
      const log = await response.json()
      console.log('✅ Log created successfully:')
      console.log(`   - Log ID: ${log._id}`)
      console.log(`   - Operation: ${log.operation}`)
      console.log(`   - Component: ${log.component}`)
      console.log(`   - Object ID: ${log.objectId}`)
      return log
    } else {
      const error = await response.json()
      console.log('❌ Failed to create log:', error)
      return null
    }
  } catch (error) {
    console.log('❌ Error creating log:', error)
    return null
  }
}

/**
 * Test 3: Update device (simulate edit operation)
 */
async function testUpdateDevice(device) {
  console.log('\n🔧 Test 3: Updating Device')
  console.log('---------------------------')

  const headers = getAuthHeaders()
  if (!headers) return null

  // Make a small modification for testing
  const updatedDevice = {
    ...device,
    name: device.name + ' (Updated)',
    position: {
      ...device.position,
      h: device.position.h + 0.1 // Small increment for testing
    }
  }

  try {
    const response = await fetch(`${API_BASE}/devices/${device._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedDevice)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Device updated successfully:')
      console.log(`   - Name changed: ${device.name} → ${result.data.name}`)
      console.log(`   - Height changed: ${device.position.h} → ${result.data.position.h}`)
      return result.data
    } else {
      const error = await response.json()
      console.log('❌ Failed to update device:', error)
      return null
    }
  } catch (error) {
    console.log('❌ Error updating device:', error)
    return null
  }
}

/**
 * Test 4: Fetch logs for the device
 */
async function testFetchDeviceLogs() {
  console.log('\n📊 Test 4: Fetching Device Logs')
  console.log('--------------------------------')

  const headers = getAuthHeaders()
  if (!headers) return null

  try {
    const response = await fetch(`${API_BASE}/logs/devices/${DEVICE_ID}`, {
      headers
    })

    if (response.ok) {
      const logs = await response.json()
      console.log(`✅ Found ${logs.data.length} log entries for device:`)

      logs.data.slice(0, 5).forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.operation} - ${new Date(log.date).toLocaleString()}`)
      })

      if (logs.data.length > 5) {
        console.log(`   ... and ${logs.data.length - 5} more entries`)
      }

      return logs.data
    } else {
      const error = await response.json()
      console.log('❌ Failed to fetch device logs:', error)
      return null
    }
  } catch (error) {
    console.log('❌ Error fetching device logs:', error)
    return null
  }
}

/**
 * Test 5: Fetch component logs for 'devices'
 */
async function testFetchComponentLogs() {
  console.log('\n📈 Test 5: Fetching Component Logs')
  console.log('-----------------------------------')

  const headers = getAuthHeaders()
  if (!headers) return null

  try {
    const response = await fetch(`${API_BASE}/logs/component/devices`, {
      headers
    })

    if (response.ok) {
      const logs = await response.json()
      console.log(`✅ Found ${logs.data.length} log entries for 'devices' component:`)

      // Group by operation
      const operations = {}
      logs.data.forEach(log => {
        operations[log.operation] = (operations[log.operation] || 0) + 1
      })

      Object.entries(operations).forEach(([op, count]) => {
        console.log(`   - ${op}: ${count} entries`)
      })

      return logs.data
    } else {
      const error = await response.json()
      console.log('❌ Failed to fetch component logs:', error)
      return null
    }
  } catch (error) {
    console.log('❌ Error fetching component logs:', error)
    return null
  }
}

/**
 * Run all verification tests
 */
async function runAllTests() {
  console.log('\n🚀 Starting Edit Device & Logging Verification')
  console.log('===============================================')

  // Check authentication first
  if (!getAuthToken()) {
    console.log('\n🔐 Authentication required. Running quick login...')
    const token = await quickLogin()
    if (!token) {
      console.log('❌ Cannot proceed without authentication')
      return
    }
  }

  // Run tests in sequence
  const device = await testFetchDevice()
  if (!device) {
    console.log('❌ Cannot proceed without device data')
    return
  }

  await testCreateLog(device)
  const updatedDevice = await testUpdateDevice(device)

  if (updatedDevice) {
    await testCreateLog(updatedDevice) // Log the update
  }

  await testFetchDeviceLogs()
  await testFetchComponentLogs()

  console.log('\n✅ All tests completed!')
  console.log('\n📋 Summary:')
  console.log('- Device fetch: Tested ✓')
  console.log('- Log creation: Tested ✓')
  console.log('- Device update: Tested ✓')
  console.log('- Device logs: Tested ✓')
  console.log('- Component logs: Tested ✓')
}

/**
 * Test the Angular edit form functionality
 */
function testAngularEditForm() {
  console.log('\n🅰️ Testing Angular Edit Form')
  console.log('------------------------------')

  // Check if we're on the edit device page
  if (!window.location.href.includes('edit-device')) {
    console.log('❌ Not on edit device page. Please navigate to the edit device page first.')
    return
  }

  // Try to find Angular form elements
  const form = document.querySelector('form[formGroup]')
  const nameInput = document.querySelector('input[formControlName="name"]')
  const xInput = document.querySelector('input[formControlName="x"]')
  const yInput = document.querySelector('input[formControlName="y"]')
  const hInput = document.querySelector('input[formControlName="h"]')
  const submitButton = document.querySelector('button[type="submit"]')

  if (form && nameInput && xInput && yInput && hInput && submitButton) {
    console.log('✅ Angular form elements found:')
    console.log(`   - Device Name: "${nameInput.value}"`)
    console.log(`   - Position X: ${xInput.value}`)
    console.log(`   - Position Y: ${yInput.value}`)
    console.log(`   - Position H: ${hInput.value}`)
    console.log(`   - Submit button: ${submitButton.disabled ? 'Disabled' : 'Enabled'}`)

    // Check if log component is present
    const logComponent = document.querySelector('app-log')
    if (logComponent) {
      console.log('✅ Log component is present on the page')
    } else {
      console.log('❌ Log component not found')
    }
  } else {
    console.log('❌ Angular form elements not found or page not loaded')
  }
}

// Make functions available globally
window.deviceTest = {
  runAllTests,
  testFetchDevice,
  testCreateLog,
  testUpdateDevice,
  testFetchDeviceLogs,
  testFetchComponentLogs,
  testAngularEditForm,
  quickLogin,
  DEVICE_ID
}

console.log('\n📝 Available test functions:')
console.log('- deviceTest.runAllTests() - Run all API tests')
console.log('- deviceTest.testAngularEditForm() - Test Angular form')
console.log('- deviceTest.quickLogin() - Login with carlo credentials')
console.log('- deviceTest.DEVICE_ID - Current device ID being tested')

console.log('\n💡 To start testing, run: deviceTest.runAllTests()')
