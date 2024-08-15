import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DeviceService } from '../../../services/device.service';
import { LogService } from '../../../services/log.service';
import { ModelsService } from '../../../services/models.service';
import { Device } from '../../../shared/device';
import { Model } from '../../../shared/model';

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
      this.modelList = data
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

  CloneDevice(id: string) {
    const idNew: object = this.devicesService.CloneDevice({ id })
    console.info('Cloned device id: ' + id + ' to result CloneDevice id: ' + JSON.stringify(idNew))
    this.logService
      .CreateLog({
        message: { id: id, id_new: idNew },
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

  FindModelName(id: string): string {
    // console.info('[FindModelName] try find model name by id: ' + id)
    let model = this.modelList.find((e: Model) => e._id === id)?.name as string
    if (model === undefined) {
      model = 'Unknown'
    }
    return model
  }

  stringify(obj: object): string {
    return JSON.stringify(obj, null, 2)
  }

  getDeviceList(): Device[] {
    return this.deviceList
  }
}
