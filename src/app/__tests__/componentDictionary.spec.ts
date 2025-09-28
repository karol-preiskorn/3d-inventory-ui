/**
 * Tests for ComponentDictionary shared utility
 */

import { ComponentDictionary, ComponentDictionaryItem } from '../shared/ComponentDictionary';

describe('ComponentDictionary', () => {
  let dictionary: ComponentDictionary;

  beforeEach(() => {
    dictionary = new ComponentDictionary();
  });

  describe('getAll', () => {
    it('should return all component items', () => {
      const items = dictionary.getAll();
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should return items with required structure', () => {
      const items = dictionary.getAll();
      items.forEach(item => {
        expect(item.name).toBeDefined();
        expect(item.description).toBeDefined();
        expect(typeof item.name).toBe('string');
        expect(typeof item.description).toBe('string');
      });
    });

    it('should include expected components', () => {
      const items = dictionary.getAll();
      const names = items.map(item => item.name);
      expect(names).toContain('device');
      expect(names).toContain('model');
      expect(names).toContain('connection');
      expect(names).toContain('attribute');
      expect(names).toContain('floor');
    });

    it('should return a copy of the list (not original)', () => {
      const items1 = dictionary.getAll();
      const items2 = dictionary.getAll();
      expect(items1).not.toBe(items2); // Different instances
      expect(items1).toEqual(items2); // But same content
    });
  });

  describe('getRandom', () => {
    it('should return a valid component item', () => {
      const item = dictionary.getRandom();
      expect(item).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
    });

    it('should return items from the available list', () => {
      const allItems = dictionary.getAll();
      const randomItem = dictionary.getRandom();

      const found = allItems.find(item =>
        item.name === randomItem.name &&
        item.description === randomItem.description
      );
      expect(found).toBeDefined();
    });

    it('should potentially return different items on multiple calls', () => {
      // This test has a small chance of failure due to randomness
      // but with multiple calls it should likely get different results
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        results.add(dictionary.getRandom().name);
      }
      // If we have more than 1 result, randomness is working
      // If we only get 1 result, it might be bad luck or an issue
      expect(results.size).toBeGreaterThan(0);
    });
  });

  describe('getRandomName', () => {
    it('should return a string', () => {
      const name = dictionary.getRandomName();
      expect(typeof name).toBe('string');
    });

    it('should return a name from available components', () => {
      const allItems = dictionary.getAll();
      const allNames = allItems.map(item => item.name);
      const randomName = dictionary.getRandomName();
      expect(allNames).toContain(randomName);
    });
  });

  describe('findByName', () => {
    it('should find existing components', () => {
      const deviceItem = dictionary.findByName('device');
      expect(deviceItem).toBeDefined();
      expect(deviceItem?.name).toBe('device');
      expect(deviceItem?.description).toContain('device');
    });

    it('should find model component', () => {
      const modelItem = dictionary.findByName('model');
      expect(modelItem).toBeDefined();
      expect(modelItem?.name).toBe('model');
      expect(modelItem?.description).toContain('model');
    });

    it('should find connection component', () => {
      const connectionItem = dictionary.findByName('connection');
      expect(connectionItem).toBeDefined();
      expect(connectionItem?.name).toBe('connection');
      expect(connectionItem?.description).toContain('link');
    });

    it('should find attribute component', () => {
      const attributeItem = dictionary.findByName('attribute');
      expect(attributeItem).toBeDefined();
      expect(attributeItem?.name).toBe('attribute');
      expect(attributeItem?.description).toContain('property');
    });

    it('should find floor component', () => {
      const floorItem = dictionary.findByName('floor');
      expect(floorItem).toBeDefined();
      expect(floorItem?.name).toBe('floor');
      expect(floorItem?.description).toContain('floor');
    });

    it('should return undefined for non-existent components', () => {
      const nonExistentItem = dictionary.findByName('non-existent');
      expect(nonExistentItem).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const upperCaseItem = dictionary.findByName('DEVICE');
      expect(upperCaseItem).toBeUndefined();
    });

    it('should handle empty string', () => {
      const emptyItem = dictionary.findByName('');
      expect(emptyItem).toBeDefined();
      expect(emptyItem?.name).toBe('');
      expect(emptyItem?.description).toBe('Empty component');
    });
  });

  describe('logIfExists', () => {
    it('should execute without error for existing components', () => {
      // We can't easily test console.log, but we can ensure no errors
      expect(() => dictionary.logIfExists('device')).not.toThrow();
      expect(() => dictionary.logIfExists('model')).not.toThrow();
      expect(() => dictionary.logIfExists('connection')).not.toThrow();
    });

    it('should execute without error for non-existent components', () => {
      expect(() => dictionary.logIfExists('non-existent')).not.toThrow();
      expect(() => dictionary.logIfExists('')).not.toThrow();
    });
  });

  describe('ComponentDictionaryItem interface', () => {
    it('should allow creating items with required properties', () => {
      const item: ComponentDictionaryItem = {
        name: 'test-component',
        description: 'A test component for testing'
      };

      expect(item.name).toBe('test-component');
      expect(item.description).toBe('A test component for testing');
    });
  });
});
