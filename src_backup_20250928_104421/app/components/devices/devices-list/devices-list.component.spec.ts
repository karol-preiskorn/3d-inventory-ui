import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { of, throwError } from 'rxjs';

import { DeviceListComponent } from './devices-list.component';
import { DeviceService } from '../../../services/device.service';
import { ModelsService } from '../../../services/models.service';
import { LogService } from '../../../services/log.service';
import { Device } from '../../../shared/device';
import { Model } from '../../../shared/model';

describe('DeviceListComponent', () => {
  let component: DeviceListComponent;
  let fixture: ComponentFixture<DeviceListComponent>;
  let deviceService: jasmine.SpyObj<DeviceService>;
  let modelsService: jasmine.SpyObj<ModelsService>;
  let logService: jasmine.SpyObj<LogService>;
  let router: jasmine.SpyObj<Router>;
  let compiled: HTMLElement;

  const mockDevices: Device[] = [
    {
      _id: '1',
      name: 'Test Device 1',
      modelId: 'model-a',
      position: { x: 1, y: 2, h: 3 },
      isDebugMode: false
    } as Device,
    {
      _id: '2',
      name: 'Test Device 2',
      modelId: 'model-b',
      position: { x: 4, y: 5, h: 6 },
      isDebugMode: false
    } as Device
  ];

  const mockModels: Model[] = [
    {
      _id: '1',
      name: 'Model A',
      dimension: { width: 1, height: 1, depth: 1 },
      texture: { front: 'f1.jpg', back: 'b1.jpg', side: 's1.jpg', top: 't1.jpg', bottom: 'bt1.jpg' }
    } as Model,
    {
      _id: '2',
      name: 'Model B',
      dimension: { width: 2, height: 2, depth: 2 },
      texture: { front: 'f2.jpg', back: 'b2.jpg', side: 's2.jpg', top: 't2.jpg', bottom: 'bt2.jpg' }
    } as Model
  ];

  beforeEach(async () => {
    const deviceServiceSpy = jasmine.createSpyObj('DeviceService', ['GetDevices', 'DeleteDevice']);
    const modelsServiceSpy = jasmine.createSpyObj('ModelsService', ['GetModels']);
    const logServiceSpy = jasmine.createSpyObj('LogService', ['CreateLog']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DeviceListComponent],
      providers: [
        { provide: DeviceService, useValue: deviceServiceSpy },
        { provide: ModelsService, useValue: modelsServiceSpy },
        { provide: LogService, useValue: logServiceSpy },
        { provide: Router, useValue: routerSpy },
        NgZone
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    deviceService = TestBed.inject(DeviceService) as jasmine.SpyObj<DeviceService>;
    modelsService = TestBed.inject(ModelsService) as jasmine.SpyObj<ModelsService>;
    logService = TestBed.inject(LogService) as jasmine.SpyObj<LogService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default service responses
    deviceService.GetDevices.and.returnValue(of(mockDevices));
    modelsService.GetModels.and.returnValue(of(mockModels));
    logService.CreateLog.and.returnValue(of({}));
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.deviceList).toEqual([]);
      expect(component.modelList).toEqual([]);
      expect(component.deviceListPage).toBe(1);
      expect(component.component).toBe('devices');
      expect(component.componentName).toBe('Devices');
    });

    it('should load devices and models on ngOnInit', () => {
      component.ngOnInit();

      expect(deviceService.GetDevices).toHaveBeenCalled();
      expect(modelsService.GetModels).toHaveBeenCalled();
      expect(component.deviceList).toEqual(mockDevices);
      expect(component.modelList).toEqual(mockModels);
    });
  });

  describe('Error Handling', () => {
    it('should handle device loading error gracefully', () => {
      deviceService.GetDevices.and.returnValue(throwError('Device loading failed'));
      spyOn(console, 'error');

      component.loadDevices();

      expect(console.error).toHaveBeenCalled();
      expect(component.deviceList).toEqual([]);
    });

    it('should handle models loading error gracefully', () => {
      modelsService.GetModels.and.returnValue(throwError('Models loading failed'));
      spyOn(console, 'error');

      component.loadModels();

      expect(console.error).toHaveBeenCalled();
      expect(component.modelList).toEqual([]);
    });

    it('should handle delete device error', async () => {
      const deviceId = '1';
      logService.CreateLog.and.returnValue(throwError('Log creation failed'));
      spyOn(console, 'error');

      await component.DeleteDevice(deviceId);

      expect(console.error).toHaveBeenCalledWith('Error creating log:', 'Log creation failed');
      expect(deviceService.DeleteDevice).not.toHaveBeenCalled();
    });
  });

  describe('Device Deletion', () => {
    it('should delete device successfully', async () => {
      const deviceId = '1';
      deviceService.DeleteDevice.and.returnValue(of({}));
      spyOn(console, 'log');

      await component.DeleteDevice(deviceId);

      expect(logService.CreateLog).toHaveBeenCalledWith({
        message: { id: deviceId },
        objectId: deviceId,
        operation: 'Delete',
        component: 'devices'
      });
      expect(deviceService.DeleteDevice).toHaveBeenCalledWith(deviceId);
      expect(console.log).toHaveBeenCalledWith(`${deviceId} deleted`);
    });

    it('should handle delete device service error', async () => {
      const deviceId = '1';
      deviceService.DeleteDevice.and.returnValue(throwError('Delete failed'));
      spyOn(console, 'error');

      await component.DeleteDevice(deviceId);

      expect(console.error).toHaveBeenCalledWith('Error deleting device:', 'Delete failed');
    });
  });

  describe('Pagination', () => {
    it('should reset page when device list changes and page is out of range', () => {
      component.deviceList = Array(3).fill(mockDevices[0]); // 3 items, max 1 page with pageSize 5
      component.deviceListPage = 5; // Out of range

      component.loadDevices();

      expect(component.deviceListPage).toBe(1);
    });

    it('should not reset page when current page is valid', () => {
      component.deviceList = Array(10).fill(mockDevices[0]); // 10 items, 2 pages
      component.deviceListPage = 2;

      component.loadDevices();

      expect(component.deviceListPage).toBe(2);
    });
  });

  describe('Change Detection', () => {
    it('should call markForCheck when loading devices', () => {
      spyOn((component as any).cdr, 'markForCheck');

      component.loadDevices();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });

    it('should call markForCheck when loading models', () => {
      spyOn((component as any).cdr, 'markForCheck');

      component.loadModels();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call loadDevices and loadModels on ngOnInit', () => {
      spyOn(component, 'loadDevices');
      spyOn(component, 'loadModels');

      component.ngOnInit();

      expect(component.loadDevices).toHaveBeenCalled();
      expect(component.loadModels).toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    it('should display loading state initially', () => {
      component.deviceList = [];
      fixture.detectChanges();

      // Check that the list is empty initially
      expect(compiled.querySelectorAll('.device-item').length).toBe(0);
    });

    it('should display devices when loaded', () => {
      component.deviceList = mockDevices;
      fixture.detectChanges();

      const deviceElements = compiled.querySelectorAll('.device-name, [data-testid="device-name"]');
      expect(deviceElements.length).toBeGreaterThan(0);
    });
  });
});
