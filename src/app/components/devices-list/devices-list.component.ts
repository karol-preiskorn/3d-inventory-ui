import { Component, NgZone, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LogService } from '../../services/log.service'
import { Device } from '../../shared/device'
import { DevicesService } from './../../services/devices.service'

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit {
  DevicesList: any = []
  selectedDevice: Device

  ngOnInit() {
    this.loadDevices()
  }

  constructor(
    public devicesService: DevicesService,
    private logService: LogService,
    private router: Router
  ) {}

  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: any) => {
      this.DevicesList = data
    })
  }

  deleteDevice(id: string) {
    this.logService.CreateLog({
      message: 'Delete device: ' + id,
      category: 'Info',
      component: 'DevicesListComponent',
    })
    return this.devicesService.DeleteDevice(id).subscribe((data: any) => {
      // console.log(data)
      this.router.navigate(['/devices-list/'])
    })
  }

  AddForm() {
    this.router.navigateByUrl('/add-device')
  }

  EditForm(device: Device) {
    this.selectedDevice = device
    this.router.navigate(['/edit-device/', device.id])
    // this.ngZone.run(() => this.router.navigateByUrl(`edit-device/${id}`))
  }
}
