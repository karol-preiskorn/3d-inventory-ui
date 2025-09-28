/**
 * Simple unit tests for validation utility functions
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';
import Validation from '../shared/validation';

// Type definitions for mock controls
interface MockFormControl {
  value: string | number | null | undefined;
  errors?: ValidationErrors | null;
  setErrors?: jest.Mock;
}

interface MockControlValues {
  [key: string]: MockFormControl;
}

interface MockFormGroup {
  get(name: string): MockFormControl | null;
}

describe('Validation', () => {
  describe('match validator', () => {
    it('should return null when both fields match', () => {
      // Create a mock control structure
      const mockControls = {
        get: (name: string) => {
          const values: MockControlValues = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': { value: 'test123', errors: null }
          };
          return values[name];
        }
      } as unknown as MockFormGroup;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls as unknown as AbstractControl);

      expect(result).toBeNull();
    });

    it('should return matching error when fields do not match', () => {
      // Create a mock control structure
      const mockControls = {
        get: (name: string) => {
          const values: MockControlValues = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': {
              value: 'different',
              errors: null,
              setErrors: jest.fn()
            }
          };
          return values[name];
        }
      } as unknown as MockFormGroup;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls as unknown as AbstractControl);

      expect(result).toEqual({ matching: true });
    });

    it('should return null when checkControl has errors other than matching', () => {
      const mockControls = {
        get: (name: string) => {
          const values: MockControlValues = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': {
              value: 'different',
              errors: { required: true },
              setErrors: jest.fn()
            }
          };
          return values[name];
        }
      } as unknown as MockFormGroup;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls as unknown as AbstractControl);

      expect(result).toBeNull();
    });
  });

  describe('basic validation logic', () => {
    it('should be defined', () => {
      expect(Validation).toBeDefined();
      expect(Validation.match).toBeDefined();
    });

    it('should create match validator function', () => {
      const validator = Validation.match('field1', 'field2');
      expect(typeof validator).toBe('function');
    });
  });

  describe('atLeastOneValidator', () => {
    let validation: Validation;

    beforeEach(() => {
      validation = new Validation();
    });

    it('should return null when exactly one field is set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: MockControlValues = {
            'deviceId': { value: 'device-123' },
            'modelId': { value: '' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as unknown as AbstractControl;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return error when no fields are set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: MockControlValues = {
            'deviceId': { value: '' },
            'modelId': { value: '' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as unknown as AbstractControl;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toEqual({ atLeastOneValidator: true });
    });

    it('should return error when multiple fields are set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: MockControlValues = {
            'deviceId': { value: 'device-123' },
            'modelId': { value: 'model-456' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as unknown as AbstractControl;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toEqual({ atLeastOneValidator: true });
    });

    it('should work with modelId set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: MockControlValues = {
            'deviceId': { value: '' },
            'modelId': { value: 'model-123' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as unknown as AbstractControl;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should work with connectionId set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: MockControlValues = {
            'deviceId': { value: '' },
            'modelId': { value: '' },
            'connectionId': { value: 'connection-789' }
          };
          return values[name];
        }
      } as unknown as AbstractControl;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toBeNull();
    });
  });

  describe('numberValidator', () => {
    let validation: Validation;

    beforeEach(() => {
      validation = new Validation();
    });

    it('should return null for valid numbers', () => {
      const mockControl = { value: 123 } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return null for valid numeric strings', () => {
      const mockControl = { value: '456' } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return null for valid decimal numbers', () => {
      const mockControl = { value: '123.45' } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return error for null values', () => {
      const mockControl = { value: null } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for undefined values', () => {
      const mockControl = { value: undefined } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for empty strings', () => {
      const mockControl = { value: '' } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for non-numeric strings', () => {
      const mockControl = { value: 'not-a-number' } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for NaN values', () => {
      const mockControl = { value: NaN } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toEqual({ number: true });
    });

    it('should return null for zero', () => {
      const mockControl = { value: 0 } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return null for negative numbers', () => {
      const mockControl = { value: -123 } as MockFormControl;
      const result = validation.numberValidator(mockControl as unknown as AbstractControl);
      expect(result).toBeNull();
    });
  });
});
