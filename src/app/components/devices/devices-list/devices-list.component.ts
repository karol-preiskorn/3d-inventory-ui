import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'

import { DeviceService } from '../../../services/device.service'
import { LogService } from '../../../services/log.service'
import { ModelsService } from '../../../services/models.service'
import { Device } from '../../../shared/device'
import { Model } from '../../../shared/model'
import { LogComponent } from '../../log/log.component'
import { CommonModule } from '@angular/common'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-device-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, LogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent implements OnInit {
  deviceList: Device[] = []
  modelList: Model[] = []
  selectedDevice: Device
  component = 'devices'
  componentName = 'Devices'
  deviceListPage = 1

  // Make Object available in template
  Object = Object

  ngOnInit() {
    this.loadDevices()
    this.loadModels()
  }

  constructor(
    private readonly devicesService: DeviceService,
    private readonly modelsService: ModelsService,
    private readonly logService: LogService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  loadDevices() {
    return this.devicesService.GetDevices().subscribe({
      next: (data: Device[]) => {
        console.warn('✅ Loaded', data.length, 'devices from API');
        this.deviceList = data
        // Reset page if current page is out of range
        const maxPage = Math.ceil(this.deviceList.length / 5) || 1
        if (this.deviceListPage > maxPage) {
          this.deviceListPage = maxPage
        }
        // Trigger change detection since we're using OnPush strategy
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('❌ Error loading devices:', error);
      }
    })
  }

  loadModels() {
    return this.modelsService.GetModels().subscribe({
      next: (data: Model[]): void => {
        console.warn('✅ Loaded', data.length, 'models');
        this.modelList = data
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('❌ Error loading models:', error);
      }
    })
  }

  async DeleteDevice(id: string) {
    try {
      await firstValueFrom(
        this.logService.CreateLog({
          message: { id },
          objectId: id,
          operation: 'Delete',
          component: this.component,
        }),
      )
    } catch (logError) {
      console.error('Error creating log:', logError)
      // Optionally, return or show a notification to the user
      return
    }

    try {
      await firstValueFrom(this.devicesService.DeleteDevice(id))
      // Device deleted successfully
      this.loadDevices()
      this.loadModels()
      await this.router.navigate(['/device-list/'], { relativeTo: this.route, skipLocationChange: true })
    } catch (deleteError) {
      console.error('Error deleting device:', deleteError)
      // Optionally, show a notification to the user
    }
  }

  /**
   * Clones an existing device by its ID, logs the operation, and reloads the device list.
   * Navigates to the device list page after cloning.
   * @param id - The ID of the device to be cloned.
   */
  async CloneDevice(id: string) {
    const idNew = this.devicesService.CloneDevice(id) as Device
    // Device cloned successfully
    this.logService.CreateLog({
      message: { id: id, idNew: idNew },
      operation: 'Clone',
      component: this.component,
    })
    await new Promise<void>((resolve) => {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.url === '/device-list') {
          this.loadDevices()
          resolve()
        }
      })
      this.ngZone.run(() => this.router.navigateByUrl('device-list'))
    })
  }

  async AddForm() {
    await this.router.navigateByUrl('/add-device')
  }

  async EditForm(device: Device) {
    this.selectedDevice = device
    if (device._id !== undefined) {
      await this.router.navigate(['edit-device', device._id], { relativeTo: this.route.parent })
    } else {
      console.warn('[DeviceListComponent] Device route.id is undefined')
    }
  }

  FindModelName(id: string): string {
    let model = this.modelList.find((e: Model) => e._id === id)?.name as string
    model ??= 'Unknown'
    return model
  }

  stringify(obj: object): string {
    return JSON.stringify(obj, null, 2)
  }

  getDeviceList(): Device[] {
    return this.deviceList
  }

  // Manual reload method for debugging
  manualReload() {
    console.warn('DeviceListComponent: Manual reload triggered');
    this.loadDevices();
    this.loadModels();
  }
}
