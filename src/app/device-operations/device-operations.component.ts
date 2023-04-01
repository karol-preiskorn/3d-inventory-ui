import { DevicesService } from './../services/devices.service'
import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
// aggregation
import { DeviceList } from './../shared/deviceList'
// entity objects
import { Device } from '../shared/device'
import { DeviceTypes } from './../shared/deviceTypes'
import { DeviceCategories } from './../shared/deviceCategories'
// services
import { LogService } from '../services/log.service'
import { DefaultService } from 'projects/swagger-client/src/api/default.service'
import { APIS } from 'projects/swagger-client/src/api/api'
import { BASE_PATH } from 'swagger-client'

import { Observable } from 'rxjs'
import { ApiModule } from '../../../projects/swagger-client/src/api.module'

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
    this.logService.add('🐛 Generate devicesList')
    for (let index = 0; index < 10; index++) {
      const deviceTmp = new Device()
      this.deviceList.push(deviceTmp)
    }
  }

  addDevice(): void {
    const deviceTmp: Device = new Device()

    this.deviceList.push(deviceTmp)

    window.alert('The device has been shared!')
    this.logService.add('✔️ addDevice(' + deviceTmp.name + ')')
  }

  getDevices(): void {
    window.alert('Get devices')
  }

  share(): void {
    window.alert('The device has been shared!')
    this.logService.add('🐛 Share()')
  }

  getDeviceType(): any {
    return this.deviceTypes.get()
  }
}
