/**
 * Tests for device categories shared data
 */

import { DeviceCategory, DeviceCategoryDict } from '../shared/deviceCategories';

describe('Device Categories', () => {
  describe('DeviceCategory', () => {
    it('should create an instance with default values', () => {
      const category = new DeviceCategory();
      expect(category.name).toBe('');
      expect(category.description).toBe('');
    });

    it('should allow setting name and description', () => {
      const category = new DeviceCategory();
      category.name = 'Test Category';
      category.description = 'Test Description';

      expect(category.name).toBe('Test Category');
      expect(category.description).toBe('Test Description');
    });
  });

  describe('DeviceCategoryDict', () => {
    let categoryDict: DeviceCategoryDict;

    beforeEach(() => {
      categoryDict = new DeviceCategoryDict();
    });

    it('should create an instance with a list', () => {
      expect(categoryDict.list).toBeDefined();
      expect(Array.isArray(categoryDict.list)).toBe(true);
    });

    it('should have at least one category in the list', () => {
      expect(categoryDict.list.length).toBeGreaterThan(0);
    });

    it('should have categories with required structure', () => {
      categoryDict.list.forEach(category => {
        expect(category.name).toBeDefined();
        expect(category.description).toBeDefined();
        expect(typeof category.name).toBe('string');
        expect(typeof category.description).toBe('string');
      });
    });

    it('should contain expected category types', () => {
      const categoryNames = categoryDict.list.map(cat => cat.name);
      expect(categoryNames).toContain('Connectivity');
      expect(categoryNames).toContain('Facility');
      expect(categoryNames).toContain('Site');
    });

    it('should have valid connectivity category', () => {
      const connectivity = categoryDict.list.find(cat => cat.name === 'Connectivity');
      expect(connectivity).toBeDefined();
      expect(connectivity?.description).toContain('Data centers');
    });

    it('should have valid facility category', () => {
      const facility = categoryDict.list.find(cat => cat.name === 'Facility');
      expect(facility).toBeDefined();
      expect(facility?.description).toContain('data center');
    });

    it('should have valid site category', () => {
      const site = categoryDict.list.find(cat => cat.name === 'Site');
      expect(site).toBeDefined();
      expect(site?.description).toContain('site');
    });

    it('should have first entry as empty/default', () => {
      const firstCategory = categoryDict.list[0];
      expect(firstCategory.name).toBe('');
      expect(firstCategory.description).toBe('');
    });
  });
});
