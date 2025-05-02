import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
})
export class DeviceListComponent implements OnInit {
  deviceList: Device[] = []
  modelList: Model[] = []
  selectedDevice: Device
  component = 'Device'
  deviceListPage = 1

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
  ) {}

  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: Device[]) => {
      this.deviceList = data
    })
  }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
    })
  }

  DeleteDevice(id: string) {
    this.logService
      .CreateLog({
        message: { id: id },
        objectId: id,
        operation: 'Delete',
        component: this.component,
      })
      .subscribe({
        next: () => {
          this.devicesService.DeleteDevice(id).subscribe({
            next: () => {
              console.log(id + ' deleted')
              this.loadDevices()
              this.loadModels()
              void this.router.navigate(['/device-list/'], { relativeTo: this.route, skipLocationChange: true })
            },
            error: (err) => {
              console.error('Error deleting device:', err)
            },
          })
        },
        error: (err) => {
          console.error('Error creating log:', err)
        },
      })
  }

  async CloneDevice(id: string) {
    const idNew: object = this.devicesService.CloneDevice(id)
    console.info('Cloned device id: ' + id + ' to result CloneDevice id: ' + JSON.stringify(idNew))
    await this.logService
      .CreateLog({
        message: { id: id, id_new: idNew },
        operation: 'Clone',
        component: this.component,
      })
      .toPromise()
    await this.ngZone.run(() => this.router.navigateByUrl('device-list'))
    this.loadDevices()
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
    // console.info('[FindModelName] try find model name by id: ' + id)
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
}
