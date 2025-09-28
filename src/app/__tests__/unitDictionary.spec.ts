/**
 * Tests for UnitDictionary shared utility
 */

import { UnitDictionary, UnitDictionaryItem } from '../shared/UnitDictionary';

describe('UnitDictionary', () => {
  let dictionary: UnitDictionary;

  beforeEach(() => {
    dictionary = new UnitDictionary();
  });

  describe('getAllUnits', () => {
    it('should return all unit items', () => {
      const items = dictionary.getAllUnits();
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should return items with required structure', () => {
      const items = dictionary.getAllUnits();
      items.forEach((item: UnitDictionaryItem) => {
        expect(item.name).toBeDefined();
        expect(item.description).toBeDefined();
        expect(typeof item.name).toBe('string');
        expect(typeof item.description).toBe('string');
      });
    });

    it('should include length units', () => {
      const items = dictionary.getAllUnits();
      const names = items.map((item: UnitDictionaryItem) => item.name);
      expect(names).toContain('m');
      expect(names).toContain('cm');
      expect(names).toContain('mm');
      expect(names).toContain('km');
    });

    it('should include mass units', () => {
      const items = dictionary.getAllUnits();
      const names = items.map((item: UnitDictionaryItem) => item.name);
      expect(names).toContain('g');
      expect(names).toContain('kg');
      expect(names).toContain('mg');
    });

    it('should include volume units', () => {
      const items = dictionary.getAllUnits();
      const names = items.map((item: UnitDictionaryItem) => item.name);
      expect(names).toContain('l');
      expect(names).toContain('ml');
    });

    it('should include time units', () => {
      const items = dictionary.getAllUnits();
      const names = items.map((item: UnitDictionaryItem) => item.name);
      expect(names).toContain('s');
      expect(names).toContain('min');
      expect(names).toContain('h');
    });

    it('should include data size units', () => {
      const items = dictionary.getAllUnits();
      const names = items.map((item: UnitDictionaryItem) => item.name);
      expect(names).toContain('B');
      expect(names).toContain('KB');
      expect(names).toContain('MB');
      expect(names).toContain('GB');
    });
  });

  describe('getRandomUnit', () => {
    it('should return a valid unit item', () => {
      const item = dictionary.getRandomUnit();
      expect(item).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
    });

    it('should return items from the available list', () => {
      const allItems = dictionary.getAllUnits();
      const randomItem = dictionary.getRandomUnit();

      const found = allItems.find((item: UnitDictionaryItem) =>
        item.name === randomItem.name &&
        item.description === randomItem.description
      );
      expect(found).toBeDefined();
    });
  });

  describe('getRandomUnitName', () => {
    it('should return a string', () => {
      const name = dictionary.getRandomUnitName();
      expect(typeof name).toBe('string');
    });

    it('should return a name from available units', () => {
      const allItems = dictionary.getAllUnits();
      const allNames = allItems.map((item: UnitDictionaryItem) => item.name);
      const randomName = dictionary.getRandomUnitName();
      expect(allNames).toContain(randomName);
    });
  });

  describe('findUnitByName', () => {
    it('should find meter unit', () => {
      const meterItem = dictionary.findUnitByName('m');
      expect(meterItem).toBeDefined();
      expect(meterItem?.name).toBe('m');
      expect(meterItem?.description).toContain('Meter');
    });

    it('should find kilogram unit', () => {
      const kgItem = dictionary.findUnitByName('kg');
      expect(kgItem).toBeDefined();
      expect(kgItem?.name).toBe('kg');
      expect(kgItem?.description).toContain('Kilogram');
    });

    it('should find liter unit', () => {
      const literItem = dictionary.findUnitByName('l');
      expect(literItem).toBeDefined();
      expect(literItem?.name).toBe('l');
      expect(literItem?.description).toContain('Liter');
    });

    it('should find second unit', () => {
      const secondItem = dictionary.findUnitByName('s');
      expect(secondItem).toBeDefined();
      expect(secondItem?.name).toBe('s');
      expect(secondItem?.description).toContain('Second');
    });

    it('should find byte unit', () => {
      const byteItem = dictionary.findUnitByName('B');
      expect(byteItem).toBeDefined();
      expect(byteItem?.name).toBe('B');
      expect(byteItem?.description).toContain('Byte');
    });

    it('should find gigabyte unit', () => {
      const gbItem = dictionary.findUnitByName('GB');
      expect(gbItem).toBeDefined();
      expect(gbItem?.name).toBe('GB');
      expect(gbItem?.description).toContain('Gigabyte');
    });

    it('should return undefined for non-existent units', () => {
      const nonExistentItem = dictionary.findUnitByName('xyz');
      expect(nonExistentItem).toBeUndefined();
    });

    it('should handle empty string', () => {
      const emptyItem = dictionary.findUnitByName('');
      expect(emptyItem).toBeDefined();
      expect(emptyItem?.name).toBe('');
      expect(emptyItem?.description).toBe('No unit');
    });
  });

  describe('logUnitIfExists', () => {
    it('should execute without error for existing units', () => {
      expect(() => dictionary.logUnitIfExists('m')).not.toThrow();
      expect(() => dictionary.logUnitIfExists('kg')).not.toThrow();
      expect(() => dictionary.logUnitIfExists('GB')).not.toThrow();
    });

    it('should execute without error for non-existent units', () => {
      expect(() => dictionary.logUnitIfExists('non-existent')).not.toThrow();
    });
  });

  describe('UnitDictionaryItem interface', () => {
    it('should allow creating items with required properties', () => {
      const item: UnitDictionaryItem = {
        name: 'test-unit',
        description: 'A test unit for testing'
      };

      expect(item.name).toBe('test-unit');
      expect(item.description).toBe('A test unit for testing');
    });
  });

  describe('unit categories', () => {
    it('should have proper descriptions for length units', () => {
      const lengthUnits = ['m', 'cm', 'mm', 'km'];
      lengthUnits.forEach(unit => {
        const item = dictionary.findUnitByName(unit);
        expect(item?.description).toContain('length');
      });
    });

    it('should have proper descriptions for mass units', () => {
      const massUnits = ['g', 'kg', 'mg'];
      massUnits.forEach(unit => {
        const item = dictionary.findUnitByName(unit);
        expect(item?.description).toContain('mass');
      });
    });

    it('should have proper descriptions for volume units', () => {
      const volumeUnits = ['l', 'ml'];
      volumeUnits.forEach(unit => {
        const item = dictionary.findUnitByName(unit);
        expect(item?.description).toContain('volume');
      });
    });

    it('should have proper descriptions for time units', () => {
      const timeUnits = ['s', 'min', 'h'];
      timeUnits.forEach(unit => {
        const item = dictionary.findUnitByName(unit);
        expect(item?.description).toContain('time');
      });
    });

    it('should have proper descriptions for data size units', () => {
      const dataSizeUnits = ['B', 'KB', 'MB', 'GB'];
      dataSizeUnits.forEach(unit => {
        const item = dictionary.findUnitByName(unit);
        expect(item?.description).toContain('data size');
      });
    });
  });
});
