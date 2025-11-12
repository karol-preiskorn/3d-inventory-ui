/**
 * Login Functionality Test Script
 * Tests both admin and user login scenarios via UI automation
 */

// This script can be run in browser console to test login functionality
console.log('🧪 Login Functionality Test Script')
console.log('=====================================')

// Test credentials based on API analysis
const testCredentials = [
  { username: 'admin', password: 'admin123!', role: 'admin' },
  { username: 'user', password: 'user123!', role: 'user' },
  { username: 'carlo', password: 'carlo123!', role: 'user' },
  { username: 'viewer', password: 'viewer123!', role: 'viewer' },
  // Fallback simple credentials
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user', password: 'user', role: 'user' }
]

/**
 * Test login via UI form
 */
async function testLoginUI(username, password) {
  console.log(`\n🔐 Testing login for ${username}...`)

  // Navigate to login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login'
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Fill login form
  const usernameInput = document.querySelector('input[formControlName="username"]')
  const passwordInput = document.querySelector('input[formControlName="password"]')
  const submitButton = document.querySelector('button[type="submit"]')

  if (!usernameInput || !passwordInput || !submitButton) {
    console.error('❌ Login form elements not found')
    return false
  }

  // Clear and fill inputs
  usernameInput.value = ''
  passwordInput.value = ''
  usernameInput.dispatchEvent(new Event('input', { bubbles: true }))
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

  usernameInput.value = username
  passwordInput.value = password
  usernameInput.dispatchEvent(new Event('input', { bubbles: true }))
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

  // Submit form
  submitButton.click()

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Check if login was successful (redirected away from login page)
  const currentPath = window.location.pathname
  if (!currentPath.includes('/login')) {
    console.log(`✅ Login successful for ${username} - redirected to ${currentPath}`)
    return true
  } else {
    console.log(`❌ Login failed for ${username} - still on login page`)
    return false
  }
}

/**
 * Test login via Authentication Service directly
 */
async function testLoginService(username, password) {
  console.log(`\n🔧 Testing login service for ${username}...`)

  try {
    // Access Angular's authentication service
    const authService = window.ng?.getInjector?.()?.get?.('AuthenticationService')
    if (!authService) {
      console.error('❌ AuthenticationService not available')
      return false
    }

    const loginRequest = { username, password }

    authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log(`✅ Service login successful for ${username}:`, response)
        return true
      },
      error: (error) => {
        console.log(`❌ Service login failed for ${username}:`, error.message)
        return false
      }
    })
  } catch (error) {
    console.error(`❌ Error testing service login for ${username}:`, error)
    return false
  }
}

/**
 * Run comprehensive login tests
 */
async function runLoginTests() {
  console.log('\n🚀 Starting comprehensive login tests...\n')

  for (const cred of testCredentials) {
    console.log(`\n--- Testing ${cred.username} (${cred.role}) ---`)

    // Test via UI
    const uiResult = await testLoginUI(cred.username, cred.password)

    if (uiResult) {
      console.log(`✅ ${cred.username} login successful - stopping tests`)
      break
    }

    // Wait between attempts to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

/**
 * Display current authentication state
 */
function displayAuthState() {
  console.log('\n📊 Current Authentication State:')
  console.log('================================')

  // Check localStorage
  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('auth_user')

  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'None')
  console.log('User:', user ? JSON.parse(user) : 'None')

  // Check if authenticated via service
  try {
    const authService = window.ng?.getInjector?.()?.get?.('AuthenticationService')
    if (authService) {
      console.log('Service Auth State:', authService.isAuthenticated())
      console.log('Current User:', authService.getCurrentUser())
    }
  } catch (error) {
    console.log('Service not available in this context')
  }
}

/**
 * Manual login test function
 */
function manualLogin(username, password) {
  console.log(`\n🔐 Manual login test for ${username}...`)
  testLoginUI(username, password)
}

// Export functions for manual testing
window.loginTest = {
  runTests: runLoginTests,
  manualLogin: manualLogin,
  displayAuthState: displayAuthState,
  testCredentials: testCredentials
}

console.log('\n📝 Available functions:')
console.log('- loginTest.runTests() - Run all login tests')
console.log('- loginTest.manualLogin(username, password) - Test specific credentials')
console.log('- loginTest.displayAuthState() - Show current auth state')
console.log('- loginTest.testCredentials - View all test credentials')

console.log('\n💡 To start testing, run: loginTest.runTests()')
