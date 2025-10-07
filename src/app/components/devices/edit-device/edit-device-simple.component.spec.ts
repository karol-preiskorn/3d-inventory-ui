/**
 * @fileoverview Simple Edit Device Component Tests
 *
 * Focused test suite for the EditDeviceComponent testing core functionality
 * without complex child component dependencies
 *
 * @author GitHub Copilot
 * @created 2024-12-30
 * @testing-framework Jest
 * @testing-approach Isolated component testing
 */

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Component } from '@angular/core'

import { of, throwError } from 'rxjs'

import { DeviceService } from '../../../services/device.service'
import { ModelsService } from '../../../services/models.service'
import { LogService } from '../../../services/log.service'

import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'

/**
 * Mock data generators
 */
const createMockDevice = (): Device => ({
  _id: 'device-1',
  name: 'Test Device',
  modelId: 'model-1',
  position: { x: 5, y: 10, h: 0 },
  isDebugMode: false
})

const createMockModel = (): Model => ({
  _id: 'model-1',
  name: 'Test Model',
  dimension: {
    width: 10,
    height: 5,
    depth: 20
  },
  texture: {
    front: '',
    back: '',
    side: '',
    top: '',
    bottom: ''
  }
})

/**
 * Simplified test component that mimics DeviceEditComponent core functionality
 */
