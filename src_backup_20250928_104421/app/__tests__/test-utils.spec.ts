/**
 * Tests for test utility functions
 */

import { generateTestEmail, generateTestPassword, generateTestUsername, TEST_CONSTANTS } from '../testing/test-utils';

describe('Test Utils', () => {
  describe('generateTestPassword', () => {
    it('should generate a password that starts with "Test_"', () => {
      const password = generateTestPassword();
      expect(password).toMatch(/^Test_/);
    });

    it('should generate passwords of appropriate length', () => {
      const password = generateTestPassword();
      // Should be at least "Test_" (5) + 8 chars + "_" + timestamp
      expect(password.length).toBeGreaterThan(10);
    });

    it('should generate unique passwords', () => {
      const password1 = generateTestPassword();
      const password2 = generateTestPassword();
      expect(password1).not.toBe(password2);
    });

    it('should contain valid password characters', () => {
      const password = generateTestPassword();
      // Should contain only valid characters
      expect(password).toMatch(/^[A-Za-z0-9!@#$%^&*_]+$/);
    });
  });

  describe('generateTestEmail', () => {
    it('should generate valid email format', () => {
      const email = generateTestEmail();
      expect(email).toMatch(/^test_\d+@example\.com$/);
    });

    it('should generate unique emails', async () => {
      const email1 = generateTestEmail();
      // Wait a millisecond to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      const email2 = generateTestEmail();
      expect(email1).not.toBe(email2);
    });

    it('should always end with @example.com', () => {
      const email = generateTestEmail();
      expect(email).toMatch(/@example\.com$/);
    });
  });

  describe('generateTestUsername', () => {
    it('should generate username starting with testuser_', () => {
      const username = generateTestUsername();
      expect(username).toMatch(/^testuser_/);
    });

    it('should generate unique usernames', async () => {
      const username1 = generateTestUsername();
      // Wait a millisecond to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      const username2 = generateTestUsername();
      expect(username1).not.toBe(username2);
    });

    it('should contain only alphanumeric characters and underscores', () => {
      const username = generateTestUsername();
      expect(username).toMatch(/^[a-zA-Z0-9_]+$/);
    });
  });

  describe('TEST_CONSTANTS', () => {
    it('should have all required constants defined', () => {
      expect(TEST_CONSTANTS.TEST_PASSWORD).toBeDefined();
      expect(TEST_CONSTANTS.TEST_EMAIL).toBeDefined();
      expect(TEST_CONSTANTS.TEST_USERNAME).toBeDefined();
      expect(TEST_CONSTANTS.MOCK_USER_ID).toBeDefined();
      expect(TEST_CONSTANTS.MOCK_DEVICE_ID).toBeDefined();
    });

    it('should have valid mock IDs', () => {
      expect(TEST_CONSTANTS.MOCK_USER_ID).toBe('test-user-id-123');
      expect(TEST_CONSTANTS.MOCK_DEVICE_ID).toBe('test-device-id-456');
    });

    it('should have generated email format', () => {
      expect(TEST_CONSTANTS.TEST_EMAIL).toMatch(/^test_\d+@example\.com$/);
    });

    it('should have generated username format', () => {
      expect(TEST_CONSTANTS.TEST_USERNAME).toMatch(/^testuser_/);
    });

    it('should have generated password format', () => {
      expect(TEST_CONSTANTS.TEST_PASSWORD).toMatch(/^Test_/);
    });
  });
});
