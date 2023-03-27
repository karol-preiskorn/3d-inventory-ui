import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Device } from '../device'
import { DeviceList } from '../deviceList'
import { DeviceTypes } from '../deviceTypes'
import { DeviceCategory } from '../deviceCategories'

import { LogService } from '../log.service'

@Component({
  selector: 'app-device-operations',
  templateUrl: './device-operations.component.html',
  styleUrls: ['./device-operations.component.scss'],
})
export class DeviceOperationsComponent {
  deviceList: Device[] = []
  deviceTypes: DeviceTypes = new DeviceTypes()
  deviceCategory = new DeviceCategory()

  nameControl = new FormControl('')

  constructor(private logService: LogService) {
    console.log('🐛 Generate devicesList')
    this.logService.add('🐛 Generate devicesList')
    for (let index = 0; index < 10; index++) {
      const deviceTmp = new Device()
      this.deviceList.push(deviceTmp)
    }
  }

  addDevice() {
    const deviceTmp = new Device()
    deviceTmp.id = this.deviceList.push(deviceTmp)

    window.alert('The device has been shared!')
    this.logService.add('🐛 addDevice()')
  }

  share() {
    window.alert('The device has been shared!')
    this.logService.add('🐛 Share()')
  }

  getDeviceType() {
    return this.deviceTypes.get()
  }
}
