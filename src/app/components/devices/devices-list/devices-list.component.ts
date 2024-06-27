import { DeviceService } from 'src/app/services/device.service'
import { LogService } from 'src/app/services/log.service'
import { ModelsService } from 'src/app/services/models.service'
import { Device } from 'src/app/shared/device'
import { Model } from 'src/app/shared/model'

import { Component, NgZone, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-device-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  deviceList: Device[] = []
  modelList: Model[] = []
  selectedDevice: Device
  component = 'Devices'
  deviceListPage = 1

  ngOnInit() {
    this.loadDevices()
    this.loadModels()
  }

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute,
  ) {}

  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: Device[]) => {
      this.deviceList = data
    })
  }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data as Model[]
    })
  }

  DeleteDevice(id: string) {
    this.logService.CreateLog({
      message: { id: id },
      objectId: id,
      operation: 'Delete',
      component: this.component,
    })
    return this.devicesService.DeleteDevice(id).subscribe(() => {
      console.log(id + ' deleted')
      this.loadDevices()
      this.loadModels()
      this.router.navigate(['/device-list/'])
    })
  }

  CloneDevice(id: string | null) {
    const id_new: string = this.devicesService.CloneDevice(id)
    this.logService
      .CreateLog({
        message: { id: id, id_new: id_new },
        operation: 'Clone',
        component: this.component,
      })
      .subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl('device-list'))
      })
    this.loadDevices()
  }

  AddForm() {
    this.router.navigateByUrl('/add-device')
  }

  EditForm(device: Device) {
    this.selectedDevice = device
    if (device._id !== undefined) {
      this.router.navigate(['edit-device', device._id], { relativeTo: this.route.parent })
    } else {
      console.warn('[DeviceListComponent] Device route.id is undefined')
    }
  }

  findModelName(id: string): string {
    return this.modelList.find((e: Model) => e.id === id)?.name as string
  }

  stringify(obj: object): string {
    return JSON.stringify(obj, null, 2)
  }
}
