/*
 * Description: Form manage list of device
 * 2023-08-03  @karol-preiskorn   Init docs
 */

import { Device } from './device'

export class DeviceList {
  deviceList: Device[] = []

  print() {
    this.deviceList.forEach((element) => {
      console.log(element.toString())
    })
  }

  get(): Device[] {
    return this.deviceList
  }

  push(device: Device) {
    this.deviceList.push(device)
  }
}
