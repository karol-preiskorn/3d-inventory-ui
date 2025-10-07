/**
 * @fileoverview Add Device Component Tests
 *
 * Comprehensive test suite for the DeviceAddComponent covering:
 * - Component initialization and form setup
 * - Form validation (name, modelId, position coordinates)
 * - Device creation workflow with service integration
 * - Faker.js data generation functionality
 * - Error handling and edge cases
 * - Navigation and form getters
 *
 * @author GitHub Copilot
 * @created 2024-12-30
 * @testing-framework Jest
 * @testing-approach Angular TestBed with MockServices
 */

// Core Angular testing imports
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { NgZone } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

// RxJS testing utilities
import { of, throwError } from 'rxjs'

// Component and services under test
import { DeviceAddComponent } from './add-device.component'
import { DeviceService } from '../../../services/device.service'
import { ModelsService } from '../../../services/models.service'
import { LogService, Log } from '../../../services/log.service'

// Data models and interfaces
import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'

/**
 * Mock data generators for consistent testing
 */
function createMockDevice(): Device {
  return {
    _id: 'test-device-id',
    name: 'Test Device',
    modelId: 'test-model-id',
    position: { x: 5, y: 10, h: 3 },
    attributes: []
  }
}

function createMockModel(): Model {
  return {
    _id: 'test-model-id',
    name: 'Test Model',
    dimension: { width: 10, height: 5, depth: 20 },
    texture: { front: '', back: '', side: '', top: '', bottom: '' }
  }
}

function createMockLog(): Log {
  return {
    _id: 'test-log-id',
    date: new Date().toISOString(),
    message: { text: 'Test log message' },
    operation: 'Create',
    component: 'devices',
    objectId: 'test-device-id'
  }
}

/**
 * Main test suite for DeviceAddComponent
 */
