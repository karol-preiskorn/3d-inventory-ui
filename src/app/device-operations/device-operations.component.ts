import { Component } from '@angular/core'
import { LogService } from './../services/log.service'

import { Device } from '../shared/device'
import { DeviceCategories } from './../shared/deviceCategories'
import { DeviceTypes } from './../shared/deviceTypes'

@Component({
  selector: 'app-device-operations',
  templateUrl: './device-operations.component.html',
  styleUrls: ['./device-operations.component.scss'],
})
export class DeviceOperationsComponent {
  deviceList: Device[] = []
  deviceTypes: DeviceTypes = new DeviceTypes()
  deviceCategory = new DeviceCategories()

  // nameControl = new FormControl('')

  constructor(private logService: LogService) {
    console.log('🐛 1')
  }

  ngOnInit(): void {
    this.getDevices()
    this.logService.add({
      message: '🐛 Share()',
      category: 'Info',
      component: 'DeviceOperation.Share',
    })
    for (let index = 0; index < 10; index++) {
      const deviceTmp = new Device()
      this.deviceList.push(deviceTmp)
    }
  }

  addDevice(): void {
    const deviceTmp: Device = new Device()

    this.deviceList.push(deviceTmp)

    window.alert('The device has been shared!')
    this.logService.add({
      message: '✔️ addDevice(' + deviceTmp.name + ')',
      category: 'Info',
      component: 'DeviceOperation.addDevice',
    })
  }

  getDevices(): void {
    window.alert('Get devices')
    this.logService.add({
      message: '🐛 getDevices()',
      category: 'Info',
      component: 'DeviceOperation.getDevices()',
    })
  }

  share(): void {
    window.alert('The device has been shared!')
    this.logService.add({
      message: '🐛 Share()',
      category: 'Info',
      component: 'DeviceOperation.Share',
    })
  }

  getDeviceType(): any {
    return this.deviceTypes.get()
  }
}
