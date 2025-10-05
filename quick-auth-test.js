/**
 * Quick Authentication Test for 3D Inventory UI
 * Run this in browser console at http://localhost:4200
 */

console.log('🧪 Quick Authentication Test')
console.log('============================')

// Test credentials (carlo is most reliable based on test results)
const testLogin = async (username, password) => {
  try {
    console.log(`\n🔐 Testing login: ${username}`)

    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (response.ok && data.token) {
      console.log('✅ Login successful!')
      console.log('Token:', data.token.substring(0, 50) + '...')

      // Store token for Angular app
      localStorage.setItem('3d-inventory-token', data.token)

      // Test GitHub issues endpoint with token
      const githubResponse = await fetch('http://localhost:8080/github/issues', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (githubResponse.ok) {
        const issues = await githubResponse.json()
        console.log('✅ GitHub issues accessible!', issues.length, 'issues found')
      } else {
        const error = await githubResponse.json()
        console.log('❌ GitHub issues failed:', error)
      }

      // Reload page to update Angular auth state
      setTimeout(() => {
        console.log('🔄 Reloading page to update authentication...')
        window.location.reload()
      }, 2000)

      return true
    } else {
      console.log('❌ Login failed:', data)
      return false
    }
  } catch (error) {
    console.log('❌ Login error:', error)
    return false
  }
}

// Test with carlo credentials (most reliable)
console.log('\n💡 Testing with carlo credentials...')
testLogin('carlo', 'carlo123!')

console.log('\n📝 Manual test function available:')
console.log('Run: testLogin("username", "password")')

// Make function available globally
window.testLogin = testLogin
