/**
 * @fileoverview Edit Device Component Tests
 *
 * Comprehensive test suite for the EditDeviceComponent covering:
 * - Component initializat    await TestBed.configureTestingModule({
      imports: [
        DeviceEditComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        MockAttributeListComponent,
        MockLogComponent
      ],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: spies.deviceServiceSpy },
        { provide: ModelsService, useValue: spies.modelsSpy },
        { provide: LogService, useValue: spies.logSpy },
        { provide: AttributeService, useValue: spies.attributeSpy },
        { provide: Router, useValue: spies.routerSpyObj },
        { provide: ActivatedRoute, useValue: spies.activatedRouteSpyObj }
      ]
    })
    .overrideComponent(DeviceEditComponent, {
      set: {
        imports: [ReactiveFormsModule, CommonModule],
        template: `
          <div class="edit-device-form">
            <form [formGroup]="editDeviceForm" (ngSubmit)="submitForm()">
              <div class="form-group">
                <label for="name">Device Name</label>
                <input id="name" type="text" formControlName="name" class="form-control">
              </div>
              <div class="form-group">
                <label for="modelId">Model</label>
                <select id="modelId" formControlName="modelId" class="form-control">
                  <option value="">Select Model</option>
                </select>
              </div>
              <div formGroupName="position">
                <input type="number" formControlName="x" placeholder="X">
                <input type="number" formControlName="y" placeholder="Y">
                <input type="number" formControlName="h" placeholder="H">
              </div>
              <button type="submit" [disabled]="editDeviceForm.invalid">Update Device</button>
            </form>
          </div>
        `
      }
    })
    .compileComponents()ing
 * - Form validation and patching with existing device data
 * - Device update workflow with service integration
 * - Error handling for loading and updating devices
 * - Form validation and position coordinate validation
 * - Navigation and route parameter handling
 *
 * @author GitHub Copilot
 * @created 2024-12-30
 * @testing-framework Jest
 * @testing-approach Angular TestBed with MockServices
 */

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Component, Input } from '@angular/core'

import { of, throwError } from 'rxjs'

// Mock child components
@Component({
  selector: 'app-attribute-list',
  template: '<div>Mock Attribute List</div>',
  standalone: true
})
class MockAttributeListComponent {
  @Input() attributeComponent: string = ''
  @Input() attributeComponentObject: string = ''
}

@Component({
  selector: 'app-log',
  template: '<div>Mock Log Component</div>',
  standalone: true
})
class MockLogComponent {
  @Input() component: string = ''
}

import { DeviceEditComponent } from './edit-device.component'
import { DeviceService } from '../../../services/device.service'
import { ModelsService } from '../../../services/models.service'
import { LogService } from '../../../services/log.service'
import { AttributeService } from '../../../services/attribute.service'

import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'
import { LogIn } from '../../../services/log.service'

/**
 * Mock data generators for consistent testing
 */
function createMockDevice(id: string = 'device-1'): Device {
  return {
    _id: id,
    name: `Test Device ${id}`,
    modelId: 'model-1',
    position: { x: 5, y: 10, h: 3 },
    attributes: []
  }
}

function createMockModel(id: string = 'model-1'): Model {
  return {
    _id: id,
    name: `Test Model ${id}`,
    dimension: { width: 10, height: 5, depth: 8 },
    texture: { front: '', back: '', side: '', top: '', bottom: '' }
  }
}

function createMockLog(): LogIn {
  return {
    message: { action: 'Test log message' },
    operation: 'Update',
    component: 'devices',
    objectId: 'device-1'
  }
}

/**
 * Test setup and configuration
 */
function setupTestBed() {
    const deviceServiceSpy = {
    getDeviceSynchronize: jest.fn(),
    UpdateDevice: jest.fn(),
    CloneDevice: jest.fn(),
    GetDevices: jest.fn()
  }

  const modelsSpy = {
    GetModels: jest.fn().mockReturnValue(of([createMockModel()]))
  }

  const logSpy = {
    CreateLog: jest.fn().mockReturnValue(of(createMockLog()))
  }

  const attributeSpy = {
    GetAttributes: jest.fn().mockReturnValue(of([])),
    CreateAttribute: jest.fn(),
    UpdateAttribute: jest.fn(),
    DeleteAttribute: jest.fn()
  }

  const routerSpyObj = {
    navigate: jest.fn().mockResolvedValue(true)
  }

  const activatedRouteSpyObj = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('device-1')
      }
    }
  }

  return {
    deviceServiceSpy,
    modelsSpy,
    logSpy,
    attributeSpy,
    routerSpyObj,
    activatedRouteSpyObj
  }
}

