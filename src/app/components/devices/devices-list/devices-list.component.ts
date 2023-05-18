import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LogService } from 'src/app/services/log.service'
import { Device } from 'src/app/shared/device'
import { DevicesService } from 'src/app/services/devices.service'
@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit {
  DevicesList: any = []
  selectedDevice: Device
  component = 'Device'
  p2 = 1
  ngOnInit() {
    this.loadDevices()
  }
  constructor(
    public devicesService: DevicesService,
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
      this.router.navigate(['/devices-list/'])
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
        this.ngZone.run(() => this.router.navigateByUrl('/devices-list'))
      })
    this.loadDevices()
  }
  AddForm() {
    this.router.navigateByUrl('/add-device')
  }
  EditForm(device: Device) {
    this.selectedDevice = device
    this.router.navigate(['/edit-device/', device.id])
  }
}
