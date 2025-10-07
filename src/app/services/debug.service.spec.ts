/**
 * Test suite for DebugService
 * Tests debug logging functionality that respects environment settings.
 */

import { TestBed } from '@angular/core/testing'
import { DebugService } from './debug.service'
import { environment } from '../../environments/environment'

// Mock environment
jest.mock('../../environments/environment', () => ({
  environment: {
    production: false
  }
}))

describe('DebugService', () => {
  let service: DebugService
  let consoleSpy: {
    warn: jest.SpyInstance
    error: jest.SpyInstance
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebugService]
    })

    service = TestBed.inject(DebugService)

    // Spy on console methods
    consoleSpy = {
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('Debug Logging in Development Mode', () => {
    beforeEach(() => {
      // Ensure we're in development mode
      ;(environment as any).production = false
    })

    it('should log debug messages in development mode', () => {
      service.debug('Test debug message', { data: 'test' })

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[DEBUG] Test debug message',
        { data: 'test' }
      )
    })

    it('should log info messages in development mode', () => {
      service.info('Test info message', 'additional', 'args')

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[INFO] Test info message',
        'additional',
        'args'
      )
    })

    it('should log lifecycle events in development mode', () => {
      service.lifecycle('UserComponent', 'ngOnInit', { userId: 123 })

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[LIFECYCLE] UserComponent - ngOnInit',
        { userId: 123 }
      )
    })

    it('should log API calls in development mode', () => {
      service.api('GET', '/api/users', { filter: 'active' })

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[API] GET /api/users',
        { filter: 'active' }
      )
    })

    it('should log lifecycle events without data parameter', () => {
      service.lifecycle('LoginComponent', 'ngOnDestroy')

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[LIFECYCLE] LoginComponent - ngOnDestroy',
        undefined
      )
    })

    it('should log API calls without data parameter', () => {
      service.api('DELETE', '/api/users/123')

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[API] DELETE /api/users/123',
        undefined
      )
    })
  })

  describe('Error Logging (Always Active)', () => {
    it('should always log errors regardless of environment', () => {
      const testError = new Error('Test error')
      service.error('Something went wrong', testError)

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] Something went wrong',
        testError
      )
    })

    it('should log errors without error object', () => {
      service.error('Simple error message')

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] Simple error message',
        undefined
      )
    })

    it('should log errors with custom error data', () => {
      const errorData = { status: 500, message: 'Internal Server Error' }
      service.error('API Error', errorData)

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] API Error',
        errorData
      )
    })
  })

  describe('Production Mode Behavior', () => {
    beforeEach(() => {
      // Mock production environment
      ;(environment as any).production = true

      // Recreate service to pick up new environment
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [DebugService]
      })
      service = TestBed.inject(DebugService)
    })

    it('should not log debug messages in production mode', () => {
      service.debug('This should not be logged')

      expect(consoleSpy.warn).not.toHaveBeenCalled()
    })

    it('should not log info messages in production mode', () => {
      service.info('This should not be logged')

      expect(consoleSpy.warn).not.toHaveBeenCalled()
    })

    it('should not log lifecycle events in production mode', () => {
      service.lifecycle('Component', 'event')

      expect(consoleSpy.warn).not.toHaveBeenCalled()
    })

    it('should not log API calls in production mode', () => {
      service.api('GET', '/api/test')

      expect(consoleSpy.warn).not.toHaveBeenCalled()
    })

    it('should still log errors in production mode', () => {
      const testError = new Error('Production error')
      service.error('Production error occurred', testError)

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] Production error occurred',
        testError
      )
    })
  })

  describe('Message Formatting', () => {
    beforeEach(() => {
      ;(environment as any).production = false
      // Create a new service instance with the updated environment
      service = new DebugService()
      jest.clearAllMocks()
    })

    it('should format debug messages with [DEBUG] prefix', () => {
      service.debug('Test message')

      expect(consoleSpy.warn).toHaveBeenCalledWith('[DEBUG] Test message')
    })

    it('should format info messages with [INFO] prefix', () => {
      service.info('Test message')

      expect(consoleSpy.warn).toHaveBeenCalledWith('[INFO] Test message')
    })

    it('should format error messages with [ERROR] prefix', () => {
      service.error('Test message')

      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Test message', undefined)
    })

    it('should format lifecycle messages with component and event', () => {
      service.lifecycle('TestComponent', 'testEvent')

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[LIFECYCLE] TestComponent - testEvent',
        undefined
      )
    })

    it('should format API messages with method and URL', () => {
      service.api('POST', '/api/test')

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[API] POST /api/test',
        undefined
      )
    })
  })
})