describe('DeviceEditComponent', () => {
  let component: DeviceEditComponent
  let fixture: ComponentFixture<DeviceEditComponent>
  let deviceServiceSpy: jest.Mocked<DeviceService>
  let modelsServiceSpy: jest.Mocked<ModelsService>

  beforeEach(async () => {
    const spies = setupTestBed()

    await TestBed.configureTestingModule({
      imports: [
        DeviceEditComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        MockAttributeListComponent,
        MockLogComponent
      ],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: spies.deviceServiceSpy },
        { provide: ModelsService, useValue: spies.modelsSpy },
        { provide: LogService, useValue: spies.logSpy },
        { provide: AttributeService, useValue: spies.attributeSpy },
        { provide: Router, useValue: spies.routerSpyObj },
        { provide: ActivatedRoute, useValue: spies.activatedRouteSpyObj }
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceEditComponent)
    component = fixture.componentInstance
    deviceServiceSpy = TestBed.inject(DeviceService) as jest.Mocked<DeviceService>
    modelsServiceSpy = TestBed.inject(ModelsService) as jest.Mocked<ModelsService>

    jest.clearAllMocks()
  })

  it('should create component successfully', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form and load device data', () => {
    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))

    component.ngOnInit()
    fixture.detectChanges()

    expect(component.editDeviceForm).toBeDefined()
    expect(deviceServiceSpy.getDeviceSynchronize).toHaveBeenCalledWith('device-1')
    expect(modelsServiceSpy.GetModels).toHaveBeenCalled()
  })

  it('should patch form with loaded device data', () => {
    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))

    component.ngOnInit()
    fixture.detectChanges()

    expect(component.editDeviceForm.get('name')?.value).toBe(mockDevice.name)
    expect(component.editDeviceForm.get('modelId')?.value).toBe(mockDevice.modelId)
    expect(component.editDeviceForm.get('position.x')?.value).toBe(mockDevice.position.x)
    expect(component.editDeviceForm.get('position.y')?.value).toBe(mockDevice.position.y)
    expect(component.editDeviceForm.get('position.h')?.value).toBe(mockDevice.position.h)
  })
})

describe('DeviceEditComponent - Form Validation', () => {
  let component: DeviceEditComponent
  let fixture: ComponentFixture<DeviceEditComponent>
  let deviceServiceSpy: jest.Mocked<DeviceService>

  beforeEach(async () => {
    const spies = setupTestBed()

    await TestBed.configureTestingModule({
      imports: [DeviceEditComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: spies.deviceServiceSpy },
        { provide: ModelsService, useValue: spies.modelsSpy },
        { provide: LogService, useValue: spies.logSpy },
        { provide: Router, useValue: spies.routerSpyObj },
        { provide: ActivatedRoute, useValue: spies.activatedRouteSpyObj }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceEditComponent)
    component = fixture.componentInstance
    deviceServiceSpy = TestBed.inject(DeviceService) as jest.Mocked<DeviceService>

    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))
    component.ngOnInit()
    fixture.detectChanges()
    jest.clearAllMocks()
  })

  it('should require device name', () => {
    const nameControl = component.editDeviceForm.get('name')
    nameControl?.setValue('')
    nameControl?.markAsTouched()

    expect(nameControl?.hasError('required')).toBeTruthy()
    expect(component.editDeviceForm.valid).toBeFalsy()
  })

  it('should require minimum name length', () => {
    const nameControl = component.editDeviceForm.get('name')
    nameControl?.setValue('ab')
    nameControl?.markAsTouched()

    expect(nameControl?.hasError('minlength')).toBeTruthy()
  })

  it('should require modelId', () => {
    const modelControl = component.editDeviceForm.get('modelId')
    modelControl?.setValue('')
    modelControl?.markAsTouched()

    expect(modelControl?.hasError('required')).toBeTruthy()
  })

  it('should validate position coordinates within range', () => {
    const positionX = component.editDeviceForm.get('position.x')
    const positionY = component.editDeviceForm.get('position.y')
    const positionH = component.editDeviceForm.get('position.h')

    // Test valid coordinates
    positionX?.setValue(15)
    positionY?.setValue(-10)
    positionH?.setValue(0)

    expect(positionX?.valid).toBeTruthy()
    expect(positionY?.valid).toBeTruthy()
    expect(positionH?.valid).toBeTruthy()
  })

  it('should reject position coordinates outside range', () => {
    const positionX = component.editDeviceForm.get('position.x')

    positionX?.setValue(25) // Outside -20 to +20 range
    expect(positionX?.hasError('invalidNumber')).toBeTruthy()

    positionX?.setValue(-25) // Outside -20 to +20 range
    expect(positionX?.hasError('invalidNumber')).toBeTruthy()
  })
})

