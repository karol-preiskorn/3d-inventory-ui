import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { Device } from 'src/app/shared/device'
import { DeviceService } from 'src/app/services/device.service'

@Component({
  selector: 'app-device-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  DevicesList: any = []
  selectedDevice: Device
  component = 'Device'
  deviceListPage = 1
  ngOnInit() {
    this.loadDevices()
  }
  constructor(
    public devicesService: DeviceService,
    private logService: LogService,
    private router: Router,
    private ngZone: NgZone
  ) {}
  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: any) => {
      this.DevicesList = data
    })
  }
  deleteDevice(id: string) {
    this.logService.CreateLog({
      message: id,
      object: id,
      operation: 'Delete',
      component: 'Device',
    })
    return this.devicesService.DeleteDevice(id).subscribe((data: any) => {
      console.log(data)
      this.loadDevices()
      this.router.navigate(['/device-list/'])
    })
  }
  CloneDevice(id: string) {
    const id_new: string = this.devicesService.CloneDevice(id)
    this.logService
      .CreateLog({
        message: id + ' -> ' + id_new,
        operation: 'Clone',
        component: 'Device',
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
    this.router.navigate(['edit-device/', device.id])
  }
}
