/**
 * Simple unit tests for validation utility functions
 */

import Validation from '../shared/validation';

describe('Validation', () => {
  describe('match validator', () => {
    it('should return null when both fields match', () => {
      // Create a mock control structure
      const mockControls = {
        get: (name: string) => {
          const values: any = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': { value: 'test123', errors: null }
          };
          return values[name];
        }
      } as any;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls);

      expect(result).toBeNull();
    });

    it('should return matching error when fields do not match', () => {
      // Create a mock control structure
      const mockControls = {
        get: (name: string) => {
          const values: any = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': {
              value: 'different',
              errors: null,
              setErrors: jest.fn()
            }
          };
          return values[name];
        }
      } as any;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls);

      expect(result).toEqual({ matching: true });
    });

    it('should return null when checkControl has errors other than matching', () => {
      const mockControls = {
        get: (name: string) => {
          const values: any = {
            'password': { value: 'test123', errors: null },
            'confirmPassword': {
              value: 'different',
              errors: { required: true },
              setErrors: jest.fn()
            }
          };
          return values[name];
        }
      } as any;

      const validator = Validation.match('password', 'confirmPassword');
      const result = validator(mockControls);

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
          const values: any = {
            'deviceId': { value: 'device-123' },
            'modelId': { value: '' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as any;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return error when no fields are set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: any = {
            'deviceId': { value: '' },
            'modelId': { value: '' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as any;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toEqual({ atLeastOneValidator: true });
    });

    it('should return error when multiple fields are set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: any = {
            'deviceId': { value: 'device-123' },
            'modelId': { value: 'model-456' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as any;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toEqual({ atLeastOneValidator: true });
    });

    it('should work with modelId set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: any = {
            'deviceId': { value: '' },
            'modelId': { value: 'model-123' },
            'connectionId': { value: '' }
          };
          return values[name];
        }
      } as any;

      const result = validation.atLeastOneValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should work with connectionId set', () => {
      const mockControl = {
        get: (name: string) => {
          const values: any = {
            'deviceId': { value: '' },
            'modelId': { value: '' },
            'connectionId': { value: 'connection-789' }
          };
          return values[name];
        }
      } as any;

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
      const mockControl = { value: 123 } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return null for valid numeric strings', () => {
      const mockControl = { value: '456' } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return null for valid decimal numbers', () => {
      const mockControl = { value: '123.45' } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return error for null values', () => {
      const mockControl = { value: null } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for undefined values', () => {
      const mockControl = { value: undefined } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for empty strings', () => {
      const mockControl = { value: '' } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for non-numeric strings', () => {
      const mockControl = { value: 'not-a-number' } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toEqual({ number: true });
    });

    it('should return error for NaN values', () => {
      const mockControl = { value: NaN } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toEqual({ number: true });
    });

    it('should return null for zero', () => {
      const mockControl = { value: 0 } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toBeNull();
    });

    it('should return null for negative numbers', () => {
      const mockControl = { value: -123 } as any;
      const result = validation.numberValidator(mockControl);
      expect(result).toBeNull();
    });
  });
});