describe('DeviceEditComponent - Device Operations', () => {
  let component: DeviceEditComponent
  let fixture: ComponentFixture<DeviceEditComponent>
  let deviceServiceSpy: jest.Mocked<DeviceService>
  let modelsServiceSpy: jest.Mocked<ModelsService>
  let logServiceSpy: jest.Mocked<LogService>
  let routerSpy: jest.Mocked<Router>
  let activatedRouteSpy: jest.Mocked<ActivatedRoute>

  beforeEach(async () => {
    const spies = setupTestBed()

    await TestBed.configureTestingModule({
      imports: [DeviceEditComponent, ReactiveFormsModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: spies.deviceServiceSpy },
        { provide: ModelsService, useValue: spies.modelsSpy },
        { provide: LogService, useValue: spies.logSpy },
        { provide: AttributeService, useValue: spies.attributeSpy },
        { provide: Router, useValue: spies.routerSpyObj },
        { provide: ActivatedRoute, useValue: spies.activatedRouteSpyObj }
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceEditComponent)
    component = fixture.componentInstance
    deviceServiceSpy = TestBed.inject(DeviceService) as jest.Mocked<DeviceService>
    modelsServiceSpy = TestBed.inject(ModelsService) as jest.Mocked<ModelsService>
    logServiceSpy = TestBed.inject(LogService) as jest.Mocked<LogService>
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jest.Mocked<ActivatedRoute>

    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))
    component.ngOnInit()
    fixture.detectChanges()
    jest.clearAllMocks()
  })

  it('should update device successfully with valid form', async () => {
    const updatedDevice = createMockDevice()
    updatedDevice.name = 'Updated Device Name'
    deviceServiceSpy.UpdateDevice.mockReturnValue(of(updatedDevice))

    component.editDeviceForm.patchValue({
      name: 'Updated Device Name'
    })

    await component.submitForm()

    expect(deviceServiceSpy.UpdateDevice).toHaveBeenCalled()
    expect(logServiceSpy.CreateLog).toHaveBeenCalled()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['device-list'])
  })

  it('should not submit form when invalid', async () => {
    component.editDeviceForm.patchValue({
      name: '' // Invalid - required field
    })

    await component.submitForm()

    expect(deviceServiceSpy.UpdateDevice).not.toHaveBeenCalled()
    expect(routerSpy.navigate).not.toHaveBeenCalled()
  })

  it('should handle device update errors gracefully', async () => {
    const error = new Error('Device update failed')
    deviceServiceSpy.UpdateDevice.mockReturnValue(throwError(() => error))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    component.editDeviceForm.patchValue({
      name: 'Valid Device Name'
    })

    await component.submitForm()

    expect(consoleSpy).toHaveBeenCalledWith('Error updating device:', error)
    consoleSpy.mockRestore()
  })

  it('should handle device loading errors gracefully', () => {
    const error = new Error('Device not found')
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(throwError(() => error))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    component.ngOnInit()
    fixture.detectChanges()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should handle missing device ID', () => {
    activatedRouteSpy.snapshot.paramMap.get = jest.fn().mockReturnValue(null)

    component.ngOnInit()
    fixture.detectChanges()

    expect(deviceServiceSpy.getDeviceSynchronize).not.toHaveBeenCalled()
  })

  it('should navigate to device list after successful update', async () => {
    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))
    deviceServiceSpy.UpdateDevice.mockReturnValue(of(mockDevice))

    component.ngOnInit()
    fixture.detectChanges()

    await component.submitForm()

    expect(routerSpy.navigate).toHaveBeenCalledWith(['device-list'])
  })

  it('should navigate to device list via dedicated method', async () => {
    await component.navigateToDeviceList()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['device-list'])
  })

  it('should provide access to form controls via getters', () => {
    expect(component.name).toBe(component.editDeviceForm.get('name'))
    expect(component.modelId).toBe(component.editDeviceForm.get('modelId'))
    expect(component.position).toBe(component.editDeviceForm.get('position'))
    expect(component.x).toBe(component.editDeviceForm.get('position.x'))
    expect(component.y).toBe(component.editDeviceForm.get('position.y'))
    expect(component.h).toBe(component.editDeviceForm.get('position.h'))
  })

  it('should load models on initialization', () => {
    expect(modelsServiceSpy.GetModels).toHaveBeenCalled()
  })

  it('should handle models loading error', () => {
    const error = new Error('Failed to load models')
    modelsServiceSpy.GetModels.mockReturnValue(throwError(() => error))

    component.ngOnInit()
    fixture.detectChanges()

    // Component should still be functional even if models fail to load
    expect(component).toBeTruthy()
  })

  it('should handle log creation errors gracefully', async () => {
    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))
    deviceServiceSpy.UpdateDevice.mockReturnValue(of(mockDevice))

    const logError = new Error('Log creation failed')
    logServiceSpy.CreateLog.mockReturnValue(throwError(() => logError))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    component.ngOnInit()
    fixture.detectChanges()

    await component.submitForm()

    expect(consoleSpy).toHaveBeenCalledWith('Error creating log:', logError)
    consoleSpy.mockRestore()
  })
})
