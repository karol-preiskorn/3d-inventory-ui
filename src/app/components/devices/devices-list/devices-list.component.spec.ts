/**
 * Test suite for DeviceListComponent
 * Tests device list functionality and component interactions
 */

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { DeviceListComponent } from './devices-list.component'
import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'

// Mock data generators
const createMockDevice = (id: string = 'device1'): Device => ({
  _id: id,
  name: `Test Device ${id}`,
  modelId: 'model1',
  attributes: [],
  position: { x: 0, y: 0, h: 0 }
})

const createMockModel = (id: string = 'model1'): Model => ({
  _id: id,
  name: `Test Model ${id}`,
  dimension: { width: 10, height: 10, depth: 10 },
  texture: { front: '', back: '', side: '', top: '', bottom: '' }
})

describe('DeviceListComponent', () => {
  let component: DeviceListComponent
  let fixture: ComponentFixture<DeviceListComponent>
  let deviceService: DeviceService
  let modelsService: ModelsService
  let router: Router

  beforeEach(async () => {
    const deviceServiceMock = {
      GetDevices: jest.fn(),
      DeleteDevice: jest.fn(),
      CloneDevice: jest.fn()
    }

    const logServiceMock = {
      CreateLog: jest.fn()
    }

    const modelsServiceMock = {
      GetModels: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [
        DeviceListComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'device-list', component: DeviceListComponent },
          { path: 'add-device', component: DeviceListComponent }
        ]),
        NoopAnimationsModule
      ],
      providers: [
        { provide: DeviceService, useValue: deviceServiceMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: ModelsService, useValue: modelsServiceMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceListComponent)
    component = fixture.componentInstance

    deviceService = TestBed.inject(DeviceService)
    modelsService = TestBed.inject(ModelsService)
    router = TestBed.inject(Router)
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with default values', () => {
    expect(component.deviceList).toEqual([])
    expect(component.modelList).toEqual([])
    expect(component.component).toBe('devices')
    expect(component.componentName).toBe('Devices')
    expect(component.deviceListPage).toBe(1)
  })

  it('should load devices and models on init', () => {
    const mockDevices = [createMockDevice('1'), createMockDevice('2')]
    const mockModels = [createMockModel('1'), createMockModel('2')]

    jest.spyOn(deviceService, 'GetDevices').mockReturnValue(of(mockDevices))
    jest.spyOn(modelsService, 'GetModels').mockReturnValue(of(mockModels))

    component.ngOnInit()

    expect(deviceService.GetDevices).toHaveBeenCalled()
    expect(modelsService.GetModels).toHaveBeenCalled()
  })

  it('should load devices successfully', () => {
    const mockDevices = [createMockDevice('1'), createMockDevice('2')]
    jest.spyOn(deviceService, 'GetDevices').mockReturnValue(of(mockDevices))

    component.loadDevices()

    expect(deviceService.GetDevices).toHaveBeenCalled()
    expect(component.deviceList).toEqual(mockDevices)
  })

  it('should handle device loading errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(deviceService, 'GetDevices').mockReturnValue(throwError(() => new Error('API Error')))

    component.loadDevices()

    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error loading devices:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('should load models successfully', () => {
    const mockModels = [createMockModel('1'), createMockModel('2')]
    jest.spyOn(modelsService, 'GetModels').mockReturnValue(of(mockModels))

    component.loadModels()

    expect(modelsService.GetModels).toHaveBeenCalled()
    expect(component.modelList).toEqual(mockModels)
  })

  it('should handle model loading errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(modelsService, 'GetModels').mockReturnValue(throwError(() => new Error('API Error')))

    component.loadModels()

    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error loading models:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('should navigate to add device form', async () => {
    const routerSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true)

    await component.AddForm()

    expect(routerSpy).toHaveBeenCalledWith('/add-device')
  })

  it('should find model name by ID', () => {
    const mockModels = [
      createMockModel('model1'),
      createMockModel('model2')
    ]
    component.modelList = mockModels

    const result = component.FindModelName('model1')

    expect(result).toBe('Test Model model1')
  })

  it('should return "Unknown" for non-existent model ID', () => {
    component.modelList = [createMockModel('model1')]

    const result = component.FindModelName('nonexistent')

    expect(result).toBe('Unknown')
  })

  it('should stringify objects correctly', () => {
    const testObj = { test: 'value', number: 123 }

    const result = component.stringify(testObj)

    expect(result).toBe(JSON.stringify(testObj, null, 2))
  })

  it('should return device list', () => {
    const mockDevices = [createMockDevice('1'), createMockDevice('2')]
    component.deviceList = mockDevices

    const result = component.getDeviceList()

    expect(result).toBe(mockDevices)
  })

  it('should perform manual reload', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(deviceService, 'GetDevices').mockReturnValue(of([]))
    jest.spyOn(modelsService, 'GetModels').mockReturnValue(of([]))

    component.manualReload()

    expect(consoleWarnSpy).toHaveBeenCalledWith('DeviceListComponent: Manual reload triggered')
    expect(deviceService.GetDevices).toHaveBeenCalled()
    expect(modelsService.GetModels).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should have Object available in template', () => {
    expect(component.Object).toBe(Object)
  })

  it('should initialize component metadata correctly', () => {
    expect(component.component).toBe('devices')
    expect(component.componentName).toBe('Devices')
  })
})
