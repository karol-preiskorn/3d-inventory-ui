import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
// aggregation
import { DeviceList } from '../deviceList'
// entity objects
import { Device } from '../device'
import { DeviceTypes } from '../deviceTypes'
import { DeviceCategory } from '../deviceCategories'
// services
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

  ngOnInit(): void {
    this.getDevices()
  }

  addDevice() {
    const deviceTmp: Device = new Device()

    this.deviceList.push(deviceTmp)

    window.alert('The device has been shared!')
    this.logService.add('✔️ addDevice(' + deviceTmp.name + ')')
  }

  getDevices(): void {}

  share() {
    window.alert('The device has been shared!')
    this.logService.add('🐛 Share()')
  }

  getDeviceType() {
    return this.deviceTypes.get()
  }
}
