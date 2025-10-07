/**
 * Test suite for AppComponent
 * Tests the main application component functionality including authentication,
 * navigation, theme switching, and keyboard interactions.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component } from '@angular/core'

import { AppComponent } from './app.component'
import { AuthenticationService } from './services/authentication.service'

// Mock component for routing tests
@Component({ template: '' })
class MockComponent { }

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let authService: jest.Mocked<AuthenticationService>
  let router: Router

  const mockAuthService = {
    isAuthenticated: jest.fn(),
    logout: jest.fn()
  }

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  }

  beforeEach(async () => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })

    // Reset mocks
    jest.clearAllMocks()
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: MockComponent },
          { path: 'home', component: MockComponent },
          { path: 'login', component: MockComponent },
          { path: 'admin/users', component: MockComponent }
        ])
      ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>
    router = TestBed.inject(Router)

    // Mock router navigate method
    jest.spyOn(router, 'navigate').mockResolvedValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Initialization', () => {
    it('should create the app component', () => {
      expect(component).toBeTruthy()
    })

    it('should initialize with light theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('light')

      component.ngOnInit()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
      expect(component.myTheme).toBe('light')
    })

    it('should default to light theme when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null)

      component.ngOnInit()

      expect(component.myTheme).toBe('light')
    })

    it('should initialize with dark theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark')

      component.ngOnInit()

      expect(component.myTheme).toBe('dark')
    })
  })

  describe('Authentication Methods', () => {
    it('should return true when user is authenticated', () => {
      authService.isAuthenticated.mockReturnValue(true)

      const result = component.isAuthenticated()

      expect(result).toBe(true)
      expect(authService.isAuthenticated).toHaveBeenCalled()
    })

    it('should return false when user is not authenticated', () => {
      authService.isAuthenticated.mockReturnValue(false)

      const result = component.isAuthenticated()

      expect(result).toBe(false)
      expect(authService.isAuthenticated).toHaveBeenCalled()
    })

    it('should logout user and navigate to home', () => {
      component.logout()

      expect(authService.logout).toHaveBeenCalled()
      expect(router.navigate).toHaveBeenCalledWith(['/'])
    })
  })

  describe('Navigation Methods', () => {
    it('should navigate to login page', () => {
      component.goToLogin()

      expect(router.navigate).toHaveBeenCalledWith(['/login'])
    })

    it('should navigate to admin users page', () => {
      component.goToAdminUsers()

      expect(router.navigate).toHaveBeenCalledWith(['/admin/users'])
    })
  })

  describe('Theme Management', () => {
    it('should switch from light to dark theme', () => {
      component.myTheme = 'light'

      component.themeSwitch()

      expect(component.myTheme).toBe('dark')
    })

    it('should switch from dark to light theme', () => {
      component.myTheme = 'dark'

      component.themeSwitch()

      expect(component.myTheme).toBe('light')
    })

    it('should change theme on body element', () => {
      const setAttributeSpy = jest.spyOn(document.body, 'setAttribute')

      component.changeTheme('dark')

      expect(setAttributeSpy).toHaveBeenCalledWith('data-bs-theme', 'dark')
    })

    it('should change theme to light on body element', () => {
      const setAttributeSpy = jest.spyOn(document.body, 'setAttribute')

      component.changeTheme('light')

      expect(setAttributeSpy).toHaveBeenCalledWith('data-bs-theme', 'light')
    })
  })

  describe('Utility Methods', () => {
    it('should return current year', () => {
      const currentYear = new Date().getFullYear()

      const result = component.currentYearLong()

      expect(result).toBe(currentYear)
    })

    it('should open link in new window', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()

      component.openLink('https://example.com')

      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank')
    })

    it('should open window with specified URL', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()

      component.openWindow('https://test.com')

      expect(windowSpy).toHaveBeenCalledWith('https://test.com', '_blank')
    })
  })

  describe('Keyboard Event Handling', () => {
    it('should handle key down events', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })

      // This method currently doesn't do anything, but we test it exists
      expect(() => component.handleKeyDown(event)).not.toThrow()
    })

    it('should open link on Enter key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      component.handleKeydown(event, 'https://example.com')

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank')
    })

    it('should open link on Space key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: ' ' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      component.handleKeydown(event, 'https://example.com')

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank')
    })

    it('should not open link on other key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: 'Tab' })

      component.handleKeydown(event, 'https://example.com')

      expect(windowSpy).not.toHaveBeenCalled()
    })

    it('should open Facebook link on Enter key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      component.openFacebookLink(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(windowSpy).toHaveBeenCalledWith('https://www.facebook.com/ultimasolution', '_blank')
    })

    it('should open Facebook link on Space key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: ' ' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      component.openFacebookLink(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(windowSpy).toHaveBeenCalledWith('https://www.facebook.com/ultimasolution', '_blank')
    })

    it('should not open Facebook link on other key press', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation()
      const event = new KeyboardEvent('keydown', { key: 'Tab' })

      component.openFacebookLink(event)

      expect(windowSpy).not.toHaveBeenCalled()
    })
  })
})