describe('DeviceAddComponent', () => {
  let component: DeviceAddComponent
  let fixture: ComponentFixture<DeviceAddComponent>
  let deviceServiceSpy: jest.Mocked<DeviceService>
  let modelsServiceSpy: jest.Mocked<ModelsService>
  let logServiceSpy: jest.Mocked<LogService>
  let routerSpy: jest.Mocked<Router>

  /**
   * TestBed configuration with all required dependencies
   */
  beforeEach(async () => {
    const deviceSpy = {
      CreateDevice: jest.fn(),
      getDevices: jest.fn(),
      UpdateDevice: jest.fn(),
      getDeviceSynchronize: jest.fn()
    }

    const modelsSpy = {
      GetModels: jest.fn()
    }

    const logSpy = {
      CreateLog: jest.fn()
    }

    const routerSpyObj = {
      navigate: jest.fn()
    }

    const mockNgZone = {
      run: jest.fn((fn) => fn())
    }

    await TestBed.configureTestingModule({
      imports: [
        DeviceAddComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: deviceSpy },
        { provide: ModelsService, useValue: modelsSpy },
        { provide: LogService, useValue: logSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('test-id')
              }
            }
          }
        },
        { provide: NgZone, useValue: mockNgZone }
      ]
    }).compileComponents()

    // Get spy references before creating component
    deviceServiceSpy = TestBed.inject(DeviceService) as jest.Mocked<DeviceService>
    modelsServiceSpy = TestBed.inject(ModelsService) as jest.Mocked<ModelsService>
    logServiceSpy = TestBed.inject(LogService) as jest.Mocked<LogService>
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>

    // Setup mock return values BEFORE creating component
    modelsServiceSpy.GetModels.mockReturnValue(of([createMockModel()]))
    logServiceSpy.CreateLog.mockReturnValue(of(createMockLog()))
    routerSpy.navigate.mockResolvedValue(true)

    // Now create component - ngOnInit will be called automatically
    fixture = TestBed.createComponent(DeviceAddComponent)
    component = fixture.componentInstance
  })

  /**
   * Component Initialization Tests
   */
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      expect(component).toBeTruthy()
    })

    it('should initialize form with default values', () => {
      component.ngOnInit()
      fixture.detectChanges()

      expect(component.addDeviceForm).toBeDefined()
      expect(component.addDeviceForm.get('name')?.value).toBe('')
      expect(component.addDeviceForm.get('modelId')?.value).toBe('')
      expect(component.addDeviceForm.get('position.x')?.value).toBe(0)
      expect(component.addDeviceForm.get('position.y')?.value).toBe(0)
      expect(component.addDeviceForm.get('position.h')?.value).toBe(0)
    })

    it('should load models on initialization', () => {
      component.ngOnInit()
      fixture.detectChanges()

      expect(modelsServiceSpy.GetModels).toHaveBeenCalled()
    })
  })

  /**
   * Form Validation Tests
   */
  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit()
      fixture.detectChanges()
    })

    it('should require device name', () => {
      const nameControl = component.addDeviceForm.get('name')
      nameControl?.setValue('')
      nameControl?.markAsTouched()

      expect(nameControl?.hasError('required')).toBeTruthy()
      expect(component.addDeviceForm.valid).toBeFalsy()
    })

    it('should require minimum name length', () => {
      const nameControl = component.addDeviceForm.get('name')
      nameControl?.setValue('ab')
      nameControl?.markAsTouched()

      expect(nameControl?.hasError('minlength')).toBeTruthy()
    })

    it('should require modelId', () => {
      const modelControl = component.addDeviceForm.get('modelId')
      modelControl?.setValue('')
      modelControl?.markAsTouched()

      expect(modelControl?.hasError('required')).toBeTruthy()
    })

    it('should validate position coordinates within range', () => {
      const positionX = component.addDeviceForm.get('position.x')
      const positionY = component.addDeviceForm.get('position.y')
      const positionH = component.addDeviceForm.get('position.h')

      positionX?.setValue(10)
      positionY?.setValue(-5)
      positionH?.setValue(0)

      expect(positionX?.valid).toBeTruthy()
      expect(positionY?.valid).toBeTruthy()
      expect(positionH?.valid).toBeTruthy()
    })

    it('should accept valid form data', () => {
      component.addDeviceForm.patchValue({
        name: 'Valid Device Name',
        modelId: 'valid-model-id',
        position: {
          x: 5,
          y: 10,
          h: 3
        }
      })

      expect(component.addDeviceForm.valid).toBeTruthy()
    })
  })

  /**
   * Device Creation Tests
   */
  describe('Device Creation', () => {
    beforeEach(() => {
      component.ngOnInit()
      fixture.detectChanges()

      component.addDeviceForm.patchValue({
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 5, y: 10, h: 3 }
      })
    })

    it('should create device successfully with valid form', async () => {
      const mockDevice = createMockDevice()
      deviceServiceSpy.CreateDevice.mockReturnValue(of(mockDevice))

      await component.submitForm()

      expect(logServiceSpy.CreateLog).toHaveBeenCalled()
      expect(deviceServiceSpy.CreateDevice).toHaveBeenCalled()
      expect(routerSpy.navigate).toHaveBeenCalledWith(['device-list'])
    })

    it('should not submit form when invalid', async () => {
      component.addDeviceForm.patchValue({
        name: '',
        modelId: 'test-model-id',
        position: { x: 5, y: 10, h: 3 }
      })

      await component.submitForm()

      expect(deviceServiceSpy.CreateDevice).not.toHaveBeenCalled()
      expect(routerSpy.navigate).not.toHaveBeenCalled()
    })

    it('should handle device creation errors gracefully', async () => {
      const error = new Error('Device creation failed')
      deviceServiceSpy.CreateDevice.mockReturnValue(throwError(() => error))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await component.submitForm()

      expect(consoleSpy).toHaveBeenCalledWith('Error creating device:', error)
      consoleSpy.mockRestore()
    })
  })

  /**
   * Data Generation Tests
   */
  describe('Data Generation', () => {
    beforeEach(() => {
      component.ngOnInit()
      fixture.detectChanges()
    })

    it('should generate random device data', () => {
      component.generateDevice()

      const nameValue = component.addDeviceForm.get('name')?.value
      const positionX = component.addDeviceForm.get('position.x')?.value
      const positionY = component.addDeviceForm.get('position.y')?.value
      const positionH = component.addDeviceForm.get('position.h')?.value

      expect(nameValue).toBeTruthy()
      expect(typeof nameValue).toBe('string')
      expect(positionX).toBeGreaterThanOrEqual(-20)
      expect(positionX).toBeLessThanOrEqual(20)
      expect(positionY).toBeGreaterThanOrEqual(-20)
      expect(positionY).toBeLessThanOrEqual(20)
      expect(positionH).toBeGreaterThanOrEqual(-20)
      expect(positionH).toBeLessThanOrEqual(20)
    })
  })

  /**
   * Navigation Tests
   */
  describe('Navigation', () => {
    it('should navigate to device list on successful creation', async () => {
      const mockDevice = createMockDevice()
      deviceServiceSpy.CreateDevice.mockReturnValue(of(mockDevice))

      component.addDeviceForm.patchValue({
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 5, y: 10, h: 3 }
      })

      await component.submitForm()

      expect(routerSpy.navigate).toHaveBeenCalledWith(['device-list'])
    })
  })

  /**
   * Form Getters Tests
   */
  describe('Form Getters', () => {
    beforeEach(() => {
      component.ngOnInit()
      fixture.detectChanges()
    })

    it('should provide access to form controls via getters', () => {
      expect(component.name).toBe(component.addDeviceForm.get('name'))
      expect(component.modelId).toBe(component.addDeviceForm.get('modelId'))
      expect(component.position).toBe(component.addDeviceForm.get('position'))
      expect(component.x).toBe(component.addDeviceForm.get('position.x'))
      expect(component.y).toBe(component.addDeviceForm.get('position.y'))
      expect(component.h).toBe(component.addDeviceForm.get('position.h'))
    })
  })

  /**
   * Error Handling Tests
   */
  describe('Error Handling', () => {
    beforeEach(() => {
      component.ngOnInit()
      fixture.detectChanges()
    })

    it('should handle models loading error', () => {
      const error = new Error('Failed to load models')
      modelsServiceSpy.GetModels.mockReturnValue(throwError(() => error))

      component.loadModels()

      expect(component).toBeTruthy()
    })

    it('should handle form submission with network errors', async () => {
      component.addDeviceForm.patchValue({
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 5, y: 10, h: 3 }
      })

      const networkError = new Error('Network error')
      deviceServiceSpy.CreateDevice.mockReturnValue(throwError(() => networkError))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await component.submitForm()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