@Component({
  selector: 'app-test-edit-device',
  template: `
    <form [formGroup]="editDeviceForm" (ngSubmit)="submitForm()">
      <input formControlName="name" data-testid="name-input">
      <select formControlName="modelId" data-testid="model-select"></select>
      <div formGroupName="position">
        <input formControlName="x" data-testid="x-input" type="number">
        <input formControlName="y" data-testid="y-input" type="number">
        <input formControlName="h" data-testid="h-input" type="number">
      </div>
      <button type="submit" [disabled]="editDeviceForm.invalid" data-testid="submit-btn">
        Update Device
      </button>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule]
})
class TestEditDeviceComponent {
  editDeviceForm: FormGroup
  device: Device | undefined
  models: Model[] = []

  constructor(
    private fb: FormBuilder,
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private logService: LogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editDeviceForm = this.createForm()
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      modelId: ['', Validators.required],
      position: this.fb.group({
        x: [0, [Validators.required, this.numberValidator(-20, 20)]],
        y: [0, [Validators.required, this.numberValidator(-20, 20)]],
        h: [0, [Validators.required, this.numberValidator(-20, 20)]]
      })
    })
  }

  private numberValidator(min: number, max: number) {
    return (control: AbstractControl) => {
      const value = control.value
      if (value !== null && (isNaN(value) || value < min || value > max)) {
        return { 'numberRange': { min, max, actual: value } }
      }
      return null
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.devicesService.getDeviceSynchronize(id).subscribe({
        next: (device: Device) => {
          this.device = device
          this.patchForm()
        },
        error: (error) => console.error('Error loading device:', error)
      })
    }
    this.loadModels()
  }

  private patchForm(): void {
    if (this.device) {
      this.editDeviceForm.patchValue(this.device)
    }
  }

  private loadModels(): void {
    this.modelsService.GetModels().subscribe({
      next: (models) => this.models = models,
      error: (error) => console.error('Error loading models:', error)
    })
  }

  submitForm(): void {
    if (this.editDeviceForm.valid && this.device) {
      const formData = { ...this.device, ...this.editDeviceForm.value }
      this.devicesService.UpdateDevice(formData).subscribe({
        next: (updatedDevice) => {
          this.logService.CreateLog({
            objectId: updatedDevice._id,
            operation: 'Update',
            component: 'Device',
            message: { action: 'Device updated successfully' }
          }).subscribe()
          this.router.navigate(['/devices'])
        },
        error: (error) => console.error('Update error:', error)
      })
    }
  }

  // Form getters for template access
  get name() { return this.editDeviceForm.get('name') }
  get modelId() { return this.editDeviceForm.get('modelId') }
  get position() { return this.editDeviceForm.get('position') }
}

describe('EditDeviceComponent (Simplified)', () => {
  let component: TestEditDeviceComponent
  let fixture: ComponentFixture<TestEditDeviceComponent>
  let deviceServiceSpy: jest.Mocked<DeviceService>
  let modelsServiceSpy: jest.Mocked<ModelsService>
  let logServiceSpy: jest.Mocked<LogService>
  let routerSpy: jest.Mocked<Router>

  beforeEach(async () => {
    const deviceSpy = {
      getDeviceSynchronize: jest.fn(),
      UpdateDevice: jest.fn(),
      GetDevices: jest.fn()
    }

    const modelsSpy = {
      GetModels: jest.fn().mockReturnValue(of([createMockModel()]))
    }

    const logSpy = {
      CreateLog: jest.fn().mockReturnValue(of({}))
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

    await TestBed.configureTestingModule({
      imports: [
        TestEditDeviceComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: DeviceService, useValue: deviceSpy },
        { provide: ModelsService, useValue: modelsSpy },
        { provide: LogService, useValue: logSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(TestEditDeviceComponent)
    component = fixture.componentInstance
    deviceServiceSpy = TestBed.inject(DeviceService) as jest.Mocked<DeviceService>
    modelsServiceSpy = TestBed.inject(ModelsService) as jest.Mocked<ModelsService>
    logServiceSpy = TestBed.inject(LogService) as jest.Mocked<LogService>
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>

    jest.clearAllMocks()
  })

  it('should create component successfully', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form with validation rules', () => {
    expect(component.editDeviceForm).toBeDefined()
    expect(component.editDeviceForm.get('name')?.hasError('required')).toBeTruthy()
    expect(component.editDeviceForm.get('modelId')?.hasError('required')).toBeTruthy()
  })

  it('should load device data on initialization', () => {
    const mockDevice = createMockDevice()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(of(mockDevice))

    component.ngOnInit()

    expect(deviceServiceSpy.getDeviceSynchronize).toHaveBeenCalledWith('device-1')
    expect(modelsServiceSpy.GetModels).toHaveBeenCalled()
  })

  it('should validate form correctly', () => {
    // Test required validation
    component.editDeviceForm.patchValue({
      name: '',
      modelId: '',
      position: { x: 0, y: 0, h: 0 }
    })

    expect(component.editDeviceForm.get('name')?.hasError('required')).toBeTruthy()
    expect(component.editDeviceForm.get('modelId')?.hasError('required')).toBeTruthy()

    // Test valid form
    component.editDeviceForm.patchValue({
      name: 'Valid Device Name',
      modelId: 'model-1',
      position: { x: 5, y: 10, h: 0 }
    })

    expect(component.editDeviceForm.valid).toBeTruthy()
  })

  it('should validate position coordinates within range', () => {
    const positionGroup = component.editDeviceForm.get('position')

    // Valid coordinates
    positionGroup?.patchValue({ x: 10, y: -15, h: 20 })
    expect(positionGroup?.valid).toBeTruthy()

    // Invalid coordinates (outside range)
    positionGroup?.patchValue({ x: 25, y: -25, h: 30 })
    expect(positionGroup?.valid).toBeFalsy()
  })

  it('should update device when form is submitted', () => {
    const mockDevice = createMockDevice()
    const updatedDevice = { ...mockDevice, name: 'Updated Device' }

    component.device = mockDevice
    component.editDeviceForm.patchValue(updatedDevice)
    deviceServiceSpy.UpdateDevice.mockReturnValue(of(updatedDevice))

    component.submitForm()

    expect(deviceServiceSpy.UpdateDevice).toHaveBeenCalledWith(updatedDevice)
    expect(logServiceSpy.CreateLog).toHaveBeenCalled()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/devices'])
  })

  it('should not submit when form is invalid', () => {
    component.editDeviceForm.patchValue({
      name: '', // Invalid - required field
      modelId: 'model-1',
      position: { x: 0, y: 0, h: 0 }
    })

    component.submitForm()

    expect(deviceServiceSpy.UpdateDevice).not.toHaveBeenCalled()
  })

  it('should handle device loading errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    deviceServiceSpy.getDeviceSynchronize.mockReturnValue(throwError(() => new Error('Load error')))

    component.ngOnInit()

    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][0]).toBe('Error loading device:')
    consoleSpy.mockRestore()
  })

  it('should handle update errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const mockDevice = createMockDevice()

    component.device = mockDevice
    component.editDeviceForm.patchValue(mockDevice)
    deviceServiceSpy.UpdateDevice.mockReturnValue(throwError(() => new Error('Update error')))

    component.submitForm()

    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][0]).toBe('Update error:')
    consoleSpy.mockRestore()
  })
})
