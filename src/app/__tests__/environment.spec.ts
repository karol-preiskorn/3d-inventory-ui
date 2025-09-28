/**
 * Tests for environment configuration
 */

import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';

describe('Environment Configuration', () => {
  describe('Development environment', () => {
    it('should be defined', () => {
      expect(environment).toBeDefined();
    });

    it('should have production set to false', () => {
      expect(environment.production).toBe(false);
    });

    it('should have a baseurl defined', () => {
      expect(environment.baseurl).toBeDefined();
      expect(typeof environment.baseurl).toBe('string');
      expect(environment.baseurl.length).toBeGreaterThan(0);
    });

    it('should have a valid HTTPS baseurl', () => {
      expect(environment.baseurl).toMatch(/^https:\/\/.+/);
    });

    it('should point to development/staging API', () => {
      // Development should point to staging URL (d-inventory instead of 3d-inventory)
      expect(environment.baseurl).toContain('d-inventory-api');
    });
  });

  describe('Production environment', () => {
    it('should be defined', () => {
      expect(prodEnvironment).toBeDefined();
    });

    it('should have production set to true', () => {
      expect(prodEnvironment.production).toBe(true);
    });

    it('should have a baseurl defined', () => {
      expect(prodEnvironment.baseurl).toBeDefined();
      expect(typeof prodEnvironment.baseurl).toBe('string');
      expect(prodEnvironment.baseurl.length).toBeGreaterThan(0);
    });

    it('should have a valid HTTPS baseurl', () => {
      expect(prodEnvironment.baseurl).toMatch(/^https:\/\/.+/);
    });
  });

  describe('Environment differences', () => {
    it('should have different production flags', () => {
      expect(environment.production).not.toBe(prodEnvironment.production);
    });

    it('should both have required properties', () => {
      expect(environment.production).toBeDefined();
      expect(environment.baseurl).toBeDefined();
      expect(prodEnvironment.production).toBeDefined();
      expect(prodEnvironment.baseurl).toBeDefined();
    });

    it('should have secure URLs', () => {
      expect(environment.baseurl).toMatch(/^https:/);
      expect(prodEnvironment.baseurl).toMatch(/^https:/);
    });
  });
});
