import { DevicesService } from './../../devices.service'
import { Component, OnInit } from '@angular/core'
import { Device } from 'src/app/device'

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit {
  DevicesList: any = []

  ngOnInit() {
    this.loadDevices()
  }

  constructor(public devicesService: DevicesService) {}

  loadDevices() {
    return this.devicesService.DeviceGet().subscribe((data: any) => {
      this.DevicesList = data
    })
  }

  // Delete issue
  deleteDevice(data: { id: any }) {
    const index: any = this.DevicesList.map((x: any) => {
      return x.id
    }).indexOf(data.id)
    return this.devicesService.DeleteBug({ id: data.id }).subscribe((res) => {
      this.DevicesList.splice(index, 1)
      console.log('Device deleted!')
    })
  }
}
