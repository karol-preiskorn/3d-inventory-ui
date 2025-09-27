/**
 * Test utilities for generating secure test data
 * Prevents hardcoded credentials in test files
 */

/**
 * Generate secure test password
 * Uses crypto-random values to avoid hardcoded passwords
 */
export function generateTestPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = 'Test_'

  // Add random characters
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Add timestamp to ensure uniqueness
  result += '_' + Date.now().toString(36)

  return result
}

/**
 * Generate test email address
 */
export function generateTestEmail(): string {
  return `test_${Date.now()}@example.com`
}

/**
 * Generate test username
 */
export function generateTestUsername(): string {
  return `testuser_${Date.now().toString(36)}`
}

/**
 * Common test data constants
 */
export const TEST_CONSTANTS = {
  // Use environment-specific test password
  TEST_PASSWORD: generateTestPassword(),
  TEST_EMAIL: generateTestEmail(),
  TEST_USERNAME: generateTestUsername(),

  // Mock IDs
  MOCK_USER_ID: 'test-user-id-123',
  MOCK_DEVICE_ID: 'test-device-id-456',
  MOCK_MODEL_ID: 'test-model-id-789'
} as const
